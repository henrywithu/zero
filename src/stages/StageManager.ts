// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { stageSegments, rO } from "./MapStages.ts";
import { Vector3, Quaternion } from "three";
import { MobileTimeline } from "../components/MobileTimeline.ts";
import { ScrollRuler } from "../components/ScrollRuler.ts";
import { ID, LD } from "../components/CompanyPopupBehavior.ts";
import { audioManager } from "../audio/AudioManager.ts";
import { gsap } from "gsap";
import { VD } from "../models/OrigamiAvatar.ts";
import { createEmailGate } from "../components/EmailGate.ts";
import { clampProgress, playStageVideo, createStageVideo } from "./shared.ts";
var iO: any = [
  `stage1-ambient`,
  `stage2-ambient`,
  `stage4-ambient`,
  `stage5-ambient`,
];
var StageManager = class {
  declare _gateRippleTargets: any;
  declare _gateFadeRaf: any;
  declare _onWaitlistFormClose: any;
  declare _onWaitlistFormOpen: any;
  declare _scrollWasEnabledBeforeForm: any;
  declare _waitlistBarShown: any;
  declare _waitlistBar: any;
  declare _onOpenWaitlist: any;
  declare _navbarWaitlistTransient: any;
  declare _ruler: any;
  declare _totalScrollPx: any;
  declare _segmentBounds: any;
  declare _unsubscribeScrub: any;
  declare _holdShown: any;
  declare _entering: any;
  declare _isTransitioning: any;
  declare _activeIndex: any;
  declare isActive: any;
  declare segments: any;
  declare ctx: any;
  constructor(e?: any, t: any = stageSegments) {
    this.ctx = e;
    this.segments = t;
    this.isActive = !1;
    this._activeIndex = -1;
    this._isTransitioning = !1;
    this._entering = !1;
    this._holdShown = !1;
    this._unsubscribeScrub = null;
    this._segmentBounds = [];
    this._totalScrollPx = 0;
    this._recomputeBounds();
    e.components = {};
    e._scrollProgress = 0;
    e._prevScrollProgress = 0;
    e._scrollVelocity = 0;
    e._ethHandWorldPos = new Vector3();
    e._tempVec3 = new Vector3();
    e._tempQuat = new Quaternion();
    e._fgIntroActive = !1;
    e._trailWhiteKilled = !1;
    e._pendingTeardown = null;
    let n: any = window.innerWidth <= 768,
      r: any = document.getElementById(`ui-container`),
      i: any = (n && e.ui && e.ui._rightGroup) || r,
      a: any = n ? MobileTimeline : ScrollRuler;
    this._ruler = i
      ? new a(
          i,
          t.map((e?: any): any => ({
            id: e.id,
            label:
              e.id === `stage1`
                ? `-100 BZ`
                : e.id === `stage2`
                  ? `-75 BZ`
                  : e.id === `stage3`
                    ? `-50 BZ`
                    : e.id === `stage4`
                      ? `-25 BZ`
                      : e.id === `stage5`
                        ? `0 BZ`
                        : null,
            scrollVh: e.scrollVh,
          })),
        )
      : null;
    this._ruler &&
      ((this._ruler.el.style.opacity = `0`),
      (e._rulerEl = this._ruler.el),
      this._ruler.onStageClick((e?: any): any => this.navigateToSegment(e)));
    this._navbarWaitlistTransient = null;
    this._onOpenWaitlist = (): any => this._handleOpenWaitlist();
    window.addEventListener(`zero:openWaitlist`, this._onOpenWaitlist);
    this._waitlistBar = null;
    this._waitlistBarShown = !1;
    this.ctx._getWaitlistBar = (): any => this._ensureWaitlistBar();
    this.ctx._releaseWaitlistBar = (): any => {
      this._waitlistBar &&
        (this._waitlistBar.setOnEmail((e?: any): any =>
          this._handlePersistentEmail(e),
        ),
        this._waitlistBar.setOnBack(null));
    };
    this._scrollWasEnabledBeforeForm = !1;
    this._onWaitlistFormOpen = (): any => {
      this.ctx._waitlistOpen = !0;
      let e: any = this.ctx.scrollManager;
      e && ((this._scrollWasEnabledBeforeForm = !!e.enabled), e.disable());
    };
    this._onWaitlistFormClose = (): any => {
      this.ctx._waitlistOpen = !1;
      let e: any = this.ctx.scrollManager;
      e && this._scrollWasEnabledBeforeForm && e.enable();
    };
    window.addEventListener(`zero:waitlistFormOpen`, this._onWaitlistFormOpen);
    window.addEventListener(
      `zero:waitlistFormClose`,
      this._onWaitlistFormClose,
    );
  }
  _handleOpenWaitlist({ gate: e = null, routeEmail: t = null }: any = {}): any {
    let n: any = this.ctx,
      r: any = this.segments[this._activeIndex];
    if (r && r.id === `stage5` && n._waitlistFlow) {
      n._waitlistFlow.openEmail();
      return;
    }
    if (this._navbarWaitlistTransient) return;
    let i: any = ID(n, {
        duration: 0.65,
        muffle: !0,
      }),
      a: any = !1,
      o: any = (): any => {
        if (a) return;
        a = !0;
        e || this._navbarWaitlistTransient?.flow?.emailGate?.slideOut(0.45);
        i.muffled &&
          audioManager.setMuffle(0, {
            duration: 0.45,
          });
        let t: any = {
          inset: 10,
          radius: 32,
        };
        gsap.to(t, {
          inset: 0,
          radius: 0,
          duration: 0.45,
          ease: `power2.in`,
          onUpdate: (): any => {
            if (
              ((i.el.style.inset = `${t.inset}px`),
              (i.el.style.borderRadius = `${t.radius}px`),
              document.documentElement.style.setProperty(
                `--stage5-frame-inset`,
                `${t.inset}px`,
              ),
              i.borderCatchers)
            ) {
              let [e, n, r, a] = i.borderCatchers;
              e.style.height = `${t.inset}px`;
              n.style.height = `${t.inset}px`;
              r.style.width = `${t.inset}px`;
              a.style.width = `${t.inset}px`;
            }
            for (let e of i.navTargets) {
              if (!e) continue;
              let r: any = ``;
              e === n.ui._leftGroup
                ? (r = `translateX(${t.inset}px) `)
                : e === n.ui._rightGroup && (r = `translateX(${-t.inset}px) `);
              e.style.transform = `${r}translateY(${t.inset}px)`;
            }
          },
          onComplete: (): any => {
            LD(i);
            this._navbarWaitlistTransient?.flow &&
              this._navbarWaitlistTransient.flow.destroy();
            this._navbarWaitlistTransient = null;
            e &&
              (e.setOnEmail((e?: any): any => this._handlePersistentEmail(e)),
              e.setOnBack(null),
              (this._waitlistBarShown = !1),
              this._updateWaitlistBar());
          },
        });
      },
      s: any = VD(n, i.el, {
        autoExpandEmail: !e,
        showEntryAnimation: !e,
        entryAnimationDuration: 0.65,
        onCloseStart: o,
        onDismiss: o,
        onAllStepsComplete: (): any => {},
        onJoinFormClose: (): any => {},
        muffleFloor: 0.5,
        gate: e,
        routeEmail: t,
      });
    this._navbarWaitlistTransient = {
      frame: i,
      flow: s,
    };
  }
  _ensureWaitlistBar(): any {
    if (this._waitlistBar) return this._waitlistBar;
    let e: any = createEmailGate({
      onEmail: (e?: any): any => this._handlePersistentEmail(e),
      showEntryAnimation: !1,
    });
    gsap.set(e.el, {
      opacity: 0,
      y: 40,
    });
    e.el.style.pointerEvents = `none`;
    this._waitlistBar = e;
    this._waitlistBarShown = !1;
    return e;
  }
  _updateWaitlistBar(): any {
    if (this._navbarWaitlistTransient) return;
    let e: any = this.segments.findIndex((e?: any): any => e.id === `stage1`),
      t: any = this.segments.findIndex((e?: any): any => e.id === `stage5`),
      n: any = this._activeIndex;
    if (n >= e && n <= t) {
      let e: any = this._ensureWaitlistBar();
      this._waitlistBarShown ||
        ((this._waitlistBarShown = !0), e.collapse(), e.show());
    } else
      this._waitlistBar &&
        this._waitlistBarShown &&
        ((this._waitlistBarShown = !1), this._waitlistBar.hide());
  }
  _handlePersistentEmail(e?: any): any {
    this._handleOpenWaitlist({
      gate: this._waitlistBar,
      routeEmail: e,
    });
  }
  get scrollLength(): any {
    return this._totalScrollPx;
  }
  _recomputeBounds(): any {
    let e: any = this.ctx._vh || window.innerHeight,
      t: any = (this.ctx._vw || window.innerWidth) < 768 ? 0.7 : 1;
    this._segmentBounds = [];
    let n: any = 0;
    for (let r of this.segments) {
      let i: any = r.scrollVh * e * t;
      this._segmentBounds.push({
        start: n,
        end: n + i,
      });
      n += i;
    }
    this._totalScrollPx = n;
  }
  async _precompileStageMaterials(): Promise<any> {
    let e: any = this.ctx.renderer,
      t: any = this.ctx.camera;
    if (!e || !t) return;
    if (typeof e.compile == `function`) {
      let n: any = new Set(),
        r: any = (r?: any): any => {
          try {
            let i: any = e.compile(r, t);
            i && i.forEach && i.forEach((e?: any): any => n.add(e));
          } catch {}
        };
      if (
        (this.ctx.scene && r(this.ctx.scene),
        this.ctx.textScene && r(this.ctx.textScene),
        n.size > 0)
      ) {
        let t: any = e.properties,
          r: any = performance.now() + 3e3;
        await new Promise((e?: any): any => {
          let i: any = (): any => {
            for (let e of n) {
              let r: any = !0;
              try {
                let n: any = t.get(e),
                  i: any = n && n.currentProgram;
                r = !i || typeof i.isReady != `function` || i.isReady();
              } catch {
                r = !0;
              }
              r && n.delete(e);
            }
            if (n.size === 0 || performance.now() > r) {
              e();
              return;
            }
            setTimeout(i, 10);
          };
          i();
        });
      }
    }
    let n: any = this.ctx._composer;
    if (n && n.passes && n.passes.length > 0) {
      let e: any = n.passes[n.passes.length - 1],
        t: any = e.renderToScreen;
      e.renderToScreen = !1;
      try {
        n.render(0);
      } catch (e: any) {
        console.warn(`Composer warm-up render failed:`, e);
      } finally {
        e.renderToScreen = t;
      }
    }
  }
  async _ensureStageReady(e?: any): Promise<any> {
    let t: any = (
      {
        gate1to2: `stage2`,
        stage2: `stage2`,
        stage3: `stage3`,
        gate3to4: `worldMap`,
        stage4: `worldMap`,
        gate4to5: `worldMap`,
        stage5: `worldMap`,
      } as any
    )[e];
    if (!t) return;
    if (this.ctx.assetLoader.isStageReady(t)) {
      this.ctx.assetLoader.flushUploads();
      return;
    }
    let n: any = this.ctx.hudStatusController;
    n &&
      n.pin(`loading`, `LOADING...`, {
        chevron: !1,
      });
    await this.ctx.assetLoader.waitForStage(t);
    this.ctx.assetLoader.flushUploads();
    n && n.unpin(`loading`);
  }
  async start(): Promise<any> {
    this.isActive = !0;
    this._recomputeBounds();
    let { scrollManager: e } = this.ctx;
    e.setActiveStage(this);
    this._unsubscribeScrub = e.onScrub((e?: any): any => {
      this._handleScroll(e);
    });
    e.enable();
    await this._activateSegment(0);
  }
  _applySegmentClamp(e?: any): any {
    let t: any = this._segmentBounds[e];
    t && this.ctx.scrollManager.setScrollClamp(t.start, t.end);
  }
  _updateRulerNavState(): any {
    if (!this._ruler) return;
    let e: any = this.segments[this._activeIndex],
      t: any =
        !!e &&
        !e.autoScroll &&
        !this._isTransitioning &&
        (e.id === `stage1` ||
          e.id === `stage2` ||
          e.id === `stage3` ||
          e.id === `stage4` ||
          e.id === `stage5`);
    this._ruler.setNavEnabled(t);
    this._ruler.setActiveSegment(e ? e.id : null);
    let n: any = this._segmentBounds[this._activeIndex];
    e &&
      e.id === `stage5` &&
      n &&
      this._totalScrollPx > 0 &&
      this._ruler.update(n.start / this._totalScrollPx, !0);
  }
  _clearSegmentClamp(): any {
    this.ctx.scrollManager.clearScrollClamp();
  }
  _handleScroll(e?: any): any {
    if (
      this._activeIndex < 0 ||
      this._activeIndex >= this.segments.length ||
      this.ctx.orbitOverride ||
      (this._ruler && this._ruler.update(e), this._entering)
    )
      return;
    let t: any = this.segments[this._activeIndex],
      n: any = this._segmentBounds[this._activeIndex],
      r: any = e * this._totalScrollPx,
      i: any = n.end - n.start,
      a: any = i > 0 ? clampProgress((r - n.start) / i) : 0;
    t.scrub && t.scrub(this.ctx, a);
    t.holdTrigger &&
      !t.autoScroll &&
      !this._isTransitioning &&
      this._handleHoldTrigger(t, a);
    let o: any = t.advanceThreshold ?? 1;
    t.advanceAtEnd && a >= o && !this._isTransitioning && this._advanceToNext();
  }
  _handleHoldTrigger(e?: any, t?: any): any {
    let n: any = e.holdTrigger,
      r: any = n.ripple !== !1,
      i: any = n.mode === `click`,
      a: any = n.holdDuration ?? 3;
    if (t > n.showAt && !this._holdShown) {
      this._holdShown = !0;
      this.ctx.hudStatusController &&
        this.ctx.hudStatusController.setIdleSuppressed(!0);
      let e: any = (): any => {
        r && (this._resetGateRipple(), (this.ctx._ripplePreplayed = !0));
        n.onHoldComplete && n.onHoldComplete(this.ctx);
        this.ctx.hudStatusController &&
          this.ctx.hudStatusController.setIdleSuppressed(!1);
        this._advanceToNext();
      };
      i
        ? this.ctx.ui.showNextStageButton({
            label: n.endHintText,
            onComplete: e,
          })
        : this.ctx.ui.showNextStageButton({
            label: n.endHintText,
            holdDuration: a,
            onStart: (e: any = {}): any => {
              this.ctx.ui.fadeOutNextStageButton();
              r && this._beginGateRipple();
              n.onHoldStart && n.onHoldStart(this.ctx, e);
            },
            onProgress: (e?: any, t?: any): any => {
              this.ctx.ui.setNextStageButtonProgress(e);
              r && this._driveGateRipple(e, t);
              n.onHoldProgress && n.onHoldProgress(this.ctx, e, t);
            },
            onComplete: e,
            onCancel: (): any => {
              this.ctx.ui.fadeInNextStageButton();
              this.ctx.ui.resetNextStageButtonProgress();
              r && this._fadeOutGateRipple();
              n.onHoldCancel && n.onHoldCancel(this.ctx);
            },
          });
    } else
      t <= n.hideAt &&
        this._holdShown &&
        ((this._holdShown = !1),
        r && this._fadeOutGateRipple(),
        n.onHoldCancel && n.onHoldCancel(this.ctx),
        this.ctx.hudStatusController &&
          this.ctx.hudStatusController.setIdleSuppressed(!1),
        this.ctx.ui.hideNextStageButton());
  }
  _beginGateRipple(): any {
    this._gateFadeRaf &&= (cancelAnimationFrame(this._gateFadeRaf), null);
    let e: any = this.ctx.components;
    this._gateRippleTargets = [];
    e &&
      e.handsModel &&
      (e.handsModel._ethRippleUniforms &&
        this._gateRippleTargets.push(e.handsModel._ethRippleUniforms),
      e.handsModel.humanHandMaterial?.uniforms &&
        this._gateRippleTargets.push(e.handsModel.humanHandMaterial.uniforms));
  }
  _driveGateRipple(e?: any, t?: any): any {
    let n: any = this.ctx;
    if (!n) return;
    let r: any = n.renderer ? n.renderer.getPixelRatio() : 1,
      i: any = (n._vw || 1) * r,
      a: any = (n._vh || 1) * r,
      o: any = 0.4 + 0.6 * e,
      s: any = 0.75 + -0.55 * e,
      c: any;
    if (e < 0.5) c = 4 * e * e * e;
    else {
      let t: any = -2 * e + 2;
      c = 1 - (t * t * t) / 2;
    }
    n._gateHandProgress = 0.7 + 0.3 * c;
    for (let e of this._gateRippleTargets || []) {
      e.uRippleTime && (e.uRippleTime.value = t);
      e.uRippleIntensity && (e.uRippleIntensity.value = o);
      e.uRippleResolution && e.uRippleResolution.value.set(i, a);
      e.uRippleHw && (e.uRippleHw.value = s);
    }
    n.fgPass?.uniforms &&
      ((n.fgPass.uniforms.uRippleTime.value = t),
      (n.fgPass.uniforms.uRippleStrength.value = o * 0.15),
      (n.fgPass.uniforms.uRippleHw.value = s));
    n._gateZoomT = e;
  }
  _resetGateRipple(): any {
    this._gateFadeRaf &&= (cancelAnimationFrame(this._gateFadeRaf), null);
    for (let e of this._gateRippleTargets || []) {
      e.uRippleTime && (e.uRippleTime.value = 0);
      e.uRippleIntensity && (e.uRippleIntensity.value = 0);
      e.uRippleHw && (e.uRippleHw.value = 0.75);
    }
    this._gateRippleTargets = null;
    let e: any = this.ctx;
    e?.fgPass?.uniforms &&
      ((e.fgPass.uniforms.uRippleTime.value = 0),
      (e.fgPass.uniforms.uRippleStrength.value = 0),
      (e.fgPass.uniforms.uRippleHw.value = 0.75));
    e && (e._gateHandProgress = null);
  }
  _fadeOutGateRipple(): any {
    if (!this._gateRippleTargets || this._gateRippleTargets.length === 0) {
      this.ctx && (this.ctx._gateZoomT = 0);
      return;
    }
    this._gateFadeRaf && cancelAnimationFrame(this._gateFadeRaf);
    let e: any = this.ctx,
      t: any = this._gateRippleTargets.map((e?: any): any => ({
        target: e,
        intensity: e.uRippleIntensity ? e.uRippleIntensity.value : 0,
        hw: e.uRippleHw ? e.uRippleHw.value : 0.75,
        time: e.uRippleTime ? e.uRippleTime.value : 0,
      })),
      n: any = e?.fgPass?.uniforms
        ? {
            strength: e.fgPass.uniforms.uRippleStrength.value,
            hw: e.fgPass.uniforms.uRippleHw.value,
            time: e.fgPass.uniforms.uRippleTime.value,
          }
        : null,
      r: any = (e && e._gateZoomT) || 0,
      i: any = e && e._gateHandProgress != null ? e._gateHandProgress : null,
      a: any = performance.now(),
      o: any = (): any => {
        let s: any = performance.now(),
          c: any = (s - a) / 1e3,
          l: any = Math.min((s - a) / 500, 1),
          u: any = 1 - l;
        for (let e of t) {
          e.target.uRippleIntensity &&
            (e.target.uRippleIntensity.value = e.intensity * u);
          e.target.uRippleTime && (e.target.uRippleTime.value = e.time + c);
        }
        if (
          (n &&
            e?.fgPass?.uniforms &&
            ((e.fgPass.uniforms.uRippleStrength.value = n.strength * u),
            (e.fgPass.uniforms.uRippleTime.value = n.time + c)),
          e && (e._gateZoomT = r * u),
          e && i != null && (e._gateHandProgress = i + (0.7 - i) * l),
          l >= 1)
        ) {
          this._gateFadeRaf = null;
          this._resetGateRipple();
          return;
        }
        this._gateFadeRaf = requestAnimationFrame(o);
      };
    this._gateFadeRaf = requestAnimationFrame(o);
  }
  update(e?: any, t?: any): any {
    if (this.ctx.orbitOverride) return;
    let { scrollManager: n } = this.ctx;
    if (
      (n.update(t),
      !this._entering &&
        this._activeIndex >= 0 &&
        this._activeIndex < this.segments.length)
    ) {
      let n: any = this.segments[this._activeIndex];
      n.update && n.update(this.ctx, e, t);
    }
  }
  resize(e?: any, t?: any): any {
    if ((this._recomputeBounds(), this.isActive)) {
      let { scrollManager: e } = this.ctx,
        t: any = e.progress,
        n: any = this._totalScrollPx;
      e.scrollPos = t * n;
      e.targetScrollPos = t * n;
      this._activeIndex >= 0 &&
        this._activeIndex < this.segments.length &&
        (this.segments[this._activeIndex].autoScroll ||
          this._applySegmentClamp(this._activeIndex));
    }
    if (this._activeIndex >= 0 && this._activeIndex < this.segments.length) {
      let n: any = this.segments[this._activeIndex];
      n.resize && n.resize(this.ctx, e, t);
    }
  }
  async _advanceToNext(): Promise<any> {
    if (this._isTransitioning || this._activeIndex >= this.segments.length - 1)
      return;
    this._isTransitioning = !0;
    this._holdShown = !1;
    this.ctx.ui.hideNextStageButton();
    this._updateRulerNavState();
    let e: any = this.segments[this._activeIndex],
      t: any = this._activeIndex + 1,
      n: any = this.segments[t],
      r: any = e.fadeOutDuration || 0,
      i: any = (r * 1e3) / 2,
      a: any = null;
    try {
      if (r > 0) {
        let { scrollManager: e } = this.ctx;
        e.targetScrollPos = e.scrollPos;
        a = document.createElement(`div`);
        a.style.cssText = `position:fixed;inset:0;background:#000;opacity:0;z-index:9999;pointer-events:all;transition:opacity ${i}ms ease`;
        document.body.appendChild(a);
        a.offsetHeight;
        a.style.opacity = `1`;
        await new Promise((e?: any): any => setTimeout(e, i));
      }
      n.autoScroll || n.deferPreviousTeardown
        ? (this.ctx._pendingTeardown = (): any => {
            e.teardown && e.teardown(this.ctx);
          })
        : e.teardown && e.teardown(this.ctx);
      this._activeIndex = t;
      await this._ensureStageReady(n.id);
      this._entering = !0;
      try {
        n.enter && (await n.enter(this.ctx));
      } finally {
        this._entering = !1;
      }
      if (
        (await this._precompileStageMaterials(),
        this._recomputeBounds(),
        !n.autoScroll)
      ) {
        let e: any = this._segmentBounds[t];
        this.ctx.scrollManager.scrollPos = e.start;
        this.ctx.scrollManager.targetScrollPos = e.start;
        this._applySegmentClamp(t);
      }
      if (n.autoScroll) {
        this._clearSegmentClamp();
        let e: any = this._segmentBounds[t];
        this.ctx.scrollManager.scrollPos = e.start;
        this.ctx.scrollManager.targetScrollPos = e.start;
        await this.ctx.scrollManager.startAutoScroll(
          e.end,
          n.autoScrollDuration,
        );
        n.teardown && n.teardown(this.ctx);
        let r: any = t + 1;
        if (r < this.segments.length) {
          this._activeIndex = r;
          let e: any = this.segments[r];
          await this._ensureStageReady(e.id);
          this._entering = !0;
          try {
            e.enter && (await e.enter(this.ctx));
          } finally {
            this._entering = !1;
          }
          await this._precompileStageMaterials();
          this._recomputeBounds();
          e.autoScroll || this._applySegmentClamp(r);
        }
      }
      a &&=
        ((a.style.opacity = `0`),
        await new Promise((e?: any): any => setTimeout(e, i)),
        a.remove(),
        null);
    } catch (e: any) {
      if (
        (console.error(
          `[MasterTimeline] _advanceToNext failed during transition:`,
          e,
        ),
        (a &&= (a.remove(), null)),
        this._activeIndex >= 0 && this._activeIndex < this.segments.length)
      ) {
        let e: any = this.segments[this._activeIndex];
        e && !e.autoScroll && this._applySegmentClamp(this._activeIndex);
      }
    } finally {
      this._isTransitioning = !1;
      this._entering = !1;
      this._updateRulerNavState();
    }
  }
  async _activateSegment(e?: any): Promise<any> {
    if (e < 0 || e >= this.segments.length) return;
    this._activeIndex = e;
    let t: any = this.segments[e];
    this._updateWaitlistBar();
    await this._ensureStageReady(t.id);
    this._entering = !0;
    try {
      t.enter && (await t.enter(this.ctx));
    } finally {
      this._entering = !1;
    }
    if ((await this._precompileStageMaterials(), t.autoScroll)) {
      this._clearSegmentClamp();
      let n: any = this._segmentBounds[e];
      await this.ctx.scrollManager.startAutoScroll(n.end, t.autoScrollDuration);
      t.teardown && t.teardown(this.ctx);
      let r: any = e + 1;
      r < this.segments.length && (await this._activateSegment(r));
    } else this._applySegmentClamp(e);
    this._updateRulerNavState();
  }
  async navigateToSegment(e?: any): Promise<any> {
    if (this._isTransitioning) return;
    let t: any = this.segments.findIndex((t?: any): any => t.id === e);
    if (t < 0 || t === this._activeIndex) return;
    let n: any = this.segments[t];
    if (!n || n.autoScroll) return;
    this._isTransitioning = !0;
    this._holdShown = !1;
    this.ctx.ui &&
      this.ctx.ui.hideNextStageButton &&
      this.ctx.ui.hideNextStageButton();
    this.ctx.hudStatusController &&
      this.ctx.hudStatusController.setIdleSuppressed(!1);
    this.ctx._stage2VideoPrefetch
      ? playStageVideo(this.ctx._stage2VideoPrefetch)
      : this.ctx._stage2Video
        ? playStageVideo(this.ctx._stage2Video)
        : t >= this.segments.findIndex((e?: any): any => e.id === `stage2`) &&
          (this.ctx._stage2VideoPrefetch = createStageVideo(`/`));
    this._updateRulerNavState();
    let { scrollManager: r } = this.ctx;
    r.targetScrollPos = r.scrollPos;
    let i: any = document.createElement(`div`);
    i.className = `stage-nav-overlay`;
    let a: any = document.createElement(`div`);
    a.className = `stage-nav-overlay-loader`;
    let o: any = document.createElement(`span`);
    o.className = `stage-nav-overlay-spinner`;
    o.setAttribute(`aria-hidden`, `true`);
    let s: any = document.createElement(`div`);
    s.className = `stage-nav-overlay-logo`;
    s.setAttribute(`aria-hidden`, `true`);
    let c: any = document.createElement(`img`);
    c.src = `/assets/ui/zero_icon.jpg`;
    c.alt = ``;
    s.appendChild(c);
    a.appendChild(o);
    a.appendChild(s);
    i.appendChild(a);
    document.body.appendChild(i);
    i.offsetHeight;
    i.style.opacity = `1`;
    await new Promise((e?: any): any => setTimeout(e, 600));
    let l: any = audioManager.isEnabled();
    audioManager.setEnabled(!1);
    this.ctx._directNavActive = !0;
    this._resetSceneForChainReplay();
    this.ctx._xpReplaySkip = !0;
    for (let e: any = 0; e < t; e++) {
      let t: any = this.segments[e];
      await this._ensureAssetsForSegment(t.id);
      this._entering = !0;
      try {
        t.enter && (await t.enter(this.ctx));
      } finally {
        this._entering = !1;
      }
      if (t.autoScroll) {
        this.ctx._gateElapsed =
          (t.autoScrollDuration || 0) + (t.fastForwardPreRoll || 0) + 1;
        this.ctx._gate3Elapsed = (t.autoScrollDuration || 0) + 1;
        this.ctx._gateHandElapsed = (t.autoScrollDuration || 0) + 1;
        t.scrub && t.scrub(this.ctx, 1);
        t.update && t.update(this.ctx, 0, 0.016);
      } else if ((t.scrub && t.scrub(this.ctx, 1), t.update))
        for (let e: any = 0; e < 60; e++) t.update(this.ctx, 0, 0.016);
      let n: any = this.segments[e + 1];
      n && (n.autoScroll || n.deferPreviousTeardown)
        ? (this.ctx._pendingTeardown = (): any => {
            t.teardown && t.teardown(this.ctx);
          })
        : t.teardown && t.teardown(this.ctx);
    }
    this.ctx._xpReplaySkip = !1;
    await this._ensureAssetsForSegment(e);
    await this._activateSegment(t);
    let u: any = this._segmentBounds[t];
    u && ((r.scrollPos = u.start), (r.targetScrollPos = u.start));
    this.ctx._directNavActive = !1;
    audioManager.setEnabled(l);
    let d: any = rO[e] || [],
      f: any = new Set(d.map((e?: any): any => e.name));
    for (let e of iO) f.has(e) || audioManager.stop(e);
    for (let e of d)
      audioManager.play(
        e.name,
        e.volume == null
          ? {}
          : {
              volume: e.volume,
            },
      );
    i.style.opacity = `0`;
    await new Promise((e?: any): any => setTimeout(e, 600));
    i.remove();
    this._isTransitioning = !1;
    this._updateRulerNavState();
  }
  _resetSceneForChainReplay(): any {
    let e: any = this.ctx,
      t: any = this.segments[this._activeIndex];
    if (
      (t && t.teardown && t.teardown(e),
      (e._pendingTeardown = null),
      e.fgPass?.uniforms &&
        (gsap.killTweensOf(e.fgPass.uniforms.uOpacity),
        gsap.killTweensOf(e.fgPass.uniforms.uProgress),
        gsap.killTweensOf(e.fgPass.uniforms.uContrast),
        gsap.killTweensOf(e.fgPass.uniforms.uExposure),
        gsap.killTweensOf(e.fgPass.uniforms.uRedTint)),
      e.bgPass?.uniforms &&
        (gsap.killTweensOf(e.bgPass.uniforms.uOpacity),
        gsap.killTweensOf(e.bgPass.uniforms.uProgress)),
      e.lensBlurPass?.uniforms &&
        gsap.killTweensOf(e.lensBlurPass.uniforms.uMaxBlur),
      e._rulerEl && gsap.killTweensOf(e._rulerEl),
      (e.components = {}),
      (e._scrollProgress = 0),
      (e._prevScrollProgress = 0),
      (e._scrollVelocity = 0),
      (e._fgIntroActive = !1),
      (e._trailWhiteKilled = !1),
      (e._ripplePreplayed = !1),
      (e._gateElapsed = 0),
      (e._gate3Elapsed = 0),
      (e._gateShatterStarted = !1),
      (e._gate3Stage4MusicStarted = !1),
      (e._gateZoomT = 0),
      (e._gateHandProgress = null),
      (e._smoothedHandProgress = void 0),
      (e._stage2BgTransitionSet = !1),
      (e._stage1Text1SfxFired = !1),
      (e._preserveStage1Atlas = !1),
      (e._stage3DeferredStarted = !1),
      (e._stage3HoldZoomT = 0),
      (e._stage3CamBaseZ = void 0),
      e.bgPass?.uniforms?.uOpacity && (e.bgPass.uniforms.uOpacity.value = 1),
      e.frostingPass)
    ) {
      e.frostingPass.stopSpread?.();
      e.frostingPass.active = !1;
      let t: any = e.frostingPass.material?.uniforms;
      t &&
        (t.uWhiteout && (t.uWhiteout.value = 0),
        t.uTrailWhite && (t.uTrailWhite.value = 0),
        t.uMelt && (t.uMelt.value = 0),
        t.uCenterWhite && (t.uCenterWhite.value = 0));
    }
  }
  async _ensureAssetsForSegment(e?: any): Promise<any> {
    let t: any = this.ctx.assetLoader;
    if (!t) return;
    let n: any =
      (
        {
          gate0to1: [`mandatory`, `initial`],
          stage1: [`mandatory`, `initial`],
          gate1to2: [`initial`, `stage2`],
          stage2: [`initial`, `stage2`],
          stage3: [`stage2`, `stage3`],
          gate3to4: [`stage4`, `worldMap`],
          stage4: [`stage4`, `worldMap`],
          gate4to5: [`stage4`, `worldMap`],
          stage5: [`stage4`, `worldMap`],
        } as any
      )[e] || [];
    for (let e of n)
      e === `mandatory`
        ? await t.loadMissingMandatory()
        : await t.loadMissingForStage(e);
    t.flushUploads();
  }
  async skipTo(e?: any): Promise<any> {
    let t: any = this.segments.findIndex((t?: any): any => t.id === e);
    if (t < 0) {
      console.warn(`MasterTimeline.skipTo: unknown segment "${e}"`);
      return;
    }
    this.isActive = !0;
    this._recomputeBounds();
    let { scrollManager: n } = this.ctx;
    n.setActiveStage(this);
    this._unsubscribeScrub = n.onScrub((e?: any): any => {
      this._handleScroll(e);
    });
    n.enable();
    for (let e: any = 0; e < t; e++) {
      let t: any = this.segments[e];
      await this._ensureStageReady(t.id);
      this._entering = !0;
      try {
        t.enter && (await t.enter(this.ctx));
      } finally {
        this._entering = !1;
      }
      if (t.autoScroll && t.update) {
        this.ctx._gateElapsed =
          (t.autoScrollDuration || 0) + (t.fastForwardPreRoll || 0) + 1;
        this.ctx._gate3Elapsed = (t.autoScrollDuration || 0) + 1;
        this.ctx._gateHandElapsed = (t.autoScrollDuration || 0) + 1;
        t.scrub && t.scrub(this.ctx, 1);
        t.update(this.ctx, 0, 0.016);
      } else if (!t.autoScroll && (t.scrub && t.scrub(this.ctx, 1), t.update))
        for (let e: any = 0; e < 60; e++) t.update(this.ctx, 0, 0.016);
      t.teardown && t.teardown(this.ctx);
    }
    await this._activateSegment(t);
  }
  getResumeSegmentId(): any {
    if (!this.isActive || this._activeIndex < 0) return null;
    for (let e: any = this._activeIndex; e >= 0; e--) {
      let t: any = this.segments[e];
      if (t && !t.autoScroll) return t.id;
    }
    return null;
  }
  dispose(): any {
    if (
      ((this._unsubscribeScrub &&= (this._unsubscribeScrub(), null)),
      this._activeIndex >= 0 && this._activeIndex < this.segments.length)
    ) {
      let e: any = this.segments[this._activeIndex];
      e.teardown && e.teardown(this.ctx);
    }
    this._ruler &&= (this._ruler.dispose(), null);
    this._waitlistBar &&
      (this._waitlistBar.destroy(),
      (this._waitlistBar = null),
      (this._waitlistBarShown = !1));
    this.isActive = !1;
    this._activeIndex = -1;
  }
};
var oO: any = [
  `.hud-xp`,
  `.hud-audio-btn`,
  `.hud-waitlist-btn`,
  `.hud-menu-btn`,
  `.waitlist-bar`,
  `.hud-menu-dropdown`,
  `.mtl-menu`,
  `.scroll-indicator`,
  `.eg-track`,
  `.s5-joystick`,
  `.s5-pad-btn`,
].join(`,`);
export { iO, StageManager, oO };
