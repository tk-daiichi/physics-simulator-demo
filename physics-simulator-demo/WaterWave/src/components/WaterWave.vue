<template>
    <div ref="container" class="container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as THREE from "three";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { isMeshObject } from "@/tools/isType"

const container = ref<HTMLElement>();
const scene = new THREE.Scene();
const group = new THREE.Group();
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

const light  = new THREE.HemisphereLight(0xffffff, 1000, 2);
// const light  = new THREE.PointLight(0xffffff, 1000, 50);
// const lightHelper = new THREE.PointLightHelper(light);
const ambientLight = new THREE.AmbientLight(0xffffff, 1);

// const axisX = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 50, 0x00ff00);
// const axisZ = new THREE.ArrowHelper(new THREE.Vector3(0,0,1), new THREE.Vector3(0,0,0), 50, 0xff0000);

onMounted(() => {
    init();
});

function init() {
    scene.add(group);

    camera.position.set(0,10,-1);
    // camera.position.set(0,10,-15);
    scene.add(camera);

    light.position.set(20, 0, 20);
    scene.add(light);
    // scene.add(lightHelper);
    scene.add(ambientLight);

    // scene.add(axisX)
    // scene.add(axisZ)

    const geometry = new ParametricGeometry(paramFunc, 100, 100);
    const material = new THREE.MeshLambertMaterial({
        color: 0x0000ff,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    const {innerWidth, innerHeight} = window
    renderer.setSize(innerWidth/2, innerHeight/2);
    renderer.localClippingEnabled = true;
    container.value?.appendChild(renderer.domElement);

    animate(waveAnim);
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

const param = ref<number>(1);
const waveSize = 10;
const amplitude = 0.5;
const waveLengthParam = 1.5;
const interval = 0.01;

const clipX1 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), Math.PI * 6 / Math.sqrt(2));
const clipX2 = new THREE.Plane(new THREE.Vector3(1, 0, 0), Math.PI * 6 / Math.sqrt(2));
const clipZ1 = new THREE.Plane(new THREE.Vector3(0, 0, -1), Math.PI * 6 / Math.sqrt(2));
const clipZ2 = new THREE.Plane(new THREE.Vector3(0, 0, 1), Math.PI * 6 / Math.sqrt(2));
const clips = [clipX1, clipX2, clipZ1, clipZ2] ;

function waveAnim() {
    if(group.children && isMeshObject(group.children)){
        const materials = group.children[0].material as THREE.Material;
        const geometries = group.children[0].geometry as THREE.BufferGeometry;
        materials.dispose();
        geometries.dispose();
        group.clear();
    };
    group.clear();    
    param.value += interval;

    const geometry = new ParametricGeometry(paramFunc, 100, 100);
    const material = new THREE.MeshLambertMaterial({
        color: 0xccffff,
        side: THREE.DoubleSide,
        clippingPlanes: clips,
    });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);    
};

function paramFunc(u: number, v: number, vec: THREE.Vector3) {
    const phase = param.value;
    u *= Math.PI * waveSize;
    v *= Math.PI * waveSize;

    let x = Math.cos(u) * v ;
    let z = Math.sin(u) * v ;
    let y = Math.cos(v * waveLengthParam - Math.PI * phase) * amplitude;
    if (v >= Math.PI * (waveSize - 0.5)){
        y = 0
    }
  
    vec.set(x,y,z);
    return vec;
};


</script>

<style scoped>
</style>
