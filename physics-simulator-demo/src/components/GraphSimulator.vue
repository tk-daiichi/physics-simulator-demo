<template>
    <h1>グラフシミュレータ</h1>

    <div id="graphInfo">
        <div id="graph1">
            <h2>y=ax+bのグラフ</h2>
            <div id="paramA">
                <label id="param">a</label>
                <button @click="() => {graph1a -= 1, paramUpdate()}">&lt;</button>
                <input 
                    for="param" type="number" 
                    v-model="graph1a" 
                    @keydown.enter="paramUpdate"
                    @change="paramUpdate">
                <button @click="() => {graph1a += 1, paramUpdate()}">&gt;</button>
            </div>
            <div id="paramB">
                <label id="param">b</label>
                <button @click="() => {graph1b -= 1, paramUpdate()}">&lt;</button>
                <input
                    for="param" type="number" 
                    v-model="graph1b" 
                    @keydown.enter="paramUpdate"
                    @change="paramUpdate">
                <button @click="() => {graph1b += 1, paramUpdate()}">&gt;</button>
            </div>
            <div id="graphEq">
                グラフの式：y={{ graph1aParam }}x{{ graph1bParam }}
            </div>
        </div>
        
        <div id="graph2">
            <h2>y=ax<sup>2</sup>のグラフ</h2>
            <div id="paramA">
                <label id="param">a</label>
                <button @click="() => {graph2Param -= 1, paramUpdate()}">&lt;</button>
                <input
                    for="param" type="number" 
                    v-model="graph2Param" 
                    @keydown.enter="paramUpdate"
                    @change="paramUpdate">
                <button @click="() => {graph2Param += 1, paramUpdate()}">&gt;</button>
            </div>
            <div id="graphEq">
                グラフの式：y={{ graph2aParam }}x<sup>2</sup>
            </div>
        </div>
        <div>
            <label id="intervalSlider">縮尺</label>
            <input 
                for="intervalSlider" type="range"
                min="50" max="200"
                v-model="interval"
                @input="() => paramUpdate()"
            >
        </div>
    </div>

    <br>
    <canvas 
        id="ca" ref="canvasRef" 
        :width=scaleX :height=scaleY 
        @mousedown="mousedown"
        @mouseup="mouseup"
        @mousemove="scrollGraph"
    >
    </canvas>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed, reactive } from 'vue';
    import { coordinate, Origin } from './CoordinateDrawer'
    import { clearGraph, graph1Draw, graph2Draw } from './GraphDrawer'

    const canvasRef = ref<HTMLCanvasElement>()

    let origin: Origin = {x: 500, y: 500};

    const scaleX = 1000;
    const scaleY = 600;

    const interval = ref<number>(100);

    const graph1a = ref<number>(1);
    const graph1b = ref<number>(-2);
    const graph2Param = ref<number>(2)

    const graph1aParam = computed(() => {
        const sign = (graph1a.value >= 0) ? "" : "-"
        if(graph1a.value !== 0){
            return Math.abs(graph1a.value) == 1 ? sign : sign + Math.abs(graph1a.value)
        } else {
            return "";
        }
    })

    const graph1bParam = computed(() => {
        const sign = (graph1b.value > 0) ? "+" : "-"
        return !!(graph1b.value) ?  sign + Math.abs(graph1b.value) : ""
    })
    const graph2aParam = computed(() => {
        const sign = (graph2Param.value >= 0) ? "" : "-"
        if( graph2Param.value !== 0){
            return Math.abs(graph2Param.value) == 1 ? sign : sign + Math.abs(graph2Param.value)
        } else {
            return "";
        }
    })

    onMounted(() => {
        const ctx = canvasRef.value?.getContext("2d")
        if(ctx){
            coordinate(ctx, scaleX, scaleY, interval.value, origin);
            paramUpdate();
        }
    });

    const paramUpdate = () => {
        const ctx = canvasRef.value?.getContext("2d")
        if(ctx){
            clearGraph(ctx, scaleX, scaleY, interval.value, origin);
            graph1Draw(ctx, scaleX, scaleY, interval.value, origin, graph1a.value, graph1b.value);
            graph2Draw(ctx, scaleX, scaleY, interval.value, origin, graph2Param.value);
        }
    }

    const mouseStatus = ref<string>("")
    const mouseup       = () => mouseStatus.value = "mouseup"
    const mousedown     = () => mouseStatus.value = "mousedown"
    const scrollGraph   = ((ev: MouseEvent) => {
        if (mouseStatus.value == "mousedown"){
            origin.x += ev.movementX;
            origin.y += ev.movementY;
            const ctx = canvasRef.value?.getContext("2d")
            if(ctx){
                coordinate(ctx, scaleX, scaleY, interval.value, origin);
                paramUpdate()
            }
        }
    })

</script>

<style>
    #graphInfo {
        display: flex;
        justify-content: space-around;
    }
    #graph1, #graph2 {
        text-align: left;
    }
    #paramA {
        margin-bottom: 10px;
    }
    #paramA, #paramB {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        font-size: 10px;
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
        background-color: #eee;
    }
    input{
        height: 30px;
        font-size: 20px;
    }
    #graphEq {
        font-size: 20px;
    }
    #ca {
        border: 2px solid black;
        border-radius: 30px;
    }

</style>