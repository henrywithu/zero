// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { aw } from "./JoinFormStyles.ts";
import { cw } from "./FormValidation.ts";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { audioManager } from "../audio/AudioManager.ts";
import { Iw } from "../services/waitlistState.ts";
var Lw: any = `/`;
var Rw: any = 110;
var zw: any = window.innerWidth <= 768 ? 10 : 120;
var Bw: any = 0.65;
var Vw: any = 0.45;
var Hw: any = [
  {
    value: `university`,
    label: `I’m exploring`,
  },
  {
    value: `graduate`,
    label: `I’m creating`,
  },
  {
    value: `other`,
    label: `I’m just curious`,
  },
];
var Uw: any = `university`;
function Ww(this: any, e: any = `Join`): any {
  let t: any = document.createElement(`button`);
  t.className = `jf-submit-btn`;
  t.type = `submit`;
  t.style.cssText = `
    align-self: flex-start;
    width: 162px;
    padding: 0 2px 4.5px;
    margin: -12px 0 0 0;
    background: #b7b7b7;
    border: none;
    border-radius: 36px;
    box-shadow: inset 0 -1.5px 0 0 #e8e8e8;
    transition: transform 0.28s ease;
    cursor: pointer;
    box-sizing: border-box;
    display: block;
    user-select: none;
    -webkit-user-select: none;
  `;
  t.innerHTML = `
    <span style="
      display: block;
      background: #030303;
      padding: 0 0.75px 2px;
      border-radius: 43px;
      box-sizing: border-box;
    ">
      <span style="
        display: block;
        background: #1f1f1f;
        border: 0.2px solid #000;
        padding-bottom: 3.2px;
        border-radius: 24px;
        box-sizing: border-box;
      ">
        <span style="
          display: flex; align-items: center; justify-content: center;
          background: #393939;
          padding: 11.5px 16px;
          border-radius: 42px;
          box-shadow: inset 0 -1px 0 0 #414141;
          color: #fcfcfc;
          font-family: 'Inter', 'Google Sans Code', sans-serif;
          font-weight: 500;
          font-size: 19px;
          letter-spacing: -0.38px;
          line-height: 1;
          box-sizing: border-box;
        ">${e}</span>
      </span>
    </span>
  `;
  return t;
}
function Gw(this: any): any {
  let e: any = document.createElement(`div`);
  e.className = `jf-panel`;
  e.style.cssText = `
    position: fixed;
    left: 10px;
    right: 10px;
    top: ${zw}px;
    bottom: 10px;
    z-index: 150;
    background: #fff;
    border-radius: 32px;
    box-shadow: inset 0 -170px 250px 0 rgba(178, 255, 196, 0.5);
    pointer-events: none;
    opacity: 0;
    will-change: transform, opacity;
    transform: translateY(100%);
    overflow: hidden;
  `;
  e.innerHTML = `
    <button class="jf-close" type="button" aria-label="Close" style="
      position: absolute; right: 40px; top: 40px;
      width: 50px; height: 50px; border-radius: 50%;
      background: rgba(255,255,255,0.6);
      border: 1px solid rgba(0,0,0,0.1);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Inter', sans-serif; font-size: 22px; line-height: 1;
      color: #1f1d1e;
      pointer-events: auto;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      transition: background 0.2s ease;
      z-index: 2;
    ">×</button>

    <div class="jf-content" style="
      position: absolute; left: 50%; top: 50%;
      transform: translate(-50%, -55%);
      width: min(1191px, 88vw);
      display: flex; gap: 80px;
      pointer-events: auto;
      align-items: flex-start;
    ">
      <div class="jf-col-heading" style="
        flex: 1; min-width: 0;
        display: flex; flex-direction: column;
        gap: 60px;
      ">
        <p class="jf-heading" style="
          margin: 0;
          font-family: 'Bethany Elingston', 'Dancing Script', cursive;
          font-weight: 400; font-size: 48px; line-height: 1.2;
          color: #000; max-width: 390px;
        ">Make room for wonder.</p>
        <img
          class="jf-plant"
          src="${Lw}assets/ui/plant.webp"
          alt=""
          style="
            width: 77px; height: auto;
            display: block;
            user-select: none;
            -webkit-user-drag: none;
          "
        />
      </div>

      <form class="jf-form" style="
        flex: 1; min-width: 0;
        display: flex; flex-direction: column; gap: 24px;
      " novalidate>
        ${Jw(`name`, `your name`, {
          autocomplete: `name`,
          required: !0,
          maxlength: 50,
        })}
        ${Jw(`age`, `your age (optional)`, {
          autocomplete: `off`,
          required: !1,
          inputmode: `numeric`,
          maxlength: 3,
        })}
        ${Jw(`city`, `your city (optional)`, {
          autocomplete: `address-level2`,
          required: !1,
          maxlength: 60,
        })}
        ${Yw(`education`, `your creative practice (optional)`, Hw, !1)}
        ${Jw(`university`, `your studio, school, or space (optional)`, {
          autocomplete: `organization`,
          maxlength: 80,
        })}
        ${Xw(`notes`, `What would you like to imagine next? (optional)`)}

        <div class="jf-status" style="
          margin: 0;
          font-family: 'Inter', sans-serif; font-size: 14px;
          line-height: 1.4; min-height: 20px;
          color: #c41010;
          text-align: right;
        "></div>
      </form>
    </div>

    <div class="jf-success" style="
      position: absolute; inset: 0;
      display: none;
      align-items: center; justify-content: center;
      flex-direction: column; gap: 24px;
      text-align: center;
      pointer-events: auto;
      padding: 40px;
    ">
      <p style="
        margin: 0;
        font-family: 'Bethany Elingston', 'Dancing Script', cursive;
        font-weight: 400; font-size: 64px; line-height: 1.2;
        color: #000; max-width: 700px;
      ">Your wonder, folded.</p>
      <p style="
        margin: 0;
        font-family: 'Inter', sans-serif; font-size: 18px;
        line-height: 1.5; color: rgba(0,0,0,0.6); max-width: 480px;
      ">Your keepsake is saved in this browser. Visit Trapnest’s journal for new worlds and stories.</p>
    </div>
  `;
  return e;
}
var Kw: any = `
  width: 100%; border: none; outline: none;
  background: transparent; color: #000;
  font-family: 'Bethany Elingston', 'Dancing Script', cursive;
  font-weight: 400; font-size: 24px; line-height: 1.45;
  padding: 0;
`;
var qw: any = `height: 1px; background: rgba(0,0,0,0.3); width: 100%; transition: background 0.2s;`;
function Jw(this: any, e?: any, t?: any, n: any = {}, r: any = {}): any {
  let {
    type: i = `text`,
    required: a = !1,
    autocomplete: o,
    inputmode: s,
    maxlength: c,
  } = n;
  return `
    <div class="jf-field" data-field="${e}" style="display: ${r.hidden ? `none` : `flex`}; flex-direction: column; gap: 14px; width: 100%;">
      <input
        class="jf-input"
        name="${e}"
        type="${i}"
        ${a ? `required` : ``}
        placeholder="${t}"
        ${o ? `autocomplete="${o}"` : ``}
        ${s ? `inputmode="${s}"` : ``}
        ${c ? `maxlength="${c}"` : ``}
        style="${Kw}"
      />
      <div class="jf-underline" style="${qw}"></div>
    </div>
  `;
}
function Yw(this: any, e?: any, t?: any, n?: any, _required?: boolean): any {
  return `
    <div class="jf-field" data-field="${e}" style="display: flex; flex-direction: column; gap: 14px; width: 100%;">
      <div class="jf-select">
        <input type="hidden" name="${e}" value="" />
        <button
          type="button"
          class="jf-select-trigger"
          aria-haspopup="listbox"
          aria-expanded="false"
          style="${Kw} display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; text-align: left;"
        >
          <span class="jf-select-value is-placeholder">${t}</span>
          <span class="jf-select-caret" aria-hidden="true"></span>
        </button>
        <ul class="jf-select-menu" role="listbox">${n.map((e?: any): any => `<li class="jf-select-option" role="option" data-value="${e.value}">${e.label}</li>`).join(``)}</ul>
      </div>
      <div class="jf-underline" style="${qw}"></div>
    </div>
  `;
}
function Xw(this: any, e?: any, t?: any): any {
  return `
    <div class="jf-field" data-field="${e}" style="display: flex; flex-direction: column; gap: 14px; width: 100%;">
      <textarea
        class="jf-input jf-textarea"
        name="${e}"
        rows="2"
        placeholder="${t}"
        style="
          width: 100%; border: none; outline: none; resize: none;
          background: transparent; color: #000;
          font-family: 'Bethany Elingston', 'Dancing Script', cursive;
          font-weight: 400; font-size: 24px; line-height: 1.45;
          padding: 0;
        "
      ></textarea>
      <div class="jf-underline" style="${qw}"></div>
    </div>
  `;
}
function createJoinForm(
  this: any,
  {
    frameEl: e,
    email: t = ``,
    autoOpen: n = !1,
    onCloseStart: r = null,
    onClose: i = null,
    onSubmitSuccess: a = null,
    initialFormData: o = null,
    hideStep1Content: s = !1,
    onFormDataChange: c = null,
    muffleFloor: l = 0,
  }: any = {},
): any {
  aw();
  let u: any = (t || ``).toString().trim(),
    d: any = Gw();
  document.body.appendChild(d);
  let f: any = d.querySelector(`.jf-close`),
    p: any = d.querySelector(`.jf-form`),
    m: any = d.querySelector(`.jf-status`),
    h: any = d.querySelector(`.jf-content`),
    g: any = d.querySelector(`.jf-success`),
    _: any = Ww(`Save keepsake`);
  p.appendChild(_);
  let v: any = p.querySelector(`[data-field="education"]`),
    y: any = v.querySelector(`.jf-select`),
    b: any = v.querySelector(`input[name="education"]`),
    x: any = v.querySelector(`.jf-select-trigger`),
    S: any = v.querySelector(`.jf-select-value`),
    C: any = v.querySelector(`.jf-select-menu`),
    w: any = v.querySelector(`.jf-underline`),
    T: any = p
      .querySelector(`[data-field="university"]`)
      .querySelector(`input`);
  function E(this: any, _animate?: boolean): any {
    T.removeAttribute(`required`);
  }
  if (o)
    for (let e of p.querySelectorAll(`input, select, textarea`)) {
      let t: any = o[e.name];
      typeof t == `string` && t.length && (e.value = t);
    }
  E(!1);
  let D: any = (): any => {
      c && c(Object.fromEntries(new FormData(p).entries()));
    },
    O: any = (e?: any): any => {
      if (e && e.classList && e.classList.contains(`jf-input`)) {
        let t: any = e.closest(`.jf-field`),
          n: any = t && t.querySelector(`.jf-underline`);
        n && n.classList.remove(`is-invalid`);
      }
    };
  p.addEventListener(`input`, (e?: any): any => {
    O(e.target);
    D();
  });
  p.addEventListener(`change`, (e?: any): any => {
    O(e.target);
    D();
  });
  function k(this: any): any {
    let e: any = Hw.find((e?: any): any => e.value === b.value);
    e
      ? ((S.textContent = e.label), S.classList.remove(`is-placeholder`))
      : S.classList.add(`is-placeholder`);
    C.querySelectorAll(`.jf-select-option`).forEach((e?: any): any => {
      e.classList.toggle(`is-selected`, e.dataset.value === b.value);
    });
  }
  let A: any = (): any => {
      y.classList.add(`is-open`);
      x.setAttribute(`aria-expanded`, `true`);
    },
    j: any = (): any => {
      y.classList.remove(`is-open`);
      x.setAttribute(`aria-expanded`, `false`);
    };
  x.addEventListener(`click`, (e?: any): any => {
    e.preventDefault();
    e.stopPropagation();
    y.classList.contains(`is-open`) ? j() : A();
  });
  C.addEventListener(`click`, (e?: any): any => {
    let t: any = e.target.closest(`.jf-select-option`);
    t &&
      ((b.value = t.dataset.value),
      k(),
      w && w.classList.remove(`is-invalid`),
      j(),
      E(!0),
      b.dispatchEvent(new Event(`change`)),
      F && F.refresh(`university`),
      D());
  });
  let M: any = (e?: any): any => {
      y.contains(e.target) || j();
    },
    N: any = (e?: any): any => {
      e.key === `Escape` && j();
    };
  document.addEventListener(`click`, M);
  document.addEventListener(`keydown`, N);
  k();
  let P: any = /^[\p{L}][\p{L}\s'’.-]*$/u,
    F: any = cw(p, {
      name: {
        required: !0,
        min: 2,
        max: 50,
        pattern: P,
      },
      age: {
        required: !1,
        pattern: /^\d{1,3}$/,
        validate: (e?: any): any => !e || (+e >= 5 && +e <= 120),
      },
      city: {
        required: !1,
        min: 2,
        max: 60,
        pattern: P,
      },
      education: {
        required: !1,
      },
      university: {
        required: !1,
        min: 2,
        max: 80,
        pattern: P,
      },
      notes: {
        required: !1,
        min: 3,
      },
    });
  o && F.refreshAll();
  function I(this: any, e?: any): any {
    let t: any = p.querySelector(`[name="${e}"]`),
      n: any = t && t.closest(`.jf-field`),
      r: any = n && n.querySelector(`.jf-underline`);
    r &&
      (r.classList.remove(`is-invalid`),
      r.offsetWidth,
      r.classList.add(`is-invalid`));
  }
  s &&
    ((h.style.display = `none`),
    (h.style.opacity = `0`),
    (h.style.pointerEvents = `none`));
  let L: any = !1,
    R: any = !1,
    z: any = null,
    ee: any = null,
    te: any = null,
    ne: any = !!s,
    re: any = d.querySelector(`.jf-heading`),
    ie: any = d.querySelector(`.jf-plant`),
    ae: any = [...d.querySelectorAll(`.jf-field`), _];
  function B(this: any): any {
    z && z.kill();
    e && (ee = e.style.bottom);
    let t: any = window.innerHeight,
      n: any = t - Rw;
    z = gsap.timeline();
    e &&
      ((e.style.top = e.style.top || `10px`),
      (e.style.left = e.style.left || `10px`),
      (e.style.right = e.style.right || `10px`));
    let r: any = t - zw;
    d.style.transform = `translateY(${r}px)`;
    d.style.pointerEvents = `auto`;
    d.style.opacity = `1`;
    let i: any = e ? parseFloat(e.style.bottom || `10`) : 0,
      a: any = n;
    z.to(
      {
        p: 0,
      },
      {
        p: 1,
        duration: Bw,
        ease: `power3.out`,
        onUpdate: function (this: any): any {
          let t: any = this.targets()[0].p;
          e && (e.style.bottom = `${i + (a - i) * t}px`);
          d.style.transform = `translateY(${(1 - t) * r}px)`;
        },
      },
      0.05,
    );
    te && te.revert();
    te = new SplitText(re, {
      type: `lines,words`,
      linesClass: `jf-line`,
      mask: `lines`,
    });
    z.from(
      te.words,
      {
        yPercent: 110,
        opacity: 0,
        duration: 0.7,
        stagger: 0.045,
        ease: `power3.out`,
      },
      0.35,
    );
    ie &&
      z.from(
        ie,
        {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: `power2.out`,
          clearProps: `transform,opacity`,
        },
        0.65,
      );
    let o: any = _.style.transition;
    _.style.transition = `none`;
    z.from(
      ae,
      {
        y: 36,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: `power2.out`,
        clearProps: `transform,opacity`,
        onComplete: (): any => {
          _.style.transition = o;
          E(!1);
        },
      },
      0.55,
    );
    z.add((): any => {
      let e: any = p.querySelector(`input, select, textarea`);
      e &&
        e.focus({
          preventScroll: !0,
        });
    }, Bw * 0.7);
  }
  function oe(this: any): any {
    z && z.kill();
    r && r();
    let t: any = gsap.timeline(),
      n: any = window.innerHeight - zw,
      a: any = e ? parseFloat(e.style.bottom || `0`) : 0,
      o: any = parseFloat(ee) || 10;
    t.to(
      {
        p: 0,
      },
      {
        p: 1,
        duration: Vw,
        ease: `power3.in`,
        onUpdate: function (this: any): any {
          let t: any = this.targets()[0].p;
          e && (e.style.bottom = `${a + (o - a) * t}px`);
          d.style.transform = `translateY(${t * n}px)`;
        },
        onComplete: (): any => {
          d.style.pointerEvents = `none`;
        },
      },
      0,
    );
    t.add((): any => {
      te &&= (te.revert(), null);
      i && i();
    }, Vw);
  }
  function se(this: any): any {
    L ||
      ((L = !0),
      audioManager.play(`whoosh`),
      audioManager.setMuffle(1),
      window.dispatchEvent(new CustomEvent(`zero:waitlistFormOpen`)),
      V(),
      B());
  }
  function ce(this: any): any {
    L &&
      ((L = !1),
      audioManager.play(`whoosh`),
      audioManager.setMuffle(l),
      window.dispatchEvent(new CustomEvent(`zero:waitlistFormClose`)),
      oe());
  }
  function V(this: any): any {
    R ||
      ((m.textContent = ``),
      (m.style.color = `#c41010`),
      (g.style.display = `none`),
      ne ||
        ((h.style.display = `flex`),
        (h.style.opacity = `1`),
        (h.style.pointerEvents = ``)),
      le(ne ? `success` : `idle`));
  }
  function le(this: any, e?: any): any {
    let t: any = _.querySelector(`span > span > span`);
    e === `loading`
      ? (_.classList.remove(`is-success`),
        _.classList.add(`is-loading`),
        (_.disabled = !0),
        (t.innerHTML = `<span class="jf-spinner" aria-hidden="true"></span>`))
      : e === `success`
        ? (_.classList.remove(`is-loading`),
          _.classList.add(`is-success`),
          (_.disabled = !0),
          (t.textContent = `Saved`))
        : (_.classList.remove(`is-loading`, `is-success`),
          (_.disabled = !1),
          (t.textContent = `Save keepsake`));
  }
  async function ue(this: any): Promise<any> {
    if (R) return;
    let e: any = Object.fromEntries(new FormData(p).entries()),
      t: any = (e.name || ``).toString().trim(),
      n: any = (e.age || ``).toString().trim(),
      r: any = (e.city || ``).toString().trim(),
      i: any = (e.education || ``).toString().trim(),
      o: any = (e.university || ``).toString().trim(),
      s: any = (e.notes || ``).toString().trim(),
      c: any = (e?: any, t?: any): any => {
        m.style.color = `#c41010`;
        m.textContent = e;
        I(t);
      };
    if (!t) return c(`Please enter your name.`, `name`);
    R = !0;
    m.textContent = ``;
    le(`loading`);
    let [l] = await Promise.all([
      Iw({
        email: u,
        name: t,
        age: n,
        city: r,
        education: i,
        university: o,
        notes: s,
      }),
      new Promise((e?: any): any => setTimeout(e, 2e3)),
    ]);
    if (((R = !1), !l.ok)) {
      le(`idle`);
      m.style.color = `#c41010`;
      m.textContent = l.error || `Something went wrong. Try again.`;
      return;
    }
    le(`success`);
    gsap.to(h, {
      opacity: 0,
      duration: 1,
      delay: 0.6,
      ease: `power2.inOut`,
      onComplete: (): any => {
        h.style.pointerEvents = `none`;
        h.style.display = `none`;
        ne = !0;
        a &&
          a({
            panel: d,
            asset: l.asset,
            position: l.position,
          });
      },
    });
  }
  f.addEventListener(`click`, ce);
  p.addEventListener(`submit`, (e?: any): any => {
    e.preventDefault();
    ue();
  });
  let H: any = (e?: any): any => {
    e.key === `Escape` && L && ce();
  };
  document.addEventListener(`keydown`, H);
  let U: any = (): any => {
    L && e && (e.style.bottom = `${window.innerHeight - Rw}px`);
  };
  window.addEventListener(`resize`, U);
  function de(this: any): any {
    z && z.kill();
    te &&= (te.revert(), null);
    document.removeEventListener(`keydown`, H);
    document.removeEventListener(`click`, M);
    document.removeEventListener(`keydown`, N);
    window.removeEventListener(`resize`, U);
    d.remove();
    e && ee !== null && (e.style.bottom = ee);
  }
  n && requestAnimationFrame((): any => se());
  return {
    open: se,
    close: ce,
    destroy: de,
    isOpen: (): any => L,
    panel: d,
  };
}
export {
  Lw,
  Rw,
  zw,
  Bw,
  Vw,
  Hw,
  Uw,
  Ww,
  Gw,
  Kw,
  qw,
  Jw,
  Yw,
  Xw,
  createJoinForm,
};
