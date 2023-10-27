import { coordinate, Origin } from '@/components/CoordinateDrawer'

export function clearGraph(
    ctx: CanvasRenderingContext2D,
    scaleX: number,
    scaleY: number,
    interval: number,
    Origin: Origin,
) {
    ctx.clearRect(0,0,scaleX,scaleY)
    coordinate(ctx, scaleX, scaleY, interval, Origin);
}
export function graph1Draw(
    ctx: CanvasRenderingContext2D,
    scaleX: number,
    scaleY: number,
    interval: number,
    Origin: Origin,
    paramA: number,
    paramB: number,
){
    ctx.save();
    ctx.strokeStyle = "rgb(200,100,100)";
    ctx.lineWidth = 4 / interval;
    
    /**
     * グラフの端点の座標を算出　translate, scaleでの変換後の座標であることに注意
     * x座標はグラフの式から計算している
     * あらかじめtranslateとscaleで変換しておくとグラフの式がそのまま使えて良い
    */
    ctx.translate(Origin.x, Origin.y)
    ctx.scale(interval, -interval)
    const graphStart = {
        x: (-(scaleY - Origin.y) / interval - paramB) / paramA,
        y: -(scaleY - Origin.y) / interval
    };
    const graphEnd = {
        x: (Origin.y / interval - paramB) / paramA,
        y: Origin.y / interval
    };
    
    ctx.beginPath();
    ctx.moveTo(graphStart.x, graphStart.y)
    ctx.lineTo(graphEnd.x, graphEnd.y)
    ctx.stroke();
    ctx.restore();
}   
export function graph2Draw(
    ctx: CanvasRenderingContext2D,
    scaleX: number,
    scaleY: number,
    interval: number,
    Origin: Origin,
    paramA: number,
    paramB: number,
    paramC: number,

) {
    ctx.save();
    ctx.strokeStyle = "rgb(100,100,200)";
    ctx.lineWidth = 4 / interval;

    ctx.translate(Origin.x, Origin.y);
    ctx.scale(interval, -interval);
    
    if(paramA != 0){
        const yedge = paramA > 0 ? Origin.y / interval : -(scaleY-Origin.y) / interval;
        const startX = -Math.sqrt(Math.abs((yedge - paramC) / paramA)) + paramB;
        const endX   = Math.sqrt(Math.abs((yedge - paramC) / paramA)) + paramB;
        ctx.beginPath();
            for(let i = startX; i <= endX; i += 0.1){
                ctx.moveTo(i,          paramA * Math.pow(i - paramB, 2) + paramC);
                ctx.lineTo(i + 0.1,    paramA * Math.pow(i + 0.1 - paramB, 2) + paramC);
            }
        ctx.stroke();
    }
    ctx.restore();
};