import Konva from 'konva';
import { CircleConfig } from '@/configs/circleConfig';

export function ballLauncher(
    shape: Konva.Circle | undefined,
    circle_cfg: CircleConfig,
){
    //@ts-ignore
    const shapenode = shape.getNode();
    let period = 400;
                
    let anim = new Konva.Animation(function(frame){
        if(frame) {
            let time = frame.time / period;
            let velX = 50;
            shapenode.setX(circle_cfg.x + velX * time);
            shapenode.setY(circle_cfg.y +  9.8 * time ** 2)
            let circle = new Konva.Circle({
                x: circle_cfg.x + velX * time,
                y: circle_cfg.y +  9.8 * time ** 2,
                radius: 5,
                fill: 'rgba(210,110,100,0.5)',
                draggable: true,
            });
            //@ts-ignore
            shapenode.getLayer().add(circle);
        }
    }, shapenode.getLayer());
    anim.start();
}