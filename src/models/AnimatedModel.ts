// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import {
  Vector3,
  Group,
  Quaternion,
  AnimationMixer,
  InterpolateDiscrete,
} from "three";
import { L_ } from "../rendering/FrostingPass.ts";
import { createRippleTextMaterial } from "../rendering/TextMaterial.ts";
var Rv: any = 7e-4;
var zv: any = 0.5;
var Bv: any = new Vector3(1, 0, 0);
var Vv: any = {
  1: 1,
  2: 0.6,
  3: 0.35,
};
var Hv: any = [`index`, `middle`, `ring`, `pinky`, `thumb`];
var Uv: any = 1e-5;
var Wv: any = 3;
var Gv: any = 3;
var AnimatedModel = class {
  declare _prevScrubProgress: any;
  declare _idleQuat: any;
  declare _scrubProgress: any;
  declare _idleWeight: any;
  declare _fingerIdleTime: any;
  declare _fingerBones: any;
  declare cameraRef: any;
  declare duration: any;
  declare _actionSets: any;
  declare _mixers: any;
  declare group: any;
  constructor() {
    this.group = new Group();
    this.group.visible = !1;
    this._mixers = [];
    this._actionSets = [];
    this.duration = 0;
    this.cameraRef = null;
    this._fingerBones = [];
    this._fingerIdleTime = 0;
    this._idleWeight = 0;
    this._scrubProgress = 0;
    this._idleQuat = new Quaternion();
  }
  _cloneModel(e?: any): any {
    let t: any = L_(e);
    t.traverse((e?: any): any => {
      (e.isMesh || e.isSkinnedMesh) && (e.frustumCulled = !1);
    });
    this.group.add(t);
    return t;
  }
  _setupMixer(e?: any, t?: any): any {
    if (!t || t.length === 0) return [];
    let n: any = new AnimationMixer(e),
      r: any = [];
    for (let e of t) {
      let t: any = n.clipAction(e);
      t.setLoop(InterpolateDiscrete);
      t.clampWhenFinished = !0;
      t.play();
      t.paused = !0;
      r.push(t);
      e.duration > this.duration && (this.duration = e.duration);
    }
    this._mixers.push(n);
    this._actionSets.push(r);
    return r;
  }
  _findCamera(e?: any): any {
    e.traverse((e?: any): any => {
      e.name === `Camera` && e.isPerspectiveCamera && (this.cameraRef = e);
    });
  }
  _loadTextures(e?: any, t?: any, n?: any): any {
    let r: any = [];
    for (let i: any = 1; i <= n; i++) {
      let n: any = e.getAsset(`${t}${i}`);
      n && r.push(n);
    }
    return r;
  }
  _loadTexturesByKeys(e?: any, t?: any): any {
    let n: any = [];
    for (let r of t) {
      let t: any = e.getAsset(r);
      t ||
        console.warn(
          `BaseHandModel._loadTexturesByKeys: missing texture "${r}". Blending will fall back to the nearest available keyframe.`,
        );
      n.push(t || null);
    }
    return n;
  }
  _framesToProgress(e?: any, t?: any, n: any = 0): any {
    return !t || !t.tracks || t.tracks.length === 0 || this.duration <= 0
      ? this._evenTimes(e.length)
      : e.map((e?: any): any => (e - n) / 30 / this.duration);
  }
  _evenTimes(e?: any): any {
    if (e <= 1) return [0];
    let t: any = [];
    for (let n: any = 0; n < e; n++) t.push(n / (e - 1));
    return t;
  }
  _assignBlenderMaterial(
    e?: any,
    t?: any,
    n?: any,
    r?: any,
    { useRipple: i = !0 }: any = {},
  ): any {
    let a: any = null,
      o: any = null;
    if (n.length === 0)
      return {
        ref: a,
        material: o,
      };
    let s: any = null;
    for (let e of n)
      if (e) {
        s = e;
        break;
      }
    if (!s)
      return {
        ref: a,
        material: o,
      };
    let c: any = r ? r.getAsset(`humanHandsAtlas`) : null;
    e.traverse((e?: any): any => {
      e.name === t &&
        ((a = e),
        (o = createRippleTextMaterial({
          useRipple: i,
        })),
        (o.uniforms.uTextureA.value = s),
        (o.uniforms.uTextureB.value = s),
        c &&
          ((o.uniforms.uAlphaMap.value = c),
          o.uniforms.uAlphaOffset.value.set(0.75, 0.25),
          o.uniforms.uAlphaScale.value.set(0.25, -0.25)),
        e.traverse((e?: any): any => {
          (e.isMesh || e.isSkinnedMesh) && (e.material = o);
        }));
    });
    return {
      ref: a,
      material: o,
    };
  }
  _updateBlendMaterial(
    e?: any,
    t?: any,
    n?: any,
    r?: any,
    i: any = 1,
    a: any = null,
  ): any {
    if (!e || t.length < 2 || n.length !== t.length) return;
    let o: any = (t?: any, n?: any): any => {
        if (!a) return;
        let r: any = a[n];
        r &&
          (e.uniforms[`uTexOffset${t}`].value.set(r.offset[0], r.offset[1]),
          e.uniforms[`uTexScale${t}`].value.set(r.scale[0], r.scale[1]));
      },
      s: any = (e?: any, n?: any): any => {
        let r: any = e;
        for (; r >= 0 && r < t.length;) {
          if (t[r]) return r;
          r += n;
        }
        return -1;
      },
      c: any = r * i;
    if (c <= n[0]) {
      let n: any = s(0, 1);
      if (n < 0) return;
      e.uniforms.uTextureA.value = t[n];
      e.uniforms.uTextureB.value = t[n];
      e.uniforms.uProgress.value = 0;
      o(`A`, n);
      o(`B`, n);
      return;
    }
    let l: any = n.length - 1;
    if (c >= n[l]) {
      let n: any = s(l, -1);
      if (n < 0) return;
      e.uniforms.uTextureA.value = t[n];
      e.uniforms.uTextureB.value = t[n];
      e.uniforms.uProgress.value = 0;
      o(`A`, n);
      o(`B`, n);
      return;
    }
    for (let r: any = 0; r < l; r++)
      if (c >= n[r] && c < n[r + 1]) {
        let i: any = s(r, -1),
          a: any = s(r + 1, 1);
        if (i < 0 || a < 0) return;
        let l: any = (c - n[r]) / (n[r + 1] - n[r]);
        e.uniforms.uTextureA.value = t[i];
        e.uniforms.uTextureB.value = t[a];
        e.uniforms.uProgress.value = l;
        o(`A`, i);
        o(`B`, a);
        return;
      }
  }
  scrub(e?: any): any {
    if (((this._scrubProgress = e), this.duration <= 0)) return;
    let t: any = this.duration * e;
    for (let e of this._actionSets) for (let n of e) n.time = t;
  }
  update(e?: any): any {
    if (this.group.visible) {
      for (let t of this._mixers) t.update(e);
      this._applyFingerIdle(e);
    }
  }
  _setupFingerIdle(e?: any, t?: any): any {
    if (!e) return;
    let n: any = new Set(),
      r: any = t && t[0];
    if (r)
      for (let e of r.tracks)
        n.add(e.name.replace(/\.(quaternion|position|scale)$/, ``));
    e.traverse((e?: any): any => {
      if (!e.isBone) return;
      let t: any = e.name.toLowerCase(),
        r: any = Hv.findIndex((e?: any): any => t.includes(e));
      if (r < 0) return;
      let i: any = t.match(/0([123])/),
        a: any = i ? parseInt(i[1], 10) : 1,
        o: any = n.has(e.name);
      this._fingerBones.push({
        bone: e,
        animated: o,
        rest: o ? null : e.quaternion.clone(),
        amp: Rv * (Vv[a] || 0.5),
        phase: r * 1.3 + a * 0.4,
        freq: zv * (1 + r * 0.05),
      });
    });
  }
  _applyFingerIdle(e?: any): any {
    let t: any = this._fingerBones;
    if (!t || t.length === 0) return;
    let n: any = this._scrubProgress || 0,
      r: any = Math.abs(n - (this._prevScrubProgress ?? n)) > Uv;
    this._prevScrubProgress = n;
    let i: any = +!r,
      a: any = r ? Gv : Wv;
    this._idleWeight +=
      (i - this._idleWeight) * (1 - Math.exp(-a * Math.max(e, 0)));
    this._fingerIdleTime += e;
    let o: any = this._idleWeight;
    if (o < 0.001) return;
    let s: any = this._fingerIdleTime * Math.PI * 2;
    for (let e of t) {
      let t: any = Math.sin(s * e.freq + e.phase) * e.amp * o;
      this._idleQuat.setFromAxisAngle(Bv, t);
      e.animated
        ? e.bone.quaternion.multiply(this._idleQuat)
        : e.bone.quaternion.copy(e.rest).multiply(this._idleQuat);
    }
  }
  _disposeModel(e?: any): any {
    e &&
      e.traverse((e?: any): any => {
        (e.isMesh || e.isSkinnedMesh) &&
          (e.geometry && e.geometry.dispose(),
          e.material &&
            (Array.isArray(e.material)
              ? e.material.forEach((e?: any): any => e.dispose())
              : e.material.dispose()));
      });
  }
  dispose(): any {
    for (let e: any = 0; e < this._mixers.length; e++)
      this._mixers[e].stopAllAction();
    this._mixers = [];
    this._actionSets = [];
  }
};
function qv(this: any, e?: any): any {
  e.traverse((e?: any): any => {
    (e.isMesh || e.isSkinnedMesh) &&
      e.geometry &&
      (e.geometry.hasAttribute(`normal`) || e.geometry.computeVertexNormals());
  });
}
export { Rv, zv, Bv, Vv, Hv, Uv, Wv, Gv, AnimatedModel, qv };
