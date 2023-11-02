<template>
    <v-layer :config="layer_cfg" ref="cor_layer">
        <v-line :config="coordinate_cfg"></v-line>
    </v-layer>
</template>

<script setup lang="ts">
import { stage_cfg } from '@/configs/stageConfig';
const layer_cfg = { 
    x: 0,
    y: 0,
}
const origin = {x: 50, y: 50};

const coordinate_cfg = {
    x: 0,
    y: 0,
    stroke: "black",
    strokeWidth: 2,
    points: [
        0, origin.y, 
        stage_cfg.width, origin.y,
        origin.x, origin.y,
        origin.x, 0,
        origin.x, stage_cfg.height,
    ],
}

</script>