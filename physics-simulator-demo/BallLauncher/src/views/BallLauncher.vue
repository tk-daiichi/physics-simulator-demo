<template>
    <div class="simBody">
        <div @wheel="zoomEvent">
            <v-stage :config="stage_cfg">
                <BackGround></BackGround>
                <Coordinate v-model.number=intervalInput ></Coordinate>
                <Ball v-model="intervalInput" ref="ballRef"></Ball>
            </v-stage>
        </div>
        <div class="control">
            <label>
                再生速度：
                <input 
                    v-model="speedInput" 
                    type="range" 
                    min="0.5" max="3" 
                    />
            </label>
            <label>
                初速度：
                <input 
                    v-model="velInput" 
                    />
            </label>
            <button @click="fire">発射！</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BackGround from '@/components/BackGround.vue';
import Coordinate from '@/components/Coordinate.vue';
import Ball from '@/components/Ball.vue';
import { stage_cfg } from '@/configs/stageConfig';
import { ballLauncher, ballTrack } from '@/animFunctions/ballLauncher';

const velInput = ref<number>(2)
const speedInput = ref<number>(1)
const intervalInput = ref<number>(70)
const ballRef = ref<InstanceType<typeof Ball>>();
    
function fire() {
    const ball = ballRef.value;
    const speed = speedInput.value;
    const velocity = velInput.value;
    const interval = intervalInput.value;
    if(ball && speed && velocity && interval){
        ballLauncher(ball.ba1, ball.ba1Cfg, speed, velocity, interval, ball.configs);
    };
};
function zoomEvent(ev: WheelEvent) {
    intervalInput.value += ev.deltaY * -0.1;
    intervalInput.value = Math.min(Math.max(10, intervalInput.value), 100);
    const ball = ballRef.value;
    const interval = intervalInput.value;
    if(ball){
        const configs = ball.configs;
        configs.forEach((el) => {
            configs.push(ballTrack(el.config, el.velocity, interval));
            configs.splice(configs.indexOf(el), 1)
        });
    };
};
</script>

<style>
.simBody {
    display: flex;
}
.control {
    display: block;
    max-width: 600px;
    margin: 1em;
}
</style>