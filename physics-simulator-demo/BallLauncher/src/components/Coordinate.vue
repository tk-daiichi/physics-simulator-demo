<template>
    <v-layer>
        <div v-for="(line) in lines">
            <v-line :config="line"></v-line>
        </div>
        <div v-for="(text) in texts">
            <v-text :config="text"></v-text>
        </div>
    </v-layer>
</template>

<script setup lang="ts">
import { stage_cfg } from '@/configs/stageConfig';
import { origin } from '@/configs/origin';

const lines: any[] = [
    {
        x: 0,
        y: 0,
        strokeWidth: 2,
        stroke: "black",
        points: [
            0, origin.y, 
            stage_cfg.width, origin.y,
            origin.x, origin.y,
            origin.x, 0,
            origin.x, stage_cfg.height,
        ],
    }
];
for(let i = 1; i <= 10; i++){
    lines.push({
        x: origin.x + i*100, 
        y:0, 
        strokeWidth: 1, 
        stroke:'rgba(0,0,0,0.5)', 
        points: [0,0,0,stage_cfg.height]
    });
    lines.push({
        x: origin.x + i*100, 
        y:0, 
        strokeWidth: 2, 
        stroke:'rgba(0,0,0,1)', 
        points: [0,origin.y-10,0,origin.y+10]
    });
    lines.push({
        x: 0, 
        y: origin.y + i*100, 
        strokeWidth: 1, 
        stroke:'rgba(0,0,0,0.5)', 
        points: [0,0,stage_cfg.width,0]
    });
    lines.push({
        x: 0, 
        y: origin.y + i*100, 
        strokeWidth: 2, 
        stroke:'rgba(0,0,0,1)', 
        points: [origin.x-10,0,origin.x+10,0]
    });
};

const texts = [
    {
        x: origin.x - 80,
        y: origin.y,
        text: "O",
        fontSize: 18,
        fontFamily: 'serif',
        fill: '#555',
        width: 100,
        padding: 0,
        align: 'center',
    },
];
for (let i = 1; i <= 10; i++) {
    texts.push(
        {
            x: origin.x + i*100 - 60,
            y: origin.y,
            text: `${i}`,
            fontSize: 18,
            fontFamily: 'serif',
            fill: '#555',
            width: 100,
            padding: 0,
            align: 'center',
        }
    );
    texts.push(
        {
            x: origin.x - 60,
            y: origin.y + i*100 ,
            text: `${i}`,
            fontSize: 18,
            fontFamily: 'serif',
            fill: '#555',
            width: 100,
            padding: 0,
            align: 'center',
        }
    );
};
</script>