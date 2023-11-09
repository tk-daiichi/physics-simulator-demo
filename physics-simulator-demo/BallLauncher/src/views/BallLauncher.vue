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
                    min="0.1" max="10" 
                    @change="fire"/>
            </label>
            <label>
                初速度：
                <input 
                    v-model="velInput" 
                    @change="fire"/>
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
import { ballLauncher } from '@/animFunctions/ballLauncher';
// import { bounceBall } from '@/animFunctions/bounceBall';

const velInput = ref<number>(2)
const speedInput = ref<number>(1)
const intervalInput = ref<number>(50)
const ballRef = ref<InstanceType<typeof Ball>>();

function fire() {
    const ball = ballRef.value;
    const speed = speedInput.value;
    const velocity = velInput.value;
    const interval = intervalInput.value;
    if(ball && speed && velocity && interval){
        // bounceBall(ball.ba2, stage_cfg, ball.ba2Cfg);
        ballLauncher(ball.ba1, ball.ba1Cfg, speed, velocity, interval, ball.configs);
    };
};
function zoomEvent(ev: WheelEvent) {
    intervalInput.value += ev.deltaY * -0.1;
    intervalInput.value = Math.min(Math.max(1, intervalInput.value), 100);
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