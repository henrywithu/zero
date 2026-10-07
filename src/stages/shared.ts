// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import {
  Vector3,
  Quaternion,
  Texture,
  LinearSRGBColorSpace,
  SRGBColorSpace,
} from "three";
import { audioManager } from "../audio/AudioManager.ts";
import { gsap } from "gsap";
function clampProgress(this: any, e?: any): any {
  return e < 0 ? 0 : e > 1 ? 1 : e;
}
function rangeProgress(this: any, e?: any, t?: any, n?: any): any {
  return clampProgress((e - t) / (n - t));
}
new Vector3();
new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
var gv: any = new Quaternion();
var _v: any = new Vector3(0, 0, 1);
var vv: any = (): any =>
  new Promise((e?: any): any => requestAnimationFrame(e));
var yv: any = 100;
var bv: any = new Set();
var xv: any = 0;
var Sv: any = null;
function awardXp(this: any, e?: any, t?: any): any {
  if (t == null || bv.has(t) || e._xpReplaySkip) return;
  bv.add(t);
  let n: any = bv.size * yv,
    r: any = xv;
  if (n === r) return;
  xv = n;
  audioManager.play(`xp-topup`);
  let i: any = e.ui.xpCounter;
  i.classList.remove(`xp-ripple`);
  i.offsetWidth;
  i.classList.add(`xp-ripple`);
  i.addEventListener(
    `animationend`,
    (): any => i.classList.remove(`xp-ripple`),
    {
      once: !0,
    },
  );
  let a: any = {
      val: r,
    },
    o: any = e.ui._xpValue,
    s: any = o.firstChild;
  if (!s || s.nodeType !== 3) {
    for (; o.firstChild;) o.removeChild(o.firstChild);
    s = document.createTextNode(``);
    o.appendChild(s);
  }
  Sv && Sv.kill();
  Sv = gsap.to(a, {
    val: n,
    duration: 2,
    ease: `power2.out`,
    onUpdate(this: any): any {
      s.nodeValue = Math.round(a.val);
    },
    onComplete(this: any): any {
      s.nodeValue = String(n);
      Sv = null;
    },
  });
}
function loadBitmapTexture(this: any, e?: any, t: any = {}): any {
  let n: any = new Texture();
  n.colorSpace = t.srgb === !1 ? LinearSRGBColorSpace : SRGBColorSpace;
  fetch(e)
    .then((e?: any): any => e.blob())
    .then((e?: any): any =>
      createImageBitmap(e, {
        imageOrientation: `flipY`,
        premultiplyAlpha: `none`,
        colorSpaceConversion: `none`,
      }),
    )
    .then((e?: any): any => {
      n.image = e;
      n.flipY = !1;
      n.needsUpdate = !0;
      let r: any = (t.assetLoader && t.assetLoader.renderer) || t.renderer;
      r && r.initTexture && r.initTexture(n);
    })
    .catch((t?: any): any =>
      console.warn(`_loadTextureBitmap failed: ${e}`, t),
    );
  return n;
}
var Tv: any = window.matchMedia(`(pointer: coarse)`).matches
  ? `assets/videos/stage2_background_video-mobile.mp4`
  : `assets/videos/stage2_background_video-desktop.mp4`;
var Ev: any = `position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none;z-index:-1`;
function createStageVideo(this: any, e: any = ``): any {
  let t: any = document.createElement(`video`);
  t.muted = !0;
  t.defaultMuted = !0;
  t.playsInline = !0;
  t.setAttribute(`playsinline`, ``);
  t.setAttribute(`webkit-playsinline`, ``);
  t.loop = !0;
  t.preload = `auto`;
  t.crossOrigin = `anonymous`;
  t.src = `${e}${Tv}`;
  t.style.cssText = Ev;
  document.body.appendChild(t);
  playStageVideo(t);
  return t;
}
function playStageVideo(this: any, e?: any): any {
  if (!e) return;
  let t: any = e.play();
  !t ||
    typeof t.then != `function` ||
    t.catch((): any => {
      if (e.__retryArmed) return;
      e.__retryArmed = !0;
      let t: any = (): any => {
        e.__retryArmed = !1;
        window.removeEventListener(`pointerdown`, t, !0);
        window.removeEventListener(`touchstart`, t, !0);
        window.removeEventListener(`keydown`, t, !0);
        playStageVideo(e);
      };
      window.addEventListener(`pointerdown`, t, {
        capture: !0,
        once: !0,
      });
      window.addEventListener(`touchstart`, t, {
        capture: !0,
        once: !0,
      });
      window.addEventListener(`keydown`, t, {
        capture: !0,
        once: !0,
      });
    });
}
function whenVideoReady(this: any, e?: any, t?: any): any {
  let n: any = !1,
    r: any = (): any => {
      n || ((n = !0), t());
    };
  if (e.readyState >= 2) {
    queueMicrotask(r);
    return;
  }
  e.addEventListener(`loadeddata`, r, {
    once: !0,
  });
  e.addEventListener(`canplay`, r, {
    once: !0,
  });
  typeof e.requestVideoFrameCallback == `function` &&
    e.requestVideoFrameCallback((): any => r());
}
function disposeStageVideo(this: any, e?: any): any {
  if (e) {
    try {
      e.pause();
    } catch {}
    e.removeAttribute(`src`);
    try {
      e.load();
    } catch {}
    e.parentNode && e.parentNode.removeChild(e);
  }
}
export {
  clampProgress,
  rangeProgress,
  gv,
  _v,
  vv,
  yv,
  bv,
  xv,
  Sv,
  awardXp,
  loadBitmapTexture,
  Tv,
  Ev,
  createStageVideo,
  playStageVideo,
  whenVideoReady,
  disposeStageVideo,
};
