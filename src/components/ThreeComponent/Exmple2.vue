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
import { PLYLoader } from "three/addons/loaders/PLYLoader.js"

import dat from "dat.gui"

defineOptions({
  name: "Exmple2"
})

let w = 0,
  h = 0
// 创建场景
const scene = new THREE.Scene()
scene.castShadow = true
// 创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)

camera.position.set(6.312546219397561, 4.2, -2)
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
// render开启纹理阴影
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
// 添加插件
const orbitControles = new OrbitControls(camera, renderer.domElement)
orbitControles.minDistance = 2
orbitControles.maxDistance = 10
// 垂直旋转角的上限
orbitControles.maxPolarAngle = Math.PI / 2
// orbitControles.addEventListener('change', () => {
//   console.log(camera.position)
// })
// 加载模型
new PLYLoader().load("model/exmple2/Lucy100k.ply", (geometry) => {
  // 将模型缩小
  geometry.scale(0.0024, 0.0024, 0.0024)
  // 计算法向量
  geometry.computeVertexNormals()

  const lucyMaterial = new THREE.MeshLambertMaterial()
  const lucyMesh = new THREE.Mesh(geometry, lucyMaterial)

  lucyMesh.receiveShadow = true
  lucyMesh.castShadow = true
  scene.add(lucyMesh)
})

// 添加地面
const planGeometry = new THREE.PlaneGeometry(50, 50)
const planMaterial = new THREE.MeshLambertMaterial({ color: 0xbcbcbc })
const planMesh = new THREE.Mesh(planGeometry, planMaterial)
planMesh.rotation.x = -Math.PI / 2
planMesh.position.set(0, -2, 0)
planMesh.receiveShadow = true

scene.add(planMesh)

/*添加光照*/
// 添加环境光
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 0.15)
scene.add(hemisphereLight)

// 聚光灯纹理
const filenames = ["disturb.jpg", "colors.png", "uv_grid_opengl.jpg"]
const loader = new THREE.TextureLoader().setPath("model/exmple2/")
// 同时加载三个纹理
const textures = { none: null }
for (let i = 0; i < filenames.length; i++) {
  const filename = filenames[i]
  const texture = loader.load(filename)
  // 平铺
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  // 颜色空间
  texture.colorSpace = THREE.SRGBColorSpace
  textures[filename] = texture
}

// 添加聚光灯
const spotLight = new THREE.SpotLight(0xffffff, 100)
// 聚光灯位置
spotLight.position.set(2.5, 5, 2.5)
// 聚光灯的角度
spotLight.angle = Math.PI / 6
// 聚光锥的半影衰减百分比_影响圆形的模糊度
spotLight.penumbra = 1
// 沿着光照距离的衰减量
spotLight.decay = 2
spotLight.distance = 0

// 光照纹理
spotLight.map = textures["disturb.jpg"]
// 投影
spotLight.castShadow = true
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 20
spotLight.shadow.focus = 1

scene.add(spotLight)

const sportLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(sportLightHelper)

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
  .onChange(() => {})
const setAnimationLoop = () => {
  const time = performance.now() / 3000
  spotLight.position.x = Math.cos(time) * 2.5
  spotLight.position.z = Math.sin(time) * 2.5
  sportLightHelper.update()
  renderer.setSize(w, h)
  camera.updateProjectionMatrix()
  // 更新轨道控制器
  orbitControles.update()
  return renderer.render(scene, camera)
}
onMounted(() => {
  const clent = sceneRef.value.getBoundingClientRect()
  w = clent.width
  h = clent.height
  renderer.setSize(w, h)
  // 渲染动画类似requestAnimationFrame
  renderer.setAnimationLoop(setAnimationLoop)

  // 将渲染器挂载到DOM上
  sceneRef.value.appendChild(renderer.domElement)
  // 将GUI挂载到DOM
  guiRef.value?.appendChild(gui.domElement)

  // 监听窗口变化
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
