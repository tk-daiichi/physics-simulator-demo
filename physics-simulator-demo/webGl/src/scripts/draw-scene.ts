import { mat4 } from "gl-matrix";
import { MyProgramInfo } from "@/types/programInfo";
import { MyBuffer } from "@/types/buffer";

export function drawScene(
    gl: WebGLRenderingContext,
    programInfo: MyProgramInfo,
    buffers: MyBuffer,
    texture: WebGLShader | null,
    cubeRotation: number,
) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = (45 * Math.PI) / 180;
    const canvas = gl.canvas as HTMLCanvasElement;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    const modelViewMatrix = mat4.create();

    mat4.translate(
        modelViewMatrix,
        modelViewMatrix,
        [-0.0, 0.0, -6.0],
    );

    mat4.rotate(
        modelViewMatrix,
        modelViewMatrix,
        cubeRotation,
        [0, 0, 1],
    );
    mat4.rotate(
        modelViewMatrix,
        modelViewMatrix,
        cubeRotation * 0.7,
        [0, 1, 0],
    );
    mat4.rotate(
        modelViewMatrix,
        modelViewMatrix,
        cubeRotation * 0.3,
        [1, 0, 0],
    );
    const normalMatrix = mat4.create();
    //modelViewMatrixの逆行列をnormalMatrixに代入？
    mat4.invert(normalMatrix, modelViewMatrix); 
    mat4.transpose(normalMatrix, normalMatrix);

    setPositionAttribute(gl, buffers, programInfo);
    setTextureAttribute(gl, buffers, programInfo);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    setNormalAttribute(gl, buffers, programInfo);

    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix,
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix,
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix
    );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
    
    {
        const vertexCount = 36
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
};

function setPositionAttribute(
    gl: WebGLRenderingContext,
    buffers: MyBuffer,
    programInfo: MyProgramInfo
) {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
};

// function setColorAttribute(
//     gl: WebGLRenderingContext,
//     buffers: any,
//     programInfo: any
// ) {
//     const numComponents = 4;
//     const type = gl.FLOAT;
//     const normalize = false;
//     const stride = 0;
//     const offset = 0;
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
//     gl.vertexAttribPointer(
//       programInfo.attribLocations.vertexColor,
//       numComponents,
//       type,
//       normalize,
//       stride,
//       offset,
//     );
//     gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
// };
function setTextureAttribute(
    gl: WebGLRenderingContext,
    buffers: MyBuffer,
    programInfo: MyProgramInfo
) {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
      programInfo.attribLocations.textureCoord,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
};
function setNormalAttribute(
    gl: WebGLRenderingContext,
    buffers: MyBuffer,
    programInfo: MyProgramInfo
) {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normals);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexNormal,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
};
