// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import {
  DataTexture,
  RGBAFormat,
  SRGBColorSpace,
  LinearFilter,
  LoadingManager,
  Texture,
  LinearSRGBColorSpace,
  RepeatWrapping,
  LinearMipmapLinearFilter,
} from "three";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";
var ug: any = 256;
var dg: any = 1;
var TextureUploadQueue = class {
  declare _byTex: any;
  declare _pending: any;
  declare gl: any;
  declare renderer: any;
  constructor(e?: any) {
    this.renderer = e;
    this.gl = e.getContext();
    this._pending = [];
    this._byTex = new Map();
  }
  _glFilter(e?: any): any {
    let t: any = this.gl;
    return e === 1003
      ? t.NEAREST
      : e === 1004
        ? t.NEAREST_MIPMAP_NEAREST
        : e === 1005
          ? t.NEAREST_MIPMAP_LINEAR
          : e === 1007
            ? t.LINEAR_MIPMAP_NEAREST
            : e === 1008
              ? t.LINEAR_MIPMAP_LINEAR
              : t.LINEAR;
  }
  _glWrap(e?: any): any {
    let t: any = this.gl;
    return e === 1e3
      ? t.REPEAT
      : e === 1002
        ? t.MIRRORED_REPEAT
        : t.CLAMP_TO_EDGE;
  }
  startUpload(e?: any, t?: any): any {
    let n: any = this.gl,
      r: any = t.width,
      i: any = t.height,
      a: any = n.createTexture();
    n.bindTexture(n.TEXTURE_2D, a);
    let o: any = e.colorSpace === `srgb` ? n.SRGB8_ALPHA8 : n.RGBA8,
      s: any = e.generateMipmaps !== !1,
      c: any = s ? Math.floor(Math.log2(Math.max(r, i))) + 1 : 1;
    n.texStorage2D(n.TEXTURE_2D, c, o, r, i);
    n.texParameteri(
      n.TEXTURE_2D,
      n.TEXTURE_MIN_FILTER,
      this._glFilter(e.minFilter),
    );
    n.texParameteri(
      n.TEXTURE_2D,
      n.TEXTURE_MAG_FILTER,
      this._glFilter(e.magFilter),
    );
    n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, this._glWrap(e.wrapS));
    n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, this._glWrap(e.wrapT));
    let l: any = this.renderer.properties.get(e);
    l.__webglTexture = a;
    l.__webglInit = !0;
    l.__version = e.source ? e.source.version : e.version;
    e.image ||= {
      width: r,
      height: i,
      __chunkedPlaceholder: !0,
    };
    e.needsUpdate = !1;
    let u: any = {
        tex: e,
        glTex: a,
        width: r,
        height: i,
        wantsMipmaps: s,
        bitmap: t,
        chunks: null,
        resolve: null,
      },
      d: any = new Promise((e?: any): any => {
        u.resolve = e;
      });
    this._pending.push(u);
    this._byTex.set(e, u);
    this._beginSlice(u);
    return d;
  }
  async _beginSlice(e?: any): Promise<any> {
    let { width: t, height: n } = e,
      r: any = Math.ceil(t / ug),
      i: any = Math.ceil(n / ug),
      a: any = [],
      o: any = [];
    for (let s: any = 0; s < i; s++)
      for (let i: any = 0; i < r; i++) {
        let r: any = i * ug,
          c: any = s * ug,
          l: any = Math.min(ug, t - r),
          u: any = Math.min(ug, n - c);
        a.push({
          x: r,
          y: c,
          w: l,
          h: u,
        });
        o.push(
          createImageBitmap(e.bitmap, r, c, l, u, {
            premultiplyAlpha: `none`,
            colorSpaceConversion: `none`,
          }),
        );
      }
    let s: any;
    try {
      s = await Promise.all(o);
    } catch (e: any) {
      console.warn(`ChunkedTextureUploader: slicing failed`, e);
      return;
    }
    if (!this._byTex.has(e.tex)) {
      for (let e of s) e && e.close && e.close();
      return;
    }
    e.bitmap && e.bitmap.close && e.bitmap.close();
    e.bitmap = null;
    e.chunks = a.map((e?: any, t?: any): any => ({
      ...e,
      bitmap: s[t],
    }));
  }
  tick(): any {
    if (this._pending.length === 0) return;
    let e: any = this.gl,
      t: any = dg;
    for (; t > 0 && this._pending.length > 0;) {
      let n: any = this._pending[0];
      if (n.chunks === null) break;
      if (n.chunks.length === 0) {
        this._finalizeEntry(n);
        this._pending.shift();
        continue;
      }
      let r: any = n.chunks.shift();
      e.bindTexture(e.TEXTURE_2D, n.glTex);
      e.texSubImage2D(
        e.TEXTURE_2D,
        0,
        r.x,
        r.y,
        r.w,
        r.h,
        e.RGBA,
        e.UNSIGNED_BYTE,
        r.bitmap,
      );
      r.bitmap.close && r.bitmap.close();
      t--;
    }
  }
  _finalizeEntry(e?: any): any {
    if (e.wantsMipmaps) {
      let t: any = this.gl;
      t.bindTexture(t.TEXTURE_2D, e.glTex);
      t.generateMipmap(t.TEXTURE_2D);
    }
    this._byTex.delete(e.tex);
    e.resolve && e.resolve();
  }
  flushTexture(e?: any): any {
    let t: any = this._byTex.get(e);
    if (!t) return;
    let n: any = this.gl;
    if ((n.bindTexture(n.TEXTURE_2D, t.glTex), t.chunks === null && t.bitmap)) {
      n.texSubImage2D(
        n.TEXTURE_2D,
        0,
        0,
        0,
        t.width,
        t.height,
        n.RGBA,
        n.UNSIGNED_BYTE,
        t.bitmap,
      );
      t.bitmap.close && t.bitmap.close();
      t.bitmap = null;
    } else if (t.chunks)
      for (; t.chunks.length > 0;) {
        let e: any = t.chunks.shift();
        n.texSubImage2D(
          n.TEXTURE_2D,
          0,
          e.x,
          e.y,
          e.w,
          e.h,
          n.RGBA,
          n.UNSIGNED_BYTE,
          e.bitmap,
        );
        e.bitmap.close && e.bitmap.close();
      }
    let r: any = this._pending.indexOf(t);
    r >= 0 && this._pending.splice(r, 1);
    this._finalizeEntry(t);
  }
  flushAll(): any {
    for (; this._pending.length > 0;) this.flushTexture(this._pending[0].tex);
  }
};
function createRadialPullTexture(
  this: any,
  {
    color: e = [255, 255, 255],
    topLeft: t,
    topCenter: n,
    topRight: r,
    botLeft: i,
    botCenter: a,
    botRight: o,
    centerAlpha: s = null,
    centerSigma: c = 0.25,
    width: l = 256,
    height: u = 144,
  }: any = {},
): any {
  let d: any = new Uint8Array(l * u * 4),
    f: any = s != null,
    p: any = f ? 1 / (2 * c * c) : 0;
  for (let c: any = 0; c < u; c++) {
    let m: any = c / (u - 1),
      h: any = m - 0.5;
    for (let u: any = 0; u < l; u++) {
      let g: any = u / (l - 1),
        _: any = 2 * g * g - 3 * g + 1,
        v: any = -4 * g * g + 4 * g,
        y: any = 2 * g * g - g,
        b: any = t * _ + n * v + r * y,
        x: any = b + (i * _ + a * v + o * y - b) * m;
      if (f) {
        let e: any = g - 0.5,
          t: any = Math.exp(-(e * e + h * h) * p);
        x += (s - x) * t;
      }
      x < 0 ? (x = 0) : x > 1 && (x = 1);
      let S: any = (c * l + u) * 4;
      d[S] = e[0];
      d[S + 1] = e[1];
      d[S + 2] = e[2];
      d[S + 3] = Math.round(x * 255);
    }
  }
  let m: any = new DataTexture(d, l, u, RGBAFormat);
  m.flipY = !0;
  m.colorSpace = SRGBColorSpace;
  m.minFilter = LinearFilter;
  m.magFilter = LinearFilter;
  m.generateMipmaps = !1;
  m.needsUpdate = !0;
  return m;
}
function createRadialColorTexture(
  this: any,
  {
    stops: e = [
      {
        offset: 0,
        color: [0, 0, 0],
      },
      {
        offset: 1,
        color: [255, 255, 255],
      },
    ],
    center: t = [0.5, 0.5],
    radiusX: n = 0.5,
    radiusY: r = 0.5,
    width: i = 256,
    height: a = 144,
  }: any = {},
): any {
  let o: any = e.slice().sort((e?: any, t?: any): any => e.offset - t.offset),
    s: any = o[0].color,
    c: any = o[o.length - 1].color,
    l: any = o[0].offset,
    u: any = o[o.length - 1].offset,
    d: any = new Uint8Array(i * a * 4);
  for (let e: any = 0; e < a; e++) {
    let f: any = (e / (a - 1) - t[1]) / r;
    for (let r: any = 0; r < i; r++) {
      let a: any = (r / (i - 1) - t[0]) / n,
        p: any = Math.sqrt(a * a + f * f),
        m: any,
        h: any,
        g: any;
      if (p <= l) {
        m = s[0];
        h = s[1];
        g = s[2];
      } else if (p >= u) {
        m = c[0];
        h = c[1];
        g = c[2];
      } else {
        let e: any = 1;
        for (; e < o.length && o[e].offset < p;) e++;
        let t: any = o[e - 1],
          n: any = o[e],
          r: any = (p - t.offset) / (n.offset - t.offset);
        m = t.color[0] + (n.color[0] - t.color[0]) * r;
        h = t.color[1] + (n.color[1] - t.color[1]) * r;
        g = t.color[2] + (n.color[2] - t.color[2]) * r;
      }
      let _: any = (e * i + r) * 4;
      d[_] = m;
      d[_ + 1] = h;
      d[_ + 2] = g;
      d[_ + 3] = 255;
    }
  }
  let f: any = new DataTexture(d, i, a, RGBAFormat);
  f.flipY = !0;
  f.colorSpace = SRGBColorSpace;
  f.minFilter = LinearFilter;
  f.magFilter = LinearFilter;
  f.generateMipmaps = !1;
  f.needsUpdate = !0;
  return f;
}
function createDualRadialTexture(
  this: any,
  {
    baseColor: e = [110, 200, 230],
    glowColor: t = [170, 235, 215],
    topCenter: n = [0.5, 0],
    bottomCenter: r = [0.5, 1],
    topRadius: i = [0.85, 0.7],
    bottomRadius: a = [0.85, 0.7],
    width: o = 256,
    height: s = 144,
  }: any = {},
): any {
  let c: any = new Uint8Array(o * s * 4),
    l: any = e[0],
    u: any = e[1],
    d: any = e[2],
    f: any = t[0] - l,
    p: any = t[1] - u,
    m: any = t[2] - d;
  for (let e: any = 0; e < s; e++) {
    let t: any = e / (s - 1);
    for (let s: any = 0; s < o; s++) {
      let h: any = s / (o - 1),
        g: any = (h - n[0]) / i[0],
        _: any = (t - n[1]) / i[1],
        v: any = Math.sqrt(g * g + _ * _),
        y: any = v >= 1 ? 0 : 1 - v,
        b: any = y * y * (3 - 2 * y),
        x: any = (h - r[0]) / a[0],
        S: any = (t - r[1]) / a[1],
        C: any = Math.sqrt(x * x + S * S),
        w: any = C >= 1 ? 0 : 1 - C,
        T: any = w * w * (3 - 2 * w),
        E: any = Math.min(1, b + T),
        D: any = (e * o + s) * 4;
      c[D] = l + f * E;
      c[D + 1] = u + p * E;
      c[D + 2] = d + m * E;
      c[D + 3] = 255;
    }
  }
  let h: any = new DataTexture(c, o, s, RGBAFormat);
  h.flipY = !0;
  h.colorSpace = SRGBColorSpace;
  h.minFilter = LinearFilter;
  h.magFilter = LinearFilter;
  h.generateMipmaps = !1;
  h.needsUpdate = !0;
  return h;
}
function createSolidTexture(
  this: any,
  { color: e = [255, 255, 255], alpha: t = 1 }: any = {},
): any {
  let n: any = new DataTexture(
    new Uint8Array([e[0], e[1], e[2], Math.round(t * 255)]),
    1,
    1,
    RGBAFormat,
  );
  n.colorSpace = SRGBColorSpace;
  n.minFilter = LinearFilter;
  n.magFilter = LinearFilter;
  n.generateMipmaps = !1;
  n.needsUpdate = !0;
  return n;
}
var AssetLoader = class {
  declare chunkedUploader: any;
  declare _uploadIdleHandle: any;
  declare _uploadQueue: any;
  declare _stageLoadPromises: any;
  declare _stageLoadStatus: any;
  declare stageAssets: any;
  declare mandatoryAssets: any;
  declare ktx2Loader: any;
  declare gltfLoader: any;
  declare dracoLoader: any;
  declare manager: any;
  declare assets: any;
  declare renderer: any;
  constructor(e?: any) {
    this.renderer = e;
    let t: any = window.innerWidth <= 768;
    this.assets = {
      models: {},
      textures: {},
      animations: {},
      meta: {},
    };
    this.manager = new LoadingManager();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath(`/vendor/draco/`);
    this.gltfLoader = new GLTFLoader(this.manager);
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
    this.ktx2Loader = new KTX2Loader(this.manager);
    this.renderer &&
      (this.ktx2Loader.setTranscoderPath(`/vendor/basis/`),
      this.ktx2Loader.detectSupport(this.renderer));
    this.gltfLoader.setKTX2Loader(this.ktx2Loader);
    this.mandatoryAssets = [
      {
        type: `texture`,
        key: `frosting`,
        path: `assets/textures/frost.webp`,
        mipmaps: !1,
      },
      {
        type: `procedural`,
        kind: `radialColor`,
        key: `loaderGradient`,
        params: {
          center: [0.5, 1.3],
          radiusX: 1.267,
          radiusY: 1.434,
          stops: [
            {
              offset: 0.15855,
              color: [212, 246, 235],
            },
            {
              offset: 0.26169,
              color: [179, 222, 209],
            },
            {
              offset: 0.36483,
              color: [145, 199, 183],
            },
            {
              offset: 0.46797,
              color: [112, 175, 156],
            },
            {
              offset: 0.57111,
              color: [78, 151, 130],
            },
            {
              offset: 0.78555,
              color: [53, 111, 94],
            },
            {
              offset: 1,
              color: [28, 72, 57],
            },
          ],
          width: 384,
          height: 216,
        },
      },
      {
        type: `procedural`,
        kind: `radialPull`,
        key: `stage1Foreground1`,
        params: {
          color: [150, 191, 174],
          topLeft: 0.03,
          topCenter: 0,
          topRight: 0.03,
          botLeft: 1,
          botCenter: 0.35,
          botRight: 1,
          centerAlpha: 0,
          centerSigma: 0.25,
        },
      },
      {
        type: `procedural`,
        kind: `dualRadial`,
        key: `stage1Background1`,
        stretched: !0,
        params: {
          baseColor: [110, 200, 230],
          glowColor: [170, 235, 215],
          topCenter: [0.5, 0],
          bottomCenter: [0.5, 1],
          topRadius: [0.85, 0.7],
          bottomRadius: [0.85, 0.7],
          width: 256,
          height: 144,
        },
      },
    ];
    this.stageAssets = {
      initial: [
        {
          type: `model`,
          key: `fancyHand1`,
          path: `assets/models/fancy_hand_2.glb`,
        },
        {
          type: `model`,
          key: `humanHand1`,
          path: `assets/models/human_hand_1.glb`,
        },
        {
          type: `model`,
          key: `cameraModel1`,
          path: `assets/models/camera_1.glb`,
        },
        {
          type: `texture`,
          key: `handMatcap`,
          path: `assets/textures/matcap-hand.webp`,
          mipmaps: !1,
        },
        {
          type: `ktx2`,
          key: `humanHandsAtlas`,
          path: `assets/atlases/human_hands.ktx2`,
        },
        {
          type: `procedural`,
          kind: `solid`,
          key: `stage1Background2`,
          stretched: !1,
          params: {
            color: [255, 255, 255],
            alpha: 1,
          },
        },
        {
          type: `ktx2`,
          key: `spcAtlas`,
          path: `assets/atlases/shards-petals-coins.ktx2`,
        },
        {
          type: `texture`,
          key: `textsAtlas`,
          path: `assets/brand/narrative-atlas.png`,
        },
      ],
      stage2: [
        {
          type: `model`,
          key: `glassShatter`,
          path: `assets/models/stage2_glass-shatter.glb`,
        },
        {
          type: `model`,
          key: `allShards`,
          path: `assets/models/glass_shards.glb`,
          animated: !1,
        },
        {
          type: `model`,
          key: `handsModel2`,
          path: `assets/models/human_hand_2.glb`,
        },
        {
          type: `model`,
          key: `cameraModel2`,
          path: `assets/models/camera_2.glb`,
        },
        {
          type: `procedural`,
          kind: `radialPull`,
          key: `stage2Foreground`,
          params: {
            color: [0, 0, 0],
            topLeft: 0.03,
            topCenter: 0,
            topRight: 0.03,
            botLeft: 1,
            botCenter: 0.35,
            botRight: 1,
            centerAlpha: 0,
            centerSigma: 0.25,
          },
        },
        {
          type: `texture`,
          key: `stage2Background2`,
          path: `assets/textures/stage2_background2.webp`,
          mipmaps: !1,
          wrap: !0,
        },
      ],
      stage3: [
        {
          type: `model`,
          key: `tunnelModel`,
          path: `assets/models/tunnel_new_new.glb`,
          animated: !1,
        },
        {
          type: `texture`,
          key: `stage3Background1`,
          path: `assets/textures/stage3_background1.webp`,
          stretched: !1,
          mipmaps: !1,
        },
        {
          type: `ktx2`,
          key: `moneyShredsAtlas`,
          path: `assets/atlases/leather-money-shreds.ktx2`,
        },
        {
          type: `ktx2`,
          key: `certAtlas`,
          path: `assets/atlases/board-certificates.ktx2`,
        },
        {
          type: `texture`,
          key: `certMatcap`,
          path: `assets/textures/matcap-certificate.webp`,
        },
      ],
      stage4: [
        {
          type: `ktx2`,
          key: `cloudsAtlas`,
          path: t
            ? `assets/atlases/clouds-mobile.ktx2`
            : `assets/atlases/clouds.ktx2`,
        },
      ],
      worldMap: [
        {
          type: `ktx2`,
          key: `worldMap`,
          path: `assets/atlases/world.ktx2`,
        },
      ],
    };
    this._stageLoadStatus = {};
    this._stageLoadPromises = {};
    this._uploadQueue = [];
    this._uploadIdleHandle = null;
    this.chunkedUploader = e ? new TextureUploadQueue(e) : null;
  }
  _scheduleIdleUpload(e?: any): any {
    this.renderer &&
      (this._uploadQueue.push(e),
      this._uploadIdleHandle === null && this._scheduleNextIdleSlot());
  }
  _scheduleNextIdleSlot(): any {
    let e: any = (e?: any): any => {
      for (
        this._uploadIdleHandle = null;
        this._uploadQueue.length > 0 &&
        !(
          (e && e.timeRemaining ? e.timeRemaining() : 16) < 5 &&
          this._uploadQueue.length > 0
        );
      ) {
        let e: any = this._uploadQueue.shift();
        this.renderer && this.renderer.initTexture(e);
      }
      this._uploadQueue.length > 0 && this._scheduleNextIdleSlot();
    };
    typeof requestIdleCallback == `function`
      ? (this._uploadIdleHandle = requestIdleCallback(e, {
          timeout: 2e3,
        }))
      : (this._uploadIdleHandle = setTimeout(
          (): any =>
            e({
              timeRemaining: (): any => 16,
            }),
          50,
        ));
  }
  flushUploads(): any {
    if (this._uploadIdleHandle !== null) {
      if (typeof cancelIdleCallback == `function`)
        try {
          cancelIdleCallback(this._uploadIdleHandle);
        } catch {}
      try {
        clearTimeout(this._uploadIdleHandle);
      } catch {}
      this._uploadIdleHandle = null;
    }
    for (; this._uploadQueue.length > 0;) {
      let e: any = this._uploadQueue.shift();
      this.renderer && this.renderer.initTexture(e);
    }
    this.chunkedUploader && this.chunkedUploader.flushAll();
  }
  getAsset(e?: any): any {
    return this.assets.models[e] || this.assets.textures[e];
  }
  getMeta(e?: any): any {
    return this.assets.meta[e] || {};
  }
  loadMandatoryAssets(e?: any): any {
    let t: any = 0,
      n: any = this.mandatoryAssets.length;
    if (n === 0) return Promise.resolve();
    let r: any = this.mandatoryAssets.map((r?: any): any =>
      this.loadAsset(r)
        .then((r?: any): any => (t++, e && e(t / n), r))
        .catch((e?: any): any => {
          throw (
            console.error(`Failed to load mandatory asset: ${r.key}`, e),
            e
          );
        }),
    );
    return Promise.all(r);
  }
  loadInitialAssets(e?: any): any {
    let t: any = this.stageAssets.initial,
      n: any = this.mandatoryAssets.length + t.length,
      r: any = 0;
    if (n === 0) return Promise.resolve();
    let i: any = (): any => {
      r++;
      e && e(r / n);
    };
    this._stageLoadStatus.initial = `loading`;
    return this.loadMandatoryAssets((): any => i()).then((): any =>
      this._loadWithConcurrency(t, 6, i).then((): any => {
        this.flushUploads();
        this._stageLoadStatus.initial = `loaded`;
        this._stageLoadPromises.initial = Promise.resolve();
      }),
    );
  }
  loadEverythingExceptWorldMap(e?: any): any {
    let t: any = [`initial`, `stage2`, `stage3`, `stage4`],
      n: any = [
        ...this.mandatoryAssets,
        ...t.flatMap((e?: any): any => this.stageAssets[e] || []),
      ],
      r: any = n.length;
    for (let e of t) this._stageLoadStatus[e] = `loading`;
    if (r === 0) return Promise.resolve();
    let i: any = 0;
    return this._loadWithConcurrency(n, 6, (): any => {
      i++;
      e && e(i / r);
    }).then((): any => {
      this.flushUploads();
      for (let e of t) {
        this._stageLoadStatus[e] = `loaded`;
        this._stageLoadPromises[e] = Promise.resolve();
      }
    });
  }
  loadStageAssets(e?: any): any {
    if (this._stageLoadPromises[e]) return this._stageLoadPromises[e];
    let t: any = this.stageAssets[e];
    return !t || t.length === 0
      ? ((this._stageLoadStatus[e] = `loaded`),
        (this._stageLoadPromises[e] = Promise.resolve()))
      : ((this._stageLoadStatus[e] = `loading`),
        (this._stageLoadPromises[e] = this._loadWithConcurrency(t, 2).then(
          (): any => {
            this._stageLoadStatus[e] = `loaded`;
          },
        )),
        this._stageLoadPromises[e]);
  }
  isStageReady(e?: any): any {
    return this._stageLoadStatus[e] === `loaded`;
  }
  waitForStage(e?: any): any {
    return this.isStageReady(e)
      ? Promise.resolve()
      : this._stageLoadPromises[e] || this.loadStageAssets(e);
  }
  startBackgroundPrefetch(): any {
    this.loadStageAssets(`stage2`);
    this.loadStageAssets(`stage3`);
    this.loadStageAssets(`stage4`);
  }
  loadMissingMandatory(): any {
    let e: any = this.mandatoryAssets.filter((e?: any): any =>
      e.type === `model`
        ? !this.assets.models[e.key]
        : !this.assets.textures[e.key],
    );
    return e.length === 0
      ? Promise.resolve()
      : this._loadWithConcurrency(e, 2).then((): any => this.flushUploads());
  }
  loadMissingForStage(e?: any): any {
    let t: any = this.stageAssets[e];
    if (!t || t.length === 0) {
      this._stageLoadStatus[e] = `loaded`;
      return Promise.resolve();
    }
    let n: any = t.filter((e?: any): any =>
      e.type === `model`
        ? !this.assets.models[e.key]
        : !this.assets.textures[e.key],
    );
    if (n.length === 0) {
      this._stageLoadStatus[e] = `loaded`;
      return Promise.resolve();
    }
    this._stageLoadStatus[e] = `loading`;
    let r: any = this._loadWithConcurrency(n, 2).then((): any => {
      this.flushUploads();
      this._stageLoadStatus[e] = `loaded`;
    });
    this._stageLoadPromises[e] = r;
    return r;
  }
  _loadWithConcurrency(e?: any, t?: any, n?: any): any {
    let r: any = 0,
      i: any = (): any => {
        if (r >= e.length) return Promise.resolve();
        let t: any = e[r++];
        return this.loadAsset(t)
          .then((): any => {
            n && n();
          })
          .catch((e?: any): any => {
            n && n();
            console.warn(`Failed to load deferred asset: ${t.key}`, e);
          })
          .then((): any => i());
      };
    return Promise.all(
      Array.from(
        {
          length: Math.min(t, e.length),
        },
        (): any => i(),
      ),
    );
  }
  loadAsset(e?: any): any {
    let t: any = e.key || e.path || e.type || `asset`,
      n: any = [600, 1800, 4500],
      r: any = 25e3,
      i: any = (a?: any): any => {
        let o: any =
            typeof AbortController < `u` ? new AbortController() : null,
          s: any = null,
          c: any = new Promise((n?: any, i?: any): any => {
            s = setTimeout((): any => {
              o && o.abort();
              i(Error(`Timed out after ${r}ms: ${t}`));
            }, r);
            this._loadAssetOnce(e, o ? o.signal : null).then(n, i);
          }),
          l: any = (): any => {
            s && clearTimeout(s);
          };
        return c.then(
          (e?: any): any => (l(), e),
          (e?: any): any => {
            if ((l(), a >= n.length)) throw e;
            console.warn(
              `[AssetLoader] "${t}" failed (try ${a + 1}/${n.length + 1}); retrying in ${n[a]}ms —`,
              (e && e.message) || e,
            );
            return new Promise((e?: any): any => setTimeout(e, n[a])).then(
              (): any => i(a + 1),
            );
          },
        );
      };
    return i(0);
  }
  _loadAssetOnce(e?: any, t?: any): any {
    return new Promise((n?: any, r?: any): any => {
      let i: any = (e?: any): any => r(e);
      if (e.type === `model`)
        this.gltfLoader.load(
          e.path,
          (t?: any): any => {
            t.scene.traverse((e?: any): any => {
              e.isMesh && (e.frustumCulled = !0);
            });
            e.animated !== !1 &&
              (t.animations && t.animations.length > 0
                ? (this.assets.animations[e.key] = t.animations)
                : console.warn(
                    `AssetLoader: No animations found for ${e.key}`,
                  ));
            this.assets.models[e.key] = t.scene;
            n(t.scene);
          },
          void 0,
          i,
        );
      else if (e.type === `texture`)
        fetch(
          e.path,
          t
            ? {
                signal: t,
              }
            : void 0,
        )
          .then((t?: any): any => {
            if (!t.ok) throw Error(`HTTP ${t.status} loading ${e.path}`);
            return t.blob();
          })
          .then((t?: any): any =>
            createImageBitmap(t, {
              imageOrientation: e.flipY === !1 ? `from-image` : `flipY`,
              premultiplyAlpha: `none`,
              colorSpaceConversion: `none`,
            }),
          )
          .then((t?: any): any => {
            let r: any = new Texture(t);
            r.flipY = !1;
            r.needsUpdate = !0;
            r.colorSpace =
              e.colorSpace === `linear` ? LinearSRGBColorSpace : SRGBColorSpace;
            e.wrap && ((r.wrapS = RepeatWrapping), (r.wrapT = RepeatWrapping));
            e.mipmaps === !1 &&
              ((r.generateMipmaps = !1), (r.minFilter = LinearFilter));
            e.textAtlas &&
              ((r.generateMipmaps = !0),
              (r.minFilter = LinearMipmapLinearFilter),
              (r.magFilter = LinearFilter),
              this.renderer &&
                (r.anisotropy = this.renderer.capabilities.getMaxAnisotropy()));
            this.assets.textures[e.key] = r;
            this.assets.meta[e.key] = {
              stretched: e.stretched !== !1,
            };
            e.chunked && this.chunkedUploader
              ? this.chunkedUploader.startUpload(r, t)
              : this._scheduleIdleUpload(r);
            n(r);
          })
          .catch(i);
      else if (e.type === `draco`)
        this.dracoLoader.load(
          e.path,
          (t?: any): any => {
            this.assets.models[e.key] = t;
            n(t);
          },
          void 0,
          i,
        );
      else if (e.type === `procedural`) {
        let t: any;
        if (e.kind === `radialPull`)
          t = createRadialPullTexture(e.params || {});
        else if (e.kind === `radialColor`)
          t = createRadialColorTexture(e.params || {});
        else if (e.kind === `dualRadial`)
          t = createDualRadialTexture(e.params || {});
        else if (e.kind === `solid`) t = createSolidTexture(e.params || {});
        else {
          r(Error(`AssetLoader: unknown procedural kind "${e.kind}"`));
          return;
        }
        this.assets.textures[e.key] = t;
        this.assets.meta[e.key] = {
          stretched: e.stretched !== !1,
        };
        this._scheduleIdleUpload(t);
        n(t);
      } else
        e.type === `ktx2`
          ? this.ktx2Loader.load(
              e.path,
              (t?: any): any => {
                t.colorSpace = SRGBColorSpace;
                e.wrap &&
                  ((t.wrapS = RepeatWrapping), (t.wrapT = RepeatWrapping));
                e.key === `worldMap` &&
                  ((t.generateMipmaps = !1), (t.minFilter = LinearFilter));
                this.assets.textures[e.key] = t;
                this._scheduleIdleUpload(t);
                n(t);
              },
              void 0,
              i,
            )
          : n(null);
    });
  }
  disposeTextures(e?: any): any {}
  dispose(): any {
    this.dracoLoader && this.dracoLoader.dispose();
    this.ktx2Loader && this.ktx2Loader.dispose();
    this.manager = null;
    this.assets = null;
  }
};
export {
  ug,
  dg,
  TextureUploadQueue,
  createRadialPullTexture,
  createRadialColorTexture,
  createDualRadialTexture,
  createSolidTexture,
  AssetLoader,
};
