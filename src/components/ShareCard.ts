// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { UT, GT, KT } from "./WaitlistOverlay.ts";
import { sE } from "./SharePreview.ts";
function aE(
  this: any,
  {
    container: e,
    userName: t,
    university: n,
    memberNumber: r,
    assetUrl: i,
    aoUrl: a,
  }: any,
): any {
  let o: any = window.innerWidth <= 768,
    s: any = (t || ``).trim().split(/\s+/)[0] || UT,
    c: any = o ? 16 : 32,
    l: any = o ? 16 : 22,
    u: any = o ? 56 : 66,
    d: any = window.innerWidth - 2 * c,
    f: any = window.innerHeight - 2 * c - l - u,
    p: any = Math.min(f, d / GT);
  o || (p = Math.min(p, 700));
  let m: any = p * GT,
    h: any = m / 1080,
    g: any = `#1f1d1e`,
    _: any = 60 * h,
    v: any = `font-family:'PP Supply Mono', 'Supply Sans', ui-monospace, monospace;font-size:${36 * h}px;letter-spacing:${-1.08 * h}px;color:${g};text-transform:uppercase;white-space:nowrap;line-height:1;`,
    y: any = document.createElement(`div`);
  y.className = `sp-poster`;
  y.style.cssText = `
    position: relative; width: ${m}px; height: ${p}px;
    background: #ffffff; border-radius: ${70 * h}px; overflow: hidden;
    box-shadow: 0 ${20 * h}px ${60 * h}px rgba(0,0,0,0.12);
  `;
  y.innerHTML = `
    <div class="sp-card-gradient" style="position:absolute; inset:0; pointer-events:none;
      background: radial-gradient(120% 78% at 50% 116%,
        #9fecb9 0%, #b9f1cd 26%, #d8f6e2 48%, #ffffff 68%);"></div>

    <span class="sp-corner sp-corner-label" data-align="left"
          style="position:absolute; top:${_}px; left:${_}px; z-index:2;
                 pointer-events:none; ${v}">Founding member</span>
    <span class="sp-corner sp-corner-label" data-align="right"
          style="position:absolute; top:${_}px; right:${_}px; z-index:2;
                 pointer-events:none; ${v}">#${r}</span>

    <div class="sp-poster-origami" style="position:absolute;
      left:0; right:0; top:0; height:${p * 0.6}px;
      display:flex; align-items:center; justify-content:center; z-index:1;"></div>

    <img src="/assets/ui/share-card_congrats.webp" alt="Your degree is finally useful"
         draggable="false"
         style="position:absolute; left:${64 * h}px; top:${p * 0.5}px; z-index:2;
                pointer-events:none; width:${450 * h}px; height:auto;" />

    <div style="position:absolute; left:${_}px; right:${_}px; top:${p * 0.7}px;
                display:flex; flex-direction:column; align-items:center; gap:${36 * h}px;
                text-align:center; color:${g};">
      <div style="font-family:'STK Bureau Serif', 'Newsreader', Georgia, serif; font-weight:400; font-size:${128 * h}px;
                  letter-spacing:${-6.4 * h}px; line-height:0.95;">${s}</div>
      <div style="font-family:'Google Sans Flex', 'Inter', sans-serif; font-weight:500; font-size:${36 * h}px;
                  line-height:1.3; opacity:0.8; max-width:${760 * h}px;">${KT}</div>
    </div>

    <img class="sp-corner" src="/assets/brand/nav_logo.svg" alt="zero" draggable="false"
         style="position:absolute; bottom:${_}px; left:${_}px; z-index:2;
                pointer-events:none; height:${37 * h}px; width:${(104 / 30) * 37 * h}px; display:block;" />
    <span class="sp-corner sp-corner-label" data-align="right"
          style="position:absolute; bottom:${_}px; right:${_}px; z-index:2;
                 pointer-events:none; ${v}">zero.university</span>
  `;
  let b: any = document.createElement(`div`);
  b.className = `sp-poster-tilt`;
  b.appendChild(y);
  e.appendChild(b);
  let x: any = 0,
    S: any = 0,
    C: any = 0,
    w: any = 0,
    T: any = 0,
    E: any = (): any => {
      T = 0;
      C += (x - C) * 0.1;
      w += (S - w) * 0.1;
      b.style.transform = `translate3d(${(C * 18).toFixed(2)}px, ${(w * 18).toFixed(2)}px, 0) rotateX(${(-w * 10).toFixed(3)}deg) rotateY(${(C * 10).toFixed(3)}deg)`;
      Math.abs(x - C) + Math.abs(S - w) > 0.001 &&
        (T = requestAnimationFrame(E));
    },
    D: any = (e?: any): any => {
      x = (e.clientX / window.innerWidth) * 2 - 1;
      S = (e.clientY / window.innerHeight) * 2 - 1;
      T ||= requestAnimationFrame(E);
    };
  o ||
    ((b.style.cssText = `will-change: transform;`),
    (e.style.perspective = `1200px`),
    window.addEventListener(`mousemove`, D, {
      passive: !0,
    }));
  let O: any = sE(y.querySelector(`.sp-poster-origami`), {
    assetUrl: i,
    aoUrl: a,
    userName: t,
    university: n,
  });
  return {
    el: y,
    ready: O.ready,
    snapshot: O.snapshot,
    foldDuration: O.foldDuration,
    pauseAuto: O.pauseAuto,
    resumeAuto: O.resumeAuto,
    renderFoldFraction: O.renderFoldFraction,
    snapshotCanvas: O.snapshotCanvas,
    destroy: (): any => {
      window.removeEventListener(`mousemove`, D);
      T && cancelAnimationFrame(T);
      O.destroy();
      b.remove();
    },
  };
}
export { aE };
