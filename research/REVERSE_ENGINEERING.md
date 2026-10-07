# Zero reference reconstruction

Reference: https://why.zero.university/ — snapshot inspected 2026-10-07.
Published reference build: 2026-08-10, commit `bdac4e2`, entry `main-B9-HtP-f.js` and stylesheet `main-yeWZtezw.css`.

## Method and provenance

The implementation is based on extracted original assets and recovered application logic. `research/original/` holds an inspectable research snapshot, never imported by the app. Source maps returned 404. `tools/analyze-source.mjs` identifies application bindings and asset paths. `tools/recover-modules.mjs` resolves lexical bindings, removes embedded third-party libraries, names application classes, derives import/export boundaries, and extracts shader programs. Recovered code is then maintained in `src/`; explicit dynamic type boundaries preserve the flexible reference scene state, while the entrance recognizer, scroll input, local service adapter, and shader HMR have typed contracts. There are no unchecked TypeScript files. Regeneration is a research operation, not a build step. The production bundle is neither served nor evaluated by Zero. The separate original debug auto-scroll module is archived as `autoScrollMode.js` and recovered as typed `src/input/AutoScroll.ts`, preserving text-anchor stepping, excluded stage 2, wheel/touch thresholds and GUI parameters. `source-manifest.json` records archive URLs and hashes. The comparison harness runs an instrumented reference page only for validation; the application uses independently imported TypeScript modules.

`asset-manifest.json` records source URL, byte count, and SHA-256 for each original resource. `module-manifest.json` links the initially recovered components to source line intervals and dependencies. `architecture.json` records the current 79-module graph, with zero dependency cycles. `behavior-inventory.json` records stage definitions, explicit text configurations, audio settings, shader hashes, and shader uniforms. `shader-manifest.json` links the 69 extracted shader programs and injection chunks to their originating components. `tools/fetch-assets.py` also expands dynamic origami, company-logo, tool-logo, and video URLs. Missing paths are recorded rather than substituted with invented assets.

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
| Gate 3 → 4 | Automatic | 50 vh | Camera moves through tunnel into white world; green pulse changes to white; ambient music changes. |
| Stage 4 | Wheel/touch | 368 vh | Cloud field, eight atlas text panels, world reveal and camera/map zoom. |
| Stage 5 | Map interaction | 50 vh | Orthographic company map, paper origami avatar, joystick/directional buttons, marker popups, email/profile/share flow. |

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
* **Map:** raycast markers, orthographic pan/zoom, avatar deflection and desktop joystick inertial response. Mobile hides the joystick and directional pad and uses native drag/pinch. Original company videos and tool logos populate the cards.
* **Cursor:** original cursor atlas with grab, grabbed, and interaction states; desktop pointer parallax and optional mobile gyroscope.
* **UI:** original frosted pills, masked gradient edges, subtle inner highlights, audio waveform scaling, status shimmer, scroll dot bobbing and light/dark color transitions.

## Audio and media

Four ambient tracks cover stage 1, stages 2–3, stages 4–5, and stage 5. Ten effects cover loader drag/entry, whoosh, click, loader completion, XP top-up, tunnel, glass shatter, holding and money burn. Original volume, looping, fade and unlock policies are in `src/audio/AudioManager.ts`. Stage 2 selects mobile/desktop video by coarse pointer. The star overlay selects 480/720 video based on pointer type and shortest viewport dimension. Company cards use the original Nike, ChatGPT, Google, and Spotify clips.

## Responsive behavior

Original UI breakpoints are around 767/768 px. Loader counter uses small viewport height units to match mobile URL-bar behavior. Original reference ratios, responsive camera FOV, atlas anchoring, text scales, touch controls, timeline variants, and media selection are preserved. The reference reloads on crossing the desktop/mobile breakpoint; this is retained until verified replacement resizing can preserve equivalent scene state. Portrait and landscape dimensions must be exercised in validation.

## Intentional boundaries

Cookie consent and analytics are omitted as requested. Reference waitlist services are not reused for writes; the rebuilt flow uses a local adapter with browser storage. No hosting/deployment is configured. Public assets are copied originals. External company and social links retain their reference destinations where appropriate.

## Validation

Browser capture scripts and comparison reports live under `tools/` and `research/`. Screenshots are generated into ignored `research/captures/` so repeated runs do not bloat commits. Captures compare matching viewport sizes, stage progress, and deterministic time/random seeds where applicable. Build checks cover module imports and production bundling; browser checks cover gesture entry, each stage, asset availability, popups, audio controls, mobile UI, and resize. Remaining discrepancies and the measured comparison results are recorded in `VALIDATION.md`.

## Resource inventory and loading lifecycle

