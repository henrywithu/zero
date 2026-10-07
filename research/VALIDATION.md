# Validation record

Reference snapshot: 2026-10-07. Original published build: 2026-08-10 / `bdac4e2`.
Environment: Chromium on Linux, WebGL2 through SwiftShader. Reference network requests use the environment HTTPS proxy and trusted proxy CA. Local checks use Vite at ports 5173/4173.

## Passed checks

| Check | Evidence / result |
| --- | --- |
| Original resources | SHA-256 verification of **117 files**, 15,819,826 bytes; no missing/error entries |
| GLSL provenance | **69** original programs/chunks compared against their archived source templates; parameter expressions also checked |
| TypeScript | Strict compilation, no unchecked-file directives |
| Architecture | **79** application TypeScript modules, **0** static dependency cycles |
| Debug controls | Recovered lazy debug auto-scroll integration: original defaults, GUI toggling and forward wheel stepping to text anchors |
| Build | Vite production bundle generated successfully; Three r160 and runtime package versions pinned. The 655 kB Three chunk produces Vite’s size advisory; it is the retained renderer library |
| Loader | Side-by-side original/local frost, hand, counter/prompt and circle-hint captures inspected |
| Stage visuals | Desktop 1440×900 and mobile 390×844 captures at progress 0.15 / 0.50 / 0.85 in stages 1–4, plus stage 5 |
| Camera transforms | Stabilized desktop and mobile reference/local position and quaternion samples: maximum absolute difference **0** across 13 samples per viewport |
| Desktop controls | **17** checks passed, including audio, menu, holds, joystick, zoom, four company cards, validation/signup/profile, referral copy, share-preview dismissal and no errors/failed requests |
| Mobile controls | **13** checks passed, including native touch drag, native pinch, native marker taps, mobile HUD variant, holds and full local signup/referral/share flow |
| GLSL HMR | Active scene preserved through ordinary shader edit/revert, parameterized petal shader update, and built-in map material injection update |
| Production browser | **6** checks passed at normal DPR 1: readiness, no dev API, real native touch-drawn entrance, swipe, landscape/tablet resizing, no errors/failed requests |
| Responsive dimensions | Portrait 390×844, landscape 844×390, tablet 1024×768, desktop 1440×900; no page horizontal overflow in control/production checks |

The desktop and mobile final control runs had **zero browser page/console errors and zero HTTP failures**. Production checks also had zero errors or failed requests. Screenshots of the real production mobile entrance show the original green hand, coin ring, atlas typography, XP bar and footer controls.

## Comparison method and limits

`capture-experience.mjs` uses the real pointer-drawn zero, then the reference timeline-navigation API and ScrollManager. It captures each major stage at matching viewport/progress values. `capture-deterministic.mjs` additionally stabilizes stage updates, camera interpolation, shader time, videos and random seed. Its direct completion call is a rendering fixture; entrance recognition is tested separately with real mouse/touch movement.

The software GPU requires reduced DPR for comprehensive walkthroughs: 0.25 for interaction/capture sweeps and 0.5 for stabilized comparison captures and the debug check. Layout dimensions remain the full viewport size. This permits scene/camera/UI comparisons but is not a full-DPR pixel-perfect acceptance measurement. The production browser check deliberately uses normal DPR 1 without overriding quality or exposing the development object.

The inspected pairs share the original typography, camera path, scene geometry, HUD geometry and map composition. Random shard/paper/cloud placements and independently running videos/tweens vary between visits. The stabilization fixture does not freeze every asynchronous atlas callback or clock-derived garden god-ray blend. Recorded foreground blend/progress differences therefore remain in the fixture output. The original reference also emits loader/compilation errors under fixture manipulation or rapid replay. A single whole-screen similarity percentage would conflate these timing/random/source-error effects with implementation differences, so none is claimed.

No replacement hand artwork, recreated narrative typography, estimated shader, placeholder company video, or approximated camera path is used. File and GLSL provenance are exact (GLSL whitespace normalized during extraction); visual equality across every browser/GPU/frame has not been established. Audible speaker output is not verifiable in headless Chromium, although all audio files are exact and control/loading behavior passes.

## Reference bugs corrected in Zero

1. **Loader disposal race:** a loader tween can retain a redraw callback after the overlay is disposed, producing `Cannot read properties of null (reading 'redraw')`. Zero kills those tweens before disposal.
2. **Deferred shader compilation race:** Three r160 `compileAsync` can dereference an absent material program after stage replay disposes it, producing `Cannot read properties of undefined (reading 'isReady')`. Zero retains the compilation/polling behavior while treating disposed programs as complete. Stage-three activation tokens prevent stale async work adding geometry to a later scene.

These were reproduced against the archived/live reference. Zero's final all-stage/control walkthroughs complete without them. An additional implementation-only shader edit/revert issue was caught by the HMR test and fixed before the final milestone.

## Intentional functional differences

- Signup/profile data persists **locally in this browser**, with a local referral URL and local position. It does not register people in the reference site's production waitlist.
- Cookie consent and analytics are omitted.
- Breakpoint reloads, original menu destinations, mobile control variants and codec/autoplay policies are retained.
- No deployment is configured or performed.

## Reproduction

Install dependencies with `npm ci` (Node 22.12+ or 24), then start `npm run dev`. Chromium must be installed; set `CHROMIUM_PATH` if its executable is not `/usr/bin/chromium`.

```sh
npm run build
npm run verify:source
node tools/generate-inventory.mjs
node tools/verify-controls.mjs
node tools/verify-controls.mjs --mobile
node tools/verify-debug.mjs
node tools/capture-experience.mjs
node tools/capture-experience.mjs --mobile
node tools/capture-deterministic.mjs
node tools/capture-deterministic.mjs --mobile
```

For comparison, add `--reference` to the capture commands. The reference-only harness evaluates an instrumented archival copy on the reference page; this code is never imported by Zero. Reference scripts are configured for this environment's proxy/trust setup. Adjust browser trust/proxy configuration when running elsewhere.

Run `npm run preview -- --port 4173`, then `node tools/verify-production.mjs` for the production check. Run browser checks sequentially on a software GPU to avoid competing shader compilation and delayed input delivery. HMR checks temporarily append comments to shader files and restore them in `finally` blocks; follow with provenance verification. Early-release verification temporarily pauses the main render loop to keep software-GPU wall-clock stalls from turning a short press into a full hold.

Screenshots/raw fixture output go to ignored `research/captures/`. `verification-results.json` stores the compact final control/production results and comparison evidence. `architecture.json` and `behavior-inventory.json` are regenerated from the maintained source.
