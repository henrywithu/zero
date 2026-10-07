import { Pg, Fg, Ig, Lg } from "./ZeroGesture";
import { Vector3, Matrix4 } from "three";
interface ScrollStage {
  scrollLength?: number;
}
type ScrubListener = (progress: number) => void;

/** Frame-independent timeline input with the reference's wheel/touch multipliers. */
export class ScrollManager {
  scrollPos = 0;
  targetScrollPos = 0;
  progress = 0;
  enabled = false;
  _held = false;
  _activeStage: ScrollStage | null = null;
  private _subscribers: ScrubListener[] = [];
  private _scrollClampMin: number | null = null;
  private _scrollClampMax: number | null = null;
  _isAutoScrolling = false;
  private _autoStart = 0;
  private _autoTarget = 0;
  private _autoDuration = 0;
  private _autoElapsed = 0;
  private _autoResolve: (() => void) | null = null;
  private _lastTouchY = 0;
  private readonly _smoothSpeed = -Math.log(1 - Pg.SCROLL_LERP) * 60;
  constructor() {
    window.addEventListener("wheel", this._onWheel, {
      passive: true,
    });
    window.addEventListener("touchstart", this._onTouchStart, {
      passive: true,
    });
    window.addEventListener("touchmove", this._onTouchMove, {
      passive: false,
    });
  }
  setActiveStage(stage: ScrollStage): void {
    this._activeStage = stage;
    this.scrollPos = this.targetScrollPos = this.progress = 0;
  }
  onScrub(listener: ScrubListener): () => void {
    this._subscribers.push(listener);
    return () => {
      this._subscribers = this._subscribers.filter((item) => item !== listener);
    };
  }
  enable(): void {
    this.enabled = true;
  }
  disable(): void {
    this.enabled = false;
  }
  setHeld(held: boolean): void {
    this._held = held;
  }
  setScrollClamp(min: number | null, max: number | null): void {
    this._scrollClampMin = min;
    this._scrollClampMax = max;
    if (max !== null && this.targetScrollPos > max) this.targetScrollPos = max;
    if (min !== null && this.targetScrollPos < min) this.targetScrollPos = min;
  }
  clearScrollClamp(): void {
    this._scrollClampMin = this._scrollClampMax = null;
  }
  setScrollImmediate(position: number): void {
    this.scrollPos = this.targetScrollPos = position;
  }
  startAutoScroll(target: number, duration: number): Promise<void> {
    return new Promise((resolve) => {
      this._isAutoScrolling = true;
      this._autoStart = this.scrollPos;
      this._autoTarget = target;
      this._autoDuration = Math.max(duration, 0.01);
      this._autoElapsed = 0;
      this._autoResolve = resolve;
    });
  }
  update(delta: number): void {
    if (!this.enabled || !this._activeStage) return;
    const length = this._activeStage.scrollLength || 1;
    if (this._isAutoScrolling) {
      this._autoElapsed += delta;
      const t = Math.min(this._autoElapsed / this._autoDuration, 1);
      const eased = t * t * (3 - 2 * t);
      this.scrollPos =
        this._autoStart + (this._autoTarget - this._autoStart) * eased;
      this.targetScrollPos = this.scrollPos;
      this.publish(this.scrollPos / length);
      if (t >= 1) {
        this._isAutoScrolling = false;
        this._autoResolve?.();
        this._autoResolve = null;
      }
      return;
    }
    const smoothing =
      delta > 0 ? 1 - Math.exp(-this._smoothSpeed * delta) : Pg.SCROLL_LERP;
    this.scrollPos =
      (1 - smoothing) * this.scrollPos + smoothing * this.targetScrollPos;
    if (Math.abs(this.scrollPos - this.targetScrollPos) < 0.5)
      this.scrollPos = this.targetScrollPos;
    this.publish(this.scrollPos / length);
  }
  private publish(progress: number): void {
    if (progress === this.progress) return;
    this.progress = progress;
    for (const listener of this._subscribers) listener(progress);
  }
  private applyDelta(delta: number, multiplier: number): void {
    const min = Math.max(0, this._scrollClampMin ?? 0);
    const max = Math.min(
      this._activeStage?.scrollLength || 1,
      this._scrollClampMax ?? Infinity,
    );
    const clampedDelta = Math.max(-500, Math.min(Fg, delta));
    this.targetScrollPos = Math.min(
      Math.max(this.targetScrollPos + clampedDelta * multiplier, min),
      max,
    );
  }
  private _onWheel = (event: WheelEvent): void => {
    if (
      !this.enabled ||
      this._held ||
      !this._activeStage ||
      this._isAutoScrolling
    )
      return;
    this.applyDelta(event.deltaY, Ig);
  };
  private _onTouchStart = (event: TouchEvent): void => {
    if (this.enabled && event.touches[0])
      this._lastTouchY = event.touches[0].clientY;
  };
  private _onTouchMove = (event: TouchEvent): void => {
    if (!this.enabled || !this._activeStage || this._isAutoScrolling) return;
    if (this._held || event.touches.length !== 1) {
      if (event.touches[0]) this._lastTouchY = event.touches[0].clientY;
      return;
    }
    const y = event.touches[0].clientY;
    const delta = this._lastTouchY - y;
    this._lastTouchY = y;
    this.applyDelta(delta, Lg);
  };
  dispose(): void {
    window.removeEventListener("wheel", this._onWheel);
    window.removeEventListener("touchstart", this._onTouchStart);
    window.removeEventListener("touchmove", this._onTouchMove);
    this._subscribers = [];
    this._activeStage = null;
  }
}

// Reused scratch values for the camera rig; preserve allocation behavior.
export const zg = new Vector3();
export const Bg = new Vector3();
export const Vg = new Vector3();
export const Hg = new Vector3();
export const Ug = new Matrix4();
