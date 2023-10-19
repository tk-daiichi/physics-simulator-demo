<template>
    <h1>y=ax+bのグラフ</h1>
    <p class="input">
        <div>
            <label id="initPos">a = </label>
            <input
                for="initPos" 
                v-model="initPosition" 
                type="number" 
                @keydown.enter="linearFunc()"
                @change="linearFunc"
                >
            </div>
            <div>
                <label id="vel">b = </label>
                <input 
                for="vel"
                v-model="velocity" 
                type="number" 
                @keydown.enter="linearFunc()"
                @change="linearFunc"
            >
        </div>
    </p>
    <p class="buttns">
        <button @click="linearFunc()">描画</button>
        <button @click="clearGraph()">消去</button>
    </p>
    <p id="graphEq">
        グラフの式：y={{ velPara }}x{{ initPosPara }}
    </p>
    <div width="200">
        mouseEventの状態：{{ mouseEventText }}
    </div>
    <div width="200">
        mouseDownPosition：{{ mouseDownPosition }}
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

    const linewidth = 4 / interval;

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

    onMounted(() => {
        coordinate()
        linearFunc()
    });


    const mouseEventText = ref<string>("")
    const mouseDownPosition = reactive({x: 0, y: 0});
    const mousedown = ((ev: MouseEvent) => {
        mouseDownPosition.x = ev.clientX;
        mouseDownPosition.y = ev.clientY;
        mouseEventText.value = "mousedown"
    })
    const mouseup   = () => mouseEventText.value = "mouseup"

    /**
     * mouseDownPositionとmousemoveイベントの位置を取得する
     * それぞれcanvas上の座標に変換する
     * それらのx,y座標の変化量をそれぞれ求める
     * yの変化量は符号を反転させる
     * Origin.x, Origin.yの現在の量にそれらを足す
     * 
     * いつも一方向に動かすわけじゃないしだめ
     * そもそも、変化量がその都度加算されていくから
     * すごい勢いで彼方にスクロールされた
     */

    function scrollGraph(ev: MouseEvent) {
        const ca = caRef.value?.getContext("2d")

        const dx = ev.movementX;
        const dy = ev.movementY;

        if (mouseEventText.value == "mousedown" ){
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
            ca.lineWidth = 4;
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
            ca.font = "20px serif"
            ca.textBaseline = "top"

            for(let i = - (scaleX / interval); i <= scaleX / interval; i++){
                ca.beginPath()
                ca.moveTo(Origin.x + interval + i*interval, 0)
                ca.lineTo(Origin.x + interval + i*interval, scaleY)
                ca.moveTo(0,      Origin.y + interval + i*interval)
                ca.lineTo(scaleX, Origin.y + interval + i*interval)
                ca.stroke()
                const coordinateXIndex = Math.floor(i + 1)
                const coordinateYIndex = Math.floor(i + 1)

                if(coordinateXIndex !== 0){
                    ca.textAlign = "right"
                    ca.fillText(
                        `${coordinateXIndex}`, 
                        Origin.x + interval + i*interval - 5, 
                        Origin.y)
                }
                if(coordinateYIndex !== 0){
                    ca.textAlign = "left"
                    ca.fillText(
                        `${-coordinateYIndex}`, 
                        Origin.x + 5, 
                        Origin.y + interval + i*interval + 5)
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
            ca.lineWidth = linewidth;
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
    .input, .buttns { 
        text-align: left;
    }
    #ca {
        border: 2px solid black;
    }
    #graphEq {
        text-align: left;
        font-size: 30px;
    }
</style>