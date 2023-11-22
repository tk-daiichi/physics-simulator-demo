<template>
    <div ref="container" class="container"></div>
    <div id="info">control panel</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = ref<HTMLElement>();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight,
    0.1, 1000
);
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
const light = new THREE.PointLight(0xffffff, 50);
const lightHelper = new THREE.PointLightHelper(light, 0.4);
const origin = new THREE.Vector3(0,0,0);

onMounted(() => {
    init();
});

function init(){
    scene.add(camera);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearAlpha
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
    // graphTrace();

    light.position.set(3, 2, 3)
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light); 
    scene.add(ambientLight);
    scene.add(lightHelper);
};
function animate(){
    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
 };
animate();

function graphDrawer() {
    const geometry = new THREE.BufferGeometry();
    const z = 5;
    const points = [];
    for(let i = 0; i < 5; i += 0.1){
        points.push(new THREE.Vector3(i,Math.sin((i-z)*2)/2,z))
    };
    geometry.setFromPoints(points);
    const material = new THREE.MeshBasicMaterial({color: 0xffff00});
    const graph = new THREE.Line(geometry, material );
    graphTrace(z);
    return graph
};
function graphTrace(z:number) {
    const path = new THREE.Path();
    const color = new THREE.Color("rgb(200,100,100)");
    const material = new THREE.LineDashedMaterial({color: color})
    for(let j = 0; j < z; j+=0.5){
        for(let i = 0; i < 5; i += 0.1){
            path.lineTo(i, Math.sin((i-j)*2)/2);
            path.lineTo(i, 0);
        };
        const points = path.getPoints();
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const graph = new THREE.Line(geometry, material);
        graph.position.z = j;
        scene.add(graph);
    };
}
 
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