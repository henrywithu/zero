// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import {
  CanvasTexture,
  SRGBColorSpace,
  ClampToEdgeWrapping,
  MeshStandardMaterial,
} from "three";
var aT: any = `/assets/textures/origami_certificate.webp`;
var oT: any = 8;
var sT: any = `"Bethany Elingston", serif`;
var cT: any = `#33302b`;
var lT: any = 716;
var uT: any = {
  y: 212,
  size: 52,
};
var dT: any = {
  y: 524,
  size: 72,
};
var fT: any = 960;
var pT: any = null;
function mT(this: any): any {
  pT ||= new Promise((e?: any, t?: any): any => {
    let n: any = new Image();
    n.onload = (): any => e(n);
    n.onerror = t;
    n.src = aT;
  });
  return pT;
}
function hT(this: any, e?: any, t?: any, n?: any, r?: any): any {
  e.font = `${n}px ${sT}`;
  let i: any = e.measureText(t).width;
  return i > r ? Math.max(8, Math.floor((n * r) / i)) : n;
}
function gT(
  this: any,
  { university: e = ``, userName: t = `` }: any = {},
): any {
  let n: any = document.createElement(`canvas`);
  n.width = 1433;
  n.height = 1024;
  let r: any = new CanvasTexture(n);
  r.colorSpace = SRGBColorSpace;
  r.flipY = !1;
  r.anisotropy = oT;
  r.wrapS = ClampToEdgeWrapping;
  r.wrapT = ClampToEdgeWrapping;
  let i: any;
  r.userData.ready = new Promise((e?: any): any => {
    i = e;
  });
  let a: any = (e || ``).trim(),
    o: any = (t || ``).trim();
  (async (): Promise<any> => {
    try {
      let e: any = await mT();
      n.width = e.naturalWidth;
      n.height = e.naturalHeight;
      let t: any = n.getContext(`2d`);
      if ((t.drawImage(e, 0, 0), document.fonts && (a || o)))
        try {
          await document.fonts.load(`${dT.size}px ${sT}`);
        } catch {}
      t.fillStyle = cT;
      t.textAlign = `center`;
      t.textBaseline = `alphabetic`;
      a &&
        ((t.font = `${hT(t, a, uT.size, fT)}px ${sT}`),
        t.fillText(a, lT, uT.y));
      o &&
        ((t.font = `${hT(t, o, dT.size, fT)}px ${sT}`),
        t.fillText(o, lT, dT.y));
      r.needsUpdate = !0;
    } catch {
    } finally {
      i();
    }
  })();
  return r;
}
function _T(
  this: any,
  {
    colorMap: e,
    aoMap: t = null,
    aoIntensity: n = 1,
    aoChannel: r = 0,
    ...i
  }: any = {},
): any {
  let a: any = new MeshStandardMaterial({
    color: 0,
    emissive: 16777215,
    emissiveMap: e || null,
    emissiveIntensity: 1,
    roughness: 1,
    metalness: 0,
    side: 2,
    ...i,
  });
  t &&
    ((t.channel = r),
    (a.aoMap = t),
    (a.aoMapIntensity = n),
    (a.onBeforeCompile = (e?: any): any => {
      e.fragmentShader = e.fragmentShader.replace(
        `#include <emissivemap_fragment>`,
        `#include <emissivemap_fragment>
        // Darken the printed art in the folds with the baked AO, sampled on
        // its own UV set (vAoMapUv). Standard AO-intensity remap: aoMapIntensity
        // 1 = full effect, 0 = none.
        float _ao = texture2D( aoMap, vAoMapUv ).r;
        totalEmissiveRadiance *= 1.0 + ( _ao - 1.0 ) * aoMapIntensity;`,
      );
    }),
    (a.customProgramCacheKey = (): any => `cert-ao`));
  return a;
}
export { aT, oT, sT, cT, lT, uT, dT, fT, pT, mT, hT, gT, _T };
