<template>
    <v-layer>
        <v-circle :config="ba1Cfg" ref="ba1"/>
        <v-circle :config="ba2Cfg" ref="ba2"/>
    </v-layer>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import Konva from 'konva';
    import { origin } from '@/configs/origin'

    const ba1 = ref<Konva.Circle>();
    const ba2 = ref<Konva.Circle>();
    const ba1Cfg = {
        x: origin.x,
        y: origin.y,
        radius: 15,
        fill: "rgba(200,0,0,1)",
        stroke: "rgba(200,0,0,1)",
        strokeWidth: 1,
        draggable: true,
    }
    const ba2Cfg = {
        x: origin.x,
        y: origin.y,
        radius: 15,
        // fill: "rgba(0,0,255,1)",
        stroke: "black",
        strokeWidth: 1,
        draggable: true,
    }
    defineExpose({
        ba1,
        ba2,
        ba1Cfg,
        ba2Cfg,
    });
</script>