// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import shaderSource25 from "../shaders/TextMaterial-Fv-25.vert.glsl?raw";
import shaderSource26 from "../shaders/TextMaterial-Iv-26.frag.glsl?raw";
import { Vector2 } from "three";
import { ShaderMaterial } from "./ShaderMaterial";
var jv: any = 1.5;
var Mv: any = 3072;
function atlasUv(
  this: any,
  e?: any,
  t?: any,
  n?: any,
  r?: any,
  i: any = !1,
): any {
  let a: any = jv,
    o: any = Mv,
    s: any = i ? r : n,
    c: any = i ? n : r,
    l: any = e * a,
    u: any = t * a,
    d: any = s * a,
    f: any = c * a;
  return {
    offset: [l / o, 1 - (u + f) / o],
    scale: [d / o, f / o],
  };
}
function atlasAspect(this: any, e?: any, t?: any): any {
  return e / t;
}
var Fv: any = shaderSource25;
var Iv: any = shaderSource26;
function createRippleTextMaterial(
  this: any,
  { useRipple: e = !0 }: any = {},
): any {
  let t: any = {
    uTextureA: {
      value: null,
    },
    uTextureB: {
      value: null,
    },
    uTexOffsetA: {
      value: new Vector2(0, 0),
    },
    uTexScaleA: {
      value: new Vector2(1, 1),
    },
    uTexOffsetB: {
      value: new Vector2(0, 0),
    },
    uTexScaleB: {
      value: new Vector2(1, 1),
    },
    uProgress: {
      value: 0,
    },
    uOpacity: {
      value: 1,
    },
    uAlphaMap: {
      value: null,
    },
    uAlphaOffset: {
      value: new Vector2(0, 0),
    },
    uAlphaScale: {
      value: new Vector2(1, 1),
    },
  };
  e &&
    ((t.uRippleTime = {
      value: 0,
    }),
    (t.uRippleIntensity = {
      value: 0,
    }),
    (t.uRippleResolution = {
      value: new Vector2(1, 1),
    }),
    (t.uRippleHw = {
      value: 0.75,
    }));
  return new ShaderMaterial({
    vertexShader: Fv,
    fragmentShader: Iv,
    defines: e
      ? {
          USE_RIPPLE: ``,
        }
      : {},
    uniforms: t,
    transparent: !0,
    premultipliedAlpha: !0,
    side: 0,
    depthWrite: !0,
    depthTest: !0,
  });
}
export { jv, Mv, atlasUv, atlasAspect, Fv, Iv, createRippleTextMaterial };
