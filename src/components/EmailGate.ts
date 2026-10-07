// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { gsap } from "gsap";
var qE: any = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var JE: any = !1;
function YE(this: any): any {
  if (JE) return;
  JE = !0;
  let e: any = document.createElement(`style`);
  e.dataset.emailGate = `1`;
  e.textContent = `
    /* DETACHED bottom bar (no longer fused to the stage5 frame). An outer
       frosted-glass "track" with real CSS padding wraps an inner content box
       (.eg-cluster) that holds the three items: a green circle (logo), a dark
       "Join Beta" pill, and a white circle menu. The track is the
       fixed/positioned/animated root; the cluster just provides the
       relative-positioning context the absolutely-positioned children sit in. */
    .eg-track { position: fixed; left: 50%; bottom: 14px; z-index: 200;
      transform: translateX(-50%);
      padding: var(--eg-pad, 10px);
      box-sizing: content-box;
      border-radius: 32px;
      /* Osmo expanding-nav morph: JS animates the track's width/height
         between the closed bar and the open menu; flex column keeps the
         cluster pinned at the bottom while the menu area (flex:1) is
         revealed above it by the growth. overflow clips mid-morph. */
      display: flex; flex-direction: column;
      overflow: hidden;
      will-change: width, height;
      /* Dark frosted glass — matches the Framer reference NavWrap
         (rgba(0,0,0,0.3) + blur(5px)). The dark tint reads as frosted over any
         backdrop, in every stage. Opaque children sit on top, unblurred. */
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: saturate(120%) blur(5px);
      -webkit-backdrop-filter: saturate(120%) blur(5px);
      /* Background follows the page theme (see .nav-black rule below) — same
         0.6s ease the navbar pills use so the flip is smooth, not a snap. */
      transition: background 0.6s ease;
    }
    /* Cluster background follows the page's per-stage theme — the very same
       .nav-black class the navbar pills use, toggled on <body> by
       GlobalUI.setPageTheme(). The track is a child of <body>, so this
       descendant selector matches with no extra JS. On the light stages
       (stage1 / 4 / 5, where .nav-black is applied) the frosted track flips to
       the navbar's light fill; on the dark stages (2 / 3) it stays dark.
       ONLY the track background changes here — the buttons, glass strokes and
       text inside are deliberately left as-is. */
    .nav-black .eg-track { background: rgba(255, 255, 255, 0.45); }
    /* Fixed-width bar centred within the (possibly wider, mid-morph) track. */
    .eg-cluster { position: relative; flex: 0 0 auto; margin: 0 auto; }
    .eg-circle, .eg-pill, .eg-menu {
      background: #353133; color: #fcfcfc;
      border: none;
      cursor: pointer; user-select: none; -webkit-user-select: none;
      box-sizing: border-box;
      /* position:relative for the ::after glass-stroke (added below). The
         .eg-circle / .eg-menu rules re-declare position:absolute, both
         non-static so the pseudo still anchors correctly. */
      position: relative;
    }
    /* Shared inset "chamfer" shadow + edge stroke for EVERY cluster button —
       left circle, centre pill, menu, back, and the Join-Beta submit. One
       class so the treatment is identical across the dark pill and the light
       / green circles. Layers, top to bottom:
         • 1px top highlight (reads on the dark face)
         • 1px all-round stroke at 25% black — defines the light buttons
           against the pedestal (near-invisible on the dark pill, by design).
           Done as an inset ring rather than a border so it's layout-neutral
           and isn't overridden by the border:none on .eg-back/.eg-submit.
         • bottom lip: a single crisp 4px band (the softer 8px band that used
           to sit under it has been removed for a shallower, cleaner edge).
       Tweak here to restyle all buttons at once. */
    .eg-btn {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.2),
        inset 0 0 0 1px rgba(0, 0, 0, 0.25),
        inset 0 -4px 0 rgba(0, 0, 0, 0.3);
    }
    /* Left (logo/back) + right (menu) circles: flat — no inset chamfer, no
       stroke. Later in the sheet than .eg-btn so it wins at equal
       specificity; the centre pill keeps the full treatment. */
    .eg-circle, .eg-menu, .eg-back, .eg-submit { box-shadow: none; }
    /* Glass-stroke highlight ring — mirrors the navbar pills' ::after
       treatment in src/style.css (.hud-xp::after etc). A 1px-thick
       gradient ring that's bright at the top-left and bottom-right and
       transparent across the middle — light catching opposite curved
       edges of glass. Mask trick converts a solid box into a hollow
       ring that follows the host's border-radius. */
    .eg-pill::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1px;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.9),
        rgba(255, 255, 255, 0) 35%,
        rgba(255, 255, 255, 0) 65%,
        rgba(255, 255, 255, 0.9)
      );
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
              mask-composite: exclude;
      pointer-events: none;
    }
    /* The centre "Join Beta" pill is the largest face, so the same 0.9 corner
       highlights read as too much shine on it — dim its glass ring. */
    .eg-pill::after {
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.35),
        rgba(255, 255, 255, 0) 35%,
        rgba(255, 255, 255, 0) 65%,
        rgba(255, 255, 255, 0.35)
      );
    }
    /* Right button — white circle (reference: rgba(255,255,255,0.9)). */
    .eg-menu {
      background: rgba(255, 255, 255, 0.9); color: #1f1d1e;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      position: absolute; top: 0;
      transition: background 0.2s ease;
    }
    /* Left button (logo / back): green circle holding the ZERO monogram. */
    .eg-circle {
      background: #1a6e48;
      color: #1f1d1e;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      position: absolute; top: 0;
      transition: background 0.2s ease;
    }
    .eg-circle:hover { background: #218158; }
    .eg-menu:hover { background: #ffffff; }
    /* Left slot — clips the back button when it's parked above. Round so the
       clipped logo/back reads as a circle. */
    .eg-left-slot {
      position: absolute; top: 0;
      overflow: hidden;
      border-radius: 50%;
    }
    /* Back button — circle that slides down over the logo (z 2 so it covers
       the static logo beneath it). White to read against the green logo. */
    .eg-back {
      position: absolute; left: 0; top: 0; z-index: 2;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: #ffffff; color: #1f1d1e; border: none;
      cursor: pointer; box-sizing: border-box;
      transition: background 0.2s ease;
    }
    .eg-back:hover { background: #f0eeee; }
    .eg-circle img { width: 74%; height: 74%; object-fit: contain;
      pointer-events: none; -webkit-user-drag: none; }
    /* Back arrow + logo are stacked inside the left circle and cross-faded. */
    .eg-circle .eg-ic { position: absolute; display: flex; align-items: center;
      justify-content: center; width: 100%; height: 100%; transition: opacity 0.25s ease; }
    /* Left button shows only the static ZERO icon (the play-glyph cycler and
       its blur-crossfade were removed). zero_icon.jpg is an opaque square —
       cover-fill the round button so it reads as the button face. */
    .eg-ic-logo img { width: 100%; height: 100%; object-fit: cover;
      border-radius: 50%; display: block; }
    /* Centre "Join Beta" pill — reference: rgb(38,36,36), 60px radius, with a
       1px top highlight + bottom lip inset and a soft drop shadow. This
       box-shadow overrides the generic .eg-btn one (declared earlier). */
    .eg-pill {
      position: absolute; top: 0;
      background: rgb(38, 36, 36);
      border-radius: 60px;
      display: flex; align-items: center;
      overflow: hidden;
      font-family: 'Google Sans Flex', 'Inter', sans-serif; font-weight: 500;
      transition: background 0.2s ease;
      box-shadow:
        inset 0 1px 0.5px rgba(255, 255, 255, 0.3),
        inset 0 -1.5px 0.5px rgba(0, 0, 0, 0.3),
        0 2px 5px rgba(0, 0, 0, 0.25);
    }
    .eg-pill:hover { background: #2f2c2c; }
    .eg-pill.is-open { cursor: default; }
    .eg-pill.is-open:hover { background: rgb(38, 36, 36); }
    /* Centre label (collapsed) and the input row (expanded) are cross-faded. */
    .eg-label {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      white-space: nowrap;
      transition: opacity 0.2s ease;
    }
    .eg-inputrow {
      position: absolute; inset: 0;
      display: flex; align-items: center;
      /* White field: the pill's overflow:hidden clips this to its rounded
         shape, so the expanded email field reads as a light input. */
      background: #ffffff;
      opacity: 0; pointer-events: none;
      transition: opacity 0.25s ease;
    }
    .eg-input {
      flex: 1 1 auto; min-width: 0;
      background: transparent; border: none; outline: none;
      color: #1f1d1e;
      font-family: 'Google Sans Flex', 'Inter', sans-serif; font-weight: 500;
      caret-color: #1a6e48;
    }
    .eg-input::placeholder { color: rgba(31,29,30,0.4); }
    /* Join-Beta button inside the field — inverse of the white field: dark
       fill, light text. */
    .eg-submit {
      flex: 0 0 auto;
      background: rgb(38, 36, 36);
      color: #fcfcfc; border: none; border-radius: 999px;
      font-family: 'Google Sans Flex', 'Inter', sans-serif; font-weight: 500;
      cursor: pointer; white-space: nowrap;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s ease, opacity 0.2s ease;
    }
    .eg-submit:hover { background: #2f2c2c; }
    .eg-submit:disabled { cursor: default; opacity: 0.8; }
    .eg-spinner {
      display: inline-block; width: 15px; height: 15px;
      /* Light — the submit button is now dark-filled. */
      border: 1.6px solid rgba(252,252,252,0.30); border-top-color: #fcfcfc;
      border-radius: 50%; animation: eg-spin 0.7s linear infinite;
    }
    @keyframes eg-spin { to { transform: rotate(360deg); } }
    /* Menu dropdown — opens upward above the menu circle. Its width is set
       inline in JS to span the whole cluster (CLUSTER_W); box-sizing:
       border-box keeps the padding + 1px border inside that width. The
       frosted-glass surface (translucent black + backdrop blur + hairline
       stroke) mirrors the navbar's .hud-menu-dropdown so the two menus read
       as the same UI family.

       It is appended to <body>, NOT to .eg-track: a child backdrop-filter is a
       no-op while an ancestor (the track) already establishes one, which left
       this panel unblurred. As a body-level fixed element its backdrop-filter
       frosts the real page behind it, matching the track. left/bottom are set
       in JS (_openMenu) from the cluster's live rect. */
    /* In-track menu (Osmo expanding nav): the GSAP timeline morphs the
       TRACK's width/height; this area is the flex-filler above the bar that
       the growth reveals. Hidden (autoAlpha) while closed so the links can't
       be tabbed into; the timeline flips it on right as the morph starts.
       The links sit on the track's own frosted background — no separate
       popup, no nested backdrop-filter. */
    .eg-menu-area {
      flex: 1 1 auto; min-height: 0;
      overflow: hidden;
      opacity: 0; visibility: hidden;
    }
    .eg-menu-inner {
      overflow: hidden; min-height: 0; height: 100%;
      display: flex; flex-direction: column;
    }
    /* Breathing room above/below the links — as child MARGINS (not inner
       padding): margins live inside the clipped content box, so the closed
       state collapses to a true 0 height. Inner padding would keep its own
       box tall and poke out of the 0fr row. */
    .eg-menu-inner .eg-menu-item:first-child { margin-top: 14px; }
    .eg-menu-inner .eg-menu-item:last-child { margin-bottom: 16px; }
    .eg-menu-item {
      display: block; padding: 11px 14px; border-radius: 10px;
      color: #e8e6e7; text-decoration: none;
      text-align: center;
      /* STK Bureau Serif (Book) — @font-face'd in style.css. Rendered at the
         font's native Book weight (400), no synthesis. */
      font-family: 'STK Bureau Serif', serif;
      font-weight: 400;
      font-size: 28px; line-height: 1.15;
    }
    /* Clip window for the roll: exactly one line tall — the duplicate line
       sits just below and is hidden until hover. This wrapper sits INSIDE the
       item's padding so the padding (the link spacing) can't reveal the
       duplicate; only the item itself was previously clipping and its padding
       widened the window. */
    .eg-menu-clip { display: block; overflow: hidden; }
    /* Roll: the label + an identical duplicate stacked one line below. On
       hover the whole roll slides up exactly one line — the top copy exits,
       the duplicate takes its place; on hover-out it slides back down.
       transform-only (GPU compositor) so it's cheap and snappy. */
    .eg-menu-roll {
      position: relative; display: block;
      transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
      will-change: transform;
    }
    .eg-menu-line { display: block; }
    .eg-menu-line--dup { position: absolute; top: 100%; left: 0; right: 0; }
    .eg-menu-item:hover .eg-menu-roll,
    .eg-menu-item:focus-visible .eg-menu-roll { transform: translateY(-100%); }
    /* Links follow the page theme — same .nav-black body flag the track's
       background uses, so text flips dark on the light-stage fill. */
    .nav-black .eg-menu-item { color: #1f1d1e; }
    /* Two-bar burger — bars rotate into an X in the open timeline. */
    .eg-burger {
      display: flex; flex-direction: column; gap: 5px;
      align-items: center; justify-content: center;
      pointer-events: none;
    }
    .eg-burger-bar {
      display: block; width: 16px; height: 1.6px;
      border-radius: 1px; background: currentColor;
      will-change: transform;
    }
    .eg-err { color: #ff6b6b; }
  `;
  document.head.appendChild(e);
}
var XE: any = `<span class="eg-burger" aria-hidden="true"><span class="eg-burger-bar is--top"></span><span class="eg-burger-bar is--btm"></span></span>`;
var ZE: any = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`;
var QE: any = [
  {
    label: `Trapnest`,
    href: `https://henrywithu.com/`,
  },
  {
    label: `The Journal`,
    href: `https://henrywithu.com/`,
  },
  {
    label: `Trapnest Theory`,
    href: `https://theory.henrywithu.com/`,
  },
];
function createEmailGate(
  this: any,
  {
    onEmail: e = null,
    initialEmail: t = ``,
    showEntryAnimation: n = !0,
    entryAnimationDuration: r = 2,
    onBack: i = null,
  }: any = {},
): any {
  YE();
  let a: any = window.innerWidth <= 768,
    o: any = a ? 44 : 48,
    s: any = a ? 4 : 5,
    c: any = s,
    l: any = a
      ? Math.max(
          120,
          Math.round(window.innerWidth - 40 - (2 * o + 2 * c + 2 * s)) - 56,
        )
      : 320,
    u: any = o,
    d: any = s,
    f: any = o + c + l + c + o,
    p: any = l + c + o,
    m: any = a ? 15 : 16,
    h: any = a ? 56 : 104,
    g: any = f + h,
    _: any = document.createElement(`div`);
  _.className = `eg-track`;
  _.style.setProperty(`--eg-pad`, `${s}px`);
  _.style.width = `${f}px`;
  _.style.height = `${u}px`;
  let v: any = document.createElement(`div`);
  v.className = `eg-cluster`;
  v.style.width = `${f}px`;
  v.style.height = `${u}px`;
  let y: any = document.createElement(`button`);
  y.className = `eg-circle eg-btn`;
  y.type = `button`;
  y.setAttribute(`aria-label`, `Visit Trapnest`);
  y.style.left = `0px`;
  y.style.top = `auto`;
  y.style.bottom = `0px`;
  y.style.width = `${o}px`;
  y.style.height = `${o}px`;
  let b: any = document.createElement(`span`);
  b.className = `eg-ic eg-ic-logo`;
  b.innerHTML = `<img src="assets/ui/zero_icon.jpg" alt="" />`;
  y.appendChild(b);
  let x: any = document.createElement(`div`);
  x.className = `eg-left-slot`;
  x.style.left = `0px`;
  x.style.top = `${-d}px`;
  x.style.width = `${o}px`;
  x.style.height = `${o + d}px`;
  let S: any = document.createElement(`button`);
  S.className = `eg-back eg-btn`;
  S.type = `button`;
  S.setAttribute(`aria-label`, `Back`);
  S.style.left = `0px`;
  S.style.top = `auto`;
  S.style.bottom = `0px`;
  S.style.width = `${o}px`;
  S.style.height = `${o}px`;
  S.innerHTML = ZE;
  let C: any = document.createElement(`div`);
  C.className = `eg-pill eg-btn`;
  C.setAttribute(`role`, `button`);
  C.setAttribute(`tabindex`, `0`);
  C.style.left = `${o + c}px`;
  C.style.width = `${l}px`;
  C.style.height = `${u}px`;
  C.style.fontSize = `${m}px`;
  let w: any = document.createElement(`span`);
  w.className = `eg-label`;
  w.textContent = `Keep wonder`;
  C.appendChild(w);
  let T: any = document.createElement(`form`);
  T.className = `eg-inputrow`;
  T.setAttribute(`novalidate`, ``);
  T.style.padding = `0 4px 0 ${a ? 16 : 20}px`;
  T.style.gap = `${a ? 8 : 10}px`;
  let E: any = document.createElement(`input`);
  E.className = `eg-input`;
  E.type = `email`;
  E.name = `email`;
  E.autocomplete = `email`;
  E.placeholder = `email · saved only in this browser`;
  E.style.fontSize = `${m}px`;
  t && (E.value = t);
  let D: any = document.createElement(`button`);
  D.className = `eg-submit eg-btn`;
  D.type = `submit`;
  D.style.height = `${u - 8}px`;
  D.style.padding = `0 ${a ? 16 : 20}px`;
  D.style.fontSize = `${m - 1}px`;
  D.textContent = `Keep wonder`;
  T.appendChild(E);
  T.appendChild(D);
  C.appendChild(T);
  let O: any = document.createElement(`div`),
    k: any = document.createElement(`button`);
  k.className = `eg-menu eg-btn`;
  k.type = `button`;
  k.setAttribute(`aria-label`, `Menu`);
  k.setAttribute(`aria-haspopup`, `true`);
  k.setAttribute(`aria-expanded`, `false`);
  k.style.left = `${o + c + l + c}px`;
  k.style.width = `${o}px`;
  k.style.height = `${o}px`;
  k.innerHTML = XE;
  let A: any = document.createElement(`div`);
  A.className = `eg-menu-area`;
  A.setAttribute(`aria-hidden`, `true`);
  let j: any = document.createElement(`div`);
  j.className = `eg-menu-inner`;
  j.setAttribute(`role`, `menu`);
  A.appendChild(j);
  for (let { label: e, href: t } of QE) {
    let n: any = document.createElement(`a`);
    n.className = `eg-menu-item`;
    n.setAttribute(`role`, `menuitem`);
    let r: any = (e?: any): any => e.replace(/\/+$/, ``),
      i: any = new URL(t, window.location.href);
    (i.origin === window.location.origin &&
      r(i.pathname) === r(window.location.pathname)) ||
      (n.href = t);
    let a: any = document.createElement(`span`);
    a.className = `eg-menu-roll`;
    let o: any = document.createElement(`span`);
    o.className = `eg-menu-line`;
    o.textContent = e;
    let s: any = document.createElement(`span`);
    s.className = `eg-menu-line eg-menu-line--dup`;
    s.textContent = e;
    s.setAttribute(`aria-hidden`, `true`);
    a.appendChild(o);
    a.appendChild(s);
    let c: any = document.createElement(`span`);
    c.className = `eg-menu-clip`;
    c.appendChild(a);
    n.appendChild(c);
    j.appendChild(n);
  }
  O.style.position = `absolute`;
  O.style.left = `${o + c + l + c}px`;
  O.style.top = `0px`;
  O.style.width = `${o}px`;
  O.style.height = `${o}px`;
  k.style.left = `0px`;
  O.appendChild(k);
  x.appendChild(y);
  x.appendChild(S);
  v.appendChild(x);
  v.appendChild(C);
  v.appendChild(O);
  gsap.set(S, {
    y: -(o + d),
  });
  S.style.pointerEvents = `none`;
  _.appendChild(A);
  _.appendChild(v);
  document.body.appendChild(_);
  n &&
    gsap.fromTo(
      _,
      {
        y: 200,
      },
      {
        y: 0,
        duration: r,
        ease: `power2.out`,
      },
    );
  let M: any = !1,
    N: any = !1,
    P: any = !1,
    F: any = null,
    I: any = 0,
    L: any = Array.from(j.querySelectorAll(`.eg-menu-item`)),
    R: any = k.querySelector(`.eg-burger-bar.is--top`),
    z: any = k.querySelector(`.eg-burger-bar.is--btm`);
  function ee(this: any): any {
    let e: any = _.style.width,
      t: any = _.style.height;
    _.style.width = `${g}px`;
    _.style.height = `auto`;
    let n: any = _.offsetHeight - 2 * s;
    _.style.width = e;
    _.style.height = t;
    return n;
  }
  function te(this: any): any {
    let e: any = ee(),
      t: any = gsap.timeline({
        paused: !0,
      });
    t.to(
      _,
      {
        width: g,
        height: e,
        duration: 0.65,
        ease: `osmoNav`,
      },
      0,
    )
      .to(
        v,
        {
          width: g,
          duration: 0.65,
          ease: `osmoNav`,
        },
        0,
      )
      .to(
        C,
        {
          width: l + h,
          duration: 0.65,
          ease: `osmoNav`,
        },
        0,
      )
      .to(
        O,
        {
          x: h,
          duration: 0.65,
          ease: `osmoNav`,
        },
        0,
      )
      .to(
        R,
        {
          y: 3.3,
          rotation: 45,
          duration: 0.4,
          ease: `back.out(2)`,
        },
        0.05,
      )
      .to(
        z,
        {
          y: -3.3,
          rotation: -45,
          duration: 0.4,
          ease: `back.out(2)`,
        },
        0.05,
      )
      .set(
        A,
        {
          autoAlpha: 1,
        },
        0.1,
      )
      .fromTo(
        L,
        {
          autoAlpha: 0,
          yPercent: 100,
        },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.6,
          stagger: 0.03,
        },
        0.1,
      );
    I = t.duration();
    t.addPause();
    t.to(L, {
      autoAlpha: 0,
      yPercent: 10,
      duration: 0.25,
      stagger: {
        each: 0.01,
        from: `end`,
      },
    })
      .to(
        _,
        {
          width: f,
          height: u,
          duration: 0.45,
          ease: `power3.inOut`,
        },
        `<`,
      )
      .to(
        v,
        {
          width: f,
          duration: 0.45,
          ease: `power3.inOut`,
        },
        `<`,
      )
      .to(
        C,
        {
          width: l,
          duration: 0.45,
          ease: `power3.inOut`,
        },
        `<`,
      )
      .to(
        O,
        {
          x: 0,
          duration: 0.45,
          ease: `power3.inOut`,
        },
        `<`,
      )
      .to(
        [R, z],
        {
          y: 0,
          rotation: 0,
          duration: 0.3,
          ease: `power3.in`,
        },
        `<`,
      )
      .set(A, {
        autoAlpha: 0,
      });
    return t;
  }
  let ne: any = e,
    re: any = i;
  function ie(this: any, e?: any): any {
    e
      ? (E.classList.add(`eg-err`), (E.placeholder = e))
      : (E.classList.remove(`eg-err`), (E.placeholder = `email · saved only in this browser`));
  }
  function ae(this: any): any {
    P ||
      ((P = !0),
      _.classList.add(`eg-menu-open`),
      k.setAttribute(`aria-expanded`, `true`),
      A.setAttribute(`aria-hidden`, `false`),
      document.addEventListener(`pointerdown`, oe, !0),
      F && F.kill(),
      (F = te()),
      F.play());
  }
  function B(this: any): any {
    P &&
      ((P = !1),
      _.classList.remove(`eg-menu-open`),
      k.setAttribute(`aria-expanded`, `false`),
      A.setAttribute(`aria-hidden`, `true`),
      document.removeEventListener(`pointerdown`, oe, !0),
      F && (F.time() < I ? F.reverse() : F.play()));
  }
  let oe: any = (e?: any): any => {
    !O.contains(e.target) && !j.contains(e.target) && B();
  };
  k.addEventListener(`click`, (e?: any): any => {
    e.stopPropagation();
    P ? B() : ae();
  });
  function se(this: any): any {
    if (M) return;
    M = !0;
    B();
    ie(null);
    C.classList.add(`is-open`);
    v.classList.add(`eg-open`);
    gsap.killTweensOf([_, v, C, O, w, T, S]);
    let e: any = 0.42,
      t: any = `power3.out`;
    gsap.to(_, {
      width: g,
      height: u,
      duration: e,
      ease: t,
    });
    gsap.to(v, {
      width: g,
      duration: e,
      ease: t,
    });
    gsap.to(C, {
      width: p + h,
      duration: e,
      ease: t,
    });
    gsap.to(O, {
      x: o + c,
      opacity: 0,
      duration: e,
      ease: t,
      onStart: (): any => {
        O.style.pointerEvents = `none`;
      },
    });
    gsap.to(w, {
      opacity: 0,
      duration: 0.16,
      ease: `power1.out`,
    });
    gsap.to(T, {
      opacity: 1,
      duration: 0.3,
      delay: 0.12,
      ease: `power2.out`,
      onStart: (): any => {
        T.style.pointerEvents = `auto`;
      },
    });
    gsap.to(S, {
      y: 0,
      duration: e,
      ease: t,
      onStart: (): any => {
        S.style.pointerEvents = `auto`;
      },
    });
    gsap.delayedCall(0.22, (): any => {
      M &&
        E.focus({
          preventScroll: !0,
        });
    });
  }
  function ce(this: any): any {
    if (!M) return;
    M = !1;
    N = !1;
    ie(null);
    E.disabled = !1;
    V(`Keep wonder`);
    D.disabled = !1;
    C.classList.remove(`is-open`);
    v.classList.remove(`eg-open`);
    gsap.killTweensOf([_, v, C, O, w, T, S]);
    let e: any = 0.42,
      t: any = `power3.out`;
    gsap.to(_, {
      width: f,
      height: u,
      duration: e,
      ease: t,
    });
    gsap.to(v, {
      width: f,
      duration: e,
      ease: t,
    });
    gsap.to(C, {
      width: l,
      duration: e,
      ease: t,
    });
    gsap.to(O, {
      x: 0,
      opacity: 1,
      duration: e,
      ease: t,
      onStart: (): any => {
        O.style.pointerEvents = `auto`;
      },
    });
    gsap.to(T, {
      opacity: 0,
      duration: 0.16,
      ease: `power1.out`,
      onStart: (): any => {
        T.style.pointerEvents = `none`;
      },
    });
    gsap.to(w, {
      opacity: 1,
      duration: 0.3,
      delay: 0.1,
      ease: `power2.out`,
    });
    gsap.to(S, {
      y: -(o + d),
      duration: e,
      ease: t,
      onStart: (): any => {
        S.style.pointerEvents = `none`;
      },
    });
  }
  function V(this: any, e?: any): any {
    D.textContent = e;
  }
  function le(this: any, e?: any): any {
    N = !!e;
    D.disabled = N;
    E.disabled = N;
    N
      ? (D.innerHTML = `<span class="eg-spinner" aria-hidden="true"></span>`)
      : (V(`Keep wonder`), (E.disabled = !1));
  }
  async function ue(this: any): Promise<any> {
    if (N) return;
    let e: any = (E.value || ``).trim();
    if (!qE.test(e)) {
      ie(`please enter a valid email`);
      E.value = ``;
      E.focus({
        preventScroll: !0,
      });
      return;
    }
    ne && ne(e);
  }
  T.addEventListener(`submit`, (e?: any): any => {
    e.preventDefault();
    ue();
  });
  E.addEventListener(`input`, (): any => {
    E.classList.contains(`eg-err`) && ie(null);
  });
  y.addEventListener(`click`, (): any => {
    window.open(`https://henrywithu.com/`, `_blank`, `noopener`);
  });
  S.addEventListener(`click`, (): any => {
    (re && re() === !0) || ce();
  });
  let H: any = (): any => {
    M || se();
  };
  C.addEventListener(`click`, (e?: any): any => {
    M || H();
  });
  C.addEventListener(`keydown`, (e?: any): any => {
    !M && (e.key === `Enter` || e.key === ` `) && (e.preventDefault(), H());
  });
  let U: any = (e?: any): any => {
    if (e.key === `Escape` && M && !N) {
      if (re && re() === !0) return;
      ce();
    }
  };
  document.addEventListener(`keydown`, U);
  function de(this: any, e: any = 0.25): any {
    B();
    gsap.killTweensOf(_, `opacity,y`);
    gsap.to(_, {
      opacity: 0,
      y: 40,
      duration: e,
      ease: `power2.in`,
      onComplete: (): any => {
        _.style.pointerEvents = `none`;
      },
    });
  }
  function W(this: any, e: any = 0.35): any {
    gsap.killTweensOf(_, `opacity,y`);
    _.style.pointerEvents = `auto`;
    gsap.to(_, {
      opacity: 1,
      y: 0,
      duration: e,
      ease: `power2.out`,
    });
  }
  function fe(this: any, e: any = 0.45): any {
    B();
    gsap.killTweensOf(_);
    _.style.pointerEvents = `none`;
    gsap.to(_, {
      y: 200,
      duration: e,
      ease: `power2.in`,
    });
  }
  function pe(this: any): any {
    gsap.killTweensOf([_, v, C, O, w, T, S]);
    F &&= (F.kill(), null);
    document.removeEventListener(`keydown`, U);
    document.removeEventListener(`pointerdown`, oe, !0);
    A.remove();
    _.remove();
  }
  return {
    el: _,
    expandToInput: se,
    collapse: ce,
    setBusy: le,
    setError: ie,
    hide: de,
    show: W,
    slideOut: fe,
    isOpen: (): any => M,
    getEmail: (): any => (E.value || ``).trim(),
    setOnEmail: (e?: any): any => {
      ne = e;
    },
    setOnBack: (e?: any): any => {
      re = e;
    },
    setInitialEmail: (e?: any): any => {
      typeof e == `string` && (E.value = e);
    },
    destroy: pe,
  };
}
export { qE, JE, YE, XE, ZE, QE, createEmailGate };
