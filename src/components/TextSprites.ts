// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { Group, PlaneGeometry, Mesh } from "three";
import { qualityManager } from "../rendering/QualityManager.ts";
import { ib } from "../rendering/PaperMaterials.ts";
import shaderSource31 from "../shaders/TextSprites-yb-31.vert.glsl?raw";
import shaderSource32 from "../shaders/TextSprites-bb-32.frag.glsl?raw";
var ab: any = 768;
var ob: any = 1728;
var sb: any = 3686;
var cb: any = 0.1;
var lb: any = 1e3;
var ub: any = 1536;
var db: any = 0.15;
var fb: any = 0.05;
var pb: any = {
  HIDDEN: 0,
  APPEARING: 1,
  VISIBLE: 2,
  DISAPPEARING: 3,
};
var mb: any = 4;
var hb: any = `outExpo`;
var gb: any = {
  smoothstep: (e?: any): any => e * e * (3 - 2 * e),
  outExpo: (e?: any): any => (e >= 1 ? 1 : 1 - 2 ** (-10 * e)),
  inExpo: (e?: any): any => (e <= 0 ? 0 : 2 ** (10 * (e - 1))),
};
var _b: any = 0.3;
var TextSprites = class {
  declare _qualityUnsub: any;
  declare _lite: any;
  declare _sharedGeometry: any;
  declare _viewportHeight: any;
  declare _viewportWidth: any;
  declare _lastProgress: any;
  declare hasVisibleSprites: any;
  declare sprites: any;
  declare group: any;
  declare itemsConfig: any;
  declare textScene: any;
  constructor(e?: any, t?: any) {
    this.textScene = e;
    this.itemsConfig = t || [];
    this.group = new Group();
    this.sprites = [];
    this.hasVisibleSprites = !1;
    this._lastProgress = -1;
    this._viewportWidth = window.innerWidth;
    this._viewportHeight = window.innerHeight;
    this._sharedGeometry = new PlaneGeometry(1, 1);
    this._lite = qualityManager.tier === `LOW`;
    this._qualityUnsub = qualityManager.onChange((e?: any): any =>
      this._setLite(e === `LOW`),
    );
    this._initSprites();
  }
  _setLite(e?: any): any {
    e !== this._lite &&
      ((this._lite = e),
      this.sprites.forEach((t?: any): any => {
        let n: any = t.userData.material;
        n &&
          (e ? (n.defines.LITE_TEXT = ``) : delete n.defines.LITE_TEXT,
          (n.needsUpdate = !0));
      }));
  }
  _initSprites(): any {
    this.itemsConfig.forEach((e?: any): any => {
      let t: any = e.texture;
      if (!t) return;
      let n: any =
          e.aspect == null
            ? t.image
              ? t.image.width / t.image.height
              : 1
            : e.aspect,
        r: any = ib(t, e.atlasUV, n, e.rotate, this._lite),
        i: any = new Mesh(this._sharedGeometry, r);
      i.visible = !1;
      i.userData = {
        config: e,
        baseScale: e.baseScale || 0.3,
        anchor: e.anchor || `center-center`,
        aspect: n,
        material: r,
        animState: pb.HIDDEN,
        animElapsed: 0,
        animProgress: 0,
      };
      this.group.add(i);
      this.sprites.push(i);
    });
    this.textScene.add(this.group);
  }
  resize(e?: any, t?: any): any {
    this._viewportWidth = e;
    this._viewportHeight = t;
    let n: any = e < ab,
      r: any = e / 2,
      i: any = t / 2,
      a: any = Math.min(e, t),
      o: any = Math.max(n ? lb : ob, Math.min(n ? ub : sb, a)),
      s: any = n ? db * a : cb * a,
      c: any = n ? s * 0.5 : s,
      l: any = n ? 124 : 116;
    this.sprites.forEach((e?: any): any => {
      let t: any = e.userData,
        u: any = t.config.offset == null ? null : t.config.offset,
        d: any = n ? 0.85 : 1,
        f: any = t.baseScale * o * d,
        p: any = f / t.aspect;
      e.scale.set(f, p, 1);
      let m: any = t.anchor.split(`-`),
        h: any = m[0],
        g: any = m[1],
        _: any = 0;
      g === `left`
        ? (_ = -r + (u ?? c) + f / 2)
        : g === `right` && (_ = r - (u ?? c) - f / 2);
      let v: any = fb * a,
        y: any = v / 2;
      if (h === `top`) y = i - (u ?? s) - p / 2;
      else if (h === `bottom`) {
        let e: any = u ?? s;
        g !== `left` && g !== `right` && (e = Math.max(e, l));
        y = -i + e + p / 2 + v;
      }
      e.position.set(_, y, 0);
    });
  }
  update(e?: any, t?: any): any {
    let n: any = e >= this._lastProgress;
    this._lastProgress = e;
    let r: any = !1;
    this.sprites.forEach((i?: any): any => {
      let a: any = i.userData,
        o: any = a.config,
        s: any = o.appearAt,
        c: any = o.disappearAt,
        l: any = a.config.appearDuration ?? mb,
        u: any = _b;
      if ((this._checkTriggers(a, e, s, c, n), a.animState === pb.APPEARING)) {
        a.animElapsed += t;
        let e: any = Math.min(a.animElapsed / l, 1);
        a.animProgress = (gb[hb] || gb.smoothstep)(e);
        e >= 1 && ((a.animState = pb.VISIBLE), (a.animProgress = 1));
      } else if (a.animState === pb.DISAPPEARING) {
        a.animElapsed += t;
        let e: any = Math.min(a.animElapsed / u, 1);
        a.animProgress = this._smoothstep(e);
        e >= 1 && ((a.animState = pb.HIDDEN), (a.animProgress = 0));
      }
      let d: any =
          a.animState === pb.DISAPPEARING ? 1 - a.animProgress : a.animProgress,
        f: any = a.animProgress > 0.001;
      i.visible = f;
      f && (r = !0);
      a.material.uniforms.uProgress.value = d;
    });
    this.hasVisibleSprites = r;
    this.group.visible = r;
  }
  isFirstTextVisible(): any {
    if (!this.sprites || !this.sprites.length) return !1;
    let e: any = null;
    for (let t of this.sprites)
      (!e || t.userData.config.appearAt < e.userData.config.appearAt) &&
        (e = t);
    return !!e && e.userData.animState === pb.VISIBLE;
  }
  hideAll(e?: any): any {
    this.sprites.forEach((e?: any): any => {
      let t: any = e.userData;
      t.animState === pb.HIDDEN ||
        t.animState === pb.DISAPPEARING ||
        ((t.animState = pb.DISAPPEARING), (t.animElapsed = 0));
    });
  }
  _checkTriggers(e?: any, t?: any, n?: any, r?: any, i?: any): any {
    i
      ? e.animState === pb.HIDDEN && t >= n && t < r
        ? ((e.animState = pb.APPEARING), (e.animElapsed = 0))
        : (e.animState === pb.VISIBLE || e.animState === pb.APPEARING) &&
          t >= r &&
          ((e.animState = pb.DISAPPEARING), (e.animElapsed = 0))
      : (e.animState === pb.HIDDEN || e.animState === pb.DISAPPEARING) &&
          t < r &&
          t >= n
        ? ((e.animState = pb.APPEARING), (e.animElapsed = 0))
        : e.animState !== pb.HIDDEN &&
          e.animState !== pb.DISAPPEARING &&
          t < n &&
          ((e.animState = pb.DISAPPEARING), (e.animElapsed = 0));
  }
  _smoothstep(e?: any): any {
    return e * e * (3 - 2 * e);
  }
  dispose(): any {
    this._qualityUnsub &&= (this._qualityUnsub(), null);
    this.sprites.forEach((e?: any): any => {
      e.userData.material && e.userData.material.dispose();
    });
    this._sharedGeometry &&= (this._sharedGeometry.dispose(), null);
    this.sprites = [];
    this.group.parent && this.group.parent.remove(this.group);
    this.group.clear();
  }
};
var yb: any = shaderSource31;
var bb: any = shaderSource32;
export {
  ab,
  ob,
  sb,
  cb,
  lb,
  ub,
  db,
  fb,
  pb,
  mb,
  hb,
  gb,
  _b,
  TextSprites,
  yb,
  bb,
};
