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
const coordinate = (interval: number) => {
    lines.splice(0);
    lines.push(
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
    );
    for(let i = 1; i <= 10; i++){
        lines.push({
            x: origin.x + i*(50 + interval%100),
            y:0, 
            strokeWidth: 1, 
            stroke:'rgba(0,0,0,0.5)', 
            points: [0,0,0,stage_cfg.height],
        });
        lines.push({
            x: origin.x + i*(50 + interval%100), 
            y:0, 
            strokeWidth: 2, 
            stroke:'rgba(0,0,0,1)', 
            points: [0,origin.y-10,0,origin.y+10],
        });
        lines.push({
            x: 0, 
            y: origin.y + i*(50 + interval%100), 
            strokeWidth: 1, 
            stroke:'rgba(0,0,0,0.5)', 
            points: [0,0,stage_cfg.width,0],
        });
        lines.push({
            x: 0, 
            y: origin.y + i*(50 + interval%100), 
            strokeWidth: 2, 
            stroke:'rgba(0,0,0,1)', 
            points: [origin.x-10,0,origin.x+10,0],
        });
    };
};

const scale = (interval: number) => {
    texts.splice(0);
    texts.push(
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
    );
    const index = (i: number) => {
        if(interval <= 50){
            return i;
        } else if(interval <= 150){
            return i*Math.round(interval/50);
        } else {
            return i*Math.round(interval/50);
        }
    }; 
    for (let i = 1; i <= 10; i++) {
        texts.push(
            {
                x: origin.x + i*(50 + interval%100) - 60,
                y: origin.y,
                text: `${index(i)}`,
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
                y: origin.y + i*(50 + interval%100) ,
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
};

onMounted(() => {
    console.log(Number(props.modelValue))
    coordinate(Number(props.modelValue));
    scale(Number(props.modelValue));
})

watchEffect(() => {
    coordinate(Number(props.modelValue));
    scale(Number(props.modelValue));
})
</script>