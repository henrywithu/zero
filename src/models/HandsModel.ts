// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { AnimatedModel, qv } from "./AnimatedModel.ts";
import { MeshMatcapMaterial, Vector2 } from "three";
import shaderSource27 from "../shaders/HandsModel-chunk-27.frag.glsl?raw";
var HandsModel = class extends AnimatedModel {
  declare group: any;
  declare _disposeModel: any;
  declare _fingerBones: any;
  declare _updateBlendMaterial: any;
  declare cameraRef: any;
  declare _findCamera: any;
  declare _assignBlenderMaterial: any;
  declare _framesToProgress: any;
  declare _humanHandTexTimes: any;
  declare _humanHandUVs: any;
  declare _humanHandTextures: any;
  declare _setupFingerIdle: any;
  declare _ethRippleUniforms: any;
  declare _setupMixer: any;
  declare _cloneModel: any;
  declare ethHandRef: any;
  declare humanHandMaterial: any;
  declare ethHandMaterial: any;
  constructor(e?: any) {
    super();
    this.ethHandMaterial = null;
    this.humanHandMaterial = null;
    this.ethHandRef = null;
    let t: any = e.getAsset(`fancyHand1`),
      n: any = e.getAsset(`humanHand1`),
      r: any = e.getAsset(`cameraModel1`);
    t
      ? this._setupEthHand(t, e)
      : console.warn(`HandsModel: Fancy hand model not found`);
    n
      ? this._setupHumanHand(n, e)
      : console.warn(`HandsModel: Human hand model not found`);
    r
      ? this._setupCamera(r, e)
      : console.warn(`HandsModel: Camera model not found`);
  }
  _setupEthHand(e?: any, t?: any): any {
    let n: any = this._cloneModel(e),
      r: any = t.assets.animations.fancyHand1;
    this._setupMixer(n, r);
    let i: any = t.getAsset(`handMatcap`),
      a: any = t.getAsset(`humanHandsAtlas`),
      o: any = null;
    a &&
      ((o = a.clone()),
      o.offset.set(0.75, 0.25),
      o.repeat.set(0.25, -0.25),
      o.updateMatrix());
    i || console.warn(`HandsModel: handMatcap texture not loaded`);
    let s: any = null,
      c: any = null;
    n.traverse((e?: any): any => {
      if (!s && (e.isMesh || e.isSkinnedMesh) && e.material) {
        let t: any = e.material;
        t.normalMap && ((s = t.normalMap), (c = t.normalScale));
      }
    });
    let l: any = new MeshMatcapMaterial({
      matcap: i || null,
      alphaMap: o || null,
      normalMap: s || null,
      transparent: !0,
      depthWrite: !0,
      depthTest: !0,
      side: 0,
      toneMapped: !1,
    });
    c && l.normalScale.copy(c);
    this._ethRippleUniforms = {
      uRippleTime: {
        value: 0,
      },
      uRippleIntensity: {
        value: 0,
      },
      uRippleResolution: {
        value: new Vector2(1, 1),
      },
      uRippleHw: {
        value: 0.75,
      },
    };
    let u: any = this._ethRippleUniforms;
    l.onBeforeCompile = (e?: any): any => {
      e.uniforms.uRippleTime = u.uRippleTime;
      e.uniforms.uRippleIntensity = u.uRippleIntensity;
      e.uniforms.uRippleResolution = u.uRippleResolution;
      e.uniforms.uRippleHw = u.uRippleHw;
      e.fragmentShader = e.fragmentShader.replace(
        `#include <common>`,
        `#include <common>
        uniform float uRippleTime;
        uniform float uRippleIntensity;
        uniform vec2  uRippleResolution;
        uniform float uRippleHw;`,
      );
      e.fragmentShader = e.fragmentShader.replace(
        `#include <dithering_fragment>`,
        shaderSource27,
      );
    };
    this.ethHandRef = null;
    n.traverse((e?: any): any => {
      (e.isMesh || e.isSkinnedMesh) &&
        ((e.material = l), (this.ethHandRef ||= e));
    });
    this.ethHandRef ||= n;
    this.ethHandMaterial = l;
    this._setupFingerIdle(n, r);
  }
  _setupHumanHand(e?: any, t?: any): any {
    let n: any = this._cloneModel(e),
      r: any = t.assets.animations.humanHand1;
    this._setupMixer(n, r);
    this._setupFingerIdle(n, r);
    qv(n);
    let i: any = t.getAsset(`humanHandsAtlas`),
      a: any = (e?: any, t?: any): any => ({
        offset: [e * 0.25, 1 - t * 0.25],
        scale: [0.25, -0.25],
      }),
      o: any = [216, 340, 405, 435];
    this._humanHandTextures = [i, i, i, i];
    this._humanHandUVs = [a(0, 0), a(1, 0), a(2, 0), a(3, 0)];
    let s: any = r && r[0];
    this._humanHandTexTimes = this._framesToProgress(o, s, 0);
    let { material: c } = this._assignBlenderMaterial(
      n,
      `HumanHand`,
      this._humanHandTextures,
      t,
    );
    if (((this.humanHandMaterial = c), c)) {
      let e: any = this._humanHandUVs[0];
      c.uniforms.uTexOffsetA.value.set(e.offset[0], e.offset[1]);
      c.uniforms.uTexScaleA.value.set(e.scale[0], e.scale[1]);
      c.uniforms.uTexOffsetB.value.set(e.offset[0], e.offset[1]);
      c.uniforms.uTexScaleB.value.set(e.scale[0], e.scale[1]);
    }
  }
  _setupCamera(e?: any, t?: any): any {
    let n: any = this._cloneModel(e);
    n.traverse((e?: any): any => {
      (e.isMesh || e.isSkinnedMesh) && (e.visible = !1);
    });
    let r: any = t.assets.animations.cameraModel1;
    this._setupMixer(n, r);
    this._findCamera(n);
    this.cameraRef ||
      console.warn(`HandsModel: Camera not found in camera GLB`);
  }
  scrub(e?: any): any {
    super.scrub(e);
    this.humanHandMaterial &&
      this._humanHandTextures &&
      this._updateBlendMaterial(
        this.humanHandMaterial,
        this._humanHandTextures,
        this._humanHandTexTimes,
        e,
        1,
        this._humanHandUVs,
      );
  }
  dispose(): any {
    super.dispose();
    this._fingerBones = null;
    this._disposeModel(this.group);
  }
};
var Yv: any = 8;
var Xv: any = 0.12;
var Zv: any = 0.03;
var Qv: any = 0.005;
var $v: any = 24;
var ey: any = (10 * Math.PI) / 60;
var ty: any = 2;
var ny: any = 3;
var ry: any = 0.3;
var iy: any = 0.1;
var ay: any = 0.15;
var oy: any = 0.4;
var sy: any = 0.45;
var cy: any = 0.45;
var ly: any = 0.1;
var uy: any = (ay - iy) / Yv;
var dy: any = (sy - oy) / Yv;
var fy: any = 16777215;
var py: any = [
  15331053, 15330798, 15724267, 15723242, 15265006, 15591913, 15657965,
  15396588,
];
var my: any = 2048;
var hy: any = [
  [0, 1877, 171, 171],
  [171, 1877, 171, 171],
  [986, 1877, 171, 171],
  [1157, 1877, 171, 171],
  [1327, 1877, 171, 171],
  [1498, 1877, 171, 171],
  [1669, 1877, 171, 171],
  [1840, 1877, 171, 171],
];
export {
  HandsModel,
  Yv,
  Xv,
  Zv,
  Qv,
  $v,
  ey,
  ty,
  ny,
  ry,
  iy,
  ay,
  oy,
  sy,
  cy,
  ly,
  uy,
  dy,
  fy,
  py,
  my,
  hy,
};
