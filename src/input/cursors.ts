// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
var iC: any = `/assets/ui/cursors_atlas.webp`;
var aC: any = 56;
var oC: any = 3;
var sC: any = 2;
var cC: any = oC * aC;
var lC: any = sC * aC;
var uC: any = 72;
var dC: any = {
  arrow: {
    col: 0,
    row: 0,
    hx: 0,
    hy: 0,
  },
  pointer: {
    col: 1,
    row: 0,
    hx: 0,
    hy: 0,
  },
  grab: {
    col: 2,
    row: 0,
    hx: 0,
    hy: 0,
  },
  grabbed: {
    col: 0,
    row: 1,
    hx: 0,
    hy: 0,
  },
  text: {
    col: 1,
    row: 1,
    hx: 0,
    hy: 0,
  },
  move: {
    col: 2,
    row: 1,
    hx: 0,
    hy: 0,
  },
};
var fC: any = [
  `button`,
  `a`,
  `[role="button"]`,
  `[role="link"]`,
  `label`,
  `input[type="submit"]`,
  `input[type="button"]`,
  `input[type="checkbox"]`,
  `input[type="radio"]`,
  `select`,
  `.hud-audio-btn`,
  `.hud-waitlist-btn`,
  `.next-stage-btn`,
  `.jf-join-btn`,
  `.jf-close`,
  `.s5-joystick-knob`,
  `[style*="cursor: pointer"]`,
  `[style*="cursor:pointer"]`,
].join(`,`);
var pC: any = [
  `input[type="text"]`,
  `input[type="email"]`,
  `input[type="password"]`,
  `input[type="search"]`,
  `input[type="url"]`,
  `input[type="tel"]`,
  `input[type="number"]`,
  `textarea`,
].join(`,`);
var mC: any = !1;
var hC: any = null;
var gC: any = `arrow`;
var _C: any = -9999;
var vC: any = -9999;
function yC(this: any, e?: any): any {
  let t: any = e;
  for (; t && t.nodeType === 1;) {
    let e: any = t.style?.cursor || ``;
    if (e) {
      if (e.includes(`grabbing`)) return `grabbing`;
      if (e.includes(`pointer`)) return `pointer`;
      if (e.includes(`grab`)) return `grab`;
      if (e.includes(`move`)) return `move`;
    }
    t = t.parentElement;
  }
  return null;
}
var bC: any = {
  default: `arrow`,
  arrow: `arrow`,
  text: `text`,
  pointer: `pointer`,
  grab: `grab`,
  grabbing: `grabbed`,
  grabbed: `grabbed`,
  move: `move`,
};
function xC(this: any, e?: any): any {
  if (!e) return `arrow`;
  try {
    let t: any = e.closest && e.closest(`[data-cursor]`);
    if (t) {
      let e: any = bC[t.dataset.cursor];
      if (e) return e;
    }
  } catch {}
  let t: any = yC(e);
  if (t === `grabbing`) return `grabbed`;
  if (e.tagName === `CANVAS`)
    return t === `pointer`
      ? `pointer`
      : t === `grab`
        ? `grab`
        : t === `move`
          ? `move`
          : `arrow`;
  try {
    if (e.closest && e.closest(pC)) return `text`;
  } catch {}
  try {
    if (e.closest && e.closest(fC)) return `pointer`;
  } catch {}
  return t === `grab` ? `grab` : t === `move` ? `move` : `arrow`;
}
function SC(this: any, e?: any): any {
  let t: any = dC[e],
    n: any = aC / uC;
  return {
    x: t.hx * n,
    y: t.hy * n,
  };
}
function CC(this: any, e?: any): any {
  if (e !== gC && ((gC = e), hC)) {
    let t: any = dC[e];
    hC.style.backgroundPosition = `${-t.col * aC}px ${-t.row * aC}px`;
  }
}
function wC(this: any): any {
  if (!hC) return;
  let e: any = SC(gC);
  hC.style.transform = `translate3d(${_C - e.x}px, ${vC - e.y}px, 0)`;
}
function TC(this: any, e?: any): any {
  _C = e.clientX;
  vC = e.clientY;
  CC(xC(document.elementFromPoint(e.clientX, e.clientY)));
  wC();
  hC.style.opacity === `0` && (hC.style.opacity = `1`);
}
function EC(this: any): any {
  hC && (hC.style.opacity = `0`);
}
function installCustomCursors(this: any): any {
  if (
    mC ||
    (window.matchMedia
      ? window.matchMedia(`(hover: none) and (pointer: coarse)`).matches
      : `ontouchstart` in window)
  )
    return;
  mC = !0;
  let e: any = new Image();
  e.src = iC;
  hC = document.createElement(`div`);
  hC.dataset.customCursor = `1`;
  hC.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: ${aC}px;
    height: ${aC}px;
    pointer-events: none;
    z-index: 999999;
    background-image: url("${iC}");
    background-size: ${cC}px ${lC}px;
    background-position: 0 0;
    background-repeat: no-repeat;
    image-rendering: -webkit-optimize-contrast;
    transform: translate3d(-9999px, -9999px, 0);
    will-change: transform;
    opacity: 0;
    transition: opacity 0.15s ease;
  `;
  document.body.appendChild(hC);
  let t: any = document.createElement(`style`);
  t.dataset.customCursors = `1`;
  t.textContent = `
    *, *::before, *::after { cursor: none !important; }
  `;
  document.head.appendChild(t);
  document.addEventListener(`pointermove`, TC, {
    passive: !0,
  });
  document.addEventListener(`pointerdown`, TC, {
    passive: !0,
  });
  document.addEventListener(`pointerup`, TC, {
    passive: !0,
  });
  document.addEventListener(`pointerleave`, EC);
  document.addEventListener(
    `touchstart`,
    (): any => {
      hC && (hC.style.display = `none`);
    },
    {
      passive: !0,
      once: !0,
    },
  );
}
function OC(this: any): any {
  return `url("${iC}") 0 0, pointer`;
}
function kC(this: any): any {
  return `url("${iC}") 0 0, grab`;
}
function AC(this: any): any {
  return `url("${iC}") 0 0, grabbing`;
}
var jC: any = [
  `.jf-join-btn`,
  `.jf-close`,
  `.jf-submit-btn`,
  `.sp-url-pill`,
  `.sp-social-btn`,
  `[data-share="copy"]`,
  `[data-share="share"]`,
  `.hud-waitlist-btn`,
].join(`,`);
var MC: any = !1;
function installClickAudio(this: any, e?: any): any {
  MC ||
    !e ||
    ((MC = !0),
    document.addEventListener(
      `click`,
      (t?: any): any => {
        let n: any = t.target && t.target.closest ? t.target.closest(jC) : null;
        if (!n) return;
        let r: any = n.classList.contains(`jf-join-btn`);
        e.play(
          `click`,
          r
            ? {
                volume: 0.75,
              }
            : void 0,
        );
      },
      !0,
    ));
}
export {
  iC,
  aC,
  oC,
  sC,
  cC,
  lC,
  uC,
  dC,
  fC,
  pC,
  mC,
  hC,
  gC,
  _C,
  vC,
  yC,
  bC,
  xC,
  SC,
  CC,
  wC,
  TC,
  EC,
  installCustomCursors,
  OC,
  kC,
  AC,
  jC,
  MC,
  installClickAudio,
};
