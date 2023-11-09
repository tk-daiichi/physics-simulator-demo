import Konva from 'konva';
import { CircleConfig } from '@/configs/circleConfig';
import { stage_cfg } from '@/configs/stageConfig';
import { GraphTrack } from '@/configs/track';

export function ballLauncher(
    shape: Konva.Circle | undefined,
    circle_cfg: CircleConfig,
    speed: number,
    velocity: number,
    interval: number,
    configs: GraphTrack[]
){
    //@ts-ignore
    const shapenode = shape.getNode();
                
    let anim = new Konva.Animation(function(frame){
        if(frame) {
            let time = frame.time * speed * 0.005;
            const positionX = (time:number): number => {
                return circle_cfg.x + velocity * interval * time;
            };
            const positionY = (time:number): number => {
                return circle_cfg.y + 0.5 * 9.8 * interval * time ** 2
            };
            shapenode.setX(positionX(time));
            shapenode.setY(positionY(time));
        };
        if(shapenode.y() >= stage_cfg.height + circle_cfg.radius){
            anim.stop();
        };
    }, shapenode.getLayer());
    anim.start();
    configs.push(ballTrack(circle_cfg, velocity, interval));
};
export function ballTrack(
    circle_cfg: CircleConfig,
    velocity: number,
    interval: number,
) {
    const point = [];
    for(let i=0; i <= 20; i+=0.1){
        point.push(
            circle_cfg.x + velocity * interval * i, 
            circle_cfg.y + 0.5 * 9.8 * interval * i ** 2
        )
    };
    const line = {
        points: point,
        stroke: `${circle_cfg.stroke}`,
        strokeWidth: 3,
        config: circle_cfg,
        velocity: velocity,
    };
    return line;
};