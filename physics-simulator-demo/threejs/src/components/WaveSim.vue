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
const renderer = new THREE.WebGLRenderer();
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
const origin = new THREE.Vector3(0,0,0);

const controls = new OrbitControls(camera, renderer.domElement);
const gui = new GUI({
    container: container.value, width: 320
});
const props = {
    time: 0.01,
    speed: 5,
    unit: 0.25,
    gridSize: 5,
}
gui.add(props, "time", 0, 5, 0.01)
gui.add(props, "speed", 0.5, 5, 0.01)
gui.add(props, "unit", 0, 1, 0.01)

onMounted(() => {
    init();
});

function init(){
    camera.position.set(6, 10, 15);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    scene.add(ambientLight);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.localClippingEnabled = true;
    container.value?.appendChild(renderer.domElement);

    scene.background = new THREE.Color(0x222255);
    const gridSize = props.gridSize;
    const grid = new THREE.GridHelper(gridSize, gridSize / props.unit, 0x888888);
    grid.position.set(gridSize / 2, 0, gridSize / 2);
    scene.add(grid);

    const axisX = createAxis(1,0,0)
    const axisY = createAxis(0,1,0)
    const axisZ = createAxis(0,0,1)
    scene.add(axisX, axisY, axisZ)

    const graph = graphDrawer();
    scene.add(graph);
    moveGraph(graph);
    for(let z = 0; z <= props.gridSize; z += props.unit){
        const trace = graphTrace(z);
        trace.forEach((el) => {
            scene.add(el);
        });
    };
    animate();
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

//y = sin(2i)　周期pi　振幅amplitude　係数2
const amplitude = 0.5;
const amp = (i:number) => {
    const amp = i % 2 === 0 ? amplitude : -amplitude;
    return amp;
};
const wLength = 2;
const range = 10;
const clipx0 = new THREE.Plane(new THREE.Vector3(1, 0, 0));
const clipxz = new THREE.Plane(new THREE.Vector3(-1, 0, 1));
const clipT  = new THREE.Plane(new THREE.Vector3(0, 0, -1));
clipT.set(new THREE.Vector3(0,0,-1), 4)
const clips = [clipx0, clipxz, clipT];

function graphDrawer() {
    const geometry = new THREE.BufferGeometry();
    const points = [];
    for(let i = -range; i < range; i += 0.1){
        points.push(new THREE.Vector3(i, Math.sin(i * wLength) * amplitude, 0));
    };
    geometry.setFromPoints(points);

    const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        clippingPlanes: clips,
    });
    const graph = new THREE.Line(geometry, material);
    return graph;
};
function graphTrace(z: number) {
    const color = new THREE.Color("rgb(200,100,100)");
    const trace: THREE.Mesh[] = [];
    for(let i = -range; i < range; i++){
        const shape = new THREE.Shape();
        const offset = Math.PI * 0.25 * i * wLength + z;
        shape.moveTo(offset, 0);
        const points: THREE.Vector2[] = [
                new THREE.Vector2(offset + Math.PI * 0.25, amp(i)),
                new THREE.Vector2(offset + Math.PI * 0.25 * 2, 0),
        ];
        shape.splineThru(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshPhongMaterial({
            transparent: true,
            opacity: 0.5,
            color: color,
            side: THREE.DoubleSide,
            clippingPlanes: clips,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = z;
        trace.push(mesh);
    };
    return trace;
};

function moveGraph(object: THREE.Line | THREE.Mesh) {
    const value = [0, 0, 0, props.gridSize, 0, props.gridSize];
    const positionKF = new THREE.VectorKeyframeTrack(".position", [0, props.speed], value);
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
    return new THREE.ArrowHelper(direction, origin, props.gridSize + 5);
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