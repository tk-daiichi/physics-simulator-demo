<template>
    <button @click="fire">発射！</button>
    <v-stage :config="stage_cfg">
        <BackGround></BackGround>
        <Coordinate></Coordinate>
        <Ball ref="ballRef"></Ball>
    </v-stage>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BackGround from '@/components/BackGround.vue';
import Coordinate from '@/components/Coordinate.vue';
import Ball from '@/components/Ball.vue';
import { stage_cfg } from '@/configs/stageConfig';
import { ballLauncher } from '@/animFunctions/ballLauncher';
import { bounceBall } from '@/animFunctions/bounceBall';

const ballRef = ref<InstanceType<typeof Ball>>();
onMounted(() => {
    fire();
});

function fire() {
    const ball = ballRef.value;
    if(ball){
        bounceBall(ball.ba2, stage_cfg, ball.ba2Cfg);
        ballLauncher(ball.ba1, ball.ba1Cfg);
    };
};
</script>

<style>

</style>