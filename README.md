# Zero

A source-based reconstruction of [why.zero.university](https://why.zero.university/), using original assets, recovered scene logic, modular TypeScript components, separate GLSL sources, and Vite HMR.

```sh
npm install
npm run dev
npm run build
npm run preview
```

Draw a zero to enter, then scroll or swipe through the experience. Hold the glowing control when prompted. Explore company markers on the final map.

Architecture: `src/components`, `src/models`, `src/stages`, `src/rendering`, `src/input`, `src/audio`, `src/services`, and `src/shaders`. Extracted resources are under `public/assets` and `public/vendor`. The archived production code is research-only and is never loaded by the app.

Read [the reverse-engineering report](research/REVERSE_ENGINEERING.md) for source provenance, rendering details, stage behavior, controls, and validation methodology. No deployment, analytics, or cookie consent is included.
