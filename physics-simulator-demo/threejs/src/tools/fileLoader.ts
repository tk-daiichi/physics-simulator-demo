import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
export const fileLoader = async (
    target: EventTarget | null, 
    scene: any
) => {
    if(target instanceof HTMLInputElement && target.files) {
        const file = target.files[0];
        const dataURL = URL.createObjectURL(file);
        const loader = new FBXLoader();
        const group = await loader.loadAsync(dataURL);
        scene.add(group);
    }   
};