<template>
  <div ref="sceneRef" class="right-box">
    <!-- GUI -->
    <div ref="guiRef" id="gui" class="gui-box" />
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';


defineOptions({
  name: "Exmple5"
})

let w = 0,
  h = 0
// 创建场景
const scene = new THREE.Scene()
scene.castShadow = true
// 创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.set(10, 288, 375);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
const reRender = () => {
  return renderer.render(scene, camera)
}

// 添加插件
const orbitControles = new OrbitControls(camera, renderer.domElement)
orbitControles.maxPolarAngle = Math.PI * 0.8
orbitControles.update()


const environment = new RoomEnvironment(renderer);
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.background = new THREE.Color(0xbbbbbb);
scene.environment = pmremGenerator.fromScene(environment).texture;
environment.dispose();


const ktx2Loader = new KTX2Loader()
  .setTranscoderPath('basis/')
  .detectSupport(renderer);

const loader = new GLTFLoader().setPath('model/exmple5/');
loader.setKTX2Loader(ktx2Loader);
loader.setMeshoptDecoder(MeshoptDecoder);
loader.load('coffeemat.glb', function (gltf) {

  // coffeemat.glb was produced from the source scene using gltfpack:
  // gltfpack -i coffeemat/scene.gltf -o coffeemat.glb -cc -tc
  // The resulting model uses EXT_meshopt_compression (for geometry) and KHR_texture_basisu (for texture compression using ETC1S/BasisLZ)

  gltf.scene.position.y = -50;
  scene.add(gltf.scene);

  render();

});

// 创建地面
const grid = new THREE.GridHelper( 500, 10, 0xffffff, 0xffffff );
grid.material.opacity = 0.5;
grid.material.depthWrite = false;
grid.material.transparent = true;
grid.position.y = -50
scene.add( grid );


const sceneRef = ref()

// 添加GUI

// 创建渲染动画
const render = () => {
  requestAnimationFrame(render)

  renderer.setSize(w, h)
  camera.updateProjectionMatrix()
  reRender()

}
render()

onMounted(() => {
  const clent = sceneRef.value.getBoundingClientRect()
  w = clent.width
  h = clent.height
  renderer.setSize(w, h)
  // 渲染动画类似requestAnimationFrame

  // 将渲染器挂载到DOM上
  sceneRef.value.appendChild(renderer.domElement)
  // 将GUI挂载到DOM
  // guiRef.value?.appendChild(gui.domElement)

  // 监听窗口变化
  window.addEventListener("resize", () => {
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    reRender()
  })
})
</script>

<style scoped lang="scss">
.right-box {
  width: calc(100vw - 270px);
  height: 100%;
  position: relative;

  .gui-box {
    position: absolute;
    top: 0px;
    right: 0px;
  }
}
</style>
