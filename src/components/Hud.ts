// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { gsap } from "gsap";
import { audioManager } from "../audio/AudioManager.ts";
import { HoldButton } from "./HoldButton.ts";
var Hud = class {
  declare _popupModal: any;
  declare _popupKeyHandler: any;
  declare _popup: any;
  declare _removeClickListener: any;
  declare nextStageBtn: any;
  declare nextStageButton: any;
  declare _loaderTl: any;
  declare _loaderWidth: any;
  declare _syncAudioBtnState: any;
  declare _audioFlattenTimer: any;
  declare _audioWaveRunning: any;
  declare _audioWaveAnim: any;
  declare _menuKeyHandler: any;
  declare _menuOutsideHandler: any;
  declare _menuDropdown: any;
  declare menuBtn: any;
  declare _menu: any;
  declare scrollIndicator: any;
  declare _statusChevron: any;
  declare _statusLabel: any;
  declare statusText: any;
  declare _logoVisible: any;
  declare logo: any;
  declare _rightGroup: any;
  declare audioBtn: any;
  declare _xpValue: any;
  declare xpCounter: any;
  declare _leftGroup: any;
  declare loader: any;
  declare _isMobile: any;
  declare container: any;
  constructor() {
    this.container = document.getElementById(`ui-container`);
    this._isMobile = window.innerWidth <= 768;
    this._createLoader();
    this._createHUD();
    this._createNextStageButton();
    this.loader.active = !0;
  }
  _createLoader(): any {
    this.loader = {
      container: document.createElement(`div`),
      text: document.createElement(`div`),
      progress: document.createElement(`div`),
      active: !0,
      digits: [],
      lastDigits: [],
    };
    this.loader.container.className = `loader-container`;
    this.loader.container.setAttribute(`role`, `progressbar`);
    this.loader.container.setAttribute(`aria-valuemin`, `0`);
    this.loader.container.setAttribute(`aria-valuemax`, `99`);
    this.loader.container.setAttribute(`aria-valuenow`, `99`);
    this.loader.container.setAttribute(`aria-label`, `Loading progress`);
    this.loader.text.className = `loader-text`;
    for (let e: any = 0; e < 3; e++) {
      let e: any = document.createElement(`div`);
      e.className = `loader-digit`;
      let t: any = document.createElement(`div`);
      t.className = `loader-digit-inner`;
      for (let e: any = 0; e < 10; e++) {
        let n: any = document.createElement(`span`);
        n.textContent = e;
        t.appendChild(n);
      }
      e.appendChild(t);
      this.loader.text.appendChild(e);
      this.loader.digits.push(t);
      this.loader.lastDigits.push(0);
    }
    this.loader.digits[0].parentElement.style.display = `none`;
    gsap.set(this.loader.digits[1], {
      yPercent: -90,
    });
    gsap.set(this.loader.digits[2], {
      yPercent: -90,
    });
    this.loader.lastDigits = [0, 9, 9];
    let e: any = document.createElement(`span`);
    e.textContent = `degree`;
    e.className = `loader-degree`;
    this.loader.container.appendChild(this.loader.text);
    this.loader.container.appendChild(e);
    this.container.appendChild(this.loader.container);
  }
  _createHUD(): any {
    let e: any = this._isMobile;
    this._leftGroup = document.createElement(`div`);
    this._leftGroup.className = `hud-left-group`;
    this.xpCounter = document.createElement(`div`);
    this.xpCounter.className = `hud-xp`;
    let t: any = document.createElement(`img`);
    t.src = `assets/ui/xp.webp`;
    t.className = `hud-xp-icon`;
    t.alt = `XP`;
    this._xpValue = document.createElement(`span`);
    this._xpValue.className = `hud-xp-value`;
    this._xpValue.textContent = `0`;
    let n: any = document.createElement(`span`);
    n.className = `hud-xp-label`;
    n.textContent = `XP`;
    this.xpCounter.appendChild(t);
    this.xpCounter.appendChild(this._xpValue);
    this.xpCounter.appendChild(n);
    this.audioBtn = null;
    e || this._createAudioToggle();
    this._rightGroup = document.createElement(`div`);
    this._rightGroup.className = `hud-right-group`;
    e
      ? this._leftGroup.appendChild(this.xpCounter)
      : (this._leftGroup.appendChild(this.audioBtn),
        this._rightGroup.appendChild(this.xpCounter));
    this.container.appendChild(this._leftGroup);
    this.container.appendChild(this._rightGroup);
    this.logo = null;
    this._logoVisible = !1;
    this.statusText = document.createElement(`div`);
    this.statusText.className = `hud-status`;
    this.statusText.setAttribute(`aria-live`, `polite`);
    this._statusLabel = document.createElement(`span`);
    this._statusLabel.className = `hud-status-label`;
    this.statusText.appendChild(this._statusLabel);
    this._statusChevron = document.createElement(`span`);
    this._statusChevron.className = `hud-status-chevron`;
    this._statusChevron.innerHTML = `<svg width="14" height="8" viewBox="0 0 14 8" aria-hidden="true"><path d="M1 1L7 7L13 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
    this.statusText.appendChild(this._statusChevron);
    this.container.appendChild(this.statusText);
    this.scrollIndicator = document.createElement(`div`);
    this.scrollIndicator.className = `scroll-indicator`;
    this.scrollIndicator.setAttribute(`aria-hidden`, `true`);
    let r: any = document.createElement(`span`);
    r.className = `scroll-indicator-dot`;
    let i: any = document.createElement(`span`);
    i.className = `scroll-indicator-label`;
    i.textContent = `SCROLL`;
    this.scrollIndicator.appendChild(r);
    this.scrollIndicator.appendChild(i);
    this.container.appendChild(this.scrollIndicator);
  }
  _openWaitlist(): any {
    window.dispatchEvent(new CustomEvent(`zero:openWaitlist`));
  }
  _createMenu(): any {
    this._menu = document.createElement(`div`);
    this._menu.className = `hud-menu`;
    this.menuBtn = document.createElement(`button`);
    this.menuBtn.className = `hud-menu-btn`;
    this.menuBtn.setAttribute(`aria-label`, `Menu`);
    this.menuBtn.setAttribute(`aria-haspopup`, `true`);
    this.menuBtn.setAttribute(`aria-expanded`, `false`);
    this.menuBtn.innerHTML = `<svg class="hud-menu-icon" width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><line x1="1" y1="2" x2="17" y2="2" /><line x1="1" y1="7" x2="17" y2="7" /><line x1="1" y1="12" x2="17" y2="12" /></svg>`;
    this._menuDropdown = document.createElement(`div`);
    this._menuDropdown.className = `hud-menu-dropdown`;
    this._menuDropdown.setAttribute(`role`, `menu`);
    for (let { label: e, href: t } of [
      {
        label: `Home`,
        href: `/`,
      },
      {
        label: `Manifesto`,
        href: `/manifesto`,
      },
    ]) {
      let n: any = document.createElement(`a`);
      n.className = `hud-menu-item`;
      n.href = t;
      n.textContent = e;
      n.setAttribute(`role`, `menuitem`);
      n.addEventListener(`click`, (): any => this._closeMenu());
      this._menuDropdown.appendChild(n);
    }
    this._menu.appendChild(this.menuBtn);
    this._menu.appendChild(this._menuDropdown);
    this.menuBtn.addEventListener(`click`, (e?: any): any => {
      e.stopPropagation();
      this._toggleMenu();
    });
    this._menuOutsideHandler = (e?: any): any => {
      this._menu.contains(e.target) || this._closeMenu();
    };
    this._menuKeyHandler = (e?: any): any => {
      e.key === `Escape` && this._closeMenu();
    };
  }
  _toggleMenu(): any {
    this._menuDropdown.classList.contains(`is-open`)
      ? this._closeMenu()
      : this._openMenu();
  }
  _openMenu(): any {
    this._menuDropdown.classList.add(`is-open`);
    this.menuBtn.setAttribute(`aria-expanded`, `true`);
    document.addEventListener(`pointerdown`, this._menuOutsideHandler, !0);
    document.addEventListener(`keydown`, this._menuKeyHandler);
  }
  _closeMenu(): any {
    !this._menuDropdown ||
      !this._menuDropdown.classList.contains(`is-open`) ||
      (this._menuDropdown.classList.remove(`is-open`),
      this.menuBtn.setAttribute(`aria-expanded`, `false`),
      document.removeEventListener(`pointerdown`, this._menuOutsideHandler, !0),
      document.removeEventListener(`keydown`, this._menuKeyHandler));
  }
  _createAudioToggle(): any {
    let e: any = 1.6,
      t: any = (t?: any): any => {
        let n: any = ``;
        for (let r: any = 0; r < 11; r++) {
          let i: any = e + (r / 10) * (20 - 2 * e),
            a: any =
              t === null ? 6 : 6 - 3 * Math.sin((2 * Math.PI * i) / 16 + t);
          n += `${i.toFixed(2)},${a.toFixed(2)} `;
        }
        return n.trim();
      },
      n: any = t(null),
      r: any = ``;
    for (let e: any = 0; e <= 12; e++)
      r += t((e / 12) * Math.PI * 2) + (e < 12 ? `; ` : ``);
    let i: any = `<svg class="hud-audio-icon" width="22" height="13" viewBox="0 0 20 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <g class="hud-audio-wave-wrap">
        <polyline class="hud-audio-wave" points="${n}" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round">
          <animate attributeName="points" dur="1.2s" begin="indefinite" repeatCount="indefinite" calcMode="linear" values="${r}" />
        </polyline>
      </g>
    </svg>`;
    this.audioBtn = document.createElement(`button`);
    this.audioBtn.className = `hud-audio-btn`;
    this.audioBtn.setAttribute(`aria-label`, `Toggle audio`);
    this.audioBtn.setAttribute(`aria-pressed`, `true`);
    this.audioBtn.innerHTML = i;
    this._audioWaveAnim = this.audioBtn.querySelector(`animate`);
    this._audioWaveRunning = !1;
    this._audioFlattenTimer = null;
    this.audioBtn.addEventListener(`click`, (): any => this._toggleAudio());
    this._syncAudioBtnState = (): any => {
      let e: any = audioManager.isArmed() && audioManager.isEnabled();
      this.audioBtn.classList.toggle(`is-playing`, e);
      this.audioBtn.setAttribute(
        `aria-pressed`,
        audioManager.isEnabled() ? `true` : `false`,
      );
      let t: any =
          window.matchMedia &&
          window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,
        n: any = e && !t;
      if (!(!this._audioWaveAnim || n === this._audioWaveRunning))
        if (
          ((this._audioWaveRunning = n),
          (this._audioFlattenTimer &&=
            (clearTimeout(this._audioFlattenTimer), null)),
          n)
        )
          try {
            this._audioWaveAnim.beginElement();
          } catch {}
        else
          this._audioFlattenTimer = setTimeout((): any => {
            try {
              this._audioWaveAnim.endElement();
            } catch {}
            this._audioFlattenTimer = null;
          }, 420);
    };
    window.addEventListener(`audio:statechange`, this._syncAudioBtnState);
    this._syncAudioBtnState();
  }
  _toggleAudio(): any {
    audioManager.setEnabled(!audioManager.isEnabled());
  }
  updateLoader(e?: any): any {
    let t: any = Math.max(99 - Math.floor(e * 33) * 3, 0);
    this.loader.container.setAttribute(`aria-valuenow`, String(t));
    let n: any = [0, Math.floor(t / 10) % 10, t % 10];
    for (let e: any = 1; e < 3; e++)
      n[e] !== this.loader.lastDigits[e] &&
        ((this.loader.lastDigits[e] = n[e]),
        gsap.to(this.loader.digits[e], {
          yPercent: -n[e] * 10,
          duration: 0.5,
          ease: `power2.out`,
          overwrite: !0,
        }));
  }
  onLoadComplete(): any {
    this._loaderWidth ||= this.loader.container.offsetWidth;
    let e: any = this.loader.container.querySelector(`.loader-degree`);
    e && (e.style.display = `none`);
    let t: any = document.createElement(`img`);
    t.src = `assets/brand/nav_logo_white.svg`;
    t.alt = `ZERO`;
    t.className = `loader-logo`;
    gsap.set(t, {
      opacity: 0,
      x: -30,
    });
    let n: any = gsap.timeline();
    n.to(this.loader.text, {
      x: 30,
      opacity: 0,
      duration: 0.5,
      ease: `power2.in`,
      onComplete: (): any => {
        this.loader.text.innerHTML = ``;
        this.loader.text.appendChild(t);
        gsap.set(this.loader.text, {
          x: 0,
          opacity: 1,
        });
      },
    });
    n.to(t, {
      opacity: 1,
      x: 0,
      duration: 0.5,
      ease: `power2.out`,
    });
    n.to(this.loader.container, {
      x: -this._loaderWidth - 40,
      opacity: 0,
      duration: 0.8,
      delay: 2,
      ease: `power3.in`,
      onComplete: (): any => {
        this.loader.container.style.display = `none`;
      },
    });
    this._loaderTl = n;
  }
  showNavbar(): any {
    this._leftGroup.style.display = `flex`;
    this._rightGroup.style.display = `flex`;
    this._logoVisible = !0;
    let e: any = [this._leftGroup, this._rightGroup];
    gsap.fromTo(
      e,
      {
        y: -28,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: `back.out(1.5)`,
        stagger: 0.1,
        clearProps: `transform`,
      },
    );
  }
  _createNextStageButton(): any {
    this.nextStageButton = new HoldButton(this.container);
    this.nextStageBtn = this.nextStageButton.btn;
  }
  showNextStageButton(e?: any): any {
    this.nextStageButton.show(e);
  }
  hideNextStageButton(): any {
    this.nextStageButton.hide();
  }
  fadeOutNextStageButton(): any {
    this.nextStageButton.fadeOut();
  }
  fadeInNextStageButton(): any {
    this.nextStageButton.fadeIn();
  }
  setNextStageButtonProgress(e?: any): any {
    this.nextStageButton.setProgress(e);
  }
  resetNextStageButtonProgress(): any {
    this.nextStageButton.resetProgress();
  }
  setPageTheme(e?: any): any {
    let t: any = e === `black`;
    this.container.classList.toggle(`nav-black`, t);
    document.body.classList.toggle(`nav-black`, t);
  }
  updateStatus(e?: any, t: any = {}): any {
    this._statusLabel.innerText = e;
    this.statusText.classList.toggle(`has-chevron`, t.chevron === !0);
  }
  hideStatus(e?: any): any {
    gsap.killTweensOf(this.statusText, `opacity`);
    let t: any = {
      opacity: 0,
    };
    typeof e == `number` && (t.duration = e);
    gsap.to(this.statusText, t);
  }
  showStatus(): any {
    gsap.killTweensOf(this.statusText, `opacity`);
    gsap.to(this.statusText, {
      opacity: 1,
      duration: 0.6,
      delay: 0.3,
    });
  }
  showScrollIndicator(): any {
    gsap.killTweensOf(this.scrollIndicator, `opacity`);
    gsap.to(this.scrollIndicator, {
      opacity: 1,
      duration: 0.6,
      delay: 0.3,
    });
  }
  hideScrollIndicator(e?: any): any {
    gsap.killTweensOf(this.scrollIndicator, `opacity`);
    let t: any = {
      opacity: 0,
    };
    typeof e == `number` && (t.duration = e);
    gsap.to(this.scrollIndicator, t);
  }
  dispose(): any {
    this._removeClickListener();
    this._closeMenu();
    this._syncAudioBtnState &&=
      (window.removeEventListener(`audio:statechange`, this._syncAudioBtnState),
      null);
    this._audioFlattenTimer &&= (clearTimeout(this._audioFlattenTimer), null);
    this._popup &&=
      (document.removeEventListener(`keydown`, this._popupKeyHandler),
      gsap.killTweensOf([this._popup, this._popupModal]),
      this._popup.remove(),
      null);
    this._loaderTl &&= (this._loaderTl.kill(), null);
    gsap.killTweensOf([
      this.loader.container,
      this.statusText,
      this.scrollIndicator,
      this._leftGroup,
      this._rightGroup,
      this.nextStageBtn,
    ]);
    this.container && (this.container.innerHTML = ``);
  }
};
var Dg: any = 5.76;
var Og: any = 0.9;
var kg: any = 0.35;
var Ag: any = 1;
var jg: any = 20;
var Mg: any = 2e3;
export { Hud, Dg, Og, kg, Ag, jg, Mg };
