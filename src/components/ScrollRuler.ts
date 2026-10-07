// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { rv, iv, ov, cv, av, sv } from "../rendering/LensBlurPass.ts";
var ScrollRuler = class {
  declare _lastProgress: any;
  declare _center: any;
  declare _onPointerLeave: any;
  declare _onPointerEnter: any;
  declare _navBusy: any;
  declare _onStageClick: any;
  declare _activeStageId: any;
  declare _isHovering: any;
  declare _navEnabled: any;
  declare _navButtons: any;
  declare _nav: any;
  declare _indicator: any;
  declare _invRadius: any;
  declare _radius: any;
  declare _majorTicks: any;
  declare _minorTicks: any;
  declare _track: any;
  declare el: any;
  declare _trackSpan: any;
  constructor(e?: any, t?: any) {
    let n: any = t.reduce((e?: any, t?: any): any => e + t.scrollVh, 0),
      r: any = [],
      i: any = 0,
      a: any = !1;
    for (let e: any = 0; e < t.length; e++) {
      let o: any = t[e];
      if (
        (o.label && (a = !0),
        a &&
          (r.push(
            o.label
              ? {
                  type: `major`,
                  label: o.label,
                  progress: i / n,
                }
              : {
                  type: `minor`,
                  progress: i / n,
                },
          ),
          o.label !== `END`))
      ) {
        let e: any = Math.max(Math.round(o.scrollVh / rv) - 1, 0);
        for (let t: any = 1; t <= e; t++) {
          let a: any = (i + (o.scrollVh * t) / (e + 1)) / n;
          r.push({
            type: `minor`,
            progress: a,
          });
        }
      }
      i += o.scrollVh;
    }
    this._trackSpan = (r.length - 1) * iv;
    this.el = document.createElement(`div`);
    this.el.className = `scroll-ruler`;
    this._track = document.createElement(`div`);
    this._track.className = `scroll-ruler-track`;
    this._track.setAttribute(`aria-hidden`, `true`);
    this._track.style.width = `${this._trackSpan + iv}px`;
    this._minorTicks = [];
    this._majorTicks = [];
    for (let e of r) {
      let t: any = document.createElement(`div`);
      t.className = `ruler-tick ${e.type}`;
      t.style.left = `${e.progress * this._trackSpan - iv / 2}px`;
      let n: any = document.createElement(`span`);
      n.className = `ruler-line`;
      t.appendChild(n);
      let r: any = null;
      e.type === `major` &&
        e.label &&
        ((r = document.createElement(`span`)),
        (r.className = `ruler-label`),
        (r.textContent = e.label),
        t.appendChild(r));
      e.type === `minor`
        ? this._minorTicks.push({
            line: n,
            progress: e.progress,
            _w: ov,
            _atBase: !0,
          })
        : this._majorTicks.push({
            line: n,
            label: r,
            progress: e.progress,
          });
      this._track.appendChild(t);
    }
    let o: any = 0.1;
    if (this._minorTicks.length > 1) {
      let e: any = 0;
      for (let t: any = 1; t < this._minorTicks.length; t++)
        e += this._minorTicks[t].progress - this._minorTicks[t - 1].progress;
      o = e / (this._minorTicks.length - 1);
    }
    this._radius = o * 3;
    this._invRadius = 1 / this._radius;
    this.el.appendChild(this._track);
    this._indicator = document.createElement(`div`);
    this._indicator.className = `scroll-ruler-indicator`;
    this._indicator.setAttribute(`aria-hidden`, `true`);
    this.el.appendChild(this._indicator);
    this._nav = document.createElement(`div`);
    this._nav.className = `scroll-ruler-nav`;
    this._navButtons = new Map();
    for (let { id: e, label: t, navigable: n } of cv) {
      let r: any = n === !1,
        i: any = document.createElement(`button`);
      i.className = `scroll-ruler-nav-btn`;
      r && i.classList.add(`is-static`);
      i.type = `button`;
      i.dataset.segment = e;
      i.setAttribute(`aria-label`, r ? `Stage ${t}` : `Go to stage ${t}`);
      let a: any = document.createElement(`span`);
      a.className = `scroll-ruler-nav-label`;
      a.textContent = t;
      let o: any = document.createElement(`span`);
      o.className = `scroll-ruler-nav-line`;
      let s: any = document.createElement(`span`);
      s.className = `scroll-ruler-nav-spinner`;
      s.setAttribute(`aria-hidden`, `true`);
      i.appendChild(a);
      i.appendChild(o);
      i.appendChild(s);
      r || i.addEventListener(`click`, (): any => this._handleNavClick(e, i));
      this._nav.appendChild(i);
      this._navButtons.set(e, i);
    }
    this.el.appendChild(this._nav);
    this._navEnabled = !1;
    this._isHovering = !1;
    this._activeStageId = null;
    this._onStageClick = null;
    this._navBusy = !1;
    this._onPointerEnter = (): any => {
      this._isHovering = !0;
      this._applyHoverState();
    };
    this._onPointerLeave = (): any => {
      this._isHovering = !1;
      this._applyHoverState();
    };
    this.el.addEventListener(`pointerenter`, this._onPointerEnter);
    this.el.addEventListener(`pointerleave`, this._onPointerLeave);
    e.appendChild(this.el);
    this._center = av / 2;
    this._lastProgress = -1;
    this.update(0);
  }
  setNavEnabled(e?: any): any {
    this._navEnabled = !!e;
    this._navEnabled || (this._isHovering = !1);
    this._applyHoverState();
  }
  setActiveSegment(e?: any): any {
    if (this._activeStageId !== e) {
      this._activeStageId = e;
      for (let [t, n] of this._navButtons)
        n.classList.toggle(`is-active`, t === e);
    }
  }
  onStageClick(e?: any): any {
    this._onStageClick = typeof e == `function` ? e : null;
  }
  _applyHoverState(): any {
    let e: any = this._navBusy || (this._navEnabled && this._isHovering);
    this.el.classList.toggle(`is-hover-nav`, e);
  }
  async _handleNavClick(e?: any, t?: any): Promise<any> {
    if (!this._navBusy && e !== this._activeStageId && this._onStageClick) {
      this._navBusy = !0;
      t.classList.add(`is-loading`);
      this._applyHoverState();
      for (let e of this._navButtons.values()) e.disabled = !0;
      try {
        await this._onStageClick(e);
      } finally {
        t.classList.remove(`is-loading`);
        for (let e of this._navButtons.values()) e.disabled = !1;
        this._navBusy = !1;
        this._applyHoverState();
      }
    }
  }
  update(e?: any, t: any = !1): any {
    if (!t && Math.abs(e - this._lastProgress) < 1e-5) return;
    this._lastProgress = e;
    this._track.style.transform = `translateX(${this._center - e * this._trackSpan}px)`;
    let { _radius: n, _invRadius: r } = this,
      i: any = sv - ov;
    for (let t of this._minorTicks) {
      let a: any = Math.abs(t.progress - e);
      if (a >= n) {
        t._atBase ||= ((t.line.style.transform = `scaleY(1)`), (t._w = ov), !0);
        continue;
      }
      t._atBase = !1;
      let o: any = a * r,
        s: any = o * o * (3 - 2 * o),
        c: any = Math.round((sv - i * s) * 10) / 10;
      c !== t._w &&
        ((t.line.style.transform = `scaleY(${c / ov})`), (t._w = c));
    }
  }
  dispose(): any {
    this.el &&
      (this.el.removeEventListener(`pointerenter`, this._onPointerEnter),
      this.el.removeEventListener(`pointerleave`, this._onPointerLeave),
      this.el.parentNode && this.el.parentNode.removeChild(this.el));
    this._navButtons = null;
    this._onStageClick = null;
  }
};
var uv: any = 100;
var dv: any = 25;
var fv: any = 128;
export { ScrollRuler, uv, dv, fv };
