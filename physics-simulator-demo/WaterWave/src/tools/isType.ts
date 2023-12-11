export const isMeshObject = (object: THREE.Object3D[]): object is THREE.Mesh[] => {
    if (Object.keys(object).indexOf("isMesh")){
        return true;
    } else {
        return false;
    }
};
export const isLineObject = (object: THREE.Object3D[]): object is THREE.Line[] => {
    if (Object.keys(object).indexOf("isLine")){
        return true;
    } else {
        return false;
    }
};