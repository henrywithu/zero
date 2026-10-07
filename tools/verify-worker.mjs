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
