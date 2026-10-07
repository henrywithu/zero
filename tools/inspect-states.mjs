import { chromium } from "playwright-core";
import fs from "node:fs/promises";
await fs.mkdir("research/captures", { recursive: true });
const reference = process.argv.includes("--reference");
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  env: { ...process.env, HOME: "/tmp/zero-browser-home" },
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
  ...(reference ? { proxy: { server: process.env.HTTPS_PROXY } } : {}),
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() =>
  Object.defineProperty(window, "devicePixelRatio", { get: () => 0.25 }),
);
page.on("console", (m) => {
  if (["warn", "error"].includes(m.type()))
    console.log(m.type(), m.text().slice(0, 800));
});
page.on("pageerror", (e) => console.log("ERROR", e.stack));
page.on("requestfailed", (r) =>
  console.log("REQUESTFAIL", r.url(), r.failure()),
);
if (reference) {
  await page.route("**/assets/main-B9-HtP-f.js", async (route) => {
    await route.fulfill({
      body:
        (await fs.readFile("research/original/main.js", "utf8")) +
        `;window.__zero={zeroGesture:Ak,stageManager:oA,assetLoader:mk,renderer:uk,composer:hk,hud:pk,context:$,scrollManager:Gk,gsap:Y,clock:sA,get frame(){return cA}};`,
      contentType: "application/javascript",
    });
  });
}
await page.goto(
  reference ? "https://why.zero.university/" : "http://localhost:5173/",
  { waitUntil: "domcontentloaded", timeout: 60000 },
);
for (let i = 0; i < 12; i++) {
  await page.waitForTimeout(5000);
  let state = await page.evaluate(() => {
    const m = window.__zero;
    return !m
      ? {}
      : {
          ready: m.zeroGesture.isReady,
          complete: m.zeroGesture.isComplete,
          stage: m.stageManager._activeIndex,
          assets: Object.keys(m.assetLoader.assets.textures).length,
          models: Object.keys(m.assetLoader.assets.models).length,
          loading: m.assetLoader._stageLoadStatus,
          frame: m.renderer.info.render.frame,
          loader: m.hud.loader.active,
          counter: m.hud.loader.container.innerText,
          drawn: m.zeroGesture.strokePoints.length,
        };
  });
  console.log(i, state);
  if (state.ready) break;
}
await page.screenshot({
  path: `research/captures/${reference ? "reference" : "local"}-ready.png`,
});
await browser.close();