The checked-in resource set contains **117 original files, 15,819,826 bytes**. The inventory includes 19 GLBs (nine scene models and ten origami animals), nine KTX2 atlases, 27 WebPs, 18 SVGs, 14 MP3s, eight MP4s, four OTFs, nine supplementary TTFs, two PNGs, two JPGs, and five decoder JS/WASM resources. `npm run verify:source` independently hashes each file against the extraction manifest and compares every GLSL template with the archived reference AST. It also checks the numeric interpolation expressions in the petal shader. No original resource in the final manifest has an unresolved fetch error.

The loader retains the source's staged asset registration and GPU upload strategy. It loads the hand/camera scene, typography, and materials first, prewarms the second scene, and loads cloud/world resources before they are needed. Stage assets have readiness promises, explicit texture flushing, and model animation clips. KTX2 capability detection is performed against the actual renderer. The original chunk uploader slices bitmap images into 256 px blocks and uploads one block per tick; it uses immutable WebGL texture allocation, original filtering/wrapping, and mipmap finalization. This is retained because changing texture upload timing affects the initial counter, readiness, and first-frame behavior.

| Asset group | Principal originals | Consumers |
| --- | --- | --- |
| Entrance | `loader_hand.glb`, frost/ice maps, local fonts | LoaderHand, LoaderTextOverlay, FrostingPass, CircleHint |
| First scene | `fancy_hand_2.glb`, `human_hand_1.glb`, `camera_1.glb`, `human_hands.ktx2`, `shards-petals-coins.ktx2` | HandsModel, CoinRing, PetalParticles, background parallax |
| Typography | `texts.ktx2` | TextSprites and per-stage atlas layouts |
| Second scene | `stage2_glass-shatter.glb`, `glass_shards.glb`, `human_hand_2.glb`, `camera_2.glb`, stage-2 desktop/mobile videos | HandsModelTwo, GlassShards, ShatterPass, GlassShardPass |
| Third scene | `tunnel_new_new.glb`, `leather-money-shreds.ktx2`, `board-certificates.ktx2`, certificate matcap | BurnMaterial, paper meshes, tunnel and entrance materials |
| White world | `clouds.ktx2` / `clouds-mobile.ktx2`, `world.ktx2` | CloudField, world plane, map shadow |
| Final map | Original company logos, tool SVGs, four card videos, ten animal GLBs/AO maps | MapScene, CompanyPopup, waitlist preview, referral/share card |
| Overlay video | Original star clips in 480/720 variants | StarOverlay, selected by pointer/viewport policy |

## Timeline, motion, and typography details

Timeline lengths are expressed in viewport-height units. On viewports narrower than 768 px, StageManager multiplies segment bounds by **0.7**, preserving the reference's shorter mobile scroll journey. It clamps manual input to the active segment and releases the clamp during automatic gates. Direct timeline navigation replays each preceding segment's enter/scrub/update/teardown sequence so the requested scene receives the original state; it is not a jump to an arbitrary camera position.

Entrance Gate 0→1 lasts **3.5 seconds**. Gate 1→2 lasts **3 seconds** with a three-second pre-roll when replayed. Gate 3→4 lasts **3 seconds**. Gate 4→5 has a zero-duration automatic handoff. Stages 2 and 4 advance at normalized progress **0.99**. Stages 1 and 3 expose their hold control above **0.95** and hide it again below **0.90**. Stage 1 defaults to a three-second hold; Stage 3 specifies **1.5 seconds** and drives a smoothstep tunnel zoom. Early release animates the progress ring back and restores the appropriate scene/audio state. Short resumable holds retain the reference's timing behavior.

The first two perspective camera movements come from the original GLTF camera animation tracks. Fixed progress comparisons exercise progress 0.15, 0.50, and 0.85. Stage 3 moves the camera down the tunnel and transforms certificate meshes from a scattered field toward their tunnel positions. Money planes retain per-object burn start/end windows, seeded rotation, forward movement, wave amplitude, and progress-shaped burn audio. The tunnel maintains emissive pulses, world-Z bands, near light, exit-plane glow, and entry fading. Stage 4 places its world group at Z=-40 and computes cover scale from the original world aspect and camera FOV. Stage 5 uses an orthographic camera with initial view half-height 2.2, bounded pan targets, exponential smoothing, and scale-aware marker halos.

The narrative is rendered from the original typography atlas rather than recreated as approximate browser text. Original fractional atlas rectangles, UV orientation, sprite scale, aspect, anchor, appearing/disappearing progress, easing, and responsive placement are retained. This preserves the unusual letterforms and line breaks visible in phrases such as “College would”, “land You”, “a JOB”, “This is Bullsh*t”, “zero”, “Real tools that you use everyday”, and “world's most in-demand Careers”. The third stage includes nine explicit text panels, some overlapping near the end; the white-world sequence uses eight panels. Source configurations remain the authority for exact timing and wording. The JSON behavior inventory supplements the recovered layout code without replacing it.

