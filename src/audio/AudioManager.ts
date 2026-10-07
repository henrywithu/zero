// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import * as howlerPackage from "howler";
const howler: any = howlerPackage;
howler.Howler.autoSuspend = !1;
howler.Howler.autoUnlock = !0;
var yg: any = 22050;
var bg: any = 750;
var xg: any = 350;
var Sg: any = `/`;
var Cg: any = 0.4;
var audioTracks: any = {
  "stage1-ambient": {
    src: `${Sg}assets/audio/amb_stage1.mp3`,
    type: `ambient`,
    loop: !0,
    volume: 0.55,
    fadeIn: 1.5,
    fadeOut: 2.5,
    preload: !0,
    startOn: `firstTouch`,
  },
  "stage2-ambient": {
    src: `${Sg}assets/audio/amb_stage2-3.mp3`,
    type: `ambient`,
    loop: !0,
    volume: 0.55,
    fadeIn: 2,
    fadeOut: 1.5,
    preload: !0,
  },
  "loader-drag": {
    src: `${Sg}assets/audio/fx_loader-drag.mp3`,
    type: `fx`,
    loop: !0,
    volume: 0.255,
    fadeIn: 0.12,
    fadeOut: 0.25,
    preload: !0,
  },
  "hand-entry": {
    src: `${Sg}assets/audio/fx_hand-entry.mp3`,
    type: `fx`,
    loop: !1,
    volume: 0.8,
    fadeIn: 0,
    fadeOut: 0.1,
    preload: !0,
  },
  whoosh: {
    src: `${Sg}assets/audio/fx_whoosh.mp3`,
    type: `fx`,
    loop: !1,
    volume: 0.6,
    fadeIn: 0,
    fadeOut: 0.1,
    preload: !0,
    muffleable: !1,
  },
  click: {
    src: `${Sg}assets/audio/fx_click.mp3`,
    type: `fx`,
    loop: !1,
    volume: 0.25,
    fadeIn: 0,
    fadeOut: 0.05,
    preload: !0,
    muffleable: !1,
  },
  loader: {
    src: `${Sg}assets/audio/fx_loader.mp3`,
    type: `fx`,
    loop: !1,
    volume: 0.8,
    fadeIn: 0,
    fadeOut: 0.1,
    preload: !0,
  },
  "xp-topup": {
    src: `${Sg}assets/audio/fx_xp-topup.mp3`,
    type: `fx`,
    loop: !1,
    volume: 0.35,
    fadeIn: 0,
    fadeOut: 0.05,
    preload: !0,
  },
  tunnel: {
    src: `${Sg}assets/audio/fx_tunnel.mp3`,
    type: `fx`,
    loop: !1,
    volume: 1,
    fadeIn: 0,
    fadeOut: 0.15,
    preload: !0,
  },
  "glass-shatter": {
    src: `${Sg}assets/audio/fx_glass-shatter.mp3`,
    type: `fx`,
    loop: !1,
    volume: 0.85,
    fadeIn: 0,
    fadeOut: 0.1,
    preload: !0,
  },
  "hold-button": {
    src: `${Sg}assets/audio/fx_hold-button.mp3`,
    type: `fx`,
    loop: !1,
    volume: 0.75,
    fadeIn: 0.04,
    fadeOut: 0.08,
    preload: !0,
    holdRateScale: 0.75,
  },
  "money-burn": {
    src: `${Sg}assets/audio/fx_money-burn.mp3`,
    type: `fx`,
    loop: !0,
    volume: 0.05,
    fadeIn: 0.05,
    fadeOut: 0.25,
    preload: !1,
  },
  "stage4-ambient": {
    src: `${Sg}assets/audio/amb_stage4-5.mp3`,
    type: `ambient`,
    loop: !0,
    volume: 1,
    fadeIn: 2,
    fadeOut: 1.5,
    preload: !0,
  },
  "stage5-ambient": {
    src: `${Sg}assets/audio/amb_stage5.mp3`,
    type: `ambient`,
    loop: !0,
    volume: 0.7,
    fadeIn: 2,
    fadeOut: 1.5,
    preload: !0,
  },
};
var audioManager: any = new (class {
  declare _muffleAmount: any;
  declare _muffleNodes: any;
  declare _ambientActive: any;
  declare _ctxWatch: any;
  declare _armed: any;
  declare _enabled: any;
  declare _stopTimers: any;
  declare _activeIds: any;
  declare _howls: any;
  constructor() {
    this._howls = new Map();
    this._activeIds = new Map();
    this._stopTimers = new Map();
    this._enabled = !0;
    this._armed = !1;
    this._ctxWatch = null;
    this._ambientActive = new Set();
    this._muffleNodes = null;
    this._muffleAmount = 0;
  }
  arm(): any {
    if (!this._armed) {
      this._armed = !0;
      for (let e in audioTracks) {
        let t: any = audioTracks[e];
        t.startOn === `firstTouch` &&
          t.type === `ambient` &&
          this._ambientActive.add(e);
      }
      this._notifyStateChange();
    }
    this._unlock();
  }
  _unlock(): any {
    let e: any = howler.Howler.ctx;
    if (!e || this.isUnlocked()) {
      this._startBeds();
      return;
    }
    try {
      let t: any = e.createBuffer(1, 1, 22050),
        n: any = e.createBufferSource();
      n.buffer = t;
      n.connect(e.destination);
      n.start(0);
    } catch {}
    try {
      typeof howler.Howler._autoResume == `function` &&
        howler.Howler._autoResume();
    } catch {}
    typeof e.resume == `function` &&
      e
        .resume()
        .then((): any => this._startBeds())
        .catch((): any => {});
    this._ctxWatch ||
      ((this._ctxWatch = (): any => {
        if (!(!howler.Howler.ctx || howler.Howler.ctx.state !== `running`)) {
          try {
            howler.Howler.state !== `running` &&
              typeof howler.Howler._autoResume == `function` &&
              howler.Howler._autoResume();
          } catch {}
          this._startBeds();
          setTimeout((): any => this._startBeds(), 60);
        }
      }),
      e.addEventListener(`statechange`, this._ctxWatch));
  }
  unlockNow(): any {
    this.preload();
    this.arm();
  }
  _startBeds(): any {
    if (!(!this._armed || !this._enabled)) {
      for (let e of this._ambientActive) this._playInternal(e);
      for (let [e, t] of this._howls.entries()) {
        let n: any = audioTracks[e];
        n &&
          n.type === `ambient` &&
          !this._ambientActive.has(e) &&
          t.playing() &&
          this._stopHowl(e, {
            fadeOut: 0.4,
          });
      }
    }
  }
  isArmed(): any {
    return this._armed;
  }
  isEnabled(): any {
    return this._enabled;
  }
  isUnlocked(): any {
    return !!(
      howler.Howler.ctx &&
      howler.Howler.ctx.state === `running` &&
      howler.Howler.state === `running`
    );
  }
  _purgeDeferredPlays(e?: any): any {
    try {
      e.off(`resume`);
    } catch {}
  }
  isAmbientPlaying(): any {
    return this._armed && this._enabled && this._ambientActive.size > 0;
  }
  setEnabled(e?: any): any {
    if (((e = !!e), e !== this._enabled)) {
      if (((this._enabled = e), howler.Howler.mute(!e), e)) {
        if (this._armed)
          for (let e of this._ambientActive)
            this._playInternal(e, {
              fadeIn: Cg,
            });
      } else {
        for (let e of this._stopTimers.values()) clearTimeout(e);
        this._stopTimers.clear();
        for (let e of this._howls.values()) {
          this._purgeDeferredPlays(e);
          try {
            e._playLock || e.stop();
          } catch {}
        }
        this._activeIds.clear();
      }
      this._notifyStateChange();
    }
  }
  preload(): any {
    for (let e in audioTracks) audioTracks[e].preload && this._get(e);
  }
  decodeAll(): any {
    return Promise.all(
      Object.keys(audioTracks).map(
        (e?: any): any =>
          new Promise((t?: any): any => {
            let n: any = this._get(e);
            if (!n || n.state() === `loaded`) return t();
            n.once(`load`, (): any => t());
            n.once(`loaderror`, (n?: any, r?: any): any => {
              console.warn(`[AudioManager] decode failed: ${e}`, r);
              t();
            });
          }),
      ),
    );
  }
  play(e?: any, t: any = {}): any {
    let n: any = audioTracks[e];
    if (n) {
      if (n.type === `ambient`) {
        let t: any = this._ambientActive.has(e);
        this._ambientActive.add(e);
        t || this._notifyStateChange();
      }
      !this._armed || !this._enabled || this._playInternal(e, t);
    }
  }
  stop(e?: any, t: any = {}): any {
    let n: any = audioTracks[e];
    if (!n) return;
    let r: any = !1;
    n.type === `ambient` && (r = this._ambientActive.delete(e));
    this._stopHowl(e, t);
    r && this._notifyStateChange();
  }
  pause(e?: any): any {
    let t: any = this._howls.get(e);
    if (!t) return;
    let n: any = this._activeIds.get(e);
    n != null && t.pause(n);
  }
  getDuration(e?: any): any {
    let t: any = this._howls.get(e);
    if (!t) return null;
    let n: any = t.duration();
    return n > 0 ? n : null;
  }
  getTrackOption(e?: any, t?: any): any {
    let n: any = audioTracks[e];
    return n ? n[t] : void 0;
  }
  setLevel(e?: any, t?: any): any {
    let n: any = this._howls.get(e);
    if (!n) return;
    let r: any = this._activeIds.get(e);
    r != null &&
      (t.volume != null && n.volume(t.volume, r),
      t.rate != null && n.rate(t.rate, r));
  }
  playInstance(e?: any, t: any = {}): any {
    let n: any = audioTracks[e];
    if (!n || !this._armed || !this._enabled || !this.isUnlocked()) return null;
    let r: any = this._get(e);
    if (!r) return null;
    let i: any = t.volume ?? n.volume ?? 1,
      a: any = ((t.fadeIn ?? n.fadeIn ?? 0) * 1e3) | 0,
      o: any = r.play();
    r.volume(0, o);
    t.seek != null && r.seek(t.seek, o);
    t.rate != null && r.rate(t.rate, o);
    a > 0 ? r.fade(0, i, a, o) : r.volume(i, o);
    return o;
  }
  setInstanceLevel(e?: any, t?: any, n?: any): any {
    let r: any = this._howls.get(e);
    !r ||
      t == null ||
      (n.volume != null && r.volume(n.volume, t),
      n.rate != null && r.rate(n.rate, t));
  }
  stopInstance(e?: any, t?: any, n: any = {}): any {
    let r: any = audioTracks[e];
    if (!r) return;
    let i: any = this._howls.get(e);
    if (!i || t == null) return;
    let a: any = ((n.fadeOut ?? r.fadeOut ?? 0) * 1e3) | 0,
      o: any = i.volume(t);
    if (a <= 0 || o <= 0) {
      i.stop(t);
      return;
    }
    i.fade(o, 0, a, t);
    setTimeout((): any => i.stop(t), a);
  }
  _muffleCutoffFor(e?: any): any {
    let t: any = Math.max(0, Math.min(1, e)),
      n: any = (e?: any, t?: any, n?: any): any => e * (t / e) ** +n;
    return t <= 0.5 ? n(yg, bg, t * 2) : n(bg, xg, (t - 0.5) * 2);
  }
  _ensureMuffleNodes(): any {
    if (this._muffleNodes) return this._muffleNodes;
    let e: any = howler.Howler.ctx;
    if (!e || !howler.Howler.masterGain) return null;
    let t: any = e.createGain(),
      n: any = e.createGain(),
      r: any = e.createBiquadFilter();
    r.type = `lowpass`;
    r.frequency.value = this._muffleCutoffFor(this._muffleAmount ?? 0);
    r.Q.value = 0.7;
    t.connect(r);
    r.connect(howler.Howler.masterGain);
    n.connect(howler.Howler.masterGain);
    this._muffleNodes = {
      muffleBus: t,
      cleanBus: n,
      filter: r,
    };
    return this._muffleNodes;
  }
  _routeSound(e?: any, t?: any): any {
    let n: any = audioTracks[e];
    if (!n) return;
    let r: any = this._howls.get(e);
    if (!r || !r._sounds) return;
    let i: any = this._ensureMuffleNodes();
    if (!i) return;
    let a: any = r._sounds.find((e?: any): any => e._id === t);
    if (!a || !a._node) return;
    try {
      a._node.disconnect(howler.Howler.masterGain);
    } catch {}
    try {
      a._node.disconnect(i.muffleBus);
    } catch {}
    try {
      a._node.disconnect(i.cleanBus);
    } catch {}
    let o: any = n.muffleable === !1 ? i.cleanBus : i.muffleBus;
    a._node.connect(o);
  }
  setMuffle(e?: any, t: any = {}): any {
    let n: any = Math.max(0, Math.min(1, e));
    this._muffleAmount = n;
    let r: any = this._ensureMuffleNodes();
    if (!r) return;
    let i: any = this._muffleCutoffFor(n),
      a: any = Math.max(0.001, t.duration ?? (n > 0 ? 0.25 : 0.35)),
      o: any = howler.Howler.ctx.currentTime,
      s: any = r.filter.frequency;
    s.cancelScheduledValues(o);
    s.setValueAtTime(s.value, o);
    s.exponentialRampToValueAtTime(i, o + a);
  }
  suspendContext(): any {
    let e: any = howler.Howler.ctx;
    e &&
      e.state === `running` &&
      e
        .suspend()
        .then((): any => {
          howler.Howler.state = `suspended`;
        })
        .catch((): any => {});
  }
  resumeContext(): any {
    let e: any = howler.Howler.ctx;
    if (!(!e || e.state === `running`)) {
      try {
        typeof howler.Howler._autoResume == `function` &&
          howler.Howler._autoResume();
      } catch {}
      typeof e.resume == `function` &&
        e
          .resume()
          .then((): any => this._startBeds())
          .catch((): any => {});
    }
  }
  stopAll(): any {
    for (let e of this._stopTimers.values()) clearTimeout(e);
    this._stopTimers.clear();
    for (let e of this._howls.values()) {
      this._purgeDeferredPlays(e);
      try {
        e._playLock || e.stop();
      } catch {}
    }
    this._activeIds.clear();
    this._ambientActive.clear();
  }
  _notifyStateChange(): any {
    window.dispatchEvent(new CustomEvent(`audio:statechange`));
  }
  _playInternal(e?: any, t: any = {}): any {
    let n: any = audioTracks[e];
    if (!n) return;
    let r: any = this._get(e);
    if (!r || (n.type === `ambient` && !this.isUnlocked())) return;
    let i: any = this._stopTimers.get(e);
    i && (clearTimeout(i), this._stopTimers.delete(e));
    let a: any = ((t.fadeIn ?? n.fadeIn ?? 0) * 1e3) | 0,
      o: any = t.volume ?? n.volume ?? 1,
      s: any = this._activeIds.get(e),
      c: any = s != null && r.playing(s);
    s == null
      ? (this._purgeDeferredPlays(r),
        !r._playLock && r.playing() && r.stop(),
        (s = r.play()),
        this._activeIds.set(e, s),
        r.volume(0, s))
      : c || r.play(s);
    t.seek != null && r.seek(t.seek, s);
    t.rate != null && r.rate(t.rate, s);
    let l: any = r.volume(s);
    a > 0 ? r.fade(l, o, a, s) : r.volume(o, s);
  }
  _stopHowl(e?: any, t: any = {}): any {
    let n: any = audioTracks[e];
    if (!n) return;
    let r: any = this._howls.get(e);
    if (!r) return;
    this._purgeDeferredPlays(r);
    let i: any = this._stopTimers.get(e);
    if ((i && (clearTimeout(i), this._stopTimers.delete(e)), r._playLock)) {
      this._activeIds.delete(e);
      return;
    }
    let a: any = this._activeIds.get(e);
    if (a == null && !r.playing()) return;
    let o: any = ((t.fadeOut ?? n.fadeOut ?? 0) * 1e3) | 0,
      s: any = a == null ? r.volume() : r.volume(a);
    if (o <= 0 || s <= 0) {
      r.stop();
      this._activeIds.delete(e);
      return;
    }
    r.fade(s, 0, o);
    let c: any = setTimeout((): any => {
      r.stop();
      this._activeIds.delete(e);
      this._stopTimers.delete(e);
    }, o);
    this._stopTimers.set(e, c);
  }
  _get(e?: any): any {
    let t: any = this._howls.get(e);
    if (t) return t;
    let n: any = audioTracks[e];
    return n
      ? ((t = new howler.Howl({
          src: [n.src],
          loop: !!n.loop,
          volume: 0,
          html5: !1,
          preload: !0,
        })),
        t.on(`play`, (t?: any): any => this._routeSound(e, t)),
        this._howls.set(e, t),
        t)
      : null;
  }
})();
export { yg, bg, xg, Sg, Cg, audioTracks, audioManager };
