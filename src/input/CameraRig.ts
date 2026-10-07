// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { Pg } from "./ZeroGesture.ts";
import { Vector3, Quaternion } from "three";
import { zg, Bg, Vg, Hg, Ug } from "./ScrollManager.ts";
var CameraRig = class {
  declare _gyroHttpsWarned: any;
  declare _gyroAutoTrigger: any;
  declare _handleGyro: any;
  declare _gyroGammaRef: any;
  declare _gyroBetaRef: any;
  declare _gyroAttempt: any;
  declare _gyroActive: any;
  declare _isDesktop: any;
  declare _savedQuat: any;
  declare _savedPos: any;
  declare _currentY: any;
  declare _currentX: any;
  declare _inputY: any;
  declare _inputX: any;
  declare config: any;
  declare influence: any;
  declare enabled: any;
  declare camera: any;
  constructor(e?: any) {
    this.camera = e;
    this.enabled = !0;
    this.influence = 1;
    this.config = Pg.CAMERA_RIG;
    this._inputX = 0;
    this._inputY = 0;
    this._currentX = 0;
    this._currentY = 0;
    this._savedPos = new Vector3();
    this._savedQuat = new Quaternion();
    this._isDesktop =
      window.matchMedia(`(pointer: fine)`).matches ||
      !window.matchMedia(`(pointer: coarse)`).matches;
    this._gyroActive = !1;
    this._gyroAttempt = `idle`;
    this._gyroBetaRef = null;
    this._gyroGammaRef = null;
    this._handleGyro = (e?: any): any => {
      if (e.gamma === null || e.beta === null) return;
      this._gyroActive ||
        ((this._gyroActive = !0),
        console.log(`[CameraRig] First deviceorientation event received`, {
          beta: e.beta,
          gamma: e.gamma,
          absolute: e.absolute,
        }));
      let t: any = e.beta,
        n: any = e.gamma,
        r: any =
          screen.orientation?.angle ??
          (typeof window.orientation == `number` ? window.orientation : 0);
      if (
        (r === 90
          ? ((t = e.gamma), (n = -e.beta))
          : r === 270
            ? ((t = -e.gamma), (n = e.beta))
            : r === 180 && ((t = -e.beta), (n = -e.gamma)),
        this._gyroBetaRef === null)
      ) {
        this._gyroBetaRef = t;
        this._gyroGammaRef = n;
        return;
      }
      let i: any = this.config.GYRO_RANGE;
      this._inputX = Math.max(-1, Math.min(1, (n - this._gyroGammaRef) / i));
      this._inputY = Math.max(-1, Math.min(1, -(t - this._gyroBetaRef) / i));
      let a: any = 0.008;
      this._gyroGammaRef += (n - this._gyroGammaRef) * a;
      this._gyroBetaRef += (t - this._gyroBetaRef) * a;
    };
    this._onResize = this._onResize.bind(this);
    window.addEventListener(`resize`, this._onResize);
    this._gyroAutoTrigger = (): any => {
      this.enableGyro().then((): any => {
        this._gyroAttempt === `granted` &&
          (window.removeEventListener(`pointerdown`, this._gyroAutoTrigger, !0),
          window.removeEventListener(`touchstart`, this._gyroAutoTrigger, !0),
          (this._gyroAutoTrigger = null));
      });
    };
    this._isDesktop ||
      (window.addEventListener(`pointerdown`, this._gyroAutoTrigger, {
        capture: !0,
      }),
      window.addEventListener(`touchstart`, this._gyroAutoTrigger, {
        capture: !0,
      }));
  }
  _onResize(): any {
    this._isDesktop = window.matchMedia(`(pointer: fine)`).matches;
  }
  onMouseMove(e?: any, t?: any): any {
    !this._isDesktop ||
      !this.enabled ||
      ((this._inputX = e), (this._inputY = t));
  }
  get cursorX(): any {
    return this._currentX;
  }
  get cursorY(): any {
    return this._currentY;
  }
  get gyroActive(): any {
    return this._gyroActive;
  }
  get inputX(): any {
    return this._inputX;
  }
  get inputY(): any {
    return this._inputY;
  }
  async enableGyro(): Promise<any> {
    if (
      !this._isDesktop &&
      !(this._gyroAttempt === `pending` || this._gyroAttempt === `granted`)
    ) {
      if (
        (typeof window < `u` &&
          window.isSecureContext === !1 &&
          (this._gyroHttpsWarned ||
            ((this._gyroHttpsWarned = !0),
            console.warn(
              "[CameraRig] Gyro requires HTTPS (or localhost). The dev server is on plain HTTP — iOS Safari will refuse the permission prompt and the deviceorientation event never fires. Use `npm run dev -- --host --https` or a cloudflared/ngrok tunnel.",
            ))),
        (this._gyroAttempt = `pending`),
        typeof DeviceOrientationEvent < `u` &&
          typeof (DeviceOrientationEvent as any).requestPermission ==
            `function`)
      )
        try {
          let e: any = await (
            DeviceOrientationEvent as any
          ).requestPermission();
          if (e !== `granted`) {
            this._gyroAttempt = `denied`;
            console.warn(
              `[CameraRig] DeviceOrientationEvent permission "${e}" — gyro disabled. User can re-enable via Settings → Safari → Privacy → Motion & Orientation Access.`,
            );
            return;
          }
        } catch (e: any) {
          this._gyroAttempt = `denied`;
          console.warn(
            `[CameraRig] (DeviceOrientationEvent as any).requestPermission() rejected:`,
            e,
          );
          return;
        }
      this._gyroAttempt = `granted`;
      window.addEventListener(`deviceorientation`, this._handleGyro);
      setTimeout((): any => {
        this._gyroAttempt === `granted` &&
          !this._gyroActive &&
          console.debug(
            `[CameraRig] No deviceorientation events after 1.5s — device likely has no gyroscope (or sensor disabled / non-secure context). Falling back to mouse parallax where available.`,
          );
      }, 1500);
    }
  }
  setEnabled(e?: any): any {
    this.enabled = e;
    e ||
      ((this._inputX = 0),
      (this._inputY = 0),
      (this._currentX = 0),
      (this._currentY = 0));
  }
  get _hasInput(): any {
    return this._isDesktop || this._gyroActive;
  }
  update(e?: any): any {
    if (!this._hasInput || !this.enabled) return;
    let t: any = 1 - Math.exp(-e / this.config.SMOOTH_TC);
    this._currentX += (this._inputX - this._currentX) * t;
    this._currentY += (this._inputY - this._currentY) * t;
    Math.abs(this._currentX) < 1e-4 && (this._currentX = 0);
    Math.abs(this._currentY) < 1e-4 && (this._currentY = 0);
    this._savedPos.copy(this.camera.position);
    this._savedQuat.copy(this.camera.quaternion);
    zg.set(0, 0, -1).applyQuaternion(this._savedQuat);
    Bg.set(1, 0, 0).applyQuaternion(this._savedQuat);
    Vg.set(0, 1, 0).applyQuaternion(this._savedQuat);
    Hg.copy(this._savedPos).addScaledVector(zg, this.config.FOCAL_DISTANCE);
    let n: any = this.config.MAX_OFFSET * this.influence;
    this.camera.position.addScaledVector(Bg, this._currentX * n);
    this.camera.position.addScaledVector(Vg, this._currentY * n);
    Ug.lookAt(this.camera.position, Hg, Vg);
    this.camera.quaternion.setFromRotationMatrix(Ug);
  }
  restore(): any {
    !this._hasInput ||
      !this.enabled ||
      (this.camera.position.copy(this._savedPos),
      this.camera.quaternion.copy(this._savedQuat));
  }
  dispose(): any {
    window.removeEventListener(`resize`, this._onResize);
    window.removeEventListener(`deviceorientation`, this._handleGyro);
    this._gyroAutoTrigger &&=
      (window.removeEventListener(`pointerdown`, this._gyroAutoTrigger, !0),
      window.removeEventListener(`touchstart`, this._gyroAutoTrigger, !0),
      null);
  }
};
export { CameraRig };
