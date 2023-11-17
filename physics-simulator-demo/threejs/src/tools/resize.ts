export const onResize = ((
    container: any,
    camera: any,
    renderer: any,
) => {
    if(container instanceof HTMLElement) {
        const { clientWidth, clientHeight } = container;
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(clientWidth, clientHeight);
        renderer.setPixelRatio(clientWidth / clientHeight);
    }
});