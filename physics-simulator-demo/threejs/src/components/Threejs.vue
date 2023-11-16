<template>
    <div ref="container" class="container"></div>
</template>
  
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { 
    AmbientLight,
    GridHelper, 
    Mesh, 
    MeshLambertMaterial, 
    PerspectiveCamera, 
    PointLight, 
    Scene, 
    SphereGeometry, 
    WebGLRenderer 
} from "three";

export default defineComponent({
    setup() {
        const container = ref();
        const scene = new Scene();
        const camera = new PerspectiveCamera();
        const renderer = new WebGLRenderer();
        const light = new PointLight(0xffffff, 1000.0, 0);
        const ambientLight = new AmbientLight();

        const init = () => {
            if(container.value instanceof HTMLElement){
                const clientWidth = 1000; 
                const clientHeight = 800;

                scene.add(new GridHelper());

                light.position.set(10, 10, 0);
                scene.add(light);
                scene.add(ambientLight);

                const sphere = createSphere();
                scene.add(sphere);

                camera.aspect = clientWidth / clientHeight;
                camera.updateProjectionMatrix();
                camera.position.set(10, 10, 0);
                camera.lookAt(0, 0, 0);

                renderer.setSize(clientWidth, clientHeight);
                renderer.setPixelRatio(clientWidth / clientHeight);

                container.value.appendChild(renderer.domElement);

                animate();
                // renderer.render(scene, camera);
            }
        };

        const createSphere = (): Mesh => {
            const geometry = new SphereGeometry(3);
            const material = new MeshLambertMaterial({color: 0x550000});
            return new Mesh(geometry, material);
        };
        
        const animate = () => {
            let phi = 0;
            const frame = () => {
                phi += 0.003 * Math.PI;
                camera.position.set(10 * Math.cos(phi), 10, 10 * Math.sin(phi));
                camera.lookAt(0,0,0)

                renderer.render(scene, camera);
                requestAnimationFrame(frame);
            };
            frame();
        };

        onMounted(() => {
            init();
        });

        return {
            container,
        };
    },
});
</script>


<style>
</style>
