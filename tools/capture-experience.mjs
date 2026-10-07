import { chromium } from "playwright-core";
import fs from "node:fs/promises";
await fs.mkdir("research/captures", { recursive: true });
const reference = process.argv.includes("--reference");
const mobile = process.argv.includes("--mobile");
const name = `${reference ? "reference" : "local"}-${mobile ? "mobile" : "desktop"}`;
const viewport = mobile
  ? { width: 390, height: 844 }
  : { width: 1440, height: 900 };
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
const page = await browser.newPage({
  viewport,
  hasTouch: mobile,
  isMobile: mobile,
});
const errors = [],
  failed = [];
page.setDefaultTimeout(90000);
await page.addInitScript(() => {
  Object.defineProperty(window, "devicePixelRatio", { get: () => 0.25 });
  let seed = 42;
  Math.random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
});
page.on("pageerror", (e) => {
  errors.push(e.message);
  console.log("ERROR", e.stack);
});
page.on("console", (m) => {
  if (m.type() === "error") {
    errors.push(m.text());
    console.log("ERROR", m.text().slice(0, 2000));
  }
});
page.on("response", (r) => {
  if (
    r.status() >= 400 &&
    r.url().includes(reference ? "why.zero" : "localhost")
  ) {
    failed.push(r.url());
    console.log("FAILED", r.status(), r.url());
  }
});
if (reference) {
  await page.route("**/*google-analytics.com/**", (r) =>
    r.fulfill({ body: "", status: 200 }),
  );
  await page.route("**/*googletagmanager.com/**", (r) =>
    r.fulfill({ body: "", status: 200 }),
  );
  await page.route("**/assets/main-B9-HtP-f.js", async (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body:
        (await fs.readFile("research/original/main.js", "utf8")) +
        `;window.__zero={zeroGesture:Ak,stageManager:oA,assetLoader:mk,renderer:uk,composer:hk,hud:pk,context:$,scrollManager:Gk,gsap:Y,clock:sA,pauseRendering:hA,resumeRendering:gA,cameraRig:Kk,get textPass(){return yk},get frostingPass(){return Sk},get foregroundPass(){return Q},get starOverlay(){return Ek}};`,
    }),
  );
}
await page.goto(
  reference ? "https://why.zero.university/" : "http://localhost:5173/",
  { waitUntil: "domcontentloaded", timeout: 60000 },
);
await page.waitForFunction(
  () => window.__zero?.zeroGesture.isReady,
  {},
  { timeout: 90000 },
);
console.log(name, "READY");
await page.waitForTimeout(1500);
await page.screenshot({ path: `research/captures/${name}-loader.png` });
// Exercise the real pointer gesture and automatic entrance gate.
const center = { x: viewport.width * 0.5, y: viewport.height * 0.5 },
  rx = viewport.width * 0.16,
  ry = viewport.height * 0.22;
await page.mouse.move(center.x + rx, center.y);
await page.mouse.down();
for (let i = 1; i <= 85; i++) {
  const a = (i / 80) * Math.PI * 2;
  await page.mouse.move(
    center.x + Math.cos(a) * rx,
    center.y + Math.sin(a) * ry,
  );
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(resolve)),
  );
}
await page.mouse.up();
await page.waitForFunction(
  () =>
    window.__zero?.stageManager.segments[
      window.__zero.stageManager._activeIndex
    ]?.id === "stage1",
  {},
  { timeout: 90000 },
);
console.log(name, "GESTURE ENTERED");
const states = [];
for (const stage of ["stage1", "stage2", "stage3", "stage4", "stage5"]) {
  if (stage !== "stage1")
    await page.evaluate(async (stage) => {
      await window.__zero.stageManager.navigateToSegment(stage);
    }, stage);
  await page.waitForTimeout(stage === "stage4" ? 4500 : 1800);
  for (const progress of stage === "stage5" ? [0] : [0.15, 0.5, 0.85]) {
    await page.evaluate((progress) => {
      const m = window.__zero;
      const b = m.stageManager._segmentBounds[m.stageManager._activeIndex];
      const position = b.start + (b.end - b.start) * progress;
      m.scrollManager.setScrollImmediate(position);
    }, progress);
    await page.waitForTimeout(600);
    const state = await page.evaluate(() => {
      const m = window.__zero;
      return {
        stage: m.stageManager.segments[m.stageManager._activeIndex]?.id,
        progress: m.context._scrollProgress,
        body: document.body.innerText,
        theme: document.body.className,
        camera: {
          position: m.context.camera.position.toArray(),
          quaternion: m.context.camera.quaternion.toArray(),
        },
        canvas: [
          m.context.renderer.domElement.width,
          m.context.renderer.domElement.height,
        ],
      };
    });
    states.push({ ...state, requested: progress });
    console.log(name, stage, progress, state.progress);
    await page.screenshot({
      path: `research/captures/${name}-${stage}-${progress}.png`,
    });
  }
}
await fs.writeFile(
  `research/captures/${name}-states.json`,
  JSON.stringify({ viewport, states, errors, failed }, null, 2),
);
await browser.close();
if (errors.length || failed.length) process.exitCode = 1;
