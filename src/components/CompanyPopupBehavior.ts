// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { audioManager } from "../audio/AudioManager.ts";
import { YS, companyMarkers } from "../content/companies.ts";
import { wD } from "./CompanyPopup.ts";
import { gsap } from "gsap";
var ED: any = (e?: any): any => e.toLowerCase().replace(/\s+/g, `-`);
function populateCompanyPopup(this: any, e?: any, t?: any): any {
  audioManager.play(`hand-entry`);
  let n: any = e.querySelector(`[data-company-logo]`);
  n.alt = t.company;
  n.style.display = ``;
  n.onerror = (): any => {
    n.style.display = `none`;
  };
  n.src = `/assets/brand/mark.webp`;
  e.querySelector(`[data-project-name]`).textContent = t.company;
  let image = e.querySelector(`[data-project-image]`);
  image.src = `/assets/projects/${t.image}`;
  image.alt = t.imageAlt || t.company;
  e.querySelector(`[data-join]`).href = t.href;

  let r: any = e.querySelector(`[data-hero-media]`);
  if (r) {
    jD(r);
    let e: any = t.video ? `/assets/videos/${t.video}` : ``;
    if (
      ((r.style.display = t.video ? `` : `none`),
      (r.onerror = (): any => {
        r.style.display = `none`;
      }),
      t.video && !r.src.endsWith(t.video) && ((r.src = e), r.load()),
      t.video)
    ) {
      r.currentTime = 0;
      r.muted = !audioManager.isEnabled();
      r._audioSync = (): any => {
        r.muted = !audioManager.isEnabled();
      };
      window.addEventListener(`audio:statechange`, r._audioSync);
      r.onended = (): any => jD(r);
      let e: any = r.play();
      e && e.catch && e.catch((): any => {});
    }
  }
  audioManager.setMuffle(1);
  e._muffleEngaged = !0;
  e.querySelector(`[data-role]`).textContent = t.role || ``;
  e.querySelector(`[data-scenario]`).textContent = t.scenario || ``;
  let i: any = e.querySelector(`[data-desc]`),
    a: any = t.description || ``;
  i.textContent = a;
  i.style.display = a ? `` : `none`;
  let o: any = e.querySelector(`[data-tools]`);
  o.innerHTML = (t.tools || [])
    .map(
      (e?: any): any =>
        `<span class="mp-chip"><img src="/assets/logos/tools/${e}.svg" alt="" loading="lazy" onerror="this.style.display='none'" />${YS[e] || e}</span>`,
    )
    .join(``);
  window.innerWidth <= 768 && ((e.style.left = `50%`), (e.style.top = `50%`));
  e.style.opacity = `1`;
  e.style.pointerEvents = `auto`;
  e.style.transform = `translate(-50%, -50%) scale(${wD()})`;
  e._activeId = t.id;
}
function OD(this: any, e?: any): any {
  MD(e);
  AD(e);
  e.style.opacity = `0`;
  e.style.pointerEvents = `none`;
  e.style.transform = `translate(-50%, -50%) scale(${wD() * 0.95})`;
  e._activeId = null;
}
var kD: any = 0;
function AD(this: any, e?: any): any {
  e &&
    e._muffleEngaged &&
    ((e._muffleEngaged = !1),
    audioManager.setMuffle(kD, {
      duration: 0.35,
    }));
}
function jD(this: any, e?: any): any {
  e &&
    ((e._audioSync &&=
      (window.removeEventListener(`audio:statechange`, e._audioSync), null)),
    (e.onended = null),
    (e.muted = !0));
}
function MD(this: any, e?: any): any {
  let t: any = e && e.querySelector(`[data-hero-media]`);
  if (t) {
    try {
      t.pause();
      t.currentTime = 0;
    } catch {}
    jD(t);
  }
}
function ND(this: any, e?: any): any {
  e._worldVideoPreloads ||= [
    ...new Set(companyMarkers.map((e?: any): any => e.video).filter(Boolean)),
  ].map((e?: any): any => {
    let t: any = document.createElement(`video`);
    t.muted = !0;
    t.playsInline = !0;
    t.preload = `auto`;
    t.src = `/assets/videos/${e}`;
    t.style.cssText = `position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;`;
    document.body.appendChild(t);
    t.load();
    return t;
  });
}
function PD(this: any, e?: any): any {
  if (e._worldVideoPreloads) {
    for (let t of e._worldVideoPreloads)
      try {
        t.pause();
        t.removeAttribute(`src`);
        t.load();
        t.remove();
      } catch {}
    e._worldVideoPreloads = null;
  }
}
var FD: any = 2;
function ID(
  this: any,
  e?: any,
  { duration: t = FD, muffle: n = !1 }: any = {},
): any {
  let r: any = document.createElement(`div`);
  r.style.cssText = `
    position: fixed;
    inset: 0;
    pointer-events: none;
    border-radius: 0px;
    box-shadow: 0 0 0 100vmax #ffffff;
    z-index: 50;
  `;
  document.body.appendChild(r);
  document.documentElement.style.setProperty(`--navbar-backdrop-dur`, `${t}s`);
  document.body.classList.add(`frame-open`);
  n &&
    audioManager.setMuffle(0.5, {
      duration: t,
    });
  let i: any = document.createElement(`div`),
    a: any = document.createElement(`div`),
    o: any = document.createElement(`div`),
    s: any = document.createElement(`div`),
    c: any = `
    position: fixed;
    pointer-events: auto;
    z-index: 51;
    background: transparent;
  `;
  i.style.cssText = `${c} top: 0; left: 0; right: 0; height: 0px;`;
  a.style.cssText = `${c} bottom: 0; left: 0; right: 0; height: 0px;`;
  o.style.cssText = `${c} left: 0; top: 0; bottom: 0; width: 0px;`;
  s.style.cssText = `${c} right: 0; top: 0; bottom: 0; width: 0px;`;
  document.body.appendChild(i);
  document.body.appendChild(a);
  document.body.appendChild(o);
  document.body.appendChild(s);
  let l: any = [i, a, o, s],
    u: any = [e.ui._leftGroup, e.ui._rightGroup].filter(Boolean),
    d: any = e.ui._rightGroup || null,
    f: any = !!d && window.matchMedia(`(max-width: 768px)`).matches,
    p: any = f ? getComputedStyle(d) : null,
    m: any = (f && parseFloat(p.left)) || 0,
    h: any = (f && parseFloat(p.right)) || 0,
    g: any =
      e._rulerEl && e._rulerEl.classList.contains(`scroll-ruler`)
        ? e._rulerEl
        : null,
    _: any = {
      inset: 0,
      radius: 0,
    };
  document.documentElement.style.setProperty(`--stage5-frame-inset`, `0px`);
  return {
    el: r,
    navTargets: u,
    rulerEl: g,
    tween: gsap.to(_, {
      inset: 10,
      radius: 32,
      duration: t,
      ease: `power2.out`,
      onUpdate: (): any => {
        r.style.inset = `${_.inset}px`;
        r.style.borderRadius = `${_.radius}px`;
        document.documentElement.style.setProperty(
          `--stage5-frame-inset`,
          `${_.inset}px`,
        );
        i.style.height = `${_.inset}px`;
        a.style.height = `${_.inset}px`;
        o.style.width = `${_.inset}px`;
        s.style.width = `${_.inset}px`;
        for (let t of u) {
          if (t === d && f) {
            d.style.left = `${m + _.inset}px`;
            d.style.right = `${h + _.inset}px`;
            d.style.transform = `translateY(${_.inset}px)`;
            continue;
          }
          let n: any = ``;
          t === e.ui._leftGroup
            ? (n = `translateX(${_.inset}px) `)
            : t === e.ui._rightGroup && (n = `translateX(${-_.inset}px) `);
          t.style.transform = `${n}translateY(${_.inset}px)`;
        }
        g && (g.style.transform = `translateX(-50%) translateY(${_.inset}px)`);
      },
    }),
    borderCatchers: l,
    muffled: n,
  };
}
function LD(this: any, e?: any): any {
  if (e) {
    e.tween && e.tween.kill();
    for (let t of e.navTargets)
      t &&
        ((t.style.transform = ``), (t.style.left = ``), (t.style.right = ``));
    if (
      (e.rulerEl && (e.rulerEl.style.transform = ``),
      document.documentElement.style.removeProperty(`--stage5-frame-inset`),
      e.borderCatchers)
    )
      for (let t of e.borderCatchers) t.remove();
    e.el.style.transition = `opacity 0.3s ease`;
    e.el.style.opacity = `0`;
    setTimeout((): any => e.el.remove(), 300);
    document.body.classList.remove(`frame-open`);
    e.muffled &&
      audioManager.setMuffle(0, {
        duration: 0.45,
      });
  }
}
export { ED, populateCompanyPopup, OD, kD, AD, jD, MD, ND, PD, FD, ID, LD };
