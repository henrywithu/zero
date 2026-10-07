// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import shaderSource1 from "../shaders/BackgroundPass-c_-1.vert.glsl?raw";
import shaderSource2 from "../shaders/BackgroundPass-l_-2.frag.glsl?raw";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { Vector2, Vector4 } from "three";
import { ShaderMaterial } from "./ShaderMaterial";
var c_: any = shaderSource1;
var l_: any = shaderSource2;
function createBackgroundPass(this: any): any {
  return new ShaderPass(
    new ShaderMaterial({
      vertexShader: c_,
      fragmentShader: l_,
      uniforms: {
        tDiffuse: {
          value: null,
        },
        uTextureA: {
          value: null,
        },
        uTextureB: {
          value: null,
        },
        uProgress: {
          value: 0,
        },
        uOpacity: {
          value: 1,
        },
        uLinearizeA: {
          value: 0,
        },
        uLinearizeB: {
          value: 0,
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
        uZoom: {
          value: 1,
        },
        uParallaxOn: {
          value: 0,
        },
        uParallaxSlot: {
          value: 0,
        },
        uAtlas: {
          value: null,
        },
        uAtlasCell: {
          value: new Vector2(1 / 3, 1 / 2),
        },
        uAtlasInset: {
          value: new Vector2(0, 0),
        },
        uParallax: {
          value: new Vector2(0, 0),
        },
        uParallaxAmp: {
          value: 0.025,
        },
        uBgParallax: {
          value: new Vector2(0, 0),
        },
        uBgParallaxAmp: {
          value: 0,
        },
        uLayerRect: {
          value: Array.from(
            {
              length: 6,
            },
            (): any => new Vector4(0, 0, 1, 1),
          ),
        },
        uLayerHalfSize: {
          value: Array.from(
            {
              length: 6,
            },
            (): any => new Vector2(0.5, 0.5),
          ),
        },
        uLayerCenter: {
          value: Array.from(
            {
              length: 6,
            },
            (): any => new Vector2(0.5, 0.5),
          ),
        },
        uLayerDepth: {
          value: new Float32Array([1, 0.7, 0.55, 0.4, 0.2, 0.1]),
        },
        uGardenBright: {
          value: 1,
        },
        uGardenWhitewash: {
          value: 0.05,
        },
        uGardenBloom: {
          value: 0.15,
        },
      },
      depthWrite: !1,
      depthTest: !1,
    }),
  );
}
export { c_, l_, createBackgroundPass };
