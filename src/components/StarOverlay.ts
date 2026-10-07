// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import {
  Vector2,
  VideoTexture,
  SRGBColorSpace,
  LinearFilter,
  PlaneGeometry,
  Mesh,
  Scene,
  OrthographicCamera,
} from "three";
import { ShaderMaterial } from "../rendering/ShaderMaterial";
import shaderSource56 from "../shaders/StarOverlay-jO-56.vert.glsl?raw";
import shaderSource57 from "../shaders/StarOverlay-MO-57.frag.glsl?raw";
var wO: any = `assets/videos/star_animation_${window.matchMedia(`(pointer: coarse)`).matches && Math.min(window.innerWidth, window.innerHeight) <= 600 ? 480 : 720}.mp4`;
var TO: any = 0.9;
var EO: any = 0.14;
var DO: any = 1;
var OO: any = 0.5;
var kO: any = 1.35;
var AO: any = new Vector2();
var jO: any = shaderSource56;
var MO: any = shaderSource57;
function NO(this: any, e?: any): any {
  let t: any = document.createElement(`video`);
  t.muted = !0;
  t.defaultMuted = !0;
  t.playsInline = !0;
  t.setAttribute(`playsinline`, ``);
  t.setAttribute(`webkit-playsinline`, ``);
  t.loop = !1;
  t.preload = `auto`;
  t.crossOrigin = `anonymous`;
  t.style.cssText = `position:fixed;width:2px;height:2px;right:0;bottom:0;opacity:0;pointer-events:none;z-index:-1`;
  document.body.appendChild(t);
  t.addEventListener(`error`, (): any => {
    console.warn(
      `[StarOverlay] clip failed to load:`,
      e,
      t.error && t.error.code,
    );
  });
  fetch(e)
    .then((e?: any): any => e.blob())
    .then((e?: any): any => {
      t.src = URL.createObjectURL(e);
    })
    .catch((): any => {
      t.src = e;
    });
  return t;
}
function createStarOverlay(this: any, e: any = ``): any {
  let t: any = NO(`${e}${wO}`),
    n: any = new VideoTexture(t);
  n.colorSpace = SRGBColorSpace;
  n.minFilter = LinearFilter;
  n.magFilter = LinearFilter;
  let r: any = new ShaderMaterial({
      uniforms: {
        uColour: {
          value: n,
        },
        uFade: {
          value: 1,
        },
        uAspect: {
          value: 1,
        },
        uFeather: {
          value: 0.3,
        },
        uVideoZoom: {
          value: kO,
        },
      },
      vertexShader: jO,
      fragmentShader: MO,
      transparent: !0,
      depthTest: !1,
      depthWrite: !1,
    }),
    i: any = new PlaneGeometry(1, 1),
    a: any = new Mesh(i, r),
    o: any = new Scene();
  o.add(a);
  let s: any = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  s.position.z = 1;
  let c: any = {
    active: !1,
    _colourVideo: t,
    _colourTex: n,
    _material: r,
    _geometry: i,
    _scene: o,
    _camera: s,
    _played: !1,
    _done: !1,
    _frameReady: !1,
  };
  c.whenReady = new Promise((e?: any): any => {
    if (t.readyState >= 2) return e();
    let n: any = (): any => {
      t.removeEventListener(`loadeddata`, n);
      t.removeEventListener(`canplay`, n);
      e();
    };
    t.addEventListener(`loadeddata`, n, {
      once: !0,
    });
    t.addEventListener(`canplay`, n, {
      once: !0,
    });
  });
  c.render = (e?: any): any => IO(c, e);
  return c;
}
function FO(this: any, e?: any, t?: any, n?: any): any {
  let r: any = t / n,
    i: any = e._camera;
  i.left = -r;
  i.right = r;
  i.top = 1;
  i.bottom = -1;
  i.updateProjectionMatrix();
  let a: any = (OO * (t <= 768 ? 2.1 : 0.9) * 2 * Math.min(t, n)) / n,
    o: any = e._colourVideo,
    s: any = o.videoWidth && o.videoHeight ? o.videoWidth / o.videoHeight : 1,
    c: any = s >= 1 ? a : a * s,
    l: any = s >= 1 ? a / s : a;
  e._scene.children[0].scale.set(c, l, 1);
}
function IO(this: any, e?: any, t?: any): any {
  if (!e.active) return;
  let n: any = e._colourVideo,
    r: any = n.duration;
  if (isFinite(r) && r > 0 && (n.ended || n.currentTime >= r - 0.02)) {
    zO(e);
    return;
  }
  if (!e._frameReady)
    if (n.currentTime > 0) e._frameReady = !0;
    else return;
  if (isFinite(r) && r > 0 && n.currentTime >= r * TO) {
    let t: any = r * (1 - TO);
    e._material.uniforms.uFade.value = Math.max(0, (r - n.currentTime) / t);
  }
  n.videoWidth &&
    n.videoHeight &&
    (e._material.uniforms.uAspect.value = n.videoWidth / n.videoHeight);
  t.getSize(AO);
  FO(e, AO.x, AO.y);
  let i: any = 1;
  if (isFinite(r) && r > 0) {
    let e: any = n.currentTime / r;
    if (e < EO) {
      let t: any = e / EO;
      i = t * t * (3 - 2 * t);
    } else if (e > TO) {
      let e: any = r * (1 - TO),
        t: any = Math.max(0, (r - n.currentTime) / e);
      i = t * t * (3 - 2 * t);
    }
  }
  let a: any = e._scene.children[0];
  a.scale.x *= i;
  a.scale.y *= i;
  let o: any = t.autoClear;
  t.autoClear = !1;
  t.render(e._scene, e._camera);
  t.autoClear = o;
}
function armStarOverlay(this: any, e?: any): any {
  if (!e || e._primed || e._played) return;
  let t: any = e._colourVideo;
  if (!(!t || t.readyState < 2)) {
    e._primed = !0;
    try {
      let e: any = t.play();
      t.pause();
      try {
        t.currentTime = 0;
      } catch {}
      e && typeof e.catch == `function` && e.catch((): any => {});
    } catch {
      e._primed = !1;
    }
  }
}
function RO(this: any, e?: any): any {
  if (!e || e._played) return;
  e._played = !0;
  e.active = !0;
  let t: any = e._colourVideo;
  e._material.uniforms.uFade.value = 1;
  let n: any = (): any => {
      t.playbackRate = DO;
      try {
        t.currentTime = 0;
      } catch {}
      return t.play();
    },
    r: any = !1,
    i: any = (): any => {
      if (r) return;
      r = !0;
      let t: any = [
          `pointerup`,
          `touchend`,
          `pointerdown`,
          `touchstart`,
          `click`,
        ],
        i: any = (): any => {
          for (let e of t) window.removeEventListener(e, a, !0);
          e._cancelRetry = null;
        },
        a: any = (): any => {
          if (e._done || !e.active) {
            i();
            return;
          }
          let t: any = n();
          t && typeof t.then == `function` ? t.then(i, (): any => {}) : i();
        };
      e._cancelRetry = i;
      for (let e of t)
        window.addEventListener(e, a, {
          capture: !0,
        });
    },
    a: any = n();
  a && typeof a.catch == `function` && a.catch(i);
  t.addEventListener(
    `canplay`,
    (): any => {
      e.active && t.paused && t.play().catch((): any => {});
    },
    {
      once: !0,
    },
  );
}
function zO(this: any, e?: any): any {
  e._done || ((e._done = !0), (e.active = !1), warmStarOverlay(e));
}
function stopStarOverlay(this: any, e?: any): any {
  if (!e || e._done) return;
  let t: any = e._colourVideo;
  (t && !t.paused && !t.ended && t.currentTime > 0) || warmStarOverlay(e);
}
function warmStarOverlay(this: any, e?: any): any {
  if (!e) return;
  e._done = !0;
  e._cancelRetry && e._cancelRetry();
  e.active = !1;
  let t: any = e._colourVideo;
  if (t) {
    try {
      t.pause();
    } catch {}
    let e: any = t.currentSrc || t.src;
    if (e && e.startsWith(`blob:`))
      try {
        URL.revokeObjectURL(e);
      } catch {}
    t.removeAttribute(`src`);
    try {
      t.load();
    } catch {}
    t.parentNode && t.parentNode.removeChild(t);
  }
  e._colourTex?.dispose?.();
  e._material?.dispose?.();
  e._geometry?.dispose?.();
}
export {
  wO,
  TO,
  EO,
  DO,
  OO,
  kO,
  AO,
  jO,
  MO,
  NO,
  createStarOverlay,
  FO,
  IO,
  armStarOverlay,
  RO,
  zO,
  stopStarOverlay,
  warmStarOverlay,
};
