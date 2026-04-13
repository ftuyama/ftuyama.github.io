/**
 * Capture #header as lossless PNG. Quality = logical viewport × deviceScaleFactor
 * (e.g. 1920×1080 @ scale3 → ~5760×3240 for the full header). Higher scale = sharper
 * text/canvas; file size and capture time grow roughly with scale².
 *
 * Usage:
 *   node scripts/capture-header.mjs                    # build + preview; default scale 3
 *   node scripts/capture-header.mjs --scale=4        # 4× uses 2 vertical tiles (avoids black bands)
 *   CAPTURE_TILE_ROWS=4 CAPTURE_DEVICE_SCALE=4 node scripts/capture-header.mjs
 *   node scripts/capture-header.mjs --no-build
 *   node scripts/capture-header.mjs <url>              # remote URL (optional)
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = dirname(__dirname);

const outPath = `${root}/static/public/images/header-section-hires.png`;
const PREVIEW_PORT = 4173;
const PREVIEW_ORIGIN = `http://127.0.0.1:${PREVIEW_PORT}`;

const VIEWPORT = { width: 1920, height: 1080 };

const args = process.argv.slice(2);
const noBuild = args.includes('--no-build');
const urlArg = args.find((a) => a !== '--no-build' && !a.startsWith('--scale=') && !a.startsWith('--'));

/**
 * @param {string[]} argv
 */
function getDeviceScale(argv) {
  const fromCli = argv.find((a) => a.startsWith('--scale='));
  if (fromCli) {
    const n = Number(fromCli.slice('--scale='.length));
    if (Number.isFinite(n)) return clampScale(n);
  }
  const env = process.env.CAPTURE_DEVICE_SCALE;
  if (env) {
    const n = Number(env);
    if (Number.isFinite(n)) return clampScale(n);
  }
  return 3;
}

/** @param {number} n */
function clampScale(n) {
  return Math.min(4, Math.max(1, Math.round(n)));
}

const DEVICE_SCALE = getDeviceScale(args);

/**
 * Chromium often returns black regions on very large element screenshots. Splitting into
 * horizontal strips (full width × slice height) keeps each GPU readback smaller.
 * @param {number} scale
 */
function getTileRowCount(scale) {
  const env = process.env.CAPTURE_TILE_ROWS;
  if (env) {
    const n = parseInt(env, 10);
    if (Number.isFinite(n)) return Math.min(8, Math.max(1, n));
  }
  return scale >= 4 ? 2 : 1;
}

/**
 * @param {import('sharp').Sharp} sharpMod
 * @param {Buffer[]} pngBuffers
 * @param {string} outPath
 */
async function stitchPngsVertical(sharpMod, pngBuffers, outPath) {
  const metas = await Promise.all(pngBuffers.map((b) => sharpMod(b).metadata()));
  const width = metas[0]?.width ?? 0;
  const composite = [];
  let top = 0;
  for (let i = 0; i < pngBuffers.length; i++) {
    const h = metas[i]?.height ?? 0;
    composite.push({ input: pngBuffers[i], top, left: 0 });
    top += h;
  }
  await sharpMod({
    create: {
      width,
      height: top,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite(composite)
    .png()
    .toFile(outPath);
}

/**
 * @param {import('playwright').Page} page
 * @param {string} outPath
 * @param {number} deviceScale
 */
async function screenshotHeader(page, outPath, deviceScale) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);

  const header = page.locator('#header');
  const box = await header.boundingBox();
  if (!box) {
    throw new Error('#header bounding box not found');
  }

  const rows = getTileRowCount(deviceScale);
  if (rows <= 1) {
    await header.screenshot({ path: outPath, type: 'png' });
    return;
  }

  const buffers = [];
  for (let i = 0; i < rows; i++) {
    const clipY = box.y + (i * box.height) / rows;
    const clipEnd = i === rows - 1 ? box.y + box.height : box.y + ((i + 1) * box.height) / rows;
    const clipH = clipEnd - clipY;
    const buf = await page.screenshot({
      type: 'png',
      clip: {
        x: box.x,
        y: clipY,
        width: box.width,
        height: clipH,
      },
    });
    buffers.push(buf);
  }

  const sharpMod = (await import('sharp')).default;
  await stitchPngsVertical(sharpMod, buffers, outPath);
}

/**
 * @param {string} checkUrl
 * @param {number} maxMs
 */
async function waitForHttp(checkUrl, maxMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      const r = await fetch(checkUrl);
      if (r.ok) return;
    } catch {
      /* retry */
    }
    await delay(250);
  }
  throw new Error(`Timeout waiting for ${checkUrl}`);
}

