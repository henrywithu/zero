# Zero reference reconstruction

Reference: https://why.zero.university/ — snapshot inspected 2026-10-07.
Published reference build: 2026-08-10, commit `bdac4e2`, entry `main-B9-HtP-f.js` and stylesheet `main-yeWZtezw.css`.

## Method and provenance

The implementation is based on extracted original assets and recovered application logic. `research/original/` holds an inspectable research snapshot, never imported by the app. Source maps returned 404. `tools/analyze-source.mjs` identifies application bindings and asset paths. `tools/recover-modules.mjs` resolves lexical bindings, removes embedded third-party libraries, names application classes, derives import/export boundaries, and extracts shader programs. Recovered code is then maintained in `src/`; regeneration is a research operation, not a build step. The production bundle is neither served nor evaluated by Zero.

`asset-manifest.json` records source URL, byte count, and SHA-256 for each original resource. `module-manifest.json` links components to source line intervals and dependencies. `shader-manifest.json` links the 55 extracted shader sources to their originating components. `tools/fetch-assets.py` also expands dynamic origami, company-logo, tool-logo, and video URLs. Missing paths are recorded rather than substituted with invented assets.

## Rendering architecture

The reference is an immersive, full-viewport Three.js **r160** WebGL2 application, not a conventional scrolling document. The rebuilt project pins `three@0.160.1` to preserve color-space, material, atlas, GLTF animation, and postprocessing behavior. Models use Draco; atlas textures use KTX2/Basis. Original decoder resources are local under `public/vendor/`. Fonts are original Supply Sans, Supply Mono, Bethany Elingston, and STK Bureau Serif, with supplementary Google font families used by the reference UI.

The perspective camera uses a 30-degree vertical FOV on desktop and 40 degrees at widths at or below 768 px. Initial camera near/far are 0.1/30, with a stage-specific far plane increase to 65 for the cloud/world sequence. Pixel ratio starts capped at 2 and an adaptive quality manager changes it based on frame timing. Output is linear sRGB with no tone mapping. The original order of scene, background, frosting, glass, lens blur, foreground, and text passes is preserved. Atlas coordinates, camera animation tracks, model transforms, material uniforms, and GSAP curves are recovered rather than redrawn.

The DOM canvas is fixed at z-index 1, and its overlay is fixed at z-index 2 with pointer events disabled except on controls. Native document scrolling is disabled. Canvas pointer/touch handlers and ScrollManager drive the stage timeline. A fixed gradient behind the transparent canvas prevents a blank startup flash.

## Stage sequence and controls

| Segment | Driver | Length | Original behavior |
| --- | --- | --- | --- |
| Loader | Asset readiness, then gesture | — | Counter descends in steps from 99, icy feedback, animated hand, rotating circle hint, DRAW A ZERO prompt. |
| Gate 0 → 1 | Automatic | 50 vh | Gesture launches camera and hand entrance, ice dissolves, background changes. |
| Stage 1 | Wheel/touch | 175 vh | Human/fancy hand animations, text atlas panels, coin ring, petals, parallax. Ends with a glowing hold control. |
| Gate 1 → 2 | Automatic | 50 vh | Frost/glass wipe, animated hand and shard transition, ambient crossfade. |
| Stage 2 | Wheel/touch | 250 vh | Glass fracture models, video-backed environment, hand/camera animation, narrative text. |
| Stage 3 | Wheel/touch | 325 vh | Burning money and certificate imagery, tunnel model, animated shader pulse and ember/char effects. |
| Gate 3 → 4 | Automatic | Source-defined | Camera moves through tunnel into white world; green pulse changes to white; ambient music changes. |
| Stage 4 | Wheel/touch | 368 vh | Cloud field, eight atlas text panels, world reveal and camera/map zoom. |
| Stage 5 | Map interaction | Source-defined | Orthographic company map, paper origami avatar, joystick/directional buttons, marker popups, email/profile/share flow. |

