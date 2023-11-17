<template>
    <div>
        <label for="file">choose file</label>
        <input id="file" type="file" @input="onFileInput"/>
    </div>
    <div ref="container" class="container" @contextmenu="onContextMenu"></div>
</template>
  
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { 
    GridHelper, 
    Mesh, 
    MeshLambertMaterial, 
    PerspectiveCamera, 
    PointLight, 
    AmbientLight,
    PointLightHelper,
    Scene,
    SphereGeometry, 
    WebGLRenderer, 
    // DirectionalLight,
    MeshPhongMaterial,
    BoxGeometry,
    Color,
    Vector3,
VectorKeyframeTrack,
AnimationClip,
AnimationMixer,
LoopOnce,
Clock,
} from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

export default defineComponent({
    setup() {
        const container = ref();
        const scene = new Scene();
        const camera = new PerspectiveCamera();
        const renderer = new WebGLRenderer();
        const light = new PointLight(0xffffff, 1000, 100);
        const lightHelper = new PointLightHelper(light, 3)
        const ambientLight = new AmbientLight();
        const controls = new OrbitControls(camera, renderer.domElement);

        const init = () => {
            if(container.value instanceof HTMLElement){
                // const clientWidth = 500; 
                // const clientHeight = 300;
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
            }
        };

        const createSphere = (): Mesh => {
            const geometry = new SphereGeometry(3);
            const material = new MeshLambertMaterial({color: 0x550000});
            return new Mesh(geometry, material);
        };
        const createCube = (): Mesh => {
            const geometry = new BoxGeometry(1,1,1);
            const material = new MeshPhongMaterial({color: 0x00ffaa});
            return new Mesh(geometry, material);
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

        const onFileInput = async ({target}: Event) => {
            if(target instanceof HTMLInputElement && target.files) {
                const file = target.files[0];
                const dataURL = URL.createObjectURL(file);
                const loader = new FBXLoader();
                const group = await loader.loadAsync(dataURL);
                scene.add(group);
            }   
        };
        const onContextMenu = ({ clientX, clientY }: MouseEvent) => {
            if(container.value instanceof HTMLElement){
                const { clientWidth, clientHeight } = container.value;
                const relativeX = (clientX - clientWidth / 2) / clientWidth;
                const relativeY = (clientY - clientHeight / 2) / clientHeight;
                const ball = createSphere();
                scene.add(ball);
                setObjectInitialPosition(ball.position, {relativeX, relativeY});
                moveObject(ball);
            };
        };
        const setObjectInitialPosition = (
            position: Vector3,
            { relativeX, relativeY }: { relativeX: number; relativeY: number},
        ) => {
            const forward = new Vector3();
            camera.getWorldDirection(forward);
            forward.normalize();

            const { up } = camera;
            const left = up.clone().cross(forward);

            left.multiplyScalar(relativeX * camera.getFilmWidth());
            const top = up.clone().multiplyScalar(relativeY * camera.getFilmHeight());
            forward.multiplyScalar(camera.near);
            position.copy(camera.position).add(left).add(top).add(forward);
        };
        const moveObject = (object: Mesh) => {
            const startPosition = object.position;
            const { x, y, z } = startPosition;
            const endPosition = new Vector3();
            camera.getWorldDirection(endPosition);
            endPosition.multiplyScalar(camera.far).add(startPosition);

            const positionKF = new VectorKeyframeTrack(
                ".position",
                [0, 10],
                [x, y, z, endPosition.x, endPosition.y, endPosition.z]
            );
            const moveObjectClip = new AnimationClip(
                `move-object-${object.id}`,
                -1,
                [positionKF]
            );
            const mixer = new AnimationMixer(object);
            mixer.addEventListener("finished", () => {
                scene.remove(object);
                object.geometry.dispose();
            });
            const action = mixer.clipAction(moveObjectClip);
            action.setLoop(LoopOnce, 0);
            action.play();
            const clock = new Clock();
            animate(() => mixer.update(clock.getDelta()));
        };
        onMounted(() => {
            init();
        });

        return {
            container,
            onFileInput,
            onContextMenu,
        };
    },
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
