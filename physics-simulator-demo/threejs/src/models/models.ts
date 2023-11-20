import {
    Mesh,
    MeshLambertMaterial, 
    SphereGeometry, 
    MeshPhongMaterial,
    BoxGeometry,
} from 'three';
export const createSphere = (): Mesh => {
    const geometry = new SphereGeometry(1);
    const material = new MeshLambertMaterial({color: 0x550000});
    return new Mesh(geometry, material);
};
export const createCube = (): Mesh => {
    const geometry = new BoxGeometry(1,1,1);
    const material = new MeshPhongMaterial({color: 0x00ffaa});
    return new Mesh(geometry, material);
};