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
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js';
import dat from "dat.gui"



defineOptions({
  name: "Exmple7"
})

let w = 0, h = 0, clent
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 80000 );
camera.position.set( - 600, 550, 1300 );


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
orbitControles.addEventListener('change', () => {
  reRender()
})

/**向场景中添加物体 */

// const teapotMesh = new THREE.Mesh(teapotGeometry, teapotMaterail)

let bBottom, tess,bLid,bBody,bFitLid,bNonBlinn
let teapotMesh
const teapotSize = 300;
let materials = {}  // 材质的集合
let shading
let effectController = {
    newTess: 15,
    bottom: true,
    lid: true,
    body: true,
    fitLid: false,
    nonblinn: false,
    newShading: 'glossy'
  }; // 配置

// 设置GUI
const setupGui = () => {
  const gui = new dat.GUI();
  gui.add(effectController, 'newTess', [2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50]).name('Tessellation Level').onChange(render);
  gui.add(effectController, 'lid').name('display lid').onChange(render);
  gui.add(effectController, 'body').name('display body').onChange(render);
  gui.add(effectController, 'bottom').name('display bottom').onChange(render);
  gui.add(effectController, 'fitLid').name('snug lid').onChange(render);
  gui.add(effectController, 'nonblinn').name('original scale').onChange(render);
  gui.add(effectController, 'newShading', ['wireframe', 'flat', 'smooth', 'glossy', 'textured', 'reflective']).name('Shading').onChange(render);

  return gui
}

const render = () => {
  if (effectController.newTess !== tess ||
    effectController.bottom !== bBottom ||
    effectController.lid !== bLid ||
    effectController.body !== bBody ||
    effectController.fitLid !== bFitLid ||
    effectController.nonblinn !== bNonBlinn ||
    effectController.newShading !== shading) {

    tess = effectController.newTess;
    bBottom = effectController.bottom;
    bLid = effectController.lid;
    bBody = effectController.body;
    bFitLid = effectController.fitLid;
    bNonBlinn = effectController.nonblinn;
    shading = effectController.newShading;

    // 重新创建物体
    createNewTeapot();
    // 重新渲染
    if (shading === 'reflective') {
      scene.background = textureCube;
    } else {
      scene.background = null;
    }
    renderer.render(scene, camera);

  }
}

// 添加灯光
// LIGHTS
const ambientLight = new THREE.AmbientLight( 0x7c7c7c, 3.0 );

const light = new THREE.DirectionalLight( 0xFFFFFF, 3.0 );
light.position.set( 0.32, 0.39, 0.7 );
const lightHelper = new THREE.DirectionalLightHelper(light)
scene.background = new THREE.Color( 0xAAAAAA );
scene.add( ambientLight );
scene.add( light );

// 创建材质
// 立方体材质
const path = 'texture/exmple1/';
const urls = ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'];
const textureCube = new THREE.CubeTextureLoader().setPath(path).load(urls);
materials['reflective'] = new THREE.MeshPhongMaterial({ envMap: textureCube, side: THREE.DoubleSide });

const textureMap = new THREE.TextureLoader().load('texture/exmple7/uv_grid_opengl.jpg');
textureMap.wrapS = textureMap.wrapT = THREE.RepeatWrapping;
textureMap.anisotropy = 16;
textureMap.colorSpace = THREE.SRGBColorSpace;
materials['wireframe'] = new THREE.MeshBasicMaterial({ wireframe: true });
materials['flat'] = new THREE.MeshPhongMaterial({ specular: 0x000000, flatShading: true, side: THREE.DoubleSide });
materials['smooth'] = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide });
materials['glossy'] = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide });
materials['textured'] = new THREE.MeshPhongMaterial({ map: textureMap, side: THREE.DoubleSide });

// 创建物体
const createNewTeapot = () => {
  if (teapotMesh !== undefined) {
    // 先销毁
    // 1）销毁立方体
    teapotMesh.geometry.dispose();
    // 2) 从场景中移除物体
    scene.remove(teapotMesh)
  }
  // 创建立方体
  const teapotGeometry = new TeapotGeometry(
    teapotSize,
    tess,
    effectController.bottom,
    effectController.lid,
    effectController.body,
    effectController.fitLid,
    !effectController.nonblinn
  )
  // 添加材质
  const teapotMaterail = materials[shading]
  // 添加物体
  teapotMesh = new THREE.Mesh(teapotGeometry, teapotMaterail)
  scene.add(teapotMesh)
}

const sceneRef = ref()
const guiRef = ref()


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
  render()
  // 渲染动画类似requestAnimationFrame

  // 将渲染器挂载到DOM上
  sceneRef.value.appendChild(renderer.domElement)
  // 将GUI挂载到DOM
  guiRef.value?.appendChild(setupGui().domElement)


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
