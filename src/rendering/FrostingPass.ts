// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import shaderSource7 from "../shaders/FrostingPass-E_-7.vert.glsl?raw";
import shaderSource8 from "../shaders/FrostingPass-D_-8.frag.glsl?raw";
import shaderSource9 from "../shaders/FrostingPass-O_-9.frag.glsl?raw";
import shaderSource10 from "../shaders/FrostingPass-k_-10.vert.glsl?raw";
import shaderSource11 from "../shaders/FrostingPass-A_-11.frag.glsl?raw";
import { Pass, FullScreenQuad } from "three/addons/postprocessing/Pass.js";
import {
  Vector2,
  LinearFilter,
  RGBAFormat,
  HalfFloatType,
  WebGLRenderTarget,
  LinearSRGBColorSpace,
  ClampToEdgeWrapping,
} from "three";
import { ShaderMaterial } from "./ShaderMaterial";
import { getCoverScale } from "./textureUtils.ts";
import { gsap } from "gsap";
var T_: any = {
  GLOBAL_TIME_SCALE: 1,
  DEFAULT_FPS_TIMESTEP: 1 / 60,
  TEXT: {
    APPEAR_DURATION_MS: 700,
    BLUR_STRENGTH_DESKTOP: 1,
    BLUR_TAPS: 5,
    ATLAS_PADDING: 0,
  },
  IS_MOBILE_DEFAULT: !1,
  SCROLL: {
    HAUNTING_BASE_SPEED: 0.1,
    HAUNTING_MAX_SPEED_MULTIPLIER: 2,
    VELOCITY_SMOOTHING: 0.1,
  },
  BLENDER: {
    TRANSITION_DURATION: 1,
    MAX_BAKED_TEXTURES: 30,
  },
  FROSTING: {
    REFRACTION_STRENGTH: 0.5,
    DISTORTION_AMOUNT: 0.2,
    LIGHT_INTENSITY: 1,
    ENV_CONTRIBUTION: 0.5,
    ENABLE_REFRACTION: 1,
    ENABLE_ENV: 1,
  },
};
var E_: any = shaderSource7;
var D_: any = shaderSource8;
var O_: any = shaderSource9;
var k_: any = shaderSource10;
var A_: any = shaderSource11;
var j_: any = 0.2;
var M_: any = 6;
var N_: any = 0.07;
var P_: any = 2;
var F_: any = 0;
var FrostingPass = class extends Pass {
  declare renderToScreen: any;
  declare _centerWhiteTween: any;
  declare _meltTween: any;
  declare _bakedNormalRT: any;
  declare _frostTexAspect: any;
  declare _spreadTempRT2: any;
  declare _compositeQuad: any;
  declare material: any;
  declare _trailQuad: any;
  declare _trailMaterial: any;
  declare _firstActiveRender: any;
  declare _trailIdx: any;
  declare _lastTrailH: any;
  declare _lastTrailW: any;
  declare _spreadTempRT: any;
  declare _trailRTs: any;
  declare _rtOpts: any;
  declare _cursorUV: any;
  declare _renderer: any;
  declare enabled: any;
  declare _active: any;
  declare needsSwap: any;
  constructor(e?: any, t: any = null) {
    super();
    this.needsSwap = !0;
    this._active = !1;
    this.enabled = !1;
    this._renderer = e;
    this._cursorUV = new Vector2(0.5, 0.5);
    let n: any = e.getPixelRatio(),
      r: any = Math.floor(window.innerWidth * n),
      i: any = Math.floor(window.innerHeight * n),
      a: any = window.innerWidth / window.innerHeight;
    this._rtOpts = {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      type: HalfFloatType,
      depthBuffer: !1,
      stencilBuffer: !1,
    };
    this._trailRTs = null;
    this._spreadTempRT = null;
    this._lastTrailW = Math.max(1, r >> 2);
    this._lastTrailH = Math.max(1, i >> 2);
    this._trailIdx = 0;
    this._firstActiveRender = !0;
    this._trailMaterial = new ShaderMaterial({
      vertexShader: E_,
      fragmentShader: D_,
      uniforms: {
        uPrevTrail: {
          value: null,
        },
        uFrostTexture: {
          value: null,
        },
        uHasFrostTexture: {
          value: 0,
        },
        uFrostTexAspect: {
          value: 1,
        },
        uFrostCoverScale: {
          value: new Vector2(1, 1),
        },
        uCursorUV: {
          value: this._cursorUV,
        },
        uCursorRadius: {
          value: N_,
        },
        uCursorIntensity: {
          value: F_,
        },
        uFade: {
          value: 0.97,
        },
        uHeadFade: {
          value: 0.95,
        },
        uAspect: {
          value: a,
        },
        uCursorActive: {
          value: 0,
        },
        uSpread: {
          value: 0,
        },
        uSpreadStep: {
          value: 0,
        },
        uSpreadAxis: {
          value: new Vector2(1, 0),
        },
      },
      depthWrite: !1,
      depthTest: !1,
    });
    this._trailQuad = new FullScreenQuad(this._trailMaterial);
    let o: any = T_.FROSTING,
      s: any = +!!t,
      c: any = t && t.image ? t.image.width / t.image.height : 1;
    this.material = new ShaderMaterial({
      vertexShader: k_,
      fragmentShader: A_,
      uniforms: {
        tDiffuse: {
          value: null,
        },
        uTrailTexture: {
          value: null,
        },
        uFrostTexture: {
          value: t,
        },
        uOpacity: {
          value: 1,
        },
        uWhiteout: {
          value: 0,
        },
        uTrailWhite: {
          value: 0,
        },
        uMelt: {
          value: 0,
        },
        uCenterWhite: {
          value: 0,
        },
        uLightIntensity: {
          value: o.LIGHT_INTENSITY,
        },
        uAspect: {
          value: a,
        },
        uFrostTexAspect: {
          value: c,
        },
        uFrostCoverScale: {
          value: new Vector2(1, 1),
        },
        uHasFrostTexture: {
          value: s,
        },
        uLoadProgress: {
          value: 1,
        },
        uIceNormalTxt: {
          value: null,
        },
        uHasIceNormal: {
          value: 0,
        },
        uDisplacement: {
          value: 0.05,
        },
        uNormalBias: {
          value: new Vector2(0, 0),
        },
        uFrostShift: {
          value: new Vector2(0, 0),
        },
      },
      depthWrite: !1,
      depthTest: !1,
    });
    this._compositeQuad = new FullScreenQuad(this.material);
  }
  get active(): any {
    return this._active;
  }
  set active(e: any) {
    e && !this._active
      ? (this._ensureTrailRTs(), (this._firstActiveRender = !0))
      : !e && this._active && this._disposeTrailRTs();
    this._active = e;
    this.enabled = e;
  }
  _ensureTrailRTs(): any {
    if (this._trailRTs) return;
    let e: any = this._lastTrailW,
      t: any = this._lastTrailH;
    this._trailRTs = [
      new WebGLRenderTarget(e, t, this._rtOpts),
      new WebGLRenderTarget(e, t, this._rtOpts),
    ];
    this._spreadTempRT = new WebGLRenderTarget(e, t, this._rtOpts);
    this._spreadTempRT2 = new WebGLRenderTarget(e, t, this._rtOpts);
    this._trailIdx = 0;
  }
  _disposeTrailRTs(): any {
    this._trailRTs &&
      (this._trailRTs[0].dispose(),
      this._trailRTs[1].dispose(),
      this._spreadTempRT.dispose(),
      this._spreadTempRT2.dispose(),
      (this._trailRTs = null),
      (this._spreadTempRT = null),
      (this._spreadTempRT2 = null));
  }
  setInput(e?: any, t?: any, n: any = !1): any {
    this._cursorUV.set((e + 1) * 0.5, (t + 1) * 0.5);
    this._trailMaterial.uniforms.uCursorActive.value = 1;
    this._trailMaterial.uniforms.uCursorIntensity.value = n ? P_ : F_;
  }
  setShift(e?: any, t?: any): any {
    this.material.uniforms.uFrostShift.value.set(e, t);
  }
  setFrostTexture(e?: any): any {
    if (!e) return;
    if (
      (e.colorSpace !== `srgb-linear` &&
        ((e.colorSpace = LinearSRGBColorSpace), (e.needsUpdate = !0)),
      (e.wrapS = ClampToEdgeWrapping),
      (e.wrapT = ClampToEdgeWrapping),
      this.material.uniforms.uHasIceNormal.value < 0.5)
    ) {
      let t: any = this._bakeNormalMap(e);
      t &&
        ((this.material.uniforms.uIceNormalTxt.value = t),
        (this.material.uniforms.uHasIceNormal.value = 1));
    }
    let t: any = e.image ? e.image.width / e.image.height : 1;
    this.material.uniforms.uFrostTexture.value = e;
    this.material.uniforms.uHasFrostTexture.value = 1;
    this.material.uniforms.uFrostTexAspect.value = t;
    this._trailMaterial.uniforms.uFrostTexture.value = e;
    this._trailMaterial.uniforms.uHasFrostTexture.value = 1;
    this._trailMaterial.uniforms.uFrostTexAspect.value = t;
    this._frostTexAspect = t;
    let n: any = this._trailMaterial.uniforms.uAspect.value,
      r: any = getCoverScale(t, n, !0);
    this._trailMaterial.uniforms.uFrostCoverScale.value.set(r.x, r.y);
    this.material.uniforms.uFrostCoverScale.value.set(r.x, r.y);
  }
  setIceNormalTexture(e?: any): any {
    if (!e) {
      this.material.uniforms.uIceNormalTxt.value = null;
      this.material.uniforms.uHasIceNormal.value = 0;
      return;
    }
    e.colorSpace !== `srgb-linear` &&
      ((e.colorSpace = LinearSRGBColorSpace), (e.needsUpdate = !0));
    e.wrapS = ClampToEdgeWrapping;
    e.wrapT = ClampToEdgeWrapping;
    this.material.uniforms.uIceNormalTxt.value = e;
    this.material.uniforms.uHasIceNormal.value = 1;
  }
  _bakeNormalMap(e?: any): any {
    if (!e || !e.image) return null;
    let t: any = e.image.width,
      n: any = e.image.height;
    if (!t || !n) return null;
    let r: any = new WebGLRenderTarget(t, n, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      depthBuffer: !1,
      stencilBuffer: !1,
    });
    r.texture.wrapS = ClampToEdgeWrapping;
    r.texture.wrapT = ClampToEdgeWrapping;
    r.texture.colorSpace = LinearSRGBColorSpace;
    let i: any = new ShaderMaterial({
        vertexShader: k_,
        fragmentShader: O_,
        uniforms: {
          uHeight: {
            value: e,
          },
          uTexelSize: {
            value: new Vector2(1 / t, 1 / n),
          },
          uStrength: {
            value: 3,
          },
          uSampleStride: {
            value: 8,
          },
        },
        depthWrite: !1,
        depthTest: !1,
      }),
      a: any = new FullScreenQuad(i),
      o: any = this._renderer.getRenderTarget();
    this._renderer.setRenderTarget(r);
    a.render(this._renderer);
    try {
      let e: any = new Uint8Array(t * n * 4);
      this._renderer.readRenderTargetPixels(r, 0, 0, t, n, e);
      let i: any = 0,
        a: any = 0,
        o: any = t * n;
      for (let t: any = 0; t < o; t++) {
        i += e[t * 4];
        a += e[t * 4 + 1];
      }
      let s: any = (i / o / 255) * 2 - 1,
        c: any = (a / o / 255) * 2 - 1;
      this.material.uniforms.uNormalBias.value.set(s, c);
    } catch (e: any) {
      console.warn(
        `[FrostingPass] Normal-map readback failed; uNormalBias stays (0, 0).`,
        e,
      );
    }
    this._renderer.setRenderTarget(o);
    a.dispose();
    i.dispose();
    this._bakedNormalRT = r;
    return r.texture;
  }
  startSpread(e: any = 3): any {
    this._trailMaterial.uniforms.uSpread.value = 1;
    this._trailMaterial.uniforms.uSpreadStep.value = 0.002;
    gsap.to(this._trailMaterial.uniforms.uSpreadStep, {
      value: 0.04,
      duration: e,
      ease: `none`,
    });
  }
  stopSpread(): any {
    gsap.killTweensOf(this._trailMaterial.uniforms.uSpreadStep);
    this._trailMaterial.uniforms.uSpread.value = 0;
    this._trailMaterial.uniforms.uSpreadStep.value = 0;
    this._meltTween &&= (this._meltTween.kill(), null);
    this._centerWhiteTween &&= (this._centerWhiteTween.kill(), null);
  }
  onCircleComplete(): any {
    let e: any = this.material.uniforms.uMelt,
      t: any = this.material.uniforms.uCenterWhite;
    gsap.killTweensOf(e);
    gsap.killTweensOf(t);
    e.value = 0;
    t.value = 0;
    this._meltTween = gsap.to(e, {
      value: 1.2,
      duration: 3.5,
      ease: `power2.inOut`,
      onComplete: (): any => {
        this._meltTween = null;
      },
    });
    this._centerWhiteTween = gsap.to(t, {
      value: 1.8,
      duration: 1.4,
      ease: `power2.inOut`,
      onComplete: (): any => {
        this._centerWhiteTween = null;
      },
    });
  }
  render(e?: any, t?: any, n?: any, r?: any): any {
    let i: any = this.renderToScreen ? null : t;
    if (this._firstActiveRender) {
      this._firstActiveRender = !1;
      let t: any = e.getRenderTarget();
      e.setRenderTarget(this._trailRTs[0]);
      e.clear(!0, !1, !1);
      e.setRenderTarget(this._trailRTs[1]);
      e.clear(!0, !1, !1);
      e.setRenderTarget(t);
    }
    let a: any = this._trailRTs[this._trailIdx],
      o: any = this._trailRTs[1 - this._trailIdx],
      s: any = r && r > 0 ? r : 1 / 60;
    if (
      ((this._trailMaterial.uniforms.uFade.value = Math.exp(-s * j_)),
      (this._trailMaterial.uniforms.uHeadFade.value = Math.exp(-s * M_)),
      this._trailMaterial.uniforms.uSpread.value > 0.5)
    ) {
      let t: any = 0.7071;
      this._trailMaterial.uniforms.uSpreadAxis.value.set(1, 0);
      this._trailMaterial.uniforms.uPrevTrail.value = a.texture;
      e.setRenderTarget(this._spreadTempRT);
      this._trailQuad.render(e);
      this._trailMaterial.uniforms.uSpreadAxis.value.set(0, 1);
      this._trailMaterial.uniforms.uPrevTrail.value =
        this._spreadTempRT.texture;
      e.setRenderTarget(this._spreadTempRT2);
      this._trailQuad.render(e);
      this._trailMaterial.uniforms.uSpreadAxis.value.set(t, t);
      this._trailMaterial.uniforms.uPrevTrail.value =
        this._spreadTempRT2.texture;
      e.setRenderTarget(this._spreadTempRT);
      this._trailQuad.render(e);
      this._trailMaterial.uniforms.uSpreadAxis.value.set(t, -0.7071);
      this._trailMaterial.uniforms.uPrevTrail.value =
        this._spreadTempRT.texture;
      e.setRenderTarget(o);
      this._trailQuad.render(e);
    } else {
      this._trailMaterial.uniforms.uPrevTrail.value = a.texture;
      e.setRenderTarget(o);
      this._trailQuad.render(e);
    }
    this._trailIdx = 1 - this._trailIdx;
    this.material.uniforms.tDiffuse.value = n.texture;
    this.material.uniforms.uTrailTexture.value = o.texture;
    e.setRenderTarget(i);
    this._compositeQuad.render(e);
  }
  setSize(e?: any, t?: any): any {
    let n: any = Math.max(1, e >> 2),
      r: any = Math.max(1, t >> 2);
    this._lastTrailW = n;
    this._lastTrailH = r;
    this._trailRTs &&
      (this._trailRTs[0].setSize(n, r),
      this._trailRTs[1].setSize(n, r),
      this._spreadTempRT.setSize(n, r),
      this._spreadTempRT2.setSize(n, r));
    let i: any = e / t;
    if (
      ((this._trailMaterial.uniforms.uAspect.value = i),
      (this.material.uniforms.uAspect.value = i),
      this._frostTexAspect)
    ) {
      let e: any = getCoverScale(this._frostTexAspect, i, !0);
      this._trailMaterial.uniforms.uFrostCoverScale.value.set(e.x, e.y);
      this.material.uniforms.uFrostCoverScale.value.set(e.x, e.y);
    }
  }
  dispose(): any {
    this._disposeTrailRTs();
    this._trailMaterial.dispose();
    this._trailQuad.dispose();
    this.material.dispose();
    this._compositeQuad.dispose();
  }
};
function L_(this: any, e?: any): any {
  let t: any = new Map(),
    n: any = new Map(),
    r: any = e.clone();
  R_(e, r, function (this: any, e?: any, r?: any): any {
    t.set(r, e);
    n.set(e, r);
  });
  r.traverse(function (this: any, e?: any): any {
    if (!e.isSkinnedMesh) return;
    let r: any = e,
      i: any = t.get(e),
      a: any = i.skeleton.bones;
    r.skeleton = i.skeleton.clone();
    r.bindMatrix.copy(i.bindMatrix);
    r.skeleton.bones = a.map(function (this: any, e?: any): any {
      return n.get(e);
    });
    r.bind(r.skeleton, r.bindMatrix);
  });
  return r;
}
function R_(this: any, e?: any, t?: any, n?: any): any {
  n(e, t);
  for (let r: any = 0; r < e.children.length; r++)
    R_(e.children[r], t.children[r], n);
}
export { T_, E_, D_, O_, k_, A_, j_, M_, N_, P_, F_, FrostingPass, L_, R_ };
