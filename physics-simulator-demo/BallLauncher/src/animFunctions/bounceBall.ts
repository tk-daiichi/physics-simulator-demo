import Konva from "konva";
import { StageConfig } from "@/configs/stageConfig";
import { CircleConfig } from "@/configs/circleConfig";

export function bounceBall(
    shape: Konva.Circle | undefined, 
    stage_cfg: StageConfig,
    shape_cfg: CircleConfig,
){
    // @ts-ignore
    const circleNode = shape.getNode();
    let positionX = shape_cfg.x;            
    let positionY = shape_cfg.y;
    const period: number = 3;
    let velX = 10 / period;
    let velY = velX;

    let anim = new Konva.Animation(function(frame) {
        if(frame){
            let borderXl = positionX - shape_cfg.radius + velX;
            let borderXr = positionX + shape_cfg.radius + velX;
            if(borderXl > 0 && borderXr < stage_cfg.width){
            } else if(borderXl <= 0){
                velX = frame.timeDiff / period;
            } else if (borderXr >= stage_cfg.width) {
                velX = -frame.timeDiff / period;
            };
            
            let borderYt = positionY - shape_cfg.radius + velY;
            let borderYb = positionY + shape_cfg.radius + velY;
            if(borderYt > 0 && borderYb < stage_cfg.height){
            } else if(borderYt <= 0){
                velY = frame.timeDiff / period;
            } else if (borderYb >= stage_cfg.height) {
                velY = -frame.timeDiff / period;
            };

            positionX += velX;
            positionY += velY;
            circleNode.setX(positionX);
            circleNode.setY(positionY);
        };
    }, circleNode.getLayer());
    anim.start();
}
