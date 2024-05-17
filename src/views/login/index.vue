<template>
  <div class="home">
    <div class="canvas-container" ref="screenDom" />
    <div class="pages" ref="pages">
      <div class="page">
        <div class="login-card">
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
        </div>
      </div>
      <div class="page">
        <h2 class="title">WEB 3D可视化</h2>
        <p>领略WEB 3D的魅力，让页面无比酷炫</p>
      </div>
      <div class="page">
        <h2 class="title">ThreeJS框架</h2>
        <p>让前端开发3D效果更方便</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { ref, onMounted, reactive } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { type FormInstance, type FormRules } from "element-plus"
import { User, Lock, Key, Picture, Loading } from "@element-plus/icons-vue"
import { getLoginCodeApi } from "@/api/login"
import { type LoginRequestData } from "@/api/login/types/login"
import { useFocus } from "./hooks/useFocus"
import { GLTFLoader } from "three/examples/jsm/Addons.js"
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js"

import { gsap } from "gsap"

const router = useRouter()
const { handleBlur, handleFocus } = useFocus()

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

const screenDom = ref()
const pages = ref(null)
onMounted(() => {
  // 创建场景
  const scene = new THREE.Scene()
  // 创建相机
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000)

  camera.position.set(0, 0, 10)
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 将画布添加到页面中
  screenDom.value.appendChild(renderer.domElement)

  // 创建星空的背景
  const url = "model/login/25s.jpg"
  const envTexture = new THREE.TextureLoader().load(url)
  envTexture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = envTexture
  scene.environment = envTexture

  function render() {
    requestAnimationFrame(render)
    renderer.render(scene, camera)
  }
  render()

  // 添加灯光
  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(0, 0, 1)
  scene.add(light)
  const light2 = new THREE.DirectionalLight(0xffffff, 0.5)
  light2.position.set(0, 0, -1)
  scene.add(light2)
  const light3 = new THREE.AmbientLight(0xffffff, 0.5)
  light3.position.set(-1, 1, 1)
  scene.add(light3)

  // 设置解压缩的加载器
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath("draco/gltf/")
  dracoLoader.setDecoderConfig({ type: "js" })
  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)
  loader.load("model/login/xz.glb", (gltf) => {
    gltf.scene.scale.set(0.1, 0.1, 0.1)
    gltf.scene.position.set(3, 0, 0)
    scene.add(gltf.scene)

    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1

      const timeline = gsap.timeline()
      timeline.to(gltf.scene.rotation, {
        x: y,
        y: x,
        duration: 1
      })
    })
  })

  loader.load("model/login/xq6.glb", (gltf) => {
    gltf.scene.scale.set(0.05, 0.05, 0.05)
    gltf.scene.position.set(3, -8, 0)
    scene.add(gltf.scene)

    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1

      const timeline = gsap.timeline()
      timeline.to(gltf.scene.rotation, {
        x: y,
        y: x,
        duration: 1
      })
    })
  })

  loader.load("model/login/gr75.glb", (gltf) => {
    // gltf.scene.scale.set(0.1, 0.1, 0.1);
    gltf.scene.position.set(3, -16, 0)
    scene.add(gltf.scene)

    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1

      const timeline = gsap.timeline()
      timeline.to(gltf.scene.rotation, {
        x: y,
        y: x,
        duration: 1
      })
    })
  })

  let page = 0
  const timeline2 = gsap.timeline()
  window.addEventListener("mousewheel", (e: any) => {
    if (e.wheelDelta < 0) {
      page++
      if (page > 2) {
        page = 2
      }
    }
    if (e.wheelDelta > 0) {
      page--
      if (page < 0) {
        page = 0
      }
    }
    if (!timeline2.isActive()) {
      timeline2.to(camera.position, {
        y: page * -8,
        duration: 1
      })
      gsap.to(pages.value, {
        y: -page * window.innerHeight,
        duration: 1
      })
    }
  })

  loader.load("model/login/moon.glb", (gltf) => {
    const moon = gltf.scene.children[0] as any
    for (let j = 0; j < 10; j++) {
      const moonInstance = new THREE.InstancedMesh(moon.geometry, moon.material, 100)

      // scene.add(moon);
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 1000 - 500
        const y = Math.random() * 1000 - 500
        const z = Math.random() * 1000 - 500

        const matrix = new THREE.Matrix4()
        const size = Math.random() * 20 - 8
        matrix.makeScale(size, size, size)
        matrix.makeTranslation(x, y, z)
        moonInstance.setMatrixAt(i, matrix)
      }

      gsap.to(moonInstance.position, {
        duration: Math.random() * 10 + 2,
        z: -1000,
        ease: "linear",
        repeat: -1
      })
      scene.add(moonInstance)
    }
  })
})
</script>
<style scoped lang="scss">
.login-card {
  width: 30vw;
  min-height: 320px;
  border-radius: 20px;
  box-shadow: 0 0 10px 5px #dcdfe6 inset;
  background-color: rgba(63, 63, 63, 0.7);
  overflow: hidden;
  display: flex;
  align-content: center;
  justify-content: center;
  .content {
    padding: 60px;
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
</style>
<style>
* {
  margin: 0;
  padding: 0;
}
body {
  background-color: #000;
}
.canvas-container {
  width: 100vw;
  height: 100vh;
}
.home {
  width: 100vw;
  height: 100vh;
  transform-origin: 0 0;
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header .logo {
  height: 100px;
  width: 300px;
  background-image: url("./assets/lcdm.png");
  background-size: 60%;
  background-position: center;
  background-repeat: no-repeat;
}
.canvas-container {
  width: 100%;
  height: 100%;
}
.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 50px;
}
.menuItem {
  padding: 0 15px;
  text-decoration: none;
  color: #fff;
  font-weight: 900;
  font-size: 15px;
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url(./assets/loading.jpg);
  background-size: cover;
  filter: blur(50px);
  z-index: 100;
}
.progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 101;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #fff;
}
.progress > img {
  padding: 0 15px;
}

/* .title {
  width: 380px;
  height: 40px;
  position: fixed;
  right: 100px;
  top: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  line-height: 40px;
  text-align: center;
  color: #fff;
  border-radius: 5px;
  z-index: 110;
} */
.pages {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
}
.pages .page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: #fff;
  padding: 15%;
  box-sizing: border-box;
}
.pages .page .title {
  font-size: 50px;
  font-weight: 900;
  margin-bottom: 20px;
}
.pages .page p {
  font-size: 25px;
}
</style>
