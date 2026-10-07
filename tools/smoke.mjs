import { chromium } from "playwright-core";
import fs from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => {
  errors.push(e.message);
  console.log("ERROR", e.stack);
});
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warn")
    console.log("CONSOLE", m.type(), m.text().slice(0, 800));
});
page.on("response", (r) => {
  if (r.status() >= 400) console.log("FAILED", r.status(), r.url());
});
await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(20000);
console.log(
  "STATE",
  await page.evaluate(async () => {
    const m = window.__zero;
    return {
      gestureReady: m.zeroGesture.isReady,
      gestureComplete: m.zeroGesture.isComplete,
      stage: m.stageManager._activeIndex,
      assets: Object.keys(m.assetLoader.assets.textures),
      loading: m.assetLoader._stageLoadStatus,
      frame: m.animationFrameId,
      renderer: m.renderer.info.render,
      raf: typeof requestAnimationFrame,
    };
  }),
);
console.log("BODY", await page.locator("body").innerText());
await page.screenshot({ path: "research/captures/local-loader.png" });
await fs.writeFile(
  "research/captures/local-errors.json",
  JSON.stringify(errors),
);
await browser.close();
