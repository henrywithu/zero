# Trapnest Zero

**A space for wonder.** An immersive journey through paper, glass, and possibility, within [Trapnest](https://henrywithu.com/): Life & Art & Science & Technology.

Production URL: **https://zero.henrywithu.com/**. [Trapnest Theory](https://theory.henrywithu.com/) is a sibling project featured in Zero's final map.

Use Node 24:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Draw a zero to enter, then scroll or swipe through five scenes. Hold the glowing control when prompted. On the final map, use desktop controls or mobile drag/pinch and explore the Trapnest journal cards. Sound, 3D geometry, motion, transitions, and interaction physics preserve the original experience.

The origami keepsake flow stores its optional profile **only in this browser**. It does not create a subscription or send emails. Visit the main Trapnest journal to subscribe.

```sh
npm run verify:source
npm run verify:controls                 # requires Vite on localhost:5173 + Chromium
npm run verify:controls -- --mobile
npm run deploy:check                    # build + Workers dry run; no publication
npm run deploy                         # build + deploy once Cloudflare is authenticated
```

See [Cloudflare deployment instructions](docs/DEPLOYMENT.md) for Git integration, domain setup, and local deployment. See [brand and content notes](docs/BRAND.md) for generated assets and journal sources, and [the rebrand validation record](docs/VALIDATION.md) for preservation and deployment checks.

Architecture: modular TypeScript components/services in `src/`, 69 isolated GLSL programs/chunks, and self-hosted resources in `public/`. GLSL updates use live material HMR; TypeScript and CSS use Vite. The [reverse-engineering report](research/REVERSE_ENGINEERING.md) and [original validation record](research/VALIDATION.md) preserve source provenance. Archived code under `research/original/` is never loaded by the app.

The source check validates every original scene/audio/font asset and shader; seven intentional brand replacements are explicitly listed. Recovery/migration tools document the extraction process; do not rerun them as build steps because they can overwrite maintained source. To regenerate only the editorial text atlas and keepsake paper, run `npm run brand:typeset` with the dev server active.
