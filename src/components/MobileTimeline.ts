// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { uv, dv, fv } from "./ScrollRuler.ts";
var MobileTimeline = class {
  declare _lastProgress: any;
  declare _onTap: any;
  declare _menuButtons: any;
  declare _menu: any;
  declare _outsideClose: any;
  declare _menuOpen: any;
  declare _navBusy: any;
  declare _onStageClick: any;
  declare _activeStageId: any;
  declare _navEnabled: any;
  declare _lastBz: any;
  declare _count: any;
  declare _fills: any;
  declare el: any;
  declare _nBars: any;
  declare _starts: any;
  constructor(e?: any, t?: any) {
    let n: any = t.reduce((e?: any, t?: any): any => e + t.scrollVh, 0) || 1,
      r: any = [],
      i: any = [],
      a: any = 0;
    for (let e of t) {
      e.label &&
        (r.push(a / n),
        i.push({
          id: e.id,
          label: e.label,
        }));
      a += e.scrollVh;
    }
    this._starts = r;
    this._nBars = Math.max(r.length - 1, 0);
    this.el = document.createElement(`div`);
    this.el.className = `mobile-timeline`;
    this.el.setAttribute(`aria-hidden`, `true`);
    let o: any = document.createElement(`div`);
    o.className = `mtl-bars`;
    this._fills = [];
    for (let e: any = 0; e < this._nBars; e++) {
      let e: any = document.createElement(`span`);
      e.className = `mtl-bar`;
      let t: any = document.createElement(`span`);
      t.className = `mtl-fill`;
      e.appendChild(t);
      o.appendChild(e);
      this._fills.push({
        el: t,
        _q: 0,
      });
    }
    this.el.appendChild(o);
    this._count = document.createElement(`span`);
    this._count.className = `mtl-count`;
    this._count.textContent = `${uv} BZ`;
    this._lastBz = uv;
    this.el.appendChild(this._count);
    e.appendChild(this.el);
    this._navEnabled = !1;
    this._activeStageId = null;
    this._onStageClick = null;
    this._navBusy = !1;
    this._menuOpen = !1;
    this._outsideClose = null;
    this._menu = document.createElement(`div`);
    this._menu.className = `mtl-menu`;
    this._menu.setAttribute(`role`, `menu`);
    this._menuButtons = new Map();
    for (let { id: e, label: t } of i) {
      let n: any = document.createElement(`button`);
      n.type = `button`;
      n.className = `mtl-menu-item`;
      n.dataset.segment = e;
      n.setAttribute(`aria-label`, `Go to stage ${t}`);
      let r: any = document.createElement(`span`);
      r.className = `mtl-menu-label`;
      r.textContent = t.replace(/^-/, ``);
      let i: any = document.createElement(`span`);
      i.className = `mtl-menu-spinner`;
      i.setAttribute(`aria-hidden`, `true`);
      n.appendChild(r);
      n.appendChild(i);
      n.addEventListener(`click`, (t?: any): any => {
        t.stopPropagation();
        this._handleNavClick(e, n);
      });
      this._menu.appendChild(n);
      this._menuButtons.set(e, n);
    }
    document.body.appendChild(this._menu);
    this._onTap = (): any => {
      this._menuOpen ? this._closeMenu() : this._navEnabled && this._openMenu();
    };
    this.el.addEventListener(`click`, this._onTap);
    this._lastProgress = -1;
    this.update(0);
  }
  setNavEnabled(e?: any): any {
    this._navEnabled = !!e;
    !this._navEnabled && this._menuOpen && !this._navBusy && this._closeMenu();
  }
  setActiveSegment(e?: any): any {
    if (this._activeStageId !== e) {
      this._activeStageId = e;
      for (let [t, n] of this._menuButtons)
        n.classList.toggle(`is-active`, t === e);
    }
  }
  onStageClick(e?: any): any {
    this._onStageClick = typeof e == `function` ? e : null;
  }
  _openMenu(): any {
    if (this._menuOpen) return;
    this._menuOpen = !0;
    let e: any = this.el.getBoundingClientRect();
    this._menu.style.top = `${Math.round(e.bottom + 10)}px`;
    this._menu.style.right = `${Math.round(window.innerWidth - e.right)}px`;
    this._menu.classList.add(`is-open`);
    this._armOutsideClose();
  }
  _closeMenu(e: any = !1): any {
    this._menuOpen &&
      ((this._navBusy && !e) ||
        ((this._menuOpen = !1),
        this._menu.classList.remove(`is-open`),
        this._disarmOutsideClose()));
  }
  _armOutsideClose(): any {
    this._outsideClose ||
      ((this._outsideClose = (e?: any): any => {
        this.el.contains(e.target) ||
          this._menu.contains(e.target) ||
          this._closeMenu();
      }),
      setTimeout((): any => {
        this._outsideClose &&
          document.addEventListener(`click`, this._outsideClose);
      }, 0));
  }
  _disarmOutsideClose(): any {
    this._outsideClose &&=
      (document.removeEventListener(`click`, this._outsideClose), null);
  }
  async _handleNavClick(e?: any, t?: any): Promise<any> {
    if (!this._navBusy) {
      if (e === this._activeStageId) {
        this._closeMenu();
        return;
      }
      if (this._onStageClick) {
        this._navBusy = !0;
        t.classList.add(`is-loading`);
        for (let e of this._menuButtons.values()) e.disabled = !0;
        try {
          await this._onStageClick(e);
        } finally {
          t.classList.remove(`is-loading`);
          for (let e of this._menuButtons.values()) e.disabled = !1;
          this._navBusy = !1;
          this._closeMenu(!0);
        }
      }
    }
  }
  update(e?: any, t: any = !1): any {
    if (!t && Math.abs(e - this._lastProgress) < 1e-5) return;
    this._lastProgress = e;
    let n: any = this._starts,
      r: any = this._nBars;
    if (r === 0) return;
    let i: any;
    if (e <= n[0]) {
      i = uv;
      this._setFills(-1, 0);
    } else if (e >= n[r]) {
      i = 0;
      this._setFills(r, 0);
    } else {
      let t: any = 0;
      for (; t < r - 1 && e >= n[t + 1];) t++;
      let a: any = n[t + 1] - n[t] || 1,
        o: any = (e - n[t]) / a;
      i = uv - (t + o) * dv;
      this._setFills(t, o);
    }
    let a: any = Math.round(i);
    a !== this._lastBz &&
      ((this._lastBz = a), (this._count.textContent = `${a} BZ`));
  }
  _setFills(e?: any, t?: any): any {
    for (let n: any = 0; n < this._nBars; n++) {
      let r: any = n < e ? fv : n > e ? 0 : Math.round(t * fv),
        i: any = this._fills[n];
      i._q !== r && ((i._q = r), (i.el.style.transform = `scaleX(${r / fv})`));
    }
  }
  dispose(): any {
    this._disarmOutsideClose();
    this.el &&
      (this.el.removeEventListener(`click`, this._onTap),
      this.el.parentNode && this.el.parentNode.removeChild(this.el));
    this._menu &&
      this._menu.parentNode &&
      this._menu.parentNode.removeChild(this._menu);
    this._menu = null;
    this._menuButtons = null;
    this._onStageClick = null;
    this._fills = null;
    this._count = null;
  }
};
export { MobileTimeline };
