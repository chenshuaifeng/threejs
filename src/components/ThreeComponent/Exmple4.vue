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
import { Water } from "three/examples/jsm/Addons.js"
import { Sky } from "three/examples/jsm/Addons.js"
import dat from "dat.gui"

defineOptions({
  name: "Exmple4"
})

let w = 0,
  h = 0
// 创建场景
const scene = new THREE.Scene()
scene.castShadow = true
// 创建相机
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2000)
camera.position.set(37, 25, 107)

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.5
const reRender = () => {
  return renderer.render(scene, camera)
}

// 添加插件
const orbitControles = new OrbitControls(camera, renderer.domElement)
orbitControles.maxPolarAngle = Math.PI * 0.4
orbitControles.update()
// orbitControles.addEventListener('change', () => {
//   console.log(camera.position)
// })

/**添加水 */
// 水法线纹理贴图
const waterNormalsTexture = new THREE.TextureLoader().setPath('texture/exmple3/').load('waternormals.jpg', (texture) => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
})
// 添加水面几何体
const waterPlanGeometry = new THREE.PlaneGeometry(10000, 10000)
const water = new Water(waterPlanGeometry, {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: waterNormalsTexture,
  sunDirection: new THREE.Vector3(),
  sunColor: 0xffffff,
  waterColor: 0x001e0f,
  distortionScale: 3.7,
  fog: scene.fog !== undefined

})
water.rotation.x = - Math.PI / 2;
scene.add(water)

/**天空 */
const sky = new Sky()
// 放大倍数
sky.scale.setScalar(10000);

const skyUniforms = sky.material.uniforms;
skyUniforms['turbidity'].value = 10;
skyUniforms['rayleigh'].value = 2;
skyUniforms['mieCoefficient'].value = 0.005;
skyUniforms['mieDirectionalG'].value = 0.8;

const pmremGenerator = new THREE.PMREMGenerator(renderer);
const parameters = {
  elevation: 2, // 高度
  azimuth: 180 // 方位角
};
const sun = new THREE.Vector3();
let renderTarget
function updateSun() {

  // 数学方法
  // 维度角
  const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
  // 经度角
  const theta = THREE.MathUtils.degToRad(parameters.azimuth);

  //从球坐标（Spherical Coordinates）设置Vector3对象的方法
  // radius（半径）：从原点（0, 0, 0）到点的距离。
  // phi（纬度角）：从正z轴到点的线段与xy平面的夹角，取值范围为0到π（0到180度）。
  // theta（经度角）：从正x轴逆时针旋转到xy平面上从原点到点的线段所经过的角度，取值范围为0到2π（0到360度）
  sun.setFromSphericalCoords(1, phi, theta);

  sky.material.uniforms['sunPosition'].value.copy(sun);
  water.material.uniforms['sunDirection'].value.copy(sun).normalize();

  if (renderTarget !== undefined) renderTarget.dispose();

  renderTarget = pmremGenerator.fromScene(sky);
  scene.environment = renderTarget.texture;
}

updateSun();
scene.add(sky)

// 添加立方体
const cubeGeometry = new THREE.BoxGeometry(30, 30, 30)
const cubeMaterail = new THREE.MeshStandardMaterial({
  roughness: 0
})
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterail)
cubeMesh.position.y = 20

scene.add(cubeMesh)

const sceneRef = ref()
const guiRef = ref()

// 添加GUI
const gui = new dat.GUI()
gui.addFolder("threjs配置").open()
// threejs中需要使用到内部的值
const folderSky = gui.addFolder('Sky');
folderSky.add(parameters, 'elevation', 0, 90, 0.1).onChange(updateSun);
folderSky.add(parameters, 'azimuth', - 180, 180, 0.1).onChange(updateSun);
folderSky.open();

const waterUniforms = water.material.uniforms;

const folderWater = gui.addFolder('Water');
folderWater.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('distortionScale');
folderWater.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('size');
folderWater.open();

// 创建渲染动画
const render = () => {
  requestAnimationFrame(render)

  const time = performance.now() * 0.001;
  // y轴周期往复运动
  cubeMesh.position.y = Math.sin(time) * 20 + 5;
  // 在平面上的
  cubeMesh.rotation.x = time * 0.5;
  cubeMesh.rotation.z = time * 0.51;

  // 海水纹理加载后，我们就可以通过海水材质的uniforms属性来让纹理动起来
  // 数值越大，波浪越大
  // ShaderMaterial
  // GLSL语法
  water.material.uniforms['time'].value += 1.0 / 60.0;

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
  position: relative;

  .gui-box {
    position: absolute;
    top: 0px;
    right: 0px;
  }
}
</style>
