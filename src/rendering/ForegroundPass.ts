// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import {
  DataTexture,
  RedFormat,
  RepeatWrapping,
  NearestFilter,
  Vector2,
  Vector4,
} from "three";
import { ShaderMaterial } from "./ShaderMaterial";
import shaderSource3 from "../shaders/ForegroundPass-m_-3.vert.glsl?raw";
import shaderSource4 from "../shaders/ForegroundPass-h_-4.frag.glsl?raw";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
var d_: any = {
  GLOBAL_TIME_SCALE: 1,
  IS_MOBILE_DEFAULT: !1,
  FOREGROUND: {
    DEFAULT_OPACITY: 1,
    TRANSITION_DURATION: 1,
    ENABLE_OVERLAY_DEFAULT: 1,
    MAX_TEXTURES: 30,
  },
  BACKGROUND: {
    ENABLE_MOTION: 1,
    MOTION_SPEED: 0.1,
  },
  LENS_BLUR: {
    FOCAL_RADIUS: 0.3,
    FALLOFF: 0.3,
    MAX_BLUR: 24,
    ENABLED: 1,
    DESKTOP_SAMPLES: 24,
    MOBILE_SAMPLES: 16,
    MOBILE_BLUR_SCALE: 0.6,
  },
};
var f_: any = 256;
function p_(this: any): any {
  let e: any = f_ * f_,
    t: any = new Uint8Array(e),
    n: any = 305419896;
  for (let r: any = 0; r < e; r++) {
    n |= 0;
    n = (n + 1831565813) | 0;
    let e: any = Math.imul(n ^ (n >>> 15), 1 | n);
    e = (e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ e;
    t[r] = ((e ^ (e >>> 14)) >>> 0) >> 24;
  }
  let r: any = new DataTexture(t, f_, f_, RedFormat);
  r.wrapS = RepeatWrapping;
  r.wrapT = RepeatWrapping;
  r.minFilter = NearestFilter;
  r.magFilter = NearestFilter;
  r.generateMipmaps = !1;
  r.needsUpdate = !0;
  return r;
}
var m_: any = shaderSource3;
var h_: any = shaderSource4;
function createForegroundPass(this: any): any {
  let e: any = d_.FOREGROUND,
    t: any = new DataTexture(new Uint8Array(4), 1, 1);
  t.needsUpdate = !0;
  let n: any = p_(),
    r: any = new ShaderMaterial({
      vertexShader: m_,
      fragmentShader: h_,
      uniforms: {
        tDiffuse: {
          value: null,
        },
        uOverlayTextureA: {
          value: new DataTexture(new Uint8Array(4), 1, 1),
        },
        uOverlayTextureB: {
          value: new DataTexture(new Uint8Array(4), 1, 1),
        },
        uProgress: {
          value: 0,
        },
        uOpacity: {
          value: e.DEFAULT_OPACITY,
        },
        uEnableOverlay: {
          value: e.ENABLE_OVERLAY_DEFAULT,
        },
        uOverlayCenterReveal: {
          value: 10,
        },
        uTime: {
          value: 0,
        },
        uEnableNoise: {
          value: 0,
        },
        uNoiseStrength: {
          value: 0,
        },
        uNoiseTex: {
          value: n,
        },
        uNoiseOffset: {
          value: new Vector2(0, 0),
        },
        uViewportAspect: {
          value: 1,
        },
        uCoverScaleA: {
          value: new Vector2(1, 1),
        },
        uCoverScaleB: {
          value: new Vector2(1, 1),
        },
        uGodRaysTex1: {
          value: t,
        },
        uGodRaysTex2: {
          value: t,
        },
        uGodRaysBlend: {
          value: 0,
        },
        uGodRaysCoverScale1: {
          value: new Vector2(1, 1),
        },
        uGodRaysCoverScale2: {
          value: new Vector2(1, 1),
        },
        uGodRaysRect1: {
          value: new Vector4(0, 0, 1, 1),
        },
        uGodRaysRect2: {
          value: new Vector4(0, 0, 1, 1),
        },
        uGodRaysOpacity: {
          value: 0,
        },
        uEnableGodRays: {
          value: 0,
        },
        uRippleTime: {
          value: 0,
        },
        uRippleStrength: {
          value: 0,
        },
        uRippleHw: {
          value: 0.75,
        },
        uHoverFrostTex: {
          value: t,
        },
        uHoverFrostCoverScale: {
          value: new Vector2(1, 1),
        },
        uHoverPos: {
          value: new Vector2(0.5, 0.5),
        },
        uHoverRadius: {
          value: 0.26,
        },
        uHoverIntensity: {
          value: 0,
        },
        uHoverGlow: {
          value: 0.75,
        },
        uExposure: {
          value: 1,
        },
        uContrast: {
          value: 1,
        },
        uSaturation: {
          value: 1.08,
        },
        uRedTint: {
          value: 0,
        },
      },
      depthWrite: !1,
      depthTest: !1,
      blending: 0,
    }),
    i: any = new ShaderPass(r);
  i._ownedTextures = [
    t,
    n,
    r.uniforms.uOverlayTextureA.value,
    r.uniforms.uOverlayTextureB.value,
  ];
  i.dispose = (): any => {
    for (let e of i._ownedTextures) e && e.dispose();
    r.dispose();
  };
  return i;
}
export { d_, f_, p_, m_, h_, createForegroundPass };
