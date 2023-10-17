<template>
    <h1>一次関数のグラフ</h1>
    <p class="input">
        <label id="vel">初速：</label>
        <input 
            for="vel" 
            v-model="velocity" 
            type="number" 
            @keydown.enter="linearFunc()">
        <br>
        <label id="acc">加速度：</label>
        <input 
            for="acc"
            v-model="acceleration" 
            type="number" 
            @keydown.enter="linearFunc()">
    </p>
    <p class="buttns">
        <button @click="linearFunc()">描画</button>
        <button @click="clearGraph()">消去</button>
        グラフの式：y={{ accPara }}x{{ velPara }}
    </p>

    <br>
    <canvas id="ca" ref="caRef" :width=scaleX :height=scaleY ></canvas>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';

    const caRef = ref<HTMLCanvasElement>()

    //座標系に使う原点座標
    const xOrigin = 500;
    const yOrigin = 500;

    //座標平面のスケール
    const scaleX = 1000;
    const scaleY = 1000;

    //座標系の目盛り幅
    const intervalX = 100;
    const intervalY = 100;

    //原点から座標平面までの距離
    const xedge = (scaleX-xOrigin)/intervalX
    const yedge = (scaleY-yOrigin)/intervalY

    const linewidth = 4 / intervalX;


    const velocity = ref<number>();
    const acceleration = ref<number>();

    const accPara = computed(() => {
        return acceleration.value == 1 ? "" : acceleration.value
    })
    const velPara = computed(() => {
        return !!(velocity.value) == false ? "" : "+"+velocity.value
    })

    onMounted(() => {
        coordinateAxis()
        coordinate()
        linearFunc()
    })

    function clearGraph() {
        const ca = caRef.value?.getContext("2d")
        if(ca) {
            ca.clearRect(0,0,scaleX,scaleY)
            coordinateAxis();
            coordinate();
        }
    }
      
    function coordinateAxis(){
        const ca = caRef.value?.getContext("2d")
        if(ca) {
            ca.save();
            ca.lineWidth = 4;
            ca.beginPath()
            ca.moveTo(xOrigin, 0)
            ca.lineTo(xOrigin, scaleY)
            ca.moveTo(0,        yOrigin)
            ca.lineTo(scaleX,   yOrigin)
            ca.stroke()
            ca.font = "30px serif"
            ca.fillText("O", xOrigin-40, yOrigin+40)
            ca.restore();
        }
    }

    function coordinate(){
        const ca = caRef.value?.getContext("2d")
        if(ca) {
            ca.save()
            ca.lineWidth = 1
            for(let i=0; i < xedge*2; i++){
                ca.beginPath()
                ca.moveTo(intervalX + i*intervalX, 0)
                ca.lineTo(intervalX + i*intervalX, scaleY)

                ca.moveTo(0,        intervalY + i*intervalY)
                ca.lineTo(scaleX,   intervalY + i*intervalY)
                ca.stroke()
                const coordinateXIndex = i-xOrigin/intervalX+1
                const coordinateYIndex = i-yOrigin/intervalY+1
                if(coordinateXIndex !== 0){
                    ca.font = "20px serif"
                    ca.textAlign = "right"
                    ca.textBaseline = "top"
                    ca.fillText(`${coordinateXIndex}`, intervalX + i*intervalX - 5, yOrigin)
                }
                if(coordinateYIndex !== 0){
                    ca.font = "20px serif"
                    ca.textAlign = "left"
                    ca.textBaseline = "top"
                    ca.fillText(`${-coordinateYIndex}`, xOrigin + 5, intervalY + i*intervalY + 5)
                }
            }
            ca.restore()
        }
    }

    function linearFunc(){
        const ca = caRef.value?.getContext("2d")
        const vel = velocity.value
        const acc = acceleration.value
        if(ca){
            ca.save();
            ca.strokeStyle = "red";
            ca.translate(xOrigin, yOrigin)
            ca.scale(1,-1);
            ca.scale(intervalX, intervalY)
            ca.lineWidth = linewidth;
            if((vel || vel == 0 ) && acc){
                ca.beginPath();
                ca.moveTo((-yedge-vel)/acc, -yedge)
                for (let i=1; -yedge+i*Math.abs(acc) <= yedge+Math.abs(acc); i++){
                    console.log(i)
                    ca.lineTo((-yedge-vel)/acc + i*Math.sign(acc), -yedge + i*Math.abs(acc))
                }
                ca.stroke();
            }
            ca.restore();
        }
    }
    
    function drawArc(x:number,y:number,r:number){
        const ca = caRef.value?.getContext("2d");
    
        if (ca){
            ca.beginPath()
            ca.strokeStyle = "red"
            ca.arc(x, y, r, Math.PI*0, Math.PI*2, false);
            ca.closePath()
            ca.stroke();
        }
    }
</script>

<style>
    .input, .buttns { 
        text-align: left;
    }
</style>