/**
 * @param {import('playwright').Page} page
 */
async function waitForHeaderReady(page) {
  await page.locator('#header h1').waitFor({ state: 'visible' });

  await page.waitForFunction(
    () => {
      const el = document.querySelector('#large-header');
      if (!el) return false;
      const bg = getComputedStyle(el).backgroundImage;
      return Boolean(bg && bg !== 'none' && bg.includes('url'));
    },
    { timeout: 45_000 },
  );

  const pageUrl = page.url();

  await page.evaluate(async (baseHref) => {
    await document.fonts.ready;

    const el = document.querySelector('#large-header');
    if (!el) return;

    const bi = getComputedStyle(el).backgroundImage;
    const rawUrls = [...bi.matchAll(/url\(["']?([^"')]+)/g)].map((m) => m[1]);

    const absolute = (u) => new URL(u, baseHref).href;

    await Promise.all(
      rawUrls.map(async (u) => {
        try {
          const res = await fetch(absolute(u));
          await res.blob();
          const img = new Image();
          img.src = absolute(u);
          await img.decode();
        } catch {
          /* best-effort */
        }
      }),
    );

    await new Promise((resolve) => {
      if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(() => resolve(undefined), { timeout: 2500 });
      } else {
        setTimeout(resolve, 800);
      }
    });
  }, pageUrl);

  await page.waitForTimeout(400);

  await page
    .waitForFunction(
      () => {
        const canvas = document.getElementById('demo-canvas');
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (!canvas) return false;
        return canvas.width >= w * 0.9 && canvas.height >= h * 0.9;
      },
      { timeout: 25_000 },
    )
    .catch(() => {
      /* reduced-motion / save-data skips canvas setup */
    });

  await page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve(undefined));
        });
      }),
  );
}

let previewChild = null;

try {
  let targetUrl = urlArg ?? `${PREVIEW_ORIGIN}/`;

  if (!urlArg) {
    if (!noBuild) {
      execSync('npm run build', { cwd: root, stdio: 'inherit' });
    }
    previewChild = spawn(
      'npx',
      ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PREVIEW_PORT), '--strictPort'],
      { cwd: root, stdio: 'inherit', shell: true },
    );
    await waitForHttp(`${PREVIEW_ORIGIN}/`);
  }

  const browser = await chromium.launch({
    args: ['--disable-dev-shm-usage'],
  });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE,
    colorScheme: 'dark',
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();

  await page.goto(targetUrl, { waitUntil: 'load', timeout: 90_000 });

  await waitForHeaderReady(page);

  await mkdir(dirname(outPath), { recursive: true });
  await screenshotHeader(page, outPath, DEVICE_SCALE);

  await browser.close();

  const tileRows = getTileRowCount(DEVICE_SCALE);
  console.log(`Wrote ${outPath}`);
  console.log(`Logical viewport: ${VIEWPORT.width}×${VIEWPORT.height}, scale: ${DEVICE_SCALE}`);
  if (tileRows > 1) {
    console.log(`Tiled capture: ${tileRows} strip(s) (workaround for large GPU screenshots)`);
  }
  console.log(`Source: ${targetUrl}`);
} finally {
  if (previewChild) {
    previewChild.kill('SIGTERM');
  }
}
