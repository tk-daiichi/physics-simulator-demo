import { createSphere } from "@/models/models";
import { 
    Mesh,
    Vector3, 
    VectorKeyframeTrack,
    AnimationClip,
    AnimationMixer,
    Clock,
    LoopOnce,
} from "three";


export const ballLauncher = (
    ev: MouseEvent,
    // clientX: number, 
    // clientY: number,
    container: any,
    scene: any,
    camera: any,
    animate: any,
) => {
    if(container.value instanceof HTMLElement){
        const { clientWidth, clientHeight } = container.value;
        const { clientX, clientY } = ev;
        const relativeX = (clientX - clientWidth / 2) / clientWidth;
        const relativeY = (clientY - clientHeight / 2) / clientHeight;
        const ball = createSphere();
        scene.add(ball);
        setObjectInitialPosition(camera, ball.position, {relativeX, relativeY});
        moveObject(ball, scene, camera, animate);
    };
};

export const setObjectInitialPosition = (
    camera: any,
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
export const moveObject = (
    object: Mesh, 
    scene: any, 
    camera: any,
    animate: any,
) => {
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