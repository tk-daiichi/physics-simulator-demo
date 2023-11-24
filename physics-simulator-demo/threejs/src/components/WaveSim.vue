<template>
    <div ref="container" class="container"></div>
    <div id="info">control panel</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const container = ref<HTMLElement>();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight,
    0.1, 1000
);
camera.position.set(7, 6, 6);
camera.lookAt(4, 0, 0);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
const origin = new THREE.Vector3(0,0,0);
const gui = new GUI({
    container: container.value, width:320
});
const props = {
    time: 0.01,
}
gui.add(props, "time", 0, 5, 0.01)

onMounted(() => {
    init();
});

function init(){
    scene.add(camera);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.value?.appendChild(renderer.domElement);

    scene.background = new THREE.Color(0x222255);
    const gridSize = 5
    const grid = new THREE.GridHelper(gridSize, 20);
    grid.position.set(gridSize/2, 0, gridSize/2);
    scene.add(grid);

    const axisX = createAxis(1,0,0)
    const axisY = createAxis(0,1,0)
    const axisZ = createAxis(0,0,1)
    scene.add(axisX, axisY, axisZ)

    const graph = graphDrawer();
    scene.add(graph);
    moveGraph(graph);

    for(let z = 0; z <= 5; z += 0.25){
        const trace = graphTrace(z);
        trace.forEach((el) => {
            scene.add(el);
        });
    };

    scene.add(ambientLight);
};
function animate(callback? : () => void){
    const frame = (() => {
        controls.update();
        if(callback){
            callback();
        }
        requestAnimationFrame(frame);
        renderer.render(scene, camera);
    });
    frame();
};
animate();

// function sinCurve(x: number) {
//     return Math.sin((x-z)*2);
// };

function graphDrawer() {
    const geometry = new THREE.BufferGeometry();
    const points = [];
    const z = 0;
    for(let i = -5; i < 5; i += 0.1){
        points.push(new THREE.Vector3(i, Math.sin((i-z)*2), z))
    };
    geometry.setFromPoints(points);
    const material = new THREE.MeshBasicMaterial({color: 0xffff00});
    const graph = new THREE.Line(geometry, material);
    return graph
};
function graphTrace(z: number) {
    const color = new THREE.Color("rgb(200,100,100)");
    const trace: THREE.Mesh[] = [];
    for(let i=-4; i<4; i++){
        const shape = new THREE.Shape();
        const waveA = i % 2 == 0 ? 1/2 : -1/2;
        shape.moveTo(Math.PI * 0.25 * (i * 2) + z, 0);
        const points: THREE.Vector2[] = [
                new THREE.Vector2(Math.PI * 0.25 * (i * 2 + 1) + z, waveA),
                new THREE.Vector2(Math.PI * 0.25 * ((i + 1) * 2) + z, 0),
        ];
        shape.splineThru(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshPhongMaterial({
            transparent: true,
            opacity: 0.5,
            color: color,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = z;
        trace.push(mesh);
    };
    return trace;
};

function moveGraph(object: THREE.Line | THREE.Mesh) {
    const value = [0, 0, 0, 5, 0, 5];
    const positionKF = new THREE.VectorKeyframeTrack(".position", [0, 2], value);
    const moveObjectClip = new THREE.AnimationClip(
        `move-object`,
        -1,
        [positionKF]
    );
    const mixer = new THREE.AnimationMixer(object);
    mixer.addEventListener("finished", () => {
        scene.remove(object);
        object.geometry.dispose();
    });
    const action = mixer.clipAction(moveObjectClip);
    action.setLoop(THREE.LoopOnce, 0)
    action.play();
    const clock = new THREE.Clock();
    animate(() => mixer.update(clock.getDelta()));
};
function createAxis(x:number, y:number, z:number): THREE.ArrowHelper {
    const direction = new THREE.Vector3(x, y, z);
    return new THREE.ArrowHelper(direction, origin, 7);
}
</script>

<style>
#info {
    position: absolute;
    display: block;
    text-align: right;
    top: 10px;
    z-index: 5;
    width: 90%;
    margin-right: 10px;
    color: white;
}
</style>