<template>
    <v-layer ref="baLayer">
        <v-circle :config="ba1Cfg" ref="ba1"/>
        <v-line :config="config" v-for="config in configs"></v-line>
    </v-layer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import Konva from 'konva';
import { origin } from '@/configs/origin'
import { GraphTrack } from '@/configs/track';

const ba1 = ref<Konva.Circle>();
const baLayer = ref<Konva.Layer>();
const ba1Cfg = reactive({
    x: origin.x,
    y: origin.y,
    radius: 15,
    fill: "rgba(200,0,0,1)",
    stroke: "rgba(200,0,0,1)",
    strokeWidth: 1,
    draggable: true,
});
const configs = reactive<GraphTrack[]>([]);

defineExpose({
    ba1,
    ba1Cfg,
    configs,
    baLayer,
});
</script>