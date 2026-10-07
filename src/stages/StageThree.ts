import { Z } from "../config/tunnel.ts";
import { Wx } from "../config/tunnel.ts";
import { Ux } from "../config/tunnel.ts";
import { Hx } from "../config/tunnel.ts";
import { Vx } from "../config/tunnel.ts";
// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import {
  Vector3,
  DataTexture,
  RGBAFormat,
  UnsignedByteType,
  SRGBColorSpace,
  LinearFilter,
  ClampToEdgeWrapping,
  PlaneGeometry,
  Mesh,
  CircleGeometry,
  MeshBasicMaterial,
  Quaternion,
  Euler,
} from "three";
import { awardXp, loadBitmapTexture, vv, rangeProgress } from "./shared.ts";
import { qualityManager } from "../rendering/QualityManager.ts";
import { createBurnMaterial } from "../rendering/BurnMaterial.ts";
import { iS, nS, rS, uS, tS, aS, lS } from "./GateThreeToFour.ts";
import { setPassAsset, setPassTexture } from "../rendering/textureUtils.ts";
import { atlasUv, atlasAspect } from "../rendering/TextMaterial.ts";
import { TextSprites } from "../components/TextSprites.ts";
import { audioManager } from "../audio/AudioManager.ts";
import { gsap } from "gsap";
import { Ix, Cx, Ex } from "../rendering/TunnelMaterials.ts";
var Lx: any = [
  {
    position: [0.022, 0, 0],
    rotation: [0, 0, 0],
    scale: 1,
    burnStart: 0.3,
    burnEnd: 1.5,
  },
  {
    position: [0.2, 0.05, -0.3],
    rotation: [15, -25, 35],
    scale: 0.8,
    burnStart: 0.15,
    burnEnd: 0.9,
  },
  {
    position: [-0.2, -0.15, -0.15],
    rotation: [-20, 45, -60],
    scale: 0.9,
    burnStart: 0.25,
    burnEnd: 1.25,
  },
  {
    position: [0.1, 0.1, 0.15],
    rotation: [25, -45, -40],
    scale: 1,
    burnStart: 0.1,
    burnEnd: 1.3,
  },
  {
    position: [0.05, -0.07, 0.6],
    rotation: [-15, 20, 30],
    scale: 0.85,
    burnStart: 0.2,
    burnEnd: 1.5,
  },
  {
    position: [-0.05, 0.3, -0.3],
    rotation: [-15, 20, 30],
    scale: 0.85,
    burnStart: 0.2,
    burnEnd: 1.5,
  },
  {
    position: [0.4, -0.2, -0.1],
    rotation: [30, -40, 20],
    scale: 0.75,
    burnStart: 0.35,
    burnEnd: 1.2,
  },
  {
    position: [-0.35, 0.25, -0.15],
    rotation: [-25, 35, -45],
    scale: 0.7,
    burnStart: 0.4,
    burnEnd: 1.3,
  },
  {
    position: [0.15, -0.3, -0.2],
    rotation: [40, -20, 55],
    scale: 0.65,
    burnStart: 0.45,
    burnEnd: 1.4,
  },
  {
    position: [-0.25, 0.15, -0.25],
    rotation: [-35, 50, -30],
    scale: 0.72,
    burnStart: 0.38,
    burnEnd: 1.25,
  },
];
var Rx: any = new Vector3(0, 0, 0.19);
var zx: any = new Vector3(0, 0, 2);
var Bx: any = 90;
var Gx: any = 0.02;
var Kx: any = new Vector3(-0.022, 0, 0.01);
var qx: any = {
  x: 0,
  y: 0,
  z: 0,
};
var Jx: any = {
  x: 0,
  y: 0,
  z: 90,
};
var Yx: any = {
  x: 180,
  y: 0,
  z: 90,
};
var stageThree: any = {
  id: `stage3`,
  scrollVh: 325,
  autoScroll: !1,
  deferPreviousTeardown: !0,
  async enter(this: any, e?: any): Promise<any> {
    if (
      (e.assetLoader.loadStageAssets(`stage4`),
      awardXp(e, `stage3`),
      (e._stage3BlurBase = 0),
      e.lensBlurPass)
    ) {
      let t: any = e.lensBlurPass.uniforms.uMaxBlur.value;
      e._stage3BlurBase = t > 0.01 ? t : qualityManager.preset.lensBlur.maxBlur;
    }
    let t: any = loadBitmapTexture(`assets/textures/stage3_money-hand.webp`, {
      assetLoader: e.assetLoader,
    });
    if (
      ((e._pendingTeardown &&= (e._pendingTeardown(), null)),
      !e._stage3Background2)
    ) {
      let t: any =
          (e.bgPass && e.bgPass.uniforms.uViewportAspect.value) ||
          e._vw / e._vh ||
          16 / 9,
        n: any = new Uint8Array(256 * 256 * 4),
        r: any = [134, 163, 144],
        i: any = [68, 102, 82],
        a: any = [34, 52, 42];
      for (let e: any = 0; e < 256; e++) {
        let o: any = e / 255 - 1;
        for (let s: any = 0; s < 256; s++) {
          let c: any = (s / 255 - 0.5) * t,
            l: any = Math.sqrt(c * c + o * o),
            u: any = l > 1 ? 1 : l,
            d: any,
            f: any,
            p: any;
          if (u < 0.5) {
            let e: any = u / 0.5;
            d = r[0] + (i[0] - r[0]) * e;
            f = r[1] + (i[1] - r[1]) * e;
            p = r[2] + (i[2] - r[2]) * e;
          } else {
            let e: any = (u - 0.5) / 0.5;
            d = i[0] + (a[0] - i[0]) * e;
            f = i[1] + (a[1] - i[1]) * e;
            p = i[2] + (a[2] - i[2]) * e;
          }
          let m: any = (e * 256 + s) * 4;
          n[m + 0] = d | 0;
          n[m + 1] = f | 0;
          n[m + 2] = p | 0;
          n[m + 3] = 255;
        }
      }
      let o: any = new DataTexture(n, 256, 256, RGBAFormat, UnsignedByteType);
      o.colorSpace = SRGBColorSpace;
      o.minFilter = LinearFilter;
      o.magFilter = LinearFilter;
      o.wrapS = ClampToEdgeWrapping;
      o.wrapT = ClampToEdgeWrapping;
      o.generateMipmaps = !1;
      o.needsUpdate = !0;
      e.renderer && e.renderer.initTexture(o);
      e._stage3Background2 = o;
    }
    let n: any = e.assetLoader.getAsset(`moneyShredsAtlas`),
      r: any = 2048,
      i: any = {
        offset: [1474 / r, 1 - 1284 / r],
        scale: [574 / r, 1284 / r],
      },
      a: any = new PlaneGeometry(0.345, 0.15, 16, 8),
      o: any = Math.PI / 180,
      s: any = [],
      c: any = [];
    for (let t: any = 0; t < Lx.length; t++) {
      let r: any = Lx[t],
        l: any = createBurnMaterial(n, {
          direction: `out2in`,
          aspect: 2.3,
          seed: t * 0.33,
          burnDelay: 0,
          burnSpeed: 1,
          texOffset: i.offset,
          texScale: i.scale,
          texRotate: 1,
        }),
        u: any = new Mesh(a, l);
      u.position.set(...r.position);
      u.rotation.set(r.rotation[0] * o, r.rotation[1] * o, r.rotation[2] * o);
      u.scale.setScalar(r.scale);
      u.frustumCulled = !1;
      u.userData.initRot = {
        x: r.rotation[0] * o,
        y: r.rotation[1] * o,
        z: r.rotation[2] * o,
      };
      u.userData.rotSeed = Math.random();
      e.scene.add(u);
      c.push(u);
      t === 0
        ? (l.uniforms.uWaveAmp.value = 0)
        : (l.uniforms.uWaveAmp.value = 0.015);
      s.push(l);
    }
    await vv();
    let l: any = new CircleGeometry(0.06, 64),
      u: any = l.attributes.uv;
    for (let e: any = 0; e < u.count; e++) {
      let t: any = u.getX(e),
        n: any = u.getY(e);
      n = (n - 0.5) * 1.2 + 0.5;
      u.setXY(e, t, n);
    }
    u.needsUpdate = !0;
    let d: any = new MeshBasicMaterial({
        map: t,
        side: 2,
        depthWrite: !0,
        depthTest: !0,
      }),
      f: any = new Mesh(l, d),
      m: any = Lx[0];
    f.position.set(...m.position);
    f.position.add(Kx);
    f.rotation.set(m.rotation[0] * o, m.rotation[1] * o, m.rotation[2] * o);
    f.scale.set(0.88, 1.05, 1);
    e.scene.add(f);
    e.components = {
      ...e.components,
      billPlanes: c,
      billMaterials: s,
      billGeo: a,
      portalCircle: f,
      portalCircleGeo: l,
      portalMat: d,
      portalTex: t,
    };
    iS(e);
    e.bgPass &&
      (setPassAsset(e.bgPass, `A`, `stage3Background1`, e.assetLoader, !0),
      e._stage3Background2 &&
        (setPassTexture(e.bgPass, `B`, e._stage3Background2, !0, !0),
        (e.bgPass.uniforms.uLinearizeB.value = 1)),
      (e.bgPass.uniforms.uProgress.value = 0),
      (e.bgPass.uniforms.uOpacity.value = 1),
      e.bgPass.uniforms.uBgParallaxAmp &&
        ((e.bgPass.uniforms.uBgParallaxAmp.value = Gx),
        e.bgPass.uniforms.uBgParallax.value.set(0, 0)));
    let h: any = e.assetLoader.getAsset(`textsAtlas`);
    if (h) {
      e.renderer && (h.anisotropy = e.renderer.capabilities.getMaxAnisotropy());
      let t: any = [
          {
            texture: h,
            atlasUV: atlasUv(0, 371.64, 365.21, 186.82),
            aspect: atlasAspect(365.21, 186.82),
            baseScale: 0.25,
            anchor: `bottom-left`,
            appearAt: 0.05,
            disappearAt: 0.3,
          },
          {
            texture: h,
            atlasUV: atlasUv(505.51, 604.41, 594.62, 355.65),
            aspect: atlasAspect(594.62, 355.65),
            baseScale: 0.4,
            anchor: `center-center`,
            appearAt: 0.3,
            disappearAt: 0.4,
          },
          {
            texture: h,
            atlasUV: atlasUv(363.64, 371.64, 337.74, 186.82),
            aspect: atlasAspect(337.74, 186.82),
            baseScale: 0.25,
            anchor: `top-left`,
            appearAt: 0.4,
            disappearAt: 0.6,
          },
          {
            texture: h,
            atlasUV: atlasUv(0, 1023, 482.83, 168.84),
            aspect: atlasAspect(482.83, 168.84),
            baseScale: 0.25,
            anchor: `bottom-right`,
            appearAt: 0.5,
            disappearAt: 0.6,
          },
          {
            texture: h,
            atlasUV: atlasUv(0, 744.27, 472.68, 278.73),
            aspect: atlasAspect(472.68, 278.73),
            baseScale: 0.25,
            anchor: `center-center`,
            appearAt: 0.6,
            disappearAt: 0.7,
          },
          {
            texture: h,
            atlasUV: atlasUv(775.24, 0, 521.92, 325.68),
            aspect: atlasAspect(521.92, 325.68),
            baseScale: 0.38,
            anchor: `center-center`,
            appearAt: 0.7,
            disappearAt: 0.8,
          },
          {
            texture: h,
            atlasUV: atlasUv(771, 1542, 667, 221),
            aspect: atlasAspect(667, 221),
            baseScale: 0.38,
            anchor: `center-center`,
            appearAt: 0.8,
            disappearAt: 0.87,
          },
          {
            texture: h,
            atlasUV: atlasUv(700.32, 371.64, 331.52, 232.77),
            aspect: atlasAspect(331.52, 232.77),
            baseScale: 0.25,
            anchor: `top-left`,
            appearAt: 0.87,
            disappearAt: 0.99,
          },
          {
            texture: h,
            atlasUV: atlasUv(1030.99, 325.68, 334.61, 232.77),
            aspect: atlasAspect(334.61, 232.77),
            baseScale: 0.25,
            anchor: `bottom-right`,
            appearAt: 0.93,
            disappearAt: 0.99,
          },
        ],
        n: any = new TextSprites(e.textScene, t);
      n.resize(e._vw, e._vh);
      e.components.textLayout = n;
    }
    let g: any = Math.PI / 180;
    e._stage3QuatA = new Quaternion().setFromEuler(
      new Euler(Jx.x * g, Jx.y * g, Jx.z * g),
    );
    e._stage3QuatB = new Quaternion().setFromEuler(
      new Euler((Jx.x + Yx.x) * g, (Jx.y + Yx.y) * g, (Jx.z + Yx.z) * g),
    );
    e.camera.position.copy(Rx);
    e.camera.quaternion.identity();
    e.cameraRig.setEnabled(!0);
    e.cameraRig.influence = 0;
    window.addEventListener(`mousemove`, e._onMouseMove);
    stageThree.scrub(e, 0);
  },
  scrub(this: any, e?: any, t?: any): any {
    e._scrollProgress = t;
    e.cameraRig.influence = rangeProgress(t, 0, 0.05) * 0.3;
    e.bgPass.uniforms.uProgress.value = rangeProgress(t, 0.175, 0.35);
    e.bgPass.uniforms.uOpacity.value = 1;
    t > 0.15 &&
      !e._stage3DeferredStarted &&
      ((e._stage3DeferredStarted = !0),
      (async (): Promise<any> => {
        let t: any = e.renderer,
          n: any =
            t && t.compileAsync
              ? (): any => t.compileAsync(e.scene, e.camera)
              : t && t.compile
                ? (): any => {
                    t.compile(e.scene, e.camera);
                  }
                : (): any => {};
        eS(e);
        await n();
        await vv();
        nS(e);
        await n();
        await vv();
        rS(e);
        uS(e);
        await n();
      })());
    let n: any = e.components;
    if (n.billPlanes) {
      let e: any = t < 0.4;
      for (let t of n.billPlanes) t.visible = e;
    }
    if (n.emberMat) {
      let e: any = rangeProgress(t, 0, 0.05),
        r: any = 1 - rangeProgress(t, 0.2, 0.35);
      n.emberMat.uniforms.uOpacity.value = Math.min(e, r);
      n.emberPoints && (n.emberPoints.visible = t < 0.35);
    }
    let r: any = Math.min(t / 0.35, 1);
    e.camera.position.lerpVectors(Rx, zx, r);
    let i: any = Math.PI / 180;
    if (
      (t <= 0.35 &&
        (e.camera.rotation.set(
          (qx.x + (Jx.x - qx.x) * r) * i,
          (qx.y + (Jx.y - qx.y) * r) * i,
          (qx.z + (Jx.z - qx.z) * r) * i,
        ),
        (e._stage3CamBaseZ = void 0)),
      n.portalMat &&
        ((n.portalMat.opacity = 1 - rangeProgress(t, 0, 0.056)),
        (n.portalMat.transparent = !0)),
      n.billPlanes)
    ) {
      e._billBurnAudioIds ||= Array(n.billPlanes.length).fill(null);
      for (let t: any = 0; t < n.billPlanes.length; t++) {
        let i: any = n.billPlanes[t],
          a: any = Lx[t],
          o: any = rangeProgress(r, a.burnStart, a.burnEnd);
        n.billMaterials[t].uniforms.uBurnProgress.value = o;
        let s: any = !(o >= 0.95 || r >= 1) && o > 0.001,
          c: any = e._billBurnAudioIds[t];
        if (s) {
          if (
            (c ??
              (e._billBurnAudioIds[t] = audioManager.playInstance(
                `money-burn`,
                {
                  volume: 0,
                  fadeIn: 0,
                },
              )),
            e._billBurnAudioIds[t] != null)
          ) {
            let n: any = 4 * o * (1 - o);
            audioManager.setInstanceLevel(
              `money-burn`,
              e._billBurnAudioIds[t],
              {
                volume: 0.05 * n,
              },
            );
          }
        } else
          c != null &&
            (audioManager.stopInstance(`money-burn`, c),
            (e._billBurnAudioIds[t] = null));
        t === 0 &&
          (n.billMaterials[t].uniforms.uWaveAmp.value =
            rangeProgress(r, 0.2, 0.4) * 0.015);
        let l: any = a.position[2],
          u: any = 0.3 + i.userData.rotSeed * 0.7;
        i.position.z = l + r * u;
        let d: any = i.userData.rotSeed,
          f: any = i.userData.initRot,
          p: any = r * 1.5,
          m: any = f.x + Math.sin(d * 6.283 + r * 3) * p,
          h: any = f.y + Math.cos(d * 4.1 + r * 2.5) * p,
          g: any = f.z + Math.sin(d * 3.7 + r * 4) * p * 0.5;
        i.rotation.set(m, h, g);
        t === 0 &&
          n.portalCircle &&
          ((n.portalCircle.position.x = i.position.x + Kx.x),
          (n.portalCircle.position.y = i.position.y + Kx.y),
          (n.portalCircle.position.z = i.position.z + Kx.z),
          n.portalCircle.rotation.set(m, h, g));
      }
    }
    let a: any = t > 0.35 ? rangeProgress(t, 0.35, 1) : 0,
      o: any = a * Bx * 0.75;
    e._stage3P = t;
    let s: any = rangeProgress(t, 0.2, 0.95),
      c: any = s < 0.5 ? 4 * s * s * s : 1 - (-2 * s + 2) ** 3 / 2;
    if (n.certMeshes && n.certSpreadPositions) {
      n.certConvergeRotOffsets ||= [];
      for (let e: any = 0; e < n.certMeshes.length; e++) {
        let t: any = n.certMeshes[e],
          r: any = n.certSpreadPositions[e],
          i: any = n.certTunnelPositions[e];
        t.position.x = r[0] + (i.position[0] - r[0]) * c;
        t.position.y = r[1] + (i.position[1] - r[1]) * c;
        t.position.z = r[2] + (i.position[2] - r[2]) * c + o;
        let a: any = n.certSeeds[e],
          s: any = c * 2;
        n.certConvergeRotOffsets[e] = [
          Math.sin(a * 6.283 + c * 4) * s,
          Math.cos(a * 4.1 + c * 3.5) * s,
          Math.sin(a * 3.7 + c * 5) * s * 0.6,
        ];
      }
    }
    if (t > 0.35) {
      let r: any = rangeProgress(t, 0.35, 0.385),
        i: any = r < 0.5 ? 2 * r * r : 1 - (-2 * r + 2) ** 2 / 2;
      e.camera.quaternion.slerpQuaternions(e._stage3QuatA, e._stage3QuatB, i);
      t < 0.9 &&
        (e._stage3HoldZoomT || 0) > 0 &&
        (gsap.killTweensOf(e, `_stage3HoldZoomT`), (e._stage3HoldZoomT = 0));
      e._stage3CamBaseZ = zx.z + a * Bx;
      let s: any = (e._stage3HoldZoomT || 0) * Vx;
      if (((e.camera.position.z = e._stage3CamBaseZ - s), n.shredMeshes))
        for (let e: any = 0; e < n.shredMeshes.length; e++)
          n.shredMeshes[e].position.z = tS[e].position[2] + o;
      if (
        (n.tunnelGroup && (n.tunnelGroup.position.z = aS + o),
        n.tunnelLight && n.tunnelGroup)
      ) {
        let t: any = e.camera.position.z - n.tunnelGroup.position.z;
        n.tunnelLight.position.z = t + Z.nearLightAhead;
      }
      let c: any = +(t >= 0.85);
      if (n.tunnelMaterials) for (let e of n.tunnelMaterials) e.opacity = c;
      n.tunnelLight && (n.tunnelLight.intensity = Z.nearLightIntensity * c);
      e.lensBlurPass &&
        e._stage3BlurBase !== void 0 &&
        (e.lensBlurPass.uniforms.uMaxBlur.value = e._stage3BlurBase * (1 - c));
      let l: any = c,
        u: any = c;
      n.tunnelPlane &&
        ((n.tunnelPlane.visible = l > 0.001),
        (n.tunnelPlane.material.opacity = l * 0.99));
      n.tunnelCircle &&
        ((n.tunnelCircle.visible = l > 0.001),
        (n.tunnelCircle.material.opacity = l));
      n.tunnelPulseUniforms &&
        ((n.tunnelPulseUniforms.uPlaneGlowZ.value =
          e.camera.position.z + Z.planeGlowAhead),
        (n.tunnelPulseUniforms.uPlaneGlowStrength.value =
          u * Z.planeGlowStrength),
        (n.tunnelPulseUniforms.uPlaneGlowWidth.value = Z.planeGlowWidth));
      let d: any = rangeProgress(t, 0.385, 0.455);
      if (n.certMaterials)
        for (let e of n.certMaterials) e.uniforms.uOpacity.value = d;
      if (n.shredMaterials)
        for (let e of n.shredMaterials) e.uniforms.uOpacity.value = d;
      if (
        (n.dustMat &&
          ((n.dustMat.uniforms.uOpacity.value = d),
          (n.dustMat.uniforms.uZOffset.value = o)),
        e.bgPass)
      ) {
        e.bgPass.uniforms.uProgress.value = 1;
        let n: any = 1 - rangeProgress(t, 0.55, 0.7);
        e.bgPass.uniforms.uOpacity.value = n;
      }
      if (n.certMaterials) {
        let e: any = rangeProgress(t, 0.45, 0.9) * 2.5;
        for (let t of n.certMaterials) t.uniforms.uShredProgress.value = e;
      }
    }
  },
  update(this: any, e?: any, t?: any, n?: any): any {
    e.cameraRig.update(n);
    e.bgPass &&
      e.bgPass.uniforms.uBgParallaxAmp?.value > 0 &&
      e.bgPass.uniforms.uBgParallax.value.set(
        e.cameraRig.cursorX,
        e.cameraRig.cursorY,
      );
    let r: any = e.components;
    if (e._stage3CamBaseZ !== void 0) {
      let t: any = (e._stage3HoldZoomT || 0) * Vx;
      if (((e.camera.position.z = e._stage3CamBaseZ - t), r.tunnelGroup)) {
        if (r.tunnelLight) {
          let t: any = e.camera.position.z - r.tunnelGroup.position.z;
          r.tunnelLight.position.z = t + Z.nearLightAhead;
        }
        Ix(e);
        r.tunnelPulseUniforms &&
          (r.tunnelPulseUniforms.uPlaneGlowZ.value =
            e.camera.position.z + Z.planeGlowAhead);
      }
    }
    if (r.billMaterials)
      for (let e of r.billMaterials) e.uniforms.uTime.value += n;
    if (
      (lS(e, n, e._stage3HoldZoomT || 0),
      r.textLayout && r.textLayout.update(e._scrollProgress, n),
      r.certMeshes)
    )
      for (let e: any = 0; e < r.certMeshes.length; e++) {
        let i: any = r.certMeshes[e],
          a: any = r.certMaterials[e];
        a.uniforms.uTime.value += n;
        let o: any = r.certSeeds[e],
          s: any = r.certBaseRotations[e],
          c: any = (o * 2 - 1) * 0.15,
          l: any = (((o * 3.7) % 1) * 2 - 1) * 0.15,
          u: any = (((o * 7.3) % 1) * 2 - 1) * 0.1,
          d: any = r.certConvergeRotOffsets
            ? r.certConvergeRotOffsets[e]
            : null;
        i.rotation.x =
          s[0] + t * c + Math.sin(t * 0.4 + o * 6.283) * 0.08 + (d ? d[0] : 0);
        i.rotation.y =
          s[1] + t * l + Math.sin(t * 0.3 + o * 4.1) * 0.1 + (d ? d[1] : 0);
        i.rotation.z =
          s[2] + t * u + Math.sin(t * 0.25 + o * 3.7) * 0.05 + (d ? d[2] : 0);
      }
    if (
      (r.dustMat && (r.dustMat.uniforms.uTime.value = t),
      r.emberMat && (r.emberMat.uniforms.uTime.value = t),
      r.shredMeshes)
    )
      for (let e: any = 0; e < r.shredMeshes.length; e++) {
        let i: any = r.shredMeshes[e],
          a: any = r.shredMaterials[e];
        a.uniforms.uTime.value += n;
        let o: any = r.shredSeeds[e],
          s: any = r.shredBaseRotations[e];
        i.rotation.x = s[0] + Math.sin(t * 0.3 + o * 6.283) * 0.12;
        i.rotation.y = s[1] + Math.sin(t * 0.25 + o * 4.1) * 0.15;
        i.rotation.z = s[2] + Math.sin(t * 0.2 + o * 3.7) * 0.08;
      }
  },
  holdTrigger: {
    showAt: 0.95,
    hideAt: 0.9,
    ripple: !1,
    holdDuration: 1.5,
    endHintText: `TAP
HOLD`,
    onHoldStart: (e?: any, { resumeT: t }: any = {}): any => {
      gsap.killTweensOf(e, `_stage3HoldZoomT`);
      t || (e._stage3HoldZoomT = 0);
    },
    onHoldProgress: (e?: any, t?: any): any => {
      e._stage3HoldZoomT = t * t * (3 - 2 * t);
    },
    onHoldCancel: (e?: any): any => {
      gsap.killTweensOf(e, `_stage3HoldZoomT`);
      gsap.to(e, {
        _stage3HoldZoomT: 0,
        duration: 0.3,
        ease: `power2.out`,
      });
    },
    onHoldComplete: (e?: any): any => {
      if (
        (gsap.killTweensOf(e, `_stage3HoldZoomT`),
        (e._stage3HoldZoomT = 0),
        e._stage3CamBaseZ !== void 0)
      ) {
        e.camera.position.z = e._stage3CamBaseZ - Vx;
        let t: any = e.components;
        if (t && t.tunnelGroup) {
          if (t.tunnelLight) {
            let n: any = e.camera.position.z - t.tunnelGroup.position.z;
            t.tunnelLight.position.z = n + Z.nearLightAhead;
          }
          Ix(e);
        }
      }
    },
  },
  teardown(this: any, e?: any): any {
    let t: any = e.components;
    if (
      (e.lensBlurPass &&
        e._stage3BlurBase &&
        (e.lensBlurPass.uniforms.uMaxBlur.value = e._stage3BlurBase),
      delete e._stage3BlurBase,
      e._billBurnAudioIds)
    ) {
      for (let t of e._billBurnAudioIds)
        t != null && audioManager.stopInstance(`money-burn`, t);
      e._billBurnAudioIds = null;
    }
    if (t.billPlanes)
      for (let n of t.billPlanes) {
        n.material.dispose();
        e.scene.remove(n);
      }
    if (
      (t.billGeo && t.billGeo.dispose(),
      t.portalCircle &&
        (t.portalCircle.material.dispose(),
        t.portalCircle.geometry.dispose(),
        e.scene.remove(t.portalCircle)),
      t.portalTex && t.portalTex.dispose(),
      t.textLayout && t.textLayout.dispose(),
      t.certMeshes)
    )
      for (let n of t.certMeshes) e.scene.remove(n);
    if (t.certMaterials) for (let e of t.certMaterials) e.dispose();
    if ((t.certGeo && t.certGeo.dispose(), t.shredMeshes))
      for (let n of t.shredMeshes) e.scene.remove(n);
    if (t.shredMaterials) for (let e of t.shredMaterials) e.dispose();
    if (
      (t.shredGeo && t.shredGeo.dispose(),
      t.dustPoints && e.scene.remove(t.dustPoints),
      t.dustGeo && t.dustGeo.dispose(),
      t.dustMat && t.dustMat.dispose(),
      t.emberPoints && e.scene.remove(t.emberPoints),
      t.emberGeo && t.emberGeo.dispose(),
      t.emberMat && t.emberMat.dispose(),
      t.tunnelMaterials)
    )
      for (let e of t.tunnelMaterials) e.dispose();
    t.tunnelModel &&
      t.tunnelModel.traverse((e?: any): any => {
        e.isMesh && e.geometry && e.geometry.dispose();
      });
    t.tunnelLight && t.tunnelLight.dispose();
    t.tunnelPlane &&
      (t.tunnelPlane.geometry.dispose(), t.tunnelPlane.material.dispose());
    t.tunnelCircle &&
      (t.tunnelCircle.geometry.dispose(), t.tunnelCircle.material.dispose());
    t.tunnelGroup && e.scene.remove(t.tunnelGroup);
    e.cameraRig.setEnabled(!1);
    window.removeEventListener(`mousemove`, e._onMouseMove);
    e._gate2AnimOffset = 0;
    gsap.killTweensOf(e, `_stage3HoldZoomT`);
    e._stage3HoldZoomT = 0;
    e._stage3CamBaseZ = void 0;
    e.bgPass &&
      ((e.bgPass.uniforms.uLinearizeA.value = 0),
      (e.bgPass.uniforms.uLinearizeB.value = 0),
      e.bgPass.uniforms.uBgParallaxAmp &&
        ((e.bgPass.uniforms.uBgParallaxAmp.value = 0),
        e.bgPass.uniforms.uBgParallax.value.set(0, 0)));
    e._stage3Background2 &&= (e._stage3Background2.dispose(), null);
    e.assetLoader.disposeTextures([`stage3Background1`, `stage3Atlas`]);
  },
};
var Zx: any = [
  {
    position: [0.6, -0.4, 6],
    rotation: [3.44, -0.2, 0.1],
    scale: 0.85,
  },
  {
    position: [0.7, 0.85, 9.5],
    rotation: [2.64, 0.4, -0.3],
    scale: 0.8,
  },
  {
    position: [-0.6, -0.7, 13.5],
    rotation: [3.74, -0.7, 0.5],
    scale: 0.82,
  },
  {
    position: [1, -0.35, 8],
    rotation: [2.84, 0.8, -0.6],
    scale: 0.88,
  },
  {
    position: [-0.85, 0.55, 15.5],
    rotation: [3.84, -0.5, 0.4],
    scale: 0.78,
  },
  {
    position: [0.4, -1.05, 11],
    rotation: [2.34, 0.3, -0.2],
    scale: 0.83,
  },
  {
    position: [-0.35, 0.75, 18],
    rotation: [3.54, 0.6, -0.5],
    scale: 0.8,
  },
  {
    position: [0.75, 0.3, 12.5],
    rotation: [2.54, -0.4, 0.7],
    scale: 0.86,
  },
  {
    position: [-1.05, -0.3, 7.5],
    rotation: [3.2, 0.6, -0.4],
    scale: 0.76,
  },
  {
    position: [0.3, 1.1, 14.5],
    rotation: [2.9, -0.8, 0.3],
    scale: 0.84,
  },
  {
    position: [-0.4, -1.2, 9],
    rotation: [3.6, 0.3, 0.6],
    scale: 0.79,
  },
  {
    position: [1.1, 0.6, 17],
    rotation: [2.5, -0.6, -0.5],
    scale: 0.87,
  },
  {
    position: [0.07, -0.55, 20],
    rotation: [3.3, 0.9, 0.2],
    scale: 0.81,
  },
  {
    position: [-1.2, 0.2, 10.5],
    rotation: [2.7, -0.3, 0.8],
    scale: 0.75,
  },
  {
    position: [0.55, 0.7, 21.5],
    rotation: [3.5, -0.4, -0.7],
    scale: 0.83,
  },
  {
    position: [-0.75, -0.9, 18.5],
    rotation: [2.8, 0.7, 0.4],
    scale: 0.77,
  },
];
var Qx: any = 0.95;
var $x: any = Zx.map((e?: any): any => ({
  position: [e.position[0] * 0.85, e.position[1] * 0.85, e.position[2]],
}));
function eS(this: any, e?: any): any {
  let t: any = Zx.length,
    n: any = Cx(1.4, 1, 10, 32),
    r: any = 2048,
    i: any = [
      [0, 0, 658, 512],
      [658, 0, 658, 512],
      [1316, 0, 658, 512],
      [0, 512, 658, 512],
      [0, 1024, 658, 512],
      [0, 1536, 658, 512],
      [658, 1536, 658, 512],
      [1316, 1536, 658, 512],
    ],
    a: any = i.length,
    o: any = e.assetLoader.getAsset(`certAtlas`),
    s: any = i.map(([e, t, n, i]: any): any => ({
      offset: [e / r, 1 - (t + i) / r],
      scale: [n / r, i / r],
    })),
    c: any =
      e.assetLoader.getAsset(`certMatcap`) ||
      loadBitmapTexture(`assets/textures/matcap-certificate.webp`, {
        assetLoader: e.assetLoader,
      }),
    l: any = [],
    u: any = [],
    d: any = [],
    f: any = [],
    p: any = [];
  for (let r: any = 0; r < t; r++) {
    let t: any = Math.random(),
      i: any = s[r % a],
      m: any = Ex(o, {
        numStrips: 10,
        waviness: 0.015 + Math.random() * 0.01,
        seed: t,
        matcap: c,
        opacity: 0,
        texOffset: i.offset,
        texScale: i.scale,
      }),
      h: any = new Mesh(n, m),
      g: any = Zx[r],
      _: any = [g.position[0] * Qx, g.position[1] * Qx, g.position[2]];
    h.position.set(..._);
    h.rotation.set(...g.rotation);
    h.scale.setScalar(g.scale);
    let v: any = [...g.rotation];
    e.scene.add(h);
    l.push(h);
    u.push(m);
    d.push(t);
    f.push(v);
    p.push(_);
  }
  e.components.certMeshes = l;
  e.components.certMaterials = u;
  e.components.certSeeds = d;
  e.components.certBaseRotations = f;
  e.components.certSpreadPositions = p;
  e.components.certTunnelPositions = $x;
  e.components.certGeo = n;
}
export { Lx, Rx, zx, Bx, Gx, Kx, qx, Jx, Yx, stageThree, Zx, Qx, $x, eS };
