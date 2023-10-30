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
    ctx.save();
    ctx.fillStyle = "rgba(222, 222, 222, 1)"
    ctx.fillRect(0, 0, scaleX, scaleY)
    ctx.restore();

    coordinateAxis(ctx, scaleX, scaleY, Origin);

    ctx.save()
    const offsetX = Origin.x % interval;
    const offsetY = Origin.y % interval;
    const range = Math.max(scaleX, scaleY) / interval

    //座標の方眼を描画
    for(let i = 0; i <= range; i++){
        ctx.save()
        ctx.beginPath()
            ctx.lineWidth = 1
            ctx.setLineDash([1,1])
            ctx.strokeStyle = "rgba(0,0,0,0.3)"
            ctx.moveTo(offsetX + i * interval,   0)
            ctx.lineTo(offsetX + i * interval,   scaleY)
            ctx.moveTo(0,        offsetY + i * interval)
            ctx.lineTo(scaleX,   offsetY + i * interval)
        ctx.stroke()
        ctx.restore()
    }
    //座標に目盛と数値を追加
    for(let i = 0; i <= range; i++){
        const widthBorder = (window.innerWidth <= 400) ? 40 : 50;
        const XIndex = i - Math.trunc(Origin.x / interval);
        const YIndex = i - Math.trunc(Origin.y / interval);
        const thinXIndex = Math.abs(Number(XIndex)) % 5 == 0 ? 0 : 1;
        const thinYIndex = Math.abs(Number(YIndex)) % 5 == 0 ? 0 : 1;        
        const thinXIndex2 = Math.abs(Number(XIndex)) % 10 == 0 ? 0 : 1;
        const thinYIndex2 = Math.abs(Number(YIndex)) % 10 == 0 ? 0 : 1;        
        ctx.font = "25px serif"
        
        ctx.save()
        ctx.beginPath()
        if (XIndex != 0){
            ctx.textBaseline = "top";
            ctx.textAlign = "center";            
            if(interval <= widthBorder){
                ctx.strokeStyle = ctx.fillStyle = "rgba(0,0,0,"+`${1-thinXIndex}`+")";
            }
            if(interval <= widthBorder / 2){
                ctx.strokeStyle = ctx.fillStyle = "rgba(0,0,0,"+`${1-thinXIndex2}`+")";
                ctx.font = "20px serif"
            }
            ctx.moveTo(offsetX + i * interval,   Origin.y - 10);
            ctx.lineTo(offsetX + i * interval,   Origin.y + 10);
            ctx.fillText(`${XIndex}`, offsetX + i*interval, Origin.y + 10)
        }
        ctx.stroke();
        ctx.restore();
        
        ctx.save();
        ctx.beginPath()
        if (YIndex != 0) {
            ctx.textBaseline = "middle"
            ctx.textAlign = "right"            
            if(interval <= widthBorder){
                ctx.strokeStyle = ctx.fillStyle = "rgba(0,0,0,"+ `${1-thinYIndex}` + ")"
            }
            if(interval <= widthBorder / 2){
                ctx.strokeStyle = ctx.fillStyle = "rgba(0,0,0,"+`${1-thinYIndex2}`+")";
                ctx.font = "20px serif"
            }
            ctx.moveTo(Origin.x - 10,    offsetY + i * interval);
            ctx.lineTo(Origin.x + 10,    offsetY + i * interval);
            ctx.fillText(`${-YIndex}`, Origin.x - 10, offsetY + i*interval)
        }
        ctx.stroke()
        ctx.restore()
    }
}
export function coordinateAxis(
    ctx: CanvasRenderingContext2D,
    scaleX: number,
    scaleY: number,
    Origin: Origin
    ){
    if(ctx) {
        ctx.save();
        ctx.lineWidth = 2;
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