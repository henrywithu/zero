import { chromium } from "playwright-core";
import fs from "node:fs/promises";
await fs.mkdir("research/captures", { recursive: true });
const reference = process.argv.includes("--reference"),
  mobile = process.argv.includes("--mobile");
const name = `${reference ? "reference" : "local"}-${mobile ? "mobile" : "desktop"}-fixed`;
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
  viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  hasTouch: mobile,
  isMobile: mobile,
});
page.setDefaultTimeout(90000);
await page.addInitScript(() => {
  Object.defineProperty(window, "devicePixelRatio", { get: () => 0.5 });
  let seed = 42;
  Math.random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
});
const errors = [];
page.on("pageerror", (e) => {
  errors.push(e.message);
  console.log("ERROR", e.message);
});
page.on("console", (m) => {
  if (m.type() === "error")
    console.log("CONSOLE ERROR", m.text().slice(0, 800));
});
if (reference) {
  await page.route("**/*google-analytics.com/**", (r) =>
    r.fulfill({ body: "" }),
  );
  await page.route("**/*googletagmanager.com/**", (r) =>
    r.fulfill({ body: "" }),
  );
  await page.route("**/assets/main-B9-HtP-f.js", async (r) =>
    r.fulfill({
      contentType: "application/javascript",
      body:
        (await fs.readFile("research/original/main.js", "utf8")) +
        `;window.__zero={zeroGesture:Ak,stageManager:oA,assetLoader:mk,renderer:uk,composer:hk,hud:pk,context:$,scrollManager:Gk,gsap:Y,clock:sA,pauseRendering:hA,resumeRendering:gA,cameraRig:Kk,get textPass(){return yk},get frostingPass(){return Sk},get foregroundPass(){return Q}};`,
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
// Gesture and continuous motion are covered by capture-experience. This fixture
// isolates deterministic rendering from browser/GPU wall-clock timing.
await page.evaluate(() => window.__zero.zeroGesture._onZeroComplete());
await page.waitForFunction(
  () =>
    window.__zero.stageManager.segments[window.__zero.stageManager._activeIndex]
      ?.id === "stage1",
  {},
  { timeout: 90000 },
);
console.log(name, "READY");
const states = [];
for (const stage of ["stage1", "stage2", "stage3", "stage4", "stage5"]) {
  if (stage !== "stage1")
    await page.evaluate(async (stage) => {
      const m = window.__zero;
      m.resumeRendering();
      await m.stageManager.navigateToSegment(stage);
    }, stage);
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    const m = window.__zero;
    m.pauseRendering();
    for (const tween of m.gsap.globalTimeline.getChildren(true, true, false)) {
      if (
        tween.isActive() &&
        tween.repeat() === 0 &&
        !tween.targets().some((target) => target && "_loaderOpacity" in target)
      )
        tween.totalProgress(1);
    }
    m.gsap.ticker.sleep();
    m.cameraRig.setEnabled(false);
    if (m.foregroundPass.uniforms.uHoverIntensity)
      m.foregroundPass.uniforms.uHoverIntensity.value = 0;
    for (const video of document.querySelectorAll("video")) {
      video.pause();
      video.currentTime = 0;
    }
  });
  await page.waitForTimeout(200);
  for (const progress of stage === "stage5" ? [0] : [0.15, 0.5, 0.85]) {
    const state = await page.evaluate(async (progress) => {
      const m = window.__zero,
        ctx = m.context,
        segment = m.stageManager.segments[m.stageManager._activeIndex];
      segment.scrub?.(ctx, progress);
      for (let i = 0; i < 180; i++) segment.update?.(ctx, 12, 1 / 60);
      if (segment.id === "stage3") {
        await new Promise((r) => setTimeout(r, 600));
        segment.scrub?.(ctx, progress);
        for (let i = 0; i < 60; i++) segment.update?.(ctx, 12, 1 / 60);
      }
      const syncUniforms = (uniforms) => {
        if (uniforms?.uTime) uniforms.uTime.value = 12;
      };
      ctx.scene.traverse((o) => {
        const materials = Array.isArray(o.material) ? o.material : [o.material];
        for (const material of materials) syncUniforms(material?.uniforms);
      });
      for (const pass of m.composer.passes)
        syncUniforms(pass.uniforms || pass.material?.uniforms);
      m.composer.render(1 / 60);
      const uniforms = (pass) =>
        Object.fromEntries(
          Object.entries(pass.uniforms)
            .filter(
              ([k, v]) =>
                typeof v.value === "number" || typeof v.value === "boolean",
            )
            .map(([k, v]) => [k, v.value]),
        );
      return {
        stage: segment.id,
        progress,
        camera: {
          position: ctx.camera.position.toArray(),
          quaternion: ctx.camera.quaternion.toArray(),
        },
        background: uniforms(ctx.bgPass),
        foreground: uniforms(ctx.fgPass),
        theme: document.body.className,
        body: document.body.innerText,
      };
    }, progress);
    states.push(state);
    console.log(name, stage, progress, state.camera.position);
    await page.screenshot({
      path: `research/captures/${name}-${stage}-${progress}.png`,
    });
  }
}
await fs.writeFile(
  `research/captures/${name}-states.json`,
  JSON.stringify({ states, errors }, null, 2),
);
await browser.close();
