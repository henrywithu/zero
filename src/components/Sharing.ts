import { uE } from "./shareIcons.ts";
import { lE } from "./shareIcons.ts";
import { cE } from "./shareIcons.ts";
// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { HT, WT, BT, VT } from "./WaitlistOverlay.ts";
import { aE } from "./ShareCard.ts";
import { audioManager } from "../audio/AudioManager.ts";
import { gsap } from "gsap";
import { zT } from "../runtime/preload";
import { c } from "../runtime/interop";
var qT: any = !1;
function JT(this: any): any {
  if (qT) return;
  qT = !0;
  let e: any = document.createElement(`style`);
  e.dataset.sharePopup = `1`;
  e.textContent = `
    .sp-backdrop {
      position: fixed; inset: 0;
      background: rgba(20, 22, 24, 0.42);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      z-index: 100000;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; will-change: opacity;
    }
    /* Transparent wrapper — just the poster card + socials, no panel chrome
       (no background, heading, close button or link pill). Floats over the
       dimmed backdrop; click outside (or Esc) dismisses. */
    .sp-panel {
      position: relative;
      max-height: 96vh;
      display: flex; flex-direction: column; align-items: center; gap: 22px;
      transform: translateY(24px); opacity: 0;
      will-change: transform, opacity;
    }
    .sp-poster-wrap { display: flex; align-items: center; justify-content: center; }

    .sp-socials { display: flex; gap: 12px; justify-content: center; }
    .sp-social-btn {
      flex: 0 0 auto; width: 58px; height: 58px;
      background: #ffffff; border: none; border-radius: 50%;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      color: #1f1d1e; transition: background 0.2s ease, transform 0.15s ease;
      box-shadow: 0 8px 26px rgba(0,0,0,0.14);
    }
    .sp-social-btn:hover { background: #f6f6f6; transform: translateY(-2px); }
    .sp-social-btn svg { width: 22px; height: 22px; }

    @media (max-width: 768px) {
      .sp-panel { gap: 16px; }
      .sp-social-btn { width: 50px; height: 50px; }
      .sp-social-btn svg { width: 20px; height: 20px; }
    }

    /* Touch devices get a single share-sheet button instead of the four
       network buttons — a labelled pill. Two-class selector so it beats the
       fixed width the phone media query puts on .sp-social-btn. */
    .sp-social-btn.sp-share-one {
      width: auto; min-height: 50px;
      padding: 0 28px; gap: 10px;
      border-radius: 999px;
      font: 600 15px/1 'Inter', sans-serif;
    }

    @keyframes sp-spin { to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(e);
}
function YT(
  this: any,
  {
    referralSlug: e = HT,
    referralUrl: t = null,
    userName: n = ``,
    university: r = ``,
    memberNumber: i = WT,
    assetUrl: a = null,
    aoUrl: o = null,
    onClose: s,
  }: any = {},
): any {
  JT();
  let c: any =
    t ||
    (e
      ? `https://zero.henrywithu.com?ref=${e}`
      : `https://zero.henrywithu.com`);
  c.replace(/^https?:\/\//, ``);
  let l: any = `A little wonder, folded for you. Explore Trapnest Zero — paper, glass, and possibility.`,
    u: any = `
        <button class="sp-social-btn sp-share-one" type="button" data-share-action="share" aria-label="Share">${cE()}<span>Share</span></button>
        <button class="sp-social-btn sp-share-one" type="button" data-share-action="download" aria-label="Download video">${lE()}<span>Download</span></button>
        <button class="sp-social-btn" type="button" data-close aria-label="Close">${uE()}</button>`,
    d: any = document.createElement(`div`);
  d.className = `sp-backdrop`;
  d.innerHTML = `
    <div class="sp-panel" role="dialog" aria-modal="true" aria-label="Share">
      <div class="sp-poster-wrap"></div>

      <div class="sp-socials">${u}
      </div>
    </div>
  `;
  document.body.appendChild(d);
  let f: any = d.querySelector(`.sp-panel`),
    p: any = aE({
      container: d.querySelector(`.sp-poster-wrap`),
      userName: n,
      university: r,
      memberNumber: i,
      assetUrl: a,
      aoUrl: o,
    });
  audioManager.play(`whoosh`);
  let m: any,
    h: any = new Promise((e?: any): any => {
      m = e;
    });
  gsap.to(d, {
    opacity: 1,
    duration: BT,
    ease: `power2.out`,
  });
  gsap.to(f, {
    y: 0,
    opacity: 1,
    duration: BT,
    ease: `power3.out`,
    onComplete: m,
  });
  let g: any = null;
  Promise.all([p.ready, h])
    .then(
      (): any =>
        new Promise((e?: any): any => {
          window.requestIdleCallback
            ? window.requestIdleCallback((): any => e(), {
                timeout: 2500,
              })
            : setTimeout(e, 350);
        }),
    )
    .then((): any => (_ ? null : rE(p)))
    .then((e?: any): any => {
      g = e;
    })
    .catch((): any => {});
  let _: any = !1;
  function v(this: any): any {
    _ ||
      ((_ = !0),
      audioManager.play(`whoosh`),
      gsap.to(d, {
        opacity: 0,
        duration: VT,
        ease: `power2.in`,
      }),
      gsap.to(f, {
        y: 16,
        opacity: 0,
        duration: VT,
        ease: `power2.in`,
        onComplete: (): any => {
          p.destroy();
          d.remove();
          s && s();
        },
      }));
  }
  d.addEventListener(`click`, (e?: any): any => {
    e.target === d && v();
  });
  let y: any = (e?: any): any => {
    e.key === `Escape` && v();
  };
  document.addEventListener(`keydown`, y);
  let b: any = null,
    x: any = 0,
    S: any = (e?: any): any => {
      b ||
        ((b = document.createElement(`div`)),
        (b.style.cssText = `position:absolute; left:50%; bottom:28px; transform:translateX(-50%);background:rgba(20,20,20,0.92); color:#fff; padding:10px 18px;border-radius:999px; font:500 13px/1.2 'Inter',sans-serif; z-index:5;opacity:0; transition:opacity .25s ease; pointer-events:none;white-space:nowrap;`),
        d.appendChild(b));
      b.textContent = e;
      b.style.opacity = `1`;
      clearTimeout(x);
      x = setTimeout((): any => {
        b.style.opacity = `0`;
      }, 5e3);
    },
    C: any = !1,
    w: any = async (e?: any, t?: any): Promise<any> => {
      if (!C) {
        C = !0;
        t && (t.style.opacity = `0.6`);
        try {
          if (e === `share`) {
            let e: any = g;
            if (
              e &&
              navigator.canShare &&
              navigator.canShare({
                files: [e],
              })
            )
              try {
                await navigator.share({
                  files: [e],
                  text: l,
                  url: c,
                });
                return;
              } catch (e: any) {
                if (e && e.name === `AbortError`) return;
              }
            if (navigator.share)
              try {
                await navigator.share({
                  text: l,
                  url: c,
                });
                return;
              } catch (e: any) {
                if (e && e.name === `AbortError`) return;
              }
            let n: any = await QT(c);
            XT(t);
            S(n ? `Invite link copied` : `Could not copy the link.`);
            return;
          }
          if (e === `download`) {
            let e: any = ZT(d);
            try {
              let e: any = await iE(p);
              if (e === `unsupported`) {
                S(`This browser can't record video.`);
                return;
              }
              if (!e) {
                S(`Could not download the video.`);
                return;
              }
              let n: any = URL.createObjectURL(e),
                r: any = document.createElement(`a`);
              r.href = n;
              r.download = e.name || `trapnest-zero-invite.mp4`;
              document.body.appendChild(r);
              r.click();
              r.remove();
              setTimeout((): any => URL.revokeObjectURL(n), 8e3);
              XT(t);
            } finally {
              e.remove();
            }
            return;
          }
        } finally {
          C = !1;
          t && (t.style.opacity = ``);
        }
      }
    };
  f.addEventListener(`click`, (e?: any): any => {
    if (e.target.closest(`[data-close]`)) {
      v();
      return;
    }
    let t: any = e.target.closest(`[data-share-action]`);
    t && w(t.dataset.shareAction, t);
  });
  return {
    close: v,
    destroy: (): any => {
      document.removeEventListener(`keydown`, y);
      v();
    },
  };
}
function XT(this: any, e?: any): any {
  e.style.background = `#c9f5d3`;
  setTimeout((): any => {
    e.style.background = ``;
  }, 1100);
}
function ZT(this: any, e?: any): any {
  let t: any = document.createElement(`div`);
  t.style.cssText = `position:absolute; inset:0; z-index:10;background:rgba(12,14,16,0.72);-webkit-backdrop-filter:blur(3px); backdrop-filter:blur(3px);display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px;color:#fff; font:600 16px/1.2 'Inter',sans-serif; letter-spacing:0.02em;`;
  t.innerHTML = `<div style="width:34px; height:34px; border-radius:50%;border:3px solid rgba(255,255,255,0.25); border-top-color:#fff;animation:sp-spin 0.8s linear infinite;"></div><span>Loading…</span>`;
  e.appendChild(t);
  return t;
}
async function QT(this: any, e?: any): Promise<any> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(e);
      return !0;
    }
  } catch {}
  try {
    let t: any = document.createElement(`textarea`);
    t.value = e;
    t.setAttribute(`readonly`, ``);
    t.style.cssText = `position:fixed; top:0; left:0; opacity:0; pointer-events:none;`;
    document.body.appendChild(t);
    t.select();
    t.setSelectionRange(0, e.length);
    let n: any = document.execCommand(`copy`);
    t.remove();
    return n;
  } catch {
    return !1;
  }
}
function $T(this: any, e?: any): any {
  return new Promise((t?: any, n?: any): any => {
    let r: any = new Image();
    r.onload = (): any => t(r);
    r.onerror = n;
    r.src = e;
  });
}
function eE(this: any): any {
  return (
    /iP(hone|od|ad)/.test(navigator.userAgent) ||
    (navigator.platform === `MacIntel` && navigator.maxTouchPoints > 1)
  );
}
async function tE(this: any, e?: any): Promise<any> {
  if (!e || !e.src || !eE()) return null;
  try {
    let t: any = await $T(e.src),
      n: any = Math.max(1, Math.round((e.offsetWidth || 44) * 3)),
      r: any = Math.max(1, Math.round((e.offsetHeight || 13) * 3)),
      i: any = document.createElement(`canvas`);
    i.width = n;
    i.height = r;
    i.getContext(`2d`).drawImage(t, 0, 0, n, r);
    let a: any = e.src;
    if (((e.src = i.toDataURL(`image/png`)), e.decode))
      try {
        await e.decode();
      } catch {}
    return a;
  } catch {
    return null;
  }
}
function nE(this: any, e?: any, t?: any, n?: any, r?: any): any {
  let i: any = document.createElement(`canvas`);
  i.width = n;
  i.height = r;
  let a: any = i.getContext(`2d`),
    o: any = n / e.offsetWidth,
    s: any = r / e.offsetHeight,
    c: any = e.querySelector(`img[alt="Trapnest Zero"]`);
  t &&
    c &&
    a.drawImage(
      t,
      c.offsetLeft * o,
      c.offsetTop * s,
      c.offsetWidth * o,
      c.offsetHeight * s,
    );
  e.querySelectorAll(`.sp-corner-label`).forEach((e?: any): any => {
    let t: any = getComputedStyle(e);
    a.save();
    a.font = `${t.fontWeight} ${parseFloat(t.fontSize) * o}px ${t.fontFamily}`;
    a.fillStyle = t.color;
    a.textBaseline = `middle`;
    try {
      a.letterSpacing = `${(parseFloat(t.letterSpacing) || 0) * o}px`;
    } catch {}
    let n: any =
        t.textTransform === `uppercase`
          ? e.textContent.toUpperCase()
          : e.textContent,
      r: any = (e.offsetTop + e.offsetHeight / 2) * s;
    e.dataset.align === `right`
      ? ((a.textAlign = `right`),
        a.fillText(n, (e.offsetLeft + e.offsetWidth) * o, r))
      : ((a.textAlign = `left`), a.fillText(n, e.offsetLeft * o, r));
    a.restore();
  });
  return i;
}
async function rE(this: any, e?: any): Promise<any> {
  let t: any = e?.el;
  if (!t) return null;
  let n: any = t.querySelector(`canvas`),
    r: any = t.querySelector(`img[alt="Trapnest Zero"]`),
    i: any = null,
    a: any = null;
  try {
    let { default: o } = await zT(async (): Promise<any> => {
        let { default: e } = await import(`html2canvas`).then((e?: any): any =>
          c(e.default, 1),
        );
        return {
          default: e,
        };
      }, []),
      s: any = e.snapshot ? e.snapshot() : null;
    s &&
      n &&
      ((i = await $T(s).catch((): any => null)),
      i &&
        ((i.style.cssText =
          n.style.cssText || `width:100%;height:100%;display:block;`),
        n.replaceWith(i)));
    a = await tE(r);
    let l: any = await o(t, {
        backgroundColor: `#ffffff`,
        scale: Math.min(window.devicePixelRatio || 1, 2),
        useCORS: !0,
        logging: !1,
      }),
      u: any = await new Promise((e?: any): any =>
        l.toBlob((t?: any): any => e(t), `image/jpeg`, 0.9),
      );
    return u
      ? new File([u], `trapnest-zero-invite.jpg`, {
          type: `image/jpeg`,
        })
      : null;
  } catch {
    return null;
  } finally {
    i && i.parentNode && n && i.replaceWith(n);
    r && a && (r.src = a);
  }
}
async function iE(this: any, e?: any): Promise<any> {
  let t: any = e?.el;
  if (!t) return null;
  if (typeof VideoEncoder > `u` || typeof VideoFrame > `u`)
    return `unsupported`;
  let n: any = 6e6,
    r: any = Math.min(window.devicePixelRatio || 1, 2),
    i: any = (e?: any): any => ((e = Math.round(e)), e % 2 ? e + 1 : e),
    a: any = i(t.offsetWidth * r),
    o: any = i(t.offsetHeight * r);
  if (!a || !o) return null;
  let s: any = null;
  for (let e of [`avc1.640028`, `avc1.4d0028`, `avc1.420028`])
    try {
      let t: any = await VideoEncoder.isConfigSupported({
        codec: e,
        width: a,
        height: o,
        bitrate: n,
        framerate: 30,
      });
      if (t && t.supported) {
        s = e;
        break;
      }
    } catch {}
  if (!s) return `unsupported`;
  let l: any = t.querySelector(`canvas`),
    u: any = t.querySelector(`img[alt="Trapnest Zero"]`);
  if (!l || !e.renderFoldFraction || !e.snapshotCanvas) return null;
  let d: any = a / t.offsetWidth,
    f: any = o / t.offsetHeight,
    p: any = l.parentElement,
    m: any = (p.offsetLeft + l.offsetLeft) * d,
    h: any = (p.offsetTop + l.offsetTop) * f,
    g: any = l.offsetWidth * d,
    _: any = l.offsetHeight * f;
  try {
    let { default: i } = await zT(async (): Promise<any> => {
        let { default: e } = await import(`html2canvas`).then((e?: any): any =>
          c(e.default, 1),
        );
        return {
          default: e,
        };
      }, []),
      { Muxer: l, ArrayBufferTarget: d } = await zT(async (): Promise<any> => {
        let { Muxer: e, ArrayBufferTarget: t } = await import(`mp4-muxer`);
        return {
          Muxer: e,
          ArrayBufferTarget: t,
        };
      }, []),
      f: any = {
        scale: r,
        useCORS: !0,
        logging: !1,
      },
      p: any = (e?: any): any => {
        e.style.boxShadow = `none`;
        e.style.borderRadius = `0`;
      },
      v: any = await i(t, {
        ...f,
        backgroundColor: `#ffffff`,
        onclone: (e?: any, t?: any): any => {
          p(t);
          Array.from(t.children).forEach((e?: any): any => {
            e.classList.contains(`sp-card-gradient`) ||
              (e.style.visibility = `hidden`);
          });
        },
      }),
      y: any = await i(t, {
        ...f,
        backgroundColor: null,
        onclone: (e?: any, t?: any): any => {
          p(t);
          t.style.background = `transparent`;
          Array.from(t.children).forEach((e?: any): any => {
            (e.classList.contains(`sp-card-gradient`) ||
              e.classList.contains(`sp-poster-origami`) ||
              e.classList.contains(`sp-corner`)) &&
              (e.style.visibility = `hidden`);
          });
        },
      }),
      b: any = nE(
        t,
        u && u.src ? await $T(u.src).catch((): any => null) : null,
        a,
        o,
      ),
      x: any = document.createElement(`canvas`);
    x.width = a;
    x.height = o;
    let S: any = x.getContext(`2d`),
      C: any = new l({
        target: new d(),
        video: {
          codec: `avc`,
          width: a,
          height: o,
          frameRate: 30,
        },
        fastStart: `in-memory`,
      }),
      w: any = null,
      T: any = new VideoEncoder({
        output: (e?: any, t?: any): any => C.addVideoChunk(e, t),
        error: (e?: any): any => {
          w = e;
        },
      });
    T.configure({
      codec: s,
      width: a,
      height: o,
      bitrate: n,
      framerate: 30,
    });
    let E: any = e.foldDuration && e.foldDuration() > 0 ? e.foldDuration() : 3,
      D: any = Math.max(1, Math.round(E * 30)),
      O: any = D * 3,
      k: any = 33333;
    e.pauseAuto && e.pauseAuto();
    try {
      for (let t: any = 0; t < O && !w; t++) {
        e.renderFoldFraction((t % D) / D);
        let n: any = e.snapshotCanvas();
        S.drawImage(v, 0, 0, a, o);
        n && S.drawImage(n, m, h, g, _);
        S.drawImage(y, 0, 0, a, o);
        S.drawImage(b, 0, 0);
        let r: any = new VideoFrame(x, {
          timestamp: t * k,
          duration: k,
        });
        T.encode(r, {
          keyFrame: t === 0,
        });
        r.close();
        T.encodeQueueSize > 10 &&
          (await new Promise((e?: any): any => setTimeout(e, 0)));
      }
      await T.flush();
    } finally {
      e.resumeAuto && e.resumeAuto();
    }
    try {
      T.close();
    } catch {}
    if (w) return null;
    C.finalize();
    let A: any = C.target.buffer;
    return !A || !A.byteLength
      ? null
      : new File([A], `trapnest-zero-invite.mp4`, {
          type: `video/mp4`,
        });
  } catch {
    return null;
  }
}
export { qT, JT, YT, XT, ZT, QT, $T, eE, tE, nE, rE, iE };