TextSprites uses separate hidden/appearing/visible/disappearing states, with the original exponential/smoothstep easing functions. A separate text scene/pass composites visible atlas sprites over the main scene. The low-quality mode changes text shader defines and render-target scaling. DOM UI fonts remain local: the original display, mono, serif and script faces are used for counters, forms and headings.

## Shader and compositing details

All custom GLSL is isolated under `src/shaders/`; no GLSL programs or injection declarations remain embedded in TypeScript. The source uses GLSL/WebGL2, and no WGSL pipeline was found. Injection chunks remain compatible with Three r160 shader include points. The parameterized petal shader retains the reference's `toFixed` substitutions through explicit placeholders resolved by `interpolateShader`.

| Shader owner | Files | Recovered responsibilities |
| --- | ---: | --- |
| BackgroundPass | 2 | Texture A/B transitions, cover scale, atlas layers and pointer parallax |
| ForegroundPass | 2 | Overlay, reveal, noise, vignette, frost hover and garden god rays |
| TextPass | 2 | Separate text target and scene composite |
| FrostingPass | 5 | Trail accumulation, ice/frost sampling, whiteout, melt and copy operations |
| ShatterPass | 5 | Original glass fracture rendering/compositing |
| GlassShardPass | 4 | Shard geometry/materials and composite operations |
| LensBlurPass | 4 | Source blur kernels and render-target passes |
| TextMaterial / TextSprites | 4 | Atlas UVs and text appearance/disappearance |
| HandsModel | 2 | Hold-induced hand ripple, including built-in-material declarations |
| CoinRing / PetalParticles | 4 | Instanced curved paper motion, swirl, flutter, phase, color and alpha |
| BurnMaterial | Included through recovered paper shader owners | Original burn/ember mask behavior and material setup |
| TunnelMaterials | 8 | Tunnel rings, glow plane, pulse and paper geometry shaders |
| GateThreeToFour | 9 | Pulse bands, entrance fade and custom standard-material injection chunks |
| CloudField | 2 | Instanced cloud field and atlas sampling |
| companies / MapMaterials / MapMarkers | 9 | World material, company markers, halos and tower/ripple effects |
| WaitlistOverlay / OrigamiCertificate | 3 | Preview rendering and AO applied to printed emissive art |
| StarOverlay | 2 | Source video overlay composite |
| MapStages | 2 | Tiled atlas cloud shadow declarations and derivative-aware sampling |

Frosting uses lazily allocated ping-pong render targets, half-float data, pointer intensity, spread direction, and melt/whiteout uniforms. It frees trail targets when deactivated. The map's cloud-shadow sampling preserves derivatives before `fract` wrapping and remaps into the original atlas subrectangle; changing this would create incorrect grey mipmap seams. Certificate materials retain AO on the printed emissive artwork using the original AO UV channel. Tunnel shaders keep world-space Z bands and material cache keys.

Vite watches `.glsl` files and sends a custom shader update instead of reloading the page. ShaderMaterial tracks live custom materials and preserves their uniforms/objects. Built-in materials with `onBeforeCompile` injections have explicit tracking and distinct program cache keys. Updates also cover numeric shader substitutions and materials instantiated after edits. Disposed materials leave the tracking sets. CSS uses Vite's native HMR; TypeScript changes use Vite's module update/reload flow with the reference's session restoration behavior.

## Input, mouse effects, quality, and lifecycle

The entrance recognizer operates on normalized coordinates. Its source thresholds are 20 samples, at most 2,000 coordinate entries, average radius at least 0.02, radius standard deviation / mean no greater than 0.35, angle travel at least 5.76 radians, and endpoint closure within one mean radius. Near-completion triggers at 90% of the angular threshold. Incomplete release clears the stroke. Frost trails and the animated hand are sampled alongside pointer input on the render loop, preserving coalescing and direction feedback.

Desktop mouse movement drives CameraRig, background parallax and a foreground frost/glow spot. Source interpolation and pointer speed decay remain in the render loop. Touch uses normalized coordinates and separate drag/pinch logic. The final map distinguishes a tap from a drag using a five-pixel movement threshold and raycasts the original marker hit planes. On mobile, two pointers suppress single-pointer drag and drive pinch distance/midpoint pan. Desktop has the joystick, zoom buttons, company cycling, wheel zoom and keyboard controls. Map popups stop propagation so their video and Join Beta controls do not drag the canvas underneath.

