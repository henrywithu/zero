import { Z } from "../config/tunnel.ts";
// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { audioManager } from "../audio/AudioManager.ts";
import { zT } from "../runtime/preload";
import { c } from "../runtime/interop";
import { installCustomCursors, installClickAudio } from "../input/cursors.ts";
import { installGlassEffects } from "../components/GlassEffects.ts";
import {
  Scene,
  AxesHelper,
  PerspectiveCamera,
  WebGLRenderer,
  LinearSRGBColorSpace,
  DataTexture,
  RGBAFormat,
  Vector2,
  Clock,
  Mesh,
  CircleGeometry,
  WebGLRenderTarget,
  VideoTexture,
  SRGBColorSpace,
  Vector3,
} from "three";
import {
  resizePassCover,
  getCoverScale,
  setPassTexture,
} from "../rendering/textureUtils.ts";
import { Hud } from "../components/Hud.ts";
import { AssetLoader } from "../assets/AssetLoader.ts";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { createBackgroundPass } from "../rendering/BackgroundPass.ts";
import { FrostingPass } from "../rendering/FrostingPass.ts";
import { LensBlurPass } from "../rendering/LensBlurPass.ts";
import { createForegroundPass } from "../rendering/ForegroundPass.ts";
import { qualityManager } from "../rendering/QualityManager.ts";
import { ZeroGesture } from "../input/ZeroGesture.ts";
import { ScrollManager } from "../input/ScrollManager.ts";
import { CameraRig } from "../input/CameraRig.ts";
import { StatusController } from "../components/StatusController.ts";
import {
  armStarOverlay,
  createStarOverlay,
  stopStarOverlay,
  RO,
} from "../components/StarOverlay.ts";
import { gsap } from "gsap";
import { StageManager } from "../stages/StageManager.ts";
import { LoaderTextOverlay } from "../components/LoaderTextOverlay.ts";
import { LoaderHand } from "../components/LoaderHand.ts";
import {
  createStageVideo,
  whenVideoReady,
  playStageVideo,
} from "../stages/shared.ts";
import { TextPass } from "../rendering/TextPass.ts";
import { HandsModel } from "../models/HandsModel.ts";
import { CoinRing, gy } from "../models/CoinRing.ts";
import { PetalParticles } from "../models/PetalParticles.ts";
import { createBurnMaterial } from "../rendering/BurnMaterial.ts";
import { CircleHint } from "../components/CircleHint.ts";
import { Ib } from "../models/origami.ts";
import { GlassShardPass } from "../rendering/GlassShardPass.ts";
import { ShatterPass } from "../rendering/ShatterPass.ts";
import { HandsModelTwo } from "../models/HandsModelTwo.ts";
import { Gb, dx, fx } from "../stages/GateOneToTwo.ts";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { tD, eD, lD, cD } from "../models/MapMarkers.ts";
import { px } from "../stages/StageOne.ts";
import { sS } from "../stages/GateThreeToFour.ts";
import { companyMarkers } from "../content/companies.ts";
export function createExperience() {
  var isDebug: any = window.location.hash.startsWith(`#debug`);
  var debugStage: any = ((): any => {
    if (!isDebug) return null;
    let e: any = window.location.hash.match(/stage=(\w+)/);
    return e ? e[1] : null;
  })();
  var resumeStorageKey: any = `zero:resume`;
  var resumeExpiryMs: any = 1800 * 1e3;
  function readResumeState(this: any): any {
    if (isDebug) return null;
    try {
      let e: any = sessionStorage.getItem(resumeStorageKey);
      if (!e) return null;
      let t: any = JSON.parse(e);
      return !t ||
        typeof t.stage != `string` ||
        !t.t ||
        Date.now() - t.t > resumeExpiryMs ||
        t.stage === `gate0to1` ||
        t.stage === `stage1`
        ? null
        : t;
    } catch {
      return null;
    }
  }
  function saveResumeState(this: any): any {
    if (!isDebug)
      try {
        let e: any = stageManager.getResumeSegmentId();
        if (!e) {
          sessionStorage.removeItem(resumeStorageKey);
          return;
        }
        sessionStorage.setItem(
          resumeStorageKey,
          JSON.stringify({
            stage: e,
            audioEnabled: audioManager.isEnabled(),
            t: Date.now(),
          }),
        );
      } catch {}
  }
  var stats: any = null;
  var gpuStats: any = null;
  var memoryStats: any = null;
  var gpuSampleInterval: any = 4;
  var gpuTimer: any = {
    ext: null,
    query: null,
    pending: !1,
    lastGpuMs: 0,
    _frame: 0,
    init(this: any, e?: any): any {
      this.ext = e.getExtension(`EXT_disjoint_timer_query_webgl2`);
      this.ext ||
        console.warn(
          `GPU timing unavailable (EXT_disjoint_timer_query_webgl2 not supported)`,
        );
    },
    begin(this: any, e?: any): any {
      !this.ext ||
        this.pending ||
        (this._frame++ % gpuSampleInterval === 0 &&
          ((this.query = e.createQuery()),
          e.beginQuery(this.ext.TIME_ELAPSED_EXT, this.query)));
    },
    end(this: any, e?: any): any {
      !this.ext ||
        !this.query ||
        this.pending ||
        (e.endQuery(this.ext.TIME_ELAPSED_EXT), (this.pending = !0));
    },
    resolve(this: any, e?: any): any {
      if (
        !(!this.ext || !this.query || !this.pending) &&
        e.getQueryParameter(this.query, e.QUERY_RESULT_AVAILABLE)
      ) {
        if (e.getParameter(this.ext.GPU_DISJOINT_EXT)) {
          e.deleteQuery(this.query);
          this.query = null;
          this.pending = !1;
          return;
        }
        this.lastGpuMs = e.getQueryParameter(this.query, e.QUERY_RESULT) / 1e6;
        e.deleteQuery(this.query);
        this.query = null;
        this.pending = !1;
      }
    },
  };
  isDebug &&
    zT(async (): Promise<any> => {
      let { default: e } = await import(`stats.js`).then((e?: any): any =>
        c(e.default, 1),
      );
      return {
        default: e,
      };
    }, []).then(({ default: e }: any): any => {
      stats = new e();
      gpuStats = stats.addPanel(new e.Panel(`GPU`, `#f90`, `#210`));
      memoryStats = stats.addPanel(new e.Panel(`VRAM`, `#f0f`, `#201`));
      document.body.appendChild(stats.dom);
      let t: any = stats.dom.children,
        n: any = [0, 3, 4],
        r: any = 0;
      for (let e: any = 0; e < t.length; e++)
        t[e].style.display = e === 0 ? `block` : `none`;
      stats.dom.addEventListener(
        `click`,
        (e?: any): any => {
          e.stopPropagation();
          t[n[r]].style.display = `none`;
          r = (r + 1) % n.length;
          t[n[r]].style.display = `block`;
        },
        !0,
      );
    });
  var canvas: any = document.getElementById(`webgl`);
  installCustomCursors();
  installClickAudio(audioManager);
  installGlassEffects();
  var viewportWidth: any = window.innerWidth;
  var viewportHeight: any = window.innerHeight;
  var scene: any = new Scene();
  if (isDebug) {
    let e: any = new AxesHelper(5);
    scene.add(e);
  }
  window.addEventListener(`contextmenu`, (e?: any): any => e.preventDefault());
  var desktopFov: any = 30;
  var mobileFov: any = 40;
  var mobileBreakpoint: any = 768;
  function cameraFov(this: any): any {
    return viewportWidth <= mobileBreakpoint ? mobileFov : desktopFov;
  }
  var camera: any = new PerspectiveCamera(
    cameraFov(),
    viewportWidth / viewportHeight,
    0.1,
    30,
  );
  camera.position.z = 0.5;
  scene.add(camera);
  var renderer: any = new WebGLRenderer({
    canvas: canvas,
    antialias: !1,
    powerPreference: `high-performance`,
    alpha: !0,
  });
  renderer.setSize(viewportWidth, viewportHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0, 0);
  renderer.toneMapping = 0;
  renderer.outputColorSpace = LinearSRGBColorSpace;
  isDebug && gpuTimer.init(renderer.getContext());
  function resizeCoverScales(this: any, e?: any, t?: any): any {
    let n: any = e / t;
    if (
      ((backgroundPass.uniforms.uViewportAspect.value = n),
      (foregroundPass.uniforms.uViewportAspect.value = n),
      resizePassCover(backgroundPass, n),
      resizePassCover(foregroundPass, n),
      foregroundPass._hoverFrostTexAspect &&
        foregroundPass.uniforms.uHoverFrostCoverScale)
    ) {
      let e: any = getCoverScale(foregroundPass._hoverFrostTexAspect, n, !0);
      foregroundPass.uniforms.uHoverFrostCoverScale.value.set(e.x, e.y);
    }
  }
  var wasMobile: any = viewportWidth < 768;
  window.addEventListener(`resize`, (): any => {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    experienceContext._vw = viewportWidth;
    experienceContext._vh = viewportHeight;
    let e: any = viewportWidth,
      t: any = viewportHeight;
    if (e < 768 !== wasMobile) {
      location.reload();
      return;
    }
    camera.fov = cameraFov();
    camera.aspect = e / t;
    camera.updateProjectionMatrix();
    renderer.setSize(e, t);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    composer && composer.setSize(e, t);
    let n: any = renderer.getPixelRatio();
    lensBlurPass.setSize(Math.floor(e * n), Math.floor(t * n));
    resizeCoverScales(e, t);
    glassShardPass && glassShardPass.setSize(e, t);
    shatterPass && shatterPass.setSize(e, t);
    loaderText && loaderText.resize(e, t);
    circleHint && circleHint.resize();
    stageManager.isActive && stageManager.resize(e, t);
  });
  var hud: any = new Hud();
  var assetLoader: any = new AssetLoader(renderer);
  var composer: any = new EffectComposer(renderer);
  var scenePass: any = new RenderPass(scene, camera);
  scenePass.clear = !0;
  composer.addPass(scenePass);
  var backgroundPass: any = createBackgroundPass();
  composer.addPass(backgroundPass);
  var glassShardPass: any = null;
  var textPass: any = null;
  var shatterPass: any = null;
  var removeMouseInteraction: any = null;
  var frostingPass: any = new FrostingPass(renderer);
  composer.addPass(frostingPass);
  var loaderHand: any = null;
  var loaderText: any = null;
  var circleHint: any = null;
  var starOverlay: any = null;
  var lensBlurPass: any = new LensBlurPass();
  lensBlurPass._forcedOff = !0;
  lensBlurPass.uniforms.uEnabled.value = 0;
  composer.addPass(lensBlurPass);
  var foregroundPass: any = createForegroundPass();
  composer.addPass(foregroundPass);
  backgroundPass.uniforms.uViewportAspect.value =
    viewportWidth / viewportHeight;
  foregroundPass.uniforms.uViewportAspect.value =
    viewportWidth / viewportHeight;
  foregroundPass.uniforms.uEnableNoise.value =
    qualityManager.preset.postProcessing.foregroundNoise;
  foregroundPass.uniforms.uNoiseStrength.value =
    qualityManager.preset.postProcessing.noiseStrength;
  qualityManager.onChange((e?: any): any => {
    let t: any = qualityManager.preset;
    lensBlurPass._forcedOff ||
      ((lensBlurPass.uniforms.uEnabled.value = t.lensBlur.enabled),
      (lensBlurPass.uniforms.uMaxBlur.value = t.lensBlur.maxBlur));
    lensBlurPass.uniforms.uFocalRadius.value = t.lensBlur.focalRadius;
    lensBlurPass.uniforms.uFalloff.value = t.lensBlur.falloff;
    foregroundPass.uniforms.uEnableNoise.value =
      t.postProcessing.foregroundNoise;
    foregroundPass.uniforms.uNoiseStrength.value =
      t.postProcessing.noiseStrength;
    renderer.setPixelRatio(t.pixelRatio);
    let n: any = viewportWidth,
      r: any = viewportHeight;
    renderer.setSize(n, r);
    composer && (composer.setPixelRatio(t.pixelRatio), composer.setSize(n, r));
    let i: any = renderer.getPixelRatio();
    lensBlurPass.setSize(Math.floor(n * i), Math.floor(r * i));
    resizeCoverScales(n, r);
    glassShardPass && glassShardPass.setSize(n, r);
    shatterPass && shatterPass.setSize(n, r);
    stageManager.isActive && stageManager.resize(n, r);
  });
  function setPixelRatio(this: any, e?: any): any {
    renderer.setPixelRatio(e);
    renderer.setSize(viewportWidth, viewportHeight);
    composer &&
      (composer.setPixelRatio(e),
      composer.setSize(viewportWidth, viewportHeight));
    let t: any = renderer.getPixelRatio();
    lensBlurPass.setSize(
      Math.floor(viewportWidth * t),
      Math.floor(viewportHeight * t),
    );
    resizeCoverScales(viewportWidth, viewportHeight);
    glassShardPass && glassShardPass.setSize(viewportWidth, viewportHeight);
    shatterPass && shatterPass.setSize(viewportWidth, viewportHeight);
    stageManager.isActive && stageManager.resize(viewportWidth, viewportHeight);
    composer && composer.render(0);
  }
  var whiteTexture: any = new DataTexture(
    new Uint8Array([255, 255, 255, 255]),
    1,
    1,
    RGBAFormat,
  );
  whiteTexture.needsUpdate = !0;
  var zeroGesture: any = new ZeroGesture(scene, camera, assetLoader, hud);
  var pointer: any = new Vector2();
  var pointerPressed: any = !1;
  var drawingEnabled: any = !1;
  var pointerDirty: any = !1;
  var pointerX: any = 0;
  var pointerY: any = 0;
  var interactionDirty: any = !1;
  var multiTouchActive: any = !1;
  var lastPointerX: any = 0;
  var lastPointerY: any = 0;
  var lastPointerTime: any = 0;
  var pointerSpeed: any = 0;
  var soundSpeedScale: any = 2e3;
  var pointerSpeedDecay: any = 5;
  var scrollManager: any = new ScrollManager();
  var cameraRig: any = new CameraRig(camera);
  var statusController: any = new StatusController(hud);
  var onPointerMove: any = (e?: any): any => {
    if (multiTouchActive) return;
    pointer.x = (e.clientX / viewportWidth) * 2 - 1;
    pointer.y = -(e.clientY / viewportHeight) * 2 + 1;
    pointerDirty = !0;
    let t: any = performance.now();
    if (lastPointerTime > 0) {
      let n: any = (t - lastPointerTime) / 1e3;
      if (n > 0) {
        let t: any = e.clientX - lastPointerX,
          r: any = e.clientY - lastPointerY,
          i: any = Math.hypot(t, r) / n;
        pointerSpeed = pointerSpeed * 0.55 + i * 0.45;
      }
    }
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    lastPointerTime = t;
  };
  var onPointerDown: any = (e?: any): any => {
    pointer.x = (e.clientX / viewportWidth) * 2 - 1;
    pointer.y = -(e.clientY / viewportHeight) * 2 + 1;
    pointerPressed = !0;
    audioManager.arm();
    starOverlay && armStarOverlay(starOverlay);
    zeroGesture.handleInput(pointer.x, pointer.y, !0);
    zeroGesture.isReady &&
      !zeroGesture.isComplete &&
      (audioManager.play(`loader-drag`, {
        fadeIn: 0,
        volume: 0,
      }),
      (lastPointerTime = 0),
      (pointerSpeed = 0));
    drawingEnabled && frostingPass.setInput(pointer.x, pointer.y, !0);
    loaderHand && loaderHand.setCursor(pointer.x, pointer.y);
    circleHint && circleHint.setPointer(pointer.x, pointer.y, !0);
    cameraRig.enableGyro();
  };
  var onPointerUp: any = (): any => {
    pointerPressed = !1;
    pointerDirty = !1;
    zeroGesture.handleInput(pointer.x, pointer.y, !1);
    audioManager.stop(`loader-drag`);
    drawingEnabled && frostingPass.setInput(pointer.x, pointer.y, !1);
    circleHint && circleHint.setPointer(pointer.x, pointer.y, !1);
  };
  var onScenePointerMove: any = (e?: any): any => {
    experienceContext._waitlistOpen ||
      multiTouchActive ||
      ((pointerX = (e.clientX / viewportWidth) * 2 - 1),
      (pointerY = -(e.clientY / viewportHeight) * 2 + 1),
      (interactionDirty = !0));
  };
  window.addEventListener(`pointermove`, onPointerMove);
  window.addEventListener(`pointerdown`, onPointerDown);
  window.addEventListener(`pointerup`, onPointerUp);
  window.addEventListener(`pointercancel`, onPointerUp);
  var unlockAudio: any = (): any => audioManager.unlockNow();
  window.addEventListener(`touchstart`, unlockAudio, {
    passive: !0,
  });
  window.addEventListener(`touchend`, unlockAudio, {
    passive: !0,
  });
  canvas.addEventListener(
    `touchmove`,
    (e?: any): any => {
      e.preventDefault();
    },
    {
      passive: !1,
    },
  );
  var updateTouchCount: any = (e?: any): any => {
    multiTouchActive = (e.touches ? e.touches.length : 0) > 1;
  };
  window.addEventListener(`touchstart`, updateTouchCount, {
    passive: !0,
  });
  window.addEventListener(`touchmove`, updateTouchCount, {
    passive: !0,
  });
  window.addEventListener(`touchend`, updateTouchCount, {
    passive: !0,
  });
  window.addEventListener(`touchcancel`, updateTouchCount, {
    passive: !0,
  });
  var isDesktop: any = !hud._isMobile;
  var hoverGlowStrength: any = foregroundPass.uniforms.uHoverGlow.value;
  var hoverSuppressionRadius: any = 160;
  isDesktop &&
    window.addEventListener(
      `pointermove`,
      (e?: any): any => {
        if (experienceContext._waitlistOpen || multiTouchActive) return;
        let t: any = e.clientX / viewportWidth,
          n: any = 1 - e.clientY / viewportHeight;
        foregroundPass.uniforms.uHoverPos.value.set(t, n);
        let r: any = hoverGlowStrength,
          i: any = hud.nextStageButton,
          a: any = i && i.getActiveRect ? i.getActiveRect() : null;
        if (a) {
          let t: any = a.left + a.width * 0.5,
            n: any = a.top + a.height * 0.5,
            i: any = Math.hypot(e.clientX - t, e.clientY - n),
            o: any = a.width * 0.5,
            s: any = o + hoverSuppressionRadius;
          r = hoverGlowStrength * Math.min(Math.max((i - o) / (s - o), 0), 1);
        }
        foregroundPass.uniforms.uHoverGlow.value = r;
      },
      {
        passive: !0,
      },
    );
  var hoverDisabled: any = !1;
  function showHoverFrost(this: any): any {
    !isDesktop ||
      hoverDisabled ||
      (gsap.killTweensOf(foregroundPass.uniforms.uHoverIntensity, `value`),
      gsap.to(foregroundPass.uniforms.uHoverIntensity, {
        value: 1,
        duration: 0.6,
        ease: `power2.out`,
      }));
  }
  function hideHoverFrost(this: any): any {
    gsap.killTweensOf(foregroundPass.uniforms.uHoverIntensity, `value`);
    gsap.to(foregroundPass.uniforms.uHoverIntensity, {
      value: 0,
      duration: 0.4,
      ease: `power2.in`,
    });
  }
  var experienceContext: any = {
    scene: scene,
    camera: camera,
    renderer: renderer,
    assetLoader: assetLoader,
    ui: hud,
    bgPass: backgroundPass,
    fgPass: foregroundPass,
    lensBlurPass: lensBlurPass,
    frostingPass: frostingPass,
    shatterPass: null,
    glassShardPass: null,
    _frameProf: {
      update: 0,
      render: 0,
    },
    godRaysState: {
      atlas: null,
      rects: null,
      aspects: null,
      speed: 0.15,
    },
    textPass: null,
    textScene: null,
    scrollManager: scrollManager,
    hudStatusController: statusController,
    cameraRig: cameraRig,
    renderPass: scenePass,
    _composer: composer,
    whiteTex: whiteTexture,
    stage0: zeroGesture,
    _vw: viewportWidth,
    _vh: viewportHeight,
    _onMouseMove: onScenePointerMove,
    removeStage0Listeners: (): any => {
      window.removeEventListener(`pointermove`, onPointerMove);
      window.removeEventListener(`pointerdown`, onPointerDown);
      window.removeEventListener(`pointerup`, onPointerUp);
    },
    setHoverFrost: (e?: any): any => (e ? showHoverFrost() : hideHoverFrost()),
  };
  var stageManager: any = new StageManager(experienceContext);
  var clock: any = new Clock();
  var animationFrameId: any = 0;
  var noiseInterval: any = 0.012;
  var noiseElapsed: any = 0;
  var noiseSpeed: any = 0;
  function renderFrame(this: any): any {
    stats && stats.begin();
    animationFrameId = requestAnimationFrame(renderFrame);
    let e: any = clock.getDelta(),
      t: any = clock.elapsedTime,
      n: any = stageManager.isActive && experienceContext._waitlistOpen === !0;
    if (
      (stageManager.isActive && !n && e < 0.2 && qualityManager.sampleFrame(e),
      (pointerDirty &&=
        (zeroGesture.handleInput(pointer.x, pointer.y, pointerPressed),
        drawingEnabled &&
          frostingPass.setInput(pointer.x, pointer.y, pointerPressed),
        loaderHand && loaderHand.setCursor(pointer.x, pointer.y),
        circleHint &&
          circleHint.setPointer(pointer.x, pointer.y, pointerPressed),
        !1)),
      pointerSpeed > 0.01
        ? (pointerSpeed *= Math.exp(-e * pointerSpeedDecay))
        : (pointerSpeed = 0),
      pointerPressed && zeroGesture.isReady && !zeroGesture.isComplete)
    ) {
      let e: any = Math.min(pointerSpeed / soundSpeedScale, 1);
      audioManager.setLevel(`loader-drag`, {
        volume: e * 0.255,
        rate: 0.7 + e * 0.7,
      });
    }
    if (
      (loaderHand &&
        (loaderHand.update(),
        frostingPass.active || (loaderHand.dispose(), (loaderHand = null))),
      frostingPass.active)
    ) {
      let t: any = 1 - Math.exp(-4 * e);
      noiseElapsed += (pointer.x * noiseInterval - noiseElapsed) * t;
      noiseSpeed += (pointer.y * noiseInterval - noiseSpeed) * t;
      frostingPass.setShift(noiseElapsed, noiseSpeed);
    }
    loaderText &&
      !frostingPass.active &&
      (loaderText.dispose(),
      (loaderText = null),
      document.body.classList.remove(`webgl-loader-overlay`));
    circleHint &&
      !frostingPass.active &&
      (circleHint.dispose(), (circleHint = null));
    interactionDirty &&= (cameraRig.onMouseMove(pointerX, pointerY), !1);
    let r: any = performance.now();
    stageManager.isActive && !n && stageManager.update(t, e);
    experienceContext._frameProf.update = performance.now() - r;
    assetLoader &&
      assetLoader.chunkedUploader &&
      assetLoader.chunkedUploader.tick();
    foregroundPass.uniforms.uTime.value = t;
    {
      let e: any = foregroundPass.uniforms.uEnableNoise.value;
      if (e > 1.5) {
        let e: any = Math.floor(t * 60);
        foregroundPass.uniforms.uNoiseOffset.value.set(
          (e * 0.7548776662) % 1,
          (e * 0.5698402909) % 1,
        );
      } else e > 0.5 && foregroundPass.uniforms.uNoiseOffset.value.set(0, 0);
    }
    if (experienceContext.godRaysState.rects) {
      let e: any = experienceContext.godRaysState,
        n: any = ((t * e.speed) % 1) * 3,
        r: any = Math.floor(n) % 3,
        i: any = n - Math.floor(n),
        a: any = i * i * (3 - 2 * i),
        o: any = viewportWidth / viewportHeight;
      foregroundPass.uniforms.uGodRaysRect1.value.copy(e.rects[r]);
      foregroundPass.uniforms.uGodRaysRect2.value.copy(e.rects[(r + 1) % 3]);
      foregroundPass.uniforms.uGodRaysBlend.value = a;
      let s: any = getCoverScale(e.aspects[r], o, !0);
      foregroundPass.uniforms.uGodRaysCoverScale1.value.set(s.x, s.y);
      let c: any = getCoverScale(e.aspects[(r + 1) % 3], o, !0);
      foregroundPass.uniforms.uGodRaysCoverScale2.value.set(c.x, c.y);
    }
    if ((textPass && (textPass.enabled = textPass._hasVisibleSprites()), n))
      experienceContext._frameProf.render = 0;
    else if (isDebug) {
      let t: any = renderer.getContext();
      if (
        (gpuTimer.resolve(t),
        gpuStats &&
          !gpuTimer.pending &&
          gpuStats.update(gpuTimer.lastGpuMs, 20),
        memoryStats)
      ) {
        let e: any =
          (canvas.width * canvas.height * 32 +
            renderer.info.memory.textures * 1048576) /
          1048576;
        memoryStats.update(Math.round(e), 500);
      }
      gpuTimer.begin(t);
      let n: any = performance.now();
      composer.render(e);
      experienceContext._frameProf.render = performance.now() - n;
      gpuTimer.end(t);
    } else {
      let t: any = performance.now();
      composer.render(e);
      experienceContext._frameProf.render = performance.now() - t;
    }
    !n && starOverlay && starOverlay.active && starOverlay.render(renderer);
    !n && stageManager.isActive && cameraRig.restore();
    debugOrbit !== void 0 &&
      debugOrbit &&
      debugOrbit.enabled &&
      debugOrbit.update();
    stats && stats.end();
  }
  const ready = Promise.all([
    assetLoader.loadAsset({
      type: `texture`,
      key: `frosting`,
      path: `assets/textures/frost.webp`,
    }),
    assetLoader.loadAsset({
      type: `procedural`,
      kind: `radialColor`,
      key: `loaderGradient`,
      params: {
        center: [0.5, 1.3],
        radiusX: 1.267,
        radiusY: 1.434,
        stops: [
          {
            offset: 0.15855,
            color: [212, 246, 235],
          },
          {
            offset: 0.26169,
            color: [179, 222, 209],
          },
          {
            offset: 0.36483,
            color: [145, 199, 183],
          },
          {
            offset: 0.46797,
            color: [112, 175, 156],
          },
          {
            offset: 0.57111,
            color: [78, 151, 130],
          },
          {
            offset: 0.78555,
            color: [53, 111, 94],
          },
          {
            offset: 1,
            color: [28, 72, 57],
          },
        ],
        width: 384,
        height: 216,
      },
    }),
    assetLoader
      .loadAsset({
        type: `texture`,
        key: `frostingNormal`,
        path: `assets/textures/frost_normal.webp`,
        colorSpace: `linear`,
        mipmaps: !1,
      })
      .catch((): any => void 0),
    assetLoader
      .loadAsset({
        type: `model`,
        key: `loaderHand`,
        path: `assets/models/loader_hand.glb`,
        animated: !1,
      })
      .catch((): any => void 0),
    assetLoader
      .loadAsset({
        type: `texture`,
        key: `handMatcap`,
        path: `assets/textures/matcap-hand.webp`,
        mipmaps: !1,
      })
      .catch((): any => void 0),
  ])
    .then((): any => {
      let e: any = assetLoader.getAsset(`loaderGradient`);
      e &&
        setPassTexture(
          backgroundPass,
          `A`,
          e,
          !0,
          assetLoader.getMeta(`loaderGradient`).stretched,
        );
      frostingPass.setFrostTexture(assetLoader.getAsset(`frosting`));
      let t: any = assetLoader.getAsset(`frostingNormal`);
      if (
        (t && frostingPass.setIceNormalTexture(t),
        t && foregroundPass?.uniforms?.uHoverFrostTex)
      ) {
        foregroundPass.uniforms.uHoverFrostTex.value = t;
        let e: any = t.image;
        foregroundPass._hoverFrostTexAspect =
          (e?.naturalWidth || e?.width || 1) /
          (e?.naturalHeight || e?.height || 1);
        let n: any =
            foregroundPass.uniforms.uViewportAspect.value ||
            viewportWidth / viewportHeight,
          r: any = getCoverScale(foregroundPass._hoverFrostTexAspect, n, !0);
        foregroundPass.uniforms.uHoverFrostCoverScale.value.set(r.x, r.y);
      }
      frostingPass.material.uniforms.uLoadProgress.value = 0;
      frostingPass.active = !0;
      loaderText = new LoaderTextOverlay(camera);
      loaderText.resize(viewportWidth, viewportHeight);
      loaderText.setNumber(99);
      loaderText.loadLogo(`assets/brand/nav_logo_white.svg`);
      document.body.classList.add(`webgl-loader-overlay`);
      let n: any = assetLoader.getAsset(`loaderHand`);
      n &&
        ((loaderHand = new LoaderHand(n, camera, {
          scale: 6,
          distance: 2,
          matcap: assetLoader.getAsset(`handMatcap`),
        })),
        scene.add(loaderHand.group));
      backgroundPass.uniforms.uOpacity.value = 1;
      foregroundPass.uniforms.uEnableNoise.value = !1;
      renderFrame();
      requestAnimationFrame((): any => audioManager.preload());
      starOverlay = createStarOverlay(`/`);
      experienceContext.applyPixelRatioOverride = setPixelRatio;
      experienceContext.frostingPass = frostingPass;
      experienceContext.onStage1Entered = (): any => {
        stopStarOverlay(starOverlay);
        audioManager.isUnlocked() ||
          audioManager.stop(`loader`, {
            fadeOut: 0,
          });
      };
      experienceContext._stage2VideoPrefetch = createStageVideo(`/`);
      let r: any = Promise.all([
          starOverlay.whenReady,
          new Promise((e?: any): any =>
            whenVideoReady(experienceContext._stage2VideoPrefetch, e),
          ),
          audioManager.decodeAll(),
        ]),
        i: any = {
          value: 0,
        },
        a: any = {
          value: 0,
        },
        o: any = -1,
        s: any = null,
        c: any = (): any => {
          let e: any = Math.max(0, 1 - a.value);
          i.value - a.value;
          let t: any = e * 1.8,
            n: any = Math.max(t, 0.6);
          s && s.kill();
          s = gsap.to(a, {
            value: i.value,
            duration: n,
            ease: `power1.out`,
            overwrite: !0,
            onUpdate: (): any => {
              let e: any = Math.floor(a.value * 100);
              if (e !== o && ((o = e), hud.updateLoader(a.value), loaderText)) {
                let e: any = Math.max(99 - Math.floor(a.value * 33) * 3, 0);
                e > 0 && loaderText.setNumber(e);
              }
              frostingPass.material.uniforms.uLoadProgress.value = a.value;
            },
          });
        };
      return new Promise((e?: any): any => {
        gsap.to(i, {
          value: 0.15,
          duration: 0.5,
          ease: `power2.inOut`,
          onUpdate: c,
          onComplete: e,
        });
      })
        .then((): any =>
          assetLoader.loadEverythingExceptWorldMap((e?: any): any => {
            i.value = 0.15 + e * 0.65;
            c();
          }),
        )
        .then(async (): Promise<any> => {
          i.value = 0.8;
          c();
          await Promise.race([
            r,
            new Promise((e?: any): any => setTimeout(e, 8e3)),
          ]);
          i.value = 0.9;
          c();
          textPass = new TextPass(renderer, viewportWidth, viewportHeight);
          composer.addPass(textPass);
          experienceContext.textPass = textPass;
          experienceContext.textScene = textPass.textScene;
          let e: any = assetLoader.getAsset(`stage1Background1`);
          e &&
            setPassTexture(
              backgroundPass,
              `B`,
              e,
              !0,
              assetLoader.getMeta(`stage1Background1`).stretched,
            );
          setPassTexture(foregroundPass, `B`, whiteTexture, !1, !0);
          textPass.warmUp();
          i.value = 0.9;
          c();
          let t: any = new HandsModel(assetLoader);
          i.value = 0.95;
          c();
          let n: any = new CoinRing(gy(assetLoader.getAsset(`spcAtlas`))),
            a: any = assetLoader.getAsset(`spcAtlas`),
            o: any = a ? new PetalParticles(a) : null,
            l: any = createBurnMaterial(null, {
              direction: `in2out`,
              emberColor: [0.651, 1, 0.835],
              emberTip: [1, 1, 1],
              charColor: [0.525, 1, 0.706],
              seed: 0,
              burnDelay: 0,
              burnSpeed: 1,
            });
          l.uniforms.uTexture.value = whiteTexture;
          let u: any = new Scene(),
            d: any = new Mesh(new CircleGeometry(0.5, 64), l);
          if (
            (u.add(d),
            renderer.render(u, camera),
            d.geometry.dispose(),
            (experienceContext.preWarmed = {
              handsModel: t,
              handsModel2: null,
              coinRing: n,
              petalParticles: o,
              portalMaterial: l,
            }),
            (i.value = 1),
            c(),
            await new Promise((e?: any): any => {
              s ? s.eventCallback(`onComplete`, e) : e();
            }),
            (foregroundPass.uniforms.uEnableNoise.value =
              qualityManager.preset.postProcessing.foregroundNoise),
            (foregroundPass.uniforms.uNoiseStrength.value =
              qualityManager.preset.postProcessing.noiseStrength),
            hud.onLoadComplete(),
            loaderText)
          ) {
            let e: any = gsap.timeline();
            e.to(loaderText, {
              _transitionT: 1,
              duration: 1,
              ease: `power2.inOut`,
              onUpdate: (): any => loaderText.redraw(),
              onComplete: (): any => {
                zeroGesture.isComplete ||
                  (statusController.pin(`drawZero`, `DRAW A ZERO`, {
                    chevron: !1,
                  }),
                  circleHint && circleHint.show());
                drawingEnabled = !0;
                zeroGesture.setReady();
              },
            });
            e.to(loaderText, {
              _loaderOffsetX: -750,
              _loaderOpacity: 0,
              duration: 0.8,
              delay: 1.2,
              ease: `power3.in`,
              onUpdate: (): any => loaderText.redraw(),
            });
          } else {
            zeroGesture.isComplete ||
              (statusController.pin(`drawZero`, `DRAW A ZERO`, {
                chevron: !1,
              }),
              circleHint && circleHint.show());
            drawingEnabled = !0;
            zeroGesture.setReady();
          }
          circleHint = new CircleHint(canvas);
          loaderHand && loaderHand.enter();
          let f: any = debugStage ? null : readResumeState(),
            p: any = debugStage || (f && f.stage) || null;
          if (p) {
            if (
              ((experienceContext._stage2VideoPrefetch ||=
                createStageVideo(`/`)),
              Ib(),
              glassShardPass ||
                ((glassShardPass = new GlassShardPass(
                  renderer,
                  viewportWidth,
                  viewportHeight,
                )),
                composer.insertPass(glassShardPass, 2),
                (experienceContext.glassShardPass = glassShardPass)),
              shatterPass ||
                ((shatterPass = new ShatterPass(
                  renderer,
                  viewportWidth,
                  viewportHeight,
                )),
                composer.addPass(shatterPass),
                (experienceContext.shatterPass = shatterPass)),
              removeMouseInteraction)
            ) {
              let e: any = removeMouseInteraction;
              removeMouseInteraction = null;
              e();
            }
            frostingPass.onCircleComplete();
            loaderHand && loaderHand.exit();
            circleHint && circleHint.hide();
            loaderText &&
              (gsap.killTweensOf(loaderText),
              loaderText.dispose(),
              (loaderText = null),
              document.body.classList.remove(`webgl-loader-overlay`));
            statusController.unpin(`drawZero`);
            f && f.audioEnabled === !1 && audioManager.setEnabled(!1);
            stageManager.skipTo(p);
            statusController.activate(scrollManager);
            showHoverFrost();
          } else {
            zeroGesture.onStageComplete = (): any => {
              audioManager.play(`loader`);
              frostingPass.onCircleComplete();
              RO(starOverlay);
              loaderHand && loaderHand.exit();
              circleHint && circleHint.hide();
              statusController.unpin(`drawZero`);
              experienceContext._stage2VideoPrefetch ||= createStageVideo(`/`);
              assetLoader.loadStageAssets(`stage2`).then((): any => {
                let e: any = new HandsModelTwo(assetLoader);
                e.group.visible = !0;
                let t: any = new Scene();
                t.add(e.group);
                let n: any = new WebGLRenderTarget(1, 1),
                  r: any = renderer.getRenderTarget();
                renderer.setRenderTarget(n);
                renderer.render(t, camera);
                renderer.setRenderTarget(r);
                n.dispose();
                t.remove(e.group);
                e.group.visible = !1;
                experienceContext.preWarmed &&
                  (experienceContext.preWarmed.handsModel2 = e);
                let i: any = (): any => {
                  shatterPass.prewarm(
                    renderer,
                    camera,
                    e.handRef,
                    assetLoader.getAsset(`glassShatter`),
                    assetLoader.assets.animations.glassShatter,
                  );
                  glassShardPass && glassShardPass.prewarm(renderer, camera);
                };
                shatterPass ? i() : (removeMouseInteraction = i);
                experienceContext.preWarmed &&
                  !experienceContext.preWarmed.glassShards &&
                  (experienceContext.preWarmed.glassShards = Gb(assetLoader));
                let a: any = assetLoader.getAsset(`stage2Foreground`);
                a && renderer.initTexture(a);
                let o: any = experienceContext._stage2VideoPrefetch;
                if (o && !experienceContext._stage2VideoTexPrewarmed) {
                  let e: any = new VideoTexture(o);
                  e.colorSpace = SRGBColorSpace;
                  experienceContext._stage2VideoTexPrewarmed = e;
                  playStageVideo(o);
                  whenVideoReady(o, (): any => {
                    o.videoWidth > 0 && renderer.initTexture(e);
                  });
                }
              });
              assetLoader.loadStageAssets(`stage4`);
              stageManager.start();
              statusController.activate(scrollManager);
              showHoverFrost();
            };
            zeroGesture.isComplete && zeroGesture.onStageComplete();
          }
        });
    })
    .catch((e?: any): any => {
      console.error(`Fatal Error:`, e);
      statusController.pin(`error`, `ERROR LOADING ASSETS`, {
        chevron: !1,
      });
    });
  var renderingPaused: any = !1;
  var contextLost: any = !1;
  function pauseRendering(this: any): any {
    renderingPaused ||
      ((renderingPaused = !0),
      (animationFrameId &&= (cancelAnimationFrame(animationFrameId), 0)),
      audioManager.suspendContext());
  }
  function resumeRendering(this: any): any {
    renderingPaused &&
      (contextLost ||
        ((renderingPaused = !1),
        clock.getDelta(),
        audioManager.resumeContext(),
        experienceContext._stage2Video &&
          experienceContext._stage2Video.paused &&
          playStageVideo(experienceContext._stage2Video),
        animationFrameId || renderFrame()));
  }
  document.addEventListener(`visibilitychange`, (): any => {
    document.hidden ? (saveResumeState(), pauseRendering()) : resumeRendering();
  });
  window.addEventListener(`pagehide`, (): any => {
    saveResumeState();
    pauseRendering();
  });
  window.addEventListener(`pageshow`, (e?: any): any => {
    if (e.persisted) {
      let e: any = renderer.getContext();
      if (!e || e.isContextLost()) {
        window.location.reload();
        return;
      }
    }
    resumeRendering();
  });
  renderer.domElement.addEventListener(
    `webglcontextlost`,
    (e?: any): any => {
      e.preventDefault();
      contextLost = !0;
      pauseRendering();
      console.warn(`[main] WebGL context lost — waiting for restore`);
      setTimeout((): any => {
        contextLost && window.location.reload();
      }, 5e3);
    },
    !1,
  );
  renderer.domElement.addEventListener(
    `webglcontextrestored`,
    (): any => {
      contextLost = !1;
      window.location.reload();
    },
    !1,
  );
  var debugGui: any = null;
  var debugOrbit: any = null;
  isDebug &&
    zT(async (): Promise<any> => {
      let { default: e } = await import(`lil-gui`);
      return {
        default: e,
      };
    }, []).then(async ({ default: e }: any): Promise<any> => {
      debugGui = new e({
        closeFolders: !0,
      });
      debugGui.close();
      window.gui = debugGui;
      let { createAutoScrollMode: t, installAutoScrollDebugGui: n } =
          await zT(async (): Promise<any> => {
            let { createAutoScrollMode: e, installAutoScrollDebugGui: t } =
              await import(`../input/AutoScroll.ts`);
            return {
              createAutoScrollMode: e,
              installAutoScrollDebugGui: t,
            };
          }, []),
        r: any = t({
          scrollManager: scrollManager,
        });
      n(debugGui, r);
      let i: any = {
        enableOrbit: !1,
        qualityTier: qualityManager.tier,
        hoverFrost: !0,
      };
      debugOrbit = new OrbitControls(camera, canvas);
      debugOrbit.enableDamping = !0;
      debugOrbit.enabled = !1;
      debugGui
        .add(i, `enableOrbit`)
        .name(`Enable OrbitControls`)
        .onChange((e?: any): any => {
          if (
            ((debugOrbit.enabled = e), (experienceContext.orbitOverride = e), e)
          ) {
            cameraRig.setEnabled(!1);
            scrollManager.disable();
            let e: any = new Vector3(0, 0, -1)
              .applyQuaternion(camera.quaternion)
              .add(camera.position);
            debugOrbit.target.copy(e);
            debugOrbit.update();
          } else {
            scrollManager.enable();
            cameraRig.setEnabled(!0);
            stageManager._handleScroll(scrollManager.progress);
          }
        });
      debugGui
        .add(i, `qualityTier`, [`HIGH`, `MEDIUM`, `LOW`])
        .name(`Quality Tier`)
        .onChange((e?: any): any => qualityManager.setTier(e));
      debugGui
        .add(i, `hoverFrost`)
        .name(`Hover Lens`)
        .onChange((e?: any): any => {
          hoverDisabled = !e;
          gsap.killTweensOf(foregroundPass.uniforms.uHoverIntensity, `value`);
          e
            ? showHoverFrost()
            : (foregroundPass.uniforms.uHoverIntensity.value = 0);
        });
      qualityManager.onChange((e?: any): any => {
        i.qualityTier = e;
        debugGui
          .controllersRecursive()
          .forEach((e?: any): any => e.updateDisplay());
      });
      let a: any = debugGui.addFolder(`Tone Mapping`);
      a.add(foregroundPass.uniforms.uExposure, `value`, 0, 2, 0.01).name(
        `Exposure`,
      );
      a.add(foregroundPass.uniforms.uContrast, `value`, 0.5, 2, 0.01).name(
        `Contrast`,
      );
      a.add(foregroundPass.uniforms.uSaturation, `value`, 0, 2, 0.01).name(
        `Saturation`,
      );
      let o: any = debugGui.addFolder(`Stage5 Centre Ring`),
        s: any = (): any => {
          let e: any =
            experienceContext.components &&
            experienceContext.components.centerRing;
          e &&
            experienceContext._stage5MapPlaneH &&
            tD(e, experienceContext._stage5MapPlaneH);
        };
      o.add(eD, `x`, -0.5, 0.5, 0.001)
        .name(`Offset X (×H, +right)`)
        .onChange(s);
      o.add(eD, `y`, -0.5, 0.5, 0.001).name(`Offset Y (×H, +up)`).onChange(s);
      o.add(eD, `sizeX`, 0.1, 5, 0.01).name(`Size X`).onChange(s);
      o.add(eD, `sizeY`, 0.1, 5, 0.01).name(`Size Y`).onChange(s);
      let c: any = debugGui.addFolder(`Stage5 Halo Tower`),
        l: any = (): any => lD(experienceContext);
      c.addColor(cD, `towerColor`).name(`Tower color`).onChange(l);
      c.add(cD, `towerOpacity`, 0, 3, 0.01).name(`Tower opacity`).onChange(l);
      c.addColor(cD, `rippleColor`).name(`Ripple color`).onChange(l);
      c.add(cD, `rippleOpacity`, 0, 1, 0.01).name(`Ripple opacity`).onChange(l);
      let u: any = debugGui.addFolder(`Garden Layers`),
        d: any = (): any => px(backgroundPass);
      u.add(dx, `scale`, 2e-4, 0.0015, 1e-5).name(`Global scale`).onChange(d);
      fx.forEach((e?: any, t?: any): any => {
        let n: any = u.addFolder(`Layer ${t}`);
        n.add(e.pos, `0`, 0, 1, 0.005).name(`pos X`).onChange(d);
        n.add(e.pos, `1`, 0, 1, 0.005).name(`pos Y`).onChange(d);
        n.add(e, `scale`, 0.1, 3, 0.01).name(`scale`).onChange(d);
        n.add(e, `depth`, 0, 1.5, 0.01).name(`depth`).onChange(d);
      });
      let f: any = backgroundPass.uniforms;
      if (f && f.uGardenBright) {
        let e: any = u.addFolder(`Grade / Exposure`);
        e.add(f.uGardenBright, `value`, 0.5, 1.6, 0.01).name(`Brightness`);
        e.add(f.uGardenWhitewash, `value`, 0, 0.3, 0.005).name(`Whitewash`);
        e.add(f.uGardenBloom, `value`, 0, 0.6, 0.01).name(`Bloom`);
      }
      let p: any = debugGui.addFolder(`Tunnel`),
        m: any = (): any => sS(experienceContext);
      p.addColor(Z, `innerColor`).name(`Inner color`).onChange(m);
      p.addColor(Z, `innerEmissive`).name(`Inner emissive`).onChange(m);
      p.add(Z, `innerEmissiveIntensity`, 0, 5, 0.05)
        .name(`Inner emissive int`)
        .onChange(m);
      p.add(Z, `innerMetalness`, 0, 1, 0.01)
        .name(`Inner metalness`)
        .onChange(m);
      p.add(Z, `innerRoughness`, 0, 1, 0.01)
        .name(`Inner roughness`)
        .onChange(m);
      p.add(Z, `pulseSpeed`, 0, 30, 0.5).name(`Pulse speed (u/s)`);
      p.add(Z, `pulseSpacing`, 2, 40, 0.5).name(`Pulse spacing (u)`);
      p.add(Z, `pulseWidth`, 0.02, 0.5, 0.01).name(`Pulse width`);
      p.add(Z, `pulseGain`, 0, 10, 0.1).name(`Pulse gain`);
      p.add(Z, `nearLightAhead`, 0, 8, 0.1).name(`Light dist ahead`);
      p.add(Z, `nearLightIntensity`, 0, 10, 0.1).name(`Light intensity`);
      p.add(Z, `planeAhead`, 0, 8, 0.1).name(`Plane dist ahead`);
      p.add(Z, `planeGlowAhead`, 0, 12, 0.1).name(`Plane glow dist ahead`);
      p.add(Z, `planeSize`, 0.02, 5, 0.01).name(`Plane size (radius)`);
      p.add(Z, `planeGlowStrength`, 0, 10, 0.1).name(`Plane glow strength`);
      p.add(Z, `planeGlowWidth`, 0.1, 10, 0.1).name(`Plane glow width`);
      p.add(Z, `bandSpacing`, 0.01, 20, 0.01).name(`Band spacing`);
      p.add(Z, `bandWidth`, 0.01, 0.5, 0.005).name(`Band width`);
      p.add(Z, `bandStrength`, 0, 1, 0.01).name(`Band strength`);
      p.add(Z, `bandPhase`, 0, 1, 0.01).name(`Band phase`);
      p.add(Z, `bandTransparent`).name(`Bands transparent`);
      p.add(Z, `circleBehind`, -2, 40, 0.5).name(`End circle behind`);
      p.add(Z, `circleRadiusScale`, 0.05, 8, 0.05).name(`End circle radius ×`);
      p.add(Z, `gateSpinMax`, 0, 8, 0.1).name(`Gate spin max (rad/s)`);
      p.add(Z, `gateSpinRamp`, 0.5, 5, 0.1).name(`Gate spin ramp`);
      let h: any = debugGui.addFolder(`Map Markers (stage5)`),
        g: any = (e?: any): any => {
          let t: any = experienceContext.components;
          if (!t || !t.markers) return;
          let n: any = (experienceContext._mapPlaneHalfW || 0) * 2,
            r: any = (experienceContext._mapPlaneHalfH || 0) * 2,
            i: any = t.markers.find((t?: any): any => t.data.id === e.id);
          i && i.group.position.set(e.x * n, e.y * r, 0.01);
        };
      companyMarkers.forEach((e?: any): any => {
        let t: any = h.addFolder(e.company);
        t.add(e, `x`, -0.5, 0.5, 0.001)
          .name(`pos X`)
          .onChange((): any => g(e));
        t.add(e, `y`, -0.5, 0.5, 0.001)
          .name(`pos Y`)
          .onChange((): any => g(e));
      });
    });
  return {
    renderer,
    composer,
    clock,
    gsap,
    assetLoader,
    hud,
    zeroGesture,
    stageManager,
    scrollManager,
    cameraRig,
    context: experienceContext,
    ready,
    pauseRendering,
    resumeRendering,
    get frame() {
      return animationFrameId;
    },
    get loaderText() {
      return loaderText;
    },
    get circleHint() {
      return circleHint;
    },
    get textPass() {
      return textPass;
    },
    get starOverlay() {
      return starOverlay;
    },
    get frostingPass() {
      return frostingPass;
    },
    get foregroundPass() {
      return foregroundPass;
    },
  };
}
