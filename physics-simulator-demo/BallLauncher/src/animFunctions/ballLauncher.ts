import Konva from 'konva';
import { CircleConfig } from '@/configs/circleConfig';
import { stage_cfg } from '@/configs/stageConfig';

export function ballLauncher(
    shape: Konva.Circle | undefined,
    circle_cfg: CircleConfig,
    speed: number,
    velocity: number,
){
    //@ts-ignore
    const shapenode = shape.getNode();
    let velX = velocity * 10;
                
    let anim = new Konva.Animation(function(frame){
        if(frame) {
            let time = frame.time * speed * 0.005;
            let lastTime = (frame.time - frame.timeDiff) * speed * 0.005;
            const positionX = (time:number): number => {
                return circle_cfg.x + velX * time;
            };
            const positionY = (time:number): number => {
                return circle_cfg.y + 0.2 * 9.8 * time ** 2
            };
            shapenode.setX(positionX(time));
            shapenode.setY(positionY(time));
            let line = new Konva.Line({
                points: [
                    positionX(lastTime), positionY(lastTime),
                    positionX(time), positionY(time)
                ],
                stroke: `${circle_cfg.stroke}`,
                strokeWidth: 3,
            });
            //@ts-ignore
            shapenode.getLayer().add(line);

            if(shapenode.y() >= stage_cfg.height + circle_cfg.radius){
                anim.stop()
            }
        }
    }, shapenode.getLayer());
    anim.start();
}