The original adaptive quality policy is retained. Its 60-frame sample window downgrades above 22 ms, upgrades below 12 ms, and uses a 180-frame cooldown. High/medium tiers cap DPR at 2/1.5; low uses DPR 1. Presets control lens blur, noise, ring segments and text resolution. These policies matter when comparing screenshots: machines can enter different tiers even at the same viewport dimensions. Validation harnesses explicitly record/use reduced DPR where necessary on software rendering; the production check uses normal DPR 1.

Visibility/pagehide saves eligible stage state and pauses rendering/audio. Resume state expires after 30 minutes and excludes the entrance/first stage, matching the reference. WebGL context-loss/restoration handling is retained. Crossing the mobile breakpoint reloads the page; resizing within a tier updates camera projection, composer, blur/glass targets, text, and stage layout. This retains the reference behavior rather than introducing a different transition policy.

## UI, audio, and form behavior

The persistent email control is the expanding original pill cluster: icon, Join Beta pill, back affordance and animated menu. It uses the recovered `osmoNav` curve `M0,0 C0.625,0.05 0,1 1,1`, split-text effects, original menu roll duplication and outside-click behavior. The obsolete HUD menu constructor remains source-derived, while the visible control is the email cluster menu. Its links lead to the original Home, Letters and Why Zero destinations. The unused reference HUD Manifesto URL returned 404 during inspection; no invented manifesto page is added.

Desktop HUD exposes audio and XP; mobile uses XP plus its compact timeline/count menu and omits the desktop audio control. Scene theme classes, XP stroke animation, waveform SVG animation, progress ring, footer placement, masked glass edges, and pointer-event boundaries retain their original styling. The stage-5 rounded frame has 10 px border catchers; map interactions begin inside that inset.

Audio has four looping ambient tracks and ten effects. Stage-1/stage-2 ambience use base volume 0.55; stage-4 uses 1.0 and stage-5 0.7. The drag bed uses volume 0.255 and speed-responsive playback rate. Holding crossfades first/second ambience. Money burn is a quiet loop at 0.05 and is modulated per burning bill. Original fade-in/out, non-muffleable click/whoosh, audio unlock, low-pass muffling, video audio synchronization, and mute state are retained. Browser checks verify controls and loading, while file hashes establish audio identity; audible speaker output cannot be assessed in headless Chromium.

Company popups preserve Nike, OpenAI/ChatGPT, Google and Spotify names, scenarios, roles, descriptions, tool chips and media. They position beside desktop markers and at the mobile center. Card video begins once, updates mute state with the audio manager and stops/resets on close.

Email validation precedes signup. The profile form preserves name, age, city, education selection, conditional university field, optional notes, inline validation, loading state and delayed success transition. Its origami/certificate preview leads to referral copying and a share poster. Share/social buttons retain source URLs; validation opens and closes the local share preview without posting to social services.

The reference's remote waitlist response contract is implemented by `LocalWaitlist.ts`: UUID, animal, position, profile-complete status and referral URL. Records persist in `localStorage`; repeated email lookup returns the existing record. This is a functional local clone, not an integration with Zero's production waitlist. Analytics is disabled and cookie consent is omitted. Replacing the adapter with a separately configured backend can be done without changing UI components.

## Architecture and maintenance boundaries

The app has 79 TypeScript modules with a zero-cycle static import graph. Components own the original DOM/WebGL UI, models own geometry/animation, stages own lifecycle/scrubbing, rendering owns passes/materials, input owns gesture/scroll/camera controls, and services own form persistence. `createExperience` builds the renderer/context and wires these modules once. Native npm packages replace the bundled copies of Three, GSAP, Howler and utility libraries; runtime versions are pinned and the lockfile is checked in. Vite handles development and production compilation.

The preserved scene algorithms retain explicit dynamic type boundaries for reference-shaped context objects. Typed gesture, scroll, service and shader-HMR contracts check their external inputs; the project compiles with TypeScript strict mode and no unchecked-file directives. This balances source fidelity with maintainability without replacing recovered geometry or motion with an approximation.

Recovery scripts are historical source migrations, not app dependencies or build commands. Running `recover-modules`, `type-recovered`, `repair-types`, `refactor-bootstrap`, or extraction migrations again can overwrite maintained code. The normal workflow is editing `src/`, running `npm run build`, checking provenance when originals should remain exact, and using the browser harnesses for behavior changes.

Two source bugs are corrected: loader tweens are killed before disposal to prevent late redraw of a null overlay; deferred stage-three shader compilation tolerates disposed materials and uses activation tokens to prevent geometry being inserted into a later scene. These fixes preserve intended visuals while making rapid timeline navigation reliable. Their original failures were reproduced against the reference and are recorded in the validation report.
