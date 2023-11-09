<template>
    <v-layer>
        <div v-for="(line) in lines" :key="line">
            <v-line :config="line"></v-line>
        </div>
        <div v-for="(text) in texts" :key="text">
            <v-text :config="text"></v-text>
        </div>
    </v-layer>
</template>

<script setup lang="ts">
import { stage_cfg } from '@/configs/stageConfig';
import { origin } from '@/configs/origin';
import { 
    watchEffect,
    reactive 
} from 'vue';
import { onMounted } from 'vue';
interface Props {
    modelValue: number | string,
}
const props = defineProps<Props>();

const lines: any[] = reactive([]);
const texts: any[] = reactive([]);
const altInt = (i: number, interval: number) => {
    if(interval <= 40) {
        return i * interval * 5;
    } else {
        return i * interval;
    }
}

const coordinate = (interval: number) => {
    lines.splice(0);
    lines.push({   
        x: 0, y: 0,
        strokeWidth: 2,
        stroke: "black",
        points: [
            0, origin.y,
            stage_cfg.width, origin.y,
            origin.x, origin.y,
            origin.x, 0,
            origin.x, stage_cfg.height,
        ],
    });
    for(let i = 1; i*interval <= stage_cfg.width; i++){
        lines.push({
            x: origin.x + altInt(i,interval), y: 0, 
            strokeWidth: 1, 
            stroke:'rgba(0,0,0,0.5)', 
            points: [0,0,0,stage_cfg.height],
        });
        lines.push({
            x: 0, y: origin.y + altInt(i,interval), 
            strokeWidth: 1, 
            stroke:'rgba(0,0,0,0.5)', 
            points: [0,0,stage_cfg.width,0],
        });
    };
};

const scale = (interval: number) => {
    texts.splice(0);
    const index = (i:number) => {
        return interval <= 40 ? i*5 : i
    };
    texts.push({
        x: origin.x - 80, y: origin.y,
        text: "O",
        fontSize: 18,
        fontFamily: 'serif',
        fill: '#555',
        width: 100,
        padding: 0,
        align: 'center',
    },);
    for (let i = 1; i*interval <= stage_cfg.width; i++) {
        texts.push({
            x: origin.x + altInt(i,interval) - 60, y: origin.y,
            text: `${index(i)}`,
            fontSize: 18,
            fontFamily: 'serif',
            fill: '#555',
            width: 100,
            padding: 0,
            align: 'center',
        });
        texts.push({
            x: origin.x - 60, y: origin.y + altInt(i,interval) ,
            text: `${index(i)}`,
            fontSize: 18,
            fontFamily: 'serif',
            fill: '#555',
            width: 100,
            padding: 0,
            align: 'center',
        });
    };
};

onMounted(() => {
    coordinate(Number(props.modelValue));
    scale(Number(props.modelValue));
})

watchEffect(() => {
    coordinate(Number(props.modelValue));
    scale(Number(props.modelValue));
})
</script>