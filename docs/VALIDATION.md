# Trapnest Zero validation

Baseline: `856dcfb`, the latest fidelity-preserving commit on remote `main` before the rebrand. Validation uses Chromium with SwiftShader in this cloud environment; device/GPU performance and production DNS/TLS require a check after the user deploys.

## Preserved experience

`npm run verify:source` validates **110 original assets** and **69 original shader programs/chunks** against the extraction hashes. Only seven explicitly listed brand files are replaced. A Git diff against the baseline confirms no changes in the scene/stage logic, camera and scroll controls, motion, audio manager, shaders, models, origami geometry, immersive videos, or original atlas files.

The new scene text is typeset into the original atlas rectangles and retains its anchors, timing, and reveal effects. The personalized keepsake uses new branded paper; its folds and geometry retain the original behavior. Original research attribution is preserved.

## Browser checks

Desktop checks passed for the audio toggle, menu, shader HMR, early hold release, completed hold advancement, joystick, zoom, four project cards and their featured images/links, local keepsake save, share-link copying, share preview, Escape dismissal, and horizontal overflow. Mobile checks passed for hold advancement/release, native map dragging/pinching, project cards, invalid-email handling, **name-only** keepsake saving with optional details left blank, sharing, and overflow. The successful runs reported no browser errors or failed asset requests.

Screenshots cover all five desktop scenes, project cards, keepsakes, and production mobile viewports under ignored `research/captures/`. Review caught and repaired a duplicate counter digit in the keepsake heading and an unsupported text arrow in the project CTA.

The full mobile hold check was rerun alone after a timing-sensitive early-release assertion ran late during simultaneous software-rendered captures. No motion code was changed. A later map/keepsake-only run completed the final mobile assertions.

The production build also passed native touch-drawn entrance, native swipe input, metadata checks, absence of the development inspection API, responsive canvas sizing at 390 × 844, 844 × 390, and 1024 × 768, and no browser errors or failed requests.

## Workers checks

`npm run deploy:check` passed TypeScript, the Vite production build, and the Wrangler dry run with 160 static files and the `ASSETS` binding. The largest asset is approximately 3 MiB, below the 25 MiB per-file limit.

`npm run verify:worker` against local `wrangler dev` passed for:

- Production title and canonical URL.
- OG/logo/favicon, manifest, robots, and sitemap responses.
- Fresh HTML and static-asset cache headers.
- Real 404s for missing model files.
- Correct WASM MIME type.
- MP4/MP3 byte ranges, suffix ranges, invalid-range 416s, and stale `If-Range` handling.

The plain local static-asset server returned 200 for Range requests. The media-only Worker now returns the requested bytes as 206 while leaving all original media bytes unchanged.

## Publication

Prepared for `zero.henrywithu.com` using Workers Custom Domains. No live deployment was performed. The user's Cloudflare account must own the active `henrywithu.com` zone and authenticate the eventual deployment. See [deployment instructions](DEPLOYMENT.md).
