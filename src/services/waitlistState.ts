// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { getOrigamiName, Nb, Pb, Ib, Ab } from "../models/origami.ts";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { localWaitlistRequest } from "./LocalWaitlist.ts";
var lw: any = "local-zero";
var uw: any = "";
var dw: any = `${lw}/functions/v1`;
var fw: any = `${dw}/Join-Zero-Waitlist-Signup`;
var pw: any = `${dw}/Join-Zero-Beta-Waitlist-Profile`;
var mw: any = `${dw}/Get-Zero-Waitlist-User`;
var hw: any = `${dw}/Zero-University-Log-Landing`;
var gw: any = `zero_supabase_uuid`;
var _w: any = `zero_waitlist_email`;
var vw: any = `zero_profile_complete`;
var yw: any = `zero:utm`;
function bw(this: any): any {
  return {
    "Content-Type": `application/json`,
    Authorization: `Bearer ${uw}`,
  };
}
function xw(this: any, e?: any): any {
  switch ((e || ``).trim()) {
    case `university`:
      return `university`;
    case `graduate`:
      return `graduated`;
    case `other`:
      return `other`;
    default:
      return `other`;
  }
}
function Sw(this: any, e?: any): any {
  switch ((e || ``).trim()) {
    case `university`:
      return `university`;
    case `graduated`:
      return `graduate`;
    case `job_seeking`:
      return `other`;
    case `other`:
      return `other`;
    default:
      return ``;
  }
}
function Cw(this: any, e?: any): any {
  let t: any = e || {};
  return {
    name: t.name || ``,
    age: t.age || ``,
    city: t.location || ``,
    education: Sw(t.status),
    university: t.university || ``,
    notes: t.about || ``,
  };
}
var ww: any = [
  `utm_source`,
  `utm_medium`,
  `utm_campaign`,
  `utm_content`,
  `utm_term`,
];
function Tw(this: any): any {
  try {
    return new URLSearchParams(window.location.search);
  } catch {
    return new URLSearchParams(``);
  }
}
function Ew(this: any): any {
  let e: any = Tw();
  return (e.get(`ref`) || e.get(`ref_id`) || e.get(`referral`) || ``).trim();
}
function Dw(this: any): any {
  let e: any = {
    utm_source: ``,
    utm_medium: ``,
    utm_campaign: ``,
    utm_content: ``,
    utm_term: ``,
    ref: ``,
  };
  try {
    let t: any = localStorage.getItem(yw);
    if (!t) return e;
    let n: any = JSON.parse(t);
    return {
      ...e,
      ...(n && typeof n == `object` ? n : {}),
    };
  } catch {
    return e;
  }
}
function Ow(this: any): any {
  return (Dw().ref || Ew() || ``).trim();
}
function kw(this: any): any {
  let e: any = Tw(),
    t: any = Ew(),
    n: any = {},
    r: any = !!t;
  for (let t of ww) {
    let i: any = (e.get(t) || ``).trim();
    n[t] = i;
    i && (r = !0);
  }
  if (!r) return !1;
  try {
    return localStorage.getItem(`zero:utm`)
      ? !1
      : (localStorage.setItem(
          yw,
          JSON.stringify({
            ...n,
            ref: t,
            first_landed_at: new Date().toISOString(),
          }),
        ),
        !0);
  } catch {
    return !1;
  }
}
function Aw(this: any): any {
  if (
    !window.__zeroWaitlistAttr &&
    ((window.__zeroWaitlistAttr = !0),
    kw(),
    Ew() || ww.some((e?: any): any => Tw().get(e)))
  )
    try {
      let e: any = Dw();
      localWaitlistRequest(hw, {
        method: `POST`,
        headers: {
          "Content-Type": `application/json`,
        },
        keepalive: !0,
        body: JSON.stringify({
          utm_source: e.utm_source,
          utm_medium: e.utm_medium,
          utm_campaign: e.utm_campaign,
          utm_content: e.utm_content,
          utm_term: e.utm_term,
          ref: e.ref || Ew(),
          referrer: document.referrer || ``,
          path: window.location.pathname || ``,
          user_agent: navigator.userAgent || ``,
          timestamp: new Date().toISOString(),
        }),
      }).catch((): any => {});
    } catch {}
}
function jw(this: any, e?: any, t?: any): any {
  try {
    localStorage.setItem(e, t);
  } catch {}
}
function Mw(this: any, e?: any): any {
  try {
    return localStorage.getItem(e);
  } catch {
    return null;
  }
}
async function Nw(
  this: any,
  e: any,
  { refCode: t, attr: n, animal: r }: any,
): Promise<any> {
  try {
    let i: any = await localWaitlistRequest(fw, {
      method: `POST`,
      headers: {
        "Content-Type": `application/json`,
      },
      body: JSON.stringify({
        email: e,
        ref_code: t || void 0,
        ref: n.ref || void 0,
        utm_source: n.utm_source || void 0,
        utm_medium: n.utm_medium || void 0,
        utm_campaign: n.utm_campaign || void 0,
        utm_content: n.utm_content || void 0,
        utm_term: n.utm_term || void 0,
        waitlist_animal: getOrigamiName(r),
      }),
    });
    return i.ok ? await i.json().catch((): any => null) : null;
  } catch {
    return null;
  }
}
async function Pw(this: any, e?: any): Promise<any> {
  try {
    let t: any = await localWaitlistRequest(
      `${mw}?uuid=${encodeURIComponent(e)}`,
      {
        method: `GET`,
        headers: bw(),
      },
    );
    return t.ok ? await t.json().catch((): any => null) : null;
  } catch {
    return null;
  }
}
async function Fw(this: any, e?: any): Promise<any> {
  let t: any = (e || ``).toString().trim().toLowerCase(),
    n: any = Nb(),
    r: any = Ow(),
    i: any = Dw(),
    a: any = {
      name: ``,
      age: ``,
      city: ``,
      education: ``,
      university: ``,
      notes: ``,
    },
    o: any = await Nw(t, {
      refCode: r,
      attr: i,
      animal: n,
    });
  if ((jw(_w, t), !o || !o.uuid)) {
    Pb(n);
    Ib(n);
    return {
      registered: !1,
      profileComplete: !1,
      uuid: null,
      ...a,
      asset: n,
      referralUrl: null,
      aheadCount: null,
      memberNumber: null,
    };
  }
  jw(gw, o.uuid);
  let s: any = o.already_exists === !0,
    c: any = s ? await Pw(o.uuid) : null,
    l: any = c?.profile_complete === !0,
    u: any = s ? Ab(t, c) : n;
  Pb(u);
  Ib(u);
  l && jw(vw, `1`);
  let d: any = c ? Cw(c) : a;
  return {
    registered: s,
    profileComplete: l,
    uuid: o.uuid,
    ...d,
    asset: u,
    referralUrl: c?.referral_url || o.referral_url || null,
    aheadCount: c?.effective_position ?? o.effective_position ?? null,
    memberNumber: c?.waitlist_number ?? o.waitlist_number ?? null,
  };
}
async function Iw(this: any, e?: any): Promise<any> {
  let {
      email: t,
      name: n,
      age: r,
      city: i,
      education: a,
      university: o,
      notes: s,
    } = e || {},
    c: any = (t || ``).toString().trim().toLowerCase(),
    l: any = xw(a),
    u: any = Dw(),
    d: any = Nb(),
    f: any = Mw(gw);
  if (!f) {
    let e: any = await Nw(c, {
      refCode: Ow(),
      attr: u,
      animal: d,
    });
    e?.uuid && ((f = e.uuid), jw(gw, f));
  }
  if (!f)
    return {
      ok: !0,
      asset: d,
      position: null,
    };
  try {
    let e: any = await localWaitlistRequest(pw, {
        method: `POST`,
        headers: bw(),
        body: JSON.stringify({
          uuid: f,
          email: c,
          name: n || null,
          age: r || null,
          location: i || null,
          status: l || null,
          university: o || null,
          about: s || null,
          utm_source: u.utm_source || ``,
          utm_medium: u.utm_medium || ``,
          utm_campaign: u.utm_campaign || ``,
          utm_content: u.utm_content || ``,
          utm_term: u.utm_term || ``,
          ref: u.ref || ``,
        }),
      }),
      t: any = await e.json().catch((): any => ({}));
    return !e.ok || t.success !== !0
      ? {
          ok: !1,
          error: (t && t.error) || `Something went wrong. Please try again.`,
        }
      : (jw(vw, `1`),
        {
          ok: !0,
          asset: d,
          position: t.effective_position ?? null,
        });
  } catch {
    return {
      ok: !1,
      error: `Network error. Please try again.`,
    };
  }
}
gsap.registerPlugin(SplitText);
export {
  lw,
  uw,
  dw,
  fw,
  pw,
  mw,
  hw,
  gw,
  _w,
  vw,
  yw,
  bw,
  xw,
  Sw,
  Cw,
  ww,
  Tw,
  Ew,
  Dw,
  Ow,
  kw,
  Aw,
  jw,
  Mw,
  Nw,
  Pw,
  Fw,
  Iw,
};
