import { chromium } from "playwright-core";
import fs from "node:fs/promises";
await fs.mkdir("research/captures", { recursive: true });
import assert from "node:assert/strict";
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
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
  deviceScaleFactor: 1,
});
page.setDefaultTimeout(120000);
const errors = [],
  failed = [],
  checks = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("response", (r) => {
  if (r.status() >= 400) failed.push({ url: r.url(), status: r.status() });
});
const check = (label) => {
  checks.push(label);
  console.log("PASS production", label);
};
try {
  await page.goto("http://localhost:4173/", { waitUntil: "domcontentloaded" });
  assert.equal(await page.title(), "Trapnest Zero — A Space for Wonder");
  assert.equal(
    await page.locator('link[rel="canonical"]').getAttribute("href"),
    "https://zero.henrywithu.com/",
  );
  assert.equal(
    await page.locator('meta[property="og:image"]').getAttribute("content"),
    "https://zero.henrywithu.com/assets/brand/og_image.jpg",
  );
  check("production title, canonical URL, and OG metadata");
  await page.locator(".loader-circle-hint.is-visible").waitFor();
  assert.equal(await page.evaluate(() => typeof window.__zero), "undefined");
  check("production loader ready at normal DPR 1; no development API");
  await page.screenshot({
    path: "research/captures/production-portrait-loader.png",
  });
  const cdp = await page.context().newCDPSession(page);
  const touch = (type, points) =>
    cdp.send("Input.dispatchTouchEvent", {
      type,
      touchPoints: points.map(([x, y], id) => ({ x, y, id })),
    });
  const width = 390,
    height = 844,
    cx = width * 0.5,
    cy = height * 0.5,
    rx = width * 0.16,
    ry = height * 0.22;
  await touch("touchStart", [[cx + rx, cy]]);
  for (let i = 1; i <= 85; i++) {
    const angle = (i / 80) * Math.PI * 2;
    await touch("touchMove", [
      [cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry],
    ]);
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(resolve)),
    );
  }
  await touch("touchEnd", []);
  await page.waitForFunction(
    () => !document.body.classList.contains("webgl-loader-overlay"),
  );
  await page.locator(".eg-track").waitFor({ state: "visible" });
  check("native touch-drawn zero enters the production experience");
  await touch("touchStart", [[195, 700]]);
  for (let i = 1; i <= 12; i++) {
    await touch("touchMove", [[195, 700 - i * 25]]);
    await page.waitForTimeout(30);
  }
  await touch("touchEnd", []);
  await page.waitForTimeout(1800);
  await page.screenshot({
    path: "research/captures/production-portrait-stage1.png",
  });
  check("native swipe handled after entrance");
  for (const viewport of [
    { width: 844, height: 390 },
    { width: 1024, height: 768 },
  ]) {
    await page.setViewportSize(viewport);
    await page.locator(".loader-circle-hint.is-visible").waitFor();
    await page.waitForFunction(({ width, height }) => {
      const canvas = document.querySelector("#webgl");
      return canvas?.width === width && canvas?.height === height;
    }, viewport);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.screenshot({
      path: `research/captures/production-${viewport.width}x${viewport.height}.png`,
    });
    check(
      `responsive canvas and no overflow at ${viewport.width}x${viewport.height}`,
    );
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  check("no production browser errors or failed requests");
} finally {
  await fs.writeFile(
    "research/captures/production-checks.json",
    JSON.stringify({ checks, errors, failed }, null, 2),
  );
  await browser.close();
}
