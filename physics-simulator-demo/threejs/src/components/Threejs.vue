<template>
    <div>
        <label for="file">choose file：</label>
        <input id="file" type="file" />
    </div>
    <div ref="container" class="container"></div>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { createSphere, createCube } from "@/models/models"
import { onFileInput } from "@/tools/fileLoader"
import { ballLauncher } from "@/tools/ballLauncher"
import { onResize } from "@/tools/resize"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { 
    GridHelper, 
    PerspectiveCamera, 
    PointLight, 
    AmbientLight,
    PointLightHelper,
    Scene,
    WebGLRenderer,
    Color,
    Object3D,
} from "three";

const container = ref();
const scene = new Scene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer();
const light = new PointLight(0xffffff, 1000, 100);
const lightHelper = new PointLightHelper(light, 3)
const ambientLight = new AmbientLight();
const controls = new OrbitControls(camera, renderer.domElement);
const objects: Object3D[] = []

const init = () => {
    if(container.value instanceof HTMLElement){
        const { clientWidth, clientHeight } = container.value
        console.log(container.value.clientWidth, container.value.clientHeight)

        scene.add(new GridHelper(50));
        scene.background = new Color(0xcccccc);

        light.position.set(5, 5, 5);
        scene.add(light);
        scene.add(ambientLight);
        scene.add(lightHelper);

        const sphere = createSphere();
        scene.add(sphere);
        
        const cube = createCube();
        cube.position.x = 5;
        scene.add(cube);

        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
        camera.position.set(30, 30, 30);
        camera.lookAt(0, 0, 0);

        renderer.setSize(clientWidth, clientHeight);
        renderer.setPixelRatio(clientWidth / clientHeight);

        container.value.appendChild(renderer.domElement);

        animate();
        controls.enablePan = false;

        const input = document.getElementById("file");
        input?.addEventListener(
            "input",
            ({target}: Event) => onFileInput(target, scene, objects)
        )
        container.value.addEventListener(
            "contextmenu",
            (ev) => ballLauncher(ev, container.value, scene, camera, objects, animate)
        )
        window.addEventListener(
            "resize", 
            () => onResize(container.value, camera, renderer)
        );
    }
};

const animate = (callback?: () => void) => {
    const frame = () => {
        controls.update();

        if(callback){
            callback();
        }
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    };
    frame();
};

onMounted(() => {
    init();
});
</script>


<style>
#app {
    padding: 0;
}
.container {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
}
</style>
