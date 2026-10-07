// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { gsap } from "gsap";
import { audioManager } from "../audio/AudioManager.ts";
var HoldButton = class {
  declare _label: any;
  declare _hit: any;
  declare _progressCircumference: any;
  declare _progressCircle: any;
  declare btn: any;
  declare _wrapper: any;
  declare _activeHoldAudio: any;
  declare _holdUpHandler: any;
  declare _holdDownHandler: any;
  declare _clickHandler: any;
  constructor(e?: any) {
    this._buildDom(e);
    this._clickHandler = null;
    this._holdDownHandler = null;
    this._holdUpHandler = null;
    this._activeHoldAudio = null;
  }
  _buildDom(e?: any): any {
    this._wrapper = document.createElement(`div`);
    this._wrapper.className = `next-stage-trigger`;
    let t: any = document.createElement(`div`);
    t.className = `next-stage-btn-stroke`;
    this._wrapper.appendChild(t);
    this.btn = document.createElement(`button`);
    this.btn.className = `next-stage-btn`;
    this.btn.setAttribute(`aria-label`, `Continue to next stage`);
    this._wrapper.insertAdjacentHTML(
      `beforeend`,
      `<svg class="next-stage-btn-progress" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46"/></svg>`,
    );
    this._progressCircle = this._wrapper.querySelector(
      `.next-stage-btn-progress circle`,
    );
    this._progressCircumference = 2 * Math.PI * 46;
    this._progressCircle.style.strokeDasharray = this._progressCircumference;
    this._progressCircle.style.strokeDashoffset = this._progressCircumference;
    this._hit = document.createElement(`span`);
    this._hit.className = `next-stage-hit`;
    this._hit.setAttribute(`aria-hidden`, `true`);
    this.btn.appendChild(this._hit);
    this._wrapper.appendChild(this.btn);
    this._label = document.createElement(`div`);
    this._label.className = `next-stage-label`;
    this._wrapper.appendChild(this._label);
    e.appendChild(this._wrapper);
  }
  show(e?: any): any {
    this._removeListeners();
    let t: any =
      typeof e == `function`
        ? {
            onComplete: e,
          }
        : e || {};
    this._wrapper.style.display = `block`;
    this._label &&
      ((this._label.textContent = t.label || ``),
      (this._label.style.display = t.label ? `block` : `none`));
    gsap.killTweensOf([this._wrapper, this.btn], `opacity`);
    gsap.set(this._wrapper, {
      opacity: 1,
    });
    gsap.to(this.btn, {
      opacity: 1,
      duration: 0.4,
    });
    this.setProgress(0);
    t.holdDuration && t.holdDuration > 0
      ? this._attachHoldMode(t)
      : ((this._clickHandler = (): any => {
          this._removeListeners();
          t.onComplete && t.onComplete();
        }),
        this._hit.addEventListener(`click`, this._clickHandler));
  }
  hide(): any {
    this._removeListeners();
    gsap.killTweensOf([this._wrapper, this.btn], `opacity`);
    gsap.to(this._wrapper, {
      opacity: 0,
      duration: 0.3,
      onComplete: (): any => {
        this._wrapper.style.display = `none`;
      },
    });
  }
  fadeOut(): any {
    gsap.killTweensOf(this.btn, `opacity`);
    gsap.to(this.btn, {
      opacity: 0,
      duration: 0.2,
    });
  }
  fadeIn(): any {
    gsap.killTweensOf(this.btn, `opacity`);
    gsap.to(this.btn, {
      opacity: 1,
      duration: 0.3,
    });
  }
  setProgress(e?: any): any {
    if (!this._progressCircle) return;
    gsap.killTweensOf(this._progressCircle, `strokeDashoffset`);
    let t: any = e < 0 ? 0 : e > 1 ? 1 : e;
    this._progressCircle.style.strokeDashoffset =
      this._progressCircumference * (1 - t);
  }
  getActiveRect(): any {
    let e: any = this._wrapper;
    return !e || e.style.display === `none` ? null : e.getBoundingClientRect();
  }
  resetProgress(): any {
    this._progressCircle &&
      (gsap.killTweensOf(this._progressCircle, `strokeDashoffset`),
      gsap.to(this._progressCircle, {
        strokeDashoffset: this._progressCircumference,
        duration: 0.3,
        ease: `power2.out`,
      }));
  }
  _attachHoldMode({
    holdDuration: e,
    onStart: t,
    onProgress: n,
    onComplete: r,
    onCancel: i,
    holdAudio: a = `hold-button`,
  }: any): any {
    let o: any = !1,
      s: any = 0,
      c: any = null,
      l: any = null,
      u: any = 0,
      d: any = 0,
      f: any = a ? audioManager.getDuration(a) : null,
      p: any =
        (f ? f / e : 1) *
        (a ? (audioManager.getTrackOption(a, `holdRateScale`) ?? 1) : 1);
    this._activeHoldAudio = a;
    let m: any = (): any => {
        if (!o) return;
        let t: any = (performance.now() - s) / 1e3,
          i: any = Math.min(t / e, 1);
        if ((n && n(i, t), i >= 1)) {
          o = !1;
          c = null;
          u = 0;
          d = 0;
          this._removeListeners();
          r && r();
          return;
        }
        c = requestAnimationFrame(m);
      },
      h: any = (n?: any): any => {
        if (o) return;
        n.preventDefault();
        o = !0;
        l = n.pointerId === void 0 ? null : n.pointerId;
        let r: any = performance.now(),
          i: any = 0;
        if (d > 0) {
          let e: any = r - d;
          e < 500 && (i = u * (1 - e / 500));
        }
        if (
          ((s = r - i * e * 1e3),
          (u = 0),
          (d = 0),
          a &&
            audioManager.play(a, {
              seek: i * (f || e),
              rate: p,
            }),
          t &&
            t({
              resumeT: i,
            }),
          n.pointerId !== void 0 && this._hit.setPointerCapture)
        )
          try {
            this._hit.setPointerCapture(n.pointerId);
          } catch {}
        c = requestAnimationFrame(m);
      },
      g: any = (t?: any): any => {
        if (
          !o ||
          (l != null && t && t.pointerId !== void 0 && t.pointerId !== l)
        )
          return;
        o = !1;
        l = null;
        c !== null && cancelAnimationFrame(c);
        c = null;
        let n: any = (performance.now() - s) / 1e3;
        u = Math.min(n / e, 1);
        d = performance.now();
        a &&
          audioManager.stop(a, {
            fadeOut: 0.1,
          });
        i && i();
      };
    this._holdDownHandler = h;
    this._holdUpHandler = g;
    this._hit.addEventListener(`pointerdown`, h);
    document.addEventListener(`pointerup`, g);
    document.addEventListener(`pointercancel`, g);
  }
  _removeListeners(): any {
    this._clickHandler &&=
      (this._hit.removeEventListener(`click`, this._clickHandler), null);
    this._holdDownHandler &&=
      (this._hit.removeEventListener(`pointerdown`, this._holdDownHandler),
      null);
    this._holdUpHandler &&=
      (document.removeEventListener(`pointerup`, this._holdUpHandler),
      document.removeEventListener(`pointercancel`, this._holdUpHandler),
      null);
    this._activeHoldAudio &&=
      (audioManager.stop(this._activeHoldAudio, {
        fadeOut: 0,
      }),
      null);
  }
  dispose(): any {
    this._removeListeners();
    this._wrapper &&
      this._wrapper.parentNode &&
      this._wrapper.parentNode.removeChild(this._wrapper);
  }
};
export { HoldButton };
