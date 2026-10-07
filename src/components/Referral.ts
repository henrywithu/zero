import { uE } from "./shareIcons.ts";
import { lE } from "./shareIcons.ts";
import { cE } from "./shareIcons.ts";
// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { gsap } from "gsap";
import { FT } from "./WaitlistOverlay.ts";
import { YT } from "./Sharing.ts";
var dE: any = 0.85;
var fE: any = 0.3;
var pE: any = 1.6;
var mE: any = 0.48;
var hE: any = 0;
var gE: any = ``;
function _E(
  this: any,
  {
    host: e,
    sceneSlot: t,
    aheadCount: n = hE,
    referralSlug: r = gE,
    referralUrl: i = null,
    memberNumber: a = null,
    userName: o = ``,
    university: s = ``,
    assetUrl: c = null,
    aoUrl: l = null,
    skipFlip: u = !1,
    setSceneAutoRotate: d,
    pauseScene: f,
    resumeScene: p,
  }: any = {},
): any {
  if (!e) {
    console.warn(`[Share] host element required`);
    return {
      destroy: (): any => {},
    };
  }
  let m: any = window.innerWidth <= 768,
    h: any =
      i ||
      (r
        ? `https://zero.henrywithu.com?ref=${r}`
        : `https://zero.henrywithu.com`),
    g: any = h.replace(/^https?:\/\//, ``),
    _: any = document.createElement(`div`);
  _.className = `sh-layout`;
  _.style.cssText = `
    position: absolute;
    inset: ${m ? `40px 18px 22px 18px` : `60px 64px 60px 64px`};
    display: flex;
    flex-direction: ${m ? `column` : `row`};
    align-items: center;
    /* Center the whole group (canvas + info) on screen. The tight scene→info
       spacing comes from the small gap below + info being flex:0 0 auto (so it
       no longer grows and centers its own content mid-screen). */
    justify-content: center;
    gap: ${m ? `6px` : `20px`};
    overflow-y: ${m ? `auto` : `visible`};
    z-index: 1;
  `;
  e.appendChild(_);
  let v: any = m
      ? Math.min(window.innerWidth * 0.8, window.innerHeight * 0.4)
      : Math.max(500, Math.min(800, window.innerWidth * 0.52)),
    y: any = document.createElement(`div`);
  y.className = `sh-scene-slot`;
  y.style.cssText = `
    position: relative;
    flex: 0 0 ${v}px;
    width: ${v}px;
    height: ${v}px;
    display: flex; align-items: center; justify-content: center;
    z-index: 0; /* own stacking context keeps overlays inside the slot */
  `;
  _.appendChild(y);
  let b: any = document.createElement(`img`);
  b.className = `sh-congrats`;
  b.src = `/assets/brand/keepsake-note.svg`;
  b.alt = `A little wonder, folded for you`;
  b.draggable = !1;
  b.style.cssText = `
    position: absolute; top: ${m ? `56px` : `78px`}; left: ${m ? `30px` : `48px`};
    width: ${m ? `32%` : `26%`}; max-width: 200px; height: auto;
    pointer-events: none; user-select: none; z-index: 6; opacity: 0;
  `;
  y.appendChild(b);
  gsap.fromTo(
    b,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 0.5,
      delay: 0.3,
      ease: `power2.out`,
    },
  );
  let x: any = document.createElement(`div`);
  x.className = `sh-info`;
  x.style.cssText = `
    flex: ${m ? `0 0 auto` : `1 1 0`};
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    /* Phone: the square canvas has blank space below the centered origami, so
       pull the info up into it to tighten the origami→text gap (tunable). */
    margin-top: ${m ? `-44px` : `0`};
    /* Gap between the "ahead of you" block and the "Pass the wonder on" block. */
    gap: ${m ? `14px` : `120px`};
    max-width: ${m ? `100%` : `460px`};
    min-width: 0;
    opacity: 0;
    will-change: opacity, transform;
  `;
  x.innerHTML = vE({
    aheadCount: n,
    displayUrl: g,
    isPhone: m,
    userName: o,
  });
  _.appendChild(x);
  let S: any = null;
  if (t && y && u) {
    y.appendChild(t);
    t.style.maxWidth = ``;
    t.style.maxHeight = ``;
    t.style.aspectRatio = ``;
    t.style.position = ``;
    t.style.left = ``;
    t.style.top = ``;
    t.style.width = `100%`;
    t.style.height = `100%`;
    t.style.transform = ``;
    t.style.transformOrigin = ``;
    t.style.zIndex = ``;
    d && d(!0);
  } else if (t && y) {
    let n: any = t.getBoundingClientRect(),
      r: any = e.getBoundingClientRect(),
      i: any = Math.round(n.width),
      a: any = Math.round(n.height),
      o: any = document.createElement(`div`);
    o.style.cssText = `
      width: 100%; height: 100%; display: block; visibility: hidden;
    `;
    y.appendChild(o);
    let s: any = o.getBoundingClientRect();
    o.remove();
    e.appendChild(t);
    t.style.maxWidth = ``;
    t.style.maxHeight = ``;
    t.style.aspectRatio = ``;
    t.style.position = `absolute`;
    t.style.left = `${n.left - r.left}px`;
    t.style.top = `${n.top - r.top}px`;
    t.style.width = `${i}px`;
    t.style.height = `${a}px`;
    t.style.transformOrigin = `0 0`;
    t.style.zIndex = `5`;
    let c: any = s.left - n.left,
      l: any = s.top - n.top,
      u: any = s.width / i,
      f: any = s.height / a;
    S = gsap.to(t, {
      x: c,
      y: l,
      scaleX: u,
      scaleY: f,
      duration: dE,
      ease: `power3.inOut`,
      onComplete: (): any => {
        y.appendChild(t);
        t.style.position = ``;
        t.style.left = ``;
        t.style.top = ``;
        t.style.width = `100%`;
        t.style.height = `100%`;
        t.style.transformOrigin = ``;
        t.style.zIndex = ``;
        gsap.set(t, {
          clearProps: `x,y,scaleX,scaleY,transform`,
        });
        d && d(!0);
      },
    });
  }
  let C: any = x.querySelectorAll(`[data-stagger]`);
  gsap.set(C, {
    opacity: 0,
    y: 18,
  });
  x.style.opacity = `1`;
  gsap.to(C, {
    opacity: 1,
    y: 0,
    duration: 0.55,
    stagger: 0.09,
    delay: fE,
    ease: `power2.out`,
  });
  let w: any = x.querySelector(`[data-ahead-count]`),
    T: any = Math.max(0, n - 100),
    E: any = w
      ? FT(w, {
          from: T,
          to: n,
          duration: pE,
          delay: mE,
          ease: `power2.out`,
        })
      : null,
    D: any = null;
  x.addEventListener(`click`, (e?: any): any => {
    let t: any = e.target.closest(`[data-share]`)?.dataset.share;
    if (t)
      if (t === `copy`) {
        try {
          navigator.clipboard.writeText(h);
        } catch {}
        let t: any = e.target.closest(`[data-share="copy"]`);
        t &&
          (t.setAttribute(`data-copy-success`, ``),
          clearTimeout(t._copyT),
          (t._copyT = setTimeout(
            (): any => t.removeAttribute(`data-copy-success`),
            2e3,
          )));
        let n: any = t?.querySelector(`[data-url-label]`);
        if (n) {
          let e: any = n.dataset.orig || n.textContent;
          n.dataset.orig = e;
          n.textContent = `COPIED!`;
          clearTimeout(t._labelT);
          t._labelT = setTimeout((): any => {
            n.textContent = e;
          }, 2e3);
        }
      } else
        t === `share` &&
          (D && D.destroy(),
          f && f(),
          (D = YT({
            referralSlug: r,
            referralUrl: h,
            userName: o,
            university: s,
            memberNumber: a ?? n,
            assetUrl: c,
            aoUrl: l,
            onClose: (): any => {
              D = null;
              p && p();
            },
          })));
  });
  function O(this: any): any {
    S && S.kill();
    E && E.kill();
    D &&= (D.destroy(), null);
    d && d(!1);
    _.remove();
  }
  return {
    destroy: O,
    layout: _,
    sceneSlotEl: y,
  };
}
function vE(
  this: any,
  { aheadCount: e, displayUrl: t, isPhone: n, userName: r = `` }: any,
): any {
  let i: any = `'Inter', sans-serif`,
    a: any = e.toLocaleString(),
    o: any = String(r || ``)
      .trim()
      .replace(/[&<>"']/g, (e?: any): any => `&#${e.charCodeAt(0)};`),
    s: any = o ? `A little wonder for you, ${o}.` : `A little wonder for you.`;
  return `
    <div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:${n ? `14px` : `22px`};">
      <p data-stagger style="margin:0;font-family:${i};font-size:${n ? `16px` : `22px`};font-weight:400;color:#1f1d1e;">${s}</p>
      <p data-stagger style="margin:0;font-family:'Bethany Elingston', 'Dancing Script', cursive;font-size:${n ? `30px` : `48px`};font-weight:400;line-height:1.08;color:#000;"><span data-ahead-count style="display:none" aria-hidden="true">${a}</span>Paper. Light.<br />Possibility.</p>
      <p data-stagger style="margin:0;font-family:${i};font-size:${n ? `16px` : `22px`};font-weight:400;color:#1f1d1e;">Your origami keepsake lives in this browser.</p>
    </div>

    <div style="display:flex;flex-direction:column;align-items:center;gap:${n ? `12px` : `16px`};width:100%;">
      <p data-stagger style="margin:0;font-family:${i};font-size:${n ? `17px` : `20px`};font-weight:400;color:#1f1d1e;">Pass the wonder on</p>
      <button data-stagger data-share="copy" type="button" style="
        display:inline-flex;align-items:center;gap:10px;
        padding:14px 22px;
        background:#c9f5d3;
        border:none; border-radius:999px;
        font-family:'PP Supply Mono', 'Supply Sans', ui-monospace, monospace;
        font-size:${n ? `12px` : `13.5px`};
        letter-spacing:0.04em;
        color:#1f1d1e;
        cursor:pointer;
        text-transform:uppercase;
        max-width:100%; box-sizing:border-box;
        white-space:nowrap; overflow:hidden;
      ">
        <span data-url-label>${t}</span>
        <span class="jf-copy-icons" aria-hidden="true">
          <i class="jf-copy-ic">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2"/>
      <path d="M5 15V5a2 2 0 0 1 2-2h10"/>
    </svg>
  </i>
          <i class="jf-copy-ic is--success">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5"/>
      <path d="M8 12L11 15L16 10" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.5"/>
    </svg>
  </i>
        </span>
      </button>
      <button data-stagger data-share="share" type="button" style="
        display:inline-flex;align-items:center;gap:10px;
        padding:14px 30px;
        background:#1f1d1e; color:#fff;
        border:none; border-radius:999px;
        font-family:${i};
        font-size:${n ? `15px` : `16px`};
        font-weight:500;
        cursor:pointer;
      ">
        
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8"/>
      <polyline points="16 6 12 2 8 6"/>
      <line x1="12" y1="2" x2="12" y2="15"/>
    </svg>
  
        <span>Share</span>
      </button>
    </div>
  `;
}
export { dE, fE, pE, mE, hE, gE, _E, vE };
