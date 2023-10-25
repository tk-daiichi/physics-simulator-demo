import { numToIngicator } from "./Num2Ingicator";

export function drawIngicator(
    ctx:    CanvasRenderingContext2D,
    num:    number[],
    width:  number,
    height: number,
): void {
    const ingicatorArray = numToIngicator(num);
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < ingicatorArray.length; i++) {
        for (let j = 0; j <= 6; j++) {
            ctx.strokeStyle = "rgba(0,0,0," + ingicatorArray[i][j] + ")"
            if(j<3){
                ctx.beginPath();
                ctx.moveTo(50 + 40 * i,   100 - j * 30);
                ctx.lineTo(20 + 40 * i,   100 - j * 30);
                ctx.stroke();
            }
            else if(j<5) {
                ctx.beginPath();
                ctx.moveTo(20 + 40 * i + 30 * (j-3),    40);
                ctx.lineTo(20 + 40 * i + 30 * (j-3),    70);
                ctx.stroke();
            }
            else {
                ctx.beginPath();
                ctx.moveTo(20 + 40 * i + 30 * (j-5),  70);
                ctx.lineTo(20 + 40 * i + 30 * (j-5),  100);
                ctx.stroke();
            }
        };
    };
}