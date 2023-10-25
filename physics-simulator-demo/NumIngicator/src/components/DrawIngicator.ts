import { numToIngicator } from "./Num2Ingicator";

export function drawIngicator(ctx: CanvasRenderingContext2D, num:number){
    // const ctx = canvas.value?.getContext("2d");
    const numarray = numToIngicator(num);
    console.log(numarray)
    ctx.clearRect(0,0,1000,500)
    ctx.arc(50, 50, Math.PI*0, Math.PI*2, Math.PI*2, false)
    numarray.forEach((numForIngicate) => {
        console.log(numForIngicate)
        if (typeof numForIngicate === "object"){
            for (let j=0; j<=numForIngicate.length-1; j++){
                ctx.strokeStyle = "rgba(0,0,0,"+numForIngicate[j]+")"
                let digit = numarray.indexOf(numForIngicate);
                if(j<3){
                    ctx.beginPath();
                    ctx.moveTo(50+40*digit,100-j*30);
                    ctx.lineTo(20+40*digit,100-j*30);
                    ctx.stroke();
                }
                else if(j<5) {
                    ctx.beginPath();
                    ctx.moveTo(20+40*digit+30*(j-3),40);
                    ctx.lineTo(20+40*digit+30*(j-3),70);
                    ctx.stroke();
                }
                else {
                    ctx.beginPath();
                    ctx.moveTo(20+40*digit+30*(j-5),70);
                    ctx.lineTo(20+40*digit+30*(j-5),100);
                    ctx.stroke();
                }
            };
        }
    })
}