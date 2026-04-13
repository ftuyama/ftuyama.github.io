import assert from 'assert';
import { chromium } from 'playwright';
import { createServer } from 'vite';

describe('JavaScript in browser', () => {
  let viteServer;
  let baseUrl;

  before(async function () {
    this.timeout(120000);
    viteServer = await createServer({
      server: { port: 0, strictPort: false },
    });
    await viteServer.listen();
    const addr = viteServer.httpServer.address();
    const port = typeof addr === 'object' && addr ? addr.port : 5173;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  after(async () => {
    await viteServer?.close();
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
