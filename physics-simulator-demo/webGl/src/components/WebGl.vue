<template>
    <h1>webGlデモ</h1>
    <canvas id="glCanvas" width="640" height="480" ref="canvas"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { initBuffers } from "@/scripts/init-buffers";
import { drawScene } from "@/scripts/draw-scene";
import { vsSource, fsSource } from "@/shaders/shaders"

const canvas = ref<HTMLCanvasElement>();

let cubeRotation = 0.0;
let deltaTime = 0;

onMounted(() => {
    main();
})
function main() {
    const canvasRef = canvas.value;
    if(canvasRef){
        const gl: WebGLRenderingContext | null = canvasRef.getContext("webgl");

        if(gl === null) {
            alert("webGlが対応していません");
            return;
        };

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

        if(shaderProgram != null){
            const programInfo = {
                program: shaderProgram,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                    textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
                    vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
                },
                uniformLocations: {
                    projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                    modelViewMatrix : gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
                    normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
                    uSampler: gl.getUniformLocation(shaderProgram, "uSampler")
                },
            };
            const buffers = initBuffers(gl);
            const texture = loadTexture(gl, "src/assets/yoshi.jpg");
            // const texture = loadTexture(gl, "src/assets/cubetexture.png");
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

            let then = 0;
            function render(now: number) {
                now *= 0.001;
                deltaTime = now - then;
                then = now;
                if(gl){
                    drawScene(gl, programInfo, buffers, texture, cubeRotation);
                }
                cubeRotation += deltaTime;
                requestAnimationFrame(render);
            }
            requestAnimationFrame(render);
        };
    };
};

function initShaderProgram (
    gl: WebGLRenderingContext,
    vsSource: string,
    fsSource: string
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
    type: number, 
    source: string,
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
function loadTexture(
    gl: WebGLRenderingContext, 
    url: string,
): WebGLShader | null {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);

    gl.texImage2D(
        gl.TEXTURE_2D,
        level, internalFormat,
        width, height,
        border,
        srcFormat, srcType,
        pixel,
    );
    const image = new Image();
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            srcFormat,
            srcType,
            image,
        );
        if(isPowerOf2(image.width) && isPowerOf2(image.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.src = url;

    return texture;
};
function isPowerOf2(value: number) {
    return (value & (value - 1)) === 0;
}
</script>



<style scoped>

</style>
