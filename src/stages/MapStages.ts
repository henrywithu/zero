// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { gateZeroToOne } from "./GateZeroToOne.ts";
import { stageOne } from "./StageOne.ts";
import { gateOneToTwo } from "./GateOneToTwo.ts";
import { stageTwo } from "./StageTwo.ts";
import { stageThree } from "./StageThree.ts";
import { gateThreeToFour } from "./GateThreeToFour.ts";
import { awardXp, vv } from "./shared.ts";
import { setPassTexture } from "../rendering/textureUtils.ts";
import { gsap } from "gsap";
import {
  DataTexture,
  RGBAFormat,
  SRGBColorSpace,
  LinearFilter,
  Group,
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  AxesHelper,
  OrthographicCamera,
  RingGeometry,
  CircleGeometry,
  Color,
  BufferGeometry,
  BufferAttribute,
  Points,
  CylinderGeometry,
  Vector2,
  Raycaster,
} from "three";
import { ShaderMaterial } from "../rendering/ShaderMaterial";
import { JD, KD, ZD, qD, $D, YD, GD, QD, tO } from "../models/MapScene.ts";
import { CloudField, vS } from "../models/CloudField.ts";
import { atlasUv, atlasAspect } from "../rendering/TextMaterial.ts";
import { TextSprites } from "../components/TextSprites.ts";
import { qualityManager } from "../rendering/QualityManager.ts";
import { audioManager } from "../audio/AudioManager.ts";
import {
  sD,
  tD,
  nD,
  cD,
  uD,
  dD,
  eD,
  fD,
  gD,
  _D,
  pD,
  mD,
  hD,
  iD,
  rD,
  oD,
  aD,
  vD,
} from "../models/MapMarkers.ts";
import { yD, createCompanyPopup, xD } from "../components/CompanyPopup.ts";
import { JS } from "../components/MapControls.ts";
import { AC, OC, kC } from "../input/cursors.ts";
import {
  OD,
  populateCompanyPopup,
  ND,
  ID,
  PD,
  MD,
  AD,
  LD,
} from "../components/CompanyPopupBehavior.ts";
import { VD } from "../models/OrigamiAvatar.ts";
var stageSegments: any = [
  gateZeroToOne,
  stageOne,
  gateOneToTwo,
  stageTwo,
  stageThree,
  gateThreeToFour,
  {
    id: `stage4`,
    scrollVh: 368,
    autoScroll: !1,
    advanceAtEnd: !0,
    advanceThreshold: 0.99,
    async enter(this: any, e?: any): Promise<any> {
      e.ui.setPageTheme(`black`);
      awardXp(e, `stage4`);
      e._scrollProgress = 0;
      e.camera.position.set(0, 0, 0);
      e.camera.quaternion.identity();
      e._stage4OrigCameraFar = e.camera.far;
      e.camera.far = 65;
      e.camera.updateProjectionMatrix();
      e._pendingTeardown &&= (e._pendingTeardown(), null);
      e.fgPass &&
        (setPassTexture(e.fgPass, `A`, e.whiteTex, !1, !0),
        setPassTexture(e.fgPass, `B`, e.whiteTex, !1, !0),
        (e.fgPass.uniforms.uOpacity.value = 1),
        (e.fgPass.uniforms.uEnableOverlay.value = 1),
        (e.fgPass.uniforms.uProgress.value = 1),
        (e.fgPass.uniforms.uOverlayCenterReveal.value = 10),
        gsap.to(e.fgPass.uniforms.uOpacity, {
          value: 0,
          duration: 0.3,
          ease: `power2.out`,
          onComplete: (): any => {
            e.fgPass.uniforms.uEnableOverlay.value = 0;
          },
        }));
      let t: any = new DataTexture(
        new Uint8Array([
          255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
          255, 255,
        ]),
        2,
        2,
        RGBAFormat,
      );
      t.colorSpace = SRGBColorSpace;
      t.minFilter = LinearFilter;
      t.magFilter = LinearFilter;
      t.generateMipmaps = !1;
      t.needsUpdate = !0;
      setPassTexture(e.bgPass, `A`, t, !0, !0);
      e.bgPass.uniforms.uLinearizeA.value = 0;
      e.bgPass.uniforms.uProgress.value = 0;
      e.bgPass.uniforms.uOpacity.value = 1;
      e._stage4SkyBlueTex = t;
      let n: any = e.assetLoader.getAsset(`worldMap`);
      n &&
        ((n.anisotropy = Math.min(
          4,
          e.renderer.capabilities.getMaxAnisotropy(),
        )),
        (n.needsUpdate = !0));
      let r: any = n,
        i: any =
          r && r.image
            ? (r.image.naturalWidth || r.image.width) /
              (r.image.naturalHeight || r.image.height)
            : 2,
        a: any = JD(i, e.camera.aspect),
        o: any = (): any => {
          let t: any = (e.camera.fov * Math.PI) / 180,
            n: any = Math.abs(-40 - e.camera.position.z),
            r: any = Math.tan(t / 2) * n,
            a: any = r * e.camera.aspect,
            o: any,
            s: any;
          i > e.camera.aspect
            ? ((o = r * 2), (s = o * i))
            : ((s = a * 2), (o = s / i));
          return {
            planeW: s,
            planeH: o,
          };
        },
        { planeW: s, planeH: c } = o(),
        l: any = new Group();
      l.name = `world`;
      l.position.set(0, 0, -40);
      l.scale.setScalar(1);
      let u: any = null;
      n &&
        ((u = new Mesh(
          new PlaneGeometry(s, c),
          new MeshBasicMaterial({
            map: n,
            transparent: !0,
            opacity: 0,
            depthWrite: !1,
          }),
        )),
        (u.name = `cityImage`),
        (u.position.z = 0.01),
        l.add(u));
      e.scene.add(l);
      e._stage4MapMinScale = 1;
      e._stage4MapMaxScale = a;
      e._stage4ComputeMapSize = o;
      e._stage4MapRevealed = !1;
      e._stage4MapTween && e._stage4MapTween.kill();
      u && u.material
        ? (e._stage4MapTween = gsap.to(u.material, {
            opacity: 1,
            duration: 3.5,
            ease: `power1.inOut`,
            onComplete: (): any => {
              e._stage4MapTween = null;
              e._stage4MapRevealed = !0;
            },
          }))
        : (e._stage4MapRevealed = !0);
      let d: any = new AxesHelper(5);
      e.scene.add(d);
      await vv();
      let f: any = null,
        p: any = e.assetLoader.getAsset(`cloudsAtlas`);
      p &&
        ((f = new CloudField(p, vS, e.camera.fov, e.camera.aspect)),
        e.scene.add(f.group));
      await vv();
      let m: any = null,
        h: any = e.assetLoader.getAsset(`textsAtlas`);
      if (h) {
        e.renderer &&
          (h.anisotropy = e.renderer.capabilities.getMaxAnisotropy());
        let t: any = [
            [483.53, 960.06, 622.09, 175.83],
            [1083.94, 1769.27, 963.5, 278.73],
            [0, 1192.84, 579.84, 361.65],
            [1313.72, 1281.75, 734.56, 336.67],
            [581.43, 1135.89, 732.38, 335.67],
            [1240.79, 930.09, 803.79, 351.66],
            [0, 1848.2, 750.18, 199.8],
            [0, 1555.48, 769.93, 292.71],
          ],
          n: any = 0.9,
          r: any = t.map((e?: any, t?: any): any => (t === 1 ? 2 : 1)),
          i: any = r.reduce((e?: any, t?: any): any => e + t, 0),
          a: any = 0,
          o: any = r.map((e?: any): any => {
            let t: any = (a / i) * n;
            a += e;
            return [t, (a / i) * n];
          }),
          s: any = t.map(([e, t, n, r]: any, i?: any): any => ({
            texture: h,
            atlasUV: atlasUv(e, t, n, r),
            aspect: atlasAspect(n, r),
            baseScale: 0.35,
            anchor: `center-center`,
            appearAt: o[i][0],
            disappearAt: o[i][1],
          }));
        m = new TextSprites(e.textScene, s);
        m.resize(e._vw, e._vh);
        m.group.scale.setScalar(0);
        e._stage4TextTween && e._stage4TextTween.kill();
        e._stage4TextTween = gsap.to(m.group.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 2,
          ease: `power2.out`,
          onComplete: (): any => {
            e._stage4TextTween = null;
          },
        });
      }
      e.components = {
        axesHelper: d,
        textLayout: m,
        cloudLayer: f,
        world: l,
        cityImage: u,
      };
    },
    scrub(this: any, e?: any, t?: any): any {
      if (((e._scrollProgress = t), e.components.world)) {
        let n: any = e._stage4MapMinScale,
          r: any = e._stage4MapMaxScale,
          i: any = t * t * (3 - 2 * t),
          a: any = n + (r - n) * i;
        e.components.world.scale.setScalar(a);
        e.components.cityImage &&
          e._stage4MapRevealed &&
          ((e.components.cityImage.material.opacity = 1),
          (e.components.cityImage.visible = !0));
      }
    },
    update(this: any, e?: any, t?: any, n?: any): any {
      let r: any = e.components;
      r.cloudLayer && r.cloudLayer.update(n, e._scrollProgress);
      r.textLayout && r.textLayout.update(e._scrollProgress, n);
    },
    resize(this: any, e?: any, t?: any, n?: any): any {
      if (
        (e.components.textLayout && e.components.textLayout.resize(t, n),
        e.components.cloudLayer &&
          e.components.cloudLayer.resize(e.camera.fov, t / n),
        e._stage4ComputeMapSize)
      ) {
        let { planeW: t, planeH: n } = e._stage4ComputeMapSize();
        e.components.cityImage &&
          (e.components.cityImage.geometry.dispose(),
          (e.components.cityImage.geometry = new PlaneGeometry(t, n)));
      }
    },
    teardown(this: any, e?: any): any {
      let t: any = e.components;
      if (
        (t.axesHelper && (e.scene.remove(t.axesHelper), t.axesHelper.dispose()),
        t.textLayout && t.textLayout.dispose(),
        t.cloudLayer &&
          (e.scene.remove(t.cloudLayer.group), t.cloudLayer.dispose()),
        t.world &&
          (t.cityImage &&
            (t.cityImage.geometry.dispose(), t.cityImage.material.dispose()),
          e.scene.remove(t.world)),
        (e._stage4SkyBlueTex &&=
          (setPassTexture(e.bgPass, `A`, e.whiteTex, !0, !0),
          (e.bgPass.uniforms.uOpacity.value = 0),
          e._stage4SkyBlueTex.dispose(),
          null)),
        (e._stage4MapTween &&= (e._stage4MapTween.kill(), null)),
        (e._stage4TextTween &&= (e._stage4TextTween.kill(), null)),
        e._stage4OrigCameraFar !== void 0 &&
          ((e.camera.far = e._stage4OrigCameraFar),
          e.camera.updateProjectionMatrix(),
          delete e._stage4OrigCameraFar),
        delete e._stage4MapMinScale,
        delete e._stage4MapMaxScale,
        delete e._stage4ComputeMapSize,
        e.lensBlurPass)
      ) {
        let t: any = qualityManager.preset;
        e.lensBlurPass.uniforms.uEnabled.value = t.lensBlur.enabled;
        e.lensBlurPass.uniforms.uMaxBlur.value = t.lensBlur.maxBlur;
      }
      e.assetLoader.disposeTextures([`stage4Atlas`]);
      e.components = {};
    },
  },
  {
    id: `gate4to5`,
    scrollVh: 50,
    autoScroll: !0,
    autoScrollDuration: 0,
  },
  {
    id: `stage5`,
    scrollVh: 50,
    autoScroll: !1,
    async enter(this: any, e?: any): Promise<any> {
      e.ui.setPageTheme(`white`);
      e._rulerEl &&
        (gsap.killTweensOf(e._rulerEl),
        (e._rulerEl.style.opacity = `1`),
        (e._rulerEl.style.pointerEvents = `auto`));
      audioManager.play(`stage4-ambient`, {
        volume: 0.6,
      });
      audioManager.play(`stage5-ambient`);
      e.hudStatusController && e.hudStatusController.deactivate();
      e.setHoverFrost && e.setHoverFrost(!1);
      e._pendingTeardown &&= (e._pendingTeardown(), null);
      awardXp(e, `stage5`);
      e.fgPass && (e.fgPass.uniforms.uOpacity.value = 0);
      e.bgPass && (e.bgPass.uniforms.uOpacity.value = 0);
      e.lensBlurPass &&
        ((e._stage5LensBlurWasEnabled = e.lensBlurPass.uniforms.uEnabled.value),
        (e.lensBlurPass.uniforms.uEnabled.value = 0),
        (e.lensBlurPass._forcedOff = !0));
      let t: any = e.assetLoader.getAsset(`worldMap`);
      t &&
        ((t.anisotropy = Math.min(
          4,
          e.renderer.capabilities.getMaxAnisotropy(),
        )),
        (t.needsUpdate = !0));
      let n: any =
          (t.image.naturalWidth || t.image.width) /
          (t.image.naturalHeight || t.image.height),
        r: any = e._vw / e._vh,
        i: any = Math.min(5, (5 * n) / r),
        a: any = Math.min(KD, i),
        o: any = new OrthographicCamera(-a * r, a * r, a, -a, 0.1, 10);
      o.position.set(0, 0, 5);
      o.lookAt(0, 0, 0);
      e._stage5OrthoCamera = o;
      e._stage5OrigCamera = e.camera;
      e.renderPass.camera = o;
      let s: any = 10 * n,
        c: any = new PlaneGeometry(s, 10),
        l: any = new MeshBasicMaterial({
          map: t,
        }),
        u: any = new Mesh(c, l);
      e.scene.add(u);
      let d: any = 10 * 0.075,
        f: any = new Mesh(
          new RingGeometry(d - 0.00375, d, 96),
          new MeshBasicMaterial({
            color: sD,
            side: 2,
            transparent: !0,
            depthWrite: !1,
          }),
        );
      f.renderOrder = 1;
      e._stage5MapPlaneH = 10;
      tD(f, 10);
      u.add(f);
      let p: any = new Mesh(
        new CircleGeometry(d, 64),
        new MeshBasicMaterial({
          color: 16777215,
          transparent: !0,
          opacity: 0.1,
          depthWrite: !1,
        }),
      );
      tD(p, 10);
      p.renderOrder = -1;
      u.add(p);
      let m: any = new CircleGeometry(d, 64),
        h: any = [];
      for (let e: any = 0; e < nD; e++) {
        let t: any = new Mesh(
          m,
          new ShaderMaterial({
            uniforms: {
              uColor: {
                value: new Color(cD.rippleColor),
              },
              uOpacity: {
                value: 0,
              },
              uOuterR: {
                value: d,
              },
            },
            vertexShader: uD,
            fragmentShader: dD,
            transparent: !0,
            depthWrite: !1,
            side: 2,
            blending: 5,
            blendEquation: 100,
            blendSrc: 201,
            blendDst: 203,
          }),
        );
        t.position.set(eD.x * 10, eD.y * 10, 0.015);
        t.renderOrder = 1;
        t.frustumCulled = !1;
        u.add(t);
        h.push({
          mesh: t,
          index: e,
        });
      }
      let g: any = d * eD.sizeX,
        _: any = d * eD.sizeY,
        v: any = g * fD,
        y: any = v + 2 * _,
        b: any = new Mesh(
          new PlaneGeometry(g * 2, y),
          new ShaderMaterial({
            uniforms: {
              uColor: {
                value: new Color(cD.towerColor),
              },
              uBaseAlpha: {
                value: 0,
              },
              uCapR: {
                value: _ / y,
              },
              uHeight: {
                value: 0,
              },
              uTime: {
                value: 0,
              },
            },
            vertexShader: gD,
            fragmentShader: _D,
            transparent: !0,
            depthWrite: !1,
            side: 2,
            blending: 5,
            blendEquation: 100,
            blendSrc: 208,
            blendDst: 201,
          }),
        );
      b.position.set(eD.x * 10, eD.y * 10 + v * 0.5, 0.012);
      b.renderOrder = 0;
      u.add(b);
      let x: any = new BufferGeometry(),
        S: any = new Float32Array(pD * 3),
        C: any = new Float32Array(pD * 3);
      for (let e: any = 0; e < pD; e++) {
        let t: any = Math.random() * Math.PI * 2,
          n: any =
            e % 3 == 0 ? 1.05 + Math.random() * 0.45 : Math.sqrt(Math.random());
        S[e * 3] = Math.cos(t) * g * n;
        S[e * 3 + 1] = Math.sin(t) * _ * n;
        S[e * 3 + 2] = 0;
        C[e * 3] = 0.09 + Math.random() * 0.07;
        C[e * 3 + 1] = Math.random();
        C[e * 3 + 2] = g * (0.012 + Math.random() * 0.018);
      }
      x.setAttribute(`position`, new BufferAttribute(S, 3));
      x.setAttribute(`aInfo`, new BufferAttribute(C, 3));
      let w: any = new Points(
        x,
        new ShaderMaterial({
          uniforms: {
            uColor: {
              value: new Color(sD),
            },
            uAlpha: {
              value: 0,
            },
            uTime: {
              value: 0,
            },
            uRiseH: {
              value: v,
            },
            uVh: {
              value: e._vh || 1,
            },
          },
          vertexShader: mD,
          fragmentShader: hD,
          transparent: !0,
          depthWrite: !1,
          blending: 5,
          blendEquation: 100,
          blendSrc: 201,
          blendDst: 203,
        }),
      );
      w.position.set(eD.x * 10, eD.y * 10, 0.013);
      w.renderOrder = 2;
      w.frustumCulled = !1;
      u.add(w);
      let T: any = yD(),
        E: any = new Mesh(
          new CylinderGeometry(g * 1.001, g * 1.001, g * 0.68, 80, 1, !0),
          new MeshBasicMaterial({
            map: T,
            transparent: !0,
            depthWrite: !1,
            depthTest: !1,
            side: 2,
          }),
        );
      E.renderOrder = 5;
      let D: any = new Group();
      D.rotation.x = -Math.asin(Math.min(1, eD.sizeY / eD.sizeX));
      D.position.set(eD.x * 10, eD.y * 10 + v * 0.1, 0.02);
      D.add(E);
      u.add(D);
      let O: any = e.assetLoader.getAsset(`cloudsAtlas`);
      if (O) {
        e.renderer.initTexture(O);
        let t: any = 0.5 / (O.image?.width || O.mipmaps?.[0]?.width || 2048),
          n: any = {
            offset: new Vector2(1170 / 2048 + t, 1 - 1064 / 2048 + t),
            scale: new Vector2(878 / 2048 - 2 * t, 483 / 2048 - 2 * t),
          },
          r: any = {
            uShadowMap: {
              value: O,
            },
            uShadowOffset: {
              value: new Vector2(0, 0),
            },
            uShadowTiling: {
              value: new Vector2(2.4, 2.4),
            },
            uShadowAtlasOffset: {
              value: n.offset,
            },
            uShadowAtlasScale: {
              value: n.scale,
            },
            uShadowStrength: {
              value: 0,
            },
          };
        l.onBeforeCompile = (e?: any): any => {
          Object.assign(e.uniforms, r);
          e.fragmentShader = e.fragmentShader
            .replace(
              `#include <common>`,
              `
            #include <common>
            uniform sampler2D uShadowMap;
            uniform vec2 uShadowOffset;
            uniform vec2 uShadowTiling;
            uniform vec2 uShadowAtlasOffset;
            uniform vec2 uShadowAtlasScale;
            uniform float uShadowStrength;
          `,
            )
            .replace(
              `#include <map_fragment>`,
              `
            #include <map_fragment>
            // Tile inside the atlas sub-rectangle: take the fract() of
            // the tiled UV to get a [0,1) coord, then remap into the
            // shadow region. Atlas is ClampToEdgeWrapping, so this is
            // what makes the seamless repeat work.
            vec2 pre = vMapUv * uShadowTiling + uShadowOffset;
            vec2 tiled = fract(pre);
            vec2 cloudUv = tiled * uShadowAtlasScale + uShadowAtlasOffset;
            // Use pre-fract derivatives for mip selection. Auto-derivatives
            // on cloudUv would explode at every fract() wrap (UV jumps
            // from ~0.999 to ~0.001 between adjacent fragments), pick the
            // coarsest mip there, and average a huge chunk of the atlas —
            // that's the grey streak. dFdx(pre) is smooth across seams.
            vec2 dx = dFdx(pre) * uShadowAtlasScale;
            vec2 dy = dFdy(pre) * uShadowAtlasScale;
            vec3 cloudRgb = texture2DGradEXT(uShadowMap, cloudUv, dx, dy).rgb;
            float density = 1.0 - dot(cloudRgb, vec3(0.299, 0.587, 0.114));
            diffuseColor.rgb *= 1.0 - density * uShadowStrength;
          `,
            );
        };
        l.needsUpdate = !0;
        e._stage5CloudShadow = {
          tex: O,
          uniforms: r,
        };
        gsap.fromTo(
          r.uShadowStrength,
          {
            value: 0,
          },
          {
            value: 0.55,
            duration: 1.8,
            ease: `power2.out`,
          },
        );
      }
      await vv();
      e.scrollManager.disable();
      e.cameraRig.setEnabled(!1);
      e._mapTexAspect = n;
      e._mapBaseViewSize = 5;
      e._mapViewSize = i;
      e._mapZoom = a;
      e._mapZoomTarget = a;
      e._mapPlaneHalfW = s / 2;
      e._mapPlaneHalfH = 10 / 2;
      e._mapPan = {
        x: 0,
        y: 0,
      };
      e._mapPanTarget = {
        x: 0,
        y: 0,
      };
      e._mapVelocity = {
        x: 0,
        y: 0,
      };
      e._mapDragging = !1;
      e._mapLastPointer = {
        x: 0,
        y: 0,
      };
      e._knobDragPx = {
        x: 0,
        y: 0,
      };
      e._knobVel = {
        x: 0,
        y: 0,
      };
      e._knobDeflect = {
        x: 0,
        y: 0,
      };
      e._mapTouchPtrs = 0;
      e._mapPinchActive = !1;
      e._mapPinchMid = null;
      e._stage5MarkerIdx = null;
      e._stage5Controls =
        e.ui && e.ui._isMobile
          ? null
          : JS({
              onPanVelocity: (t?: any, n?: any): any => {
                e._mapPanTarget.x += t;
                e._mapPanTarget.y += n;
                e._mapVelocity.x = 0;
                e._mapVelocity.y = 0;
              },
              onZoomIn: (): any => {
                e._mapZoomTarget = Math.max(
                  KD,
                  Math.min(e._mapViewSize, e._mapZoomTarget * 0.85),
                );
              },
              onZoomOut: (): any => {
                e._mapZoomTarget = Math.max(
                  KD,
                  Math.min(e._mapViewSize, e._mapZoomTarget / 0.85),
                );
              },
              onCyclePrev: (): any => ZD(e, -1),
              onCycleNext: (): any => ZD(e, 1),
            });
      e._mapOnWheel = (t?: any): any => {
        if ((t.preventDefault(), (e._stage5EntryElapsed || 0) < qD)) return;
        let n: any = e._mapZoomTarget;
        e._mapZoomTarget = Math.max(
          KD,
          Math.min(e._mapViewSize, n * (1 + t.deltaY * 0.0006666666666666666)),
        );
        let r: any = n - e._mapZoomTarget;
        if (r !== 0) {
          let n: any = (t.clientX / e._vw) * 2 - 1,
            i: any = -((t.clientY / e._vh) * 2 - 1);
          e._mapPanTarget.x += n * r * (e._vw / e._vh);
          e._mapPanTarget.y += i * r;
        }
      };
      e._mapOnPointerDown = (t?: any): any => {
        if (
          t.pointerType === `touch` &&
          ((e._mapTouchPtrs = (e._mapTouchPtrs || 0) + 1), e._mapTouchPtrs >= 2)
        ) {
          e._mapDragging = !1;
          e._mapPinchActive = !0;
          e._mapVelocity.x = 0;
          e._mapVelocity.y = 0;
          return;
        }
        e._mapDragging = !0;
        e._mapDragPointerId = t.pointerId;
        e._mapVelocity.x = 0;
        e._mapVelocity.y = 0;
        e._mapLastPointer = {
          x: t.clientX,
          y: t.clientY,
        };
        e._mapPointerStart = {
          x: t.clientX,
          y: t.clientY,
        };
        e.renderer.domElement.style.cursor = AC();
      };
      e._mapOnPointerMove = (t?: any): any => {
        if (
          e._mapDragging &&
          !e._mapPinchActive &&
          t.pointerId === e._mapDragPointerId
        ) {
          let n: any = t.clientX - e._mapLastPointer.x,
            r: any = t.clientY - e._mapLastPointer.y,
            i: any = (e._mapZoom * 2) / e._vh,
            a: any = -n * i,
            o: any = r * i;
          e._mapPanTarget.x += a;
          e._mapPanTarget.y += o;
          e._mapVelocity.x = a;
          e._mapVelocity.y = o;
          e._knobDragPx.x += n;
          e._knobDragPx.y += r;
          e._mapLastPointer = {
            x: t.clientX,
            y: t.clientY,
          };
        } else if (e._mapRaycaster && e.components.markers) {
          let n: any = e.renderer.domElement.getBoundingClientRect(),
            r: any = new Vector2(
              ((t.clientX - n.left) / n.width) * 2 - 1,
              -((t.clientY - n.top) / n.height) * 2 + 1,
            );
          e._mapRaycaster.setFromCamera(r, e._stage5OrthoCamera);
          let i: any = e.components.markers.map(
              (e?: any): any => e.group.children[0],
            ),
            a: any = e._mapRaycaster.intersectObjects(i),
            o: any = a.length === 0 && $D(e);
          e.renderer.domElement.style.cursor = a.length > 0 || o ? OC() : kC();
          e._hoveredMarker =
            a.length > 0 ? a[0].object.parent.userData._marker : null;
        }
      };
      e._mapOnPointerUp = (t?: any): any => {
        let n: any = !!e._mapPinchActive;
        if (
          (t.pointerType === `touch` &&
            ((e._mapTouchPtrs = Math.max(0, (e._mapTouchPtrs || 0) - 1)),
            e._mapTouchPtrs === 0 && (e._mapPinchActive = !1)),
          (e._mapDragging = !1),
          e._mapRaycaster && e.components.markers)
        ) {
          let n: any = e.renderer.domElement.getBoundingClientRect(),
            r: any = new Vector2(
              ((t.clientX - n.left) / n.width) * 2 - 1,
              -((t.clientY - n.top) / n.height) * 2 + 1,
            );
          e._mapRaycaster.setFromCamera(r, e._stage5OrthoCamera);
          let i: any = e.components.markers.map(
              (e?: any): any => e.group.children[0],
            ),
            a: any = e._mapRaycaster.intersectObjects(i),
            o: any = a.length === 0 && $D(e);
          e.renderer.domElement.style.cursor = a.length > 0 || o ? OC() : kC();
        } else e.renderer.domElement.style.cursor = kC();
        let r: any = t.clientX - e._mapPointerStart.x,
          i: any = t.clientY - e._mapPointerStart.y;
        if (
          !n &&
          r * r + i * i < 25 &&
          e._mapRaycaster &&
          e.components.markers
        ) {
          let n: any = e.renderer.domElement.getBoundingClientRect(),
            r: any = new Vector2(
              ((t.clientX - n.left) / n.width) * 2 - 1,
              -((t.clientY - n.top) / n.height) * 2 + 1,
            );
          e._mapRaycaster.setFromCamera(r, e._stage5OrthoCamera);
          let i: any = e.components.markers.map(
              (e?: any): any => e.group.children[0],
            ),
            a: any = e._mapRaycaster.intersectObjects(i);
          if (a.length > 0) {
            audioManager.play(`click`);
            let t: any = a[0].object.parent.userData;
            if (e._mapPanel._activeId === t.id) OD(e._mapPanel);
            else {
              populateCompanyPopup(e._mapPanel, t);
              let n: any = a[0].object.parent;
              YD(e, n, e._mapPanTarget);
              e._mapVelocity.x = 0;
              e._mapVelocity.y = 0;
              GD(e);
            }
          } else if ($D(e)) {
            if (
              !e._waitlistOpen &&
              e._waitlistFlow &&
              e._waitlistFlow.openEmail
            ) {
              audioManager.play(`click`);
              e._waitlistFlow.openEmail();
              let t: any = e.components.ringHit;
              t &&
                ((e._mapPanTarget.x = t.position.x),
                (e._mapPanTarget.y = t.position.y),
                (e._mapVelocity.x = 0),
                (e._mapVelocity.y = 0));
            }
          } else OD(e._mapPanel);
        }
      };
      e._mapPinchDist = 0;
      e._mapOnTouchStart = (t?: any): any => {
        if (t.touches.length === 2) {
          let n: any = t.touches[0].clientX - t.touches[1].clientX,
            r: any = t.touches[0].clientY - t.touches[1].clientY;
          e._mapPinchDist = Math.sqrt(n * n + r * r);
          e._mapPinchMid = {
            x: (t.touches[0].clientX + t.touches[1].clientX) / 2,
            y: (t.touches[0].clientY + t.touches[1].clientY) / 2,
          };
        }
      };
      e._mapOnTouchMove = (t?: any): any => {
        if (t.touches.length === 2) {
          t.preventDefault();
          let n: any = t.touches[0].clientX - t.touches[1].clientX,
            r: any = t.touches[0].clientY - t.touches[1].clientY,
            i: any = Math.sqrt(n * n + r * r),
            a: any = (t.touches[0].clientX + t.touches[1].clientX) / 2,
            o: any = (t.touches[0].clientY + t.touches[1].clientY) / 2;
          if ((e._stage5EntryElapsed || 0) < qD) {
            e._mapPinchDist = i;
            e._mapPinchMid
              ? ((e._mapPinchMid.x = a), (e._mapPinchMid.y = o))
              : (e._mapPinchMid = {
                  x: a,
                  y: o,
                });
            return;
          }
          if (e._mapPinchMid) {
            let t: any = (e._mapZoom * 2) / e._vh;
            e._mapPanTarget.x += -(a - e._mapPinchMid.x) * t;
            e._mapPanTarget.y += (o - e._mapPinchMid.y) * t;
            e._mapPinchMid.x = a;
            e._mapPinchMid.y = o;
          } else
            e._mapPinchMid = {
              x: a,
              y: o,
            };
          if (e._mapPinchDist > 0) {
            let t: any = e._mapPinchDist / i,
              n: any = e._mapZoomTarget;
            e._mapZoomTarget = Math.max(KD, Math.min(e._mapViewSize, n * t));
            let r: any = n - e._mapZoomTarget;
            if (r !== 0) {
              let t: any = (a / e._vw) * 2 - 1,
                n: any = -((o / e._vh) * 2 - 1);
              e._mapPanTarget.x += t * r * (e._vw / e._vh);
              e._mapPanTarget.y += n * r;
            }
          }
          e._mapPinchDist = i;
        }
      };
      e._mapOnTouchEnd = (): any => {
        e._mapPinchDist = 0;
        e._mapPinchMid = null;
      };
      e._mapOnPointerCancel = (t?: any): any => {
        t.pointerType === `touch` &&
          ((e._mapTouchPtrs = Math.max(0, (e._mapTouchPtrs || 0) - 1)),
          e._mapTouchPtrs === 0 && (e._mapPinchActive = !1));
        e._mapDragging = !1;
        e._mapPinchDist = 0;
        e._mapPinchMid = null;
      };
      let k: any = e.renderer.domElement;
      k.addEventListener(`wheel`, e._mapOnWheel, {
        passive: !1,
      });
      k.addEventListener(`pointerdown`, e._mapOnPointerDown);
      window.addEventListener(`pointermove`, e._mapOnPointerMove);
      window.addEventListener(`pointerup`, e._mapOnPointerUp);
      window.addEventListener(`pointercancel`, e._mapOnPointerCancel);
      k.style.cursor = kC();
      k.addEventListener(`touchstart`, e._mapOnTouchStart, {
        passive: !0,
      });
      k.addEventListener(`touchmove`, e._mapOnTouchMove, {
        passive: !1,
      });
      k.addEventListener(`touchend`, e._mapOnTouchEnd, {
        passive: !0,
      });
      await vv();
      let A: any = QD(e, s, 10),
        j: any = createCompanyPopup({
          onJoin: (): any => {
            OD(j);
            !e._waitlistOpen &&
              e._waitlistFlow &&
              e._waitlistFlow.openEmail &&
              (audioManager.play(`click`), e._waitlistFlow.openEmail());
          },
        });
      e._mapPanel = j;
      ND(e);
      e._stage5Frame = ID(e);
      let M: any = (): any => {
        let t: any = e._getWaitlistBar ? e._getWaitlistBar() : null;
        e._waitlistFlow = VD(e, e._stage5Frame.el, {
          gate: t,
          showEntryAnimation: !1,
          onAllStepsComplete: (): any => {
            e._waitlistFlow &&
              (e._waitlistFlow.destroy(), delete e._waitlistFlow);
            e._stage5Frame && M();
            t && (t.collapse(), t.show());
          },
        });
      };
      M();
      e._mapRaycaster = new Raycaster();
      e._mapPointerStart = {
        x: 0,
        y: 0,
      };
      e.components = {
        mapPlane: u,
        mapGeo: c,
        mapMat: l,
        centerRing: f,
        ringHit: p,
        rippleRings: h,
        rippleGeo: m,
        cylinder: b,
        cylParticles: w,
        textRing: E,
        ...A,
      };
      e._stage5EntryElapsed = 0;
      e._stage5RipplesActive = !1;
      e._stage5CylBaseAlpha = cD.towerOpacity;
      e._stage5RingHitAlpha = p.material.opacity;
      f.material.opacity = 0;
      p.material.opacity = 0;
      E.material.opacity = 0;
      b.material.uniforms.uBaseAlpha.value = 0;
      b.material.uniforms.uHeight.value = 0;
    },
    scrub(this: any, e?: any, t?: any): any {},
    update(this: any, e?: any, t?: any, n?: any): any {
      let r: any = 1 - Math.exp(-10 * n),
        i: any = Math.exp(-5 * n);
      if (!e._stage5RipplesActive) {
        e._stage5EntryElapsed += n;
        let t: any = Math.min(e._stage5EntryElapsed / 1, 1),
          r: any = Math.min(e._stage5EntryElapsed / 2, 1),
          i: any = e.components;
        i.centerRing && (i.centerRing.material.opacity = t);
        i.ringHit && (i.ringHit.material.opacity = t * e._stage5RingHitAlpha);
        i.textRing && (i.textRing.material.opacity = t);
        i.cylinder &&
          ((i.cylinder.material.uniforms.uBaseAlpha.value =
            t * e._stage5CylBaseAlpha),
          (i.cylinder.material.uniforms.uHeight.value = r));
        i.cylParticles && (i.cylParticles.material.uniforms.uAlpha.value = t);
        e._stage5EntryElapsed >= 2 && (e._stage5RipplesActive = !0);
      }
      if (e._stage5CloudShadow) {
        let t: any = e._stage5CloudShadow.uniforms.uShadowOffset.value;
        t.x = (t.x - n * 0.05 + 1) % 1;
      }
      if (e.components.rippleRings && e._stage5RipplesActive) {
        e._stage5RippleTime = (e._stage5RippleTime || 0) + n;
        let t: any = eD.sizeX,
          r: any = eD.sizeY,
          i: any = nD * iD;
        for (let n of e.components.rippleRings) {
          let a: any = (e._stage5RippleTime - n.index * iD) % i;
          a < 0 && (a += i);
          let o: any = a / rD;
          if (o >= 1) {
            n.mesh.material.uniforms.uOpacity.value = 0;
            continue;
          }
          let s: any = 1 - (1 - o) ** oD,
            c: any = 1 + (aD - 1) * s,
            l: any = 1 - s;
          n.mesh.scale.set(t * c, r * c, 1);
          n.mesh.material.uniforms.uOpacity.value = l * cD.rippleOpacity;
        }
      }
      if (
        (e.components.textRing && (e.components.textRing.rotation.y += n * vD),
        e.components.cylParticles)
      ) {
        let t: any = e.components.cylParticles.material.uniforms;
        t.uTime.value += n;
        t.uVh.value = e._vh || t.uVh.value;
      }
      if (
        (e.components.cylinder &&
          (e.components.cylinder.material.uniforms.uTime.value += n),
        e._stage5Controls && e._stage5Controls.tick(n),
        e._stage5Controls)
      ) {
        let t: any = e._knobVel,
          n: any = e._knobDeflect,
          r: any = 0.18;
        t.x += (e._knobDragPx.x - t.x) * r;
        t.y += (e._knobDragPx.y - t.y) * r;
        e._knobDragPx.x = 0;
        e._knobDragPx.y = 0;
        let i: any = 0.04,
          a: any = Math.max(-1, Math.min(1, t.x * i)),
          o: any = Math.max(-1, Math.min(1, t.y * i)),
          s: any = 0.2;
        n.x += (a - n.x) * s;
        n.y += (o - n.y) * s;
        Math.abs(n.x) < 0.001 && Math.abs(t.x) < 0.01 && (n.x = 0);
        Math.abs(n.y) < 0.001 && Math.abs(t.y) < 0.01 && (n.y = 0);
        (n.x !== 0 || n.y !== 0 || a !== 0 || o !== 0) &&
          e._stage5Controls.setExternalDeflection(n.x, n.y);
      }
      if (
        ((e._mapZoom += (e._mapZoomTarget - e._mapZoom) * r),
        e._mapDragging ||
          ((e._mapPanTarget.x += e._mapVelocity.x),
          (e._mapPanTarget.y += e._mapVelocity.y),
          (e._mapVelocity.x *= i),
          (e._mapVelocity.y *= i),
          Math.abs(e._mapVelocity.x) < 1e-4 && (e._mapVelocity.x = 0),
          Math.abs(e._mapVelocity.y) < 1e-4 && (e._mapVelocity.y = 0)),
        (e._mapPan.x += (e._mapPanTarget.x - e._mapPan.x) * r),
        (e._mapPan.y += (e._mapPanTarget.y - e._mapPan.y) * r),
        tO(e),
        e.components.markers)
      ) {
        let t: any = e._mapZoom / e._mapViewSize,
          r: any = 1 - Math.exp(-15 * n),
          i: any = e._hoveredMarker,
          a: any = e._mapPanel && e._mapPanel._activeId;
        for (let n of e.components.markers) {
          let e: any = n === i || n.data.id === a ? xD : 1;
          n.hoverScale += (e - n.hoverScale) * r;
          n.group.scale.setScalar(t);
          n.fill.scale.setScalar(n.hoverScale);
        }
      }
      GD(e);
    },
    resize(this: any, e?: any, t?: any, n?: any): any {
      if (!e._stage5OrthoCamera) return;
      let r: any = t / n;
      e._mapViewSize = Math.min(
        e._mapBaseViewSize,
        (e._mapBaseViewSize * e._mapTexAspect) / r,
      );
      e._mapZoom = Math.min(e._mapZoom, e._mapViewSize);
      e._mapZoomTarget = Math.min(e._mapZoomTarget, e._mapViewSize);
      tO(e);
    },
    teardown(this: any, e?: any): any {
      audioManager.stop(`stage4-ambient`);
      audioManager.stop(`stage5-ambient`);
      e._stage5Controls &&= (e._stage5Controls.destroy(), null);
      delete e._stage5MarkerIdx;
      let t: any = e.renderer.domElement;
      if (
        ((t.style.cursor = ``),
        t.removeEventListener(`wheel`, e._mapOnWheel),
        t.removeEventListener(`pointerdown`, e._mapOnPointerDown),
        window.removeEventListener(`pointermove`, e._mapOnPointerMove),
        window.removeEventListener(`pointerup`, e._mapOnPointerUp),
        window.removeEventListener(`pointercancel`, e._mapOnPointerCancel),
        t.removeEventListener(`touchstart`, e._mapOnTouchStart),
        t.removeEventListener(`touchmove`, e._mapOnTouchMove),
        t.removeEventListener(`touchend`, e._mapOnTouchEnd),
        e._stage5OrigCamera && (e.renderPass.camera = e._stage5OrigCamera),
        e.components.mapPlane && e.scene.remove(e.components.mapPlane),
        e.components.mapGeo && e.components.mapGeo.dispose(),
        e.components.mapMat && e.components.mapMat.dispose(),
        e.components.centerRing &&
          (e.components.centerRing.geometry.dispose(),
          e.components.centerRing.material.dispose()),
        e.components.ringHit &&
          (e.components.ringHit.geometry.dispose(),
          e.components.ringHit.material.dispose()),
        e.components.rippleRings)
      )
        for (let t of e.components.rippleRings) t.mesh.material.dispose();
      if (
        (e.components.rippleGeo && e.components.rippleGeo.dispose(),
        e.components.cylinder &&
          (e.components.cylinder.geometry.dispose(),
          e.components.cylinder.material.dispose()),
        e.components.cylParticles &&
          (e.components.cylParticles.geometry.dispose(),
          e.components.cylParticles.material.dispose()),
        e.components.textRing &&
          (e.components.textRing.geometry.dispose(),
          e.components.textRing.material.map &&
            e.components.textRing.material.map.dispose(),
          e.components.textRing.material.dispose()),
        delete e._stage5MapPlaneH,
        delete e._stage5RippleTime,
        (e._stage5CloudShadow = null),
        e.assetLoader.disposeTextures([`cloudsAtlas`]),
        e.components.markers)
      ) {
        for (let t of e.components.markers) e.scene.remove(t.group);
        e.components.markerGeo.dispose();
        e.components.haloMat.dispose();
        e.components.fillMat.dispose();
      }
      PD(e);
      e._mapPanel &&
        (MD(e._mapPanel),
        AD(e._mapPanel),
        e._mapPanel.remove(),
        delete e._mapPanel);
      e._stage5Frame && (LD(e._stage5Frame), delete e._stage5Frame);
      e._waitlistFlow && (e._waitlistFlow.destroy(), delete e._waitlistFlow);
      e._releaseWaitlistBar && e._releaseWaitlistBar();
      e._waitlistOpen = !1;
      delete e._mapRaycaster;
      delete e._mapPointerStart;
      delete e._hoveredMarker;
      e.lensBlurPass &&
        e._stage5LensBlurWasEnabled !== void 0 &&
        ((e.lensBlurPass._forcedOff = !1),
        (e.lensBlurPass.uniforms.uEnabled.value = e._stage5LensBlurWasEnabled),
        delete e._stage5LensBlurWasEnabled);
      e.scrollManager.enable();
      e.hudStatusController && e.hudStatusController.activate(e.scrollManager);
      e.setHoverFrost && e.setHoverFrost(!0);
      e._rulerEl &&
        ((e._rulerEl.style.opacity = `1`),
        (e._rulerEl.style.pointerEvents = ``));
      delete e._stage5OrthoCamera;
      delete e._stage5OrigCamera;
      delete e._mapZoom;
      delete e._mapZoomTarget;
      delete e._mapViewSize;
      delete e._mapBaseViewSize;
      delete e._mapTexAspect;
      delete e._mapPlaneHalfW;
      delete e._mapPlaneHalfH;
      delete e._mapPan;
      delete e._mapPanTarget;
      delete e._mapVelocity;
      delete e._mapDragging;
      delete e._mapLastPointer;
      delete e._knobDragPx;
      delete e._knobVel;
      delete e._knobDeflect;
      delete e._mapOnWheel;
      delete e._mapOnPointerDown;
      delete e._mapOnPointerMove;
      delete e._mapOnPointerUp;
      e.assetLoader.disposeTextures([`worldMap`]);
      e.components = {};
    },
  },
];
var rO: any = {
  stage1: [
    {
      name: `stage1-ambient`,
    },
  ],
  stage2: [
    {
      name: `stage2-ambient`,
    },
  ],
  stage3: [
    {
      name: `stage2-ambient`,
    },
  ],
  stage4: [
    {
      name: `stage4-ambient`,
    },
  ],
  stage5: [
    {
      name: `stage4-ambient`,
      volume: 0.6,
    },
    {
      name: `stage5-ambient`,
    },
  ],
};
export { stageSegments, rO };
