<template>
    <div class="sim-body">
        <canvas 
            id="ca" ref="canvasRef"
            class="mb-5 mx-3 mr-lg-3"
            :width=scaleX :height=scaleY 
            @wheel = "zoomEvent"
            @mousedown = "mouseStatus = 'mousedown'"
            @mouseup   = "mouseStatus = 'mouseup'"
            @mousemove="scrollGraph">
        </canvas>
    
        <v-container id="graphInfo" class="mx-3 pa-0">
            <v-container id="graph1" class="mb-lg-6">
                <div class="text-h6">y=ax+b</div>
                <v-sheet class="d-flex">
                    <div id="paramA" class="mr-2">
                        <label>a:
                        <input 
                            type="number" 
                            class="paramInput"
                            v-model="graph1a" 
                            @keydown.enter="paramUpdate"
                            @change="paramUpdate">
                        </label>
                    </div>
                    <div id="paramB">
                        <label>b:
                        <input
                            type="number"
                            class="paramInput"
                            v-model="graph1b" 
                            @keydown.enter="paramUpdate"
                            @change="paramUpdate">
                        </label>
                    </div>
                </v-sheet>
            </v-container>
            <v-container id="graph2" class="mb-lg-6">
                <div class="text-h6">y=a(x-b)<sup>2</sup>+c</div>
                <v-sheet class="d-flex">
                    <div id="paramA" class="mr-2">
                        <label>a:
                        <input
                            type="number" 
                            class="paramInput"
                            v-model="graph2a" 
                            @keydown.enter="paramUpdate"
                            @change="paramUpdate">
                        </label>
                    </div>
                    <div id="paramB" class="mr-2">
                        <label>b:
                        <input
                            type="number" 
                            class="paramInput"
                            v-model="graph2b" 
                            @keydown.enter="paramUpdate"
                            @change="paramUpdate">
                        </label>
                    </div>
                    <div id="paramC">
                        <label>c:
                        <input
                            type="number" 
                            class="paramInput"
                            v-model="graph2c" 
                            @keydown.enter="paramUpdate"
                            @change="paramUpdate">
                        </label>
                    </div>
                </v-sheet>
            </v-container>
        </v-container>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, reactive } from 'vue';
    import { coordinate, Origin } from '@/components/CoordinateDrawer';
    import { clearGraph, graph1Draw, graph2Draw } from '@/components/GraphDrawer';

    const canvasRef = ref<HTMLCanvasElement>();

    const windowWidth  = ref<number>(window.innerWidth);
    const windowHeight = ref<number>(window.innerHeight)
    const scaleX       = ref<number>(windowWidth.value * 0.9);
    const scaleY       = ref<number>(windowHeight.value * 0.7);
    const interval     = ref<number>(Math.max(scaleX.value, scaleY.value) * 0.1);
    
    if(windowWidth.value <= 400) { 
        scaleY.value = windowHeight.value * 0.5;
        interval.value = Math.max(scaleX.value, scaleY.value) * 0.2; 
    }
    let origin: Origin  = reactive({x: scaleX.value * 0.4, y: scaleY.value * 0.4});
    
    window.onresize = (() => {
        new Promise ((resolve) => {
            windowWidth.value   = window.innerWidth;
            windowHeight.value  = window.innerHeight;
            scaleX.value        = windowWidth.value * 0.9;
            scaleY.value        = windowHeight.value * 0.6;
            interval.value      = Math.max(scaleX.value, scaleY.value) * 0.1; 
            // if(windowWidth.value <= 400) {
            //     scaleY.value    = windowHeight.value * 0.5;
            //     interval.value  = Math.max(scaleX.value, scaleY.value) * 0.2; 
            // }
            origin = {x: windowWidth.value * 0.4, y: windowWidth.value * 0.4};
            resolve("");
        }).then(() => {
            paramUpdate();
        })
    })
    
    const graph1a = ref<number>(1);
    const graph1b = ref<number>(-2);
    const graph2a = ref<number>(2)
    const graph2b = ref<number>(1)
    const graph2c = ref<number>(-2)

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
    const scrollGraph = ((ev: MouseEvent) => {
        if (mouseStatus.value == "mousedown"){
            origin.x += ev.movementX;
            origin.y += ev.movementY;
            const ctx = canvasRef.value?.getContext("2d")
            if(ctx){
                paramUpdate()
            }
        }
    })
    const zoomEvent = ((ev: WheelEvent) => {
        ev.preventDefault();
        interval.value += ev.deltaY * -0.1

        interval.value = Math.min(Math.max(50,interval.value), 200)

        const ctx = canvasRef.value?.getContext("2d")
        if(ctx){
            paramUpdate()
        }
    })

</script>

<style>
    .sim-body {
        text-align: left;
    }
    #ca {
        border: 2px solid black;
        border-radius: 10px;
    }
    @media (min-width: 1100px) {
        #ca {
            max-width: 80vw;
        }
    }

    #graphInfo {
        font-size: 1.2em;
        border: .05em solid #555;
        max-width: 90vw;
        max-height: 20em;
    }
    .paramInput{
        width: 3em;
        padding-left: .2em;
        border: .05em solid #555;
    }
</style>