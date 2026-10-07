// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
var __: any = {
  HIGH: {
    label: `high`,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    lensBlur: {
      enabled: 1,
      maxBlur: 16,
      samples: 24,
      focalRadius: 0.3,
      falloff: 0.3,
    },
    frosting: {
      trailHalfRes: !0,
    },
    postProcessing: {
      foregroundNoise: 2,
      noiseStrength: 0.04,
    },
    coinRing: {
      segments: 24,
    },
    text: {
      rtScale: 1,
    },
  },
  MEDIUM: {
    label: `medium`,
    pixelRatio: Math.min(window.devicePixelRatio, 1.5),
    lensBlur: {
      enabled: 1,
      maxBlur: 16,
      samples: 16,
      focalRadius: 0.3,
      falloff: 0.3,
    },
    frosting: {
      trailHalfRes: !0,
    },
    postProcessing: {
      foregroundNoise: 2,
      noiseStrength: 0.04,
    },
    coinRing: {
      segments: 16,
    },
    text: {
      rtScale: 1,
    },
  },
  LOW: {
    label: `low`,
    pixelRatio: 1,
    lensBlur: {
      enabled: 0,
      maxBlur: 12,
      samples: 16,
      focalRadius: 0.35,
      falloff: 0.35,
    },
    frosting: {
      trailHalfRes: !0,
    },
    postProcessing: {
      foregroundNoise: 2,
      noiseStrength: 0.04,
    },
    coinRing: {
      segments: 12,
    },
    text: {
      rtScale: 0.75,
    },
  },
};
var v_: any = {
  enabled: !0,
  sampleWindow: 60,
  downgradeThreshold: 22,
  upgradeThreshold: 12,
  cooldownFrames: 180,
};
var qualityManager: any = new (class {
  declare _framesSinceTierChange: any;
  declare _frameSum: any;
  declare _frameCount: any;
  declare _frameIdx: any;
  declare _frameTimes: any;
  declare _listeners: any;
  declare _tier: any;
  constructor() {
    this._tier = `HIGH`;
    this._listeners = [];
    this._frameTimes = new Float32Array(v_.sampleWindow);
    this._frameIdx = 0;
    this._frameCount = 0;
    this._frameSum = 0;
    this._framesSinceTierChange = 0;
  }
  get tier(): any {
    return this._tier;
  }
  get preset(): any {
    return __[this._tier];
  }
  setTier(e?: any): any {
    if (!__[e] || e === this._tier) return;
    let t: any = this._tier;
    this._tier = e;
    this._framesSinceTierChange = 0;
    this._frameTimes.fill(0);
    this._frameIdx = 0;
    this._frameCount = 0;
    this._frameSum = 0;
    for (let n of this._listeners) n(e, t);
  }
  onChange(e?: any): any {
    this._listeners.push(e);
    return (): any => {
      this._listeners = this._listeners.filter((t?: any): any => t !== e);
    };
  }
  sampleFrame(e?: any): any {
    if (!v_.enabled) return;
    this._framesSinceTierChange++;
    let t: any = v_.sampleWindow,
      n: any = e * 1e3;
    if (
      ((this._frameSum -= this._frameTimes[this._frameIdx]),
      (this._frameTimes[this._frameIdx] = n),
      (this._frameSum += n),
      (this._frameIdx = (this._frameIdx + 1) % t),
      this._frameCount < t && this._frameCount++,
      this._frameCount < t || this._framesSinceTierChange < v_.cooldownFrames)
    )
      return;
    let r: any = this._frameSum / t;
    r > v_.downgradeThreshold
      ? this._tier === `HIGH`
        ? this.setTier(`MEDIUM`)
        : this._tier === `MEDIUM` && this.setTier(`LOW`)
      : r < v_.upgradeThreshold &&
        (this._tier === `LOW`
          ? this.setTier(`MEDIUM`)
          : this._tier === `MEDIUM` && this.setTier(`HIGH`));
  }
})();
var b_: any = 2;
function x_(this: any): any {
  let e: any = qualityManager.preset.text?.rtScale ?? 1;
  return Math.min(window.devicePixelRatio || 1, b_) * e;
}
export { __, v_, qualityManager, b_, x_ };
