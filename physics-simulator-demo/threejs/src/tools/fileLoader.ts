import { Object3D, Scene } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";


export const fileLoader = async (
    target: EventTarget | null, 
    scene: Scene
): Promise<Object3D | undefined> => {
    if(target instanceof HTMLInputElement && target.files) {
        const file = target.files[0];
        const dataURL = URL.createObjectURL(file);
        const loader = new FBXLoader();
        const group = await loader.loadAsync(dataURL);
        scene.add(group);
        return group;
    }   
};
export const onFileInput = async (
    target: EventTarget | null, 
    scene: Scene,
    objects: Object3D[],
): Promise<void> => {
    if(target instanceof HTMLInputElement && target.files) {
        const group = await fileLoader(target, scene);
        if(group) {
            scene.add(group);
            objects.push(group);
        }
    }   
};
