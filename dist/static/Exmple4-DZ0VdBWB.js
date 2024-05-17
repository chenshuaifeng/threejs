import{j as G,w as K,U as A,x as ee,t as Z,V as i,C as F,y as te,z as oe,M as N,G as U,P as q,J as ae,K as j,c as ne,W as ie,m as re,T as se,R as O,o as le,O as ce,i as ue,Q as V}from"./three.module-B48SNEox.js";import{d as me}from"./dat.gui.module-DqesmVVB.js";import{_ as de}from"./index-HC9wGKDV.js";import{O as fe}from"./OrbitControls-BQkA2Aq0.js";import{r as H,d as ve,m as pe,p as he,q as ge}from"./vue-SvvCd1mE.js";import"./element-C1lpoOYO.js";import"./vxe-YBxjpzKi.js";class L extends G{constructor(){const r=L.SkyShader,e=new K({name:r.name,uniforms:A.clone(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:ee,depthWrite:!1});super(new Z(1,1,1),e),this.isSky=!0}}L.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new i},up:{value:new i(0,1,0)}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;
		uniform vec3 up;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( dot( vSunDirection, up ) );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorbtion + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform vec3 up;

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
			L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

			vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

			vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

			gl_FragColor = vec4( retColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};class xe extends G{constructor(r,e={}){super(r),this.isWater=!0;const o=this,h=e.textureWidth!==void 0?e.textureWidth:512,s=e.textureHeight!==void 0?e.textureHeight:512,z=e.clipBias!==void 0?e.clipBias:0,T=e.alpha!==void 0?e.alpha:1,B=e.time!==void 0?e.time:0,k=e.waterNormals!==void 0?e.waterNormals:null,w=e.sunDirection!==void 0?e.sunDirection:new i(.70707,.70707,0),y=new F(e.sunColor!==void 0?e.sunColor:16777215),P=new F(e.waterColor!==void 0?e.waterColor:8355711),D=e.eye!==void 0?e.eye:new i(0,0,0),_=e.distortionScale!==void 0?e.distortionScale:20,R=e.side!==void 0?e.side:te,E=e.fog!==void 0?e.fog:!1,c=new oe,m=new i,g=new i,d=new i,f=new N,S=new i(0,0,-1),a=new U,v=new i,M=new i,p=new U,C=new N,t=new q,x=new ae(h,s),W={name:"MirrorShader",uniforms:A.merge([j.fog,j.lights,{normalSampler:{value:null},mirrorSampler:{value:null},alpha:{value:1},time:{value:0},size:{value:1},distortionScale:{value:20},textureMatrix:{value:new N},sunColor:{value:new F(8355711)},sunDirection:{value:new i(.70707,.70707,0)},eye:{value:new i},waterColor:{value:new F(5592405)}}]),vertexShader:`
				uniform mat4 textureMatrix;
				uniform float time;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				#include <common>
				#include <fog_pars_vertex>
				#include <shadowmap_pars_vertex>
				#include <logdepthbuf_pars_vertex>

				void main() {
					mirrorCoord = modelMatrix * vec4( position, 1.0 );
					worldPosition = mirrorCoord.xyzw;
					mirrorCoord = textureMatrix * mirrorCoord;
					vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );
					gl_Position = projectionMatrix * mvPosition;

				#include <beginnormal_vertex>
				#include <defaultnormal_vertex>
				#include <logdepthbuf_vertex>
				#include <fog_vertex>
				#include <shadowmap_vertex>
			}`,fragmentShader:`
				uniform sampler2D mirrorSampler;
				uniform float alpha;
				uniform float time;
				uniform float size;
				uniform float distortionScale;
				uniform sampler2D normalSampler;
				uniform vec3 sunColor;
				uniform vec3 sunDirection;
				uniform vec3 eye;
				uniform vec3 waterColor;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				vec4 getNoise( vec2 uv ) {
					vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
					vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
					vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
					vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
					vec4 noise = texture2D( normalSampler, uv0 ) +
						texture2D( normalSampler, uv1 ) +
						texture2D( normalSampler, uv2 ) +
						texture2D( normalSampler, uv3 );
					return noise * 0.5 - 1.0;
				}

				void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {
					vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );
					float direction = max( 0.0, dot( eyeDirection, reflection ) );
					specularColor += pow( direction, shiny ) * sunColor * spec;
					diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;
				}

				#include <common>
				#include <packing>
				#include <bsdfs>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <lights_pars_begin>
				#include <shadowmap_pars_fragment>
				#include <shadowmask_pars_fragment>

				void main() {

					#include <logdepthbuf_fragment>
					vec4 noise = getNoise( worldPosition.xz * size );
					vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );

					vec3 diffuseLight = vec3(0.0);
					vec3 specularLight = vec3(0.0);

					vec3 worldToEye = eye-worldPosition.xyz;
					vec3 eyeDirection = normalize( worldToEye );
					sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );

					float distance = length(worldToEye);

					vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;
					vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );

					float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );
					float rf0 = 0.3;
					float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );
					vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;
					vec3 albedo = mix( ( sunColor * diffuseLight * 0.3 + scatter ) * getShadowMask(), ( vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight ), reflectance);
					vec3 outgoingLight = albedo;
					gl_FragColor = vec4( outgoingLight, alpha );

					#include <tonemapping_fragment>
					#include <colorspace_fragment>
					#include <fog_fragment>	
				}`},l=new K({name:W.name,uniforms:A.clone(W.uniforms),vertexShader:W.vertexShader,fragmentShader:W.fragmentShader,lights:!0,side:R,fog:E});l.uniforms.mirrorSampler.value=x.texture,l.uniforms.textureMatrix.value=C,l.uniforms.alpha.value=T,l.uniforms.time.value=B,l.uniforms.normalSampler.value=k,l.uniforms.sunColor.value=y,l.uniforms.waterColor.value=P,l.uniforms.sunDirection.value=w,l.uniforms.distortionScale.value=_,l.uniforms.eye.value=D,o.material=l,o.onBeforeRender=function(n,J,b){if(g.setFromMatrixPosition(o.matrixWorld),d.setFromMatrixPosition(b.matrixWorld),f.extractRotation(o.matrixWorld),m.set(0,0,1),m.applyMatrix4(f),v.subVectors(g,d),v.dot(m)>0)return;v.reflect(m).negate(),v.add(g),f.extractRotation(b.matrixWorld),S.set(0,0,-1),S.applyMatrix4(f),S.add(d),M.subVectors(g,S),M.reflect(m).negate(),M.add(g),t.position.copy(v),t.up.set(0,1,0),t.up.applyMatrix4(f),t.up.reflect(m),t.lookAt(M),t.far=b.far,t.updateMatrixWorld(),t.projectionMatrix.copy(b.projectionMatrix),C.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),C.multiply(t.projectionMatrix),C.multiply(t.matrixWorldInverse),c.setFromNormalAndCoplanarPoint(m,g),c.applyMatrix4(t.matrixWorldInverse),a.set(c.normal.x,c.normal.y,c.normal.z,c.constant);const u=t.projectionMatrix;p.x=(Math.sign(a.x)+u.elements[8])/u.elements[0],p.y=(Math.sign(a.y)+u.elements[9])/u.elements[5],p.z=-1,p.w=(1+u.elements[10])/u.elements[14],a.multiplyScalar(2/a.dot(p)),u.elements[2]=a.x,u.elements[6]=a.y,u.elements[10]=a.z+1-z,u.elements[14]=a.w,D.setFromMatrixPosition(b.matrixWorld);const Q=n.getRenderTarget(),Y=n.xr.enabled,$=n.shadowMap.autoUpdate;o.visible=!1,n.xr.enabled=!1,n.shadowMap.autoUpdate=!1,n.setRenderTarget(x),n.state.buffers.depth.setMask(!0),n.autoClear===!1&&n.clear(),n.render(J,t),o.visible=!0,n.xr.enabled=Y,n.shadowMap.autoUpdate=$,n.setRenderTarget(Q);const I=b.viewport;I!==void 0&&n.state.viewport(I)}}}const we=Object.assign({name:"Exmple4"},{__name:"Exmple4",setup(X){let r=0,e=0;const o=new ne;o.castShadow=!0;const h=new q(55,window.innerWidth/window.innerHeight,.1,2e3);h.position.set(37,25,107);const s=new ie({antialias:!0});s.setPixelRatio(window.devicePixelRatio),s.toneMapping=re,s.toneMappingExposure=.5;const z=()=>s.render(o,h),T=new fe(h,s.domElement);T.maxPolarAngle=Math.PI*.4,T.update();const B=new se().setPath("texture/exmple3/").load("waternormals.jpg",t=>{t.wrapS=O,t.wrapT=O}),k=new le(1e4,1e4),w=new xe(k,{textureWidth:512,textureHeight:512,waterNormals:B,sunDirection:new i,sunColor:16777215,waterColor:7695,distortionScale:3.7,fog:o.fog!==void 0});w.rotation.x=-Math.PI/2,o.add(w);const y=new L;y.scale.setScalar(1e4);const P=y.material.uniforms;P.turbidity.value=10,P.rayleigh.value=2,P.mieCoefficient.value=.005,P.mieDirectionalG.value=.8;const D=new ce(s),_={elevation:2,azimuth:180},R=new i;let E;function c(){const t=V.degToRad(90-_.elevation),x=V.degToRad(_.azimuth);R.setFromSphericalCoords(1,t,x),y.material.uniforms.sunPosition.value.copy(R),w.material.uniforms.sunDirection.value.copy(R).normalize(),E!==void 0&&E.dispose(),E=D.fromScene(y),o.environment=E.texture}c(),o.add(y);const m=new Z(30,30,30),g=new ue({roughness:0}),d=new G(m,g);d.position.y=20,o.add(d);const f=H(),S=H(),a=new me.GUI;a.addFolder("threjs配置").open();const v=a.addFolder("Sky");v.add(_,"elevation",0,90,.1).onChange(c),v.add(_,"azimuth",-180,180,.1).onChange(c),v.open();const M=w.material.uniforms,p=a.addFolder("Water");p.add(M.distortionScale,"value",0,8,.1).name("distortionScale"),p.add(M.size,"value",.1,10,.1).name("size"),p.open();const C=()=>{requestAnimationFrame(C);const t=performance.now()*.001;d.position.y=Math.sin(t)*20+5,d.rotation.x=t*.5,d.rotation.z=t*.51,w.material.uniforms.time.value+=1/60,s.setSize(r,e),h.updateProjectionMatrix(),z()};return C(),ve(()=>{var x;const t=f.value.getBoundingClientRect();r=t.width,e=t.height,s.setSize(r,e),f.value.appendChild(s.domElement),(x=S.value)==null||x.appendChild(a.domElement),window.addEventListener("resize",()=>{s.setSize(r,e),h.aspect=r/e,h.updateProjectionMatrix(),z()})}),(t,x)=>(pe(),he("div",{ref_key:"sceneRef",ref:f,class:"right-box"},[ge("div",{ref_key:"guiRef",ref:S,id:"gui",class:"gui-box"},null,512)],512))}}),be=de(we,[["__scopeId","data-v-60840dcb"]]);export{be as default};
