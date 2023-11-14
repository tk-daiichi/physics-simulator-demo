export function initBuffers(gl: WebGLRenderingContext) {
    const positionBuffer = initPositionBuffer(gl);
    const textureCoordBuffer = initTextureBuffer(gl);
    const indexBuffer = initIndexBuffer(gl);
    const normalBuffer = initNormalBuffer(gl);

    return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
        indices: indexBuffer,
        normals: normalBuffer,
    };
};

function initPositionBuffer(gl: WebGLRenderingContext) {
    const positions = [
        // 前面
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
        // 背面
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0,
        // 上面
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
        // 底面
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        // 右側面
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
        // 左側面
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ];
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    return positionBuffer;
};

// function initColorBuffer(gl: WebGLRenderingContext) {
//     const colors = [
//         [1.0, 1.0, 1.0, 1.0], // 前面: 白
//         [1.0, 0.0, 0.0, 1.0], // 背面: 赤
//         [0.0, 1.0, 0.0, 1.0], // 上面: 緑
//         [0.0, 0.0, 1.0, 1.0], // 底面: 青
//         [1.0, 1.0, 0.0, 1.0], // 右側面: 黄
//         [1.0, 0.0, 1.0, 1.0], // 左側面: 紫
//     ]
//     let generatedColors: number[] = [];
//     for (let j=0; j<6; j++){
//         let c = colors[j];
//         generatedColors = generatedColors.concat(c,c,c,c);
//     };
//     const colorBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatedColors), gl.STATIC_DRAW);

//     return colorBuffer;
// };

function initIndexBuffer(gl: WebGLRenderingContext) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    const indices = [
        0,1,2,0,2,3, // 前面
        4,5,6,4,6,7, // 背面
        8,9,10,8,10,11, // 上面
        12,13,14,12,14,15, // 底面
        16,17,18,16,18,19, // 右側面
        20,21,22,20,22,23, // 左側面
    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return indexBuffer;
};
function initTextureBuffer(gl: WebGLRenderingContext) {
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    const textureCoordinates = [
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ]

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(textureCoordinates),
        gl.STATIC_DRAW,
    );
    return textureCoordBuffer;
};

function initNormalBuffer(gl: WebGLRenderingContext) {
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    const normals = [
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,        
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    return normalBuffer;
}