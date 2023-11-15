export type MyProgramInfo = {
    program: WebGLProgram | null,
    attribLocations: {
        vertexPosition: number,
        textureCoord: number,
        vertexNormal: number
    },
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation | null,
        modelViewMatrix : WebGLUniformLocation | null,
        normalMatrix    : WebGLUniformLocation | null,
        uSampler        : WebGLUniformLocation | null,
    },
};