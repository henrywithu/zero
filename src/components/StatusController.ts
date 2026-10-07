// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { Aw } from "../services/waitlistState.ts";
var HO: any = 3e3;
var StatusController = class {
  declare _renderedKey: any;
  declare _pins: any;
  declare _idleSuppressed: any;
  declare _idleReady: any;
  declare _idleMs: any;
  declare _idleTimer: any;
  declare _scrubUnsub: any;
  declare _idleActive: any;
  declare _ui: any;
  constructor(e?: any) {
    this._ui = e;
    this._idleActive = !1;
    this._scrubUnsub = null;
    this._idleTimer = null;
    this._idleMs = HO;
    this._idleReady = !1;
    this._idleSuppressed = !1;
    this._pins = [];
    this._renderedKey = null;
  }
  activate(e?: any, t: any = HO): any {
    this._idleActive ||
      ((this._idleActive = !0),
      (this._idleMs = t),
      (this._scrubUnsub = e.onScrub((): any => this._onScroll())),
      this._scheduleIdleShow());
  }
  deactivate(): any {
    this._idleActive &&
      ((this._idleActive = !1),
      (this._scrubUnsub &&= (this._scrubUnsub(), null)),
      (this._idleTimer &&= (clearTimeout(this._idleTimer), null)),
      (this._idleReady = !1),
      this._render());
  }
  pin(e?: any, t?: any, n: any = {}): any {
    this._pins = this._pins.filter((t?: any): any => t.id !== e);
    this._pins.push({
      id: e,
      text: t,
      chevron: n.chevron !== !1,
    });
    this._render();
  }
  unpin(e?: any): any {
    let t: any = this._pins.length;
    this._pins = this._pins.filter((t?: any): any => t.id !== e);
    this._pins.length !== t && this._render();
  }
  _onScroll(): any {
    this._idleReady = !1;
    this._render();
    this._scheduleIdleShow();
  }
  _scheduleIdleShow(): any {
    this._idleTimer && clearTimeout(this._idleTimer);
    this._idleTimer = setTimeout((): any => {
      this._idleTimer = null;
      this._idleActive && ((this._idleReady = !0), this._render());
    }, this._idleMs);
  }
  setIdleSuppressed(e?: any): any {
    e = !!e;
    this._idleSuppressed !== e && ((this._idleSuppressed = e), this._render());
  }
  _render(): any {
    let e: any, t: any, n: any;
    if (this._pins.length > 0) {
      let r: any = this._pins[this._pins.length - 1];
      e = `pin:${r.id}`;
      t = r.text;
      n = r.chevron;
    } else
      e =
        this._idleActive && this._idleReady && !this._idleSuppressed
          ? `idle`
          : `hidden`;
    if (e !== this._renderedKey) {
      if (((this._renderedKey = e), e === `idle`)) {
        this._ui.hideStatus(0);
        this._ui.showScrollIndicator();
        return;
      }
      if ((this._ui.hideScrollIndicator(0), e === `hidden`)) {
        this._ui.hideStatus(0);
        return;
      }
      this._ui.updateStatus(t, {
        chevron: n,
      });
      this._ui.showStatus();
    }
  }
  dispose(): any {
    this.deactivate();
    this._pins = [];
    this._renderedKey = null;
  }
};
Aw();
((): any => {
  try {
    console.log(
      `Trapnest Zero — a world by Henry. Original experience design: Zero University; development: BUNQ LABS.`,
    );
  } catch {}
})();
export { HO, StatusController };
