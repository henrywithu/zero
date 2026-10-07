// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { AnimatedModel, qv } from "./AnimatedModel.ts";
import { Quaternion, Euler } from "three";
var HandsModelTwo = class extends AnimatedModel {
  declare group: any;
  declare _disposeModel: any;
  declare _updateBlendMaterial: any;
  declare cameraRef: any;
  declare _findCamera: any;
  declare _assignBlenderMaterial: any;
  declare _framesToProgress: any;
  declare _handTexTimes: any;
  declare _handUVs: any;
  declare _handTextures: any;
  declare _setupFingerIdle: any;
  declare _setupMixer: any;
  declare _cloneModel: any;
  declare handMaterial: any;
  declare handRef: any;
  constructor(e?: any) {
    super();
    this.handRef = null;
    this.handMaterial = null;
    let t: any = e.getAsset(`handsModel2`),
      n: any = e.getAsset(`cameraModel2`);
    t
      ? this._setupHand(t, e)
      : console.warn(`HandModelStage2: Hand model not found`);
    n
      ? this._setupCamera(n, e)
      : console.warn(`HandModelStage2: Camera model not found`);
  }
  _setupHand(e?: any, t?: any): any {
    let n: any = this._cloneModel(e),
      r: any = t.assets.animations.handsModel2;
    this._setupMixer(n, r);
    this._setupFingerIdle(n, r);
    qv(n);
    let i: any = t.getAsset(`humanHandsAtlas`),
      a: any = (e?: any, t?: any): any => ({
        offset: [e * 0.25, 1 - t * 0.25],
        scale: [0.25, -0.25],
      }),
      o: any = [40, 60, 75, 150, 190, 220, 275, 350, 420, 435, 445];
    this._handTextures = Array(o.length).fill(i);
    this._handUVs = [
      a(0, 1),
      a(1, 1),
      a(2, 1),
      a(3, 1),
      a(0, 2),
      a(1, 2),
      a(2, 2),
      a(3, 2),
      a(0, 3),
      a(1, 3),
      a(2, 3),
    ];
    let s: any = r && r[0];
    this._handTexTimes = this._framesToProgress(o, s, 40);
    let { ref: c, material: l } = this._assignBlenderMaterial(
      n,
      `HumanHandScene2`,
      this._handTextures,
      t,
      {
        useRipple: !1,
      },
    );
    if (((this.handRef = c), (this.handMaterial = l), l)) {
      let e: any = this._handUVs[0];
      l.uniforms.uTexOffsetA.value.set(e.offset[0], e.offset[1]);
      l.uniforms.uTexScaleA.value.set(e.scale[0], e.scale[1]);
      l.uniforms.uTexOffsetB.value.set(e.offset[0], e.offset[1]);
      l.uniforms.uTexScaleB.value.set(e.scale[0], e.scale[1]);
    }
    this.handRef ||
      console.warn(`HandModelStage2: HumanHandScene2 not found in GLB`);
  }
  _setupCamera(e?: any, t?: any): any {
    let n: any = this._cloneModel(e);
    n.traverse((e?: any): any => {
      (e.isMesh || e.isSkinnedMesh) && (e.visible = !1);
    });
    let r: any = t.assets.animations.cameraModel2;
    this._setupMixer(n, r);
    this._findCamera(n);
    this.cameraRef ||
      console.warn(`HandModelStage2: Camera not found in camera GLB`);
  }
  scrub(e?: any): any {
    super.scrub(e);
    this.handMaterial &&
      this._handTextures &&
      this._updateBlendMaterial(
        this.handMaterial,
        this._handTextures,
        this._handTexTimes,
        e,
        1,
        this._handUVs,
      );
  }
  dispose(): any {
    super.dispose();
    this._disposeModel(this.group);
  }
};
var Rb: any = new Quaternion();
var zb: any = new Quaternion();
var Bb: any = new Euler();
var Vb: any = Math.PI / 180;
var Hb: any = (e?: any, t?: any): any => e + Math.random() * (t - e);
export { HandsModelTwo, Rb, zb, Bb, Vb, Hb };
