import { Z } from "../config/tunnel.ts";
import { Vx } from "../config/tunnel.ts";
// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { BufferGeometry, BufferAttribute, Vector2 } from "three";
import { ShaderMaterial } from "./ShaderMaterial";
import shaderSource33 from "../shaders/TunnelMaterials-wx-33.vert.glsl?raw";
import shaderSource34 from "../shaders/TunnelMaterials-Tx-34.frag.glsl?raw";
import shaderSource35 from "../shaders/TunnelMaterials-Dx-35.vert.glsl?raw";
import shaderSource36 from "../shaders/TunnelMaterials-Ox-36.frag.glsl?raw";
import shaderSource37 from "../shaders/TunnelMaterials-Ax-37.vert.glsl?raw";
import shaderSource38 from "../shaders/TunnelMaterials-jx-38.frag.glsl?raw";
import shaderSource39 from "../shaders/TunnelMaterials-Nx-39.vert.glsl?raw";
import shaderSource40 from "../shaders/TunnelMaterials-Px-40.frag.glsl?raw";
function Cx(
  this: any,
  e: any = 1.4,
  t: any = 1,
  n: any = 10,
  r: any = 32,
): any {
  let i: any = new BufferGeometry(),
    a: any = t / n,
    o: any = r + 1,
    s: any = o * 2,
    c: any = n * s,
    l: any = new Float32Array(c * 3),
    u: any = new Float32Array(c * 2),
    d: any = new Float32Array(c * 3),
    f: any = new Float32Array(c),
    p: any = [];
  for (let i: any = 0; i < n; i++) {
    let c: any = i * a - t * 0.5,
      m: any = (i + 1) * a - t * 0.5,
      h: any = i * s;
    for (let t: any = 0; t < o; t++) {
      let a: any = t / r,
        o: any = a * e - e * 0.5,
        s: any = h + t * 2;
      l[s * 3] = o;
      l[s * 3 + 1] = c;
      l[s * 3 + 2] = 0;
      u[s * 2] = a;
      u[s * 2 + 1] = i / n;
      d[s * 3 + 2] = 1;
      f[s] = i;
      l[(s + 1) * 3] = o;
      l[(s + 1) * 3 + 1] = m;
      l[(s + 1) * 3 + 2] = 0;
      u[(s + 1) * 2] = a;
      u[(s + 1) * 2 + 1] = (i + 1) / n;
      d[(s + 1) * 3 + 2] = 1;
      f[s + 1] = i;
    }
    for (let e: any = 0; e < r; e++) {
      let t: any = h + e * 2,
        n: any = t + 2;
      p.push(t, n, t + 1);
      p.push(t + 1, n, n + 1);
    }
  }
  i.setAttribute(`position`, new BufferAttribute(l, 3));
  i.setAttribute(`uv`, new BufferAttribute(u, 2));
  i.setAttribute(`normal`, new BufferAttribute(d, 3));
  i.setAttribute(`aStripIndex`, new BufferAttribute(f, 1));
  i.setIndex(p);
  return i;
}
var wx: any = shaderSource33;
var Tx: any = shaderSource34;
function Ex(
  this: any,
  e?: any,
  {
    waviness: t = 0.02,
    numStrips: n = 10,
    opacity: r = 1,
    seed: i = 0,
    matcap: a = null,
    matcapStrength: o = 1,
    brightness: s = 1,
    texOffset: c = [0, 0],
    texScale: l = [1, 1],
  }: any = {},
): any {
  return new ShaderMaterial({
    vertexShader: wx,
    fragmentShader: Tx,
    uniforms: {
      uTexture: {
        value: e,
      },
      uMatcap: {
        value: a,
      },
      uShredProgress: {
        value: 0,
      },
      uNumStrips: {
        value: n,
      },
      uWaviness: {
        value: t,
      },
      uTime: {
        value: 0,
      },
      uSeed: {
        value: i,
      },
      uOpacity: {
        value: r,
      },
      uMatcapStrength: {
        value: o,
      },
      uBrightness: {
        value: s,
      },
      uTexOffset: {
        value: new Vector2(c[0], c[1]),
      },
      uTexScale: {
        value: new Vector2(l[0], l[1]),
      },
    },
    transparent: !0,
    side: 2,
    depthWrite: !0,
    depthTest: !0,
  });
}
var Dx: any = shaderSource35;
var Ox: any = shaderSource36;
function kx(
  this: any,
  e?: any,
  {
    waviness: t = 0.015,
    opacity: n = 1,
    seed: r = 0,
    matcap: i = null,
    matcapStrength: a = 1,
    brightness: o = 1,
    texOffset: s = [0, 0],
    texScale: c = [1, 1],
  }: any = {},
): any {
  return new ShaderMaterial({
    vertexShader: Dx,
    fragmentShader: Ox,
    uniforms: {
      uTexture: {
        value: e,
      },
      uMatcap: {
        value: i,
      },
      uWaviness: {
        value: t,
      },
      uTime: {
        value: 0,
      },
      uSeed: {
        value: r,
      },
      uOpacity: {
        value: n,
      },
      uMatcapStrength: {
        value: a,
      },
      uBrightness: {
        value: o,
      },
      uTexOffset: {
        value: new Vector2(s[0], s[1]),
      },
      uTexScale: {
        value: new Vector2(c[0], c[1]),
      },
    },
    transparent: !0,
    side: 2,
    depthWrite: !0,
    depthTest: !0,
  });
}
var Ax: any = shaderSource37;
var jx: any = shaderSource38;
function Mx(this: any, e?: any): any {
  return new ShaderMaterial({
    vertexShader: Ax,
    fragmentShader: jx,
    uniforms: {
      uPixelRatio: {
        value: e,
      },
      uTime: {
        value: 0,
      },
      uZOffset: {
        value: 0,
      },
      uOpacity: {
        value: 0,
      },
    },
    transparent: !0,
    depthWrite: !1,
    blending: 2,
  });
}
var Nx: any = shaderSource39;
var Px: any = shaderSource40;
function Fx(this: any, e?: any): any {
  return new ShaderMaterial({
    vertexShader: Nx,
    fragmentShader: Px,
    uniforms: {
      uPixelRatio: {
        value: e,
      },
      uTime: {
        value: 0,
      },
      uOpacity: {
        value: 0,
      },
    },
    transparent: !0,
    depthWrite: !1,
    blending: 2,
  });
}
function Ix(this: any, e?: any): any {
  let t: any = e.components;
  if (!t || !t.tunnelGroup) return;
  let n: any = t.tunnelGroup.position,
    r: any = (e._stage3HoldZoomT || 0) * Vx,
    i: any = e.camera.position.z + r + Z.planeAhead,
    a: any = t.tunnelPlane;
  a &&
    (a.position.set(-n.x, -n.y, i - n.z),
    a.scale.setScalar(a.userData.baseScale * Z.planeSize));
  let o: any = t.tunnelCircle;
  o &&
    (o.position.set(-n.x, -n.y, i + Z.circleBehind - n.z),
    o.scale.setScalar(Z.circleRadiusScale));
}
export { Cx, wx, Tx, Ex, Dx, Ox, kx, Ax, jx, Mx, Nx, Px, Fx, Ix };
