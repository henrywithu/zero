// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
function getTextureAspect(this: any, e?: any): any {
  if (!e || !e.image) return 1;
  let t: any = e.image;
  return (
    (t.videoWidth || t.naturalWidth || t.width || 1) /
    (t.videoHeight || t.naturalHeight || t.height || 1)
  );
}
var Kg: any = {
  x: 1,
  y: 1,
};
function getCoverScale(this: any, e?: any, t?: any, n?: any): any {
  return n
    ? e > t
      ? ((Kg.x = t / e), (Kg.y = 1), Kg)
      : ((Kg.x = 1), (Kg.y = e / t), Kg)
    : ((Kg.x = 1), (Kg.y = 1), Kg);
}
function setPassTexture(
  this: any,
  e?: any,
  t?: any,
  n?: any,
  r?: any,
  i: any = !0,
): any {
  let a: any = r ? `uTexture${t}` : `uOverlayTexture${t}`;
  e.uniforms[a].value = n;
  let o: any = getTextureAspect(n),
    s: any = e.uniforms.uViewportAspect.value,
    c: any = getCoverScale(o, s, !i);
  e.uniforms[`uCoverScale${t}`].value.set(c.x, c.y);
  e._slotMeta ||= {};
  e._slotMeta[t] = {
    texAspect: o,
    isCover: !i,
  };
}
function setPassAsset(
  this: any,
  e?: any,
  t?: any,
  n?: any,
  r?: any,
  i?: any,
  a: any = null,
): any {
  let o: any = r.getAsset(n);
  if (o) {
    if (a != null) {
      let n: any = i ? `uTexture${t}` : `uOverlayTexture${t}`;
      e.uniforms[n].value = o;
      let r: any = e.uniforms.uViewportAspect.value || 1;
      e.uniforms[`uCoverScale${t}`].value.set(a, a / r);
      e._slotMeta ||= {};
      e._slotMeta[t] = {
        isTile: !0,
        tile: a,
      };
      return;
    }
    setPassTexture(e, t, o, i, r.getMeta(n).stretched !== !1);
  }
}
function setAtlasTexture(this: any, e?: any, t?: any, n?: any, r?: any): any {
  let i: any = r ? `uTexture${t}` : `uOverlayTexture${t}`,
    a: any = r ? `uTexture${n}` : `uOverlayTexture${n}`;
  e.uniforms[a].value = e.uniforms[i].value;
  e.uniforms[`uCoverScale${n}`].value.copy(e.uniforms[`uCoverScale${t}`].value);
  e._slotMeta &&
    e._slotMeta[t] &&
    (e._slotMeta[n] = {
      ...e._slotMeta[t],
    });
}
function resizePassCover(this: any, e?: any, t?: any): any {
  if (e._slotMeta)
    for (let [n, r] of Object.entries(e._slotMeta) as any[]) {
      if (r.isTile) {
        e.uniforms[`uCoverScale${n}`].value.set(r.tile, r.tile / t);
        continue;
      }
      let i: any = getCoverScale(r.texAspect, t, r.isCover);
      e.uniforms[`uCoverScale${n}`].value.set(i.x, i.y);
    }
}
export {
  getTextureAspect,
  Kg,
  getCoverScale,
  setPassTexture,
  setPassAsset,
  setAtlasTexture,
  resizePassCover,
};
