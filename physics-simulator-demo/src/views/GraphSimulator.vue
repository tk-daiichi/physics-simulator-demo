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
                グラフの式：{{ graph1Eq(graph1a, graph1b) }}
            </div>
        </div>
        
        <div id="graph2">
            <h2>y=a(x-b)<sup>2</sup>+cのグラフ</h2>
            <div id="paramA">
                <label id="param">a</label>
                <button @click="() => {graph2a -= 1, paramUpdate()}">&lt;</button>
                <input
                    for="param" type="number" 
                    v-model="graph2a" 
                    @keydown.enter="paramUpdate"
                    @change="paramUpdate">
                <button @click="() => {graph2a += 1, paramUpdate()}">&gt;</button>
            </div>
            <div id="paramB">
                <label id="param">b</label>
                <button @click="() => {graph2b -= 1, paramUpdate()}">&lt;</button>
                <input
                    for="param" type="number" 
                    v-model="graph2b" 
                    @keydown.enter="paramUpdate"
                    @change="paramUpdate">
                <button @click="() => {graph2b += 1, paramUpdate()}">&gt;</button>
            </div>
            <div id="paramC">
                <label id="param">c</label>
                <button @click="() => {graph2c -= 1, paramUpdate()}">&lt;</button>
                <input
                    for="param" type="number" 
                    v-model="graph2c" 
                    @keydown.enter="paramUpdate"
                    @change="paramUpdate">
                <button @click="() => {graph2c += 1, paramUpdate()}">&gt;</button>
            </div>
            <div id="graphEq">
                グラフの式：<span v-html="graph2Eq(graph2a, graph2b, graph2c)"></span>
            </div>
        </div>
        <div>
            <label id="intervalSlider">縮尺</label>
            <input 
                for="intervalSlider" type="range"
                min="50" max="200"
                v-model="interval"
                @input="paramUpdate()"
            >
        </div>
    </div>

    <br>
    <canvas 
        id="ca" ref="canvasRef" 
        :width=scaleX :height=scaleY 
        @mousedown = "mouseStatus = 'mousedown'"
        @mouseup   = "mouseStatus = 'mouseup'"
        @mousemove="scrollGraph"
    >
    </canvas>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { coordinate, Origin } from '@/components/CoordinateDrawer'
    import { clearGraph, graph1Draw, graph2Draw } from '@/components/GraphDrawer'
    import { graph1Eq, graph2Eq } from '@/components/GraphEquality'

    const canvasRef = ref<HTMLCanvasElement>()

    let origin: Origin = {x: 500, y: 500};

    const scaleX = 1000;
    const scaleY = 600;

    const interval = ref<number>(100);

    const graph1a = ref<number>(1);
    const graph1b = ref<number>(-2);
    const graph2a = ref<number>(-1)
    const graph2b = ref<number>(1)
    const graph2c = ref<number>(1)

    const paramUpdate = () => {
        const ctx = canvasRef.value?.getContext("2d")
        if(ctx){
            clearGraph(ctx, scaleX, scaleY, interval.value, origin);
            graph1Draw(ctx, scaleX, scaleY, interval.value, origin, graph1a.value, graph1b.value);
            graph2Draw(ctx, scaleX, scaleY, interval.value, origin, graph2a.value, graph2b.value, graph2c.value);
        }
    }

    onMounted(() => {
        const ctx = canvasRef.value?.getContext("2d")
        if(ctx){
            paramUpdate();
        }
    });


    const mouseStatus = ref<string>("")
    const scrollGraph   = ((ev: MouseEvent) => {
        if (mouseStatus.value == "mousedown"){
            origin.x += ev.movementX;
            origin.y += ev.movementY;
            const ctx = canvasRef.value?.getContext("2d")
            if(ctx){
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
    #paramA, #paramB{
        margin-bottom: 10px;
    }
    #paramA, #paramB, #paramC {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
    }
    label {
        width: 10px;
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