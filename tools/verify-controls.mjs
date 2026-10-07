import { chromium } from "playwright-core";
import fs from "node:fs/promises";
await fs.mkdir("research/captures", { recursive: true });
import assert from "node:assert/strict";

const mobile = process.argv.includes("--mobile");
const name = mobile ? "mobile" : "desktop";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
const page = await browser.newPage({
  viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  hasTouch: mobile,
  isMobile: mobile,
});
page.setDefaultTimeout(90000);
await page.addInitScript(() =>
  Object.defineProperty(window, "devicePixelRatio", { get: () => 0.25 }),
);
const errors = [],
  failures = [],
  checks = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("response", (r) => {
  if (r.status() >= 400) failures.push({ url: r.url(), status: r.status() });
});
const check = (label) => {
  checks.push(label);
  console.log("PASS", name, label);
};
try {
  await page.goto("http://localhost:5173/");
  await page.waitForFunction(() => window.__zero?.zeroGesture.isReady);
  await page.evaluate(async () => {
    const { v_ } = await import("/src/rendering/QualityManager.ts");
    v_.enabled = false;
  });
  // The real pointer-drawn entrance is covered by capture-experience.mjs.
  await page.evaluate(() => window.__zero.zeroGesture._onZeroComplete());
  await page.waitForFunction(
    () =>
      window.__zero.stageManager.segments[
        window.__zero.stageManager._activeIndex
      ]?.id === "stage1",
  );
  await page.waitForTimeout(2000);
  if (!mobile) {
    await page.locator(".hud-audio-btn").click();
    assert.equal(
      await page.locator(".hud-audio-btn").getAttribute("aria-pressed"),
      "false",
    );
    await page.locator(".hud-audio-btn").click();
    assert.equal(
      await page.locator(".hud-audio-btn").getAttribute("aria-pressed"),
      "true",
    );
    check("audio toggle");
  } else {
    assert.equal(await page.locator(".hud-audio-btn").count(), 0);
    check("reference mobile HUD variant");
  }
  await page.locator(".eg-menu").click();
  assert.equal(
    await page.locator(".eg-menu").getAttribute("aria-expanded"),
    "true",
  );
  await page.locator(".eg-menu").click();
  assert.equal(
    await page.locator(".eg-menu").getAttribute("aria-expanded"),
    "false",
  );
  check("menu opening and toggle dismissal");

  if (!mobile) {
    const file = "src/shaders/BackgroundPass-l_-2.frag.glsl";
    const original = await fs.readFile(file, "utf8");
    await page.evaluate(() => {
      window.__hmrBefore = window.__zero;
      window.__hmrVersion = window.__zero.context.bgPass.material.version;
    });
    try {
      await fs.writeFile(file, original + "\n// Zero HMR verification\n");
      await page.waitForFunction(() =>
        window.__zero.context.bgPass.material.fragmentShader.includes(
          "Zero HMR verification",
        ),
      );
      assert(
        await page.evaluate(
          () =>
            window.__hmrBefore === window.__zero &&
            window.__zero.context.bgPass.material.version > window.__hmrVersion,
        ),
      );
      check("live GLSL update preserves experience and material instance");
    } finally {
      await fs.writeFile(file, original);
    }
    await page.waitForFunction(
      () =>
        !window.__zero.context.bgPass.material.fragmentShader.includes(
          "Zero HMR verification",
        ),
    );
    check("GLSL restoration");
    const dynamicFile = "src/shaders/CoinRing-extracted-58.vert.glsl";
    const dynamicOriginal = await fs.readFile(dynamicFile, "utf8");
    try {
      await fs.writeFile(
        dynamicFile,
        dynamicOriginal + "\n// Parameterized HMR verification\n",
      );
      await page.waitForFunction(() => {
        let found = false;
        window.__zero.context.scene.traverse((o) => {
          if (
            o.material?.vertexShader?.includes("Parameterized HMR verification")
          )
            found = true;
        });
        return found;
      });
      check("parameterized GLSL live update");
    } finally {
      await fs.writeFile(dynamicFile, dynamicOriginal);
    }
  }

  if (!process.argv.includes("--map-only")) {
    await page.evaluate(() => {
      const m = window.__zero.stageManager,
        b = m._segmentBounds[m._activeIndex];
      window.__zero.scrollManager.setScrollImmediate(b.end - 1);
    });
    const hold = page.locator(".next-stage-hit");
    await hold.waitFor({ state: "visible" });
    const rect = await hold.boundingBox();
    await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
    await page.evaluate(() => window.__zero.pauseRendering());
    await page.mouse.down();
    await page.waitForTimeout(150);
    await page.mouse.up();
    assert.equal(
      await page.evaluate(
        () =>
          window.__zero.stageManager.segments[
            window.__zero.stageManager._activeIndex
          ].id,
      ),
      "stage1",
    );
    check("early hold release stays in stage 1");
    await page.evaluate(() => window.__zero.resumeRendering());
    await page.mouse.down();
    await page.waitForFunction(
      () =>
        window.__zero.stageManager.segments[
          window.__zero.stageManager._activeIndex
        ]?.id === "stage2",
    );
    await page.mouse.up();
    check("completed hold advances to stage 2");
  }

  await page.waitForFunction(
    () => !window.__zero.stageManager._isTransitioning,
  );
  await page.evaluate(() =>
    window.__zero.stageManager.navigateToSegment("stage5"),
  );
  await page.waitForFunction(
    () => window.__zero.context.components.markers?.length === 4,
  );
  await page.waitForTimeout(2200);

  if (!mobile) {
    const file = "src/shaders/MapStages-extracted-69.chunk.glsl",
      original = await fs.readFile(file, "utf8");
    const version = await page.evaluate(
      () => window.__zero.context.components.mapMat.version,
    );
    try {
      await fs.writeFile(file, original + "\n// Builtin HMR verification\n");
      await page.waitForFunction(
        (version) => window.__zero.context.components.mapMat.version > version,
        version,
      );
      await page.waitForTimeout(500);
      check("built-in material shader injection HMR");
    } finally {
      await fs.writeFile(file, original);
    }
    await page.waitForTimeout(500);
  }
  const pan = await page.evaluate(() => window.__zero.context._mapPanTarget.x);
  if (!mobile) {
    const knob = await page.locator(".s5-joystick-knob").boundingBox();
    await page.mouse.move(knob.x + knob.width / 2, knob.y + knob.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      knob.x + knob.width / 2 + 30,
      knob.y + knob.height / 2,
      { steps: 8 },
    );
    await page.waitForTimeout(750);
    await page.mouse.up();
    assert.notEqual(
      await page.evaluate(() => window.__zero.context._mapPanTarget.x),
      pan,
    );
    check("joystick pans map");
    const zoom = await page.evaluate(
      () => window.__zero.context._mapZoomTarget,
    );
    await page.locator(".s5-pad-down").click();
    assert.notEqual(
      await page.evaluate(() => window.__zero.context._mapZoomTarget),
      zoom,
    );
    check("zoom control");
  } else {
    assert.equal(await page.locator(".s5-joystick").count(), 0);
    const cdp = await page.context().newCDPSession(page);
    const touch = (type, points) =>
      cdp.send("Input.dispatchTouchEvent", {
        type,
        touchPoints: points.map(([x, y], id) => ({ x, y, id })),
      });
    await touch("touchStart", [[195, 650]]);
    for (let i = 1; i <= 10; i++) {
      await touch("touchMove", [[195 + i * 4, 650 - i * 3]]);
      await page.waitForTimeout(30);
    }
    await touch("touchEnd", []);
    assert.notEqual(
      await page.evaluate(() => window.__zero.context._mapPanTarget.x),
      pan,
    );
    check("native touch drag pans map");
    const zoom = await page.evaluate(
      () => window.__zero.context._mapZoomTarget,
    );
    await touch("touchStart", [
      [125, 650],
      [265, 650],
    ]);
    for (let i = 1; i <= 10; i++) {
      await touch("touchMove", [
        [125 + i * 4, 650],
        [265 - i * 4, 650],
      ]);
      await page.waitForTimeout(30);
    }
    await touch("touchEnd", []);
    assert.notEqual(
      await page.evaluate(() => window.__zero.context._mapZoomTarget),
      zoom,
    );
    check("native pinch zooms map");
  }
  const companies = new Set();
  for (let i = 0; i < 4; i++) {
    if (!mobile) await page.locator(".s5-pad-right").click();
    else {
      await page.touchscreen.tap(25, 130);
      await page.evaluate((i) => {
        const c = window.__zero.context,
          m = c.components.markers[i];
        c._mapZoomTarget = 2.2;
        c._mapPanTarget.x = m.group.position.x;
        c._mapPanTarget.y = m.group.position.y;
        c._mapVelocity.x = 0;
        c._mapVelocity.y = 0;
      }, i);
      await page.waitForTimeout(1200);
      const position = await page.evaluate((i) => {
        const c = window.__zero.context,
          m = c.components.markers[i];
        const v = m.group.position.clone().project(c._stage5OrthoCamera);
        return {
          x: (v.x * 0.5 + 0.5) * innerWidth,
          y: (-v.y * 0.5 + 0.5) * innerHeight,
        };
      }, i);
      await page.touchscreen.tap(position.x, position.y);
    }
    await page.waitForTimeout(400);
    const company = await page
      .locator("[data-company-logo]")
      .getAttribute("alt");
    companies.add(company);
    assert(await page.locator("[data-scenario]").innerText());
    assert(await page.locator("[data-project-image]").evaluate(img => img.complete && img.naturalWidth > 0));
    assert((await page.locator("[data-join]").getAttribute("href")).startsWith("https://henrywithu.com/"));
  }
  assert.equal(companies.size, 4);
  check("four Trapnest project cards, featured images, and journal links");
  await page.screenshot({ path: `research/captures/${name}-trapnest-project.png` });
  // Project CTAs are source links; the independent keepsake pill retains its reveal.
  await page.evaluate(async () => {
    const { OD } = await import('/src/components/CompanyPopupBehavior.ts');
    OD(window.__zero.context._mapPanel);
  });
  await page.locator(".eg-label").click();
  await page.locator(".eg-input").fill("invalid");
  await page.locator(".eg-submit").click();
  assert.equal(await page.locator(".jf-panel").count(), 0);
  check("invalid email does not open profile");
  await page.locator(".eg-input").fill(`zero-${name}@example.com`);
  await page.locator(".eg-submit").click();
  await page.locator(".jf-panel").waitFor({ state: "visible" });
  await page.locator(".jf-submit-btn").click();
  assert(
    (await page.locator(".jf-status").innerText()) ||
      (await page
        .locator('.jf-form [data-field="name"]')
        .getAttribute("class")),
  );
  await page.locator('.jf-form [name="name"]').fill("Zero Test");
  await page.locator('.jf-form [name="age"]').fill("24");
  await page.locator('.jf-form [name="city"]').fill("London");
  await page.locator('[data-field="education"] .jf-select-trigger').click();
  await page.locator('.jf-select-option[data-value="university"]').click();
  await page.locator('.jf-form [name="university"]').fill("Test University");
  await page
    .locator('.jf-form [name="notes"]')
    .fill("Local verification of the recovered form.");
  await page.locator(".jf-submit-btn").click();
  await page.waitForFunction(() =>
    JSON.parse(localStorage.getItem("trapnest-zero:local-keepsakes") || "[]").some(
      (m) => m.profile_complete,
    ),
  );
  const member = await page.evaluate(
    () => JSON.parse(localStorage.getItem("trapnest-zero:local-keepsakes"))[0],
  );
  assert.equal(member.name, "Zero Test");
  assert.equal(member.location, "London");
  assert.equal(member.university, "Test University");
  check("email and profile submission persists locally");
  await page.waitForTimeout(4000);
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.locator('[data-share="copy"]').click();
  assert(
    (await page.evaluate(() => navigator.clipboard.readText())).includes(
      "https://zero.henrywithu.com/",
    ),
  );
  check("Trapnest Zero share link copy");
  await page.locator('[data-share="share"]').click();
  await page.locator(".sp-backdrop").waitFor({ state: "visible" });
  await page.keyboard.press("Escape");
  await page.locator(".sp-backdrop").waitFor({ state: "detached" });
  check("share preview and Escape dismissal");
  await page.screenshot({
    path: `research/captures/${name}-completed-profile.png`,
  });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  check("no horizontal page overflow");
  assert.deepEqual(errors, []);
  assert.deepEqual(failures, []);
  check("no browser errors or failed asset requests");
} finally {
  await fs.writeFile(
    `research/captures/${name}-controls.json`,
    JSON.stringify({ checks, errors, failures }, null, 2),
  );
  await browser.close();
}
