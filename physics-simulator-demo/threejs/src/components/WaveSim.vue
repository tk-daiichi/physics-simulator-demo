<template>
    <div ref="container" class="container"></div>
    <div id="info">control panel</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const container = ref<HTMLElement>();
const scene = new THREE.Scene();
const group = new THREE.Group();
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
const origin = new THREE.Vector3(0,0,0);
const controls = new OrbitControls(camera, renderer.domElement);


//GUI用パラメータ
const props = {
    time: 0,
    maxTime: 8,
    unit: 0.25,
    gridSize: 8,
    俯瞰: function() {camera.position.set(6,10,11)},
    ytグラフ: function() {camera.position.set(-4, 0.5, 1)},
    starter: function() {onTogglePlay()},
};

//y = sin(2i)　振幅amplitude
const amplitude = 0.6;
const wLength = 2;

//表示範囲
const range = props.gridSize;

//座標空間へのクリッピングマスク
const clipx0 = new THREE.Plane(new THREE.Vector3(1, 0, 0));
const clipxz = new THREE.Plane(new THREE.Vector3(-1, 0, 1));
const clipT  = new THREE.Plane(new THREE.Vector3(0, 0, -1));

// const animStop = ref<boolean>(true);
const graph = graphDrawer();
group.add(graph);
const value = [0, 0, 0, props.gridSize, 0, props.gridSize];
const positionKF = new THREE.VectorKeyframeTrack(".position", [0, props.maxTime], value);
const moveObjectClip = new THREE.AnimationClip(
    `move-object`,
    -1,
    [positionKF]
);
const mixer = new THREE.AnimationMixer(graph);
const action = mixer.clipAction(moveObjectClip);

function initGui() {
    const gui = new GUI({container: container.value, width: 320});
    gui.add(props, "time", 0, props.gridSize, 0.01)
        .onChange(value => {onTimeControl(value)})
        .listen();
    // gui.add(props, "maxTime", 0.5, 5, 0.01)
    // gui.add(props, "unit"   , 0  , 1, 0.01)
    gui.add(props, "俯瞰")
    gui.add(props, "ytグラフ")
    gui.add(props, "starter").name("一時停止/再生")
};
initGui();

onMounted(() => {
    init();
});

function init(){
    initCoordinate();

    camera.position.set(6,10,11); //俯瞰
    camera.lookAt(0, 0, 3);
    scene.add(camera);

    scene.add(ambientLight);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.localClippingEnabled = true;
    container.value?.appendChild(renderer.domElement);

    window.onresize = (() => {
        const {innerWidth, innerHeight} = window;
        renderer.setSize(innerWidth, innerHeight);
        container.value?.appendChild(renderer.domElement);        
        camera.aspect = innerWidth / innerHeight;
    }); 

    scene.add(group);

    //波の完成形を表示した状態に初期化
    addWave(props.gridSize, [clipxz, clipx0, clipT]);

    animate();
};
function animate(callback? : () => void){
    const frame = (() => {
        controls.update();
        if(callback){
            callback();
        }
        requestAnimationFrame(frame);
        renderer.render(scene, camera);
    });
    frame();
};

function addWave(time: number, clips: THREE.Plane[]) {
    clipT.set(new THREE.Vector3(0,0,-1), time);
    const tracex0 = graphTrace(props.gridSize, 0.8, "rgb(220, 150, 150)", [clipT, clipxz]);
    tracex0.forEach((el) => {
        const x0cross = el.clone().rotateY(Math.PI * 0.5);
        group.add(x0cross);
    });

    for(let z = 0; z <= props.gridSize; z += props.unit){
        const trace = graphTrace(z, 0.3, "rgb(220,220,150)", clips);
        trace.forEach((el) => {
            group.add(el);
        });
    };
};

const called = ref<boolean>(false);
function onTogglePlay() {
    if(called.value == false) {
        moveGraph();
        called.value = true
    } else if (!action.enabled || props.time == props.gridSize) {
        action.reset();
    } else {
        action.paused = !action.paused;
    }
};
function onTimeControl(value: number) {
    if(called.value == false){
        moveGraph();
        called.value = true;
    };
    if(!action.enabled){
        action.reset();
    }
    action.paused = true;
    action.time = value;
};

function moveGraph() {
    action.setLoop(THREE.LoopOnce, 0)
    action.play();
    const clock = new THREE.Clock();
    animate(() => {
        mixer.update(clock.getDelta());
        const actionTime = Math.min(action.time, props.gridSize)
        clipT.set(new THREE.Vector3(0,0,-1), actionTime);
        props.time = actionTime;
    });
};


function graphDrawer() {
    const geometry = new THREE.BufferGeometry();
    const points = [];
    for(let i = 0; i < range; i += 0.1){
        points.push(new THREE.Vector3(i, Math.sin(i * wLength) * amplitude, 0));
    };
    geometry.setFromPoints(points);
    geometry.rotateY(Math.PI);
    const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        clippingPlanes: [clipx0, clipxz, clipT],
    });
    return new THREE.Line(geometry, material);
};

function graphTrace(z: number, opacity: number, color: string, clips: THREE.Plane[]) {
    const colors = new THREE.Color(color);
    const trace: THREE.Mesh[] = [];
    const halfWave = (2 * Math.PI) / wLength / 2;

    /**
     *  sin波を一山ごと描画してtraceにpushする　以下のfor文全体で特定の時間tにおける軌跡一つ分
     * 一連の処理は、z=t平面上で実行されていることに留意する
     * animationがx=z方向に進行する
     * 原点開始の上昇波として初期化したいので、y軸に対してpi分だけ回転している
    */
    for(let i = 0; i * halfWave < range; i++) {
        const shape = new THREE.Shape(); 

        //次の山の開始位置補正　-zはanimationの処理とy軸半回転の兼ね合い
        const offset = halfWave * i - z ;

        shape.moveTo(offset, 0);
        const amp = i % 2 === 0 ? amplitude : -amplitude;
        const points: THREE.Vector2[] = [
                new THREE.Vector2(offset + halfWave/2, amp),
                new THREE.Vector2(offset + halfWave, 0),
        ];
        shape.splineThru(points);

        const geometry = new THREE.ShapeGeometry(shape);
        geometry.rotateY(Math.PI)

        const material = new THREE.MeshPhongMaterial({
            transparent: true,
            opacity: opacity,
            color: colors,
            side: THREE.DoubleSide,
            clippingPlanes: clips,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = z;
        trace.push(mesh);
    };
    return trace;
};
function initCoordinate(): void {
    const dirX = new THREE.Vector3(1, 0, 0);
    const dirY = new THREE.Vector3(0, 1, 0);
    const dirZ = new THREE.Vector3(0, 0, 1);
    const axisX = new THREE.ArrowHelper(dirX, origin, props.gridSize + 5);
    const axisY = new THREE.ArrowHelper(dirY, origin, props.gridSize + 5);
    const axisZ = new THREE.ArrowHelper(dirZ, origin, props.gridSize + 5);
    scene.add(axisX, axisY, axisZ);

    scene.background = new THREE.Color(0x222255);
    const gridSize = props.gridSize;
    const grid = new THREE.GridHelper(gridSize, gridSize / props.unit, 0x888888);
    grid.position.set(gridSize / 2, 0, gridSize / 2);
    scene.add(grid);
};

</script>

<style>
#info {
    position: absolute;
    display: block;
    text-align: right;
    top: 10px;
    z-index: 5;
    width: 90%;
    margin-right: 10px;
    color: white;
}
</style>