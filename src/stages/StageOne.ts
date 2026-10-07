// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import {
  fx,
  lx,
  ux,
  dx,
  cx,
  ex,
  tx,
  nx,
  rx,
  ix,
  ax,
  ox,
} from "./GateOneToTwo.ts";
import { Vector4, Vector2, SRGBColorSpace, MathUtils } from "three";
import { Ib } from "../models/origami.ts";
import { qualityManager } from "../rendering/QualityManager.ts";
import { GlassShardPass } from "../rendering/GlassShardPass.ts";
import { vv, awardXp, rangeProgress } from "./shared.ts";
import { ShatterPass } from "../rendering/ShatterPass.ts";
import { gsap } from "gsap";
import { audioManager } from "../audio/AudioManager.ts";
import { setPassAsset } from "../rendering/textureUtils.ts";
import { Pg } from "../input/ZeroGesture.ts";
function px(this: any, e?: any): any {
  if (!e?.uniforms?.uLayerRect) return;
  let t: any = [...fx].sort((e?: any, t?: any): any => t.depth - e.depth),
    n: any = [],
    r: any = [],
    i: any = [],
    a: any = new Float32Array(t.length);
  for (let e: any = 0; e < t.length; e++) {
    let o: any = t[e],
      [s, c, l, u] = o.rect;
    n.push(new Vector4(s / lx, 1 - (c + u) / ux, l / lx, u / ux));
    r.push(
      new Vector2((l * dx.scale * o.scale) / 2, (u * dx.scale * o.scale) / 2),
    );
    i.push(new Vector2(o.pos[0], o.pos[1]));
    a[e] = o.depth;
  }
  e.uniforms.uLayerRect.value = n;
  e.uniforms.uLayerHalfSize.value = r;
  e.uniforms.uLayerCenter.value = i;
  e.uniforms.uLayerDepth.value = a;
}
var mx: any = [
  [0, 1918, 1320, 743],
  [1320, 1918, 1320, 743],
  [2642, 1918, 1320, 743],
];
function hx(this: any, e?: any, t?: any): any {
  !e.godRaysState ||
    !e.fgPass ||
    ((e.godRaysState.atlas = t),
    (e.godRaysState.rects = mx.map(
      ([e, t, n, r]: any): any =>
        new Vector4(e / lx, 1 - (t + r) / ux, n / lx, r / ux),
    )),
    (e.godRaysState.aspects = mx.map(([, , e, t]: any): any => e / t)),
    (e.fgPass.uniforms.uGodRaysTex1.value = t),
    (e.fgPass.uniforms.uGodRaysTex2.value = t),
    (e.fgPass.uniforms.uEnableGodRays.value = 1));
}
var gx: any = 0.07;
function _x(this: any, e?: any): any {
  let t: any = e.bgPass;
  t?.uniforms?.uParallaxOn &&
    ((e._stage1Parallax = {
      tx: 0,
      ty: 0,
      x: 0,
      y: 0,
    }),
    px(t),
    e._stage1ParallaxTexture
      ? ((t.uniforms.uAtlas.value = e._stage1ParallaxTexture),
        hx(e, e._stage1ParallaxTexture))
      : e.assetLoader.ktx2Loader.load(cx, (n?: any): any => {
          if (!e._stage1Parallax) {
            n.dispose();
            return;
          }
          n.colorSpace = SRGBColorSpace;
          e._stage1ParallaxTexture = n;
          t.uniforms.uAtlas.value = n;
          hx(e, n);
        }),
    (t.uniforms.uParallaxAmp.value = gx),
    (t.uniforms.uParallaxSlot.value = 1),
    t.uniforms.uParallax.value.set(0, 0),
    (t.uniforms.uParallaxOn.value = 0),
    (e._stage1ParallaxMove = (t?: any): any => {
      let n: any = e._stage1Parallax;
      n &&
        (e._waitlistOpen ||
          ((n.tx = -((t.clientX / window.innerWidth) * 2 - 1)),
          (n.ty = (t.clientY / window.innerHeight) * 2 - 1)));
    }),
    window.addEventListener(`pointermove`, e._stage1ParallaxMove, {
      passive: !0,
    }));
}
function vx(this: any, e?: any): any {
  e._stage1ParallaxMove &&=
    (window.removeEventListener(`pointermove`, e._stage1ParallaxMove), null);
  let t: any = e.bgPass;
  t?.uniforms?.uParallaxOn &&
    ((t.uniforms.uParallaxOn.value = 0),
    (t.uniforms.uParallaxSlot.value = 0),
    (t.uniforms.uAtlas.value = null));
  e._stage1ParallaxTexture &&= (e._stage1ParallaxTexture.dispose(), null);
  delete e._stage1Parallax;
}
var stageOne: any = {
  id: `stage1`,
  scrollVh: 175,
  autoScroll: !1,
  async enter(this: any, e?: any): Promise<any> {
    if (
      (e.onStage1Entered && e.onStage1Entered(),
      e.scrollManager &&
        (e.scrollManager.setHeld(!0),
        (e._stage1ScrollHeld = !0),
        (e._stage1HoldElapsed = 0)),
      e.assetLoader.loadStageAssets(`stage2`),
      e.assetLoader.loadStageAssets(`worldMap`),
      Ib(),
      e.lensBlurPass)
    ) {
      e.lensBlurPass._forcedOff = !1;
      let t: any = qualityManager.preset;
      e.lensBlurPass.uniforms.uEnabled.value = t.lensBlur.enabled;
      e.lensBlurPass.uniforms.uMaxBlur.value = t.lensBlur.maxBlur;
    }
    e.glassShardPass ||
      ((e.glassShardPass = new GlassShardPass(e.renderer, e._vw, e._vh)),
      e._composer.insertPass(e.glassShardPass, 2));
    await vv();
    e.shatterPass ||
      ((e.shatterPass = new ShatterPass(e.renderer, e._vw, e._vh)),
      e._composer.addPass(e.shatterPass));
    e.ui.setPageTheme(`black`);
    e.ui.showNavbar();
    e._rulerEl &&
      gsap.to(e._rulerEl, {
        opacity: 1,
        duration: 0.6,
        delay: 0.5,
        ease: `power2.out`,
      });
    awardXp(e, `stage1`);
    e._stage1Text1SfxFired = !1;
    e.cameraRig.setEnabled(!0);
    window.addEventListener(`mousemove`, e._onMouseMove);
  },
  scrub(this: any, e?: any, t?: any): any {
    let n: any = e.components;
    if (!n.handsModel) return;
    n.handsModel.scrub(rangeProgress(t, 0.01, 1) * 0.7);
    e._scrollProgress = t;
    !e._stage1Text1SfxFired &&
      t >= 0.02 &&
      ((e._stage1Text1SfxFired = !0), audioManager.play(`hand-entry`));
    let r: any = rangeProgress(t, 0, 0.43);
    if (
      ((n.portalMaterial.uniforms.uBurnProgress.value = r),
      (n.portalMaterial.uniforms.uEmberWidth.value = 0.001 + r * 0.499),
      e.bgPass &&
        (t < 0.5
          ? (n._bgPhase !== 1 &&
              (setPassAsset(
                e.bgPass,
                `A`,
                `stage1Background1`,
                e.assetLoader,
                !0,
              ),
              setPassAsset(
                e.bgPass,
                `B`,
                `stage1Background2`,
                e.assetLoader,
                !0,
              ),
              e.bgPass.uniforms.uParallaxOn &&
                (e.bgPass.uniforms.uParallaxOn.value = 0),
              (n._bgPhase = 1)),
            (e.bgPass.uniforms.uProgress.value = rangeProgress(t, 0.1, 0.5)))
          : (n._bgPhase !== 2 &&
              (setPassAsset(
                e.bgPass,
                `A`,
                `stage1Background2`,
                e.assetLoader,
                !0,
              ),
              e.bgPass.uniforms.uParallaxOn &&
                (e.bgPass.uniforms.uParallaxOn.value = 1),
              (n._bgPhase = 2)),
            (e.bgPass.uniforms.uProgress.value = rangeProgress(t, 0.5, 0.7)))),
      e.fgPass &&
        (e.fgPass.uniforms.uGodRaysOpacity.value =
          rangeProgress(t, 0.3, 1) * 12),
      n.petalParticles)
    ) {
      let e: any = t > 0.25;
      n.petalParticles.group.visible = e;
      e && n.petalParticles.setEntry(rangeProgress(t, 0.25, 0.85));
    }
  },
  update(this: any, e?: any, t?: any, n?: any): any {
    let r: any = e._stage1Parallax;
    if (r && e.bgPass?.uniforms?.uParallax) {
      let t: any = e.cameraRig;
      t?.gyroActive &&
        !e._waitlistOpen &&
        ((r.tx = -t.inputX), (r.ty = -t.inputY));
      let i: any = 1 - Math.exp(-6 * n);
      r.x += (r.tx - r.x) * i;
      r.y += (r.ty - r.y) * i;
      e.bgPass.uniforms.uParallax.value.set(r.x, r.y);
    }
    let i: any = e.components;
    if (!i.handsModel) return;
    e._gateHandProgress != null && i.handsModel.scrub(e._gateHandProgress);
    i.handsModel.update(n);
    i.portalMaterial && (i.portalMaterial.uniforms.uTime.value += n);
    i.coinRing &&
      i.handsModel.ethHandRef &&
      (i.handsModel.ethHandRef.getWorldPosition(e._ethHandWorldPos),
      i.coinRing.handleScroll(e._scrollProgress, e._ethHandWorldPos));
    i.handsModel.cameraRef &&
      (i.handsModel.cameraRef.getWorldPosition(e._tempVec3),
      i.handsModel.cameraRef.getWorldQuaternion(e._tempQuat),
      e.camera.position.lerp(e._tempVec3, Pg.CAMERA_LERP),
      e.camera.quaternion.slerp(e._tempQuat, Pg.CAMERA_LERP));
    let a: any = e._gateZoomT || 0;
    a > 1e-4 &&
      (e._tempVec3.set(0, 0, -1).applyQuaternion(e.camera.quaternion),
      e.camera.position.addScaledVector(e._tempVec3, a * ex));
    e.bgPass?.uniforms?.uZoom && (e.bgPass.uniforms.uZoom.value = 1 - tx * a);
    e.fgPass?.uniforms?.uContrast &&
      (e.fgPass.uniforms.uContrast.value = 1 + nx * a);
    e.fgPass?.uniforms?.uExposure &&
      (e.fgPass.uniforms.uExposure.value = 1 - 1 * a);
    e.fgPass?.uniforms?.uRedTint && (e.fgPass.uniforms.uRedTint.value = rx * a);
    let o: any = e._scrollProgress - e._prevScrollProgress;
    e._prevScrollProgress = e._scrollProgress;
    let s: any = n > 0 ? Math.abs(o) / n : 0;
    e._scrollVelocity = MathUtils.lerp(
      e._scrollVelocity,
      s,
      Pg.SCROLL_VELOCITY_SMOOTHING,
    );
    i.coinRing && i.coinRing.update(n, e._scrollVelocity);
    i.petalParticles &&
      i.petalParticles.group.visible &&
      (i.petalParticles.group.position.copy(e.camera.position),
      e._tempVec3.set(0, 0, -0.7).applyQuaternion(e.camera.quaternion),
      i.petalParticles.group.position.add(e._tempVec3),
      i.petalParticles.update(n));
    i.textLayout && i.textLayout.update(e._scrollProgress, n);
    e._stage1ScrollHeld &&
      ((e._stage1HoldElapsed += n),
      ((i.textLayout && i.textLayout.isFirstTextVisible()) ||
        e._stage1HoldElapsed > 1) &&
        ((e._stage1ScrollHeld = !1),
        e.scrollManager && e.scrollManager.setHeld(!1)));
    e.cameraRig.update(n);
    i.glassShards && i.glassShards.update();
  },
  resize(this: any, e?: any, t?: any, n?: any): any {
    e.components.textLayout && e.components.textLayout.resize(t, n);
  },
  holdTrigger: {
    showAt: 0.95,
    hideAt: 0.9,
    endHintText: `TAP
HOLD`,
    onHoldStart: (e?: any): any => {
      e && (ix(e), ax(e));
      audioManager.play(`stage2-ambient`, {
        fadeIn: 0,
        volume: 0,
      });
    },
    onHoldProgress: (e?: any, t?: any): any => {
      let n: any = audioManager.getTrackOption(`stage1-ambient`, `volume`) ?? 1,
        r: any = audioManager.getTrackOption(`stage2-ambient`, `volume`) ?? 1;
      audioManager.setLevel(`stage1-ambient`, {
        volume: (1 - t) * n,
      });
      audioManager.setLevel(`stage2-ambient`, {
        volume: t * r,
      });
    },
    onHoldCancel: (e?: any): any => {
      e && ox(e);
      let t: any = audioManager.getTrackOption(`stage1-ambient`, `volume`) ?? 1;
      audioManager.play(`stage1-ambient`, {
        fadeIn: 0.3,
        volume: t,
      });
      audioManager.stop(`stage2-ambient`, {
        fadeOut: 0.3,
      });
    },
  },
  teardown(this: any, e?: any): any {
    let t: any = e.components;
    e._stage1ScrollHeld &&
      ((e._stage1ScrollHeld = !1),
      e.scrollManager && e.scrollManager.setHeld(!1));
    vx(e);
    t.handsModel &&
      (t.handsModel.dispose(), e.scene.remove(t.handsModel.group));
    t.coinRing && (t.coinRing.dispose(), e.scene.remove(t.coinRing.group));
    t.petalParticles &&
      (t.petalParticles.dispose(), e.scene.remove(t.petalParticles.group));
    t.portalPlane &&
      (t.portalPlane.geometry.dispose(),
      t.portalPlane.material.dispose(),
      e.scene.remove(t.portalPlane));
    t.textLayout && t.textLayout.dispose();
    e.fgPass &&
      ((e.fgPass.uniforms.uEnableGodRays.value = 0),
      (e.fgPass.uniforms.uGodRaysOpacity.value = 0));
    e.godRaysState &&
      ((e.godRaysState.atlas = null),
      (e.godRaysState.rects = null),
      (e.godRaysState.aspects = null));
    let n: any = [
      `stage1Background1`,
      `stage1Background2`,
      `stage1Foreground1`,
      `coinAtlas`,
      `petalAtlas`,
    ];
    e._preserveStage1Atlas || n.push(`stage1Atlas`);
    e.assetLoader.disposeTextures(n);
    window.removeEventListener(`mousemove`, e._onMouseMove);
    e.cameraRig.setEnabled(!1);
    e.components = {};
  },
};
export { px, mx, hx, gx, _x, vx, stageOne };
