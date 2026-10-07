// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import {
  CanvasTexture,
  SRGBColorSpace,
  LinearFilter,
  MeshBasicMaterial,
  PlaneGeometry,
  Mesh,
  MathUtils,
} from "three";
import { gO, _O } from "./LoaderHand.ts";
var LoaderTextOverlay = class {
  declare _loaderOffsetX: any;
  declare _logoImage: any;
  declare _transitionT: any;
  declare _loaderOpacity: any;
  declare _loaderText: any;
  declare _number: any;
  declare mesh: any;
  declare _texture: any;
  declare _ctx: any;
  declare _canvas: any;
  declare _camera: any;
  constructor(e?: any) {
    this._camera = e;
    this._canvas = document.createElement(`canvas`);
    this._canvas.width = 960;
    this._canvas.height = 540;
    this._ctx = this._canvas.getContext(`2d`);
    this._texture = new CanvasTexture(this._canvas);
    this._texture.colorSpace = SRGBColorSpace;
    this._texture.minFilter = LinearFilter;
    this._texture.magFilter = LinearFilter;
    this._texture.generateMipmaps = !1;
    let t: any = new MeshBasicMaterial({
        map: this._texture,
        transparent: !0,
        depthWrite: !1,
        depthTest: !1,
      }),
      n: any = new PlaneGeometry(1, 1);
    this.mesh = new Mesh(n, t);
    this.mesh.frustumCulled = !1;
    e.add(this.mesh);
    this._fitToFOV();
    this._number = null;
    this._loaderText = null;
    this._loaderOpacity = 1;
    this._transitionT = 0;
    this._logoImage = null;
    this._loaderOffsetX = 0;
    this._draw();
  }
  loadLogo(e: any = `assets/brand/nav_logo_white.svg`): any {
    let t: any = new Image();
    t.crossOrigin = `anonymous`;
    t.onload = (): any => {
      this._logoImage = t;
      this._draw();
    };
    t.onerror = (): any => {};
    t.src = e;
  }
  _fitToFOV(): any {
    let e: any = MathUtils.degToRad(this._camera.fov),
      t: any = 2 * gO * Math.tan(e / 2),
      n: any = t * this._camera.aspect;
    this.mesh.position.set(0, 0, -2.5);
    this.mesh.scale.set(n, t, 1);
  }
  setNumber(e?: any): any {
    e !== this._number && ((this._number = e), this._draw());
  }
  setLoaderText(e?: any): any {
    e !== this._loaderText && ((this._loaderText = e), this._draw());
  }
  redraw(): any {
    this._draw();
  }
  resize(e?: any, t?: any): any {
    let n: any = Math.max(e, t),
      r: any = n > _O ? _O / n : 1;
    this._canvas.width = Math.max(1, Math.floor(e * r));
    this._canvas.height = Math.max(1, Math.floor(t * r));
    this._texture.needsUpdate = !0;
    this._fitToFOV();
    this._draw();
  }
  _draw(): any {
    let e: any = this._ctx,
      t: any = this._canvas.width,
      n: any = this._canvas.height;
    if ((e.clearRect(0, 0, t, n), this._loaderOpacity <= 0.001)) {
      this.mesh.visible = !1;
      this._texture.needsUpdate = !0;
      return;
    }
    this.mesh.visible = !0;
    let r: any = window.innerWidth < 768,
      i: any = Math.round(((r ? 110 : 180) / 1080) * n),
      a: any = Math.round(((r ? 80 : 40) / 1920) * t) + this._loaderOffsetX,
      o: any = n - Math.round((40 / 1080) * n),
      s: any = i,
      c: any = this._transitionT,
      l: any = -s * c,
      u: any = s * (1 - c),
      d: any = this._loaderOpacity * (1 - c),
      f: any =
        this._loaderText === null
          ? this._number === null
            ? null
            : String(this._number).padStart(2, `0`)
          : this._loaderText;
    f !== null &&
      d > 0.001 &&
      ((e.globalAlpha = d),
      (e.fillStyle = `#ffffff`),
      (e.font = `700 ${i}px 'Supply Sans', monospace`),
      (e.textAlign = `left`),
      (e.textBaseline = `alphabetic`),
      e.fillText(f, a, o + l));
    let p: any = this._loaderOpacity * c;
    if (this._logoImage && p > 0.001) {
      e.globalAlpha = p;
      let t: any = i,
        n: any = t * (this._logoImage.width / this._logoImage.height);
      e.drawImage(this._logoImage, a, o - t + u, n, t);
    }
    e.globalAlpha = 1;
    this._texture.needsUpdate = !0;
  }
  dispose(): any {
    this.mesh.parent && this.mesh.parent.remove(this.mesh);
    this._texture.dispose();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
};
var yO: any = -Math.PI / 2;
var bO: any = 2;
var xO: any = 2;
var SO: any = 2 * 1e3;
export { LoaderTextOverlay, yO, bO, xO, SO };
