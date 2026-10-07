// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import shaderSource21 from "../shaders/LensBlurPass-X_-21.vert.glsl?raw";
import shaderSource22 from "../shaders/LensBlurPass-Z_-22.frag.glsl?raw";
import shaderSource23 from "../shaders/LensBlurPass-Q_-23.frag.glsl?raw";
import shaderSource24 from "../shaders/LensBlurPass-$_-24.frag.glsl?raw";
import { WebGLRenderTarget, LinearFilter, RGBAFormat, Vector2 } from "three";
import { ShaderMaterial } from "./ShaderMaterial";
import { Pass, FullScreenQuad } from "three/addons/postprocessing/Pass.js";
import { d_ } from "./ForegroundPass.ts";
var X_: any = shaderSource21;
var Z_: any = shaderSource22;
var Q_: any = shaderSource23;
var $_: any = shaderSource24;
var ev: any =
  typeof matchMedia < `u` && matchMedia(`(pointer: coarse)`).matches;
function tv(this: any, e?: any, t?: any): any {
  return new WebGLRenderTarget(Math.max(1, e), Math.max(1, t), {
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    format: RGBAFormat,
    depthBuffer: !1,
    stencilBuffer: !1,
  });
}
var LensBlurPass = class extends Pass {
  declare renderToScreen: any;
  declare _compositeQuad: any;
  declare _compositeMat: any;
  declare _upQuad: any;
  declare _upMat: any;
  declare _downQuad: any;
  declare _downMat: any;
  declare _rts: any;
  declare _iterations: any;
  declare needsSwap: any;
  constructor() {
    super();
    this.needsSwap = !0;
    let e: any = d_.LENS_BLUR,
      t: any = Math.min(window.devicePixelRatio, 2),
      n: any = Math.floor(window.innerWidth * t),
      r: any = Math.floor(window.innerHeight * t);
    this._iterations = ev ? 2 : 3;
    this._rts = [];
    let i: any = n,
      a: any = r;
    for (let e: any = 0; e < this._iterations; e++) {
      i = Math.max(1, i >> 1);
      a = Math.max(1, a >> 1);
      this._rts.push(tv(i, a));
    }
    this._downMat = new ShaderMaterial({
      vertexShader: X_,
      fragmentShader: Z_,
      uniforms: {
        tDiffuse: {
          value: null,
        },
        uHalfPixel: {
          value: new Vector2(),
        },
      },
      depthWrite: !1,
      depthTest: !1,
    });
    this._downQuad = new FullScreenQuad(this._downMat);
    this._upMat = new ShaderMaterial({
      vertexShader: X_,
      fragmentShader: Q_,
      uniforms: {
        tDiffuse: {
          value: null,
        },
        uHalfPixel: {
          value: new Vector2(),
        },
      },
      depthWrite: !1,
      depthTest: !1,
    });
    this._upQuad = new FullScreenQuad(this._upMat);
    let o: any = ev ? e.MAX_BLUR * e.MOBILE_BLUR_SCALE : e.MAX_BLUR;
    this._compositeMat = new ShaderMaterial({
      vertexShader: X_,
      fragmentShader: $_,
      uniforms: {
        tOriginal: {
          value: null,
        },
        tBlurred: {
          value: null,
        },
        uFocalPoint: {
          value: new Vector2(0.5, 0.5),
        },
        uFocalRadius: {
          value: e.FOCAL_RADIUS,
        },
        uFalloff: {
          value: e.FALLOFF,
        },
        uResolution: {
          value: new Vector2(n, r),
        },
        uMaxBlur: {
          value: o,
        },
        uEnabled: {
          value: e.ENABLED,
        },
      },
      depthWrite: !1,
      depthTest: !1,
    });
    this._compositeQuad = new FullScreenQuad(this._compositeMat);
  }
  get uniforms(): any {
    return this._compositeMat.uniforms;
  }
  render(e?: any, t?: any, n?: any): any {
    let r: any = this._compositeMat.uniforms,
      i: any = r.uEnabled.value >= 0.5 && r.uMaxBlur.value >= 0.01;
    if (((this.needsSwap = i), !i)) return;
    let a: any = n.texture,
      o: any = n.width,
      s: any = n.height;
    for (let t: any = 0; t < this._iterations; t++) {
      let n: any = this._rts[t];
      this._downMat.uniforms.tDiffuse.value = a;
      this._downMat.uniforms.uHalfPixel.value.set(0.5 / o, 0.5 / s);
      e.setRenderTarget(n);
      this._downQuad.render(e);
      a = n.texture;
      o = n.width;
      s = n.height;
    }
    for (let t: any = this._iterations - 1; t > 0; t--) {
      let n: any = this._rts[t - 1];
      this._upMat.uniforms.tDiffuse.value = this._rts[t].texture;
      this._upMat.uniforms.uHalfPixel.value.set(
        0.5 / this._rts[t].width,
        0.5 / this._rts[t].height,
      );
      e.setRenderTarget(n);
      this._upQuad.render(e);
    }
    r.tOriginal.value = n.texture;
    r.tBlurred.value = this._rts[0].texture;
    e.setRenderTarget(this.renderToScreen ? null : t);
    this._compositeQuad.render(e);
  }
  setSize(e?: any, t?: any): any {
    this._compositeMat.uniforms.uResolution.value.set(e, t);
    let n: any = e,
      r: any = t;
    for (let e: any = 0; e < this._iterations; e++) {
      n = Math.max(1, n >> 1);
      r = Math.max(1, r >> 1);
      this._rts[e].setSize(n, r);
    }
  }
  dispose(): any {
    for (let e of this._rts) e.dispose();
    this._downMat.dispose();
    this._downQuad.dispose();
    this._upMat.dispose();
    this._upQuad.dispose();
    this._compositeMat.dispose();
    this._compositeQuad.dispose();
  }
};
var rv: any = 10;
var iv: any = 12;
var av: any = 300;
var ov: any = 9;
var sv: any = 18;
var cv: any = [
  {
    id: `stage1`,
    label: `-100 BZ`,
  },
  {
    id: `stage2`,
    label: `-75 BZ`,
  },
  {
    id: `stage3`,
    label: `-50 BZ`,
  },
  {
    id: `stage4`,
    label: `-25 BZ`,
  },
  {
    id: `stage5`,
    label: `0 BZ`,
  },
];
export { X_, Z_, Q_, $_, ev, tv, LensBlurPass, rv, iv, av, ov, sv, cv };
