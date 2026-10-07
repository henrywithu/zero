// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
var iw: any = !1;
function aw(this: any): any {
  if (iw) return;
  iw = !0;
  let e: any = document.createElement(`style`);
  e.dataset.joinForm = `1`;
  e.textContent = `
    .jf-input::placeholder { color: rgba(0,0,0,0.2); transition: color 0.2s; }
    .jf-input:focus::placeholder { color: rgba(0,0,0,0.1); }
    .jf-input { caret-color: #1f1d1e; }
    .jf-input:focus + .jf-underline { background: rgba(0,0,0,0.6); }
    /* Invalid state: underline flashes red and shakes left↔right. Added by
       _onSubmit when the field fails validation; removed by the form-level
       input listener as soon as the user starts editing. */
    .jf-underline.is-invalid {
      background: #c41010 !important;
      animation: jf-shake 0.42s cubic-bezier(0.36, 0.07, 0.19, 0.97);
    }
    @keyframes jf-shake {
      10%, 90% { transform: translateX(-1px); }
      20%, 80% { transform: translateX(2px); }
      30%, 50%, 70% { transform: translateX(-6px); }
      40%, 60% { transform: translateX(6px); }
    }
    /* Browser autofill (Chrome/Edge saved-credentials, etc.) normally
       overrides the input's font and paints a yellow background.
       Force our font + transparent bg so autofilled values look
       indistinguishable from typed ones. The 9999s background-color
       transition is the canonical hack to suppress the yellow tint
       without losing the autofilled value. */
    .jf-input:-webkit-autofill,
    .jf-input:-webkit-autofill:hover,
    .jf-input:-webkit-autofill:focus,
    .jf-input:-webkit-autofill:active {
      font-family: 'Bethany Elingston', 'Dancing Script', cursive !important;
      -webkit-text-fill-color: #000 !important;
      caret-color: #1f1d1e;
      transition: background-color 9999s ease-in-out 0s;
    }
    /* Education dropdown — strip native chrome, draw our own chevron, and
       reuse the input's underline-on-focus treatment. The background-*
       and color rules need !important: the element's inline _INPUT_STYLE
       sets the 'background' shorthand (which resets background-image)
       and 'color', and inline styles beat class rules otherwise. */
    /* Custom education dropdown — a themed replacement for the native <select>
       (option lists are OS-rendered and can't be styled). The trigger reuses
       the inline _INPUT_STYLE, so only the caret, menu and options need rules. */
    .jf-select { position: relative; width: 100%; }
    .jf-select-trigger { width: 100%; }
    .jf-select-value {
      flex: 1 1 auto; min-width: 0;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    /* Nothing chosen yet → tint like the other inputs' placeholders (rgba 0.2). */
    .jf-select-value.is-placeholder { color: rgba(0,0,0,0.2); }
    .jf-select-caret {
      flex: 0 0 auto; width: 22px; height: 22px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: center; background-size: 22px 22px;
      transition: transform 0.22s ease;
    }
    .jf-select.is-open .jf-select-caret { transform: rotate(180deg); }
    /* Open dropdown mirrors the inputs' focused underline (adjacent sibling). */
    .jf-select.is-open + .jf-underline { background: rgba(0,0,0,0.6); }
    .jf-select-menu {
      position: absolute; left: 0; right: 0; top: calc(100% + 12px);
      margin: 0; padding: 6px; list-style: none;
      background: #fff; border-radius: 18px;
      box-shadow: 0 18px 50px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06);
      z-index: 30;
      opacity: 0; transform: translateY(-6px); pointer-events: none;
      transition: opacity 0.18s ease, transform 0.18s ease;
    }
    .jf-select.is-open .jf-select-menu {
      opacity: 1; transform: translateY(0); pointer-events: auto;
    }
    .jf-select-option {
      padding: 12px 16px; border-radius: 12px; cursor: pointer;
      font-family: 'Bethany Elingston', 'Dancing Script', cursive;
      font-weight: 400; font-size: 24px; line-height: 1.2; color: #000;
      transition: background 0.15s ease;
    }
    .jf-select-option:hover { background: rgba(0,0,0,0.06); }
    .jf-select-option.is-selected { background: rgba(178,255,196,0.4); }
    /* ── Live validation (Osmo-derived — see formValidation.js) ─────────────
       Field wrappers receive .is--success / .is--error / .is--filled live.
       Translated to our underline language: the underline tints green/red
       and Osmo's check/alert icons fade in at the field's right edge. The
       submit-time .is-invalid shake (below) still layers on top. */
    .jf-field { position: relative; }
    /* Error-only feedback: valid fields stay visually neutral (no tick, no
       green) — the user is only notified when something is WRONG. The
       .is--success/.is--filled classes are still applied for state hooks. */
    .jf-valid-icon {
      position: absolute; right: 0; top: 5px;
      width: 24px; height: 24px;
      opacity: 0; pointer-events: none;
      transition: opacity 0.25s ease;
      color: #c41010;
    }
    .jf-field.is--error .jf-valid-icon.is--error { opacity: 1; }
    /* Dropdown field: keep the icon clear of the trigger's caret. */
    .jf-field:has(.jf-select) .jf-valid-icon { right: 40px; }
    /* Text shouldn't run underneath the icon (inline style has padding:0). */
    .jf-field .jf-input { padding-right: 34px !important; }
    /* Live underline tint. Later rules (focus/is-invalid) still override. */
    .jf-field.is--error .jf-underline { background: #c41010; }

    /* Additional-questions textarea — same placeholder/caret/underline feel. */
    .jf-textarea { caret-color: #1f1d1e; }
    .jf-textarea::placeholder { color: rgba(0,0,0,0.2); transition: color 0.2s; }
    .jf-textarea:focus::placeholder { color: rgba(0,0,0,0.1); }
    .jf-textarea:focus + .jf-underline { background: rgba(0,0,0,0.6); }
    /* ── Copy-link pill success animation (Osmo clipboard pattern) ─────────
       On copy the pill gets [data-copy-success] for 2s: the copy icon slides
       up out of a clipping window while the green check slides in from
       below — Osmo's easing + ±200% travel, verbatim. */
    .jf-copy-icons {
      position: relative; display: inline-flex;
      width: 16px; height: 16px;
      overflow: hidden; flex: 0 0 auto;
    }
    .jf-copy-ic {
      display: inline-flex; width: 100%; height: 100%;
      font-style: normal;
      transition: transform 0.4s cubic-bezier(0.625, 0.05, 0, 1);
      transform: translateY(0%) rotate(0.001deg);
    }
    .jf-copy-ic.is--success {
      position: absolute; inset: 0;
      color: #009e3b;
      transform: translateY(200%) rotate(0.001deg);
    }
    [data-copy-success] .jf-copy-ic { transform: translateY(-200%) rotate(0.001deg); }
    [data-copy-success] .jf-copy-ic.is--success { transform: translateY(0%) rotate(0.001deg); }

    .jf-close:hover { background: rgba(255,255,255,0.95); }
    .jf-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    /* Hover: pill lifts off the pedestal. Active: pill presses down (quick
       dip below resting position, then springs back when released). */
    .jf-join-btn:hover { bottom: 11px !important; }
    .jf-join-btn:active {
      bottom: 1px !important;
      transition: bottom 0.08s ease-out !important;
    }
    /* In-form submit button — same idea but translateY-based since the
       button is in normal flow (no fixed positioning to drive with bottom). */
    .jf-submit-btn:hover { transform: translateY(-4px) !important; }
    .jf-submit-btn:active {
      transform: translateY(2px) !important;
      transition: transform 0.08s ease-out !important;
    }
    /* Submit button transitions cleanly between Join → loader → Joined. */
    .jf-submit-btn,
    .jf-submit-btn > span,
    .jf-submit-btn > span > span,
    .jf-submit-btn > span > span > span {
      transition: background 0.35s ease, border-color 0.35s ease,
                  box-shadow 0.35s ease;
    }
    .jf-submit-btn.is-loading,
    .jf-submit-btn.is-success {
      pointer-events: none;
    }
    .jf-submit-btn.is-loading:hover,
    .jf-submit-btn.is-success:hover { transform: none !important; }
    /* Success theme — green wash across all four layers. */
    .jf-submit-btn.is-success { background: #2e7d32 !important; }
    .jf-submit-btn.is-success > span { background: #1b5e20 !important; }
    .jf-submit-btn.is-success > span > span {
      background: #2e7d32 !important;
      border-color: #1b5e20 !important;
    }
    .jf-submit-btn.is-success > span > span > span {
      background: #43a047 !important;
      box-shadow: inset 0 -1px 0 0 #66bb6a !important;
    }
    /* Spinner shown inside the button face during submission. */
    .jf-spinner {
      display: inline-block;
      width: 16px; height: 16px;
      border: 1.5px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: jf-spinner-spin 0.7s linear infinite;
    }
    @keyframes jf-spinner-spin { to { transform: rotate(360deg); } }

    /* ── Mobile (≤768px) ─────────────────────────────────────────────── */
    @media (max-width: 768px) {
      /* Stack the two-column layout into a single column: heading on top,
         form below. Plant is hidden — heading + fields + submit only.

         Crucially: instead of absolute-centering the block (which clipped the
         top/bottom once the heading + 6 fields + submit grew taller than the
         phone, and hid a focused field behind the keyboard), fill the whole
         panel and let the step scroll INTERNALLY. The rounded card still clips
         via the panel's overflow:hidden; the close button stays pinned. */
      .jf-content {
        left: 0 !important; right: 0 !important;
        top: 0 !important; bottom: 0 !important;
        width: auto !important;
        transform: none !important;
        flex-direction: column !important;
        align-items: stretch !important;
        justify-content: flex-start !important;
        /* Heading → fields spacing (this is the only column gap now that the
           plant is hidden). Kept tight on phone so the form starts higher. */
        gap: 8px !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        padding: 72px 6vw calc(28px + env(safe-area-inset-bottom, 0px)) !important;
        box-sizing: border-box !important;
      }
      /* flex:1 is for the desktop two-COLUMN row; in the phone single COLUMN
         it makes each block grab half the height, growing the heading block
         and shoving the form to mid-screen. Pin both to natural height so the
         fields sit right under the heading (with the small jf-content gap). */
      .jf-col-heading { gap: 0 !important; flex: 0 0 auto !important; }
      .jf-plant { display: none !important; }
      .jf-heading {
        font-size: 30px !important;
        max-width: none !important;
      }
      .jf-form { gap: 20px !important; flex: 0 0 auto !important; }
      /* Tighter label→input spacing so more of the form fits per screen. */
      .jf-field { gap: 8px !important; }
      .jf-input { font-size: 20px !important; }
      /* Custom dropdown trigger + options track the phone input size (the
         trigger's inline _INPUT_STYLE is 28px, so override needs !important). */
      .jf-select-trigger { font-size: 20px !important; }
      .jf-select-option { font-size: 20px !important; }
      .jf-textarea { font-size: 15px !important; }
      .jf-status { text-align: left !important; }
      /* Mobile form gap is already small — drop the desktop negative pull. */
      .jf-submit-btn { margin-top: 0 !important; }
      /* Close button: tighter inset on phone */
      .jf-close {
        right: 16px !important;
        top: 16px !important;
        width: 40px !important;
        height: 40px !important;
        font-size: 18px !important;
      }
    }
  `;
  document.head.appendChild(e);
}
export { iw, aw };
