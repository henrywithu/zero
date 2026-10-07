import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
await fs.mkdir("research/captures", { recursive: true });
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
const page = await browser.newPage({ viewport: { width: 960, height: 720 } });
await page.addInitScript(() =>
  Object.defineProperty(window, "devicePixelRatio", { get: () => 0.5 }),
);
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
try {
  await page.goto("http://localhost:5173/#debug&stage=stage1");
  await page.waitForFunction(
    () =>
      window.__zero?.stageManager.isActive &&
      window.__zero.stageManager.segments[
        window.__zero.stageManager._activeIndex
      ]?.id === "stage1" &&
      window.gui?.controllersRecursive().some((c) => c.property === "stepVh"),
    {},
    { timeout: 90000 },
  );
  const before = await page.evaluate(() => {
    const controllers = window.gui.controllersRecursive(),
      controller = controllers.find(
        (c) => c.property === "enabled" && c.object.stepVh === 30,
      );
    controller.setValue(true);
    return {
      position: window.__zero.scrollManager.scrollPos,
      params: { ...controller.object },
    };
  });
  assert.equal(before.params.duration, 2);
  assert.equal(before.params.allowBackward, false);
  await page.mouse.wheel(0, 100);
  const after = await page.evaluate(() => ({
    auto: window.__zero.scrollManager._isAutoScrolling,
    target: window.__zero.scrollManager._autoTarget,
  }));
  assert.equal(after.auto, true);
  assert(after.target > before.position);
  await page.evaluate(() =>
    window.gui
      .controllersRecursive()
      .find((c) => c.property === "enabled" && c.object.stepVh === 30)
      .setValue(false),
  );
  assert.deepEqual(errors, []);
  console.log("PASS recovered debug GUI and text-anchor wheel auto-scroll");
  await fs.writeFile(
    "research/captures/debug-checks.json",
    JSON.stringify(
      {
        checks: [
          "original debug defaults",
          "GUI toggles auto-scroll",
          "wheel starts a forward text-anchor step",
        ],
        errors,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
