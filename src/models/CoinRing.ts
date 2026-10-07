import extractedShader58 from "../shaders/CoinRing-extracted-58.vert.glsl?raw";
import { interpolateShader } from "../rendering/ShaderMaterial";
// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import {
  hy,
  my,
  Zv,
  Qv,
  $v,
  Yv,
  py,
  fy,
  ly,
  ey,
  ry,
  ny,
  cy,
  Xv,
  ty,
  iy,
  sy,
  uy,
  oy,
  dy,
} from "./HandsModel.ts";
import { Group, CylinderGeometry, MeshBasicMaterial, Mesh } from "three";
import shaderSource28 from "../shaders/CoinRing-eb-28.frag.glsl?raw";
function gy(this: any, e?: any): any {
  let t: any = [];
  if (!e) return t;
  for (let [n, r, i, a] of hy) {
    let o: any = e.clone();
    o.repeat.set(i / my, a / my);
    o.offset.set(n / my, 1 - (r + a) / my);
    t.push(o);
  }
  return t;
}
var _y: any = -0.5;
var vy: any = 0.1;
var yy: any = -0.02;
var by: any = -0.25;
var xy: any = 0.1;
var Sy: any = 0;
var Cy: any = 128;
var wy: any = new Float32Array(129);
{
  let e: any = 0.9;
  wy[0] = 0;
  wy[Cy] = 1;
  for (let t: any = 1; t < Cy; t++) {
    let n: any = t / Cy;
    wy[t] = 2 ** (-8 * n) * Math.sin(((n - e / 4) * (2 * Math.PI)) / e) + 1;
  }
}
function Ty(this: any, e?: any): any {
  if (e <= 0) return 0;
  if (e >= 1) return 1;
  let t: any = e * Cy,
    n: any = t | 0,
    r: any = t - n;
  return wy[n] + (wy[n + 1] - wy[n]) * r;
}
var CoinRing = class {
  declare _logoTextures: any;
  declare _disposed: any;
  declare _faceMaterials: any;
  declare _sharedGeometry: any;
  declare _coinMeshes: any;
  declare _ringAngle: any;
  declare group: any;
  constructor(e?: any) {
    this.group = new Group();
    this.group.visible = !1;
    this._ringAngle = 0;
    this._coinMeshes = [];
    this._sharedGeometry = null;
    this._faceMaterials = [];
    this._disposed = !1;
    this._logoTextures = e || [];
    this._buildRing();
  }
  _buildRing(): any {
    this._sharedGeometry = new CylinderGeometry(Zv, Zv, Qv, $v, 1, !1);
    for (let e: any = 0; e < Yv; e++) {
      let t: any = (e / Yv) * Math.PI * 2,
        n: any = this._logoTextures[e] || null,
        r: any = new MeshBasicMaterial({
          color: py[e] || 16777215,
          toneMapped: !1,
        }),
        i: any = new MeshBasicMaterial({
          map: n,
          color: fy,
          transparent: !0,
          toneMapped: !1,
        });
      this._faceMaterials.push(r, i);
      let a: any = [r, i, i],
        o: any = new Mesh(this._sharedGeometry, a);
      o.position.set(0, 0, 0);
      o.scale.setScalar(ly);
      o.rotation.z = Math.PI / 2;
      o.userData.selfSpinAngle = Math.random() * Math.PI * 2;
      o.userData.cosAngle = Math.cos(t);
      o.userData.sinAngle = Math.sin(t);
      o.userData.radiusFraction = 0;
      o.userData.targetFraction = 0;
      o.userData.startFraction = 0;
      o.userData.animTime = 0;
      o.userData.isAnimating = !1;
      this.group.add(o);
      this._coinMeshes.push(o);
    }
  }
  update(e?: any, t?: any): any {
    if (!this.group.visible) return;
    let n: any = ey * Math.max(ry, 1 + Math.abs(t) * ny);
    this._ringAngle += n * e;
    this.group.rotation.x = this._ringAngle;
    this.group.rotation.z = Math.PI / 2;
    for (let t: any = 0; t < this._coinMeshes.length; t++) {
      let n: any = this._coinMeshes[t],
        r: any = n.userData;
      if (r.isAnimating) {
        r.animTime += e;
        let t: any = Math.min(r.animTime / cy, 1),
          i: any = Ty(t);
        r.radiusFraction =
          r.startFraction + (r.targetFraction - r.startFraction) * i;
        t >= 1 && ((r.radiusFraction = r.targetFraction), (r.isAnimating = !1));
        let a: any = r.radiusFraction * Xv;
        n.position.set(r.cosAngle * a, 0, r.sinAngle * a);
        n.scale.setScalar(ly + (1 - ly) * r.radiusFraction);
      }
      r.radiusFraction > 0.001 &&
        ((r.selfSpinAngle += ty * e), (n.rotation.y = r.selfSpinAngle));
    }
  }
  handleScroll(e?: any, t?: any): any {
    if (t) {
      let n: any = Math.min(1, Math.max(0, (e - iy) / (sy - iy)));
      this.group.position.set(
        t.x + _y + (by - _y) * n,
        t.y + vy + (xy - vy) * n,
        t.z + yy + (Sy - yy) * n,
      );
    }
    let n: any = !1;
    for (let t: any = 0; t < this._coinMeshes.length; t++) {
      let r: any = this._coinMeshes[t].userData,
        i: any = iy + t * uy,
        a: any = oy + t * dy,
        o: any = +(e >= i && e < a);
      o !== r.targetFraction &&
        ((r.startFraction = r.radiusFraction),
        (r.targetFraction = o),
        (r.animTime = 0),
        (r.isAnimating = !0));
      (r.radiusFraction > 0.001 || r.isAnimating) && (n = !0);
    }
    this.group.visible = n;
  }
  dispose(): any {
    if (!this._disposed) {
      this._disposed = !0;
      this._sharedGeometry && this._sharedGeometry.dispose();
      for (let e of this._faceMaterials) e.dispose();
      this._coinMeshes = [];
      this._faceMaterials = [];
      this.group.clear();
    }
  }
};
var Dy: any = 450;
var Oy: any = 1.7;
var ky: any = -0.5;
var Ay: any = 0.7;
var jy: any = 1.1;
var My: any = 0.0084;
var Ny: any = 0.06;
var Py: any = 0.07;
var Fy: any = 0.18;
var Iy: any = 0.08;
var Ly: any = 0.3;
var Ry: any = 1.2;
var zy: any = 6;
var By: any = 3;
var Vy: any = 0.12;
var Hy: any = 0.15;
var Uy: any = 0.08;
var Wy: any = 0.02;
var Gy: any = 8;
var Ky: any = 6;
var qy: any = 7;
var Jy: any = 1.3;
var Yy: any = 2048;
var Xy: any = [
  [0, 1249, 256, 234],
  [256, 1249, 256, 311],
  [0, 1483, 256, 311],
  [256, 1560, 256, 311],
  [986, 1243, 256, 311],
  [1242, 1243, 256, 311],
  [1498, 1243, 256, 311],
  [1754, 1243, 256, 311],
  [986, 1560, 256, 311],
  [1242, 1560, 256, 311],
  [1498, 1560, 256, 311],
  [1754, 1560, 256, 311],
].map(([e, t, n, r]: any): any => [e / Yy, 1 - (t + r) / Yy, n / Yy, r / Yy]);
var Zy: any = 6;
var Qy: any = 3;
var $y: any = interpolateShader(extractedShader58, {
  __ZERO_PARAM_0__: Hy.toFixed(1),
  __ZERO_PARAM_1__: Uy.toFixed(1),
  __ZERO_PARAM_2__: Gy.toFixed(1),
  __ZERO_PARAM_3__: Jy.toFixed(1),
  __ZERO_PARAM_4__: Wy.toFixed(3),
  __ZERO_PARAM_5__: Ky.toFixed(1),
  __ZERO_PARAM_6__: Jy.toFixed(1),
  __ZERO_PARAM_7__: Wy.toFixed(3),
  __ZERO_PARAM_8__: qy.toFixed(1),
  __ZERO_PARAM_9__: Jy.toFixed(1),
  __ZERO_PARAM_10__: Wy.toFixed(3),
  __ZERO_PARAM_11__: zy.toFixed(1),
  __ZERO_PARAM_12__: By.toFixed(1),
  __ZERO_PARAM_13__: Vy.toFixed(2),
  __ZERO_PARAM_14__: zy.toFixed(1),
  __ZERO_PARAM_15__: Vy.toFixed(2),
});
var eb: any = shaderSource28;
export {
  gy,
  _y,
  vy,
  yy,
  by,
  xy,
  Sy,
  Cy,
  wy,
  Ty,
  CoinRing,
  Dy,
  Oy,
  ky,
  Ay,
  jy,
  My,
  Ny,
  Py,
  Fy,
  Iy,
  Ly,
  Ry,
  zy,
  By,
  Vy,
  Hy,
  Uy,
  Wy,
  Gy,
  Ky,
  qy,
  Jy,
  Yy,
  Xy,
  Zy,
  Qy,
  $y,
  eb,
};
