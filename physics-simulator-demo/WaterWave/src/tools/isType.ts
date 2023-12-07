export const isMeshObject = (object: THREE.Object3D[]): object is THREE.Mesh[] => {
    if (Object.keys(object).indexOf("isMesh")){
        return true;
    } else {
        return false;
    }
};