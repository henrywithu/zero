// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { Vector3, PlaneGeometry, Group, Mesh } from "three";
import { bD } from "../components/CompanyPopup.ts";
import { populateCompanyPopup } from "../components/CompanyPopupBehavior.ts";
import { nC, rC } from "../rendering/MapMaterials.ts";
import { companyMarkers } from "../content/companies.ts";
var HD: any = new Vector3();
var UD: any = 24;
var WD: any = 26;
function GD(this: any, e?: any): any {
  let t: any = e._mapPanel;
  if (!t || !t._activeId || !e.components.markers || (e.ui && e.ui._isMobile))
    return;
  let n: any = e.components.markers.find(
    (e?: any): any => e.data.id === t._activeId,
  );
  if (!n) return;
  n.group.getWorldPosition(HD);
  HD.project(e._stage5OrthoCamera);
  let r: any = (HD.x * 0.5 + 0.5) * e._vw,
    i: any = (-HD.y * 0.5 + 0.5) * e._vh,
    a: any = t.offsetWidth || 369,
    o: any = t.offsetHeight || 360,
    s: any = a * 0.5,
    c: any = o * 0.5,
    l: any = r + s + UD,
    u: any = i;
  l + s > e._vw - WD && (l = r - s - UD);
  l = Math.max(s + WD, Math.min(l, e._vw - s - WD));
  u = Math.max(c + WD, Math.min(u, e._vh - c - WD));
  t.style.left = `${l}px`;
  t.style.top = `${u}px`;
}
var KD: any = 2.2;
var qD: any = 1;
function JD(this: any, e?: any, t?: any): any {
  let n: any = Math.min(5, (5 * e) / t);
  return Math.max(1, n / KD);
}
function YD(this: any, e?: any, t?: any, n?: any): any {
  if (e.ui && e.ui._isMobile) {
    n.x = t.position.x;
    n.y = t.position.y;
    return n;
  }
  let r: any = Math.abs(t.position.y);
  if (Math.max(0, e._mapPlaneHalfH - e._mapZoomTarget) < r) {
    let t: any = Math.max(KD, e._mapPlaneHalfH - r);
    e._mapZoomTarget = Math.min(e._mapZoomTarget, t);
  }
  let i: any = e._mapPanel,
    a: any = (i && i.offsetWidth) || 369,
    o: any = e._mapZoomTarget,
    s: any = e._vw / e._vh,
    c: any = (2 * o * s) / e._vw,
    l: any = (bD * 0.5) / c,
    u: any = (a + UD - l) * 0.5;
  n.x = t.position.x + u * c;
  n.y = t.position.y;
  return n;
}
function XD(this: any, e?: any, t?: any): any {
  let n: any = e.components && e.components.markers;
  if (!n || !n.length || !e._mapPanel) return;
  let r: any = n.length,
    i: any = ((t % r) + r) % r,
    a: any = n[i];
  e._stage5MarkerIdx = i;
  populateCompanyPopup(e._mapPanel, a.data);
  YD(e, a.group, e._mapPanTarget);
  e._mapVelocity.x = 0;
  e._mapVelocity.y = 0;
  GD(e);
}
function ZD(this: any, e?: any, t?: any): any {
  let n: any = e.components && e.components.markers;
  if (!n || !n.length) return;
  let r: any = e._stage5MarkerIdx;
  if (r == null) {
    let t: any = e._mapPanel && e._mapPanel._activeId;
    if (t != null) {
      let e: any = n.findIndex((e?: any): any => e.data.id === t);
      e >= 0 && (r = e);
    }
  }
  r ??= t > 0 ? -1 : 0;
  XD(e, r + t);
}
function QD(this: any, e?: any, t?: any, n?: any): any {
  let r: any = new PlaneGeometry(bD, bD),
    i: any = nC(),
    a: any = rC(),
    o: any = [];
  for (let s of companyMarkers) {
    let c: any = new Group(),
      l: any = new Mesh(r, i),
      u: any = new Mesh(r, a);
    u.renderOrder = 1;
    c.add(l);
    c.add(u);
    c.position.set(s.x * t, s.y * n, 0.01);
    c.userData = s;
    let d: any = {
      group: c,
      fill: u,
      data: s,
      hoverScale: 1,
    };
    c.userData._marker = d;
    e.scene.add(c);
    o.push(d);
  }
  return {
    markers: o,
    markerGeo: r,
    haloMat: i,
    fillMat: a,
  };
}
function $D(this: any, e?: any): any {
  let t: any = e.components && e.components.ringHit;
  return !t || !e._mapRaycaster
    ? !1
    : e._mapRaycaster.intersectObject(t, !1).length > 0;
}
function eO(this: any, e?: any): any {
  let t: any = e._vw / e._vh,
    n: any = e._mapZoom * t,
    r: any = e._mapZoom,
    i: any = Math.max(0, e._mapPlaneHalfW - n),
    a: any = Math.max(0, e._mapPlaneHalfH - r);
  e._mapPanTarget.x = Math.max(-i, Math.min(i, e._mapPanTarget.x));
  e._mapPanTarget.y = Math.max(-a, Math.min(a, e._mapPanTarget.y));
  e._mapPan.x = Math.max(-i, Math.min(i, e._mapPan.x));
  e._mapPan.y = Math.max(-a, Math.min(a, e._mapPan.y));
}
function tO(this: any, e?: any): any {
  eO(e);
  let t: any = e._stage5OrthoCamera,
    n: any = e._vw / e._vh;
  t.left = -e._mapZoom * n;
  t.right = e._mapZoom * n;
  t.top = e._mapZoom;
  t.bottom = -e._mapZoom;
  t.position.x = e._mapPan.x;
  t.position.y = e._mapPan.y;
  t.updateProjectionMatrix();
}
export { HD, UD, WD, GD, KD, qD, JD, YD, XD, ZD, QD, $D, eO, tO };
