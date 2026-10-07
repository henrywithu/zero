// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
var ow: any = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none"><path opacity="0.1" d="M12 3C16.971 3 21 7.029 21 12C21 16.971 16.971 21 12 21C7.029 21 3 16.971 3 12C3 7.029 7.029 3 12 3Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 3C16.971 3 21 7.029 21 12C21 16.971 16.971 21 12 21C7.029 21 3 16.971 3 12C3 7.029 7.029 3 12 3Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 12.5V7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.996 14.5C11.444 14.5 10.996 14.948 11 15.5C11 16.052 11.448 16.5 12 16.5C12.552 16.5 13 16.052 13 15.5C13 14.948 12.552 14.5 11.996 14.5Z" fill="currentColor"></path></svg>`;
var sw: any = 5e3;
function cw(this: any, e?: any, t?: any, { spamGuard: n = !0 }: any = {}): any {
  let r: any = Date.now(),
    i: any = new Map(),
    a: any = (): any => Object.fromEntries(new FormData(e).entries()),
    o: any = (e?: any, t?: any): any =>
      typeof e.required == `function` ? e.required(t) : !!e.required;
  function s(this: any, e?: any): any {
    let n: any = t[e],
      r: any = a(),
      i: any = (r[e] || ``).toString().trim(),
      s: any = o(n, r);
    return i
      ? !(
          (n.min && i.length < n.min) ||
          (n.max && i.length > n.max) ||
          (n.pattern && !n.pattern.test(i)) ||
          (n.validate && !n.validate(i, r))
        )
      : s
        ? !1
        : null;
  }
  function c(this: any, e?: any): any {
    let t: any = i.get(e);
    if (!t) return;
    let n: any = (a()[e] || ``).toString().trim(),
      r: any = s(e);
    t.fieldEl.classList.toggle(`is--filled`, !!n);
    r === !0
      ? (t.fieldEl.classList.add(`is--success`),
        t.fieldEl.classList.remove(`is--error`))
      : r === null
        ? t.fieldEl.classList.remove(`is--success`, `is--error`)
        : (t.fieldEl.classList.remove(`is--success`),
          t.fieldEl.classList.toggle(`is--error`, t.started));
  }
  function l(this: any, e?: any): any {
    let t: any = i.get(e);
    t && (!t.started && s(e) === !0 && (t.started = !0), c(e));
  }
  function u(this: any, e?: any): any {
    let t: any = i.get(e);
    t && ((a()[e] || ``).toString().trim() && (t.started = !0), c(e));
  }
  for (let n of Object.keys(t)) {
    let t: any = e.querySelector(`[name="${n}"]`);
    if (!t) continue;
    let r: any = t.closest(`.jf-field`);
    if (r) {
      if (!r.querySelector(`.jf-valid-icon`)) {
        let e: any = document.createElement(`div`);
        e.className = `jf-valid-icon is--error`;
        e.innerHTML = ow;
        r.append(e);
      }
      i.set(n, {
        fieldEl: r,
        control: t,
        started: !1,
      });
      t.type === `hidden`
        ? t.addEventListener(`change`, (): any => {
            let e: any = i.get(n);
            e.started = !0;
            c(n);
          })
        : (t.addEventListener(`input`, (): any => l(n)),
          t.addEventListener(`blur`, (): any => u(n)));
    }
  }
  return {
    refresh(this: any, e?: any): any {
      c(e);
    },
    refreshAll(this: any): any {
      for (let e of i.keys()) c(e);
    },
    validateAll(this: any): any {
      let e: any = null;
      for (let [t, n] of i) {
        n.started = !0;
        c(t);
        s(t) === !1 && !e && (e = t);
      }
      if (e) {
        let t: any = i.get(e).control;
        t &&
          t.type !== `hidden` &&
          t.focus({
            preventScroll: !0,
          });
      }
      return {
        valid: !e,
        firstInvalid: e,
      };
    },
    isSpam(this: any): any {
      return n && Date.now() - r < sw;
    },
  };
}
export { ow, sw, cw };
