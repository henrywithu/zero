// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import shaderSource50 from "../shaders/MapMarkers-uD-50.vert.glsl?raw";
import shaderSource51 from "../shaders/MapMarkers-dD-51.frag.glsl?raw";
import shaderSource52 from "../shaders/MapMarkers-mD-52.vert.glsl?raw";
import shaderSource53 from "../shaders/MapMarkers-hD-53.frag.glsl?raw";
import shaderSource54 from "../shaders/MapMarkers-gD-54.vert.glsl?raw";
import shaderSource55 from "../shaders/MapMarkers-_D-55.frag.glsl?raw";
var eD: any = {
  x: -0.008,
  y: -0.017,
  sizeX: 1.73,
  sizeY: 0.91,
};
function tD(this: any, e?: any, t?: any): any {
  e &&
    (e.position.set(eD.x * t, eD.y * t, 0.02),
    e.scale.set(eD.sizeX, eD.sizeY, 1));
}
var nD: any = 3;
var rD: any = 1.4;
var iD: any = 1.8;
var aD: any = 2.8;
var oD: any = 4;
var sD: any = 13434624;
var cD: any = {
  towerColor: `#4dff4d`,
  towerOpacity: 1.6,
  rippleColor: `#4dff4d`,
  rippleOpacity: 0.5,
};
function lD(this: any, e?: any): any {
  let t: any = cD,
    n: any = e && e.components;
  if (
    n &&
    (n.cylinder &&
      (n.cylinder.material.uniforms.uColor.value.set(t.towerColor),
      (e._stage5CylBaseAlpha = t.towerOpacity),
      e._stage5RipplesActive &&
        (n.cylinder.material.uniforms.uBaseAlpha.value = t.towerOpacity)),
    n.rippleRings)
  )
    for (let e of n.rippleRings)
      e.mesh.material.uniforms.uColor.value.set(t.rippleColor);
}
var uD: any = shaderSource50;
var dD: any = shaderSource51;
var fD: any = 3.4;
var pD: any = 28;
var mD: any = shaderSource52;
var hD: any = shaderSource53;
var gD: any = shaderSource54;
var _D: any = shaderSource55;
var vD: any = 0.6;
export {
  eD,
  tD,
  nD,
  rD,
  iD,
  aD,
  oD,
  sD,
  cD,
  lD,
  uD,
  dD,
  fD,
  pD,
  mD,
  hD,
  gD,
  _D,
  vD,
};
