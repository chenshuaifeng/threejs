import{b1 as F,L as M,F as R,b2 as H,c as q,C as B,P as G,W as O,D as W,X as j,aE as N,u as E,b3 as A,j as D}from"./three.module-B48SNEox.js";import{l as I,r as k,d as J,m as V,p as K,q as Q}from"./vue-SvvCd1mE.js";import{O as U}from"./OrbitControls-BQkA2Aq0.js";import{_ as Z}from"./index-HC9wGKDV.js";import"./element-C1lpoOYO.js";import"./vxe-YBxjpzKi.js";class $ extends F{constructor(t,e={}){const n=e.font;if(n===void 0)super();else{const s=n.generateShapes(t,e.size);e.depth=e.height!==void 0?e.height:50,e.bevelThickness===void 0&&(e.bevelThickness=10),e.bevelSize===void 0&&(e.bevelSize=8),e.bevelEnabled===void 0&&(e.bevelEnabled=!1),super(s,e)}this.type="TextGeometry"}}class X extends M{constructor(t){super(t)}load(t,e,n,s){const i=this,o=new R(this.manager);o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(t,function(c){const l=i.parse(JSON.parse(c));e&&e(l)},n,s)}parse(t){return new Y(t)}}class Y{constructor(t){this.isFont=!0,this.type="Font",this.data=t}generateShapes(t,e=100){const n=[],s=ee(t,e,this.data);for(let i=0,o=s.length;i<o;i++)n.push(...s[i].toShapes());return n}}function ee(u,t,e){const n=Array.from(u),s=t/e.resolution,i=(e.boundingBox.yMax-e.boundingBox.yMin+e.underlineThickness)*s,o=[];let c=0,l=0;for(let d=0;d<n.length;d++){const h=n[d];if(h===`
`)c=0,l-=i;else{const p=te(h,s,c,l,e);c+=p.offsetX,o.push(p.path)}}return o}function te(u,t,e,n,s){const i=s.glyphs[u]||s.glyphs["?"];if(!i){console.error('THREE.Font: character "'+u+'" does not exists in font family '+s.familyName+".");return}const o=new H;let c,l,d,h,p,f,m,b;if(i.o){const r=i._cachedOutline||(i._cachedOutline=i.o.split(" "));for(let a=0,x=r.length;a<x;)switch(r[a++]){case"m":c=r[a++]*t+e,l=r[a++]*t+n,o.moveTo(c,l);break;case"l":c=r[a++]*t+e,l=r[a++]*t+n,o.lineTo(c,l);break;case"q":d=r[a++]*t+e,h=r[a++]*t+n,p=r[a++]*t+e,f=r[a++]*t+n,o.quadraticCurveTo(p,f,d,h);break;case"b":d=r[a++]*t+e,h=r[a++]*t+n,p=r[a++]*t+e,f=r[a++]*t+n,m=r[a++]*t+e,b=r[a++]*t+n,o.bezierCurveTo(p,f,m,b,d,h);break}}return{offsetX:i.ha*t,path:o}}const ne=I({name:"Exmple8",__name:"Exmple8",setup(u){let t=0,e=0,n;const s=new q;s.background=new B(13421772);const i=new G(45,window.innerWidth/window.innerHeight,1,2e3);i.position.set(0,0,20);const o=new O({antialias:!0});o.setPixelRatio(window.devicePixelRatio),o.render(s,i);const c=new U(i,o.domElement),l=new W(16777215,.5);l.position.set(0,0,-1),s.add(l);const d=new j(16777215,2,0,0);d.color.setHSL(Math.random(),1,.5),d.position.set(0,5,5),s.add(d);let h="optimer",p="bold",f,m="Hellor",b=70,r=2,a=20,x=4,v=1.5,C=!0,_=new N;s.add(_),(()=>{new X().load("fonts/"+h+"_"+p+".typeface.json",function(g){f=g,P()})})();let L=[new E({color:16777215,flatShading:!0}),new E({color:16777215})];const P=()=>{const y=new $(m,{font:f,size:b,height:a,curveSegments:x,bevelThickness:r,bevelSize:v,bevelEnabled:C}),g=new D(y,L);g.scale.set(.08,.08,.08),g.position.x=-10,g.position.y=-2,_.add(g)},T=new A(8);s.add(T);const w=k(),z=k();function S(){requestAnimationFrame(S),c.update(),i.updateProjectionMatrix(),o.setSize(t,e),o.render(s,i)}return S(),window.addEventListener("resize",()=>{t=n.width,e=n.height,i.aspect=t/e,o.setSize(t,e),i.updateProjectionMatrix()}),J(()=>{n=w.value.getBoundingClientRect(),t=n.width,e=n.height,o.setSize(t,e),w.value.appendChild(o.domElement)}),(y,g)=>(V(),K("div",{ref_key:"sceneRef",ref:w,class:"right-box"},[Q("div",{ref_key:"guiRef",ref:z,id:"gui",class:"gui-box"},null,512)],512))}}),de=Z(ne,[["__scopeId","data-v-b7103736"]]);export{de as default};
