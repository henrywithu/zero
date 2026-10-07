// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import shaderSource17 from "../shaders/GlassShardPass-K_-17.vert.glsl?raw";
import shaderSource18 from "../shaders/GlassShardPass-q_-18.frag.glsl?raw";
import shaderSource19 from "../shaders/GlassShardPass-J_-19.frag.glsl?raw";
import { Pass, FullScreenQuad } from "three/addons/postprocessing/Pass.js";
import {
  WebGLRenderTarget,
  LinearFilter,
  RGBAFormat,
  Scene,
  MeshBasicMaterial,
  DataTexture,
  Vector2,
  Vector3,
  Color,
  RepeatWrapping,
  PlaneGeometry,
  Mesh,
} from "three";
import { ShaderMaterial } from "./ShaderMaterial";
import shaderSource20 from "../shaders/GlassShardPass-vertexShader-20.vert.glsl?raw";
var K_: any = shaderSource17;
var q_: any = shaderSource18;
var J_: any = shaderSource19;
var GlassShardPass = class extends Pass {
  declare renderToScreen: any;
  declare _prewarmed: any;
  declare _clearColor: any;
  declare _proxies: any;
  declare _compositeQuad: any;
  declare _compositeMaterial: any;
  declare _fallbackTex: any;
  declare _depthMaterial: any;
  declare _occluderScene: any;
  declare _bgProxies: any;
  declare _shardGroup: any;
  declare _overlayProxies: any;
  declare _shardMeshes: any;
  declare _camera: any;
  declare _overlayScene: any;
  declare _bgMaskScene: any;
  declare _maskScene: any;
  declare _maskMaterial: any;
  declare _maskRT: any;
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
      a: any = Math.floor(n * r);
    this._maskRT = new WebGLRenderTarget(i, a, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      depthBuffer: !0,
      stencilBuffer: !1,
    });
    this._maskMaterial = new ShaderMaterial({
      vertexShader: K_,
      fragmentShader: q_,
      side: 2,
    });
    this._maskScene = new Scene();
    this._bgMaskScene = new Scene();
    this._overlayScene = new Scene();
    this._camera = null;
    this._shardMeshes = [];
    this._overlayProxies = [];
    this._shardGroup = null;
    this._bgProxies = [];
    this._occluderScene = null;
    this._depthMaterial = new MeshBasicMaterial({
      colorWrite: !1,
    });
    let o: any = new Uint8Array([0, 0, 0, 0]);
    this._fallbackTex = new DataTexture(o, 1, 1, RGBAFormat);
    this._fallbackTex.needsUpdate = !0;
    this._compositeMaterial = new ShaderMaterial({
      vertexShader: shaderSource20,
      fragmentShader: J_,
      uniforms: {
        tDiffuse: {
          value: this._fallbackTex,
        },
        uNormalMask: {
          value: this._fallbackTex,
        },
        uRefractionMap: {
          value: this._fallbackTex,
        },
        uRefraction: {
          value: 0.25,
        },
        uDispersion: {
          value: 0.15,
        },
        uMapStrength: {
          value: 2,
        },
        uMapScale: {
          value: new Vector2(1, 1),
        },
        uTintColor: {
          value: new Vector3(1, 1, 1),
        },
        uFresnelPower: {
          value: 10,
        },
        uPixelSize: {
          value: new Vector2(1 / i, 1 / a),
        },
        uEdgeHighlight: {
          value: 0.15,
        },
      },
      depthWrite: !1,
      depthTest: !1,
    });
    this._compositeQuad = new FullScreenQuad(this._compositeMaterial);
    this._proxies = [];
    this._clearColor = new Color();
  }
  get uniforms(): any {
    return this._compositeMaterial.uniforms;
  }
  setRefractionMap(e?: any, t: any = 0.3, n: any = 1, r: any = 1): any {
    e.wrapS = RepeatWrapping;
    e.wrapT = RepeatWrapping;
    let i: any = this._compositeMaterial.uniforms;
    i.uRefractionMap.value = e;
    i.uMapStrength.value = t;
    i.uMapScale.value.set(n, r);
  }
  prewarm(e?: any, t?: any): any {
    if (this._prewarmed) return;
    this._prewarmed = !0;
    let n: any = new Scene(),
      r: any = new PlaneGeometry(1, 1);
    for (let e of [
      this._maskMaterial,
      this._depthMaterial,
      this._compositeMaterial,
    ])
      e && n.add(new Mesh(r, e));
    e.compile(n, t);
    r.dispose();
    let i: any = e.getRenderTarget();
    e.setRenderTarget(this._maskRT);
    e.clear();
    e.setRenderTarget(i);
  }
  setShards(e?: any, t?: any, n: any = null): any {
    this.clearShards();
    this._camera = t;
    this._shardGroup = e.group;
    this._occluderScene = n;
    for (let t of e.shards) {
      let e: any = !!t.userData.isBackground;
      t.traverse((t?: any): any => {
        if (!(!t.isMesh && !t.isSkinnedMesh))
          if (t.userData.isOverlay) {
            t.visible = !1;
            let e: any = new Mesh(t.geometry, t.material);
            e.frustumCulled = !1;
            e.matrixAutoUpdate = !1;
            this._overlayScene.add(e);
            this._overlayProxies.push({
              source: t,
              proxy: e,
            });
          } else {
            let n: any = new Mesh(t.geometry, this._maskMaterial);
            n.frustumCulled = !1;
            n.matrixAutoUpdate = !1;
            e
              ? (this._bgMaskScene.add(n),
                this._bgProxies.push({
                  source: t,
                  proxy: n,
                }))
              : (this._maskScene.add(n),
                this._proxies.push({
                  source: t,
                  proxy: n,
                }));
            t.visible = !1;
            this._shardMeshes.push(t);
          }
      });
    }
    this.enabled = !0;
  }
  clearShards(): any {
    for (let { proxy: e } of this._proxies) this._maskScene.remove(e);
    for (let { proxy: e } of this._bgProxies) this._bgMaskScene.remove(e);
    for (let { source: e, proxy: t } of this._overlayProxies) {
      this._overlayScene.remove(t);
      e.visible = !0;
    }
    for (let e of this._shardMeshes) e.visible = !0;
    this._proxies = [];
    this._bgProxies = [];
    this._shardMeshes = [];
    this._overlayProxies = [];
    this._shardGroup = null;
    this._camera = null;
    this._occluderScene = null;
    this.enabled = !1;
  }
  render(e?: any, t?: any, n?: any): any {
    for (let { source: e, proxy: t } of this._proxies) {
      e.updateWorldMatrix(!0, !1);
      t.matrix.copy(e.matrixWorld);
      t.matrixWorldNeedsUpdate = !0;
    }
    for (let { source: e, proxy: t } of this._bgProxies) {
      e.updateWorldMatrix(!0, !1);
      t.matrix.copy(e.matrixWorld);
      t.matrixWorldNeedsUpdate = !0;
    }
    let r: any = e.getClearColor(this._clearColor),
      i: any = e.getClearAlpha(),
      a: any = e.autoClear;
    if (
      (e.setRenderTarget(this._maskRT),
      e.setClearColor(0, 0),
      (e.autoClear = !1),
      e.clear(!0, !0, !1),
      this._camera &&
        (e.render(this._maskScene, this._camera), this._bgProxies.length))
    ) {
      if (this._occluderScene) {
        let t: any = this._occluderScene.overrideMaterial;
        this._occluderScene.overrideMaterial = this._depthMaterial;
        e.render(this._occluderScene, this._camera);
        this._occluderScene.overrideMaterial = t;
      }
      e.render(this._bgMaskScene, this._camera);
    }
    e.autoClear = a;
    e.setClearColor(r, i);
    this._compositeMaterial.uniforms.tDiffuse.value = n.texture;
    this._compositeMaterial.uniforms.uNormalMask.value = this._maskRT.texture;
    let o: any = this.renderToScreen ? null : t;
    if (
      (e.setRenderTarget(o),
      this._compositeQuad.render(e),
      this._overlayProxies.length && this._camera)
    ) {
      for (let { source: e, proxy: t } of this._overlayProxies) {
        e.updateWorldMatrix(!0, !1);
        t.matrix.copy(e.matrixWorld);
        t.matrixWorldNeedsUpdate = !0;
      }
      e.autoClear = !1;
      e.render(this._overlayScene, this._camera);
      e.autoClear = !0;
    }
  }
  setSize(e?: any, t?: any): any {
    let n: any = this._renderer.getPixelRatio(),
      r: any = Math.floor(e * n),
      i: any = Math.floor(t * n);
    this._maskRT.setSize(r, i);
    this._compositeMaterial.uniforms.uPixelSize.value.set(1 / r, 1 / i);
  }
  dispose(): any {
    this.clearShards();
    this._maskRT.dispose();
    this._maskMaterial.dispose();
    this._depthMaterial.dispose();
    this._compositeMaterial.dispose();
    this._compositeQuad.dispose();
    this._fallbackTex.dispose();
  }
};
export { K_, q_, J_, GlassShardPass };
