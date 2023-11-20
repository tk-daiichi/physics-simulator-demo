import { createSphere } from "@/models/models";
import { 
    Mesh,
    Vector3, 
    VectorKeyframeTrack,
    AnimationClip,
    AnimationMixer,
    Clock,
    LoopOnce,
    Scene,
    PerspectiveCamera,
    Raycaster,
    Object3D,
} from "three";


export const ballLauncher = (
    ev: MouseEvent,
    container: HTMLElement,
    scene: Scene,
    camera: PerspectiveCamera,
    objects: Object3D[],
    animate: (callback?: () => void) => void,
): void => {
    if (container instanceof HTMLElement){
        const { clientWidth, clientHeight } = container;
        const { clientX, clientY } = ev;
        const relativeX = (clientWidth / 2 - clientX) / clientWidth;
        const relativeY = (clientHeight / 2 - clientY) / clientHeight;
        const ball = createSphere();
        scene.add(ball);
        setObjectInitialPosition(camera, ball.position, {relativeX, relativeY});
        moveObject(ball, scene, camera, objects, animate);
    };
};

export const setObjectInitialPosition = (
    camera: PerspectiveCamera,
    position: Vector3,
    { relativeX, relativeY }: { relativeX: number; relativeY: number},
): void => {
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
export const moveObject = (
    object: Mesh,
    scene: Scene, 
    camera: PerspectiveCamera,
    objects: Object3D[],
    animate: (callback?: () => void) => void,
): void => {
    const startPosition = object.position;
    const endPosition = new Vector3();
    camera.getWorldDirection(endPosition);
    endPosition.multiplyScalar(camera.far).add(startPosition);
    const positionKF = getPositionKeyFrame(startPosition, endPosition, 10, objects)
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
export const getPositionKeyFrame = (
    startPosition: Vector3,
    endPosition: Vector3,
    duration: number,
    objects: Object3D[],
): VectorKeyframeTrack => {
    const times = [0];
    const { x, y, z } = startPosition;
    const values = [ x, y, z ];
    const direction = endPosition
        .clone()
        .add(startPosition.clone().multiplyScalar(-1))
        .normalize();
    const raycaster = new Raycaster();
    raycaster.set(startPosition, direction);
    
    const intersects = raycaster.intersectObjects(objects, true);
    if(intersects.length > 0){
        const intersect = intersects[0];
        const { distance } = intersect;
        const intersectPosition = startPosition.clone().add(direction.multiplyScalar(distance));
        const { x, y, z } = intersectPosition;
        values.splice(values.length, 0, x, y, z, x, y, z);
        console.log(values)
        const rate = distance / startPosition.distanceTo(endPosition);
        times.push(duration * rate);
    } else {
        const { x, y, z }  = endPosition;
        values.splice(values.length, 0, x, y, z);
    }
    times.push(duration);
    return new VectorKeyframeTrack(".position", times, values);
};