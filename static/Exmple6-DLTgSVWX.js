import{j as D,P as B,C as P,z as L,V as W,M as T,G as U,J as I,H as G,w as A,U as H,aL as J,aq as q,T as X,K,R as E,a$ as $,c as Z,W as ee,g as te,A as ae,D as oe,S as re,o as V,i as ne,ap as ie,h as le}from"./three.module-B48SNEox.js";import{d as se}from"./dat.gui.module-DqesmVVB.js";import{_ as ce}from"./index-HC9wGKDV.js";import{O as ue}from"./OrbitControls-BQkA2Aq0.js";import{r as k,d as fe,m as de,p as me,q as pe}from"./vue-SvvCd1mE.js";import"./element-C1lpoOYO.js";import"./vxe-YBxjpzKi.js";class F extends D{constructor(y,a={}){super(y),this.isReflector=!0,this.type="Reflector",this.camera=new B;const i=this,h=a.color!==void 0?new P(a.color):new P(8355711),M=a.textureWidth||512,b=a.textureHeight||512,C=a.clipBias||0,v=a.shader||F.ReflectorShader,S=a.multisample!==void 0?a.multisample:4,s=new L,g=new W,d=new W,x=new W,m=new T,_=new W(0,0,-1),l=new U,w=new W,R=new W,e=new U,r=new T,t=this.camera,c=new I(M,b,{samples:S,type:G}),f=new A({name:v.name!==void 0?v.name:"unspecified",uniforms:H.clone(v.uniforms),fragmentShader:v.fragmentShader,vertexShader:v.vertexShader});f.uniforms.tDiffuse.value=c.texture,f.uniforms.color.value=h,f.uniforms.textureMatrix.value=r,this.material=f,this.onBeforeRender=function(n,o,u){if(d.setFromMatrixPosition(i.matrixWorld),x.setFromMatrixPosition(u.matrixWorld),m.extractRotation(i.matrixWorld),g.set(0,0,1),g.applyMatrix4(m),w.subVectors(d,x),w.dot(g)>0)return;w.reflect(g).negate(),w.add(d),m.extractRotation(u.matrixWorld),_.set(0,0,-1),_.applyMatrix4(m),_.add(x),R.subVectors(d,_),R.reflect(g).negate(),R.add(d),t.position.copy(w),t.up.set(0,1,0),t.up.applyMatrix4(m),t.up.reflect(g),t.lookAt(R),t.far=u.far,t.updateMatrixWorld(),t.projectionMatrix.copy(u.projectionMatrix),r.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),r.multiply(t.projectionMatrix),r.multiply(t.matrixWorldInverse),r.multiply(i.matrixWorld),s.setFromNormalAndCoplanarPoint(g,d),s.applyMatrix4(t.matrixWorldInverse),l.set(s.normal.x,s.normal.y,s.normal.z,s.constant);const p=t.projectionMatrix;e.x=(Math.sign(l.x)+p.elements[8])/p.elements[0],e.y=(Math.sign(l.y)+p.elements[9])/p.elements[5],e.z=-1,e.w=(1+p.elements[10])/p.elements[14],l.multiplyScalar(2/l.dot(e)),p.elements[2]=l.x,p.elements[6]=l.y,p.elements[10]=l.z+1-C,p.elements[14]=l.w,i.visible=!1;const z=n.getRenderTarget(),Y=n.xr.enabled,Q=n.shadowMap.autoUpdate;n.xr.enabled=!1,n.shadowMap.autoUpdate=!1,n.setRenderTarget(c),n.state.buffers.depth.setMask(!0),n.autoClear===!1&&n.clear(),n.render(o,t),n.xr.enabled=Y,n.shadowMap.autoUpdate=Q,n.setRenderTarget(z);const N=u.viewport;N!==void 0&&n.state.viewport(N),i.visible=!0},this.getRenderTarget=function(){return c},this.dispose=function(){c.dispose(),i.material.dispose()}}}F.ReflectorShader={name:"ReflectorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,fragmentShader:`
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};class j extends D{constructor(y,a={}){super(y),this.isRefractor=!0,this.type="Refractor",this.camera=new B;const i=this,h=a.color!==void 0?new P(a.color):new P(8355711),M=a.textureWidth||512,b=a.textureHeight||512,C=a.clipBias||0,v=a.shader||j.RefractorShader,S=a.multisample!==void 0?a.multisample:4,s=this.camera;s.matrixAutoUpdate=!1,s.userData.refractor=!0;const g=new L,d=new T,x=new I(M,b,{samples:S,type:G});this.material=new A({name:v.name!==void 0?v.name:"unspecified",uniforms:H.clone(v.uniforms),vertexShader:v.vertexShader,fragmentShader:v.fragmentShader,transparent:!0}),this.material.uniforms.color.value=h,this.material.uniforms.tDiffuse.value=x.texture,this.material.uniforms.textureMatrix.value=d;const m=function(){const e=new W,r=new W,t=new T,c=new W,f=new W;return function(o){return e.setFromMatrixPosition(i.matrixWorld),r.setFromMatrixPosition(o.matrixWorld),c.subVectors(e,r),t.extractRotation(i.matrixWorld),f.set(0,0,1),f.applyMatrix4(t),c.dot(f)<0}}(),_=function(){const e=new W,r=new W,t=new J,c=new W;return function(){i.matrixWorld.decompose(r,t,c),e.set(0,0,1).applyQuaternion(t).normalize(),e.negate(),g.setFromNormalAndCoplanarPoint(e,r)}}(),l=function(){const e=new L,r=new U,t=new U;return function(f){s.matrixWorld.copy(f.matrixWorld),s.matrixWorldInverse.copy(s.matrixWorld).invert(),s.projectionMatrix.copy(f.projectionMatrix),s.far=f.far,e.copy(g),e.applyMatrix4(s.matrixWorldInverse),r.set(e.normal.x,e.normal.y,e.normal.z,e.constant);const n=s.projectionMatrix;t.x=(Math.sign(r.x)+n.elements[8])/n.elements[0],t.y=(Math.sign(r.y)+n.elements[9])/n.elements[5],t.z=-1,t.w=(1+n.elements[10])/n.elements[14],r.multiplyScalar(2/r.dot(t)),n.elements[2]=r.x,n.elements[6]=r.y,n.elements[10]=r.z+1-C,n.elements[14]=r.w}}();function w(e){d.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),d.multiply(e.projectionMatrix),d.multiply(e.matrixWorldInverse),d.multiply(i.matrixWorld)}function R(e,r,t){i.visible=!1;const c=e.getRenderTarget(),f=e.xr.enabled,n=e.shadowMap.autoUpdate;e.xr.enabled=!1,e.shadowMap.autoUpdate=!1,e.setRenderTarget(x),e.autoClear===!1&&e.clear(),e.render(r,s),e.xr.enabled=f,e.shadowMap.autoUpdate=n,e.setRenderTarget(c);const o=t.viewport;o!==void 0&&e.state.viewport(o),i.visible=!0}this.onBeforeRender=function(e,r,t){t.userData.refractor!==!0&&m(t)&&(_(),w(t),l(t),R(e,r,t))},this.getRenderTarget=function(){return x},this.dispose=function(){x.dispose(),i.material.dispose()}}}j.RefractorShader={name:"RefractorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`

		uniform mat4 textureMatrix;

		varying vec4 vUv;

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform vec3 color;
		uniform sampler2D tDiffuse;

		varying vec4 vUv;

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};class O extends D{constructor(y,a={}){super(y),this.isWater=!0,this.type="Water";const i=this,h=a.color!==void 0?new P(a.color):new P(16777215),M=a.textureWidth||512,b=a.textureHeight||512,C=a.clipBias||0,v=a.flowDirection||new q(1,0),S=a.flowSpeed||.03,s=a.reflectivity||.02,g=a.scale||1,d=a.shader||O.WaterShader,x=new X,m=a.flowMap||void 0,_=a.normalMap0||x.load("textures/water/Water_1_M_Normal.jpg"),l=a.normalMap1||x.load("textures/water/Water_2_M_Normal.jpg"),w=.15,R=w*.5,e=new T,r=new $;if(F===void 0){console.error("THREE.Water: Required component Reflector not found.");return}if(j===void 0){console.error("THREE.Water: Required component Refractor not found.");return}const t=new F(y,{textureWidth:M,textureHeight:b,clipBias:C}),c=new j(y,{textureWidth:M,textureHeight:b,clipBias:C});t.matrixAutoUpdate=!1,c.matrixAutoUpdate=!1,this.material=new A({uniforms:H.merge([K.fog,d.uniforms]),vertexShader:d.vertexShader,fragmentShader:d.fragmentShader,transparent:!0,fog:!0}),m!==void 0?(this.material.defines.USE_FLOWMAP="",this.material.uniforms.tFlowMap={type:"t",value:m}):this.material.uniforms.flowDirection={type:"v2",value:v},_.wrapS=_.wrapT=E,l.wrapS=l.wrapT=E,this.material.uniforms.tReflectionMap.value=t.getRenderTarget().texture,this.material.uniforms.tRefractionMap.value=c.getRenderTarget().texture,this.material.uniforms.tNormalMap0.value=_,this.material.uniforms.tNormalMap1.value=l,this.material.uniforms.color.value=h,this.material.uniforms.reflectivity.value=s,this.material.uniforms.textureMatrix.value=e,this.material.uniforms.config.value.x=0,this.material.uniforms.config.value.y=R,this.material.uniforms.config.value.z=R,this.material.uniforms.config.value.w=g;function f(o){e.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),e.multiply(o.projectionMatrix),e.multiply(o.matrixWorldInverse),e.multiply(i.matrixWorld)}function n(){const o=r.getDelta(),u=i.material.uniforms.config;u.value.x+=S*o,u.value.y=u.value.x+R,u.value.x>=w?(u.value.x=0,u.value.y=R):u.value.y>=w&&(u.value.y=u.value.y-w)}this.onBeforeRender=function(o,u,p){f(p),n(),i.visible=!1,t.matrixWorld.copy(i.matrixWorld),c.matrixWorld.copy(i.matrixWorld),t.onBeforeRender(o,u,p),c.onBeforeRender(o,u,p),i.visible=!0}}}O.WaterShader={uniforms:{color:{type:"c",value:null},reflectivity:{type:"f",value:0},tReflectionMap:{type:"t",value:null},tRefractionMap:{type:"t",value:null},tNormalMap0:{type:"t",value:null},tNormalMap1:{type:"t",value:null},textureMatrix:{type:"m4",value:null},config:{type:"v4",value:new U}},vertexShader:`

		#include <common>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>

		uniform mat4 textureMatrix;

		varying vec4 vCoord;
		varying vec2 vUv;
		varying vec3 vToEye;

		void main() {

			vUv = uv;
			vCoord = textureMatrix * vec4( position, 1.0 );

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vToEye = cameraPosition - worldPosition.xyz;

			vec4 mvPosition =  viewMatrix * worldPosition; // used in fog_vertex
			gl_Position = projectionMatrix * mvPosition;

			#include <logdepthbuf_vertex>
			#include <fog_vertex>

		}`,fragmentShader:`

		#include <common>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>

		uniform sampler2D tReflectionMap;
		uniform sampler2D tRefractionMap;
		uniform sampler2D tNormalMap0;
		uniform sampler2D tNormalMap1;

		#ifdef USE_FLOWMAP
			uniform sampler2D tFlowMap;
		#else
			uniform vec2 flowDirection;
		#endif

		uniform vec3 color;
		uniform float reflectivity;
		uniform vec4 config;

		varying vec4 vCoord;
		varying vec2 vUv;
		varying vec3 vToEye;

		void main() {

			#include <logdepthbuf_fragment>

			float flowMapOffset0 = config.x;
			float flowMapOffset1 = config.y;
			float halfCycle = config.z;
			float scale = config.w;

			vec3 toEye = normalize( vToEye );

			// determine flow direction
			vec2 flow;
			#ifdef USE_FLOWMAP
				flow = texture2D( tFlowMap, vUv ).rg * 2.0 - 1.0;
			#else
				flow = flowDirection;
			#endif
			flow.x *= - 1.0;

			// sample normal maps (distort uvs with flowdata)
			vec4 normalColor0 = texture2D( tNormalMap0, ( vUv * scale ) + flow * flowMapOffset0 );
			vec4 normalColor1 = texture2D( tNormalMap1, ( vUv * scale ) + flow * flowMapOffset1 );

			// linear interpolate to get the final normal color
			float flowLerp = abs( halfCycle - flowMapOffset0 ) / halfCycle;
			vec4 normalColor = mix( normalColor0, normalColor1, flowLerp );

			// calculate normal vector
			vec3 normal = normalize( vec3( normalColor.r * 2.0 - 1.0, normalColor.b,  normalColor.g * 2.0 - 1.0 ) );

			// calculate the fresnel term to blend reflection and refraction maps
			float theta = max( dot( toEye, normal ), 0.0 );
			float reflectance = reflectivity + ( 1.0 - reflectivity ) * pow( ( 1.0 - theta ), 5.0 );

			// calculate final uv coords
			vec3 coord = vCoord.xyz / vCoord.w;
			vec2 uv = coord.xy + coord.z * normal.xz * 0.05;

			vec4 reflectColor = texture2D( tReflectionMap, vec2( 1.0 - uv.x, uv.y ) );
			vec4 refractColor = texture2D( tRefractionMap, uv );

			// multiply water color with the mix of both textures
			gl_FragColor = vec4( color, 1.0 ) * mix( refractColor, reflectColor, reflectance );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>

		}`};const ve=Object.assign({name:"Exmple6"},{__name:"Exmple6",setup(xe){let y=0,a=0,i;const h=new Z,M=new B(45,window.innerWidth/window.innerHeight,1,200);M.position.set(-15,7,15),M.lookAt(h.position);const b=new ee({antialias:!0});b.setPixelRatio(window.devicePixelRatio);const C=()=>b.render(h,M),v=new ue(M,b.domElement);v.maxPolarAngle=Math.PI*.45;const S=new te;S.setPath("texture/exmple6/");const s=S.load(["posx.jpg","negx.jpg","posy.jpg","negy.jpg","posz.jpg","negz.jpg"]);h.background=s;const g=new ae(15198183,1.2);h.add(g);const d=new oe(16777215,2);d.position.set(-1,1,1),h.add(d);const x=new X;x.setPath("texture/exmple6/"),x.load("hardwood2_diffuse.jpg",o=>{o.wrapS=E,o.wrapT=E,o.colorSpace=re,o.anisotropy=16,o.repeat.set(4,4);const u=new V(20,20),p=new ne({roughness:.8,metalness:.7,map:o});p.needsUpdate=!0;const z=new D(u,p);z.rotation.x=-Math.PI/2,h.add(z)});const m={color:"#ffffff",scale:4,flowX:1,flowY:1},_=new V(20,20),l=new O(_,{color:m.color,scale:m.scale,flowDirection:new q(m.flowX,m.flowY),textureWidth:1024,textureHeight:1024});l.position.y=1,l.rotation.x=Math.PI*-.5,h.add(l);const w=x.load("color.jpg"),R=new ie({color:16777215,map:w,roughness:.5,metalness:.1}),e=new le(1.5,32,32),r=new D(e,R);r.position.y=2,h.add(r);const t=new se.GUI;t.addColor(m,"color").onChange(function(o){l.material.uniforms.color.value.set(o)}),t.add(m,"scale",1,10).onChange(function(o){l.material.uniforms.config.value.w=o}),t.add(m,"flowX",-1,1).step(.01).onChange(function(o){l.material.uniforms.flowDirection.value.x=o,l.material.uniforms.flowDirection.value.normalize()}),t.add(m,"flowY",-1,1).step(.01).onChange(function(o){l.material.uniforms.flowDirection.value.y=o,l.material.uniforms.flowDirection.value.normalize()}),t.open();const c=k(),f=k(),n=()=>{requestAnimationFrame(n);const o=performance.now()*.001;r.position.y=Math.sin(o)*.8+1.5,r.rotation.x=o*.5,r.rotation.z=o*.51,v.update(),C()};return n(),window.addEventListener("resize",()=>{y=i.width,a=i.height,M.aspect=y/a,b.setSize(y,a),M.updateProjectionMatrix()}),fe(()=>{var o;i=c.value.getBoundingClientRect(),y=i.width,a=i.height,b.setSize(y,a),C(),c.value.appendChild(b.domElement),(o=f.value)==null||o.appendChild(t.domElement)}),(o,u)=>(de(),me("div",{ref_key:"sceneRef",ref:c,class:"right-box"},[pe("div",{ref_key:"guiRef",ref:f,id:"gui",class:"gui-box"},null,512)],512))}}),We=ce(ve,[["__scopeId","data-v-3f87abd3"]]);export{We as default};
