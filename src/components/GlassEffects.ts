// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { oO } from "../stages/StageManager.ts";
var sO: any = [
  `fill`,
  `fill-burn`,
  `highlight-soft`,
  `highlight-strong`,
  `edge-light`,
  `edge-dark`,
  `inner-glow`,
];
function cO(this: any, e?: any): any {
  if (!e || e.querySelector(`:scope > .glass-effect`)) return;
  let t: any = document.createElement(`div`);
  t.className = `glass-effect`;
  t.setAttribute(`aria-hidden`, `true`);
  for (let e of sO) {
    let n: any = document.createElement(`div`);
    n.className = `glass-effect__${e}`;
    t.appendChild(n);
  }
  e.prepend(t);
  e.classList.add(`has-glass`);
}
var lO: any = !1;
function installGlassEffects(this: any): any {
  if (lO) return;
  lO = !0;
  let e: any = (e?: any): any => {
    !e ||
      e.nodeType !== 1 ||
      (e.matches && e.matches(oO) && cO(e),
      e.querySelectorAll && e.querySelectorAll(oO).forEach(cO));
  };
  e(document.body);
  new MutationObserver((t?: any): any => {
    for (let n of t) for (let t of n.addedNodes) e(t);
  }).observe(document.body, {
    childList: !0,
    subtree: !0,
  });
}
export { sO, cO, lO, installGlassEffects };
