// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { Vector3, Vector2 } from "three";
import { ShaderMaterial } from "./ShaderMaterial";
import { yb, bb } from "../components/TextSprites.ts";
function createBurnMaterial(
  this: any,
  e: any = null,
  {
    direction: t = `out2in`,
    aspect: n = 1,
    emberColor: r = [4, 0.75, 0.05],
    emberTip: i = [6, 1.5, 0.25],
    charColor: a = [0.02, 0.01, 0.01],
    seed: o = Math.random(),
    burnDelay: s = Math.random() * 0.5,
    burnSpeed: c = 1 + Math.random() * 1.5,
    texOffset: l = [0, 0],
    texScale: u = [1, 1],
    texRotate: d = 0,
  }: any = {},
): any {
  return new ShaderMaterial({
    vertexShader: yb,
    fragmentShader: bb,
    uniforms: {
      uTexture: {
        value: e,
      },
      uBurnProgress: {
        value: 0,
      },
      uBurnScale: {
        value: 4,
      },
      uEmberWidth: {
        value: 0.025,
      },
      uCharWidth: {
        value: 0.18,
      },
      uBurnDirection: {
        value: +(t === `out2in`),
      },
      uAspect: {
        value: n,
      },
      uEmberColor: {
        value: new Vector3(...r),
      },
      uEmberTip: {
        value: new Vector3(...i),
      },
      uCharColor: {
        value: new Vector3(...a),
      },
      uSeed: {
        value: o,
      },
      uBurnDelay: {
        value: s,
      },
      uBurnSpeed: {
        value: c,
      },
      uTime: {
        value: 0,
      },
      uWaveAmp: {
        value: 0.008,
      },
      uWaveFreq: {
        value: 8,
      },
      uTexOffset: {
        value: new Vector2(...l),
      },
      uTexScale: {
        value: new Vector2(...u),
      },
      uTexRotate: {
        value: d,
      },
    },
    transparent: !0,
    side: 2,
    depthWrite: !0,
    depthTest: !0,
  });
}
export { createBurnMaterial };
