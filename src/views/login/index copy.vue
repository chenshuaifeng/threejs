<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { type FormInstance, type FormRules } from "element-plus"
import { User, Lock, Key, Picture, Loading } from "@element-plus/icons-vue"
import { getLoginCodeApi } from "@/api/login"
import { type LoginRequestData } from "@/api/login/types/login"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import Owl from "./components/Owl.vue"
import { useFocus } from "./hooks/useFocus"

import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import { GLTFLoader } from "three/examples/jsm/Addons.js"
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js"

// 添加环境贴图
const envTexture = new THREE.TextureLoader().load("model/christmas/textures/Gradient_BG_baseColor.png")
// 创建场景
const scene = new THREE.Scene()
// envTexture.mapping = THREE.EquirectangularReflectionMapping
// scene.environment = envTexture;
// scene.background = envTexture;
scene.castShadow = true
// 创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
camera.position.copy(new THREE.Vector3(0.20898607797583224, 45.33362301214035, 52.08670849253736))

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
// 调整渲染器配置
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)

// 测试代码
// 添加立方体
// const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
// // 添加立方体材质
// const cubeMaterial = new THREE.MeshBasicMaterial({
//   color: 0xffffff, // 立方体颜色
// })
// // 添加网格物体
// const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
// scene.add(cubeMesh)

// 添加地面立方体
const planGeometry = new THREE.PlaneGeometry(50, 50)
const planMaterial = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide
})
const planMesh = new THREE.Mesh(planGeometry, planMaterial)
planMesh.rotation.x = -Math.PI / 2
planMesh.position.y = -8
planMesh.position.z = -10
planMesh.receiveShadow = true
scene.add(planMesh)

// 添加平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.position.set(-30, 20, -5)
directionalLight.castShadow = true
const targetMesh = new THREE.Mesh()
targetMesh.position.copy(new THREE.Vector3(0, 0, -5))
scene.add(targetMesh)
directionalLight.target = targetMesh
scene.add(directionalLight)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
scene.add(directionalLightHelper)

// 插件
// 添加轨道控制器
const orbitControles = new OrbitControls(camera, renderer.domElement)
orbitControles.enableDamping = true
orbitControles.dampingFactor = 0.08

orbitControles.addEventListener("change", () => {})
// 添加GLTFLoader
const gltfLoader = new GLTFLoader()
// 添加draco解析器
const dracoLoader = new DRACOLoader().setDecoderPath("./draco")
gltfLoader.setDRACOLoader(dracoLoader).load("model/katun/scene.gltf", (gltf) => {
  gltf.scene.children[0].children[0].traverse((mesh) => {
    mesh.castShadow = true
    console.log("mesh", mesh)
  })
  console.log("gltf", gltf)
  scene.add(gltf.scene)
})
// 创建渲染动画
const render = () => {
  requestAnimationFrame(render)
  // 更新轨道控制器
  orbitControles.update()
  // 重新渲染页面
  renderer.render(scene, camera)
}
render()
const sceneRef = ref()
onMounted(() => {
  // 将渲染器挂载到DOM上
  sceneRef.value.appendChild(renderer.domElement)
})

const router = useRouter()
const { isFocus, handleBlur, handleFocus } = useFocus()

/** 登录表单元素的引用 */
const loginFormRef = ref<FormInstance | null>(null)

/** 登录按钮 Loading */
const loading = ref(false)
/** 验证码图片 URL */
const codeUrl = ref("")
/** 登录表单数据 */
const loginFormData: LoginRequestData = reactive({
  username: "admin",
  password: "12345678",
  code: ""
})
/** 登录表单校验规则 */
const loginFormRules: FormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" }
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
}
/** 登录逻辑 */
const handleLogin = () => {
  loginFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      useUserStore()
        .login(loginFormData)
        .then(() => {
          router.push({ path: "/" })
        })
        .catch(() => {
          createCode()
          loginFormData.password = ""
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
/** 创建验证码 */
const createCode = () => {
  // 先清空验证码的输入
  loginFormData.code = ""
  // 获取验证码
  codeUrl.value = ""
  getLoginCodeApi().then((res) => {
    codeUrl.value = res.data
  })
}

/** 初始化验证码 */
createCode()
</script>

<template>
  <div ref="sceneRef" class="index-container">
    <!-- <ThemeSwitch class="theme-switch" />
    <Owl :close-eyes="isFocus" />
    <div class="login-card">
      <div class="title">
        <img src="@/assets/layouts/logo-text-2.png" />
      </div>
      <div class="content">
        <el-form ref="loginFormRef" :model="loginFormData" :rules="loginFormRules" @keyup.enter="handleLogin">
          <el-form-item prop="username">
            <el-input
              v-model.trim="loginFormData.username"
              placeholder="用户名"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="loginFormData.password"
              placeholder="密码"
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
              show-password
              @blur="handleBlur"
              @focus="handleFocus"
            />
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model.trim="loginFormData.code"
              placeholder="验证码"
              type="text"
              tabindex="3"
              :prefix-icon="Key"
              maxlength="7"
              size="large"
            >
              <template #append>
                <el-image :src="codeUrl" @click="createCode" draggable="false">
                  <template #placeholder>
                    <el-icon>
                      <Picture />
                    </el-icon>
                  </template>
                  <template #error>
                    <el-icon>
                      <Loading />
                    </el-icon>
                  </template>
                </el-image>
              </template>
            </el-input>
          </el-form-item>
          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin">登 录</el-button>
        </el-form>
      </div>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.index-container {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  background-color: pink;
}
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }
  .login-card {
    width: 480px;
    max-width: 90%;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: #fff;
    overflow: hidden;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;
      img {
        height: 100%;
      }
    }
    .content {
      padding: 20px 50px 50px 50px;
      :deep(.el-input-group__append) {
        padding: 0;
        overflow: hidden;
        .el-image {
          width: 100px;
          height: 40px;
          border-left: 0px;
          user-select: none;
          cursor: pointer;
          text-align: center;
        }
      }
      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
