<template>
    <h2>y=ax+bのグラフ</h2>

    <div id="graphInfos">
        <div id="paramA">
            <label id="initPos">a</label>
            <button id="" @click="paramADecrease()">&lt;</button>
            <input
                for="initPos" type="number" 
                v-model="initPosition" 
                @keydown.enter="linearFunc()"
                @change="linearFunc">
            <button @click="paramAIncrease()">&gt;</button>
        </div>
        <div id="paramB">
            <label id="vel">b</label>
            <button @click="paramBDecrease()">&lt;</button>
            <input 
                for="vel" type="number" 
                v-model="velocity" 
                @keydown.enter="linearFunc()"
                @change="linearFunc">
            <button @click="paramBIncrease()">&gt;</button>
        </div>
        <div id="graphEq">
            グラフの式：y={{ velPara }}x{{ initPosPara }}
        </div>
        <!-- mouseEventの状態：{{ mouseEventStatus }} -->
    </div>

    <br>
    <canvas 
        id="ca" ref="caRef" 
        :width=scaleX :height=scaleY 
        @mousedown="mousedown"
        @mouseup="mouseup"
        @mousemove="scrollGraph"
    >
    </canvas>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed, reactive } from 'vue';

    const caRef = ref<HTMLCanvasElement>()
    /**
     * canvasに描画操作をするにはcaRefの2Dコンテクストctxを取得する必要がある
     * ctxはマウント後に取得しないとundefinedになる
     * 呼び出す関数すべてにctxの宣言文を書く必要があり、冗長になる
     */

    let Origin = {x: 500, y: 500};

    const scaleX = 1000;
    const scaleY = 600;

    const interval = 100;

    const initPosition = ref<number>(1);
    const velocity = ref<number>(-2);

    
    const initPosPara = computed(() => {
        const sign = (initPosition.value > 0) ? "+" : "-"
        return !!(initPosition.value) ?  sign + Math.abs(initPosition.value) : ""
    })

    const velPara = computed(() => {
        const sign = (velocity.value >= 0) ? "" : "-"
        if( velocity.value !== 0){
            return Math.abs(velocity.value) == 1 ? sign : sign + Math.abs(velocity.value)
        } else {
            return "";
        }
    })

    const paramAIncrease = (() => {
        initPosition.value += 1;
        linearFunc();
    })
    const paramBIncrease = (() => {
        velocity.value += 1;
        linearFunc();
    })
    const paramADecrease = (() => {
        initPosition.value -= 1;
        linearFunc();
    })
    const paramBDecrease = (() => {
        initPosition.value -= 1;
        linearFunc();
    })

    onMounted(() => {
        coordinate()
        linearFunc()
    });


    const mouseEventStatus = ref<string>("")
    const mousedown = ((ev: MouseEvent) => {
        mouseEventStatus.value = "mousedown"
    })
    const mouseup   = () => mouseEventStatus.value = "mouseup"

    function scrollGraph(ev: MouseEvent) {
        const ca = caRef.value?.getContext("2d")

        const dx = ev.movementX;
        const dy = ev.movementY;

        if (mouseEventStatus.value == "mousedown" ){
            ca?.clearRect(0, 0, scaleX, scaleY)

            Origin.x += dx;
            Origin.y += dy;

            coordinateAxis();
            coordinate();
            linearFunc();
        }
    }


      
    function coordinateAxis(){
        const ca = caRef.value?.getContext("2d")
        if(ca) {
            ca.save();
            ca.lineWidth = 2.5;
            ca.beginPath()
            ca.moveTo(Origin.x, 0)
            ca.lineTo(Origin.x, scaleY)
            ca.moveTo(0, Origin.y)
            ca.lineTo(scaleX, Origin.y)
            ca.stroke()

            ca.font = "30px serif"
            ca.fillText("O", Origin.x - 40, Origin.y + 40)
            ca.font = "40px serif"
            ca.textAlign = "start"
            ca.textBaseline = "top"
            ca.fillText("y", Origin.x + 10, 0)
            ca.textAlign = "right"
            ca.textBaseline = "bottom"
            ca.fillText("x", scaleX - 10, Origin.y)

            ca.restore();
        }
    }

    function coordinate(){
        coordinateAxis();
        const ca = caRef.value?.getContext("2d")
        if(ca) {
            ca.save();
            ca.fillStyle = "rgba(100, 100, 100, 0.4)"
            ca.fillRect(0, 0, scaleX, scaleY)
            ca.restore();

            ca.save()
            
            ca.lineWidth = 1

            for(let i = 0; i <= scaleX / interval; i++){
                console.log(i)
                ca.beginPath()
                ca.setLineDash([10,10])
                ca.strokeStyle = "rgba(0,0,0,0.3)"
                ca.moveTo(Origin.x % interval + i * interval, 0)
                ca.lineTo(Origin.x % interval + i * interval, scaleY)
                ca.moveTo(0,      Origin.y % interval + i * interval)
                ca.lineTo(scaleX, Origin.y % interval + i * interval)
                ca.stroke()


                const coordinateXIndex = i - Math.trunc(Origin.x / interval);
                const coordinateYIndex = i - Math.trunc(Origin.y / interval);
                
                ca.save()
                ca.beginPath()
                ca.strokeStyle = "rgba(0,0,0,1)"
                ca.lineWidth = 4
                ca.setLineDash([])
                if (coordinateXIndex != 0){
                    ca.moveTo(Origin.x % interval + i * interval, Origin.y - 10);
                    ca.lineTo(Origin.x % interval + i * interval, Origin.y + 10);
                }
                if (coordinateYIndex != 0) {
                    ca.moveTo(Origin.x - 10, Origin.y % interval + i * interval);
                    ca.lineTo(Origin.x + 10, Origin.y % interval + i * interval);
                }
                ca.stroke()
                ca.restore()

                ca.font = "25px serif"
                
                if(coordinateXIndex !== 0){
                    ca.textBaseline = "top"
                    ca.textAlign = "center"
                    ca.fillText(
                        `${coordinateXIndex}`, 
                        Origin.x % interval + i*interval, 
                        Origin.y + 10)
                }
                if(coordinateYIndex !== 0){
                    ca.textBaseline = "middle"
                    ca.textAlign = "right"
                    ca.fillText(
                        `${-coordinateYIndex}`, 
                        Origin.x - 10, 
                        Origin.y % interval + i*interval)
                }
            }
            ca.restore()
        }
    }


    function clearGraph() {
        const ca = caRef.value?.getContext("2d")
        if(ca) {
            ca.clearRect(0,0,scaleX,scaleY)
            coordinate();
        }
    }

    function linearFunc(){
        const ca = caRef.value?.getContext("2d")
        const initPos = initPosition.value
        const vel = velocity.value

        clearGraph()

        if(ca){
            ca.save();
            ca.strokeStyle = "red";
            ca.lineWidth = 4 / interval;
            ca.translate(Origin.x, Origin.y)
            ca.scale(interval, -interval)

            const graphEdge = {
                x: (-(scaleY - Origin.y) / interval - initPos) / vel,
                y: -(scaleY - Origin.y) / interval
            };
            
            ca.beginPath();
            ca.moveTo(graphEdge.x, graphEdge.y)
            for (let i = 0; i <= scaleY / interval; i++){
                ca.lineTo(graphEdge.x + i * Math.sign(vel), graphEdge.y + i*Math.abs(vel))
            }
            ca.stroke();
            ca.restore();
        }
    }   
</script>

<style>
    #graphInfos {
        text-align: left;
        font-size: 10px;
    }
    #paramA {
        margin-bottom: 10px;
    }
    label {
        margin-left: 10px;
        margin-right: 10px;
        font-size: 20px;
    }
    button {
        margin-right: 10px;
        margin-left: 10px;
        border: 1px solid black;
        font-weight: bold;
        /* font-size: 10px; */
    }
    input, button {
        height: 30px;
    }
    #graphEq {
        font-size: 30px;
    }

    #ca {
        border: 2px solid black;
    }

</style>