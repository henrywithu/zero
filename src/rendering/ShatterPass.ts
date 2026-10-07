// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import shaderSource12 from "../shaders/ShatterPass-B_-12.vert.glsl?raw";
import shaderSource13 from "../shaders/ShatterPass-V_-13.frag.glsl?raw";
import shaderSource14 from "../shaders/ShatterPass-H_-14.vert.glsl?raw";
import shaderSource15 from "../shaders/ShatterPass-U_-15.frag.glsl?raw";
import shaderSource16 from "../shaders/ShatterPass-W_-16.frag.glsl?raw";
import { Pass, FullScreenQuad } from "three/addons/postprocessing/Pass.js";
import {
  LinearFilter,
  RGBAFormat,
  WebGLRenderTarget,
  Scene,
  MeshBasicMaterial,
  Color,
  SRGBColorSpace,
  DataTexture,
  PlaneGeometry,
  Mesh,
  SkinnedMesh,
  PerspectiveCamera,
  AnimationMixer,
  InterpolateDiscrete,
} from "three";
import { ShaderMaterial } from "./ShaderMaterial";
import { L_ } from "./FrostingPass.ts";
var z_: any = 0.5;
var B_: any = shaderSource12;
var V_: any = shaderSource13;
var H_: any = shaderSource14;
var U_: any = shaderSource15;
var W_: any = shaderSource16;
var ShatterPass = class extends Pass {
  declare _setupSrc: any;
  declare renderToScreen: any;
  declare _handSourceMesh: any;
  declare _preclone: any;
  declare _precloneSrc: any;
  declare _prewarmed: any;
  declare _clearColor: any;
  declare _scrubMode: any;
  declare _finished: any;
  declare _onComplete: any;
  declare _model: any;
  declare _duration: any;
  declare _actions: any;
  declare _mixer: any;
  declare _handMeshProxy: any;
  declare _handMaskMaterial: any;
  declare _handCamera: any;
  declare _handMaskScene: any;
  declare _shardMaterial: any;
  declare _snapshotTexture: any;
  declare _shardCamera: any;
  declare _shardScene: any;
  declare _compositeQuad: any;
  declare _compositeMaterial: any;
  declare _copyQuad: any;
  declare _copyMaterial: any;
  declare handMaskRT: any;
  declare shatterRT: any;
  declare _renderer: any;
  declare enabled: any;
  declare needsSwap: any;
  constructor(e?: any, t?: any, n?: any) {
    super();
    this.needsSwap = !0;
    this.enabled = !1;
    this._renderer = e;
    let r: any = e.getPixelRatio(),
      i: any = Math.floor(t * r),
      a: any = Math.floor(n * r),
      o: any = {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        format: RGBAFormat,
        depthBuffer: !0,
        stencilBuffer: !1,
      },
      s: any = Math.max(1, Math.floor(i * z_)),
      c: any = Math.max(1, Math.floor(a * z_));
    this.shatterRT = new WebGLRenderTarget(s, c, o);
    this.handMaskRT = new WebGLRenderTarget(s, c, o);
    this._copyMaterial = new ShaderMaterial({
      vertexShader: B_,
      fragmentShader: V_,
      uniforms: {
        tDiffuse: {
          value: null,
        },
      },
      depthWrite: !1,
      depthTest: !1,
    });
    this._copyQuad = new FullScreenQuad(this._copyMaterial);
    this._compositeMaterial = new ShaderMaterial({
      vertexShader: B_,
      fragmentShader: W_,
      uniforms: {
        tDiffuse: {
          value: null,
        },
        uShatter: {
          value: null,
        },
        uHandMask: {
          value: null,
        },
      },
      depthWrite: !1,
      depthTest: !1,
    });
    this._compositeQuad = new FullScreenQuad(this._compositeMaterial);
    this._shardScene = new Scene();
    this._shardCamera = null;
    this._snapshotTexture = null;
    this._shardMaterial = null;
    this._handMaskScene = new Scene();
    this._handCamera = null;
    this._handMaskMaterial = new MeshBasicMaterial({
      color: 16777215,
    });
    this._handMeshProxy = null;
    this._mixer = null;
    this._actions = [];
    this._duration = 0;
    this._model = null;
    this._onComplete = null;
    this._finished = !1;
    this._scrubMode = !1;
    this._clearColor = new Color();
  }
  setShatterTextures(e?: any, t?: any): any {
    if (e) {
      for (let n of [e, t])
        n &&
          ((n.colorSpace = SRGBColorSpace),
          (n.flipY = !0),
          (n.needsUpdate = !0));
      if (this._shardMaterial) {
        this._shardMaterial.uniforms.uMapA.value = e;
        this._shardMaterial.uniforms.uMapB.value = t || e;
        this._shardMaterial.uniforms.uBlend.value = 0;
        return;
      }
      this._shardMaterial = new ShaderMaterial({
        vertexShader: H_,
        fragmentShader: U_,
        uniforms: {
          uMapA: {
            value: e,
          },
          uMapB: {
            value: t || e,
          },
          uBlend: {
            value: 0,
          },
          uFresnelPower: {
            value: 2.5,
          },
        },
        side: 2,
      });
    }
  }
  prewarm(e?: any, t?: any, n: any = null, r: any = null, i: any = null): any {
    if (this._prewarmed) return;
    if (
      ((this._prewarmed = !0),
      r && ((this._precloneSrc = r), (this._preclone = L_(r))),
      !this._shardMaterial)
    ) {
      let e: any = new DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
      e.needsUpdate = !0;
      this.setShatterTextures(e, null);
    }
    r && i && this.startScrub(r, i);
    let a: any = new Scene(),
      o: any = new PlaneGeometry(1, 1);
    for (let e of [
      this._shardMaterial,
      this._compositeMaterial,
      this._copyMaterial,
    ])
      e && a.add(new Mesh(o, e));
    if (
      (e.compile(a, t),
      this._shardScene && e.compile(this._shardScene, this._shardCamera || t),
      n &&
        n.isSkinnedMesh &&
        (this.setHandSource(n, t),
        e.compile(this._handMaskScene, t),
        this.clearHandSource()),
      o.dispose(),
      this._shardScene && this._shardCamera)
    ) {
      let t: any = new WebGLRenderTarget(1, 1),
        n: any = e.getRenderTarget();
      e.setRenderTarget(t);
      e.render(this._shardScene, this._shardCamera);
      this._handMaskScene &&
        this._handCamera &&
        e.render(this._handMaskScene, this._handCamera);
      e.setRenderTarget(n);
      t.dispose();
    }
    let s: any = e.getRenderTarget();
    for (let t of [this.shatterRT, this.handMaskRT])
      t && (e.setRenderTarget(t), e.clear());
    e.setRenderTarget(s);
  }
  setShatterBlend(e?: any): any {
    this._shardMaterial && (this._shardMaterial.uniforms.uBlend.value = e);
  }
  setHandSource(e?: any, t?: any): any {
    if ((this.clearHandSource(), (this._handCamera = t), !e)) return;
    if (!e.isSkinnedMesh || !e.bindMatrix) {
      console.warn(
        `ShatterPass.setHandSource: hand ref is not a SkinnedMesh — check the GLB export (node name + armature/skin intact). Hand mask disabled.`,
      );
      return;
    }
    let n: any = new SkinnedMesh(e.geometry, this._handMaskMaterial);
    n.skeleton = e.skeleton;
    n.bindMatrix.copy(e.bindMatrix);
    n.bindMatrixInverse.copy(e.bindMatrixInverse);
    n.frustumCulled = !1;
    this._handMeshProxy = n;
    this._handSourceMesh = e;
    this._handMaskScene.add(n);
  }
  clearHandSource(): any {
    this._handMeshProxy &&=
      (this._handMaskScene.remove(this._handMeshProxy), null);
    this._handSourceMesh = null;
    this._handCamera = null;
  }
  start(e?: any, t?: any, n?: any): any {
    this._onComplete = n;
    this._setupModel(e, t, !1);
  }
  startScrub(e?: any, t?: any): any {
    this._setupModel(e, t, !0);
  }
  scrub(e?: any): any {
    if (!this._scrubMode || !this._actions.length || !this._duration) return;
    let t: any = this._duration * Math.min(Math.max(e, 0), 1);
    for (let e of this._actions) e.time = t;
  }
  render(e?: any, t?: any, n?: any, r?: any): any {
    if (!this._model) {
      this._copyMaterial.uniforms.tDiffuse.value = n.texture;
      this.renderToScreen ? e.setRenderTarget(null) : e.setRenderTarget(t);
      this._copyQuad.render(e);
      return;
    }
    this._mixer &&
      !this._finished &&
      (this._scrubMode ? this._mixer.update(0) : this._mixer.update(r));
    let i: any = e.getClearColor(this._clearColor),
      a: any = e.getClearAlpha();
    e.setRenderTarget(this.shatterRT);
    e.setClearColor(0, 0);
    e.clear(!0, !0, !1);
    this._shardCamera && e.render(this._shardScene, this._shardCamera);
    e.setRenderTarget(this.handMaskRT);
    e.setClearColor(0, 1);
    e.clear(!0, !0, !1);
    this._handMeshProxy &&
      this._handCamera &&
      (this._handMeshProxy.matrixWorld.copy(this._handSourceMesh.matrixWorld),
      (this._handMeshProxy.matrixWorldNeedsUpdate = !1),
      e.render(this._handMaskScene, this._handCamera));
    e.setClearColor(i, a);
    this._compositeMaterial.uniforms.tDiffuse.value = n.texture;
    this._compositeMaterial.uniforms.uShatter.value = this.shatterRT.texture;
    this._compositeMaterial.uniforms.uHandMask.value = this.handMaskRT.texture;
    this.renderToScreen ? e.setRenderTarget(null) : e.setRenderTarget(t);
    this._compositeQuad.render(e);
  }
  _setupModel(e?: any, t?: any, n?: any): any {
    if (this._model && this._setupSrc === e && this._scrubMode === n) {
      this._finished = !1;
      for (let e of this._actions) {
        e.reset();
        e.play();
        e.time = 0;
      }
      this._mixer && this._mixer.update(0);
      return;
    }
    this._setupSrc = e;
    this._finished = !1;
    this._scrubMode = n;
    this._onComplete = n ? null : this._onComplete;
    this._preclone && this._precloneSrc === e
      ? ((this._model = this._preclone),
        (this._preclone = null),
        (this._precloneSrc = null))
      : (this._model = L_(e));
    let r: any = null;
    if (
      (this._model.traverse((e?: any): any => {
        (e.isPerspectiveCamera || e.isOrthographicCamera) &&
          ((r = e),
          console.log(`ShatterPass: baked camera found`, {
            type: e.isPerspectiveCamera ? `perspective` : `ortho`,
            fov: e.fov,
            position: e.position.toArray(),
            rotation: e.rotation.toArray(),
          }));
      }),
      this._model.traverse((e?: any): any => {
        (e.isMesh || e.isSkinnedMesh) &&
          (this._shardMaterial && (e.material = this._shardMaterial),
          (e.frustumCulled = !1));
      }),
      this._shardScene.add(this._model),
      r)
    )
      this._shardCamera = r;
    else {
      let e: any = this.shatterRT.width / this.shatterRT.height;
      this._shardCamera = new PerspectiveCamera(35, e, 0.01, 100);
      this._shardCamera.position.set(0, 0, 2);
      this._shardCamera.lookAt(0, 0, 0);
      this._shardScene.add(this._shardCamera);
    }
    if (((this._actions = []), (this._duration = 0), t && t.length > 0)) {
      this._mixer = new AnimationMixer(this._model);
      for (let e of t) {
        let t: any = this._mixer.clipAction(e);
        t.setLoop(InterpolateDiscrete);
        t.clampWhenFinished = !0;
        t.play();
        n && (t.paused = !0);
        this._actions.push(t);
        e.duration > this._duration && (this._duration = e.duration);
      }
      n || this._mixer.addEventListener(`finished`, this._handleFinished);
    }
  }
  _handleFinished = (): any => {
    this._finished = !0;
    this._onComplete && this._onComplete();
  };
  setSize(e?: any, t?: any): any {
    let n: any = this._renderer.getPixelRatio(),
      r: any = Math.floor(e * n),
      i: any = Math.floor(t * n);
    this.shatterRT.setSize(
      Math.max(1, Math.floor(r * z_)),
      Math.max(1, Math.floor(i * z_)),
    );
    this.handMaskRT.setSize(
      Math.max(1, Math.floor(r * z_)),
      Math.max(1, Math.floor(i * z_)),
    );
    this._shardCamera &&
      this._shardCamera.isPerspectiveCamera &&
      ((this._shardCamera.aspect = r / i),
      this._shardCamera.updateProjectionMatrix());
  }
  cleanup(): any {
    this._mixer &&=
      (this._mixer.removeEventListener(`finished`, this._handleFinished),
      this._mixer.stopAllAction(),
      null);
    this._model &&=
      (this._shardScene.remove(this._model),
      this._model.traverse((e?: any): any => {
        (e.isMesh || e.isSkinnedMesh) && e.geometry && e.geometry.dispose();
      }),
      null);
    this._shardCamera &&
      this._shardScene.children.includes(this._shardCamera) &&
      this._shardScene.remove(this._shardCamera);
    this._shardCamera = null;
    this._onComplete = null;
    this._snapshotTexture = null;
    this._finished = !1;
    this._scrubMode = !1;
    this._actions = [];
    this._duration = 0;
    this.clearHandSource();
  }
  dispose(): any {
    this.cleanup();
    this.shatterRT.dispose();
    this.handMaskRT.dispose();
    this._copyMaterial.dispose();
    this._compositeMaterial.dispose();
    this._handMaskMaterial.dispose();
    this._shardMaterial && this._shardMaterial.dispose();
    this._copyQuad.dispose();
    this._compositeQuad.dispose();
  }
};
export { z_, B_, V_, H_, U_, W_, ShatterPass };
