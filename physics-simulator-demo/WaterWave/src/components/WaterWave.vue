<template>
    <div ref="container" class="container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as THREE from "three";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { isMeshObject } from "@/tools/isType"

const container = ref<HTMLElement>();
const scene = new THREE.Scene();
const group = new THREE.Group();
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

const light  = new THREE.HemisphereLight(0xffffff, 1000, 1.5);
// const light  = new THREE.PointLight(0xffffff, 1000, 50);
// const lightHelper = new THREE.PointLightHelper(light);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

// const axisX = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 50, 0x00ff00);
// const axisZ = new THREE.ArrowHelper(new THREE.Vector3(0,0,1), new THREE.Vector3(0,0,0), 50, 0xff0000);

const isStop = ref<boolean>(false)

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
    
    container.value?.addEventListener("click", () => {
        isStop.value = !isStop.value;
    })

    animate(waveAnim);
};

function animate(callback? : () => void){
    const frame = (() => {
        controls.update();
        if(callback){
            callback();
        };
        requestAnimationFrame(frame);
        renderer.render(scene, camera);
    });
    frame();
};

const param = ref<number>(1);
const props = {
    waveSize: 10,
    amplitude: 0.5,
    waveLengthParam: 1.5,
    interval: 0.04,
};
const cameraPos = {
    俯瞰: function(){camera.position.set(0, 10, 0)},
    波面: function(){camera.position.set(0, 6, -10)}
}
function initGui() {
    const gui = new GUI({container: container.value, width: 320});
    gui.add(props, "amplitude", 0.2, 1, 0.01).name("振幅");
    gui.add(props, "waveLengthParam", 1, 3, 0.5).name("波長係数");
    gui.add(props, "interval", 0.03, 0.06, 0.01).name("周期");
    gui.add(cameraPos, "俯瞰");
    gui.add(cameraPos, "波面");
};
initGui();

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
    if(isStop.value == false){
        param.value += props.interval;
    };

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
    u *= Math.PI * props.waveSize;
    v *= Math.PI * props.waveSize;

    let x = Math.cos(u) * v ;
    let z = Math.sin(u) * v ;
    let y = Math.cos(v * props.waveLengthParam - Math.PI * phase) * props.amplitude;
    if (v >= Math.PI * (props.waveSize - 0.5)){
        y = 0
    }
  
    vec.set(x,y,z);
    return vec;
};


</script>

<style scoped>
</style>
