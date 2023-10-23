export type Origin = {
    x: number
    y: number
}
export function coordinate(
    ctx: CanvasRenderingContext2D,
    scaleX: number,
    scaleY: number,
    interval: number,
    Origin: Origin
){
    coordinateAxis(ctx, scaleX, scaleY, Origin);

    ctx.save();
    ctx.fillStyle = "rgba(100, 100, 100, 0.4)"
    ctx.fillRect(0, 0, scaleX, scaleY)
    ctx.restore();

    ctx.save()
    for(let i = 0; i <= scaleX / interval; i++){
        //座標の方眼を描画
        ctx.save()
        ctx.beginPath()
            ctx.lineWidth = 1
            ctx.setLineDash([10,10])
            ctx.strokeStyle = "rgba(0,0,0,0.3)"
            ctx.moveTo(Origin.x % interval + i * interval,   0)
            ctx.lineTo(Origin.x % interval + i * interval,   scaleY)
            ctx.moveTo(0,        Origin.y % interval + i * interval)
            ctx.lineTo(scaleX,   Origin.y % interval + i * interval)
        ctx.stroke()
        ctx.restore()

        //座標に目盛と数値を追加
        const coordinateXIndex = i - Math.trunc(Origin.x / interval);
        const coordinateYIndex = i - Math.trunc(Origin.y / interval);
        ctx.save()
        ctx.strokeStyle = "rgba(0,0,0,1)"
        ctx.lineWidth = 4
        ctx.setLineDash([])
        ctx.font = "25px serif"                
        ctx.beginPath()
            if (coordinateXIndex != 0){
                ctx.moveTo(Origin.x % interval + i * interval,   Origin.y - 10);
                ctx.lineTo(Origin.x % interval + i * interval,   Origin.y + 10);
                ctx.textBaseline = "top"
                ctx.textAlign = "center"
                ctx.fillText(
                    `${coordinateXIndex}`, 
                    Origin.x % interval + i*interval, 
                    Origin.y + 10)
            }
            if (coordinateYIndex != 0) {
                ctx.moveTo(Origin.x - 10,    Origin.y % interval + i * interval);
                ctx.lineTo(Origin.x + 10,    Origin.y % interval + i * interval);
                ctx.textBaseline = "middle"
                ctx.textAlign = "right"
                ctx.fillText(
                    `${-coordinateYIndex}`, 
                    Origin.x - 10, 
                    Origin.y % interval + i*interval)
            }
        ctx.stroke()
        ctx.restore()
    }
    ctx.restore()
}
export function coordinateAxis(
    ctx: CanvasRenderingContext2D,
    scaleX: number,
    scaleY: number,
    Origin: Origin
    ){
    if(ctx) {
        ctx.save();
        ctx.lineWidth = 2.5;
        ctx.beginPath()
            ctx.moveTo(Origin.x, 0)
            ctx.lineTo(Origin.x, scaleY)
            ctx.moveTo(0, Origin.y)
            ctx.lineTo(scaleX, Origin.y)
        ctx.stroke()

        ctx.font = "30px serif"
        ctx.fillText("O", Origin.x - 40, Origin.y + 40)
        
        ctx.font = "40px serif"
        ctx.textAlign = "start"
        ctx.textBaseline = "top"
        ctx.fillText("y", Origin.x + 10, 0)

        ctx.textAlign = "right"
        ctx.textBaseline = "bottom"
        ctx.fillText("x", scaleX - 10, Origin.y)

        ctx.restore();
    }
}