# Deploy Trapnest Zero to Cloudflare Workers

Production domain: **https://zero.henrywithu.com/**. This is a Vite build served directly by Workers Static Assets. No server process, database, runtime secrets, or third-party asset host is required. All fonts, shader resources, models, audio, videos, journal images, and brand images are served from the same origin.

## Cloudflare Git integration

Connect `henrywithu/zero` to **Workers & Pages → Create → Import a repository** and select `main`:

| Setting | Value |
| --- | --- |
| Root directory | `/` (repository root) |
| Worker name | `trapnest-zero` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Node version | `24` |

The checked-in Wrangler configuration serves `dist/` and binds `zero.henrywithu.com` as a Custom Domain. The `henrywithu.com` zone must be active in the same Cloudflare account. Workers can then provision the domain's DNS record and TLS certificate. If `zero.henrywithu.com` already has an existing DNS record or Worker route, resolve that conflict in Cloudflare before deployment. Do not create a CNAME to the main site.

Cloudflare's Git integration supplies deployment credentials. Preview URLs are enabled; the public `workers.dev` route is disabled. Metadata and sharing intentionally retain the production canonical URL in previews.

## Local deployment

Use Node 24 (minimum supported by the app is 22.12), then:

```sh
npm ci
npm run deploy:check   # build + Wrangler dry run; does not publish
npm run dev:worker    # optional production asset preview on port 8787
# In another terminal, while that preview is running:
npm run verify:worker # headers, real 404s, WASM MIME type, and video byte ranges
npx wrangler login    # authenticate on your own machine if needed
npm run deploy       # build + publish to Cloudflare
```

For CI outside Cloudflare's Git integration, supply `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as encrypted CI secrets. The token needs Workers Scripts write access and zone read/DNS write access for the Custom Domain. Never commit credentials.

## Routing, caching, and media

Only `/` is an application page. Missing paths return a real 404, including missing models or decoder files, instead of HTML. `_headers` sets a fresh HTML policy, one-hour caching for assets with stable filenames, and one-day caching for vendors. WASM MIME types are handled by Workers Static Assets. A small media-only Worker supplies single byte-range responses for MP4/MP3 files when the asset binding returns a full body, preserving browser seeking. It delegates other paths directly to Static Assets and does not modify any media files. Media responses use the same headers and cache policy. Current media files are under 1 MiB, so range slicing stays small.

The application uses WebGL, KTX2/Basis, Draco, MP4 video, Howler audio, and optional device orientation. Avoid adding response policies that disable those capabilities. All current files are below Workers' 25 MiB per-asset limit; `npm run deploy:check` validates this before publication.

## Keepsakes and subscriptions

The origami keepsake flow saves its profile **only in the current browser's local storage**. It sends no email and creates no remote membership, subscription, or waitlist. The interface states this. Readers can visit the connected Trapnest journal at `https://henrywithu.com/` to subscribe there. The local record is optional to exploring the experience and is not shared across devices.

## After publishing

Open the production URL on desktop and mobile. Draw a zero, scroll/swipe through the scenes, hold to advance, toggle sound, pan/pinch the final map, and open the journal cards. Check the shared keepsake and the OG image at `/assets/brand/og_image.jpg`. Ensure `/robots.txt`, `/sitemap.xml`, `/site.webmanifest`, and `/favicon.ico` return successfully and a missing `.glb` returns 404.
