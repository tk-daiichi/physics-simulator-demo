<template>
    <h1>webGlデモ</h1>
    <canvas id="glCanvas" width="640" height="480" ref="canvas"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { initBuffers } from "@/scripts/init-buffers";
import { drawScene } from "@/scripts/draw-scene";

const canvas = ref<HTMLCanvasElement>();

let squareRotation = 0.0;
let deltaTime = 0;

onMounted(() => {
    main();
})
function main() {
    const canvasRef = canvas.value;
    if(canvasRef){
        const gl: WebGLRenderingContext | null = canvasRef.getContext("webgl");

        if(gl === null) {
            alert(
                "webGlが対応していません"
            );
            return;
        };

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const vsSource = `
            attribute vec4 aVertexPosition;
            attribute vec4 aVertexColor;

            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;

            varying lowp vec4 vColor;

            void main(void) {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vColor = aVertexColor;
            }
        `;
        const fsSource = `
            varying lowp vec4 vColor;

            void main(void) {
            gl_FragColor = vColor;
            }
        `;

        const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

        if(shaderProgram != null){
            const programInfo = {
                program: shaderProgram,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                    vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
                },
                uniformLocations: {
                    projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                    modelViewMatrix : gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
                },
            };
            const buffers = initBuffers(gl);
            let then = 0;
            function render(now:any) {
                now *= 0.001;
                deltaTime = now - then;
                then = now;
                if(gl){
                    drawScene(gl, programInfo, buffers, squareRotation);
                }
                squareRotation += deltaTime;
                requestAnimationFrame(render);
            }
            requestAnimationFrame(render);
        };
    };
};

function initShaderProgram (
    gl: WebGLRenderingContext,
    vsSource: any,
    fsSource: any
): WebGLProgram | null {
    const vertexShader   = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    if(shaderProgram && vertexShader && fragmentShader) {
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(
            `シェーダーを初期化できません: ${gl.getProgramInfoLog(
                shaderProgram,
            )}`,
        );
        return null;
    }
    };
    return shaderProgram;
};

function loadShader(
    gl: WebGLRenderingContext, 
    type: any, 
    source: any,
): WebGLShader | null {
    const shader = gl.createShader(type);
    if(shader){
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
    
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(`compile failed: ${gl.getShaderInfoLog(shader)}`);
            gl.deleteShader(shader);
            return null;
        }
    }
    return shader;
};
</script>



<style scoped>

</style>
