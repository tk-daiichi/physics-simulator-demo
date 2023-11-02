<template>
    <v-layer :config="layer_cfg">
        <v-rect :config="bgRect_cfg"/>
    </v-layer>
</template>

<script setup lang="ts">
    import { stage_cfg } from '@/configs/stageConfig';
    const layer_cfg = { 
        x: 0,
        y: 0,
    }
    const bgRect_cfg = {
        x: 0,
        y: 0,
        width: stage_cfg.width,
        height: stage_cfg.height,
        fill: 'rgba(200,220,220,0.5)'
    }
</script>