import { gS } from "../config/atlases.ts";
// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import "../stages/GateThreeToFour.ts";
import shaderSource43 from "../shaders/CloudField-zS-43.vert.glsl?raw";
import shaderSource44 from "../shaders/CloudField-BS-44.frag.glsl?raw";
import {
  Group,
  PlaneGeometry,
  Vector3,
  Quaternion,
  Matrix4,
  Euler,
  InstancedBufferGeometry,
  InstancedBufferAttribute,
  DynamicDrawUsage,
  Vector2,
  InstancedMesh,
  MathUtils,
} from "three";
import { ShaderMaterial } from "../rendering/ShaderMaterial";
function _S(this: any, e?: any, t?: any, n?: any, r?: any): any {
  return {
    offset: [e / gS, 1 - (t + r) / gS],
    scale: [n / gS, r / gS],
    aspect: n / r,
  };
}
var vS: any = [
  _S(0, 0, 1019, 570),
  _S(1028, 0, 1020, 569),
  _S(0, 584, 973, 377),
  _S(928, 1076, 1120, 411),
  _S(0, 1487, 973, 515),
  _S(1053, 1497, 995, 505),
];
_S(1170, 581, 878, 483);
_S(0, 972, 901, 505);
var yS: any = [
  {
    z: -1.5,
    count: 1,
    scaleMin: 1.5,
    scaleMax: 2.6,
  },
  {
    z: -3,
    count: 3,
    scaleMin: 2.2,
    scaleMax: 3.8,
  },
  {
    z: -5,
    count: 5,
    scaleMin: 2.8,
    scaleMax: 5,
  },
  {
    z: -7,
    count: 8,
    scaleMin: 3.6,
    scaleMax: 6.2,
  },
  {
    z: -9.5,
    count: 12,
    scaleMin: 4.4,
    scaleMax: 7.4,
  },
  {
    z: -12,
    count: 24,
    scaleMin: 5.2,
    scaleMax: 8.6,
  },
  {
    z: -15,
    count: 26,
    scaleMin: 6,
    scaleMax: 9.8,
  },
  {
    z: -18,
    count: 27,
    scaleMin: 7,
    scaleMax: 11,
  },
  {
    z: -21,
    count: 27,
    scaleMin: 8,
    scaleMax: 12.5,
  },
  {
    z: -24,
    count: 25,
    scaleMin: 9,
    scaleMax: 14,
  },
  {
    z: -27.5,
    count: 22,
    scaleMin: 10,
    scaleMax: 15.5,
  },
  {
    z: -31,
    count: 18,
    scaleMin: 11,
    scaleMax: 17,
  },
  {
    z: -34,
    count: 15,
    scaleMin: 12,
    scaleMax: 18.5,
  },
  {
    z: -37,
    count: 12,
    scaleMin: 13,
    scaleMax: 20,
  },
  {
    z: -40,
    count: 10,
    scaleMin: 14,
    scaleMax: 21.5,
  },
  {
    z: -43,
    count: 8,
    scaleMin: 15,
    scaleMax: 23,
  },
  {
    z: -46,
    count: 6,
    scaleMin: 16,
    scaleMax: 24.5,
  },
];
var bS: any = 0.55;
var xS: any = 0.42;
var SS: any = 1;
var CS: any = 30;
var wS: any = -2;
var TS: any = -0.3;
var ES: any = -10;
var DS: any = -62;
var OS: any = 1.2;
var kS: any = 3;
var AS: any = 0.08;
var jS: any = 0.35;
var MS: any = 0.9;
var NS: any = 6;
var PS: any = 5;
var FS: any = 0.2;
var IS: any = 0.6;
var LS: any = 0.25;
var RS: any = 0.7;
var zS: any = shaderSource43;
var BS: any = shaderSource44;
var CloudField = class {
  declare _materials: any;
  declare _groups: any;
  declare _cloudData: any;
  declare _tmpEuler: any;
  declare _tmpMatrix: any;
  declare _tmpScale: any;
  declare _tmpQuat: any;
  declare _tmpPos: any;
  declare _baseGeo: any;
  declare _zBobTime: any;
  declare _smoothVelocity: any;
  declare _lastProgress: any;
  declare _driftAccum: any;
  declare _aspect: any;
  declare _tanHalfFov: any;
  declare _disposed: any;
  declare group: any;
  constructor(e?: any, t?: any, n: any = 30, r: any = 16 / 9) {
    this.group = new Group();
    this._disposed = !1;
    this._tanHalfFov = Math.tan((n * Math.PI) / 360);
    this._aspect = r;
    this._driftAccum = PS * OS;
    this._lastProgress = 0;
    this._smoothVelocity = 0;
    this._zBobTime = 0;
    let i: any = new PlaneGeometry(1, 1);
    this._baseGeo = i;
    this._tmpPos = new Vector3();
    this._tmpQuat = new Quaternion();
    this._tmpScale = new Vector3();
    this._tmpMatrix = new Matrix4();
    this._tmpEuler = new Euler();
    let a: any = t.length,
      o: any = [],
      s: any = Array(a);
    for (let e: any = 0; e < a; e++) s[e] = [];
    for (let e of yS)
      for (let n: any = 0; n < e.count; n++) {
        let n: any = Math.floor(Math.random() * a),
          r: any = t[n],
          i: any = e.z + (Math.random() - 0.5) * 2,
          c: any = Math.abs(i),
          l: any = bS * c,
          u: any = xS * c,
          d: any = (Math.random() * 2 - 1) * l,
          f: any = (Math.random() * 2 - 1) * u,
          p: any = r.aspect || 1.67,
          m: any = e.scaleMin + Math.random() * (e.scaleMax - e.scaleMin),
          h: any = m,
          g: any = m / p,
          _: any = (Math.random() - 0.5) * 0.5;
        o.push({
          baseX: d,
          baseY: f,
          baseZ: i,
          scaleX: h,
          scaleY: g,
          rotZ: _,
          zBobPhase: Math.random() * Math.PI * 2,
          zBobFreq: LS + Math.random() * (RS - LS),
          zBobAmp: FS + Math.random() * (IS - FS),
          wrapHalf: (c + NS) * SS,
          groupIdx: n,
          instanceIdx: -1,
        });
        s[n].push(o.length - 1);
      }
    this._cloudData = o;
    this._groups = [];
    this._materials = [];
    for (let n: any = 0; n < a; n++) {
      let r: any = s[n],
        a: any = r.length;
      if (a === 0) continue;
      let c: any = new InstancedBufferGeometry();
      c.index = i.index;
      c.attributes.position = i.attributes.position;
      c.attributes.uv = i.attributes.uv;
      c.attributes.normal = i.attributes.normal;
      let l: any = new Float32Array(a);
      l.fill(1);
      let u: any = new InstancedBufferAttribute(l, 1);
      u.setUsage(DynamicDrawUsage);
      c.setAttribute(`aOpacity`, u);
      let d: any = t[n],
        f: any = new ShaderMaterial({
          vertexShader: zS,
          fragmentShader: BS,
          uniforms: {
            uTexture: {
              value: e,
            },
            uTexOffset: {
              value: new Vector2(d.offset[0], d.offset[1]),
            },
            uTexScale: {
              value: new Vector2(d.scale[0], d.scale[1]),
            },
          },
          transparent: !0,
          depthWrite: !1,
          side: 2,
        });
      this._materials.push(f);
      let p: any = new InstancedMesh(c, f, a);
      p.frustumCulled = !1;
      for (let e: any = 0; e < a; e++) {
        let t: any = o[r[e]];
        t.instanceIdx = e;
        this._tmpEuler.set(0, 0, t.rotZ);
        this._tmpQuat.setFromEuler(this._tmpEuler);
        this._tmpPos.set(t.baseX, t.baseY, t.baseZ);
        this._tmpScale.set(t.scaleX, t.scaleY, 1);
        this._tmpMatrix.compose(this._tmpPos, this._tmpQuat, this._tmpScale);
        p.setMatrixAt(e, this._tmpMatrix);
      }
      p.instanceMatrix.needsUpdate = !0;
      p.instanceMatrix.setUsage(DynamicDrawUsage);
      this.group.add(p);
      this._groups.push({
        mesh: p,
        opacityAttr: u,
        geo: c,
      });
    }
  }
  resize(e?: any, t?: any): any {
    this._tanHalfFov = Math.tan((e * Math.PI) / 360);
    this._aspect = t;
  }
  update(e?: any, t?: any): any {
    let n: any = Math.max(0, Math.min(1, t)),
      r: any = n - this._lastProgress;
    this._lastProgress = n;
    let i: any = e > 0 ? r / e : 0;
    this._smoothVelocity = MathUtils.lerp(this._smoothVelocity, i, AS);
    let a: any = OS + this._smoothVelocity * kS;
    this._driftAccum += a * e;
    this._zBobTime += e;
    let o: any = n * n * (3 - 2 * n) * CS,
      s: any = n > MS ? 1 - (n - MS) / (1 - MS) : 1,
      c: any = s * s,
      l: any = this._tanHalfFov,
      u: any = this._aspect,
      d: any = this._tmpPos,
      f: any = this._tmpQuat,
      p: any = this._tmpScale,
      m: any = this._tmpMatrix,
      h: any = this._tmpEuler;
    for (let e: any = 0, t: any = this._cloudData.length; e < t; e++) {
      let t: any = this._cloudData[e],
        n: any =
          t.zBobAmp * Math.sin(this._zBobTime * t.zBobFreq + t.zBobPhase),
        r: any = t.baseZ - NS + o + n,
        i: any = this._driftAccum * (1 / (Math.abs(t.baseZ) * 0.08 + 1)),
        a: any = t.wrapHalf * 2,
        s: any = ((((t.baseX + i + t.wrapHalf) % a) + a) % a) - t.wrapHalf,
        g: any = t.baseY,
        _: any;
      _ =
        r >= TS
          ? 0
          : r >= wS
            ? (TS - r) / (TS - wS)
            : r <= DS
              ? 0
              : r <= ES
                ? (r - DS) / (ES - DS)
                : 1;
      let v: any = l * Math.max(0.5, Math.abs(r)),
        y: any = v * u,
        b: any = y * jS,
        x: any = v * jS,
        S: any =
          Math.min(1, Math.max(0, (y + b - Math.abs(s)) / b)) *
          Math.min(1, Math.max(0, (v + x - Math.abs(g)) / x)) *
          _ *
          c;
      d.set(s, g, r);
      h.set(0, 0, t.rotZ);
      f.setFromEuler(h);
      p.set(t.scaleX, t.scaleY, 1);
      m.compose(d, f, p);
      let C: any = this._groups[t.groupIdx];
      C.mesh.setMatrixAt(t.instanceIdx, m);
      C.opacityAttr.array[t.instanceIdx] = S;
    }
    for (let e: any = 0; e < this._groups.length; e++) {
      let t: any = this._groups[e];
      t.mesh.instanceMatrix.needsUpdate = !0;
      t.opacityAttr.needsUpdate = !0;
    }
  }
  dispose(): any {
    if (!this._disposed) {
      this._disposed = !0;
      for (let e of this._groups) {
        e.mesh.dispose();
        e.geo.dispose();
      }
      for (let e of this._materials) e.dispose();
      this._baseGeo &&= (this._baseGeo.dispose(), null);
      this._groups = [];
      this._materials = [];
      this._cloudData = [];
      this.group.clear();
    }
  }
};
var HS: any = 110;
var US: any = 50;
var WS: any = (HS - US) / 2;
var GS: any = 6;
export {
  _S,
  vS,
  yS,
  bS,
  xS,
  SS,
  CS,
  wS,
  TS,
  ES,
  DS,
  OS,
  kS,
  AS,
  jS,
  MS,
  NS,
  PS,
  FS,
  IS,
  LS,
  RS,
  zS,
  BS,
  CloudField,
  HS,
  US,
  WS,
  GS,
};
