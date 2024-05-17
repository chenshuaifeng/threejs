<template>
  <div class="dashboard-container">
    <div class="left-box">
      <div
        :class="['box', item.is === active.is ? 'active' : '']"
        v-lazy="item"
        v-for="(item, index) in list"
        :key="item.is"
        @click="handleClick(item)"
      >
        <div class="box-body">
          <img />
        </div>
        <div class="introduce">{{ item.introduce }}</div>
        <div class="box-footer">{{ item.name }}</div>
      </div>
    </div>
    <component :is="active.is" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue"
import type { Directive } from "vue"

const active = ref({
  name: "KTX2Loader、MeshoptDecoder、GLTFLoader",
  is: "Exmple9",
  img: "/images/scroll-box/exmple1.png",
  introduce: ""
})
const list = ref([
  {
    name: "Light_lightProbe",
    is: "Exmple1",
    img: "https://img.xakwy.com/threejs/exmple/exmple1.png",
    introduce:
      "1. 光照探针的影响效果；2. 光照探针的使用步骤； 3.光照探针是一种在3D场景中添加光源的另一种方法。与经典光源（平行光、点光、聚光）不同， 光照探针不发光相反，光照探针存储着有关穿过3D空间的光线的信息。 渲染过程中，通过使用来自光照探针的数据，来逼近打到3D物体上的光线。"
  },
  {
    name: "Light_spotLight",
    is: "Exmple2",
    img: "https://img.xakwy.com/threejs/exmple/exmple2.png",
    introduce:
      "1. ply格式模型保存几何体数据Geometry(new Geometry), 重新计算法线, 更新世界坐标比例； 2.半球光HemisphereLight天空到地面的光照; 3.轨道控制器的配置属性; 4.聚光灯sportLight及光照纹理投影贴图 5.动画旋转"
  },
  {
    name: "Light_spotLights",
    is: "Exmple3",
    img: "https://img.xakwy.com/threejs/exmple/exmple3.png",
    introduce: "1. 补间动画与聚光灯结合使用; 2. 聚光灯阴影生成"
  },
  {
    name: "水、天空",
    is: "Exmple4",
    img: "https://img.xakwy.com/threejs/exmple/exmple4.png",
    introduce: "1. sky着色器与water着色器; 2. 漂浮物体的动画函数; 3. 纹理的平铺效果"
  },
  {
    name: "KTX2Loader、MeshoptDecoder、GLTFLoader",
    is: "Exmple5",
    img: "https://img.xakwy.com/threejs/exmple/exmple5.png",
    introduce:
      "1. RoomEnvironment:threejs模拟室内环境的一个shader,包括纹理; 2. KTX2Loader是一个用于加载 .ktx2 格式的纹理加载器，.ktx2 是一种用于高效存储和传输压缩纹理的格，loader.setKTX2Loader();3. MeshoptDecoder 是一个用于解码由 meshoptimizer 工具压缩的几何数据的解码器,loader.setMeshoptDecoder；4.PMREMGenerator构造函数"
  },
  {
    name: "水2、泳池",
    is: "Exmple6",
    img: "https://img.xakwy.com/threejs/exmple/exmple6.png",
    introduce: "1.环境光加载的顺序; 2.水2的使用"
  },
  {
    name: "茶壶",
    is: "Exmple7",
    img: "https://img.xakwy.com/threejs/exmple/exmple7.png",
    introduce: "1.动态添加材质"
  },
  {
    name: "文字",
    is: "Exmple8",
    img: "https://img.xakwy.com/threejs/exmple/exmple8.png",
    introduce: "1.文字加载器的使用 2.文本缓冲几何体的使用,使用正反两种材质"
  },
  {
    name: "几何体",
    is: "Exmple9",
    img: "https://img.xakwy.com/threejs/exmple/exmple9.png",
    introduce: "1.各种缓冲几何体"
  },
])
const vLazy: Directive<HTMLElement, { img: string }> = async (el, binding) => {
  const def = await import("/images/snick.png")
  ;(el.firstChild?.firstChild as HTMLImageElement).src = def.default
  const observe = new IntersectionObserver((entry) => {
    if (entry[0].intersectionRatio > 0) {
      ;(el.firstChild?.firstChild as HTMLImageElement).src = binding.value.img
      observe.unobserve(el)
    }
  })
  observe.observe(el)
}

const handleClick = (item: any) => {
  active.value = item
}
</script>

<style scoped lang="scss">
.dashboard-container {
  width: calc(100vw - 12px);
  height: calc(100vh - 100px);
  display: flex;
  box-sizing: border-box;

  .left-box {
    width: 270px;
    height: calc(100vh - 130px);
    overflow: scroll;
    padding: 12px 16px;
    box-sizing: border-box;

    .box {
      box-sizing: border-box;
      width: 100%;
      height: 160px;
      margin-bottom: 20px;
      border-radius: 0px 0px 6px 6px;
      overflow: hidden;
      position: relative;

      .box-body {
        width: 100%;
        height: 125px;
        border-radius: 6px 6px 0px 0px;
        overflow: hidden;

        img {
          display: inline-block;
          width: 100%;
          transition: all 0.5s;
        }
      }

      .box-footer {
        width: 100%;
        height: 35px;
        background-color: rgba(64, 158, 255, 0.8);
        border-radius: 0px 0px 6px 6px;
        padding: 0px 16px;
        overflow: hidden;
        line-height: 35px;
        color: #fff;
        position: absolute;
        transition: all 0.5s;
        bottom: 0px;
      }
      .introduce {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        color: #fff;
        font-size: 12px;
        padding: 3px;
        transition: all 0.5s;
        opacity: 0;
      }
      &:hover {
        cursor: pointer;

        .box-footer {
          transition: all 0.5s;
          height: 0px;
        }

        .box-body {
          transition: all 0.5s;
          height: 160px;

          img {
            transform: scale(1.5);
          }
        }
      }
    }
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    // 滚动条上的滚动滑块
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: #63affd;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: #409eff;
    }
    &::-webkit-scrollbar-thumb:active {
      background-color: #63affd;
    }
    // 当同时有垂直滚动条和水平滚动条时交汇的部分
    &::-webkit-scrollbar-corner {
      background-color: transparent;
    }
    .active {
      border: 3px solid #2b63ff;
      border-radius: 6px;
      &:hover {
        .introduce {
          opacity: 0.8;
        }
      }
      .box-body {
        transition: all 0.5s;
        height: 160px;
        img {
          transform: scale(1.5);
        }
      }
      .box-footer {
        height: 0px;
      }
    }
  }
}
</style>
