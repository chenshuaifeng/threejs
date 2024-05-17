<template>
  <div id="container" ref="containerRef" />
  <button @click="handleMove">移动</button>
</template>
<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import dat from "dat.gui"

import { onMounted, ref } from "vue"
const containerRef = ref()
// 创建场景
const scene = new THREE.Scene()
// 场景颜色
// scene.background = new THREE.Color(0xffb3b3);
// 添加雾
// scene.fog = new THREE.Fog(0xcccccc, 7, 14);
// 添加场景背景纹理
// scene.background = new THREE.CubeTextureLoader().load(['snick.png', 'snick.png', 'snick.png', 'snick.png', 'snick.png','snick.png',])

// 创建相机
const perspectiveCamera = new THREE.PerspectiveCamera()
perspectiveCamera.position.z = 10
perspectiveCamera.position.y = 5

// 创建立方体
const cube = new THREE.BoxGeometry()
// 创建立方体纹理
const cubeTexture = new THREE.TextureLoader().setPath("/").load("snick.png")

// 创建立方体材质
const cubeMaterial = new THREE.MeshBasicMaterial({
  // color: 0x00ff00, // 立方体颜色
  map: cubeTexture
})
// 创建立方体网格, 并将立方体和材质加入到网格中
const cubeMesh = new THREE.Mesh(cube, cubeMaterial)
cubeMesh.position.y = 2
cubeMesh.position.x = 1
cubeMesh.position.z = 1
// cubeMesh.position.set(3, 0, 0);
// 将网格添加到场景中
scene.add(cubeMesh)

// 创建地面
const gridHelper = new THREE.GridHelper(10, 10, new THREE.Color(0xf00f0f), new THREE.Color(0xffcccc))
// 添加网格地面
scene.add(gridHelper)

// 创建位置坐标辅助线
// 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(5)
axesHelper.position.y = 1
scene.add(axesHelper)

// 创建渲染器进行渲染
const renderer = new THREE.WebGLRenderer()
renderer.setSize(1000, 500)
renderer.render(scene, perspectiveCamera)

// 创建轨道控制器
const orbitControles = new OrbitControls(perspectiveCamera, renderer.domElement)
// orbitControles.enabled = false
// 开启阻尼
orbitControles.enableDamping = true
// 设置阻尼系数
orbitControles.dampingFactor = 0.08
// 设置自动旋转
orbitControles.autoRotate = false
orbitControles.autoRotateSpeed = 1.0
// 为轨道控制器添加事件
// orbitControles.addEventListener('change', () => {
//   console.log('视角发生变化')
// })
// orbitControles.addEventListener('start', () => {
//   console.log('start')
// })
// orbitControles.addEventListener('end', () => {
//   console.log('end')
// })

const handleMove = () => {
  // 移动物体
  cubeMesh.position.set(3, 2, 0)
  perspectiveCamera.position.y = 20
  // 相机看向物体
  perspectiveCamera.lookAt(cubeMesh.position)
}

// datGUI
// 创建控制对象
const configData = {
  wireframe: false,
  color: "00b300",
  autoRotate: false,
  rotationSpeed: 0.01
}
const gui = new dat.GUI()
const guiInstance = gui.addFolder("配置")
guiInstance.add(configData, "wireframe", true)
guiInstance.add(configData, "autoRotate", true)
guiInstance.add(configData, "rotationSpeed").min(0.01).max(0.1).step(0.01)
guiInstance.domElement.id = "gui"
guiInstance.open()

// 渲染动画
const render = () => {
  requestAnimationFrame(render)
  // 给网格渲染
  // 更新数据
  orbitControles.autoRotate = configData.autoRotate
  cubeMesh.rotation.x += configData.rotationSpeed
  cubeMesh.rotation.y += configData.rotationSpeed
  cubeMesh.rotation.z += configData.rotationSpeed
  // 更新轨道控制器
  orbitControles.update()
  // 重新渲染
  renderer.render(scene, perspectiveCamera)
}
render()
// 挂载到页面
onMounted(() => {
  containerRef.value?.appendChild(guiInstance.domElement)
  containerRef.value?.appendChild(renderer.domElement)
  // 进行渲染
})
</script>
