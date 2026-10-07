import { trackPatchedMaterial } from "../rendering/ShaderMaterial";
import extractedShader67 from "../shaders/GateThreeToFour-extracted-67.chunk.glsl?raw";
import extractedShader68 from "../shaders/GateThreeToFour-extracted-68.chunk.glsl?raw";
import extractedShader61 from "../shaders/GateThreeToFour-extracted-61.chunk.glsl?raw";
import extractedShader62 from "../shaders/GateThreeToFour-extracted-62.chunk.glsl?raw";
import extractedShader63 from "../shaders/GateThreeToFour-extracted-63.chunk.glsl?raw";
import extractedShader64 from "../shaders/GateThreeToFour-extracted-64.chunk.glsl?raw";
import extractedShader65 from "../shaders/GateThreeToFour-extracted-65.chunk.glsl?raw";
import { Wx } from "../config/tunnel.ts";
import { Hx } from "../config/tunnel.ts";
import { Ux } from "../config/tunnel.ts";
import { gS } from "../config/atlases.ts";
import { Z } from "../config/tunnel.ts";
// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { loadBitmapTexture, gv, _v } from "./shared.ts";
import {
  PlaneGeometry,
  Mesh,
  BufferGeometry,
  BufferAttribute,
  Points,
  Color,
  Group,
  MeshStandardMaterial,
  Box3,
  Vector3,
  CircleGeometry,
  MeshBasicMaterial,
  PointLight,
} from "three";
import { kx, Mx, Fx, Ix } from "../rendering/TunnelMaterials.ts";
import shaderSource41 from "../shaders/GateThreeToFour-chunk-41.frag.glsl?raw";
import shaderSource42 from "../shaders/GateThreeToFour-chunk-42.frag.glsl?raw";
import { audioManager } from "../audio/AudioManager.ts";
import { setPassTexture } from "../rendering/textureUtils.ts";
var tS: any = [
  {
    position: [0.25, -0.15, 12],
    rotation: [3.3, 0.1, 3.19],
    scale: 0.3,
  },
  {
    position: [-0.2, 0.25, 13.5],
    rotation: [3, -0.3, 3.34],
    scale: 0.28,
  },
  {
    position: [0.3, -0.2, 15],
    rotation: [3.5, 0.4, 2.99],
    scale: 0.25,
  },
  {
    position: [-0.3, 0.35, 16.5],
    rotation: [2.9, -0.2, 3.44],
    scale: 0.3,
  },
  {
    position: [0.2, -0.25, 18],
    rotation: [3.4, 0.3, 3.04],
    scale: 0.26,
  },
  {
    position: [-0.2, 0.1, 19.5],
    rotation: [3.1, -0.5, 3.39],
    scale: 0.28,
  },
];
function nS(this: any, e?: any): any {
  let t: any =
      e.assetLoader.getAsset(`certMatcap`) ||
      loadBitmapTexture(`assets/textures/matcap-certificate.webp`, {
        assetLoader: e.assetLoader,
      }),
    n: any = new PlaneGeometry(1, 1.8, 16, 16),
    r: any = 2048,
    i: any = [
      [0, 0, 492, 912],
      [492, 0, 492, 912],
      [982, 0, 492, 912],
      [0, 911, 491, 1137],
      [492, 913, 490, 1135],
      [983, 912, 491, 911],
    ],
    a: any = e.assetLoader.getAsset(`moneyShredsAtlas`),
    o: any = i.map(([e, t, n, i]: any): any => ({
      offset: [e / r, 1 - (t + i) / r],
      scale: [n / r, i / r],
    })),
    s: any = i.map(([, , e, t]: any): any => e / t),
    c: any = [],
    l: any = [],
    u: any = [],
    d: any = [];
  for (let r: any = 0; r < o.length; r++) {
    let i: any = o[r],
      f: any = Math.random(),
      p: any = kx(a, {
        waviness: 0.012 + Math.random() * 0.008,
        seed: f,
        matcap: t,
        opacity: 0,
        texOffset: i.offset,
        texScale: i.scale,
      }),
      m: any = new Mesh(n, p),
      h: any = tS[r],
      g: any = s[r];
    m.position.set(...h.position);
    m.rotation.set(...h.rotation);
    m.scale.set(h.scale, (h.scale * 0.5555555555555556) / g, h.scale);
    e.scene.add(m);
    c.push(m);
    l.push(p);
    u.push(f);
    d.push([...h.rotation]);
  }
  e.components.shredMeshes = c;
  e.components.shredMaterials = l;
  e.components.shredSeeds = u;
  e.components.shredBaseRotations = d;
  e.components.shredGeo = n;
}
function rS(this: any, e?: any): any {
  let t: any = new Float32Array(750),
    n: any = new Float32Array(250),
    r: any = new Float32Array(250);
  for (let e: any = 0; e < 250; e++) {
    t[e * 3] = (Math.random() - 0.5) * 3;
    t[e * 3 + 1] = (Math.random() - 0.5) * 3;
    t[e * 3 + 2] = 10 + Math.random() * 15;
    n[e] = 15 + Math.random() * 20;
    r[e] = Math.random();
  }
  let i: any = new BufferGeometry();
  i.setAttribute(`position`, new BufferAttribute(t, 3));
  i.setAttribute(`aSize`, new BufferAttribute(n, 1));
  i.setAttribute(`aSeed`, new BufferAttribute(r, 1));
  let a: any = Mx(e.renderer.getPixelRatio()),
    o: any = new Points(i, a);
  o.frustumCulled = !1;
  e.scene.add(o);
  e.components.dustPoints = o;
  e.components.dustGeo = i;
  e.components.dustMat = a;
}
function iS(this: any, e?: any): any {
  let t: any = new Float32Array(450),
    n: any = new Float32Array(150),
    r: any = new Float32Array(150);
  for (let e: any = 0; e < 150; e++) {
    t[e * 3] = (Math.random() - 0.5) * 0.8;
    t[e * 3 + 1] = (Math.random() - 0.5) * 0.6;
    t[e * 3 + 2] = (Math.random() - 0.5) * 0.9;
    n[e] = 5 + Math.random() * 7;
    r[e] = Math.random();
  }
  let i: any = new BufferGeometry();
  i.setAttribute(`position`, new BufferAttribute(t, 3));
  i.setAttribute(`aSize`, new BufferAttribute(n, 1));
  i.setAttribute(`aSeed`, new BufferAttribute(r, 1));
  let a: any = Fx(e.renderer.getPixelRatio()),
    o: any = new Points(i, a);
  o.frustumCulled = !1;
  e.scene.add(o);
  e.components.emberPoints = o;
  e.components.emberGeo = i;
  e.components.emberMat = a;
}
var aS: any = 27;
var oS: any = 8;
function sS(this: any, e?: any): any {
  let t: any = e && e.components;
  if (t && t.tunnelMaterials)
    for (let e of t.tunnelMaterials) {
      e.color.set(Z.innerColor);
      e.emissive.set(Z.innerEmissive);
      e.emissiveIntensity = Z.innerEmissiveIntensity;
      e.metalness = Z.innerMetalness;
      e.roughness = Z.innerRoughness;
    }
}
function cS(this: any, e?: any, t?: any): any {
  e.uniforms.uPulseTime = t.uPulseTime;
  e.uniforms.uPulseFreq = t.uPulseFreq;
  e.uniforms.uPulseWidth = t.uPulseWidth;
  e.uniforms.uPulseGain = t.uPulseGain;
  e.uniforms.uPlaneGlowZ = t.uPlaneGlowZ;
  e.uniforms.uPlaneGlowStrength = t.uPlaneGlowStrength;
  e.uniforms.uPlaneGlowWidth = t.uPlaneGlowWidth;
  e.uniforms.uPlaneGlowColor = t.uPlaneGlowColor;
  e.uniforms.uBandFreq = t.uBandFreq;
  e.uniforms.uBandWidth = t.uBandWidth;
  e.uniforms.uBandStrength = t.uBandStrength;
  e.uniforms.uBandPhase = t.uBandPhase;
  e.uniforms.uBandTransparent = t.uBandTransparent;
  e.uniforms.uBandOrigin = t.uBandOrigin;
  e.vertexShader = e.vertexShader.replace(
    `#include <common>`,
    extractedShader61,
  );
  e.vertexShader = e.vertexShader.replace(
    `#include <begin_vertex>`,
    extractedShader67,
  );
  e.fragmentShader = e.fragmentShader.replace(
    `#include <common>`,
    extractedShader62,
  );
  e.fragmentShader = e.fragmentShader.replace(
    `#include <emissivemap_fragment>`,
    extractedShader63,
  );
  e.fragmentShader = e.fragmentShader.replace(
    `#include <dithering_fragment>`,
    shaderSource41,
  );
}
function lS(this: any, e?: any, t?: any, n: any = 0, r: any = 1): any {
  let i: any = e.components && e.components.tunnelPulseUniforms;
  if (!i) return;
  let a: any = Math.max(Z.pulseSpacing, 0.001) / (1 + n * (Ux - 1)),
    o: any = Z.pulseSpeed * (1 + n * (Hx - 1));
  i.uPulseTime.value += (o / a) * t;
  i.uPulseFreq.value = 1 / a;
  i.uPulseWidth.value = Z.pulseWidth;
  i.uPulseGain.value = Z.pulseGain * (1 + n * (Wx - 1));
  i.uBandFreq.value = 1 / Math.max(Z.bandSpacing, 0.001);
  i.uBandWidth.value = Z.bandWidth;
  i.uBandStrength.value = Z.bandStrength * r;
  i.uBandPhase.value = Z.bandPhase;
  i.uBandTransparent.value = +!!Z.bandTransparent;
  let s: any = e.components && e.components.tunnelGroup;
  i.uBandOrigin.value = s ? s.position.z : 0;
}
function uS(this: any, e?: any): any {
  let t: any = e.assetLoader.getAsset(`tunnelModel`),
    n: any = [],
    r: any = {
      uPulseTime: {
        value: 0,
      },
      uPulseFreq: {
        value: 1 / Z.pulseSpacing,
      },
      uPulseWidth: {
        value: Z.pulseWidth,
      },
      uPulseGain: {
        value: Z.pulseGain,
      },
      uPlaneGlowZ: {
        value: 0,
      },
      uPlaneGlowStrength: {
        value: 0,
      },
      uPlaneGlowWidth: {
        value: Z.planeGlowWidth,
      },
      uPlaneGlowColor: {
        value: new Color(10336677),
      },
      uBandFreq: {
        value: 1 / Z.bandSpacing,
      },
      uBandWidth: {
        value: Z.bandWidth,
      },
      uBandStrength: {
        value: Z.bandStrength,
      },
      uBandPhase: {
        value: Z.bandPhase,
      },
      uBandTransparent: {
        value: +!!Z.bandTransparent,
      },
      uBandOrigin: {
        value: 0,
      },
    },
    i: any = new Group();
  if ((i.position.set(0, 0, aS), t)) {
    let a: any = t.clone();
    a.frustumCulled = !1;
    a.scale.setScalar(0.05);
    let o: any = [],
      s: any = 1 / 0,
      c: any = -1 / 0;
    a.traverse((e?: any): any => {
      if (e.isMesh && e.geometry) {
        let t: any = e.geometry.attributes.position;
        for (let e: any = 0; e < t.count; e++) {
          let n: any = t.getY(e);
          n < s && (s = n);
          n > c && (c = n);
        }
      }
    });
    let l: any = s + (c - s) * 0.2,
      u: any = null;
    if (
      (a.traverse((e?: any): any => {
        if (e.isMesh) {
          if (e.name && e.name.toLowerCase().includes(`plane`)) {
            u = e;
            return;
          }
          e.frustumCulled = !1;
          let t: any = new MeshStandardMaterial({
            color: Z.innerColor,
            emissive: Z.innerEmissive,
            emissiveIntensity: Z.innerEmissiveIntensity,
            metalness: Z.innerMetalness,
            roughness: Z.innerRoughness,
            side: 2,
            transparent: !0,
            depthWrite: !0,
            depthTest: !0,
          });
          t.opacity = 0;
          t.onBeforeCompile = (e?: any): any => {
            cS(e, r);
            e.uniforms.uFadeZMin = {
              value: s,
            };
            e.uniforms.uFadeZEnd = {
              value: l,
            };
            e.vertexShader = e.vertexShader.replace(
              `#include <common>`,
              extractedShader64,
            );
            e.vertexShader = e.vertexShader.replace(
              `#include <begin_vertex>`,
              extractedShader68,
            );
            e.fragmentShader = e.fragmentShader.replace(
              `#include <common>`,
              extractedShader65,
            );
            e.fragmentShader = e.fragmentShader.replace(
              `#include <dithering_fragment>`,
              shaderSource42,
            );
          };
          t.customProgramCacheKey = (): any => `tunnel-entrance-fade`;
          trackPatchedMaterial(t);
          e.material = t;
          n.push(t);
          o.push(e);
        }
      }),
      i.add(a),
      u)
    ) {
      a.updateWorldMatrix(!0, !0);
      i.attach(u);
      let t: any = u.material;
      u.material = new MeshStandardMaterial({
        color: 0,
        emissive: 10336677,
        emissiveIntensity: 1,
        transparent: !0,
        opacity: 1,
        side: 2,
        depthWrite: !1,
      });
      t && t.dispose && t.dispose();
      u.frustumCulled = !1;
      u.userData.baseScale = u.scale.x;
      u.scale.setScalar(u.userData.baseScale * Z.planeSize);
      e.components.tunnelPlane = u;
    }
    a.updateWorldMatrix(!0, !0);
    let d: any = new Box3().setFromObject(a),
      f: any = d.max.z - d.min.z;
    if (f > 0) {
      let e: any = new MeshStandardMaterial({
        color: Z.innerColor,
        emissive: Z.innerEmissive,
        emissiveIntensity: Z.innerEmissiveIntensity,
        metalness: Z.innerMetalness,
        roughness: Z.innerRoughness,
        side: 2,
        transparent: !0,
        depthWrite: !0,
        depthTest: !0,
      });
      e.opacity = 0;
      e.onBeforeCompile = (e?: any): any => cS(e, r);
      e.customProgramCacheKey = (): any => `tunnel-pulse`;
      trackPatchedMaterial(e);
      n.push(e);
      for (let t: any = 1; t < oS; t++) {
        let n: any = a.clone();
        n.position.z += f * t;
        i.add(n);
        n.traverse((t?: any): any => {
          t.isMesh && ((t.material = e), o.push(t));
        });
      }
    }
    {
      let t: any = new Vector3();
      d.getSize(t);
      let n: any = new Mesh(
        new CircleGeometry(Math.max(Math.min(t.x, t.y) / 2, 0.01), 64),
        new MeshBasicMaterial({
          color: 16777215,
          side: 2,
          transparent: !0,
          opacity: 0,
          depthWrite: !1,
        }),
      );
      n.visible = !1;
      n.frustumCulled = !1;
      i.add(n);
      e.components.tunnelCircle = n;
    }
    e.components.tunnelModel = a;
    e.components.tunnelSpinMeshes = o;
  }
  let a: any = new PointLight(10208172, 0, 120, 1.5);
  a.position.set(0, 0, 0);
  i.add(a);
  {
    let t: any = new Box3().setFromObject(i);
    e.components.tunnelChainLocalZMin = t.min.z - i.position.z;
    e.components.tunnelChainLocalZMax = t.max.z - i.position.z;
  }
  e.scene.add(i);
  e.components.tunnelGroup = i;
  e.components.tunnelLight = a;
  e.components.tunnelMaterials = n;
  e.components.tunnelPulseUniforms = r;
}
var dS: any = new Color(10336677);
var fS: any = new Color(16777215);
var pS: any = 10;
var mS: any = 10;
var gateThreeToFour: any = {
  id: `gate3to4`,
  scrollVh: 50,
  autoScroll: !0,
  autoScrollDuration: 3,
  enter(this: any, e?: any): any {
    audioManager.stop(`stage2-ambient`);
    audioManager.play(`tunnel`, {
      rate: 1 / 3,
    });
    e._gate3Stage4MusicStarted = !1;
    e._gate3Elapsed = 0;
    e._gate3CamStartZ = e.camera.position.z;
    window.removeEventListener(`mousemove`, e._onMouseMove);
    e.components &&
      e.components.textLayout &&
      e.components.textLayout.hideAll();
    e.fgPass &&
      (setPassTexture(e.fgPass, `A`, e.whiteTex, !1, !0),
      setPassTexture(e.fgPass, `B`, e.whiteTex, !1, !0),
      (e.fgPass.uniforms.uEnableOverlay.value = 1),
      (e.fgPass.uniforms.uProgress.value = 0),
      (e.fgPass.uniforms.uOpacity.value = 0));
    e.lensBlurPass &&
      (e._gate3StartBlur = e.lensBlurPass.uniforms.uMaxBlur.value);
    e.cameraRig && (e._gate3StartInfluence = e.cameraRig.influence);
  },
  scrub(this: any, e?: any, t?: any): any {
    if (
      (t >= 0.5 &&
        !e._gate3Stage4MusicStarted &&
        ((e._gate3Stage4MusicStarted = !0),
        audioManager.play(`stage4-ambient`)),
      (e._gate3P = t),
      e._gate3CamStartZ !== void 0)
    ) {
      let n: any = t;
      e.camera.position.z = e._gate3CamStartZ + n * mS;
    }
    let n: any = e.components,
      r: any = 1 + (pS - 1) * t;
    if (n && n.tunnelPlane) {
      let e: any = n.tunnelPlane;
      e.material.opacity = 0.99;
      e.material.emissiveIntensity = r;
      e.material.emissive.lerpColors(dS, fS, t);
    }
    if (
      (n &&
        n.tunnelCircle &&
        ((n.tunnelCircle.visible = !0), (n.tunnelCircle.material.opacity = 1)),
      n &&
        n.tunnelPulseUniforms &&
        ((n.tunnelPulseUniforms.uPlaneGlowZ.value =
          e.camera.position.z + Z.planeGlowAhead),
        (n.tunnelPulseUniforms.uPlaneGlowStrength.value = r),
        (n.tunnelPulseUniforms.uPlaneGlowWidth.value =
          Z.planeGlowWidth * (1 + 3 * t)),
        n.tunnelPulseUniforms.uPlaneGlowColor.value.lerpColors(dS, fS, t)),
      e.fgPass)
    ) {
      let n: any = t < 0.85 ? 0 : (t - 0.85) / 0.15;
      e.fgPass.uniforms.uOpacity.value = 1;
      e.fgPass.uniforms.uOverlayCenterReveal.value = n * 7;
    }
    e.lensBlurPass &&
      e._gate3StartBlur !== void 0 &&
      (e.lensBlurPass.uniforms.uMaxBlur.value = e._gate3StartBlur * (1 - t));
    e.cameraRig &&
      e._gate3StartInfluence !== void 0 &&
      (e.cameraRig.influence = e._gate3StartInfluence * (1 - t));
  },
  update(this: any, e?: any, t?: any, n?: any): any {
    e.cameraRig && e.cameraRig.update(n);
    Ix(e);
    let r: any = e._gate3P || 0;
    lS(e, n, 1, 1 - r);
    let i: any = e.components;
    if (r > 0 && i && i.tunnelSpinMeshes) {
      let e: any = Z.gateSpinMax * r ** +Z.gateSpinRamp;
      gv.setFromAxisAngle(_v, n * e);
      for (let e of i.tunnelSpinMeshes) e.quaternion.premultiply(gv);
      i.tunnelPlane && i.tunnelPlane.quaternion.premultiply(gv);
    }
    e.components &&
      e.components.textLayout &&
      e.components.textLayout.update(e._scrollProgress, n);
  },
  teardown(this: any, e?: any): any {
    e.lensBlurPass && (e.lensBlurPass.uniforms.uEnabled.value = 0);
    e.cameraRig && (e.cameraRig.setEnabled(!1), (e.cameraRig.influence = 1));
    delete e._gate3P;
    delete e._gate3Elapsed;
    delete e._gate3CamStartZ;
    delete e._gate3StartBlur;
    delete e._gate3StartInfluence;
    delete e._gate3Stage4MusicStarted;
  },
};
export {
  tS,
  nS,
  rS,
  iS,
  aS,
  oS,
  sS,
  cS,
  lS,
  uS,
  dS,
  fS,
  pS,
  mS,
  gateThreeToFour,
};
