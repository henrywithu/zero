// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import shaderSource5 from "../shaders/TextPass-S_-5.vert.glsl?raw";
import shaderSource6 from "../shaders/TextPass-C_-6.frag.glsl?raw";
import { Pass, FullScreenQuad } from "three/addons/postprocessing/Pass.js";
import {
  Scene,
  OrthographicCamera,
  WebGLRenderTarget,
  LinearFilter,
  RGBAFormat,
  Color,
} from "three";
import { ShaderMaterial } from "./ShaderMaterial";
import { x_ } from "./QualityManager.ts";
var S_: any = shaderSource5;
var C_: any = shaderSource6;
var TextPass = class extends Pass {
  declare renderToScreen: any;
  declare _clearColor: any;
  declare fsQuad: any;
  declare compositeMaterial: any;
  declare textRT: any;
  declare textCamera: any;
  declare textScene: any;
  declare needsSwap: any;
  declare _renderer: any;
  constructor(e?: any, t?: any, n?: any) {
    super();
    this._renderer = e;
    this.needsSwap = !0;
    this.textScene = new Scene();
    this.textCamera = new OrthographicCamera(
      -t / 2,
      t / 2,
      n / 2,
      -n / 2,
      0.1,
      100,
    );
    this.textCamera.position.z = 10;
    let r: any = x_();
    this.textRT = new WebGLRenderTarget(Math.floor(t * r), Math.floor(n * r), {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
    });
    this.compositeMaterial = new ShaderMaterial({
      vertexShader: S_,
      fragmentShader: C_,
      uniforms: {
        tDiffuse: {
          value: null,
        },
        uTextTexture: {
          value: null,
        },
        uBrightness: {
          value: 0,
        },
        uSaturation: {
          value: 1,
        },
      },
      depthWrite: !1,
      depthTest: !1,
    });
    this.fsQuad = new FullScreenQuad(this.compositeMaterial);
    this._clearColor = new Color();
  }
  _hasVisibleSprites(): any {
    let e: any = this.textScene.children;
    for (let t: any = 0; t < e.length; t++) if (e[t].visible) return !0;
    return !1;
  }
  render(e?: any, t?: any, n?: any): any {
    let r: any = e.getClearColor(this._clearColor),
      i: any = e.getClearAlpha();
    e.setRenderTarget(this.textRT);
    e.setClearColor(0, 0);
    e.clear(!0, !0, !1);
    e.render(this.textScene, this.textCamera);
    this.compositeMaterial.uniforms.tDiffuse.value = n.texture;
    this.compositeMaterial.uniforms.uTextTexture.value = this.textRT.texture;
    this.renderToScreen ? e.setRenderTarget(null) : e.setRenderTarget(t);
    this.fsQuad.render(e);
    e.setClearColor(r, i);
  }
  warmUp(): any {
    let e: any = [];
    this.textScene.traverse((t?: any): any => {
      t.isMesh && !t.visible && ((t.visible = !0), e.push(t));
    });
    this._renderer.setRenderTarget(this.textRT);
    this._renderer.setClearColor(0, 0);
    this._renderer.clear(!0, !0, !1);
    this._renderer.render(this.textScene, this.textCamera);
    this._renderer.setRenderTarget(null);
    for (let t: any = 0; t < e.length; t++) e[t].visible = !1;
  }
  setSize(e?: any, t?: any): any {
    let n: any = this._renderer.getPixelRatio(),
      r: any = Math.round(e / n),
      i: any = Math.round(t / n),
      a: any = x_();
    this.textRT.setSize(Math.floor(r * a), Math.floor(i * a));
    this.textCamera.left = -r / 2;
    this.textCamera.right = r / 2;
    this.textCamera.top = i / 2;
    this.textCamera.bottom = -i / 2;
    this.textCamera.updateProjectionMatrix();
  }
  dispose(): any {
    this.textRT.dispose();
    this.compositeMaterial.dispose();
    this.fsQuad.dispose();
  }
};
export { S_, C_, TextPass };
