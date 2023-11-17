import { PerspectiveCamera, WebGLRenderer } from "three";

export const onResize = ((
    container: HTMLElement,
    camera: PerspectiveCamera,
    renderer: WebGLRenderer,
) => {
    if(container instanceof HTMLElement) {
        const { clientWidth, clientHeight } = container;
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(clientWidth, clientHeight);
        renderer.setPixelRatio(clientWidth / clientHeight);
    }
});