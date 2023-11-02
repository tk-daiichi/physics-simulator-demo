import Konva from 'konva';
import { CircleConfig } from '@/configs/circleConfig';

export function ballLauncher(
    shape: Konva.Circle | undefined,
    circle_cfg: CircleConfig,
    speed: number,
    velocity: number,
){
    //@ts-ignore
    const shapenode = shape.getNode();
    let period = 1000 / speed ;
                
    let anim = new Konva.Animation(function(frame){
        if(frame) {
            let time = frame.time / period;
            let velX = velocity * 10;
            const shapePositionX = circle_cfg.x + velX * time;
            const shapePositionY = circle_cfg.y + 0.5 * 9.8 * time ** 2;
            shapenode.setX(shapePositionX);
            shapenode.setY(shapePositionY);
            let circle = new Konva.Circle({
                x: shapePositionX,
                y: shapePositionY,
                radius: 5,
                fill: 'rgba(210,110,100,1)',
                draggable: true,
            });
            //@ts-ignore
            shapenode.getLayer().add(circle);
        }
    }, shapenode.getLayer());
    anim.start();
}