<template>
  <div ref="sceneRef" class="right-box">
    <!-- GUI -->
    <div ref="guiRef" id="gui" class="gui-box" />
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import { LightProbeGenerator } from "three/addons/lights/LightProbeGenerator.js"
import dat from "dat.gui"

defineOptions({
  name: "Exmple1"
})

let w = 0,
  h = 0
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
camera.position.set(0, 0, 30)
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true
})

// 调整渲染器配置
renderer.render(scene, camera)

// 添加插件
const orbitControles = new OrbitControls(camera, renderer.domElement)
orbitControles.enableDamping = true

// 光照探针
let lightProbe: any
// 环境纹理
// 环境盒子纹理的数据是一个数组[左右，上下、前后]
const cubeTexture = new THREE.CubeTextureLoader()
  .setPath("texture/exmple1/")
  .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"], (cubeTexture) => {
    // 添加光照探灯生成器
    const lightProbeOrign = LightProbeGenerator.fromCubeTexture(cubeTexture)
    lightProbe = new THREE.LightProbe()
    lightProbe.copy(lightProbeOrign)
    scene.add(lightProbe)
  })

// 添加平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.intensity = 1
directionalLight.position.set(-10, 15, 0)
scene.add(directionalLight)

scene.background = cubeTexture
// 添加圆
const sphereGeometry = new THREE.SphereGeometry(5, 32, 32)
// 添加材质
const sphereMaterail = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  envMap: cubeTexture,
  envMapIntensity: 1,
  roughness: 0,
  metalness: 0.2
})
// 添加网格物体
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterail)
scene.add(sphereMesh)

const reRender = () => {
  renderer.render(scene, camera)
}
// 创建渲染动画
const render = () => {
  requestAnimationFrame(render)
  renderer.setSize(w, h)
  camera.updateProjectionMatrix()
  // 更新轨道控制器
  orbitControles.update()
  // 重新渲染页面
  reRender()
}
render()

const sceneRef = ref()
const guiRef = ref()

// 添加GUI
const gui = new dat.GUI()
gui.addFolder("threjs配置").open()
// threejs中需要使用到内部的值
const configData = {
  roughness: 0,
  metalness: 0.2,
  lightProbeIntensity: 1,
  directionalLight: 0.6
}
gui
  .add(configData, "roughness", 0, 1, 0.01)
  .name("roughness")
  .onChange(() => {
    sphereMaterail.roughness = configData.roughness
    reRender()
  })
gui
  .add(configData, "metalness", 0, 1, 0.01)
  .name("metalness")
  .onChange(() => {
    sphereMaterail.metalness = configData.metalness
    reRender()
  })
gui
  .add(configData, "lightProbeIntensity", 0, 1, 0.01)
  .name("lightProbe")
  .onChange(() => {
    lightProbe.intensity = configData.lightProbeIntensity
    reRender()
  })
gui
  .add(configData, "directionalLight", 0, 1, 0.01)
  .name("directionalLight")
  .onChange(() => {
    directionalLight.intensity = configData.directionalLight
    reRender()
  })
onMounted(() => {
  const clent = sceneRef.value.getBoundingClientRect()
  w = clent.width
  h = clent.height
  renderer.setSize(w, h)
  // 将渲染器挂载到DOM上
  sceneRef.value.appendChild(renderer.domElement)
  // 将GUI挂载到DOM
  guiRef.value?.appendChild(gui.domElement)

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
  background-color: pink;
  position: relative;
  .gui-box {
    position: absolute;
    top: 0px;
    right: 0px;
  }
}
</style>
