import{u as d}from"./useWatermark-B4_a1Dbf.js";import{l as C,r as v,ah as m,m as y,p as W,q as i,U as t,O as o,u as r,S as l,aI as b,aJ as g}from"./vue-SvvCd1mE.js";import{_ as w}from"./index-HC9wGKDV.js";import"./element-C1lpoOYO.js";import"./vxe-YBxjpzKi.js";const x=n=>(b("data-v-32cf8785"),n=n(),g(),n),I={class:"app-container"},$=x(()=>i("h4",null," 该示例是演示：通过调用 hook，开启或关闭水印， 支持局部、全局、自定义样式（颜色、透明度、字体大小、字体、倾斜角度等），并自带防御（防删、防隐藏）和自适应功能 ",-1)),S=C({__name:"use-watermark",setup(n){const c=v(null),{setWatermark:p,clearWatermark:_}=d(c),{setWatermark:f,clearWatermark:k}=d();return(B,e)=>{const a=m("el-button"),u=m("el-button-group");return y(),W("div",I,[$,i("div",{ref_key:"localRef",ref:c,class:"local"},null,512),t(u,null,{default:o(()=>[t(a,{type:"primary",onClick:e[0]||(e[0]=s=>r(p)("局部水印",{color:"#409eff"}))},{default:o(()=>[l("创建局部水印")]),_:1}),t(a,{type:"warning",onClick:e[1]||(e[1]=s=>r(p)("没有防御功能的局部水印",{color:"#e6a23c",defense:!1}))},{default:o(()=>[l(" 关闭防御功能 ")]),_:1}),t(a,{type:"danger",onClick:r(_)},{default:o(()=>[l("清除局部水印")]),_:1},8,["onClick"])]),_:1}),t(u,null,{default:o(()=>[t(a,{type:"primary",onClick:e[2]||(e[2]=s=>r(f)("全局水印",{color:"#409eff"}))},{default:o(()=>[l("创建全局水印")]),_:1}),t(a,{type:"warning",onClick:e[3]||(e[3]=s=>r(f)("没有防御功能的全局水印",{color:"#e6a23c",defense:!1}))},{default:o(()=>[l(" 关闭防御功能 ")]),_:1}),t(a,{type:"danger",onClick:r(k)},{default:o(()=>[l("清除全局水印")]),_:1},8,["onClick"])]),_:1})])}}}),q=w(S,[["__scopeId","data-v-32cf8785"]]);export{q as default};
