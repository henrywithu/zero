// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  TextureLoader,
  ClampToEdgeWrapping,
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  PlaneGeometry,
  Mesh,
  Group,
  BoxGeometry,
  SpriteMaterial,
  CanvasTexture,
  Sprite,
  Vector3,
  BufferGeometry,
  BufferAttribute,
  Color,
  Points,
  Clock,
  Box3,
  AnimationMixer,
  InterpolateDiscrete,
  Sphere,
} from "three";
import { ShaderMaterial } from "../rendering/ShaderMaterial";
import { yT } from "./OrigamiPreview.ts";
import { gT, _T } from "./OrigamiCertificate.ts";
import shaderSource48 from "../shaders/WaitlistOverlay-vertexShader-48.vert.glsl?raw";
import shaderSource49 from "../shaders/WaitlistOverlay-fragmentShader-49.frag.glsl?raw";
import { gsap } from "gsap";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
var bT: any = 0.6;
var xT: any = 2;
var ST: any = 1;
var CT: any = 1;
var wT: any = 1;
var TT: any = 1.9;
var ET: any = 2.1;
var DT: any = ET / Math.SQRT2;
var OT: any = null;
function kT(this: any): any {
  if (OT) return OT;
  let e: any = new DRACOLoader();
  e.setDecoderPath(`/vendor/draco/`);
  let t: any = new GLTFLoader();
  t.setDRACOLoader(e);
  OT = t;
  return t;
}
var AT: any = null;
function jT(this: any, e?: any): any {
  AT ||= new TextureLoader();
  let t: any = AT.load(e);
  t.flipY = !1;
  t.colorSpace = ``;
  t.anisotropy = 8;
  t.wrapS = ClampToEdgeWrapping;
  t.wrapT = ClampToEdgeWrapping;
  return t;
}
var MT: any = 2e3;
var NT: any = 1.2;
function createWaitlistOverlay(
  this: any,
  {
    host: e,
    onComplete: t,
    skipToEnd: n = !1,
    assetUrl: r = null,
    aoUrl: i = null,
    university: a = ``,
    userName: o = ``,
    glowFold: s = !1,
    glowOpts: c = {},
  }: any = {},
): any {
  if (!e) {
    console.warn(`[CertificateFold] host element required`);
    return {
      destroy: (): any => {},
    };
  }
  let l: any = window.innerWidth <= 768,
    u: any = document.createElement(`div`);
  u.className = `cf-layout`;
  u.style.cssText = `
    position: absolute;
    inset: 80px ${l ? `24px` : `64px`} ${l ? `160px` : `200px`} ${l ? `24px` : `64px`};
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    will-change: opacity;
    z-index: 1;
  `;
  e.appendChild(u);
  let d: any = n || s ? null : yT(e),
    f: any = document.createElement(`div`);
  f.className = `cf-scene`;
  f.style.cssText = `
    display: flex; align-items: center; justify-content: center;
    aspect-ratio: 1 / 1;
    width: 100%;
    max-width: ${l ? `90vw` : `660px`};
    max-height: ${l ? `64vh` : `660px`};
  `;
  let p: any = document.createElement(`canvas`);
  p.style.cssText = `
    width: 100%; height: 100%; display: block;
    background: transparent;
  `;
  f.appendChild(p);
  u.appendChild(f);
  let m: any = new WebGLRenderer({
    canvas: p,
    antialias: !0,
    alpha: !0,
    premultipliedAlpha: !1,
  });
  m.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  m.setClearColor(0, 0);
  let h: any = new Scene();
  h.background = null;
  let g: any = new PerspectiveCamera(20, 1, 0.1, 100);
  g.position.set(0, 0, 7);
  g.lookAt(0, 0, 0);
  let _: any = gT({
      university: a,
      userName: o,
    }),
    v: any = new PlaneGeometry(ET, DT),
    y: any = v.attributes.uv;
  for (let e: any = 0; e < y.count; e++) y.setY(e, 1 - y.getY(e));
  y.needsUpdate = !0;
  let b: any = _T({
      colorMap: _,
    }),
    x: any = new Mesh(v, b);
  x.rotation.x = -0.15;
  x.visible = !n;
  h.add(x);
  let S: any = new Group();
  S.rotation.y = Math.PI;
  h.add(S);
  let C: any = new BoxGeometry(1.35, 1.35, 1.35),
    w: any = _T({
      colorMap: _,
    }),
    T: any = new Mesh(C, w);
  T.visible = n;
  S.add(T);
  let E: any = s
      ? {
          peakBrightness: 7,
          holdBeforeCharge: 1.1,
          chargeDuration: 1.2,
          revealDuration: 1.2,
          burstDuration: 1.4,
          peakBeat: 0.35,
          haloColor: `#ffd98c`,
          haloOpacity: 0.85,
          haloSize: 4.6,
          particleColor: `#ffe9b0`,
          particleCount: 260,
          particleSpread: 2.3,
          ...c,
        }
      : null,
    D: any = null,
    O: any = null,
    k: any = null,
    A: any = null,
    j: any = null,
    M: any = {
      brightness: 1,
    },
    N: any = (): any => {
      let e: any = M.brightness;
      b.emissiveIntensity = e;
      w.emissiveIntensity = e;
      j && (j.emissiveIntensity = e);
    };
  if (E) {
    let e: any = document.createElement(`canvas`);
    e.width = e.height = 128;
    let t: any = e.getContext(`2d`),
      n: any = t.createRadialGradient(64, 64, 0, 64, 64, 64);
    n.addColorStop(0, `rgba(255,255,255,1)`);
    n.addColorStop(0.35, `${E.haloColor}`);
    n.addColorStop(1, `rgba(255,255,255,0)`);
    t.fillStyle = n;
    t.fillRect(0, 0, 128, 128);
    O = new SpriteMaterial({
      map: new CanvasTexture(e),
      transparent: !0,
      opacity: 0,
      depthWrite: !1,
      depthTest: !1,
    });
    D = new Sprite(O);
    D.scale.setScalar(E.haloSize);
    D.renderOrder = -1;
    h.add(D);
    let r: any = E.particleCount,
      i: any = new Float32Array(r * 3),
      a: any = new Float32Array(r * 3),
      o: any = new Float32Array(r),
      s: any = new Vector3();
    for (let e: any = 0; e < r; e++) {
      s.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
        .normalize()
        .multiplyScalar(0.4 + Math.random() * 0.6);
      a[e * 3] = s.x;
      a[e * 3 + 1] = s.y;
      a[e * 3 + 2] = s.z;
      o[e] = Math.random();
    }
    let c: any = new BufferGeometry();
    c.setAttribute(`position`, new BufferAttribute(i, 3));
    c.setAttribute(`aDir`, new BufferAttribute(a, 3));
    c.setAttribute(`aSeed`, new BufferAttribute(o, 1));
    A = {
      uTime: {
        value: 0,
      },
      uColor: {
        value: new Color(E.particleColor),
      },
      uSpread: {
        value: E.particleSpread,
      },
      uSize: {
        value: (l ? 26 : 34) * Math.min(window.devicePixelRatio, 2),
      },
    };
    k = new Points(
      c,
      new ShaderMaterial({
        uniforms: A,
        transparent: !0,
        depthWrite: !1,
        depthTest: !1,
        vertexShader: shaderSource48,
        fragmentShader: shaderSource49,
      }),
    );
    k.frustumCulled = !1;
    k.renderOrder = 2;
    k.visible = !1;
    h.add(k);
  }
  let P: any = i ? jT(i) : null,
    F: any = null,
    I: any = !1,
    L: any = !1,
    R: any = null,
    z: any = new Clock(),
    ee: any = !1,
    ne: any = n,
    re: any = null,
    ie: any = (): any => {
      if (!ee || ne) return;
      let e: any = null;
      F ? (e = F) : (!r || L) && (e = T);
      e &&
        ((ne = !0),
        (e.visible = !0),
        (H.enabled = !0),
        d && d.hide(wT * 0.6),
        re && re.kill(),
        (re = gsap.to(u, {
          opacity: 1,
          duration: wT,
          ease: `power2.out`,
          onComplete: we,
        })));
    },
    ae: any = !1,
    B: any = !1,
    oe: any = !1,
    se: any = [],
    ce: any = (): any => {
      Ee ||
        (gsap.to(M, {
          brightness: 1,
          duration: E.revealDuration,
          ease: `power2.inOut`,
          onUpdate: N,
          onComplete: (): any => {
            H.enabled = !0;
            we();
          },
        }),
        gsap.to(O, {
          opacity: 0,
          duration: E.revealDuration * 1.15,
          ease: `power2.inOut`,
        }));
    },
    V: any = (): any => {
      !E ||
        oe ||
        Ee ||
        ((oe = !0),
        gsap.to(O, {
          opacity: 1,
          duration: 0.16,
          ease: `power2.out`,
        }),
        gsap.to(D.scale, {
          x: E.haloSize * 1.35,
          y: E.haloSize * 1.35,
          duration: 0.5,
          ease: `power2.out`,
        }),
        k &&
          ((k.visible = !0),
          gsap.to(A.uTime, {
            value: 1,
            duration: E.burstDuration,
            ease: `none`,
            onComplete: (): any => {
              k && (k.visible = !1);
            },
          })),
        gsap.delayedCall(E.peakBeat, ce));
    },
    le: any = (): any => V(),
    ue: any = (): any => {
      if (!(!E || !ae || B || Ee))
        if (F) {
          if (((B = !0), (F.visible = !0), (x.visible = !1), R && se.length)) {
            for (let e of se) e.paused = !1;
            z.getDelta();
          } else gsap.delayedCall(0.4, V);
        } else
          (!r || L) &&
            ((B = !0),
            (T.visible = !0),
            (x.visible = !1),
            gsap.delayedCall(0.4, V));
    };
  r &&
    kT().load(
      r,
      (e?: any): any => {
        let t: any = e.scene || (e.scenes && e.scenes[0]);
        if (!t) {
          L = !0;
          E ? ue() : ie();
          return;
        }
        t.updateMatrixWorld(!0);
        let n: any = new Box3(),
          r: any = new Box3();
        t.traverse((e?: any): any => {
          e.isMesh &&
            (e.isSkinnedMesh
              ? (e.computeBoundingBox(), r.copy(e.boundingBox))
              : (e.geometry.boundingBox || e.geometry.computeBoundingBox(),
                r.copy(e.geometry.boundingBox)),
            r.applyMatrix4(e.matrixWorld),
            n.union(r));
        });
        let i: any = new Vector3(),
          a: any = new Vector3();
        n.getSize(i);
        n.getCenter(a);
        t.position.sub(a);
        let o: any = Math.max(i.x, i.y, i.z) || 1,
          s: any = 0;
        t.traverse((e?: any): any => {
          e.isMesh && e.geometry?.attributes?.uv1 && (s = 1);
        });
        let c: any = _T({
          colorMap: _,
          aoMap: P,
          aoChannel: s,
        });
        E && ((j = c), N());
        t.traverse((e?: any): any => {
          if (!e.isMesh) return;
          let t: any = e.material;
          e.material = c;
          Array.isArray(t)
            ? t.forEach((e?: any): any => e?.dispose?.())
            : t?.dispose?.();
        });
        F = new Group();
        F.add(t);
        F.scale.setScalar(TT / o);
        F.visible = ne;
        S.add(F);
        S.remove(T);
        I = !0;
        C.dispose();
        w.dispose();
        let l: any = 0;
        e.animations &&
          e.animations.length &&
          ((R = new AnimationMixer(t)),
          e.animations.forEach((e?: any): any => {
            let t: any = R.clipAction(e);
            E
              ? (t.setLoop(InterpolateDiscrete, 1),
                (t.clampWhenFinished = !0),
                t.play(),
                (t.paused = !0),
                se.push(t))
              : t.play();
            l = Math.max(l, e.duration);
          }),
          E && R.addEventListener(`finished`, le));
        {
          let e: any = new Box3(),
            n: any = new Box3(),
            r: any = new Sphere(),
            i: any = g.position.length(),
            a: any = 0,
            o: any = R && l > 0 ? 16 : 0;
          for (let i: any = 0; i <= o; i++) {
            R && l > 0 && R.setTime((i / o) * l);
            S.updateMatrixWorld(!0);
            e.makeEmpty();
            t.traverse((t?: any): any => {
              t.isMesh &&
                (t.isSkinnedMesh
                  ? (t.computeBoundingBox(), n.copy(t.boundingBox))
                  : (t.geometry.boundingBox || t.geometry.computeBoundingBox(),
                    n.copy(t.geometry.boundingBox)),
                n.applyMatrix4(t.matrixWorld),
                e.union(n));
            });
            !e.isEmpty() &&
              (e.getBoundingSphere(r),
              (a = Math.max(a, r.center.length() + r.radius)));
          }
          if (a > 0 && a < i) {
            let e: any = Math.max(0.1, a * 0.12);
            g.near = Math.max(0.05, i - a - e);
            g.far = i + a + e;
            g.updateProjectionMatrix();
          }
          R && R.setTime(0);
        }
        z.getDelta();
        E ? ue() : ie();
      },
      void 0,
      (e?: any): any => {
        console.warn(`[CertificateFold] origami load failed`, r, e);
        L = !0;
        E ? ue() : ie();
      },
    );
  let H: any = new OrbitControls(g, p);
  H.enablePan = !1;
  H.enableZoom = !1;
  H.enableDamping = !0;
  H.dampingFactor = 0.08;
  H.rotateSpeed = 0.85;
  H.enabled = n;
  H.minPolarAngle = Math.PI / 2;
  H.maxPolarAngle = Math.PI / 2;
  p.style.cursor = `grab`;
  H.autoRotate = !1;
  H.autoRotateSpeed = NT;
  let U: any = !1,
    de: any = null,
    W: any = (): any => {
      U &&
        (de && clearTimeout(de),
        (de = setTimeout((): any => {
          H.autoRotate = !0;
        }, MT)));
    },
    fe: any = (): any => {
      H.autoRotate = !1;
      de &&= (clearTimeout(de), null);
    };
  function pe(this: any, e?: any): any {
    U = !!e;
    U ? W() : fe();
  }
  let me: any = !1;
  H.addEventListener(`start`, (): any => {
    me = !0;
    p.style.cursor = `grabbing`;
    fe();
  });
  H.addEventListener(`end`, (): any => {
    me = !1;
    p.style.cursor = `grab`;
    W();
  });
  let he: any = (e?: any): any => {
    e.isTrusted &&
      me &&
      p.dispatchEvent(
        new PointerEvent(`pointercancel`, {
          pointerId: e.pointerId,
          pointerType: e.pointerType,
          clientX: e.clientX,
          clientY: e.clientY,
        }),
      );
  };
  window.addEventListener(`pointerup`, he, !0);
  window.addEventListener(`pointercancel`, he, !0);
  let ge: any = null,
    _e: any = (): any => {
      let e: any = p.clientWidth,
        t: any = p.clientHeight;
      !e ||
        !t ||
        (m.setSize(e, t, !1),
        (g.aspect = e / t),
        g.updateProjectionMatrix(),
        m.render(h, g));
    },
    ve: any = (): any => {
      ge = requestAnimationFrame(ve);
      R && R.update(z.getDelta());
      H.update();
      m.render(h, g);
    };
  _e();
  ve();
  let ye: any = new ResizeObserver(_e);
  ye.observe(p);
  let be: any = !1;
  function xe(this: any): any {
    be || Ee || ((be = !0), cancelAnimationFrame(ge), (ge = null));
  }
  function Se(this: any): any {
    !be || Ee || ((be = !1), z.getDelta(), ve());
  }
  let Ce: any = !1;
  function we(this: any): any {
    Ce ||
      ((Ce = !0),
      t &&
        t({
          sceneEl: f,
          canvas: p,
          renderer: m,
          scene: h,
          camera: g,
          cube: T,
          layout: u,
          setAutoRotate: pe,
          pause: xe,
          resume: Se,
          destroy: De,
        }));
  }
  let Te: any = null,
    Ee: any = !1;
  _.userData.ready.then((): any => {
    Ee ||
      (n
        ? ((u.style.opacity = `1`),
          requestAnimationFrame((): any => {
            Ee ||
              (t &&
                t({
                  sceneEl: f,
                  canvas: p,
                  renderer: m,
                  scene: h,
                  camera: g,
                  cube: T,
                  layout: u,
                  setAutoRotate: pe,
                  pause: xe,
                  resume: Se,
                  destroy: De,
                }));
          }))
        : s
          ? ((Te = gsap.timeline()),
            Te.to(u, {
              opacity: 1,
              duration: bT,
              ease: `power2.out`,
            })
              .to(
                M,
                {
                  brightness: E.peakBrightness,
                  duration: E.chargeDuration,
                  ease: `power2.in`,
                  onUpdate: N,
                },
                `+=${E.holdBeforeCharge}`,
              )
              .to(
                O,
                {
                  opacity: E.haloOpacity,
                  duration: E.chargeDuration,
                  ease: `power2.in`,
                },
                `<`,
              )
              .call((): any => {
                ae = !0;
                ue();
              }))
          : ((Te = gsap.timeline()),
            Te.to(u, {
              opacity: 1,
              duration: bT,
              ease: `power2.out`,
            })
              .call((): any => {
                d && d.play();
              })
              .to(
                u,
                {
                  opacity: 0,
                  duration: ST,
                  ease: `power2.inOut`,
                  onComplete: (): any => {
                    x.visible = !1;
                  },
                },
                `+=${xT}`,
              )
              .call(
                (): any => {
                  ee = !0;
                  ie();
                },
                null,
                `+=${CT}`,
              )));
  });
  function De(this: any): any {
    Ee = !0;
    R &&= (R.stopAllAction(), null);
    cancelAnimationFrame(ge);
    de && clearTimeout(de);
    Te && Te.kill();
    re && re.kill();
    d && d.destroy();
    gsap.killTweensOf(M);
    gsap.killTweensOf(V);
    gsap.killTweensOf(ce);
    O &&
      (gsap.killTweensOf(O),
      D && gsap.killTweensOf(D.scale),
      O.map?.dispose?.(),
      O.dispose());
    k &&
      (gsap.killTweensOf(A.uTime), k.geometry.dispose(), k.material.dispose());
    ye.disconnect();
    window.removeEventListener(`pointerup`, he, !0);
    window.removeEventListener(`pointercancel`, he, !0);
    H.dispose();
    v.dispose();
    b.dispose();
    I || (C.dispose(), w.dispose());
    F &&
      F.traverse((e?: any): any => {
        if (e.isMesh) {
          e.geometry?.dispose?.();
          let t: any = e.material;
          Array.isArray(t)
            ? t.forEach((e?: any): any => e?.dispose?.())
            : t?.dispose?.();
        }
      });
    _.dispose();
    P && P.dispose();
    m.dispose();
    u.remove();
  }
  return {
    destroy: De,
    sceneEl: f,
    canvas: p,
    layout: u,
    setAutoRotate: pe,
    pause: xe,
    resume: Se,
  };
}
function FT(
  this: any,
  e?: any,
  {
    from: t = 0,
    to: n = 0,
    duration: r = 1.6,
    delay: i = 0,
    ease: a = `power2.out`,
    locale: o = void 0,
    onComplete: s,
  }: any = {},
): any {
  if (!e) return null;
  let c: any = e.firstChild;
  if (!c || c.nodeType !== 3) {
    for (; e.firstChild;) e.removeChild(e.firstChild);
    c = document.createTextNode(``);
    e.appendChild(c);
  }
  let l: any = {
    value: t,
  };
  c.nodeValue = Math.round(t).toLocaleString(o);
  return gsap.to(l, {
    value: n,
    duration: r,
    delay: i,
    ease: a,
    onUpdate: (): any => {
      c.nodeValue = Math.round(l.value).toLocaleString(o);
    },
    onComplete: (): any => {
      c.nodeValue = Math.round(n).toLocaleString(o);
      s && s();
    },
  });
}
var BT: any = 0.45;
var VT: any = 0.3;
var HT: any = `sanjayboi`;
var UT: any = `Sanjay Chauhan`;
var WT: any = 1245;
var GT: any = 1080 / 1576;
var KT: any = `is inviting you to be part of the most immersive education experience in the world.`;
export {
  bT,
  xT,
  ST,
  CT,
  wT,
  TT,
  ET,
  DT,
  OT,
  kT,
  AT,
  jT,
  MT,
  NT,
  createWaitlistOverlay,
  FT,
  BT,
  VT,
  HT,
  UT,
  WT,
  GT,
  KT,
};
