<template>
    <div class="sim-body">
        <h1>グラフシミュレータ</h1>
        <!-- <div>width:{{ windowWidth }}, origin:{{ origin }}, scale:{{ scaleX }}, {{ scaleY }}</div> -->
        <canvas 
            id="ca" ref="canvasRef"
            class=""
            :width=scaleX :height=scaleY 
            @mousedown = "mouseStatus = 'mousedown'"
            @mouseup   = "mouseStatus = 'mouseup'"
            @mousemove="scrollGraph">
        </canvas>
    
        <div id="graphInfo">
            <div id="graph1">
                <h2 class="mb-2">y=ax+bのグラフ</h2>
                <div id="paramA">
                    <label id="param">a</label>
                    <v-btn id="parambtn" @click="() => {graph1a -= 1, paramUpdate()}">&lt;</v-btn>
                    <input 
                        for="param" type="number" 
                        id="paramInput"
                        v-model="graph1a" 
                        @keydown.enter="paramUpdate"
                        @change="paramUpdate">
                    <v-btn id="parambtn" @click="() => {graph1a += 1, paramUpdate()}">&gt;</v-btn>
                </div>
                <div id="paramB">
                    <label id="param">b</label>
                    <v-btn id="parambtn" @click="() => {graph1b -= 1, paramUpdate()}">&lt;</v-btn>
                    <input
                        for="param" type="number"
                        id="paramInput"
                        v-model="graph1b" 
                        @keydown.enter="paramUpdate"
                        @change="paramUpdate">
                    <v-btn id="parambtn" @click="() => {graph1b += 1, paramUpdate()}">&gt;</v-btn>
                </div>
                <div id="graphEq">
                    グラフの式：{{ graph1Eq(graph1a, graph1b) }}
                </div>
            </div>
            
            <div id="graph2">
                <h2>y=a(x-b)<sup>2</sup>+cのグラフ</h2>
                <div id="paramA">
                    <label id="param">a</label>
                    <v-btn id="parambtn" @click="() => {graph2a -= 1, paramUpdate()}">&lt;</v-btn>
                    <input
                        for="param" type="number" 
                        id="paramInput"
                        v-model="graph2a" 
                        @keydown.enter="paramUpdate"
                        @change="paramUpdate">
                    <v-btn id="parambtn" @click="() => {graph2a += 1, paramUpdate()}">&gt;</v-btn>
                </div>
                <div id="paramB">
                    <label id="param">b</label>
                    <v-btn id="parambtn" @click="() => {graph2b -= 1, paramUpdate()}">&lt;</v-btn>
                    <input
                        for="param" type="number" 
                        id="paramInput"
                        v-model="graph2b" 
                        @keydown.enter="paramUpdate"
                        @change="paramUpdate">
                    <v-btn id="parambtn" @click="() => {graph2b += 1, paramUpdate()}">&gt;</v-btn>
                </div>
                <div id="paramC">
                    <label id="param">c</label>
                    <v-btn id="parambtn" @click="() => {graph2c -= 1, paramUpdate()}">&lt;</v-btn>
                    <input
                        for="param" type="number" 
                        id="paramInput"
                        v-model="graph2c" 
                        @keydown.enter="paramUpdate"
                        @change="paramUpdate">
                    <v-btn id="parambtn" @click="() => {graph2c += 1, paramUpdate()}">&gt;</v-btn>
                </div>
                <div id="graphEq">
                    グラフの式：<span v-html="graph2Eq(graph2a, graph2b, graph2c)"></span>
                </div>
            </div>
    
            <div>
                <label id="intervalSlider">縮尺</label>
                <input 
                    for="intervalSlider" type="range"
                    min="5" max="200"
                    v-model="interval"
                    @input="paramUpdate()">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, reactive } from 'vue';
    import { coordinate, Origin } from '@/components/CoordinateDrawer'
    import { clearGraph, graph1Draw, graph2Draw } from '@/components/GraphDrawer'
    import { graph1Eq, graph2Eq } from '@/components/GraphEquality'

    const canvasRef = ref<HTMLCanvasElement>()

    const windowWidth   = ref<number>(window.innerWidth)
    const scaleX        = ref<number>(windowWidth.value * 0.8);
    const scaleY        = ref<number>(windowWidth.value * 0.7);
    let origin: Origin  = reactive({x: scaleX.value*0.5, y: scaleY.value*0.5});
    
    window.onresize = (() => {
        new Promise ((resolve) => {
            windowWidth.value   = window.innerWidth
            scaleX.value        = windowWidth.value * 0.8
            scaleY.value        = windowWidth.value * 0.7
            origin              = {x: windowWidth.value * 0.4, y: windowWidth.value * 0.4}
            resolve("");
        }).then(() => {
            paramUpdate()
        })
    })
    const interval = 100;
    
    const graph1a = ref<number>(1);
    const graph1b = ref<number>(-2);
    const graph2a = ref<number>(-1)
    const graph2b = ref<number>(1)
    const graph2c = ref<number>(1)

    const paramUpdate = () => {
        const ctx = canvasRef.value?.getContext("2d")
        if(ctx){
            clearGraph(ctx, scaleX.value, scaleY.value, interval, origin);
            graph1Draw(ctx, scaleX.value, scaleY.value, interval, origin, graph1a.value, graph1b.value);
            graph2Draw(ctx, scaleX.value, scaleY.value, interval, origin, graph2a.value, graph2b.value, graph2c.value);
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
    .sim-body {
        text-align: left;
    }
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
    #parambtn {
        margin-right: 10px;
        margin-left: 10px;
        font-size: 20px;
        font-weight: bold;
        min-width: 10px;
        height: 30px;
        border: 1px solid #ccc;
        background-color: #eee;
    }
    #paramInput{
        width: 80px;
        height: 30px;
        font-size: 20px;
        padding-left: 3px;
        border: 1px solid black;
    }
    #graphEq {
        font-size: 20px;
    }
    #ca {
        border: 2px solid black;
        border-radius: 30px;
    }

</style>