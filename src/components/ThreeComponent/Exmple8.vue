<template>
  <div ref="sceneRef" class="right-box">
    <!-- GUI -->
    <div ref="guiRef" id="gui" class="gui-box" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import { FontLoader } from "three/addons/loaders/FontLoader.js"
import { TextGeometry } from 'three/examples/jsm/Addons.js'
import dat from "dat.gui"

defineOptions({
  name: "Exmple8"
})

let w = 0, h = 0, clent: any
// 创建场景
const scene = new THREE.Scene()
// 值为Color
scene.background = new THREE.Color(0xcccccc);

// 创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  // camera.position.set( 0, 400, 700 );
  camera.position.set(0, 0, 20)


// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio);
// 调整渲染器配置
renderer.render(scene, camera)

// 实例化轨道控制器
const orbitControles = new OrbitControls(camera, renderer.domElement)

/**向场景中添加物体 */

// 打光
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
dirLight.position.set(0, 0, -1)
scene.add(dirLight)
const pointLight = new THREE.PointLight(0xffffff, 2, 0, 0);
pointLight.color.setHSL(Math.random(), 1, 0.5);
pointLight.position.set(0, 5, 5);
scene.add(pointLight);

const fontMap = ['helvetiker', 'optimer', 'gentilis', 'droid/droid_sans', 'droid/droid_serif']
let fontName = 'optimer'
let fontWeight = 'bold'
let font: any
let text = 'Hellor' // 文字
let size = 70
let bevelThickness = 2
let height = 20
let curveSegments = 4
let bevelSize = 1.5
let bevelEnabled = true

let group = new THREE.Group()
scene.add(group);

// 动态加载字体
const loaderFont = () => {
  const fontLoader = new FontLoader()
  fontLoader.load('fonts/' + fontName + '_' + fontWeight + '.typeface.json', function (response) {
    font = response
    // 创建字体
    createText()
  });
}
loaderFont()
// 两种材质
let materials = [
  new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
  new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
]

// 动态创建字体
const createText = () => {
  // group.remove( textMesh1 );
  // if ( mirror ) group.remove( textMesh2 );
  // if ( ! text ) return;

  const fontGeometry = new TextGeometry(text, {
    font: font,
    size: size,
    height: height,
    curveSegments: curveSegments,
    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelEnabled: bevelEnabled
  })

  const textMesh = new THREE.Mesh(fontGeometry, materials)
  textMesh.scale.set(0.08, 0.08, 0.08)
  textMesh.position.x = -10
  textMesh.position.y = -2
  textMesh
  group.add(textMesh)

}

const axisHelper = new THREE.AxesHelper(8)
scene.add(axisHelper)

const sceneRef = ref()
const guiRef = ref()

function animate() {
  requestAnimationFrame( animate );
  orbitControles.update()
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
  renderer.render( scene, camera );
}
animate()



// 监听窗口变化
window.addEventListener("resize", () => {
  w = clent.width
  h = clent.height
  camera.aspect = w / h
  renderer.setSize(w, h)
  camera.updateProjectionMatrix()
})
onMounted(() => {
  clent = sceneRef.value.getBoundingClientRect()
  w = clent.width
  h = clent.height
  renderer.setSize(w, h)
  // 将渲染器挂载到DOM上
  sceneRef.value.appendChild(renderer.domElement)
  // 将GUI挂载到DOM
  // guiRef.value?.appendChild(setupGui().domElement)


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
