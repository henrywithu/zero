// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import {
  Group,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  Quaternion,
  Euler,
} from "three";
import { Vb, Hb, Rb, Bb, zb } from "./HandsModelTwo.ts";
var GlassShards = class {
  declare _scrollProgress: any;
  declare _rigStrength: any;
  declare _rig: any;
  declare _t0: any;
  declare _overlayMaterial: any;
  declare overlays: any;
  declare shards: any;
  declare group: any;
  constructor(e?: any, t?: any, n?: any) {
    this.group = new Group();
    this.shards = [];
    this.overlays = [];
    this._overlayMaterial = null;
    this._t0 = performance.now();
    let r: any = new Map();
    n &&
      n.traverse((e?: any): any => {
        e.name && r.set(e.name, e);
      });
    for (let i of t) {
      let t: any;
      if (n && i.meshName) {
        let e: any = r.get(i.meshName) || null;
        if (!e) {
          let e: any = [];
          n.traverse((t?: any): any => {
            (t.isMesh || t.name) && e.push(t.name);
          });
          console.warn(
            `GlassShards: mesh "${i.meshName}" not found. Available:`,
            e,
          );
          continue;
        }
        let a: any = e.clone();
        a.position.set(0, 0, 0);
        a.rotation.set(0, 0, 0);
        a.scale.set(1, 1, 1);
        t = new Group();
        t.add(a);
      } else {
        let n: any = e.getAsset(i.key);
        if (!n) {
          console.warn(`GlassShards: asset "${i.key}" not found`);
          continue;
        }
        t = n.clone();
      }
      t.traverse((e?: any): any => {
        if (e.isMesh || e.isSkinnedMesh) {
          let t: any = e.geometry;
          t && !t.attributes.normal && t.computeVertexNormals();
          e.frustumCulled = !1;
        }
      });
      let a: any = i.scale ?? 1;
      if (
        (typeof a == `number`
          ? t.scale.setScalar(a)
          : t.scale.set(a[0], a[1], a[2]),
        i.overlay)
      ) {
        let e: any = i.overlay,
          n: any = e.texture.image || e.texture.source?.data,
          r: any = n?.naturalWidth || n?.width || 1,
          o: any = n?.naturalHeight || n?.height || 1,
          s: any = e.region,
          c: any = s ? s.w / s.h : r / o,
          l: any = e.height ?? 0.3,
          u: any = new PlaneGeometry(l * c, l);
        if (s) {
          let e: any = !!s.rot,
            t: any = e ? s.h : s.w,
            n: any = e ? s.w : s.h,
            i: any = s.x / r,
            a: any = 1 - (s.y + n) / o,
            c: any = t / r,
            l: any = n / o,
            d: any = u.attributes.uv,
            f: any = d.array;
          for (let t: any = 0; t < f.length; t += 2) {
            let n: any = f[t],
              r: any = f[t + 1];
            e
              ? ((f[t] = i + r * c), (f[t + 1] = a + (1 - n) * l))
              : ((f[t] = i + n * c), (f[t + 1] = a + r * l));
          }
          d.needsUpdate = !0;
        }
        this._overlayMaterial ||=
          ((e.texture.premultiplyAlpha = !1),
          new MeshBasicMaterial({
            map: e.texture,
            transparent: !0,
            depthWrite: !1,
            depthTest: !1,
            side: 2,
            toneMapped: !1,
          }));
        let d: any = this._overlayMaterial,
          f: any = new Mesh(u, d),
          p: any = typeof a == `number` ? a : 1;
        p !== 0 && f.scale.setScalar(1 / p);
        let m: any = e.offset || [0, 0, 0.01];
        f.position.set(m[0], m[1], m[2]);
        e.spin && (f.rotation.z = e.spin);
        f.frustumCulled = !1;
        f.userData.isOverlay = !0;
        t.add(f);
        this.overlays.push(f);
      }
      let o: any = i.startPosition || [0, 0, -1],
        s: any = i.endPosition || o,
        c: any = i.startRotation || [0, 0, 0],
        l: any = i.endRotation || c;
      t.userData.startPos = new Vector3(o[0], o[1], o[2]);
      t.userData.endPos = new Vector3(s[0], s[1], s[2]);
      t.userData.startQuat = new Quaternion().setFromEuler(
        new Euler(c[0], c[1], c[2]),
      );
      t.userData.endQuat = new Quaternion().setFromEuler(
        new Euler(l[0], l[1], l[2]),
      );
      let u: any = 4 * Vb,
        d: any = 12 * Vb;
      t.userData.wobble = {
        ax: Hb(u, d),
        ay: Hb(u, d),
        az: Hb(u, d),
        fx: Hb(0.15, 0.45),
        fy: Hb(0.15, 0.45),
        fz: Hb(0.15, 0.45),
        px: Hb(0, Math.PI * 2),
        py: Hb(0, Math.PI * 2),
        pz: Hb(0, Math.PI * 2),
      };
      t.userData.isBackground = !!i.background;
      t.position.copy(t.userData.startPos);
      t.quaternion.copy(t.userData.startQuat);
      this.shards.push(t);
      this.group.add(t);
    }
  }
  setOverlayOffset(e?: any, t?: any, n?: any, r?: any): any {
    if (r !== void 0)
      this.overlays[r] && this.overlays[r].position.set(e, t, n);
    else for (let r of this.overlays) r.position.set(e, t, n);
  }
  setCameraRig(e?: any, t: any = 1): any {
    this._rig = e;
    this._rigStrength = t;
  }
  handleScroll(e?: any): any {
    this._scrollProgress = e;
    this._applyTransforms();
  }
  update(): any {
    this._applyTransforms();
  }
  _applyTransforms(): any {
    let e: any = this._scrollProgress ?? 0,
      t: any = (performance.now() - this._t0) * 0.001;
    for (let n of this.shards) {
      let r: any = n.userData;
      n.position.lerpVectors(r.startPos, r.endPos, e);
      Rb.slerpQuaternions(r.startQuat, r.endQuat, e);
      let i: any = r.wobble;
      Bb.set(
        Math.sin(t * i.fx + i.px) * i.ax,
        Math.sin(t * i.fy + i.py) * i.ay,
        Math.sin(t * i.fz + i.pz) * i.az,
      );
      zb.setFromEuler(Bb);
      n.quaternion.multiplyQuaternions(Rb, zb);
    }
    if (this._rig && this._rig.enabled) {
      let e: any = this._rig._currentX,
        t: any = this._rig._currentY;
      for (let n of this.shards) {
        let r: any = Math.abs(n.position.z) * this._rigStrength;
        n.position.x += -e * r;
        n.position.y += -t * r;
      }
    }
  }
  dispose(): any {
    for (let e of this.shards)
      e.traverse((e?: any): any => {
        e.isMesh && e.geometry && e.geometry.dispose();
      });
    this.shards = [];
  }
};
export { GlassShards };
