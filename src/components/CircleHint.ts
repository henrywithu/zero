// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { yO, bO, xO, SO } from "./LoaderTextOverlay.ts";
import { gsap } from "gsap";
import { AC, kC } from "../input/cursors.ts";
var CircleHint = class {
  declare _tickFn: any;
  declare _history: any;
  declare _cumAngle: any;
  declare _demoTween: any;
  declare _demoActive: any;
  declare _handleAngle: any;
  declare _handle: any;
  declare _ring: any;
  declare _stage: any;
  declare _container: any;
  declare _cursorState: any;
  declare _canvas: any;
  constructor(
    e: any = null,
    t: any = document.getElementById(`ui-container`) || document.body,
  ) {
    this._canvas = e;
    this._cursorState = `none`;
    this._container = document.createElement(`div`);
    this._container.className = `loader-circle-hint`;
    this._container.setAttribute(`aria-hidden`, `true`);
    let n: any = document.createElement(`div`);
    n.className = `loader-circle-stage`;
    this._stage = n;
    this._ring = document.createElement(`div`);
    this._ring.className = `loader-circle-ring`;
    n.appendChild(this._ring);
    this._handle = document.createElement(`div`);
    this._handle.className = `loader-circle-handle`;
    n.appendChild(this._handle);
    this._container.appendChild(n);
    t.appendChild(this._container);
    this._handleAngle = yO;
    this._updateHandle();
    this._demoActive = !1;
    this._demoTween = null;
    this._cumAngle = yO;
    this._history = [];
    this._tickFn = null;
  }
  show(): any {
    this._container.classList.add(`is-visible`);
    this._setCursor(`grab`);
    this._startDemo();
  }
  hide(): any {
    this._container.classList.remove(`is-visible`);
    this._stopDemo();
    this._handleAngle !== yO &&
      ((this._handleAngle = yO), this._updateHandle());
    this._setCursor(`none`);
  }
  setPointer(e?: any, t?: any, n?: any): any {
    n
      ? (this._stopDemo(),
        this._container.classList.add(`is-dragging`),
        this._setCursor(`grabbed`))
      : (this._container.classList.remove(`is-dragging`),
        this._demoActive || this._startDemo(),
        this._setCursor(`grab`));
  }
  _startDemo(): any {
    this._demoActive ||
      ((this._demoActive = !0),
      this._container.classList.add(`is-demo`),
      (this._history.length = 0),
      (this._cumAngle = yO),
      (this._handleAngle = yO),
      this._updateHandle(),
      this._tickFn ||
        ((this._tickFn = (): any => this._updateTrail()),
        gsap.ticker.add(this._tickFn)),
      this._demoSweep());
  }
  _stopDemo(): any {
    this._demoActive = !1;
    this._container.classList.remove(`is-demo`);
    this._tickFn &&= (gsap.ticker.remove(this._tickFn), null);
    this._demoTween &&= (this._demoTween.kill(), null);
    this._history.length = 0;
  }
  _demoSweep(): any {
    if (!this._demoActive) return;
    let e: any = this._cumAngle,
      t: any = {
        a: e,
      };
    this._demoTween = gsap.to(t, {
      a: e + Math.PI * 2,
      duration: bO,
      ease: `sine.inOut`,
      onUpdate: (): any => {
        this._cumAngle = t.a;
        this._handleAngle = t.a;
        this._updateHandle();
      },
      onComplete: (): any => {
        this._demoActive &&
          (this._demoTween = gsap.delayedCall(xO, (): any => {
            this._demoActive && this._demoSweep();
          }));
      },
    });
  }
  _updateTrail(): any {
    let e: any = performance.now(),
      t: any = this._cumAngle;
    this._history.push({
      t: e,
      a: t,
    });
    let n: any = e - SO - 100;
    for (; this._history.length > 2 && this._history[0].t < n;)
      this._history.shift();
    let r: any = t - this._sampleHistory(e - SO);
    r < 0 && (r = 0);
    let i: any = Math.min(360, (r * 180) / Math.PI),
      a: any = ((t - yO) * 180) / Math.PI;
    this._ring.style.transform = `rotate(${a}deg)`;
    this._ring.style.background = this._cometGradient(i);
  }
  _sampleHistory(e?: any): any {
    let t: any = this._history;
    if (t.length === 0) return this._cumAngle;
    if (e <= t[0].t) return t[0].a;
    for (let n: any = t.length - 1; n >= 0; n--)
      if (t[n].t <= e) {
        let r: any = t[n],
          i: any = t[n + 1] || r,
          a: any = i.t - r.t,
          o: any = a > 0 ? (e - r.t) / a : 0;
        return r.a + (i.a - r.a) * o;
      }
    return t[t.length - 1].a;
  }
  _cometGradient(e?: any): any {
    return `conic-gradient(from 0deg, rgba(255,255,255,0.85) 0deg, rgba(255,255,255,0) 4deg, rgba(255,255,255,0) ${Math.max(5, 360 - Math.max(0, Math.min(360, e))).toFixed(2)}deg, rgba(255,255,255,0.85) 360deg)`;
  }
  resize(): any {
    this._updateHandle();
  }
  _updateHandle(): any {
    let e: any = (this._stage.offsetHeight || window.innerHeight * 0.4) * 0.5,
      t: any = Math.cos(this._handleAngle) * e,
      n: any = Math.sin(this._handleAngle) * e;
    this._handle.style.transform = `translate3d(${t}px, ${n}px, 0)`;
  }
  _setCursor(e?: any): any {
    e !== this._cursorState &&
      ((this._cursorState = e),
      this._canvas &&
        (e === `grabbed`
          ? (this._canvas.style.cursor = AC())
          : e === `grab`
            ? (this._canvas.style.cursor = kC())
            : (this._canvas.style.cursor = ``)));
  }
  dispose(): any {
    this._stopDemo();
    this._container.parentNode &&
      this._container.parentNode.removeChild(this._container);
    this._setCursor(`none`);
  }
};
export { CircleHint };
