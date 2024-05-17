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
import TWEEN from "three/addons/libs/tween.module.js"

import dat from "dat.gui"

defineOptions({
  name: "Exmple3"
})

let w = 0,
  h = 0
// 创建场景
const scene = new THREE.Scene()
scene.castShadow = true
// 创建相机
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 2000)

camera.position.set(1.38, 2.54, -4.14)
// camera.position.set(-0.15, 0.65, -1.5);
// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
const reRender = () => {
  return renderer.render(scene, camera)
}

// 添加插件
const orbitControles = new OrbitControls(camera, renderer.domElement)
orbitControles.maxPolarAngle = Math.PI / 2
orbitControles.minDistance = 1
orbitControles.maxDistance = 10
orbitControles.target.set(0, 0.5, 0)
orbitControles.update()

orbitControles.addEventListener("change", () => {
  console.log(camera.position)
})
// 添加立方体
const cubeGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.2)
// 添加立方体高光材质
const phongMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa })
// 添加网格立方体
const cubeMesh = new THREE.Mesh(cubeGeometry, phongMaterial)
cubeMesh.position.y = 0.5
cubeMesh.castShadow = true
cubeMesh.receiveShadow = true
scene.add(cubeMesh)

// 添加地面
const planGeometry = new THREE.PlaneGeometry(100, 100)
const planMaterial = new THREE.MeshPhongMaterial({
  color: 0x808080,
  side: THREE.DoubleSide
})
const planMesh = new THREE.Mesh(planGeometry, planMaterial)
planMesh.rotation.x = -Math.PI / 2
planMesh.position.set(0, -0.05, 0)
planMesh.receiveShadow = true
scene.add(planMesh)

// 添加环境光
const ambientLight = new THREE.AmbientLight(0x444444)
scene.add(ambientLight)

// 批量创建聚光灯
const createSpotLight = (color) => {
  const spotLight = new THREE.SpotLight(color, 10)
  spotLight.castShadow = true
  spotLight.angle = 0.3
  spotLight.penumbra = 0.8
  spotLight.distance = 50
  spotLight.decay = 2
  return spotLight
}
const spotLight1 = createSpotLight(0xff7f00)
spotLight1.position.set(1.5, 4, 4.5)
scene.add(spotLight1)
// 聚光灯辅助
const sportLightHelper1 = new THREE.SpotLightHelper(spotLight1)
scene.add(sportLightHelper1)

const spotLight2 = createSpotLight(0x00ff7f)
spotLight2.position.set(0, 4, 3.5)
scene.add(spotLight2)
// 聚光灯辅助
const sportLightHelper2 = new THREE.SpotLightHelper(spotLight2)
scene.add(sportLightHelper2)

const spotLight3 = createSpotLight(0x7f00ff)
spotLight3.position.set(-1.5, 4, 4.5)
scene.add(spotLight3)
// 聚光灯辅助
const sportLightHelper3 = new THREE.SpotLightHelper(spotLight3)
scene.add(sportLightHelper3)

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

// 创建渲染动画
const render = () => {
  requestAnimationFrame(render)
  renderer.setSize(w, h)
  camera.updateProjectionMatrix()

  TWEEN.update()
  if (sportLightHelper1) sportLightHelper1.update()
  if (sportLightHelper2) sportLightHelper2.update()
  if (sportLightHelper3) sportLightHelper3.update()
  reRender()
}

function tween(light) {
  new TWEEN.Tween(light)
    .to(
      {
        angle: Math.random() * 0.7 + 0.1,
        penumbra: Math.random() + 1
      },
      Math.random() * 3000 + 2000
    )
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()
  new TWEEN.Tween(light.position)
    .to(
      {
        x: Math.random() * 3 - 1.5,
        y: Math.random() * 1 + 1.5,
        z: Math.random() * 3 - 1.5
      },
      Math.random() * 3000 + 2000
    )
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()
}
function animate() {
  tween(spotLight1)
  tween(spotLight2)
  tween(spotLight3)
  setTimeout(animate, 5000)
}

render()

onMounted(() => {
  const clent = sceneRef.value.getBoundingClientRect()
  w = clent.width
  h = clent.height
  renderer.setSize(w, h)
  animate()
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
