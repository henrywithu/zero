import assert from "node:assert/strict";
const base = process.env.WORKER_URL || "http://localhost:8787";
const get = (path, init) => fetch(new URL(path, base), init);
const home = await get("/");
assert.equal(home.status, 200);
assert.match(home.headers.get("content-type"), /text\/html/);
assert.equal(home.headers.get("cache-control"), "no-cache");
assert.equal(home.headers.get("x-content-type-options"), "nosniff");
const html = await home.text();
assert.match(html, /Trapnest Zero — A Space for Wonder/);
assert.match(html, /https:\/\/zero\.henrywithu\.com\//);
// Social previews must work from raw HTML, without booting WebGL or JavaScript.
const social = await get("/", {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  },
});
assert.equal(social.status, 200);
const socialHtml = await social.text();
const meta = (key) => {
  const tags = socialHtml.match(/<meta\b[^>]*>/gi) || [];
  const tag = tags.find(
    (tag) => tag.includes(`property="${key}"`) || tag.includes(`name="${key}"`),
  );
  assert(tag, `Missing social metadata: ${key}`);
  return /content="([^"]+)"/.exec(tag)?.[1];
};
const imageUrl = meta("og:image");
assert.equal(imageUrl, meta("og:image:secure_url"));
assert.equal(imageUrl, meta("twitter:image"));
assert.equal(meta("og:image:type"), "image/jpeg");
assert.equal(meta("og:image:width"), "1200");
assert.equal(meta("og:image:height"), "630");
assert(
  socialHtml.indexOf('property="og:image"') < socialHtml.indexOf("<script"),
);
const imagePath = new URL(imageUrl).pathname;
const image = await get(imagePath);
assert.equal(image.status, 200);
assert.match(image.headers.get("content-type"), /^image\/jpeg\b/);
assert.equal(image.headers.get("cf-mitigated"), null);
const imageBytes = new Uint8Array(await image.arrayBuffer());
assert.deepEqual([...imageBytes.slice(0, 3)], [0xff, 0xd8, 0xff]);
assert(imageBytes.length > 10000 && imageBytes.length < 300000);
const imageHead = await get(imagePath, { method: "HEAD" });
assert.equal(imageHead.status, 200);
assert.match(imageHead.headers.get("content-type"), /^image\/jpeg\b/);
console.log(
  "PASS social previews: raw Apple-agent HTML, matching OG/Twitter URLs, JPEG GET/HEAD",
);
for (const path of [
  "/assets/brand/og_image.jpg",
  "/assets/brand/logo.png",
  "/assets/brand/favicon.svg",
  "/favicon.ico",
  "/site.webmanifest",
  "/robots.txt",
  "/sitemap.xml",
]) {
  const response = await get(path);
  assert.equal(response.status, 200, path);
  assert((await response.arrayBuffer()).byteLength > 0, path);
}
const missing = await get("/assets/models/does-not-exist.glb");
assert.equal(missing.status, 404);
const wasm = await get("/vendor/basis/basis_transcoder.wasm");
assert.equal(wasm.status, 200);
assert.match(wasm.headers.get("content-type"), /application\/wasm/);
const range = await get("/assets/videos/stage2_background_video-desktop.mp4", {
  headers: { Range: "bytes=0-1023" },
});
assert.equal(range.status, 206);
assert.match(range.headers.get("content-type"), /video\/mp4/);
assert.match(range.headers.get("content-range"), /^bytes 0-1023\//);
assert.equal((await range.arrayBuffer()).byteLength, 1024);
const suffix = await get("/assets/videos/stage2_background_video-desktop.mp4", {
  headers: { Range: "bytes=-128" },
});
assert.equal(suffix.status, 206);
assert.equal((await suffix.arrayBuffer()).byteLength, 128);
const invalid = await get(
  "/assets/videos/stage2_background_video-desktop.mp4",
  { headers: { Range: "bytes=999999999-" } },
);
assert.equal(invalid.status, 416);
const stale = await get("/assets/videos/stage2_background_video-desktop.mp4", {
  headers: { Range: "bytes=0-1023", "If-Range": '"outdated"' },
});
assert.equal(stale.status, 200);
const audio = await get("/assets/audio/amb_stage1.mp3", {
  headers: { Range: "bytes=0-127" },
});
assert.equal(audio.status, 206);
assert.equal((await audio.arrayBuffer()).byteLength, 128);
const atlas = await get("/assets/brand/narrative-atlas.png");
assert.equal(atlas.headers.get("cache-control"), "public, max-age=3600");
console.log(
  "PASS Workers: root metadata, brand assets, headers, missing-asset 404, WASM MIME type, video byte ranges, and cache policy",
);
