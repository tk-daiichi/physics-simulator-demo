<template>
    x:{{ posX }}, y:{{ posY }}
    <!-- <div id="container"></div> -->
    <div class="sim-body">
        <v-stage :config="stage_cfg" ref="stage" class="stage">
            <v-layer :config="layer_cfg" ref="back_layer"><v-rect :config="bgRect_cfg"/></v-layer>
            <v-layer :config="layer_cfg" ref="cor_layer">
                <!-- <v-line :config="coordinate_cfg"></v-line> -->
            </v-layer>
            <v-layer :config="layer_cfg" ref="ball_layer">
                <v-circle 
                    :config="circle_cfg" ref="circle">
                </v-circle>
            </v-layer>
        </v-stage>
    </div>
</template>

<script setup lang="ts">
    import { 
        ref, 
        onMounted, 
    } from 'vue';
    import Konva from 'konva'

    const stage = ref<Konva.Stage>()
    const cor_layer = ref<Konva.Layer>()
    const ball_layer = ref<Konva.Layer>()
    const circle = ref<Konva.Circle>()

    const posX = ref<number>()
    const posY = ref<number>()
    onMounted(() => {
        if(circle.value) {
            // @ts-ignore
            const circleNode = circle.value.getNode()

            let positionX = circle_cfg.x                    
            let positionY = circle_cfg.y

            const period: number = 3;
            let velX = 10 / period;
            let velY = velX;

            let anim = new Konva.Animation(function(frame) {
                if(frame){
                    let borderXl = positionX - circle_cfg.radius + velX;
                    let borderXr = positionX + circle_cfg.radius + velX;
                    if(borderXl > 0 && borderXr < stage_cfg.width){
                    } else if(borderXl <= 0){
                        velX = frame.timeDiff / period;
                    } else if (borderXr >= stage_cfg.width) {
                        velX = -frame.timeDiff / period;
                    };
                    
                    let borderYt = positionY - circle_cfg.radius + velY;
                    let borderYb = positionY + circle_cfg.radius + velY;
                    if(borderYt > 0 && borderYb < stage_cfg.height){
                    } else if(borderYt <= 0){
                        velY = frame.timeDiff / period;
                    } else if (borderYb >= stage_cfg.height) {
                        velY = -frame.timeDiff / period;
                    };

                    positionX += velX;
                    positionY += velY;
                    circleNode.setX(positionX);
                    circleNode.setY(positionY);
                    posX.value = Math.round(positionX);
                    posY.value = Math.round(positionY);
                };
            }, circleNode.getLayer());
            anim.start();
        }
    })
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const stage_cfg = { width: width*0.5, height: height*0.7 };
    const layer_cfg = { 
        x:0,
        y:0,
    }
    const bgRect_cfg = {
        x: 0,
        y: 0,
        width: stage_cfg.width,
        height: stage_cfg.height,
        fill: 'rgba(0,0,0,0.2)'
    }
    const circle_cfg = {
        x: 100,
        y: 500,
        radius: 30,
        fill: "rgba(100,200,120,0.2)",
        stroke: "black",
        strokeWidth: 1,
        draggable: true,
    }
</script>

<style>
    .sim-body {
      text-align: left;
    }
</style>