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
import { Water } from "three/examples/jsm/objects/Water2"
import dat from "dat.gui"




defineOptions({
  name: "Exmple6"
})

let w = 0, h = 0, clent
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 200);
camera.position.set(-15, 7, 15)
// 默认（0， 0， 0）
camera.lookAt(scene.position);


// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio);
const reRender = () => {
  return renderer.render(scene, camera)
}

// 实例化轨道控制器
const orbitControles = new OrbitControls(camera, renderer.domElement)
orbitControles.maxPolarAngle = Math.PI * 0.45
// orbitControles.update()


// 创建环境
// 添加纹理
// 出错啦！纹理加载器加载完纹理有个返回值
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('texture/exmple6/')
const cubeTexture = cubeTextureLoader.load([
  'posx.jpg', 'negx.jpg',
  'posy.jpg', 'negy.jpg',
  'posz.jpg', 'negz.jpg'
])
scene.background = cubeTexture;


// 添加环境光
const ambientLight = new THREE.AmbientLight(0xe7e7e7, 1.2);
scene.add(ambientLight);
// 添加平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(- 1, 1, 1);
scene.add(directionalLight);

// 添加泳池地面
// 添加地面材质
const grouondTextrueLoader = new THREE.TextureLoader()
grouondTextrueLoader.setPath('texture/exmple6/')
// 出现错误, map需要在回调中引入
grouondTextrueLoader.load('hardwood2_diffuse.jpg', (texture) => {

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  texture.anisotropy = 16;
  texture.repeat.set(4, 4);

  const groundGeometry = new THREE.PlaneGeometry(20, 20)
  // PBR材质需要引入环境光才能显示
  const groundMaterail = new THREE.MeshStandardMaterial({
    roughness: 0.8,
    metalness: 0.7,
    map: texture
  })
  groundMaterail.needsUpdate = true;

  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterail)
  groundMesh.rotation.x = - Math.PI / 2
  scene.add(groundMesh)
})

// 添加水
const params = {
  color: '#ffffff',
  scale: 4,
  flowX: 1,
  flowY: 1
};

const waterGeometry = new THREE.PlaneGeometry(20, 20);

const water = new Water(waterGeometry, {
  color: params.color,
  scale: params.scale,
  flowDirection: new THREE.Vector2(params.flowX, params.flowY),
  textureWidth: 1024,
  textureHeight: 1024
});

water.position.y = 1;
water.rotation.x = Math.PI * - 0.5;
scene.add(water);

const ballTexture = grouondTextrueLoader.load('color.jpg')

const ballMaterail = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  map: ballTexture,
  roughness: 0.5,
  metalness: 0.1,
})
const ballGeometry = new  THREE.SphereGeometry(1.5, 32, 32)
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterail)
ballMesh.position.y = 2
scene.add(ballMesh)

// gui

const gui = new dat.GUI();

gui.addColor(params, 'color').onChange(function (value) {

  water.material.uniforms['color'].value.set(value);

});
gui.add(params, 'scale', 1, 10).onChange(function (value) {

  water.material.uniforms['config'].value.w = value;

});
gui.add(params, 'flowX', - 1, 1).step(0.01).onChange(function (value) {

  water.material.uniforms['flowDirection'].value.x = value;
  water.material.uniforms['flowDirection'].value.normalize();

});
gui.add(params, 'flowY', - 1, 1).step(0.01).onChange(function (value) {

  water.material.uniforms['flowDirection'].value.y = value;
  water.material.uniforms['flowDirection'].value.normalize();

});

gui.open();


const sceneRef = ref()
const guiRef = ref()

// 添加GUI

// 创建渲染动画
const render = () => {
  requestAnimationFrame(render)
  // 不乘系数上下特别快，余玄值等于1
  const time = performance.now() * 0.001
  // 加上1最大值大于1， 乘以0.5step变小
  ballMesh.position.y = Math.sin(time)*0.8 + 1.5
  ballMesh.rotation.x = time * 0.5;
  ballMesh.rotation.z = time * 0.51;
  orbitControles.update()
  reRender()
}
render()

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
  reRender()
  // 渲染动画类似requestAnimationFrame

  // 将渲染器挂载到DOM上
  sceneRef.value.appendChild(renderer.domElement)
  // 将GUI挂载到DOM
  guiRef.value?.appendChild(gui.domElement)


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
