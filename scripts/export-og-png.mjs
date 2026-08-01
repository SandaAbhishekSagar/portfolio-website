/**
 * Rasterize public/og.svg → public/og.png at 1200×630 for LinkedIn/Twitter.
 * LinkedIn does not render SVG og:image previews.
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(resolve(root, 'public/og.svg'), 'utf8');
const out = resolve(root, 'public/og.png');

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(
  `<!doctype html><html><head><meta charset="utf-8" />
   <style>html,body{margin:0;padding:0;width:1200px;height:630px;overflow:hidden;background:#150E0C}</style>
   </head><body>${svg}</body></html>`,
  { waitUntil: 'load' }
);
await page.locator('svg').waitFor({ state: 'visible' });
await page.screenshot({ path: out, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log('Wrote', out);
