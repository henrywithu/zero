// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { GlassShards } from "../models/GlassShards.ts";
import { HandsModelTwo } from "../models/HandsModelTwo.ts";
import { TextSprites } from "../components/TextSprites.ts";
import { atlasUv, atlasAspect } from "../rendering/TextMaterial.ts";
import {
  DataTexture,
  RGBAFormat,
  Vector3,
  Scene,
  WebGLRenderTarget,
  VideoTexture,
  SRGBColorSpace,
} from "three";
import { audioManager } from "../audio/AudioManager.ts";
import { Pg } from "../input/ZeroGesture.ts";
import {
  createStageVideo,
  whenVideoReady,
  playStageVideo,
  rangeProgress,
} from "./shared.ts";
import { setPassTexture, setPassAsset } from "../rendering/textureUtils.ts";
function Gb(this: any, e?: any): any {
  let t: any = -0.8,
    n: any = [],
    r: any = [
      [0.1, -0.05, 0.15, 0.25, 0.2, -0.4],
      [0.05, 0.12, -0.3, -0.15, -0.25, 0.5],
      [-0.08, -0.1, 0.45, 0.2, 0.15, -0.6],
      [0.12, 0.08, -0.2, -0.1, 0.3, 0.35],
      [-0.05, -0.15, 0.55, 0.18, -0.2, -0.45],
      [0.15, 0.05, -0.1, -0.2, 0.1, 0.65],
      [-0.1, 0.12, 0.35, 0.15, -0.15, -0.55],
    ],
    i: any = [
      [0.02, 0.4],
      [-0.06, -0.08],
      [0.08, -0.15],
      [-0.04, -0.05],
      [0.05, 0.2],
      [-0.08, -0.4],
      [0.05, -0.18],
    ],
    a: any = [
      {
        region: 0,
        shard: 1,
        size: 0.036,
        dx: -0.05,
        spin: 30,
      },
      {
        region: 1,
        shard: 2,
        size: 0.072,
      },
      {
        region: 2,
        shard: 3,
        size: 0.0675,
        dx: -0.1,
      },
      {
        region: 3,
        shard: 4,
        size: 0.08,
        spin: 20,
      },
      {
        region: 4,
        shard: 5,
        size: 0.054,
      },
      {
        region: 5,
        shard: 6,
        size: 0.096,
      },
    ],
    o: any = [
      {
        x: 0,
        y: 0,
        w: 856,
        h: 381,
      },
      {
        x: 881,
        y: 0,
        w: 860,
        h: 518,
      },
      {
        x: 1765,
        y: 0,
        w: 735,
        h: 283,
        rot: !0,
      },
      {
        x: 0,
        y: 699,
        w: 1024,
        h: 363,
      },
      {
        x: 1042,
        y: 737,
        w: 952,
        h: 502,
      },
      {
        x: 563,
        y: 1073,
        w: 975,
        h: 370,
        rot: !0,
      },
    ],
    s: any = e.getAsset(`spcAtlas`),
    c: any = new Map(a.map((e?: any): any => [e.shard, e]));
  for (let e: any = 0; e < 7; e++) {
    let a: any = -0.66 - e * 0.22,
      l: any = r[e],
      [u, d] = i[e],
      f: any = c.get(e + 1),
      p: any = f ? o[f.region] : null;
    n.push({
      meshName: `Shard_0${e + 1}`,
      startPosition: [u, a, t + d],
      endPosition: [u, a + 2.64, t + d],
      startRotation: [l[0], l[1], l[2]],
      endRotation: [l[3], l[4], l[5]],
      scale: 1.275,
      overlay:
        s && p
          ? {
              texture: s,
              region: p,
              height: f.size,
              offset: [
                (f.dx || 0) * f.size * (p.w / p.h),
                (f.dy || 0) * f.size,
                0.02,
              ],
              spin: ((f.spin || 0) * Math.PI) / 180,
            }
          : void 0,
    });
  }
  let l: any = 0.25,
    u: any = [
      [-0.72, -0.28, -1.8],
      [0.64, -0.2, -2],
      [-0.95, -0.28, -2.2],
      [0.86, -0.42, -1.9],
      [-0.4, -0.04, -2.45],
      [0.36, -0.62, -2.3],
      [-0.6, -0.56, -1.7],
      [0.72, -0.06, -2.55],
      [0.06, -0.12, -2.65],
    ],
    d: any = [
      [0.3, 0.4, 0.2],
      [-0.25, 0.5, -0.35],
      [0.45, -0.3, 0.6],
      [-0.2, 0.35, 0.35],
      [0.55, -0.2, -0.45],
      [-0.4, 0.1, 0.65],
      [0.35, -0.5, -0.55],
      [-0.3, 0.45, 0.25],
      [0.2, -0.35, -0.4],
    ],
    f: any = [1.65, 1.4, 1.9, 1.5, 1.25, 1.75, 1.35, 1.2, 1.1];
  for (let e: any = 0; e < u.length; e++) {
    let t: any = String(e + 1).padStart(2, `0`),
      [r, i, a] = u[e],
      o: any = d[e],
      s: any = 1.584 / 2,
      c: any = e % 2 ? 1 : -1;
    n.push({
      meshName: `BG_Shard_${t}`,
      background: !0,
      startPosition: [r, i - s, a],
      endPosition: [r, i + s, a],
      startRotation: o,
      endRotation: [o[0] + l * c, o[1] - l * 0.6, o[2] + l * c],
      scale: f[e],
    });
  }
  return new GlassShards(e, n, e.getAsset(`allShards`));
}
function Kb(this: any, e?: any): any {
  let { scene: t, camera: n, assetLoader: r, textScene: i } = e,
    a: any = e.preWarmed?.handsModel2 || new HandsModelTwo(r);
  e.preWarmed && (e.preWarmed.handsModel2 = null);
  a.group.parent !== t &&
    (a.group.parent && a.group.parent.remove(a.group), t.add(a.group));
  let o: any = (e.preWarmed && e.preWarmed.glassShards) || Gb(r);
  if (
    (e.preWarmed && (e.preWarmed.glassShards = o),
    o.setCameraRig(e.cameraRig, 0.15),
    n.add(o.group),
    e.glassShardPass)
  ) {
    e.glassShardPass.setShards(o, n, t);
    let i: any = r.getAsset(`frostingNormal`);
    i && e.glassShardPass.setRefractionMap(i, 0.3, 3, 3);
  }
  let s: any = null,
    c: any = r.getAsset(`textsAtlas`);
  c &&
    (e.renderer && (c.anisotropy = e.renderer.capabilities.getMaxAnisotropy()),
    (s = new TextSprites(i, [
      {
        texture: c,
        atlasUV: atlasUv(1092.93, 558.45, 945.23, 371.64),
        aspect: atlasAspect(945.23, 371.64),
        baseScale: 0.4,
        anchor: `center-center`,
        appearAt: 0,
        disappearAt: 0.2,
      },
    ])),
    s.resize(e._vw, e._vh));
  e.components = {
    handsModel: a,
    glassShards: o,
    textLayout: s,
  };
}
var qb: any = new DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1, RGBAFormat);
qb.needsUpdate = !0;
var Jb: any = 3;
var Yb: any = 0;
var Xb: any = 4.733333333333333;
var Zb: any = 0.85;
var Qb: any = 0.15;
var $b: any = 0.8;
var ex: any = 0.03;
var tx: any = 0.08;
var nx: any = 0.9;
var rx: any = 0.85;
new Vector3(0, 0, 0);
new Vector3(0.035, -0.003, -0.02);
new Vector3(0.01, 0, -0.004);
function ix(this: any, e?: any): any {
  if (
    (e.shatterPass &&
      !e.shatterPass._prewarmed &&
      e.shatterPass.prewarm(
        e.renderer,
        e.camera,
        (e.preWarmed &&
          e.preWarmed.handsModel2 &&
          e.preWarmed.handsModel2.handRef) ||
          null,
        e.assetLoader.getAsset(`glassShatter`),
        e.assetLoader.assets.animations.glassShatter,
      ),
    e.glassShardPass &&
      !e.glassShardPass._prewarmed &&
      e.glassShardPass.prewarm(e.renderer, e.camera),
    e.preWarmed &&
      e.preWarmed.glassShards &&
      e.renderer &&
      !e._gateShardsGeomWarmed)
  ) {
    e._gateShardsGeomWarmed = !0;
    let t: any = e.preWarmed.glassShards.group,
      n: any = new Scene();
    n.add(t);
    let r: any = new WebGLRenderTarget(1, 1),
      i: any = e.renderer.getRenderTarget();
    e.renderer.setRenderTarget(r);
    e.renderer.render(n, e.camera);
    e.renderer.setRenderTarget(i);
    r.dispose();
    n.remove(t);
  }
}
function ax(this: any, e?: any): any {
  e._gatePrevPixelRatio ??
    (!e.applyPixelRatioOverride ||
      !e.renderer ||
      ((e._gatePrevPixelRatio = e.renderer.getPixelRatio()),
      e.applyPixelRatioOverride(e._gatePrevPixelRatio * $b)));
}
function ox(this: any, e?: any): any {
  e._gatePrevPixelRatio != null &&
    (e.applyPixelRatioOverride &&
      e.applyPixelRatioOverride(e._gatePrevPixelRatio),
    (e._gatePrevPixelRatio = null));
}
var gateOneToTwo: any = {
  id: `gate1to2`,
  scrollVh: 50,
  autoScroll: !0,
  autoScrollDuration: Jb,
  fastForwardPreRoll: 3,
  async enter(this: any, e?: any): Promise<any> {
    ix(e);
    audioManager.stop(`stage1-ambient`);
    e._gateElapsed = e._ripplePreplayed ? 3 : 0;
    e._ripplePreplayed = !1;
    e._gateShatterStarted = !1;
    e._gateShatterSfxFired = !1;
    e._gateHandElapsed = 0;
    e._gateTextElapsed = 0;
    let t: any = e.assetLoader.getAsset(`textsAtlas`);
    t &&
      (e.renderer &&
        (t.anisotropy = e.renderer.capabilities.getMaxAnisotropy()),
      (e._gateTextLayout = new TextSprites(e.textScene, [
        {
          texture: t,
          atlasUV: atlasUv(257.75, 558.45, 247.06, 165.84),
          aspect: atlasAspect(247.06, 165.84),
          baseScale: 0.15,
          anchor: `center-center`,
          appearAt: 1,
          disappearAt: 2,
        },
      ])),
      e._gateTextLayout.resize(e._vw, e._vh));
  },
  update(this: any, e?: any, t?: any, n?: any): any {
    let r: any = Math.min(n, 0.1);
    e._gateElapsed = (e._gateElapsed || 0) + r;
    e._gateTextLayout &&
      ((e._gateTextElapsed = (e._gateTextElapsed || 0) + r),
      e._gateTextLayout.update(e._gateTextElapsed, n));
    let i: any = e.components;
    if (e._gateElapsed < 3) {
      if (i.handsModel) {
        let t: any = e._gateElapsed,
          n: any = e.renderer ? e.renderer.getPixelRatio() : 1,
          r: any = e._vw * n,
          a: any = e._vh * n;
        i.handsModel._ethRippleUniforms &&
          ((i.handsModel._ethRippleUniforms.uRippleTime.value = t),
          (i.handsModel._ethRippleUniforms.uRippleIntensity.value = 1),
          i.handsModel._ethRippleUniforms.uRippleResolution.value.set(r, a));
        i.handsModel.humanHandMaterial?.uniforms &&
          ((i.handsModel.humanHandMaterial.uniforms.uRippleTime.value = t),
          (i.handsModel.humanHandMaterial.uniforms.uRippleIntensity.value = 1),
          i.handsModel.humanHandMaterial.uniforms.uRippleResolution.value.set(
            r,
            a,
          ));
      }
      e.fgPass?.uniforms &&
        ((e.fgPass.uniforms.uRippleTime.value = e._gateElapsed),
        (e.fgPass.uniforms.uRippleStrength.value = 0.15));
      let t: any = e._gateElapsed / 3;
      i.handsModel &&
        (i.handsModel.scrub(0.7 + t * 0.3), i.handsModel.update(n));
      i.portalMaterial && (i.portalMaterial.uniforms.uTime.value += n);
      i.handsModel &&
        i.handsModel.cameraRef &&
        (i.handsModel.cameraRef.getWorldPosition(e._tempVec3),
        i.handsModel.cameraRef.getWorldQuaternion(e._tempQuat),
        e.camera.position.lerp(e._tempVec3, Pg.CAMERA_LERP),
        e.camera.quaternion.slerp(e._tempQuat, Pg.CAMERA_LERP));
      i.petalParticles &&
        i.petalParticles.group.visible &&
        (i.petalParticles.group.position.copy(e.camera.position),
        e._tempVec3.set(0, 0, -0.7).applyQuaternion(e.camera.quaternion),
        i.petalParticles.group.position.add(e._tempVec3),
        i.petalParticles.update(n));
      i.textLayout && i.textLayout.update(1, n);
      e.cameraRig.update(n);
      return;
    }
    if (!e._gateShatterStarted) {
      if (
        ((e._gateShatterStarted = !0),
        ax(e),
        e.lensBlurPass &&
          ((e._gateLensBlurWasEnabled = e.lensBlurPass.enabled),
          (e.lensBlurPass.enabled = !1)),
        e.frostingPass &&
          ((e._gateFrostWasEnabled = e.frostingPass.enabled),
          (e.frostingPass.enabled = !1)),
        e.components.handsModel &&
          (e.components.handsModel._ethRippleUniforms &&
            ((e.components.handsModel._ethRippleUniforms.uRippleIntensity.value = 0),
            (e.components.handsModel._ethRippleUniforms.uRippleTime.value = 0)),
          e.components.handsModel.humanHandMaterial?.uniforms &&
            ((e.components.handsModel.humanHandMaterial.uniforms.uRippleIntensity.value = 0),
            (e.components.handsModel.humanHandMaterial.uniforms.uRippleTime.value = 0))),
        e.fgPass?.uniforms &&
          ((e.fgPass.uniforms.uRippleStrength.value = 0),
          (e.fgPass.uniforms.uRippleTime.value = 0)),
        e.shatterPass.setShatterTextures(qb, null),
        (e.textPass.renderToScreen = !1),
        (e.shatterPass.enabled = !0),
        (e.shatterPass.renderToScreen = !0),
        (e._pendingTeardown &&= (e._pendingTeardown(), null)),
        e.bgPass)
      ) {
        let t: any = e._stage2VideoPrefetch;
        t ? (e._stage2VideoPrefetch = null) : (t = createStageVideo(`/`));
        let n: any = e._stage2VideoTexPrewarmed || null;
        n
          ? ((e._stage2VideoTexPrewarmed = null), (t = n.image))
          : ((n = new VideoTexture(t)), (n.colorSpace = SRGBColorSpace));
        whenVideoReady(t, (): any => {
          e.bgPass &&
            (setPassTexture(e.bgPass, `A`, n, !0, !0),
            (e.bgPass.uniforms.uLinearizeA.value = 1),
            (e.bgPass.uniforms.uProgress.value = 0));
        });
        playStageVideo(t);
        e._stage2Video = t;
        e._stage2VideoTex = n;
      }
      e.fgPass &&
        (setPassAsset(e.fgPass, `B`, `stage2Foreground`, e.assetLoader, !1),
        (e.fgPass.uniforms.uProgress.value = 1));
      Kb(e);
      let t: any = e.components;
      t.handsModel &&
        t.handsModel.group &&
        ((t.handsModel.group.visible = !0),
        t.handsModel.group.position.set(0, 0, 0),
        t.handsModel.group.rotation.set(0, 0, 0),
        t.handsModel.group.scale.set(1, 1, 1));
      t.handsModel &&
        t.handsModel.duration > 0 &&
        (t.handsModel.scrub(Yb / t.handsModel.duration),
        t.handsModel.update(0));
      t.handsModel &&
        t.handsModel.handRef &&
        e.shatterPass.setHandSource(t.handsModel.handRef, e.camera);
      let n: any = e.assetLoader.getAsset(`glassShatter`),
        r: any = e.assetLoader.assets.animations.glassShatter;
      n && r
        ? e.shatterPass.startScrub(n, r)
        : (console.warn(
            `MasterTimeline: glassShatter model or animations not found`,
          ),
          (e.shatterPass.enabled = !1),
          (e.shatterPass.renderToScreen = !1),
          (e.textPass.renderToScreen = !0));
    }
    let a: any = e._gateElapsed - 3,
      o: any = Math.min(a / Jb, 1),
      s: any = Math.max(0, (o - Qb) / (1 - Qb));
    !e._gateShatterSfxFired &&
      s > 0 &&
      ((e._gateShatterSfxFired = !0),
      e._directNavActive || audioManager.play(`glass-shatter`));
    e.shatterPass.scrub(Math.min(s * 1.2, 1));
    e.shatterPass.setShatterBlend(Math.min(s * 5, 1));
    let c: any = Math.max(0, 1 - o * 15);
    if (
      (e.fgPass?.uniforms &&
        ((e.fgPass.uniforms.uExposure.value = 1 - 1 * c),
        (e.fgPass.uniforms.uContrast.value = 1 + nx * c),
        (e.fgPass.uniforms.uRedTint.value = rx * c)),
      e.bgPass?.uniforms?.uZoom && (e.bgPass.uniforms.uZoom.value = 1 - tx * c),
      e.components.handsModel)
    ) {
      let t: any = e.components.handsModel.duration,
        r: any = t > 0 ? Yb / t : 0,
        i: any = t > 0 ? Xb / t : 1;
      e._gateHandElapsed = (e._gateHandElapsed || 0) + Math.min(n, 0.04);
      let a: any = Math.min(1, e._gateHandElapsed / Jb / Zb),
        o: any;
      if (a < 0.3) o = a;
      else {
        let e: any = 1 - (a - 0.3) / 0.7;
        o = 0.3 + 0.7 * (1 - e * e);
      }
      let s: any = r + o * (i - r);
      e.components.handsModel.scrub(s);
      e._gateHandProgress = s;
      e.components.handsModel.update(0);
    }
    if (e.components.handsModel && e.components.handsModel.cameraRef) {
      e.components.handsModel.cameraRef.getWorldPosition(e._tempVec3);
      e.components.handsModel.cameraRef.getWorldQuaternion(e._tempQuat);
      let t: any = rangeProgress(o, 0.3, 0.85),
        n: any = 0.08 + 0.92 * (t * t * (3 - 2 * t));
      e.camera.position.lerp(e._tempVec3, n);
      e.camera.quaternion.slerp(e._tempQuat, n);
    }
  },
  teardown(this: any, e?: any): any {
    ox(e);
    e._gateLensBlurWasEnabled != null &&
      (e.lensBlurPass && (e.lensBlurPass.enabled = e._gateLensBlurWasEnabled),
      (e._gateLensBlurWasEnabled = null));
    e._gateFrostWasEnabled != null &&
      (e.frostingPass && (e.frostingPass.enabled = e._gateFrostWasEnabled),
      (e._gateFrostWasEnabled = null));
    e.shatterPass.enabled = !1;
    e.shatterPass.renderToScreen = !1;
    e.textPass.renderToScreen = !0;
    e.shatterPass.cleanup();
    e._gateElapsed = 0;
    e._gateTextElapsed = 0;
    e._gateShatterStarted = !1;
    e._gateTextLayout &&= (e._gateTextLayout.dispose(), null);
    e.components.handsModel &&
      (e.components.handsModel._ethRippleUniforms &&
        (e.components.handsModel._ethRippleUniforms.uRippleIntensity.value = 0),
      e.components.handsModel.humanHandMaterial?.uniforms &&
        (e.components.handsModel.humanHandMaterial.uniforms.uRippleIntensity.value = 0));
  },
};
var cx: any = `/assets/atlases/garden-godrays.ktx2`;
var lx: any = 4096;
var ux: any = 2661;
var dx: any = {
  scale: 1 / 1751,
};
var fx: any = [
  {
    rect: [2382, 19, 1714, 1714],
    pos: [0.5, 0.555],
    scale: 2.01,
    depth: 1,
  },
  {
    rect: [0, 2, 1751, 815],
    pos: [0.5, 0],
    scale: 1.94,
    depth: 0,
  },
  {
    rect: [0, 819, 1751, 531],
    pos: [0.5, 0.23],
    scale: 1.82,
    depth: 0.2,
  },
  {
    rect: [0, 1354, 1751, 547],
    pos: [0.5, 0.28],
    scale: 1.75,
    depth: 0.4,
  },
  {
    rect: [2048, 0, 325, 629],
    pos: [0.685, 0.54],
    scale: 1.03,
    depth: 0.28,
  },
  {
    rect: [1760, 0, 269, 538],
    pos: [0.305, 0.54],
    scale: 1.1,
    depth: 0.34,
  },
];
export {
  Gb,
  Kb,
  qb,
  Jb,
  Yb,
  Xb,
  Zb,
  Qb,
  $b,
  ex,
  tx,
  nx,
  rx,
  ix,
  ax,
  ox,
  gateOneToTwo,
  cx,
  lx,
  ux,
  dx,
  fx,
};
