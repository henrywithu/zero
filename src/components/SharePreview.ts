// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import {
  TextureLoader,
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Clock,
  AnimationMixer,
  Box3,
  Vector3,
  Group,
  Sphere,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { gT, _T } from "./OrigamiCertificate.ts";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
function oE(this: any, e?: any): any {
  let t: any = new TextureLoader().load(e);
  t.flipY = !1;
  t.colorSpace = ``;
  t.anisotropy = 8;
  return t;
}
function sE(
  this: any,
  e: any,
  { assetUrl: t, aoUrl: n, userName: r, university: i }: any,
): any {
  let a: any = new WebGLRenderer({
    antialias: !(
      /iP(hone|od|ad)/.test(navigator.userAgent) ||
      (navigator.platform === `MacIntel` && navigator.maxTouchPoints > 1)
    ),
    alpha: !0,
    preserveDrawingBuffer: !0,
  });
  a.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  a.setClearColor(0, 0);
  a.domElement.style.cssText = `width:82%;height:82%;display:block;`;
  e.appendChild(a.domElement);
  a.domElement.style.cursor = `grab`;
  a.domElement.style.touchAction = `none`;
  let o: any = new Scene(),
    s: any = new PerspectiveCamera(20, 1, 5, 11);
  s.position.set(0, 0, 8);
  s.lookAt(0, 0, 0);
  let c: any = new OrbitControls(s, a.domElement);
  c.enableZoom = !1;
  c.enablePan = !1;
  c.enableDamping = !0;
  c.dampingFactor = 0.1;
  c.rotateSpeed = 0.9;
  c.minPolarAngle = Math.PI / 2;
  c.maxPolarAngle = Math.PI / 2;
  let l: any = !1;
  c.addEventListener(`start`, (): any => {
    l = !0;
    a.domElement.style.cursor = `grabbing`;
  });
  c.addEventListener(`end`, (): any => {
    l = !1;
    a.domElement.style.cursor = `grab`;
  });
  let u: any = (e?: any): any => {
    e.isTrusted &&
      l &&
      a.domElement.dispatchEvent(
        new PointerEvent(`pointercancel`, {
          pointerId: e.pointerId,
          pointerType: e.pointerType,
        }),
      );
  };
  window.addEventListener(`pointerup`, u, !0);
  window.addEventListener(`pointercancel`, u, !0);
  let d: any = gT({
      university: i,
      userName: r,
    }),
    f: any = n ? oE(n) : null,
    p: any,
    m: any = new Promise((e?: any): any => {
      p = e;
    }),
    h: any = Promise.all([m, d.userData.ready]).then((): any => {}),
    g: any = null,
    _: any = null,
    v: any = null,
    y: any = !1,
    b: any = 0,
    x: any = new Clock();
  if (t) {
    let e: any = new DRACOLoader();
    e.setDecoderPath(`/vendor/draco/`);
    let n: any = new GLTFLoader();
    n.setDRACOLoader(e);
    n.load(
      t,
      (e?: any): any => {
        if (y || ((g = e.scene || (e.scenes && e.scenes[0])), !g)) return;
        let t: any = 0;
        e.animations &&
          e.animations.length &&
          ((v = new AnimationMixer(g)),
          e.animations.forEach((e?: any): any => {
            v.clipAction(e).play();
            t = Math.max(t, e.duration);
          }),
          v.setTime(t * 0.999));
        b = t;
        g.updateMatrixWorld(!0);
        let n: any = new Box3(),
          r: any = new Box3();
        g.traverse((e?: any): any => {
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
        g.position.sub(a);
        let c: any = Math.max(i.x, i.y, i.z) || 1,
          l: any = 0;
        g.traverse((e?: any): any => {
          e.isMesh && e.geometry?.attributes?.uv1 && (l = 1);
        });
        _ = _T({
          colorMap: d,
          aoMap: f,
          aoChannel: l,
        });
        g.traverse((e?: any): any => {
          if (!e.isMesh) return;
          let t: any = e.material;
          e.material = _;
          Array.isArray(t)
            ? t.forEach((e?: any): any => e?.dispose?.())
            : t?.dispose?.();
        });
        let u: any = new Group();
        u.add(g);
        u.scale.setScalar(2.7 / c);
        u.rotation.y = Math.PI;
        o.add(u);
        let m: any = new Box3(),
          h: any = new Box3(),
          S: any = new Sphere(),
          C: any = s.position.length(),
          w: any = 0,
          T: any = v && t > 0 ? 12 : 0;
        for (let e: any = 0; e <= T; e++) {
          v && t > 0 && v.setTime((e / T) * t);
          u.updateMatrixWorld(!0);
          m.makeEmpty();
          g.traverse((e?: any): any => {
            e.isMesh &&
              (e.isSkinnedMesh
                ? (e.computeBoundingBox(), h.copy(e.boundingBox))
                : (e.geometry.boundingBox || e.geometry.computeBoundingBox(),
                  h.copy(e.geometry.boundingBox)),
              h.applyMatrix4(e.matrixWorld),
              m.union(h));
          });
          !m.isEmpty() &&
            (m.getBoundingSphere(S),
            (w = Math.max(w, S.center.length() + S.radius)));
        }
        w > 0 &&
          ((s.near = Math.max(0.1, C - w - 0.15)),
          (s.far = C + w + 0.15),
          s.updateProjectionMatrix());
        v && v.setTime(0);
        x.getDelta();
        p();
      },
      void 0,
      (): any => {
        p();
      },
    );
  } else p();
  let S: any = (): any => {
      let t: any = a.domElement.clientWidth || e.clientWidth,
        n: any = a.domElement.clientHeight || e.clientHeight;
      !t ||
        !n ||
        (a.setSize(t, n, !1),
        (s.aspect = t / n),
        s.updateProjectionMatrix(),
        a.render(o, s));
    },
    C: any,
    w: any = (): any => {
      C = requestAnimationFrame(w);
      v && v.update(x.getDelta());
      c.update();
      a.render(o, s);
    };
  S();
  w();
  let T: any = new ResizeObserver(S);
  T.observe(e);
  let E: any = null,
    D: any = null,
    O: any = (): any => {
      if (y) return null;
      let e: any = a.getContext(),
        t: any = e.drawingBufferWidth,
        n: any = e.drawingBufferHeight;
      if (!t || !n) return null;
      (!E || E.width !== t || E.height !== n) &&
        ((E = document.createElement(`canvas`)),
        (E.width = t),
        (E.height = n),
        (D = new Uint8Array(t * n * 4)));
      e.readPixels(0, 0, t, n, e.RGBA, e.UNSIGNED_BYTE, D);
      let r: any = E.getContext(`2d`),
        i: any = r.createImageData(t, n),
        o: any = t * 4;
      for (let e: any = 0; e < n; e++) {
        let t: any = (n - 1 - e) * o;
        i.data.set(D.subarray(t, t + o), e * o);
      }
      r.putImageData(i, 0, 0);
      return E;
    };
  return {
    ready: h,
    foldDuration: (): any => b,
    pauseAuto: (): any => {
      C &&= (cancelAnimationFrame(C), 0);
    },
    resumeAuto: (): any => {
      !y && !C && (x.getDelta(), w());
    },
    renderFoldFraction: (e?: any): any => {
      y ||
        (v && b > 0 && v.setTime(Math.max(0, Math.min(1, e)) * b),
        a.render(o, s));
    },
    snapshotCanvas: (): any => O(),
    snapshot: (): any => {
      if (y) return null;
      try {
        a.render(o, s);
        let e: any = O();
        return e ? e.toDataURL(`image/png`) : null;
      } catch {
        return null;
      }
    },
    destroy: (): any => {
      y = !0;
      cancelAnimationFrame(C);
      T.disconnect();
      window.removeEventListener(`pointerup`, u, !0);
      window.removeEventListener(`pointercancel`, u, !0);
      c.dispose();
      v && v.stopAllAction();
      g &&
        g.traverse((e?: any): any => {
          e.isMesh && e.geometry?.dispose?.();
        });
      _ && _.dispose();
      f && f.dispose();
      d.dispose();
      a.dispose();
      a.domElement.parentNode &&
        a.domElement.parentNode.removeChild(a.domElement);
    },
  };
}
export { oE, sE };
