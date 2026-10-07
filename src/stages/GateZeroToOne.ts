// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { HandsModel } from "../models/HandsModel.ts";
import { gy, CoinRing } from "../models/CoinRing.ts";
import { PetalParticles } from "../models/PetalParticles.ts";
import { createBurnMaterial } from "../rendering/BurnMaterial.ts";
import { Mesh, CircleGeometry } from "three";
import { setPassAsset, setAtlasTexture } from "../rendering/textureUtils.ts";
import { _x } from "./StageOne.ts";
import { TextSprites } from "../components/TextSprites.ts";
import { atlasUv, atlasAspect } from "../rendering/TextMaterial.ts";
import { rangeProgress } from "./shared.ts";
import { gsap } from "gsap";
function bx(this: any, e?: any): any {
  let { scene: t, assetLoader: n, textScene: r } = e,
    i: any = e.preWarmed?.handsModel || new HandsModel(n);
  t.add(i.group);
  i.group.visible = !0;
  i.group.position.set(0, 0, 0);
  i.group.rotation.set(0, 0, 0);
  i.group.scale.set(1, 1, 1);
  i.scrub(0);
  i.update(0);
  i.cameraRef &&
    (i.cameraRef.updateWorldMatrix(!0, !1),
    i.cameraRef.getWorldPosition(e._tempVec3),
    i.cameraRef.getWorldQuaternion(e._tempQuat),
    e.camera.position.copy(e._tempVec3),
    e.camera.quaternion.copy(e._tempQuat));
  let a: any = gy(n.getAsset(`spcAtlas`)),
    o: any = e.preWarmed?.coinRing || new CoinRing(a);
  t.add(o.group);
  let s: any = e.preWarmed?.petalParticles || null;
  if (!s) {
    let e: any = n.getAsset(`spcAtlas`);
    e && (s = new PetalParticles(e));
  }
  s && ((s.group.visible = !1), t.add(s.group));
  let c: any =
    e.preWarmed?.portalMaterial ||
    createBurnMaterial(null, {
      direction: `in2out`,
      emberColor: [0.651, 1, 0.835],
      emberTip: [1, 1, 1],
      charColor: [0.525, 1, 0.706],
      seed: 0,
      burnDelay: 0,
      burnSpeed: 1,
    });
  e.preWarmed?.portalMaterial || (c.uniforms.uTexture.value = e.whiteTex);
  e.preWarmed &&
    ((e.preWarmed.handsModel = null),
    (e.preWarmed.coinRing = null),
    (e.preWarmed.petalParticles = null),
    (e.preWarmed.portalMaterial = null));
  let l: any = new Mesh(new CircleGeometry(0.5, 64), c);
  l.position.set(0.5643, 0.947, 0.4);
  l.rotation.y = Math.PI / 2;
  l.scale.set(1.5, 1.5, 1.5);
  t.add(l);
  e.fgPass && (e.fgPass.uniforms.uGodRaysOpacity.value = 0);
  e.bgPass &&
    (setPassAsset(e.bgPass, `A`, `stage1Background1`, n, !0),
    setPassAsset(e.bgPass, `B`, `stage1Background2`, n, !0),
    (e.bgPass.uniforms.uProgress.value = 0));
  _x(e);
  let u: any = null,
    d: any = n.getAsset(`textsAtlas`);
  d &&
    e.renderer &&
    ((d.anisotropy = e.renderer.capabilities.getMaxAnisotropy()),
    (d.needsUpdate = !0));
  d &&
    ((u = new TextSprites(r, [
      {
        texture: d,
        atlasUV: atlasUv(0, 0, 775.26, 371.64),
        aspect: atlasAspect(775.26, 371.64),
        baseScale: 0.4,
        anchor: `center-center`,
        appearAt: 0,
        disappearAt: 0.02,
      },
      {
        texture: d,
        atlasUV: atlasUv(1703.34, 0, 557.46, 341.94, !0),
        aspect: atlasAspect(557.46, 341.94),
        rotate: !0,
        baseScale: 0.25,
        anchor: `top-left`,
        appearAt: 0.2,
        disappearAt: 0.6,
      },
      {
        texture: d,
        atlasUV: atlasUv(0, 558.45, 257.05, 185.82),
        aspect: atlasAspect(257.05, 185.82),
        baseScale: 0.17,
        anchor: `bottom-right`,
        appearAt: 0.3,
        disappearAt: 0.6,
      },
      {
        texture: d,
        atlasUV: atlasUv(1388.64, 0, 557.46, 314.15, !0),
        aspect: atlasAspect(557.46, 314.15),
        rotate: !0,
        baseScale: 0.175,
        anchor: `center-center`,
        appearAt: 0.6,
        disappearAt: 0.95,
      },
    ])),
    u.resize(e._vw, e._vh));
  e.components = {
    handsModel: i,
    coinRing: o,
    petalParticles: s,
    portalMaterial: c,
    portalPlane: l,
    _bgPhase: 1,
    textLayout: u,
  };
}
var xx: any = 1;
var gateZeroToOne: any = {
  id: `gate0to1`,
  scrollVh: 50,
  autoScroll: !0,
  autoScrollDuration: 3.5,
  enter(this: any, e?: any): any {
    e.frostingPass && e.frostingPass.startSpread(3.5);
    e._fgIntroActive = !0;
  },
  scrub(this: any, e?: any, t?: any): any {
    e.bgPass && (e.bgPass.uniforms.uProgress.value = rangeProgress(t, 0, 0.67));
    e.frostingPass &&
      (e.frostingPass.material.uniforms.uWhiteout.value = rangeProgress(
        t,
        0.83,
        1,
      ));
    e.fgPass &&
      e._fgIntroActive &&
      (e.fgPass.uniforms.uProgress.value = rangeProgress(t, 0.5, 1));
    t > 0.85 &&
      !e._trailWhiteKilled &&
      ((e._trailWhiteKilled = !0),
      e.frostingPass &&
        gsap.killTweensOf(e.frostingPass.material.uniforms.uTrailWhite));
  },
  teardown(this: any, e?: any): any {
    e.frostingPass &&
      (e.frostingPass.stopSpread(),
      (e.frostingPass.active = !1),
      (e.frostingPass.material.uniforms.uWhiteout.value = 0),
      (e.frostingPass.material.uniforms.uTrailWhite.value = 0),
      (e.frostingPass.material.uniforms.uMelt.value = 0),
      (e.frostingPass.material.uniforms.uCenterWhite.value = 0));
    e.removeStage0Listeners && e.removeStage0Listeners();
    bx(e);
    e.fgPass &&
      (setAtlasTexture(e.fgPass, `B`, `A`, !1),
      setPassAsset(e.fgPass, `B`, `stage1Foreground1`, e.assetLoader, !1),
      (e.fgPass.uniforms.uProgress.value = 0),
      gsap.to(e.fgPass.uniforms.uProgress, {
        value: 1,
        duration: 1,
        delay: xx,
        ease: `power2.inOut`,
        onComplete: (): any => {
          setAtlasTexture(e.fgPass, `B`, `A`, !1);
          e.fgPass.uniforms.uProgress.value = 0;
          e._fgIntroActive = !1;
        },
      }));
  },
};
export { bx, xx, gateZeroToOne };
