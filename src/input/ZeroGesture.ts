import type { Scene, Camera } from "three";
import type { AssetLoader } from "../assets/AssetLoader";
import type { Hud } from "../components/Hud";
const minimumSamples = 20;
const maximumCoordinates = 2000;
const minimumAngularTravel = 5.76;
const nearCompleteRatio = 0.9;
const maximumRadiusVariation = 0.35;
const maximumClosureRatio = 1;

/** Recognizes the reference's closed circular stroke in normalized coordinates. */
export class ZeroGesture {
  isReady = false;
  isComplete = false;
  readonly strokePoints: number[] = [];
  circleCenterUV: {
    x: number;
    y: number;
  } | null = null;
  onStageComplete: (() => void) | null = null;
  onNearComplete: (() => void) | null = null;
  private _nearFired = false;
  constructor(
    readonly scene: Scene,
    readonly camera: Camera,
    readonly assetLoader: InstanceType<typeof AssetLoader>,
    readonly ui: InstanceType<typeof Hud>,
  ) {}
  setReady(): void {
    this.isReady = true;
  }
  handleInput(x: number, y: number, pressed: boolean): void {
    if (!this.isReady || this.isComplete) return;
    if (!pressed) {
      this.strokePoints.length = 0;
      return;
    }
    if (this.strokePoints.length >= maximumCoordinates) return;
    this.strokePoints.push(x, y);
    this._checkZeroGesture();
  }
  private _checkZeroGesture(): void {
    const points = this.strokePoints;
    const sampleCount = points.length >> 1;
    if (sampleCount < minimumSamples) return;
    let centerX = 0,
      centerY = 0;
    for (let i = 0; i < points.length; i += 2) {
      centerX += points[i];
      centerY += points[i + 1];
    }
    centerX /= sampleCount;
    centerY /= sampleCount;
    let radiusSum = 0,
      squaredRadiusSum = 0;
    for (let i = 0; i < points.length; i += 2) {
      const dx = points[i] - centerX,
        dy = points[i + 1] - centerY;
      const radius = Math.sqrt(dx * dx + dy * dy);
      radiusSum += radius;
      squaredRadiusSum += radius * radius;
    }
    const meanRadius = radiusSum / sampleCount;
    if (meanRadius < 0.02) return;
    const variance = squaredRadiusSum / sampleCount - meanRadius * meanRadius;
    if (Math.sqrt(Math.max(0, variance)) / meanRadius > maximumRadiusVariation)
      return;
    let travel = 0;
    let previousAngle = Math.atan2(points[1] - centerY, points[0] - centerX);
    for (let i = 2; i < points.length; i += 2) {
      const angle = Math.atan2(points[i + 1] - centerY, points[i] - centerX);
      let difference = angle - previousAngle;
      if (difference > Math.PI) difference -= 2 * Math.PI;
      if (difference < -Math.PI) difference += 2 * Math.PI;
      travel += difference;
      previousAngle = angle;
    }
    if (
      !this._nearFired &&
      Math.abs(travel) >= nearCompleteRatio * minimumAngularTravel
    ) {
      this._nearFired = true;
      this.onNearComplete?.();
    }
    if (Math.abs(travel) < minimumAngularTravel) return;
    const closureX = points[points.length - 2] - points[0];
    const closureY = points[points.length - 1] - points[1];
    if (
      Math.sqrt(closureX * closureX + closureY * closureY) >
      meanRadius * maximumClosureRatio
    )
      return;
    this.circleCenterUV = {
      x: (centerX + 1) * 0.5,
      y: (centerY + 1) * 0.5,
    };
    this._onZeroComplete();
  }
  _onZeroComplete(): void {
    if (this.isComplete) return;
    this.isComplete = true;
    this.onStageComplete?.();
  }
}
export const Pg = {
  SCROLL_LERP: 0.075,
  CAMERA_LERP: 0.08,
  SCROLL_VELOCITY_SMOOTHING: 0.1,
  CAMERA_RIG: {
    FOCAL_DISTANCE: 1,
    MAX_OFFSET: 0.18,
    SMOOTH_TC: 0.12,
    GYRO_RANGE: 20,
  },
};
export const Fg = 500;
export const Ig = 35;
export const Lg = 80;
