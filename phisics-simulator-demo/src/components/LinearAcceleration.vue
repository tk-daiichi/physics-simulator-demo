<template>
    <h1>一次関数のグラフ</h1>
    <!-- <div class="moved-box">aaa</div> -->
    <p>
        <label id="vel">初速：</label>
        <input for="vel" v-model="velocity" type="text">
        <label id="acc">加速度：</label>
        <input for="acc" v-model="acceleration" type="text">
        <button @click="linearFunc()">描画</button>
    </p>
    <canvas id="ca" ref="caRef" :width=scaleX :height=scaleY></canvas>
</template>

<script setup lang="ts">
    /**
     * 要件
     * 透過速度直線運動のグラフ
     * パラメータをいじってグラフが好きに描けるようにする
     * 
     */

    import { ref, onMounted } from 'vue';

    const caRef = ref<HTMLCanvasElement>()

    //座標系に使う原点座標
    const xOrigin = 450;
    const yOrigin = 450;

    const scaleX = 1000;
    const scaleY = 800;


    const velocity = ref<number>();
    const acceleration = ref<number>();


    onMounted(() => {
        coordinateAxis()
        coordinate()
        linearFunc()
        // draw(90,30,50)
        // animation();
    })
    
    function coordinateAxis(){
        const ca = caRef.value?.getContext("2d")
        if(ca) {
            ca.lineWidth = 4
            ca.beginPath()
            ca.moveTo(xOrigin,10)
            ca.lineTo(xOrigin,scaleY)
            ca.moveTo(10,yOrigin)
            ca.lineTo(scaleX,yOrigin)
            ca.stroke()
        }
    }

    function coordinate(){
        const ca = caRef.value?.getContext("2d")
        if(ca) {
            ca.lineWidth = 1
            for(let i=0; i*10<scaleX; i++){
                ca.beginPath()
                ca.moveTo(10+i*10,0)
                ca.lineTo(10+i*10, scaleY)
                ca.moveTo(0,10+i*10)
                ca.lineTo(scaleX,10+i*10)
                ca.stroke()
            }
        }
    }

    function linearFunc(){
        const ca = caRef.value?.getContext("2d")
        const vel = velocity.value
        const acc = acceleration.value
        if(ca && vel && acc){
            ca.save();
            // ca.clearRect(0,0,scaleX,scaleY)
            ca.lineWidth = 3
            ca.strokeStyle = "red"
            ca.beginPath()
            ca.moveTo(xOrigin, yOrigin + vel)
            if(acc >= 0){
                const xedge = scaleX
                ca.moveTo(xOrigin,yOrigin)
                ca.lineTo((xOrigin/acc)*30+xOrigin,0)
                ca.moveTo(xOrigin,yOrigin);
                ca.lineTo(0, (yOrigin/acc)*30+yOrigin);
            }
            if(acc < 0){
                const xedge = scaleX
                ca.lineTo(xedge,0)
            }
            ca.stroke()
            ca.restore();
        }
    }
    
    // function animation() {
    //     const ca = caRef.value?.getContext("2d")
    //     if(ca){
    //         let time = new Date();
    //         // ca.translate(300,300)
    //         ca.save();
    //         ca.fillRect(0,0,1500,1500)
    //         // ca.clearRect(0,0,1500,1500)
    //         ca.rotate(Math.PI*2/60 * time.getSeconds())
    //         ca.fillRect(0,0,30,30)
    //         // ca.translate(300,300)
    //         // ca.fillStyle = "rgba(0,0,0,"+0.1*time.getSeconds()+")"
    //         // ca.fillRect(0,0,10,10)

    //         // ca.beginPath();
    //         // ca.arc(0,0,100*1.4142,0,Math.PI*2);
    //         // ca.stroke();

    //         // ca.rotate(
    //         //     ((2*Math.PI)/60) * time.getSeconds() +
    //         //      ((2*Math.PI)/60000) * time.getMilliseconds()
    //         // );
    //         // ca.beginPath();
    //         // ca.strokeStyle="black"
    //         // ca.arc(100,100,10,0,Math.PI*2);
    //         // ca.stroke();

    //         ca.restore()

    //         // window.requestAnimationFrame(animation)
    //     }
    // }
    function draw(x:number,y:number,r:number){
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
    /* #ca {
        background-color: #ccc;
    } */
</style>


<style>
    /* .moved-box {
        width: 60px;
        height: 60px;
        background-color: #fcc;
        transform: 
            translate(200px)
            translate(0,30px)
            scale(3,2)
            resetTransform();
        translate: 20px;
    } */
</style>