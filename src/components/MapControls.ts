// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { HS, US, WS, GS } from "../models/CloudField.ts";
import { audioManager } from "../audio/AudioManager.ts";
import { gsap } from "gsap";
var KS: any = !1;
function qS(this: any): any {
  if (KS) return;
  KS = !0;
  let e: any = document.createElement(`style`);
  e.dataset.stage5Controls = `1`;
  e.textContent = `
    .s5-controls {
      position: fixed;
      left: 0; right: 0; bottom: 0;
      padding: 0 60px 40px 60px;
      display: flex; align-items: flex-end; justify-content: space-between;
      pointer-events: none;
      z-index: 80;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;
    }
    .s5-joystick {
      width: ${HS}px;
      height: ${HS}px;
      border-radius: 50%;
      /* Heavier transparency so the map shows through clearly — was
         0.55, now 0.22. Inset highlights kept light so the disc still
         reads as a 3D well, not a flat hole. */
      background: rgba(15, 15, 15, 0.22);
      box-shadow:
        inset 0 -3px 10px rgba(0, 0, 0, 0.35),
        inset 0 3px 8px rgba(255, 255, 255, 0.06),
        0 8px 18px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.12);
      position: relative;
      pointer-events: auto;
      backdrop-filter: saturate(120%) blur(6px);
      -webkit-backdrop-filter: saturate(120%) blur(6px);
    }
    .s5-joystick-knob {
      position: absolute;
      width: ${US}px;
      height: ${US}px;
      left: 50%; top: 50%;
      margin-left: -${US / 2}px;
      margin-top:  -${US / 2}px;
      border-radius: 50%;
      background: linear-gradient(180deg, #2a2a2a 0%, #0d0d0d 100%);
      box-shadow:
        inset 0 -2px 6px rgba(0, 0, 0, 0.7),
        inset 0 2px 4px rgba(255, 255, 255, 0.15),
        0 4px 10px rgba(0, 0, 0, 0.4);
      will-change: transform;
      cursor: grab;
    }
    .s5-joystick.is-active .s5-joystick-knob { cursor: grabbing; }

    .s5-pad {
      position: relative;
      width: 180px; height: 180px;
      pointer-events: none;
    }
    .s5-pad-btn {
      position: absolute;
      width: 60px; height: 60px;
      border-radius: 50%;
      /* Translucent dark fill (was opaque #2a→#0d gradient). The
         backdrop-filter blur keeps the map readable behind the button
         while the rgba keeps it visibly a dark control surface. */
      background: rgba(15, 15, 15, 0.45);
      backdrop-filter: saturate(120%) blur(8px);
      -webkit-backdrop-filter: saturate(120%) blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      pointer-events: auto;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: #fcfcfc;
      box-shadow:
        inset 0 -2px 6px rgba(0, 0, 0, 0.4),
        inset 0 2px 4px rgba(255, 255, 255, 0.10),
        0 4px 10px rgba(0, 0, 0, 0.30);
      transition: transform 0.08s ease, box-shadow 0.08s ease, background 0.08s ease;
      font: 600 22px/1 'Google Sans Code', system-ui, sans-serif;
    }

    /* Shiny glass stroke — matches the navbar pills. A 1px masked-gradient
       ring, bright white at the top-left (135deg start) and bottom-right
       (end), clear across the middle, so light catches opposite edges.
       border-radius:inherit makes it follow the circular joystick base and
       round pad buttons. pointer-events:none so it never blocks the joystick
       drag or a button tap. */
    .s5-joystick::after,
    .s5-joystick-knob::after,
    .s5-pad-btn::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1px;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.9),
        rgba(255, 255, 255, 0) 35%,
        rgba(255, 255, 255, 0) 65%,
        rgba(255, 255, 255, 0.9)
      );
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
              mask-composite: exclude;
      pointer-events: none;
    }

    .s5-pad-btn:hover {
      background: rgba(20, 20, 20, 0.55);
      box-shadow:
        inset 0 -2px 6px rgba(0, 0, 0, 0.45),
        inset 0 2px 4px rgba(255, 255, 255, 0.14),
        0 6px 14px rgba(0, 0, 0, 0.38);
    }
    .s5-pad-btn:active,
    .s5-pad-btn.is-pressed {
      transform: translateY(2px);
      background: rgba(10, 10, 10, 0.55);
      box-shadow:
        inset 0 2px 6px rgba(0, 0, 0, 0.55),
        0 2px 4px rgba(0, 0, 0, 0.20);
    }
    .s5-pad-up    { top: 0;    left: 60px; }
    .s5-pad-right { top: 60px; left: 120px; }
    .s5-pad-down  { top: 120px; left: 60px; }
    .s5-pad-left  { top: 60px; left: 0; }

    /* Custom inline icons via ::before so we don't need SVG round trips */
    .s5-pad-btn .s5-icon { display: block; }
    .s5-pad-up    .s5-icon { width: 14px; height: 14px;
      background:
        linear-gradient(currentColor, currentColor) center / 14px 2px no-repeat,
        linear-gradient(currentColor, currentColor) center / 2px 14px no-repeat;
    }
    .s5-pad-down  .s5-icon { width: 14px; height: 2px; background: currentColor; }
    .s5-pad-left  .s5-icon,
    .s5-pad-right .s5-icon {
      width: 0; height: 0;
      border-top: 7px solid transparent;
      border-bottom: 7px solid transparent;
    }
    .s5-pad-left  .s5-icon { border-right: 9px solid currentColor; margin-right: 2px; }
    .s5-pad-right .s5-icon { border-left:  9px solid currentColor; margin-left:  2px; }

    /* Mobile: scale down + tighten margins */
    @media (max-width: 768px) {
      .s5-controls { padding: 0 20px 90px 20px; }
      .s5-joystick { width: 90px; height: 90px; }
      .s5-joystick-knob { width: 40px; height: 40px; margin-left: -20px; margin-top: -20px; }
      .s5-pad { width: 144px; height: 144px; }
      .s5-pad-btn { width: 48px; height: 48px; font-size: 18px; }
      .s5-pad-up    { left: 48px; }
      .s5-pad-right { top: 48px; left: 96px; }
      .s5-pad-down  { top: 96px; left: 48px; }
      .s5-pad-left  { top: 48px; }
    }
  `;
  document.head.appendChild(e);
}
function JS(this: any, e?: any): any {
  qS();
  let t: any = e.parent || document.body,
    n: any = document.createElement(`div`);
  n.className = `s5-controls`;
  let r: any = document.createElement(`div`);
  r.className = `s5-joystick`;
  let i: any = document.createElement(`div`);
  i.className = `s5-joystick-knob`;
  r.appendChild(i);
  n.appendChild(r);
  let a: any = document.createElement(`div`);
  a.className = `s5-pad`;
  let o: any = (e?: any, t?: any, n?: any): any => {
      let r: any = document.createElement(`button`);
      r.type = `button`;
      r.className = `s5-pad-btn ${e}`;
      r.setAttribute(`aria-label`, n);
      r.dataset.action = t;
      let i: any = document.createElement(`span`);
      i.className = `s5-icon`;
      r.appendChild(i);
      return r;
    },
    s: any = o(`s5-pad-up`, `zoom-in`, `Zoom in`),
    c: any = o(`s5-pad-down`, `zoom-out`, `Zoom out`),
    l: any = o(`s5-pad-left`, `cycle-prev`, `Previous company`),
    u: any = o(`s5-pad-right`, `cycle-next`, `Next company`);
  a.appendChild(s);
  a.appendChild(u);
  a.appendChild(c);
  a.appendChild(l);
  n.appendChild(a);
  t.appendChild(n);
  let d: any = 0,
    f: any = 0,
    p: any = null,
    m: any = null,
    h: any = (e?: any, t?: any): any => {
      i.style.transform = `translate(${e}px, ${t}px)`;
    },
    g: any = (e?: any): any => {
      if (p === null) {
        p = e.pointerId;
        audioManager.play(`click`);
        m &&= (m.kill(), null);
        r.classList.add(`is-active`);
        try {
          i.setPointerCapture(p);
        } catch {}
        y(e);
      }
    },
    _: any = (e?: any): any => {
      e.pointerId === p && y(e);
    },
    v: any = (e?: any): any => {
      if (e.pointerId !== p) return;
      p = null;
      r.classList.remove(`is-active`);
      try {
        i.releasePointerCapture(e.pointerId);
      } catch {}
      if (C.size > 0) {
        r.classList.add(`is-active`);
        E();
        return;
      }
      let t: any = {
        x: d * WS,
        y: f * WS,
      };
      m = gsap.to(t, {
        x: 0,
        y: 0,
        duration: 0.22,
        ease: `back.out(2)`,
        onUpdate: (): any => {
          h(t.x, t.y);
          d = t.x / WS;
          f = t.y / WS;
        },
        onComplete: (): any => {
          d = 0;
          f = 0;
          m = null;
        },
      });
    };
  function y(this: any, e?: any): any {
    let t: any = r.getBoundingClientRect(),
      n: any = t.left + t.width / 2,
      i: any = t.top + t.height / 2,
      a: any = e.clientX - n,
      o: any = e.clientY - i,
      s: any = Math.hypot(a, o);
    if (s > WS) {
      let e: any = WS / s;
      a *= e;
      o *= e;
    }
    h(a, o);
    d = a / WS;
    f = o / WS;
  }
  i.addEventListener(`pointerdown`, g);
  window.addEventListener(`pointermove`, _);
  window.addEventListener(`pointerup`, v);
  window.addEventListener(`pointercancel`, v);
  let b: any = (t?: any): any => {
    let n: any = t.target.closest(`.s5-pad-btn`);
    if (n)
      switch ((audioManager.play(`click`), n.dataset.action)) {
        case `zoom-in`:
          e.onZoomIn();
          break;
        case `zoom-out`:
          e.onZoomOut();
          break;
        case `cycle-prev`:
          e.onCyclePrev();
          break;
        case `cycle-next`:
          e.onCycleNext();
          break;
      }
  };
  a.addEventListener(`click`, b);
  let x: any = {
      KeyW: [0, -1],
      KeyA: [-1, 0],
      KeyS: [0, 1],
      KeyD: [1, 0],
    },
    S: any = {
      ArrowUp: s,
      ArrowDown: c,
      ArrowLeft: l,
      ArrowRight: u,
    },
    C: any = new Set(),
    w: any = null,
    T: any = (e?: any): any =>
      !!e &&
      (e.tagName === `INPUT` ||
        e.tagName === `TEXTAREA` ||
        e.isContentEditable);
  function E(this: any): any {
    let e: any = 0,
      t: any = 0;
    for (let n of C) {
      e += x[n][0];
      t += x[n][1];
    }
    let n: any = Math.hypot(e, t);
    n > 1 && ((e /= n), (t /= n));
    m &&= (m.kill(), null);
    w && w.kill();
    let r: any = e === 0 && t === 0,
      i: any = {
        x: d,
        y: f,
      };
    w = gsap.to(i, {
      x: e,
      y: t,
      duration: r ? 0.22 : 0.12,
      ease: r ? `back.out(2)` : `power2.out`,
      onUpdate: (): any => {
        d = i.x;
        f = i.y;
        h(d * WS, f * WS);
      },
      onComplete: (): any => {
        w = null;
      },
    });
  }
  let D: any = (e?: any): any => {
      if (!(e.metaKey || e.ctrlKey || e.altKey) && !T(e.target)) {
        if (x[e.code]) {
          if ((e.preventDefault(), e.repeat)) return;
          if (p !== null) {
            C.add(e.code);
            return;
          }
          C.size === 0 && audioManager.play(`click`);
          C.add(e.code);
          r.classList.add(`is-active`);
          E();
        } else if (S[e.code]) {
          if ((e.preventDefault(), e.repeat)) return;
          let t: any = S[e.code];
          t.classList.add(`is-pressed`);
          t.click();
        }
      }
    },
    O: any = (e?: any): any => {
      if (x[e.code]) {
        if (!C.delete(e.code) || p !== null) return;
        C.size === 0 && r.classList.remove(`is-active`);
        E();
      } else S[e.code] && S[e.code].classList.remove(`is-pressed`);
    },
    k: any = (): any => {
      C.size > 0 &&
        (C.clear(), p === null && (r.classList.remove(`is-active`), E()));
      for (let e of Object.values(S) as any[]) e.classList.remove(`is-pressed`);
    };
  window.addEventListener(`keydown`, D);
  window.addEventListener(`keyup`, O);
  window.addEventListener(`blur`, k);
  function A(this: any, t?: any): any {
    if ((d === 0 && f === 0) || (e.canPan && !e.canPan())) return;
    let n: any = GS * t;
    e.onPanVelocity(d * n, -f * n);
  }
  function j(this: any): any {
    i.removeEventListener(`pointerdown`, g);
    window.removeEventListener(`pointermove`, _);
    window.removeEventListener(`pointerup`, v);
    window.removeEventListener(`pointercancel`, v);
    window.removeEventListener(`keydown`, D);
    window.removeEventListener(`keyup`, O);
    window.removeEventListener(`blur`, k);
    a.removeEventListener(`click`, b);
    m &&= (m.kill(), null);
    w &&= (w.kill(), null);
    n.parentNode && n.parentNode.removeChild(n);
  }
  function M(this: any, e?: any, t?: any): any {
    return p !== null || C.size > 0 || m || w ? !1 : (h(e * WS, t * WS), !0);
  }
  return {
    tick: A,
    destroy: j,
    setExternalDeflection: M,
  };
}
export { KS, qS, JS };
