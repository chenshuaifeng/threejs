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
import dat from "dat.gui"

defineOptions({
  name: "Exmple9"
})

let w = 0, h = 0, clent: any
// 创建场景
const scene = new THREE.Scene()
// 值为Color
scene.background = new THREE.Color(0x000000);

// 创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.set(0, 50, 100)


// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio);

// 实例化轨道控制器
const orbitControles = new OrbitControls(camera, renderer.domElement)

// 添加光照
const ambientLight = new THREE.AmbientLight(0xcccccc, 1.5)
scene.add(ambientLight)

// 添加点光源
const pointLight = new THREE.PointLight(0xffffff, 3.5, 0, 0)
pointLight.position.set(0, 10, -10)
scene.add(pointLight);


/**向场景中添加物体 */

// 添加纹理
const texture = new THREE.TextureLoader().setPath('model/exmple2/').load('uv_grid_opengl.jpg')
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.colorSpace = THREE.SRGBColorSpace

// 添加材质
const material = new THREE.MeshPhongMaterial({
  map: texture,
  side: THREE.DoubleSide
})

// 添加球缓冲几何体
const sphereGeometry = new THREE.SphereGeometry(12, 32, 32)
const sphereMesh = new THREE.Mesh(sphereGeometry, material)
sphereMesh.position.set(-50, -15, 0,)
scene.add(sphereMesh)

// 添加二十面缓冲几何体
const icosahedronGeometry = new THREE.IcosahedronGeometry(12, 0)
const icosahedronMesh = new THREE.Mesh(icosahedronGeometry, material)
icosahedronMesh.position.set(-20, -15, 0)
scene.add(icosahedronMesh)

// 添加八面缓冲几何体
const octahedron = new THREE.Mesh(new THREE.OctahedronGeometry(12, 0), material);
octahedron.position.set(10, -15, 0)
scene.add(octahedron);

//
const tetrahedron = new THREE.Mesh(new THREE.TetrahedronGeometry(12, 0), material);
tetrahedron.position.set(35, -15, 0);
scene.add(tetrahedron);

let object
object = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), material);
object.rotateX(Math.PI / 2)
object.position.set(-50, 20, 0,)
scene.add(object);

object = new THREE.Mesh(new THREE.BoxGeometry(15, 15, 15), material);
object.position.set(-20, 20, 0);
scene.add(object);

object = new THREE.Mesh(new THREE.CircleGeometry(12, 12, 0, Math.PI * 2), material);
object.position.set(10, 20, 0);
scene.add(object);

const sceneRef = ref()
const guiRef = ref()

function animate() {
  const timer = Date.now() * 0.0001;
  // camera.position.x = Math.cos(timer) * 10;
  // camera.position.z = Math.sin(timer) * 10;

  scene.traverse(function (mesh) {

    if (mesh.isMesh === true) {
      // 绕z轴旋转
      mesh.rotation.x = timer * 5;
      mesh.rotation.y = timer * 2.5;
    }

  });

  requestAnimationFrame(animate);
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
  renderer.render(scene, camera);
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
  // 调用渲染
  renderer.render(scene, camera)

  // 将渲染器挂载到DOM上
  sceneRef.value.appendChild(renderer.domElement)
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
