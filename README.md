# Zero

A source-based reconstruction of [why.zero.university](https://why.zero.university/), using extracted original assets and recovered scene algorithms. It runs as 79 modular TypeScript components/services, with 69 isolated original GLSL programs/chunks and Vite HMR. The archived production bundle is research-only and is never loaded by the application.

Use Node 22.12+ or 24:

```sh
npm ci
npm run dev
```

Draw a zero to enter, then scroll or swipe through the five stages. Hold the glowing control when prompted. On the final map, use desktop joystick/zoom controls or mobile drag/pinch and tap company markers.

```sh
npm run build
npm run preview
npm run verify:source
```

GLSL edits update live materials while preserving the active scene, including parameterized shaders and Three.js material injections. CSS uses native Vite HMR. TypeScript changes use Vite's update/reload flow.

The signup/profile/referral flow is functional with **local browser storage**; it does not submit to the original production waitlist. No analytics, cookie consent, or deployment is included.

- [Detailed reverse-engineering report](research/REVERSE_ENGINEERING.md): assets, loading, animation/timeline, UI, input, shaders, audio, responsiveness and architecture.
- [Validation record](research/VALIDATION.md): comparisons, passed desktop/mobile/production checks, source bugs fixed and measurement limits.
- [Source manifests](research/asset-manifest.json) and [shader manifest](research/shader-manifest.json): extraction URLs/hashes and original code locations.
- [Current architecture](research/architecture.json) and [behavior inventory](research/behavior-inventory.json): module graph, stage/text/audio settings and shader uniforms.

Normal development edits `src/`. Recovery/migration scripts under `tools/` document the extraction process; do not rerun them as build steps because they can overwrite maintained source. Browser validation commands and Chromium configuration are documented in the validation record.
