import assert from 'assert';
import { chromium } from 'playwright';
import { build, preview } from 'vite';

describe('JavaScript in browser', () => {
  let previewServer;
  let baseUrl;

  before(async function () {
    this.timeout(120000);
    await build();
    previewServer = await preview({
      preview: { port: 0, strictPort: false },
    });
    const local = previewServer.resolvedUrls?.local?.[0];
    if (!local) {
      throw new Error('Preview server did not expose a local URL');
    }
    baseUrl = local.replace(/\/$/, '');
  });

  after(async () => {
    await previewServer?.close();
  });

  it('should load the home page without uncaught JS errors', async function () {
    this.timeout(120000);
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', (err) => errors.push(err));
      await page.goto(`${baseUrl}/`, { waitUntil: 'load', timeout: 60000 });
      assert.strictEqual(
        errors.length,
        0,
        errors.map((e) => e.stack || e.message).join('\n---\n'),
      );
    } finally {
      await browser.close();
    }
  });
});
