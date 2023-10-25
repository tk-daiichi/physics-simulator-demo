<template>
    <h1>ingicator</h1>

    <div id="datas">
        <form @submit.prevent>
            <label>
                入力欄：
                <input 
                    placeholder="整数を入力" 
                    v-model="suuji" 
                    type = "text"
                    @input.prevent="showIngicator()">
            </label>
        </form>
        <div>桁数：{{ digitCounter }}</div>
    </div>
    <canvas 
        :width=width :height=height 
        id="canvas" ref="canvasRef">
    </canvas>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { drawIngicator } from '../components/DrawIngicator'

    const canvasRef = ref<HTMLCanvasElement>();
    const width = 1000;
    const height = 500;
    const suuji = ref<string>();
    let digitCounter = ref<number>()

    onMounted(() => {
        showIngicator();
    })

    const showIngicator = (() => {
        const ctx = canvasRef.value?.getContext("2d")
        const data: number[] = []
        if(suuji.value){
            for (let i = 0; i < suuji.value.length; i++){
                if(!isNaN( Number(suuji.value[i]) )) {
                    data.push(Number(suuji.value[i]))
                }
            }
        }
        if (ctx) {
            drawIngicator(ctx, data, width, height);
        }
        digitCounter.value = data.length ?? 0;
    })  
</script>

<style>
    #datas {
        background-color: #eee;
        max-width: 10;
        text-align: left;
    }

    canvas {
        border: 10px, solid, black;
        background-color: #ccc;
    }
</style>