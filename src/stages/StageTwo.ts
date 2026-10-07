// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { audioManager } from "../audio/AudioManager.ts";
import { awardXp, rangeProgress, disposeStageVideo } from "./shared.ts";
import { setPassAsset, setPassTexture } from "../rendering/textureUtils.ts";
import { Pg } from "../input/ZeroGesture.ts";
var stageTwo: any = {
  id: `stage2`,
  scrollVh: 250,
  autoScroll: !1,
  advanceAtEnd: !0,
  advanceThreshold: 0.99,
  enter(this: any, e?: any): any {
    e.assetLoader.loadStageAssets(`stage3`);
    audioManager.play(`stage2-ambient`);
    e.ui.setPageTheme(`white`);
    e.cameraRig.setEnabled(!0);
    e._gateZoomT = 0;
    e.fgPass?.uniforms &&
      ((e.fgPass.uniforms.uContrast.value = 1),
      (e.fgPass.uniforms.uExposure.value = 1),
      (e.fgPass.uniforms.uRedTint.value = 0));
    e.bgPass?.uniforms?.uZoom && (e.bgPass.uniforms.uZoom.value = 1);
    e._scrollProgress = 0;
    e._smoothedHandProgress = void 0;
    awardXp(e, `stage2`);
    window.addEventListener(`mousemove`, e._onMouseMove);
  },
  scrub(this: any, e?: any, t?: any): any {
    let n: any = e.components;
    if (!n.handsModel) return;
    let r: any = e._gateHandProgress || 0,
      i: any = r + t * (1 - r) * 0.9;
    if (
      (e._smoothedHandProgress === void 0 && (e._smoothedHandProgress = i),
      (e._smoothedHandProgress += (i - e._smoothedHandProgress) * 0.15),
      n.handsModel.scrub(e._smoothedHandProgress),
      (e._scrollProgress = t),
      n.glassShards && n.glassShards.handleScroll(t),
      t >= 0.85)
    ) {
      let r: any = rangeProgress(t, 0.85, 1);
      e.cameraRig.influence = 1 - r;
      e._stage2BgTransitionSet ||=
        (setPassAsset(e.bgPass, `B`, `stage2Background2`, e.assetLoader, !0, 8),
        !0);
      e.bgPass.uniforms.uProgress.value = rangeProgress(t, 0.93, 1);
      n.handsModel?.group &&
        n.handsModel.group.traverse((e?: any): any => {
          e.isMesh &&
            e.material &&
            ((e.material.transparent = !0), (e.material.opacity = 1 - r));
        });
    } else {
      e.cameraRig.influence = 1;
      e._stage2BgTransitionSet && (e.bgPass.uniforms.uProgress.value = 0);
      let t: any = n.handsModel.handMaterial;
      t?._mapMixUniforms && (t._mapMixUniforms.uMapMix.value = 0);
      n.handsModel?.group &&
        n.handsModel.group.traverse((e?: any): any => {
          e.isMesh && e.material && (e.material.opacity = 1);
        });
    }
  },
  update(this: any, e?: any, t?: any, n?: any): any {
    let r: any = e.components;
    r.handsModel &&
      (r.handsModel.update(n),
      r.handsModel.cameraRef &&
        (r.handsModel.cameraRef.getWorldPosition(e._tempVec3),
        r.handsModel.cameraRef.getWorldQuaternion(e._tempQuat),
        e.camera.position.lerp(e._tempVec3, Pg.CAMERA_LERP),
        e.camera.quaternion.slerp(e._tempQuat, Pg.CAMERA_LERP)),
      r.textLayout && r.textLayout.update(e._scrollProgress, n),
      e.cameraRig.update(n),
      r.glassShards && r.glassShards.update());
  },
  resize(this: any, e?: any, t?: any, n?: any): any {
    e.components.textLayout && e.components.textLayout.resize(t, n);
  },
  teardown(this: any, e?: any): any {
    e.bgPass && e.whiteTex && setPassTexture(e.bgPass, `A`, e.whiteTex, !0, !0);
    e._stage2Video &&= (disposeStageVideo(e._stage2Video), null);
    e._stage2VideoTex &&= (e._stage2VideoTex.dispose(), null);
    e.bgPass && (e.bgPass.uniforms.uLinearizeA.value = 0);
    let t: any = e.components;
    t.handsModel &&
      (t.handsModel.dispose(), e.scene.remove(t.handsModel.group));
    t.glassShards &&
      (e.glassShardPass && e.glassShardPass.clearShards(),
      e.camera.remove(t.glassShards.group),
      e.preWarmed && (e.preWarmed.glassShards = t.glassShards));
    t.textLayout && t.textLayout.dispose();
    e._stage2BgTransitionSet = !1;
    e.assetLoader.disposeTextures([
      `stage2Foreground`,
      `stage2Background2`,
      `handMatcap`,
      `stage2Atlas`,
    ]);
    e.components = {};
  },
};
export { stageTwo };
