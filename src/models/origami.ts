// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
var Sb: any = `/`;
var origamiNames: any = [
  `angelfish`,
  `cat`,
  `dog`,
  `dolphin`,
  `elephant`,
  `fox`,
  `goldfish`,
  `rhino`,
  `seal`,
  `wolf`,
];
function getOrigamiModelUrl(this: any, e?: any): any {
  let t: any = origamiNames.length;
  return `${Sb}assets/origami/${origamiNames[(((Math.floor(Number(e)) || 0) % t) + t) % t]}.glb`;
}
function getOrigamiAoUrl(this: any, e?: any): any {
  let t: any = origamiNames.length;
  return `${Sb}assets/origami/ao/${origamiNames[(((Math.floor(Number(e)) || 0) % t) + t) % t]}.webp`;
}
function getOrigamiName(this: any, e?: any): any {
  let t: any = origamiNames.length;
  return origamiNames[(((Math.floor(Number(e)) || 0) % t) + t) % t];
}
function getOrigamiIndex(this: any, e?: any): any {
  return typeof e == `string`
    ? origamiNames.indexOf(e.trim().toLowerCase())
    : -1;
}
function Ob(this: any): any {
  return Math.floor(Math.random() * origamiNames.length);
}
function kb(this: any, e?: any): any {
  let t: any = (e || ``).trim().toLowerCase(),
    n: any = 0;
  for (let e: any = 0; e < t.length; e++) n = (n * 31 + t.charCodeAt(e)) >>> 0;
  return n % origamiNames.length;
}
function Ab(this: any, e?: any, t: any = null): any {
  let n: any = getOrigamiIndex(t?.animal);
  return n >= 0 ? n : kb(e);
}
function jb(this: any, e?: any, t: any = 0): any {
  let n: any = Number(e);
  if (!Number.isFinite(n)) return t;
  let r: any = Math.floor(n);
  return r < 0 || r >= origamiNames.length ? t : r;
}
var Mb: any = null;
function Nb(this: any): any {
  Mb === null && (Mb = Ob());
  return Mb;
}
function Pb(this: any, e?: any): any {
  Mb = jb(e, Mb ?? 0);
}
var Fb: any = new Set();
function Ib(this: any, e: any = Nb()): any {
  let t: any = getOrigamiModelUrl(e);
  if (!Fb.has(t)) {
    Fb.add(t);
    try {
      fetch(t, {
        credentials: `same-origin`,
      }).catch((): any => {});
      fetch(getOrigamiAoUrl(e), {
        credentials: `same-origin`,
      }).catch((): any => {});
    } catch {}
  }
}
export {
  Sb,
  origamiNames,
  getOrigamiModelUrl,
  getOrigamiAoUrl,
  getOrigamiName,
  getOrigamiIndex,
  Ob,
  kb,
  Ab,
  jb,
  Mb,
  Nb,
  Pb,
  Fb,
  Ib,
};
