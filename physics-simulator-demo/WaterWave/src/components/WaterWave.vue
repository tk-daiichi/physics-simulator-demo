<template>
    <div ref="container" class="container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as THREE from "three";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { isMeshObject, isLineObject } from "@/tools/isType"

const container = ref<HTMLElement>();
const scene = new THREE.Scene();
const groupWave = new THREE.Group();
const groupHelper = new THREE.Group();

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

const light  = new THREE.DirectionalLight(0xffffff, 2);
const ambientLight = new THREE.AmbientLight(0xffffff, 1);

const isStop = ref<boolean>(false);
const showHelper = ref<boolean>(false);

onMounted(() => {
    init();
});

function init() {
    scene.add(groupWave);
    scene.add(groupHelper);

    camera.position.set(0,20,-1);
    scene.add(camera);

    light.position.set(5, 0, 5);
    scene.add(light);
    scene.add(ambientLight);

    const {innerWidth, innerHeight} = window
    renderer.setSize(innerWidth/2, innerHeight/2);
    renderer.setPixelRatio(innerWidth/innerHeight);
    renderer.localClippingEnabled = true;
    container.value?.appendChild(renderer.domElement);
    
    container.value?.addEventListener("click", () => {
        isStop.value = !isStop.value;
    });
    window.addEventListener("resize", () => {
        const {innerWidth, innerHeight} = window;
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth/2, innerHeight/2);
        renderer.setPixelRatio(innerWidth/innerHeight);
    });

    waveAnim();    
    waveHelper();
    
    animate(waveAnim);
    animate(waveHelper);
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

const phase = ref<number>(0);
const props = {
    waveSize: 10,
    amplitude: 0.5,
    waveLengthParam: 1.5,
    interval: 0.01,
};
const control = {
    stop: function(){isStop.value = !isStop.value},
    helper: function(){
        showHelper.value = !showHelper.value;
    },
    reset: function(){
        phase.value = 0;
    },
};
const cameraPos = {
    俯瞰: function(){camera.position.set(0, 10, 0)},
    波面: function(){camera.position.set(0, 6, -10)}
};
function initGui() {
    const gui = new GUI({container: container.value, width: 320});
    gui.add(props, "amplitude", 0.2, 1, 0.01).name("振幅");
    gui.add(props, "waveLengthParam", 1, 3, 0.5).name("波長係数");
    gui.add(props, "interval", 0.005, 0.02, 0.005).name("周期");
    gui.add(cameraPos, "俯瞰");
    gui.add(cameraPos, "波面");
    gui.add(control, "stop").name("再生/停止");
    gui.add(control, "helper").name("波面表示切替");
    gui.add(control, "reset").name("リセット");
};
initGui();

const clipX1 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), Math.PI * 6 / Math.sqrt(2));
const clipX2 = new THREE.Plane(new THREE.Vector3(1, 0, 0), Math.PI * 6 / Math.sqrt(2));
const clipZ1 = new THREE.Plane(new THREE.Vector3(0, 0, -1), Math.PI * 6 / Math.sqrt(2));
const clipZ2 = new THREE.Plane(new THREE.Vector3(0, 0, 1), Math.PI * 6 / Math.sqrt(2));
const clips = [clipX1, clipX2, clipZ1, clipZ2] ;

function waveAnim() {
    const waveLength = 2 * Math.PI / props.waveLengthParam;    
    if(groupWave.children[0] && isMeshObject(groupWave.children)){
        const materials = groupWave.children[0].material as THREE.Material;
        const geometries = groupWave.children[0].geometry as THREE.BufferGeometry;
        materials.dispose();
        geometries.dispose();
        groupWave.clear();
    };
    if(isStop.value == false){
        phase.value += waveLength * props.interval;
    };

    const geometry = new ParametricGeometry(paramFunc, 100, 100);
    const material = new THREE.MeshLambertMaterial({
        color: 0xaaffff,
        side: THREE.DoubleSide,
        clippingPlanes: clips,
    });
    const mesh = new THREE.Mesh(geometry, material);
    groupWave.add(mesh);    
};

function paramFunc(u: number, v: number, vec: THREE.Vector3) {
    u *= Math.PI * props.waveSize;
    v *= Math.PI * props.waveSize;

    let x = Math.cos(u) * v ;
    let z = Math.sin(u) * v ;
    let y;
    if (phase.value * Math.PI / props.waveLengthParam < v){
        y = 0
    } else {
        y = Math.cos(v * props.waveLengthParam - Math.PI * phase.value) * props.amplitude;
    }
  
    vec.set(x,y,z);
    return vec;
};


function waveHelper() {
    if(groupHelper.children[0] && isLineObject(groupHelper.children)){
        const materials = groupHelper.children[0].material as THREE.Material;
        const geometries = groupHelper.children[0].geometry as THREE.BufferGeometry;
        materials.dispose();
        geometries.dispose();
        groupHelper.clear();
    };
    const waveLength = 2 * Math.PI / props.waveLengthParam;
    const range = (phase.value * Math.PI / props.waveLengthParam) % waveLength;
    const numOfMount = props.waveSize / waveLength + 4;

    if(showHelper.value == true) {
        for (let i = 0; i <= numOfMount; i++){
            const curve = new THREE.EllipseCurve(
                0, 0,
                range + i * waveLength/2, range + i * waveLength/2,
                0, Math.PI * 2,
                false,
                Math.PI / 2      
                );
            const points = curve.getPoints(50);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            if(i % 2 == 0){
                const material = new THREE.LineBasicMaterial({
                    color: 0xff0000,
                    clippingPlanes: clips,
                });
                const circle = new THREE.Line(geometry, material);
                circle.rotateX(Math.PI / 2);
                circle.position.y = props.amplitude;
                groupHelper.add(circle);
            } else {
                const material = new THREE.LineDashedMaterial({
                    color: 0x0000ff,
                    scale: 1,
                    dashSize: 0.5,
                    gapSize: 0.25,
                    clippingPlanes: clips,
                });
                const circle = new THREE.Line(geometry, material);
                circle.rotateX(Math.PI / 2);
                circle.position.y = 1;
                circle.computeLineDistances();
                groupHelper.add(circle);
            }
        };
    };
};
</script>

<style scoped>
</style>
