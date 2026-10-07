// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { CanvasTexture, SRGBColorSpace, RepeatWrapping } from "three";
function yD(this: any): any {
  let e: any = 2048,
    t: any = document.createElement(`canvas`);
  t.width = e;
  t.height = 256;
  let n: any = t.getContext(`2d`);
  n.clearRect(0, 0, e, 256);
  n.fillStyle = `#327032`;
  n.textAlign = `center`;
  n.textBaseline = `middle`;
  n.font = `108px 'PP Supply Mono', 'Supply Sans', monospace`;
  `letterSpacing` in n && (n.letterSpacing = `4px`);
  let r: any = 0.7,
    i: any = 1 / r;
  n.scale(r, 1);
  let a: any = `KEEP THE WONDER`;
  n.fillText(a, e * 0.25 * i, 256 * 0.52);
  n.fillText(a, e * 0.75 * i, 256 * 0.52);
  n.fillText(`•`, e * 0.5 * i, 256 * 0.5);
  n.fillText(`•`, 0, 256 * 0.5);
  n.fillText(`•`, e * i, 256 * 0.5);
  let o: any = new CanvasTexture(t);
  o.colorSpace = SRGBColorSpace;
  o.anisotropy = 4;
  o.wrapS = RepeatWrapping;
  o.repeat.x = -1;
  o.needsUpdate = !0;
  return o;
}
var bD: any = 0.64;
var xD: any = 1.5;
var SD: any = !1;
function CD(this: any): any {
  if (SD) return;
  SD = !0;
  let e: any = document.createElement(`style`);
  e.dataset.mapPanel = `1`;
  e.textContent = `
    .map-panel .mp-chip {
      height: 30px; border-radius: 45px; background: #f7f4f2;
      display: inline-flex; align-items: center; justify-content: center;
      gap: 5px; padding: 0 10px; box-sizing: border-box;
      font-size: 12px; font-weight: 500; letter-spacing: -0.01em;
      line-height: 1; color: #1f1d1e; white-space: nowrap;
    }
    .map-panel .mp-chip img {
      height: 15px; width: auto; max-width: 18px;
      object-fit: contain; display: block; flex-shrink: 0;
    }
    .map-panel .mp-join {
      transition: transform 0.12s ease, filter 0.12s ease;
    }
    .map-panel .mp-join:hover { filter: brightness(1.12); }
    .map-panel .mp-join:active { transform: scale(0.975); }
    @media (max-width: 768px) {
      .map-panel .mp-hero { height: 180px !important; }
    }
  `;
  document.head.appendChild(e);
}
var wD: any = (): any => (window.innerWidth <= 768 ? 0.8 : 1);
function createCompanyPopup(this: any, { onJoin: e }: any = {}): any {
  CD();
  let t: any = document.createElement(`div`);
  t.className = `map-panel`;
  let n: any = `'Google Sans Flex', 'Google Sans Code', sans-serif`;
  t.style.cssText = `
    position: fixed; left: 0; top: 0; width: min(404px, 88vw);
    color: #000; padding: 10px; box-sizing: border-box;
    background: #fff; border-radius: 32px;
    box-shadow: 0 24px 60px -12px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.16);
    opacity: 0; pointer-events: none;
    transform: translate(-50%, -50%) scale(${wD() * 0.95});
    transform-origin: center;
    transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 100; font-family: ${n}; text-align: center;
    display: flex; flex-direction: column; gap: 20px;
  `;
  t.innerHTML = `
    <div class="mp-hero" style="position:relative;height:210px;border-radius:26px;overflow:hidden;flex-shrink:0;box-sizing:border-box;padding:10px;display:flex;align-items:flex-start;justify-content:flex-start;background:linear-gradient(155deg,#efeae6 0%,#ddd6cf 100%)">
      <!-- Journal imagery is editorial content; the optional video slot retains its existing playback behavior. -->
      <img data-project-image alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;" />
      <video class="mp-hero-media" data-hero-media playsinline preload="auto" poster="/assets/ui/company_card_dummy.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;"></video>
      <div class="mp-logo" style="position:relative;z-index:1;display:inline-flex;gap:8px;align-items:center;justify-content:center;height:38px;padding:0 7px;border-radius:40px;background:#ffffff;box-shadow:0 1px 6px rgba(0,0,0,0.12);box-sizing:border-box">
        <span data-project-name style="font-family:'PP Supply Mono',monospace;font-size:11px;letter-spacing:0.04em"></span><img data-company-logo style="height:26px;max-width:40px;object-fit:contain;display:block" alt="" />
      </div>
    </div>
    <div class="mp-role" style="display:flex;align-items:center;justify-content:center;padding:0 4px">
      <span data-role style="font-family:'PP Supply Mono', 'Supply Sans', monospace;font-size:13px;letter-spacing:-0.01em;line-height:140%;text-transform:uppercase;opacity:0.5;text-align:left"></span>
    </div>
    <div data-scenario style="font-size:24px;letter-spacing:-0.03em;line-height:110%;font-weight:500;color:#1f1d1e;padding:0 12px"></div>
    <div data-desc style="font-size:15px;letter-spacing:-0.01em;line-height:135%;font-weight:400;color:#565254;padding:0 16px"></div>
    <div class="mp-tools" style="display:flex;align-items:center;justify-content:center;padding:6px 12px">
      <div data-tools style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;align-content:center;gap:6px;max-width:100%"></div>
    </div>
    <a class="mp-join" data-join target="_blank" rel="noopener noreferrer" style="align-self:stretch;display:flex;align-items:center;justify-content:center;gap:10px;text-decoration:none;border:none;cursor:pointer;border-radius:1326px;background:linear-gradient(180deg,#323232,#222);color:#fcfcfc;font-family:${n};font-size:20px;font-weight:500;letter-spacing:-0.02em;padding:15px 30px;box-shadow:0px 0.98px 1.96px rgba(255,255,255,0.15) inset, 0px 3.92px 7.84px -1.96px rgba(13,13,13,0.5), 0px -1.96px 2.35px 0.69px #121212 inset">Read the story <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 13 13 3M3 3h10v10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
  `;
  t.addEventListener(`pointerdown`, (e?: any): any => e.stopPropagation());
  t.addEventListener(`pointerup`, (e?: any): any => e.stopPropagation());
  t.querySelector(`[data-join]`).addEventListener(`click`, (t?: any): any => {
    t.stopPropagation();
    // The project link opens its source journal; existing scene input remains isolated.
  });
  document.body.appendChild(t);
  return t;
}
export { yD, bD, xD, SD, CD, wD, createCompanyPopup };
