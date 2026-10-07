// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import shaderSource47 from "../shaders/MapMaterials-tC-47.frag.glsl?raw";
import "three";
import { ShaderMaterial } from "./ShaderMaterial";
import { $S, eC } from "../content/companies.ts";
var tC: any = shaderSource47;
function nC(this: any): any {
  return new ShaderMaterial({
    vertexShader: $S,
    fragmentShader: eC,
    transparent: !0,
    depthTest: !1,
    depthWrite: !1,
  });
}
function rC(this: any): any {
  return new ShaderMaterial({
    vertexShader: $S,
    fragmentShader: tC,
    transparent: !0,
    depthTest: !1,
    depthWrite: !1,
  });
}
export { tC, nC, rC };
