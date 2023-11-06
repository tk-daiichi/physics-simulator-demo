<template>
    <div class="simBody">
        <v-stage :config="stage_cfg">
            <BackGround></BackGround>
            <Coordinate></Coordinate>
            <Ball ref="ballRef"></Ball>
        </v-stage>
        <div class="control">
            <label>
                再生速度：
                <input 
                    v-model="speedInput" 
                    type="range" 
                    min="1" max="10" 
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
import { ref, onMounted } from 'vue';
import BackGround from '@/components/BackGround.vue';
import Coordinate from '@/components/Coordinate.vue';
import Ball from '@/components/Ball.vue';
import { stage_cfg } from '@/configs/stageConfig';
import { ballLauncher } from '@/animFunctions/ballLauncher';
// import { bounceBall } from '@/animFunctions/bounceBall';

const velInput = ref<number>(1)
const speedInput = ref<number>(5)
const ballRef = ref<InstanceType<typeof Ball>>();
onMounted(() => {
    fire();
});

function fire() {
    const ball = ballRef.value;
    const speed = speedInput.value;
    const velocity = velInput.value;
    if(ball && speed && velocity){
        // bounceBall(ball.ba2, stage_cfg, ball.ba2Cfg);
        ballLauncher(ball.ba1, ball.ba1Cfg, speed, velocity);
    };
};
</script>

<style>
.simBody {
    display: flex;
}
.control {
    display: block;
    /* justify-content: space-around; */
    /* align-content: center; */
    max-width: 600px;
    margin: 1em;
}
</style>