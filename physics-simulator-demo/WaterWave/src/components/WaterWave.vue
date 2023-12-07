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

const light  = new THREE.PointLight(0xffffff, 1000, 50);
const lightHelper = new THREE.PointLightHelper(light);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);

onMounted(() => {
    init();
});

function init() {
    scene.add(group);

    camera.position.set(1,30,-1);
    scene.add(camera);

    light.position.set(20, 0, 20);
    scene.add(light);
    scene.add(lightHelper);
    scene.add(ambientLight);

    const geometry = new ParametricGeometry(paramFunc, 50, 50);
    const material = new THREE.MeshLambertMaterial({
        color: 0x0000ff,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    const {innerWidth, innerHeight} = window
    renderer.setSize(innerWidth/2, innerHeight/2);
    container.value?.appendChild(renderer.domElement);

    animate(waveAnim);
};

const param = ref<number>(1)

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
function waveAnim() {
    if(group.children && isMeshObject(group.children)){
        const materials = group.children[0].material as THREE.Material;
        const geometries = group.children[0].geometry as THREE.BufferGeometry;
        materials.dispose();
        geometries.dispose();
        group.clear();
    };
    group.clear();    
    param.value += 0.02;
    const geometry = new ParametricGeometry(paramFunc, 50, 50);
    const material = new THREE.MeshLambertMaterial({
        color: 0x66ffff,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);    
};

function paramFunc(u: number, v: number, vec: THREE.Vector3) {
    const waveSize = 6;
    const phase = param.value;
    u *= Math.PI * waveSize;
    v *= Math.PI * waveSize;

    let x = Math.cos(u - Math.PI) * v ;
    let z = Math.sin(u - Math.PI) * v ;
    let y = Math.cos(v - Math.PI * phase);
    if (v >= Math.PI * (waveSize - 0.5)){
        y = 0
    }
  
    vec.set(x,y,z);
    return vec;
};


</script>

<style scoped>
</style>
