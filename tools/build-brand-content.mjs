// Typeset new content in the existing atlas rectangles; scene UVs and effects are unchanged.
import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
const narrative = JSON.parse(await fs.readFile('src/content/narrative.json', 'utf8'));
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
try {
  const page = await browser.newPage();
  await page.route('**/brand-workbench', route => route.fulfill({
    contentType: 'text/html',
    body: '<!doctype html><link rel="stylesheet" href="/src/styles/fonts.css"><link rel="stylesheet" href="/src/styles/interface.css"><body></body>',
  }));
  await page.goto(`${process.env.BASE_URL || 'http://localhost:5173'}/brand-workbench`);
  const assets = await page.evaluate(async ({ regions }) => {
    await Promise.all([
      document.fonts.load('100px "STK Bureau Serif"'),
      document.fonts.load('100px "Bethany Elingston"'),
      document.fonts.load('100px "PP Supply Mono"'),
    ]);
    const atlas = document.createElement('canvas');
    atlas.width = atlas.height = 3072;
    const ctx = atlas.getContext('2d');
    ctx.scale(1.5, 1.5);
    for (const region of regions) {
      const [x, y, w, h] = region.rect;
      ctx.save();
      ctx.translate(x, y);
      if (region.rotate) { ctx.translate(h, 0); ctx.rotate(Math.PI / 2); }
      ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = region.color;
      const lineHeight = h * 0.82 / region.lines.length;
      region.lines.forEach((line, index) => {
        const font = index === region.accent ? 'Bethany Elingston' : 'STK Bureau Serif';
        let size = lineHeight * (font === 'Bethany Elingston' ? 0.92 : 0.85);
        ctx.font = `${size}px "${font}"`;
        size *= Math.min(1, w * 0.92 / ctx.measureText(line).width);
        ctx.font = `${size}px "${font}"`;
        ctx.fillText(line, w / 2, h * 0.09 + lineHeight * (index + 0.52));
      });
      ctx.restore();
    }
    const certificate = document.createElement('canvas');
    certificate.width = 1433; certificate.height = 1024;
    const c = certificate.getContext('2d');
    c.fillStyle = '#f2efe4'; c.fillRect(0, 0, 1433, 1024);
    c.strokeStyle = '#57715f'; c.lineWidth = 1.5;
    for (const inset of [30, 48]) {
      c.beginPath(); c.roundRect(inset, inset, 1433 - inset * 2, 1024 - inset * 2, 18); c.stroke();
    }
    c.textAlign = 'center'; c.fillStyle = '#285b48';
    c.font = '24px "PP Supply Mono"'; c.fillText('TRAPNEST ZERO', 716, 125);
    // Keep y=212 and y=524 free for the existing personalized text overlay.
    c.font = '42px "STK Bureau Serif"'; c.fillText('A space for wonder', 716, 320);
    c.font = '28px "STK Bureau Serif"';
    c.fillText('Paper becomes possibility.', 716, 385);
    c.fillText('A keepsake for the curious.', 716, 650);
    c.font = '20px "PP Supply Mono"';
    c.fillText('LIFE  ·  ART  ·  SCIENCE  ·  TECHNOLOGY', 716, 715);
    const mark = new Image(); mark.src = '/assets/brand/logo.png'; await mark.decode();
    c.drawImage(mark, 656, 775, 120, 120);
    c.font = '19px "PP Supply Mono"'; c.fillText('A WORLD BY HENRY  /  HENRYWITHU.COM', 716, 945);
    return { atlas: atlas.toDataURL(), certificate: certificate.toDataURL() };
  }, narrative);
  for (const [key, data] of Object.entries(assets)) {
    const path = key === 'atlas' ? 'public/assets/brand/narrative-atlas.png' : 'public/assets/brand/keepsake-paper.png';
    await fs.writeFile(path, Buffer.from(data.split(',')[1], 'base64'));
    console.log(`Typeset ${path}`);
  }
} finally { await browser.close(); }
