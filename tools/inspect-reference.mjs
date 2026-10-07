import { chromium } from "playwright-core";
import fs from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  env: { ...process.env, HOME: "/tmp/zero-browser-home" },
  args: [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
  proxy: { server: process.env.HTTPS_PROXY },
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  ignoreHTTPSErrors: false,
});
const requests = [];
page.on("response", async (r) => {
  requests.push({
    url: r.url(),
    status: r.status(),
    type: r.request().resourceType(),
  });
});
page.on("console", (m) =>
  console.log("CONSOLE", m.type(), m.text().slice(0, 400)),
);
page.on("pageerror", (e) => console.log("ERROR", e.message));
await page.goto("https://why.zero.university/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
await page.waitForTimeout(45000);
await page.screenshot({ path: "research/captures/reference-loader.png" });
await fs.writeFile("research/captures/initial-dom.html", await page.content());
console.log("BODY", await page.locator("body").innerText());
await fs.writeFile(
  "research/captures/requests.json",
  JSON.stringify(requests, null, 2),
);
await browser.close();
