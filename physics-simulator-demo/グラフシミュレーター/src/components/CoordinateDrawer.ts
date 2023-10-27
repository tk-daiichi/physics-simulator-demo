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
    coordinateAxis(ctx, scaleX, scaleY, interval, Origin);

    ctx.save();
    ctx.fillStyle = "rgba(100, 100, 100, 0.1)"
    ctx.fillRect(0, 0, scaleX, scaleY)
    ctx.restore();

    ctx.save()
    const range = Math.max(scaleX, scaleY) / interval
    for(let i = 0; i <= range; i++){
        const offsetX = Origin.x % interval;
        const offsetY = Origin.y % interval;
        //座標の方眼を描画
        ctx.save()
        ctx.beginPath()
            ctx.lineWidth = 1
            ctx.setLineDash([10,10])
            ctx.strokeStyle = "rgba(0,0,0,0.3)"
            ctx.moveTo(offsetX + i * interval,   0)
            ctx.lineTo(offsetX + i * interval,   scaleY)
            ctx.moveTo(0,        offsetY + i * interval)
            ctx.lineTo(scaleX,   offsetY + i * interval)
        ctx.stroke()
        ctx.restore()

        //座標に目盛と数値を追加
        const coordinateXIndex = i - Math.trunc(Origin.x / interval);
        const coordinateYIndex = i - Math.trunc(Origin.y / interval);
        ctx.save()
        ctx.strokeStyle = "rgba(0,0,0,1)"
        ctx.lineWidth = 1
        ctx.setLineDash([])
        ctx.font = "25px serif"                
        ctx.beginPath()
            if (coordinateXIndex != 0){
                ctx.moveTo(offsetX + i * interval,   Origin.y - 10);
                ctx.lineTo(offsetX + i * interval,   Origin.y + 10);
                ctx.textBaseline = "top"
                ctx.textAlign = "center"
                ctx.fillText(
                    `${coordinateXIndex}`, 
                    offsetX + i*interval, 
                    Origin.y + 10)
            }
            if (coordinateYIndex != 0) {
                ctx.moveTo(Origin.x - 10,    offsetY + i * interval);
                ctx.lineTo(Origin.x + 10,    offsetY + i * interval);
                ctx.textBaseline = "middle"
                ctx.textAlign = "right"
                ctx.fillText(
                    `${-coordinateYIndex}`, 
                    Origin.x - 10, 
                    offsetY + i*interval)
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
    interval: number,
    Origin: Origin
    ){
    if(ctx) {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.beginPath()
            ctx.moveTo(Origin.x, 0)
            ctx.lineTo(Origin.x, scaleY)
            ctx.moveTo(0, Origin.y)
            ctx.lineTo(scaleX, Origin.y)
        ctx.stroke()

        ctx.font = "20px serif"
        ctx.fillText("O", Origin.x - 30, Origin.y + 30)
        
        ctx.font = "20px serif"
        ctx.textAlign = "start"
        ctx.textBaseline = "top"
        ctx.fillText("y", Origin.x + 10, 0)
        
        ctx.textAlign = "right"
        ctx.textBaseline = "bottom"
        ctx.fillText("x", scaleX - 10, Origin.y)

        ctx.restore();
    }
}