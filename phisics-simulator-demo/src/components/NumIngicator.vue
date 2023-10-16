<template>
    <h1>ingicator</h1>
    <p>入力桁数が18~くらいになると表示がバグる　原因がわかっていない　
        digitcounterの表示もおかしい</p>
    <form @submit.prevent>
        <label id="suuji"></label>
        <input 
            id="suuji" 
            placeholder="整数を入力" 
            v-model="suuji"
            @input.prevent="showIngicator(Number(suuji))"
        >
        桁数：{{ digitCounter }}
    </form>
    <canvas width="1500" height="500" id="canvas" ref="canvasRef" class="ml-5"></canvas>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'

    const canvasRef = ref<HTMLCanvasElement>();
    const suuji = ref<number>()
    let digitCounter = ref<number>()

    function showIngicator(num:number){
        const ctx = canvasRef.value?.getContext("2d");
        const numarray = numToIngicator(num);
        console.log(numarray)
        digitCounter.value = numarray.length
        if(ctx){
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
            // for (let i=0; i<numarray.length; i++){
            //     if(numarray[i]){
            //         for (let j=0; j<=numarray[i].length-1; j++){
            //             ctx.strokeStyle = "rgba(0,0,0,"+numarray[i][j]+")"
            //             if(j<3){
            //                 ctx.beginPath();
            //                 ctx.moveTo(50+40*i,100-j*30);
            //                 ctx.lineTo(20+40*i,100-j*30);
            //                 ctx.stroke();
            //             }
            //             else if(j<5) {
            //                 ctx.beginPath();
            //                 ctx.moveTo(20+40*i+30*(j-3),40);
            //                 ctx.lineTo(20+40*i+30*(j-3),70);
            //                 ctx.stroke();
            //             }
            //             else {
            //                 ctx.beginPath();
            //                 ctx.moveTo(20+40*i+30*(j-5),70);
            //                 ctx.lineTo(20+40*i+30*(j-5),100);
            //                 ctx.stroke();
            //             }
            //         }
            //     }
            // }
    }

    onMounted(() => {
        showIngicator(2796052664);
    })

    function numArray(num :number) {
        const sequence = [];
        const numString = num.toString()
        for (let i=0; i < numString.length; i++){
            sequence.push(Number(numString[i]))
        }
        return sequence;
    }

    function numIngicator(num:number|undefined) { 
        switch (num) {
            case 0:
                return [1,0,1,1,1,1,1];
            case 1:
                return [0,0,0,0,1,0,1];
            case 2:
                return [1,1,1,0,1,1,0];
            case 3:
                return [1,1,1,0,1,0,1];
            case 4:
                return [0,1,0,1,1,0,1];
            case 5:
                return [1,1,1,1,0,0,1];
            case 6:
                return [1,1,1,1,0,1,1];
            case 7:
                return [0,0,1,1,1,0,1];
            case 8:
                return [1,1,1,1,1,1,1];
            case 9:
                return [0,1,1,1,1,0,1];
        }
    }

    function numToIngicator(num: number) {
        const ingicatorSequence = [];
        const numarray = numArray(num);
        for (let i=0; i<numarray.length; i++){
            console.log(typeof numarray[i])
            if(typeof numarray[i] === "number"){
                const numIngi = numIngicator(numarray[i]);
                ingicatorSequence.push(numIngi);
            }
        }
        return ingicatorSequence;
    }
</script>

<style>
    canvas {
        border: 10px, solid, black;
        background-color: #ccc;
    }
</style>