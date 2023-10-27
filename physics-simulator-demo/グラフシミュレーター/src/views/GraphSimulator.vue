<template>
    <div class="sim-body d-block d-lg-flex">
        <canvas 
            id="ca" ref="canvasRef"
            class="mb-5 mr-lg-3"
            :width=scaleX :height=scaleY 
            @mousedown = "mouseStatus = 'mousedown'"
            @mouseup   = "mouseStatus = 'mouseup'"
            @mousemove="scrollGraph">
        </canvas>
    
        <v-container id="graphInfo">
            <v-sheet id="graph1" class="mb-lg-6">
                <div class="text-h6">y=ax+bのグラフ</div>
                <v-sheet class="d-flex">
                    <div id="paramA" class="mr-2">
                        <label>
                            a：
                            <!-- <button id="parambtn" @click="() => {graph1a -= 1, paramUpdate()}">&lt;</button> -->
                            <input 
                                type="number" 
                                class="paramInput"
                                v-model="graph1a" 
                                @keydown.enter="paramUpdate"
                                @change="paramUpdate">
                            <!-- <v-btn id="parambtn" size="small" @click="() => {graph1a += 1, paramUpdate()}">&gt;</v-btn> -->
                        </label>
                    </div>
                    <div id="paramB">
                        <label>
                            b：
                            <!-- <v-btn id="parambtn" size="small" @click="() => {graph1b -= 1, paramUpdate()}">&lt;</v-btn> -->
                            <input
                                type="number"
                                class="paramInput"
                                v-model="graph1b" 
                                @keydown.enter="paramUpdate"
                                @change="paramUpdate">
                            <!-- <v-btn id="parambtn" size="small" @click="() => {graph1b += 1, paramUpdate()}">&gt;</v-btn> -->
                        </label>
                    </div>
                </v-sheet>
                <div id="graphEq">
                    グラフの式：{{ graph1Eq(graph1a, graph1b) }}
                </div>
            </v-sheet>
            <v-sheet id="graph2" class="mb-lg-6">
                <div class="text-h6">y=a(x-b)<sup>2</sup>+cのグラフ</div>
                <v-sheet class="d-flex">
                    <div id="paramA" class="mr-2">
                        <label>a：
                            <!-- <v-btn id="parambtn" @click="() => {graph2a -= 1, paramUpdate()}">&lt;</v-btn> -->
                            <input
                                type="number" 
                                class="paramInput"
                                v-model="graph2a" 
                                @keydown.enter="paramUpdate"
                                @change="paramUpdate">
                            <!-- <v-btn id="parambtn" @click="() => {graph2a += 1, paramUpdate()}">&gt;</v-btn> -->
                        </label>
                    </div>
                    <div id="paramB">
                        <label>
                            b：
                        <!-- <v-btn id="parambtn" @click="() => {graph2b -= 1, paramUpdate()}">&lt;</v-btn> -->
                        <input
                            type="number" 
                            class="paramInput"
                            v-model="graph2b" 
                            @keydown.enter="paramUpdate"
                            @change="paramUpdate">
                        <!-- <v-btn id="parambtn" @click="() => {graph2b += 1, paramUpdate()}">&gt;</v-btn> -->
                        </label>
                    </div>
                    <div id="paramC">
                        <label>c：
                            <!-- <v-btn id="parambtn" @click="() => {graph2c -= 1, paramUpdate()}">&lt;</v-btn> -->
                            <input
                                type="number" 
                                class="paramInput"
                                v-model="graph2c" 
                                @keydown.enter="paramUpdate"
                                @change="paramUpdate">
                            <!-- <v-btn id="parambtn" @click="() => {graph2c += 1, paramUpdate()}">&gt;</v-btn> -->
                        </label>
                    </div>
                </v-sheet>
                <div id="graphEq">
                    グラフの式：<span v-html="graph2Eq(graph2a, graph2b, graph2c)"></span>
                </div>
            </v-sheet>
            <v-sheet>
                <label id="intervalSlider">縮尺</label>
                <input 
                    for="intervalSlider" type="range"
                    min="5" max="200"
                    v-model="interval"
                    @input="paramUpdate()">
            </v-sheet>
        </v-container>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, reactive } from 'vue';
    import { coordinate, Origin } from '@/components/CoordinateDrawer'
    import { clearGraph, graph1Draw, graph2Draw } from '@/components/GraphDrawer'
    import { graph1Eq, graph2Eq } from '@/components/GraphEquality'

    const canvasRef = ref<HTMLCanvasElement>()

    const windowWidth   = ref<number>(window.innerWidth)
    const windowHeight   = ref<number>(window.innerHeight)
    const scaleX        = ref<number>(windowWidth.value * 0.7);
    const scaleY        = ref<number>(windowHeight.value * 0.5);
    let origin: Origin  = reactive({x: scaleX.value*0.5, y: scaleY.value*0.5});
    const interval = ref<number>(scaleY.value * 0.1);
    
    window.onresize = (() => {
        new Promise ((resolve) => {
            windowWidth.value   = window.innerWidth
            windowHeight.value  = window.innerHeight
            scaleX.value        = windowWidth.value * 0.7
            scaleY.value        = windowHeight.value * 0.5
            interval.value      = scaleY.value * 0.1;
            origin              = {x: windowWidth.value * 0.4, y: windowHeight.value * 0.4}
            resolve("");
        }).then(() => {
            paramUpdate()
        })
    })
    
    const graph1a = ref<number>(1);
    const graph1b = ref<number>(-2);
    const graph2a = ref<number>(-1)
    const graph2b = ref<number>(1)
    const graph2c = ref<number>(1)

    const paramUpdate = () => {
        const ctx = canvasRef.value?.getContext("2d")
        if(ctx){
            clearGraph(ctx, scaleX.value, scaleY.value, interval.value, origin);
            graph1Draw(ctx, scaleX.value, scaleY.value, interval.value, origin, graph1a.value, graph1b.value);
            graph2Draw(ctx, scaleX.value, scaleY.value, interval.value, origin, graph2a.value, graph2b.value, graph2c.value);
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
    /* #parambtn {
        margin-right: 10px;
        margin-left: 10px;
        font-size: 20px;
        font-weight: bold;
        min-width: 10px;
        height: 30px;
        border: 1px solid #ccc;
        background-color: #eee;
        width: em;
    } */
    .paramInput{
        width: 3em;
    }
    #graphEq {
        font-size: 20px;
    }
    #ca {
        border: 2px solid black;
        border-radius: 30px;
    }

</style>