// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { Vector2 } from "three";
import { ShaderMaterial } from "./ShaderMaterial";
import { nb, rb } from "../models/PetalParticles.ts";
function ib(this: any, e?: any, t?: any, n?: any, r?: any, i: any = !1): any {
  return new ShaderMaterial({
    vertexShader: nb,
    fragmentShader: rb,
    defines: i
      ? {
          LITE_TEXT: ``,
        }
      : {},
    uniforms: {
      uTexture: {
        value: e || null,
      },
      uMaxBlur: {
        value: 6,
      },
      uProgress: {
        value: 0,
      },
      uAtlasOffset: {
        value: new Vector2(t ? t.offset[0] : 0, t ? t.offset[1] : 0),
      },
      uAtlasScale: {
        value: new Vector2(t ? t.scale[0] : 1, t ? t.scale[1] : 1),
      },
      uNoiseSeed: {
        value: Math.random() * 8,
      },
      uAspect: {
        value: n || 1,
      },
      uRotate: {
        value: +!!r,
      },
    },
    transparent: !0,
    depthWrite: !1,
    depthTest: !0,
    side: 2,
  });
}
export { ib };