The zero gesture requires at least 20 samples, a meaningful average radius, stable radial variance, roughly complete angle travel, and endpoint closure. Coordinates are normalized to the canvas. Pointer release clears incomplete strokes. The drag sound level follows pointer speed.

Scroll smoothing is frame-rate independent: `1 - exp(-speed * deltaTime)`; wheel deltas are clamped, input can be held during gates, and each segment owns its scroll span. Automatic gates use smoothstep interpolation. The hold button exposes a circular progress ring, expanded hit area, hover scale, expanding light ripples, and source-defined hold timing. Releasing early resets progress.

Desktop navigation is a center timeline ruler whose hover state reveals stage buttons. Mobile uses progress bars and a count/menu. XP increments by 100 once per stage and animates over two seconds with a gold stroke ripple. The HUD switches white/black palettes as the background changes. Audio responds to the browser's user gesture unlock and pauses/muffles as overlays open.

## Original visual effects

* **Frosting:** ping-pong trail textures, directional spread, noisy ice opacity, normal-map refraction, drawing feedback, loader dissolve.
* **Foreground:** noise, hover glow/frost spot, vignette/center reveal, god rays blended from a three-cell garden atlas.
* **Glass:** animated shard transforms, crack/shatter masks, multi-target compositing and glass optics.
* **Typography:** atlas-driven narrative text, independent WebGL text scene, ripple/blur appearances and responsive anchoring. Text imagery is retained pixel-for-pixel in the original compressed atlas.
* **Paper and money:** burn masks, ember tips, char gradients, delayed/speed-controlled progression and object-specific materials.
* **Tunnel:** procedural rings, gradient pulse, moving plane glow and animated camera path.
* **Clouds:** instancing, depth layers, opacity, drift, bobbing, wraparound and scroll velocity response. Randomized fields are expected to differ in particle placement between visits.
* **Map:** raycast markers, orthographic pan/zoom, avatar deflection and joystick inertial response. Original company videos and tool logos populate the cards.
* **Cursor:** original cursor atlas with grab, grabbed, and interaction states; desktop pointer parallax and optional mobile gyroscope.
* **UI:** original frosted pills, masked gradient edges, subtle inner highlights, audio waveform scaling, status shimmer, scroll dot bobbing and light/dark color transitions.

## Audio and media

Four ambient tracks cover stage 1, stages 2–3, stages 4–5, and stage 5. Eleven effects cover loader drag/entry, whoosh, click, loader completion, XP top-up, tunnel, glass shatter, holding and money burn. Original volume, looping, fade and unlock policies are in `src/audio/AudioManager.ts`. Stage 2 selects mobile/desktop video by coarse pointer. The star overlay selects 480/720 video based on pointer type and shortest viewport dimension. Company cards use the original Nike, ChatGPT, Google, and Spotify clips.

## Responsive behavior

Original UI breakpoints are around 767/768 px. Loader counter uses small viewport height units to match mobile URL-bar behavior. Original reference ratios, responsive camera FOV, atlas anchoring, text scales, touch controls, timeline variants, and media selection are preserved. The reference reloads on crossing the desktop/mobile breakpoint; this is retained until verified replacement resizing can preserve equivalent scene state. Portrait and landscape dimensions must be exercised in validation.

## Intentional boundaries

Cookie consent and analytics are omitted as requested. Reference waitlist services are not reused for writes; the rebuilt flow uses a local adapter with browser storage. No hosting/deployment is configured. Public assets are copied originals. External company and social links retain their reference destinations where appropriate.

## Validation

Browser capture scripts and comparison reports live under `tools/` and `research/`. Screenshots are generated into ignored `research/captures/` so repeated runs do not bloat commits. Captures compare matching viewport sizes, stage progress, and deterministic time/random seeds where applicable. Build checks cover module imports and production bundling; browser checks cover gesture entry, each stage, asset availability, popups, audio controls, mobile UI, and resize. Remaining discrepancies and the measured comparison results are recorded in `VALIDATION.md`.
