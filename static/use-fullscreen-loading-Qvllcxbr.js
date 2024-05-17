import{H as d,E as n}from"./element-C1lpoOYO.js";import{l as p,ah as _,m,p as g,U as c,O as i,S as l,q as f}from"./vue-SvvCd1mE.js";const h={lock:!0,text:"加载中..."},u=(s,e={})=>{let t;return async(...a)=>{try{return t=d.service({...h,...e}),await s(...a)}finally{t==null||t.close()}}},y={code:0,data:{list:[]},message:"获取成功"};function E(s){return new Promise(e=>{setTimeout(()=>{e({...y,data:{list:s}})},1e3)})}function k(){return new Promise((s,e)=>{setTimeout(()=>{e(new Error("发生错误"))},1e3)})}const w={class:"app-container"},C=f("h4",null,"该示例是演示：通过将要执行的函数传递给 hook，让 hook 自动开启全屏 loading，函数执行结束后自动关闭 loading",-1),S=`
  <path class="path" d="
    M 30 15
    L 28 17
    M 25.61 25.61
    A 15 15, 0, 0, 1, 15 30
    A 15 15, 0, 1, 1, 27.99 7.5
    L 15 15
  " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
`,b=p({__name:"use-fullscreen-loading",setup(s){const e={text:"即将发生错误...",background:"#F56C6C20",svg:S,svgViewBox:"-10, -10, 50, 50"},t=async()=>{const o=await u(E)([2,3,3]);n.success(`${o.message}，传参为 ${o.data.list.toString()}`)},a=async()=>{try{await u(k,e)()}catch(o){n.error(o.message)}};return(o,x)=>{const r=_("el-button");return m(),g("div",w,[C,c(r,{type:"primary",onClick:t},{default:i(()=>[l("查询成功")]),_:1}),c(r,{type:"danger",onClick:a},{default:i(()=>[l("查询失败")]),_:1})])}}});export{b as default};
