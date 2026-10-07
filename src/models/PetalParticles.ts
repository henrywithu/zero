// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import {
  Group,
  PlaneGeometry,
  InstancedBufferGeometry,
  InstancedBufferAttribute,
  Vector3,
  Mesh,
} from "three";
import { ShaderMaterial } from "../rendering/ShaderMaterial";
import {
  Zy,
  Qy,
  Dy,
  ky,
  Oy,
  Ay,
  jy,
  Py,
  Fy,
  Iy,
  Xy,
  My,
  Ny,
  Ly,
  Ry,
  $y,
  eb,
} from "./CoinRing.ts";
import shaderSource29 from "../shaders/PetalParticles-nb-29.vert.glsl?raw";
import shaderSource30 from "../shaders/PetalParticles-rb-30.frag.glsl?raw";
var PetalParticles = class {
  declare _mesh: any;
  declare _baseGeo: any;
  declare _geometry: any;
  declare _material: any;
  declare _entry: any;
  declare _disposed: any;
  declare group: any;
  constructor(e?: any) {
    this.group = new Group();
    this._disposed = !1;
    this._entry = 0;
    let t: any = new PlaneGeometry(1, 1, Zy, Qy),
      n: any = t.attributes.position;
    for (let e: any = 0; e < n.count; e++) {
      let t: any = n.getX(e),
        r: any = n.getY(e),
        i: any = t * t + r * r;
      n.setZ(e, i * 0.6);
    }
    n.needsUpdate = !0;
    t.computeVertexNormals();
    let r: any = new InstancedBufferGeometry();
    r.index = t.index;
    r.attributes.position = t.attributes.position;
    r.attributes.normal = t.attributes.normal;
    r.attributes.uv = t.attributes.uv;
    r.instanceCount = Dy;
    let i: any = new Float32Array(Dy * 3),
      a: any = new Float32Array(Dy * 3),
      o: any = new Float32Array(Dy),
      s: any = new Float32Array(Dy * 4),
      c: any = new Float32Array(Dy),
      l: any = new Float32Array(Dy * 2),
      u: any = Math.PI * 2;
    for (let e: any = 0; e < Dy; e++) {
      i[e * 3] = ky + (Math.random() * 2 - 1) * Oy;
      i[e * 3 + 1] = (Math.random() * 2 - 1) * Ay;
      i[e * 3 + 2] = (Math.random() * 2 - 1) * jy;
      let t: any = Py + Math.random() * (Fy - Py);
      a[e * 3] = -t * 1.732 + (Math.random() - 0.5) * Iy;
      a[e * 3 + 1] = -t;
      a[e * 3 + 2] = (Math.random() - 0.5) * Iy;
      o[e] = Math.random() * u;
      let n: any = Xy[(Math.random() * Xy.length) | 0];
      s[e * 4] = n[0];
      s[e * 4 + 1] = n[1];
      s[e * 4 + 2] = n[2];
      s[e * 4 + 3] = n[3];
      c[e] = My + Math.random() * (Ny - My);
      l[e * 2] = Ly + Math.random() * (Ry - Ly);
      l[e * 2 + 1] = Ly + Math.random() * (Ry - Ly);
    }
    r.setAttribute(`aOffset`, new InstancedBufferAttribute(i, 3));
    r.setAttribute(`aVelocity`, new InstancedBufferAttribute(a, 3));
    r.setAttribute(`aPhase`, new InstancedBufferAttribute(o, 1));
    r.setAttribute(`aPetalRect`, new InstancedBufferAttribute(s, 4));
    r.setAttribute(`aScale`, new InstancedBufferAttribute(c, 1));
    r.setAttribute(`aRotSpeed`, new InstancedBufferAttribute(l, 2));
    this._material = new ShaderMaterial({
      vertexShader: $y,
      fragmentShader: eb,
      uniforms: {
        uTime: {
          value: 0,
        },
        uSwirlTime: {
          value: 0,
        },
        uAtlas: {
          value: e,
        },
        uBounds: {
          value: new Vector3(Oy, Ay, jy),
        },
        uBoundsCenter: {
          value: new Vector3(ky, 0, 0),
        },
        uOpacity: {
          value: 1,
        },
        uEntry: {
          value: 0,
        },
      },
      transparent: !0,
      depthWrite: !1,
      side: 2,
    });
    this._geometry = r;
    this._baseGeo = t;
    this._mesh = new Mesh(r, this._material);
    this._mesh.frustumCulled = !1;
    this.group.add(this._mesh);
  }
  update(e?: any): any {
    this._material.uniforms.uTime.value += e;
    let t: any = this._entry,
      n: any = t * t * (3 - 2 * t);
    this._material.uniforms.uSwirlTime.value += e * n;
  }
  setOpacity(e?: any): any {
    this._material.uniforms.uOpacity.value = e;
  }
  setEntry(e?: any): any {
    this._entry = Math.min(1, Math.max(0, e));
    this._material.uniforms.uEntry.value = e;
  }
  dispose(): any {
    this._disposed ||
      ((this._disposed = !0),
      this._geometry.dispose(),
      this._baseGeo.dispose(),
      this._material.dispose(),
      this.group.clear());
  }
};
var nb: any = shaderSource29;
var rb: any = shaderSource30;
export { PetalParticles, nb, rb };
