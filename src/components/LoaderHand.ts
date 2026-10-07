// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { qv } from "../models/AnimatedModel.ts";
import { Vector3, MeshMatcapMaterial } from "three";
import { gsap } from "gsap";
var dO: any = 8;
var fO: any = 0.2;
var pO: any = -3;
var mO: any = 0.9;
var LoaderHand = class {
  declare _exited: any;
  declare _entryTween: any;
  declare _entryYOffset: any;
  declare _entered: any;
  declare _initialized: any;
  declare _targetPos: any;
  declare _currentPos: any;
  declare _historySize: any;
  declare _historyHead: any;
  declare _historyY: any;
  declare _historyX: any;
  declare _material: any;
  declare group: any;
  declare _distance: any;
  declare _camera: any;
  constructor(
    e?: any,
    t?: any,
    {
      scale: n = 1,
      distance: r = 2,
      matcap: i = null,
      alphaMap: a = null,
    }: any = {},
  ) {
    this._camera = t;
    this._distance = r;
    this.group = e;
    this.group.scale.setScalar(n);
    this.group.traverse((e?: any): any => {
      e.frustumCulled = !1;
    });
    qv(this.group);
    this.group.visible = !1;
    this._material = null;
    (i || a) && this._applyMatcapMaterial(i, a);
    this._historyX = new Float32Array(dO);
    this._historyY = new Float32Array(dO);
    this._historyHead = 0;
    this._historySize = 0;
    this._currentPos = new Vector3();
    this._targetPos = new Vector3();
    this._initialized = !1;
    this._entered = !1;
    this._entryYOffset = pO;
    this._entryTween = null;
  }
  enter(): any {
    this._entered ||
      ((this._entered = !0),
      (this.group.visible = !0),
      (this._entryTween = gsap.to(this, {
        _entryYOffset: 0,
        duration: mO,
        ease: `power2.out`,
        overwrite: !0,
      })));
  }
  exit(): any {
    this._exited ||
      ((this._exited = !0),
      this._entryTween && this._entryTween.kill(),
      (this._entryTween = gsap.to(this, {
        _entryYOffset: pO,
        duration: mO,
        ease: `power2.in`,
        overwrite: !0,
        onComplete: (): any => {
          this.group.visible = !1;
        },
      })));
  }
  setCursor(e?: any, t?: any): any {
    this._historyX[this._historyHead] = e;
    this._historyY[this._historyHead] = t;
    this._historyHead = (this._historyHead + 1) % dO;
    this._historySize < dO && this._historySize++;
  }
  update(): any {
    if (!this._entered) return;
    let e: any = 0,
      t: any = 0;
    if (this._historySize > 0) {
      let n: any = (this._historyHead - 1 + dO) % dO;
      e = this._historyX[n];
      t = this._historyY[n];
    }
    this._targetPos.set(e, t, 0.5).unproject(this._camera);
    this._targetPos
      .sub(this._camera.position)
      .normalize()
      .multiplyScalar(this._distance)
      .add(this._camera.position);
    this._initialized
      ? this._currentPos.lerp(this._targetPos, fO)
      : (this._currentPos.copy(this._targetPos), (this._initialized = !0));
    this.group.position.copy(this._currentPos);
    this.group.position.y += this._entryYOffset;
  }
  _applyMatcapMaterial(e?: any, t?: any): any {
    let n: any = null,
      r: any = null;
    this.group.traverse((e?: any): any => {
      !n &&
        (e.isMesh || e.isSkinnedMesh) &&
        e.material &&
        e.material.normalMap &&
        ((n = e.material.normalMap), (r = e.material.normalScale));
    });
    let i: any = !!t,
      a: any = new MeshMatcapMaterial({
        matcap: e || null,
        alphaMap: i ? t : null,
        normalMap: n || null,
        transparent: i,
        depthWrite: !0,
        depthTest: !0,
        side: 2,
        toneMapped: !1,
      });
    r && a.normalScale.copy(r);
    this.group.traverse((e?: any): any => {
      (e.isMesh || e.isSkinnedMesh) && (e.material = a);
    });
    this._material = a;
  }
  dispose(): any {
    this._entryTween &&= (this._entryTween.kill(), null);
    this.group.parent && this.group.parent.remove(this.group);
    this._material &&= (this._material.dispose(), null);
  }
};
var gO: any = 2.5;
var _O: any = 1280;
export { dO, fO, pO, mO, LoaderHand, gO, _O };
