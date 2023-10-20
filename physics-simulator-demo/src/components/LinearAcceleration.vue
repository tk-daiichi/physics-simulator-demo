<template>
    <div id="graphInfo">
        <div id="graph1">
            <div id="paramA">
                <label id="initPos">a</label>
                <button id="" @click="paramADecrease()">&lt;</button>
                <input
                    for="initPos" type="number" 
                    v-model="graph1a" 
                    @keydown.enter="drawGraph"
                    @change="drawGraph">
                <button @click="paramAIncrease()">&gt;</button>
            </div>
            <div id="paramB">
                <label id="vel">b</label>
                <button @click="paramBDecrease()">&lt;</button>
                <input 
                    for="vel" type="number" 
                    v-model="graph1b" 
                    @keydown.enter="drawGraph"
                    @change="drawGraph">
                <button @click="paramBIncrease()">&gt;</button>
            </div>
            <div id="graphEq">
                グラフの式：y={{ graph1aParam }}x{{ graph1bParam }}
            </div>
        </div>

        <div id="graph2">
            <div id="paramA">
                <label id="graph2Param"></label>
                <button @click="graph2Decrease()">&lt;</button>
                <input
                    for="graph2Param" type="number" 
                    v-model="graph2Param" 
                    @keydown.enter="drawGraph"
                    @change="drawGraph">
                <button @click="graph2Increase()">&gt;</button>
            </div>
            <div id="graphEq">
                グラフの式：y={{ graph2Param }}x<sup>2</sup>
            </div>
        </div>
        <div>
            <label id="intervalSlider">縮尺</label>
            <input 
                for="intervalSlider" type="range"
                min="50" max="200"
                v-model="interval"
                @input="scaleUpdate()"
            >
        </div>
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

    let Origin = {x: 500, y: 500};

    const scaleX = 1000;
    const scaleY = 600;

    const interval = ref<number>(100);

    const graph1a = ref<number>(1);
    const graph1b = ref<number>(-2);
    const graph2Param = ref<number>(2)

    onMounted(() => {
        coordinate();
        drawGraph();
    });

    function drawGraph() {
        clearGraph();
        graph1Draw();
        graph2Draw();
    }

    const graph1aParam = computed(() => {
        const sign = (graph1b.value >= 0) ? "" : "-"
        if( graph1b.value !== 0){
            return Math.abs(graph1b.value) == 1 ? sign : sign + Math.abs(graph1b.value)
        } else {
            return "";
        }
    })
    const graph1bParam = computed(() => {
        const sign = (graph1a.value > 0) ? "+" : "-"
        return !!(graph1a.value) ?  sign + Math.abs(graph1a.value) : ""
    })


    const scaleUpdate = (() => {
        drawGraph()
    })
    const paramAIncrease = (() => {
        graph1a.value += 1;
        drawGraph()
    })
    const paramADecrease = (() => {
        graph1a.value -= 1;
        drawGraph()
    })
    const paramBIncrease = (() => {
        graph1b.value += 1;
        drawGraph()
    })
    const paramBDecrease = (() => {
        graph1b.value -= 1;
        drawGraph()
    })
    const graph2Increase = (() => {
        graph2Param.value += 1;
        drawGraph()
    })
    const graph2Decrease = (() => {
        graph2Param.value -= 1;
        drawGraph()
    })

    function graph2Draw() {
        const ca = caRef.value?.getContext("2d")

        if(ca){
            ca.save();
            ca.strokeStyle = "red";
            ca.lineWidth = 4 / interval.value;

            ca.translate(Origin.x, Origin.y)
            ca.scale(interval.value, -interval.value)
            
            const startX = Math.sqrt(Math.abs((-Origin.y+scaleY)/graph2Param.value))

            const positionY = ((i:number) => {
               return Math.abs(graph2Param.value*Math.pow(i+0.1, 2));
            })

            ca.beginPath();
            for(let i = -Math.abs(startX); positionY(i) < Math.abs(scaleY - Origin.y); i+=0.1){
                ca.moveTo(i,     graph2Param.value*Math.pow(i, 2))
                ca.lineTo(i+0.1, graph2Param.value*Math.pow(i+0.1, 2))  
            }
            ca.stroke();
            ca.restore();
        }
    }   

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
            graph1Draw();
            graph2Draw();
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

            for(let i = 0; i <= scaleX / interval.value; i++){
                ca.beginPath()
                ca.setLineDash([10,10])
                ca.strokeStyle = "rgba(0,0,0,0.3)"
                ca.moveTo(Origin.x % interval.value + i * interval.value, 0)
                ca.lineTo(Origin.x % interval.value + i * interval.value, scaleY)
                ca.moveTo(0,      Origin.y % interval.value + i * interval.value)
                ca.lineTo(scaleX, Origin.y % interval.value + i * interval.value)
                ca.stroke()


                const coordinateXIndex = i - Math.trunc(Origin.x / interval.value);
                const coordinateYIndex = i - Math.trunc(Origin.y / interval.value);
                
                ca.save()
                ca.beginPath()
                ca.strokeStyle = "rgba(0,0,0,1)"
                ca.lineWidth = 4
                ca.setLineDash([])
                if (coordinateXIndex != 0){
                    ca.moveTo(Origin.x % interval.value + i * interval.value, Origin.y - 10);
                    ca.lineTo(Origin.x % interval.value + i * interval.value, Origin.y + 10);
                }
                if (coordinateYIndex != 0) {
                    ca.moveTo(Origin.x - 10, Origin.y % interval.value + i * interval.value);
                    ca.lineTo(Origin.x + 10, Origin.y % interval.value + i * interval.value);
                }
                ca.stroke()
                ca.restore()

                ca.font = "25px serif"
                
                if(coordinateXIndex !== 0){
                    ca.textBaseline = "top"
                    ca.textAlign = "center"
                    ca.fillText(
                        `${coordinateXIndex}`, 
                        Origin.x % interval.value + i*interval.value, 
                        Origin.y + 10)
                }
                if(coordinateYIndex !== 0){
                    ca.textBaseline = "middle"
                    ca.textAlign = "right"
                    ca.fillText(
                        `${-coordinateYIndex}`, 
                        Origin.x - 10, 
                        Origin.y % interval.value + i*interval.value)
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

    function graph1Draw(){
        const ca = caRef.value?.getContext("2d")
        const initPos = graph1a.value
        const vel = graph1b.value

        if(ca){
            ca.save();
            ca.strokeStyle = "red";
            ca.lineWidth = 4 / interval.value;
            
            /**
             * グラフの端点の座標を算出　translate, scaleでの変換後の座標であることに注意
             * x座標はグラフの式から計算している
             * あらかじめtranslateとscaleで変換しておくとグラフの式がそのまま使えて良い
            */
            ca.translate(Origin.x, Origin.y)
            ca.scale(interval.value, -interval.value)
            const graphStart = {
                x: (-(scaleY - Origin.y) / interval.value - initPos) / vel,
                y: -(scaleY - Origin.y) / interval.value
            };
            const graphEnd = {
                x: (Origin.y / interval.value - initPos) / vel,
                y: Origin.y / interval.value
            };
            
            ca.beginPath();
            ca.moveTo(graphStart.x, graphStart.y)
            ca.lineTo(graphEnd.x, graphEnd.y)
            ca.stroke();
            ca.restore();
        }
    }   
</script>

<style>
    #graphInfo {
        display: flex;
    }
    #graph1 {
        /* display: inline-flex; */
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