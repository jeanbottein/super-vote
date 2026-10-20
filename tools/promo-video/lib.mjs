// Serves the stage and opens it in headless Chrome, for render.mjs and snap.mjs.
//
// Three of the files the stage asks for are made from the repository as they
// are asked for, so that nothing generated is kept here: app.css (the web
// app's stylesheets), assets/logo.svg (its icon) and assets/qr.svg (a QR code
// that opens super-vote.org).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import QRCode from 'qrcode';
import { appCss } from './app-css.mjs';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const WEB = resolve(ROOT, '../../clients/web');
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const MADE = {
  'app.css': () => appCss(join(WEB, 'src')),
  'assets/logo.svg': () => readFile(join(WEB, 'public/favicon.svg')),
  'assets/qr.svg': () => QRCode.toString('https://super-vote.org', { type: 'svg', errorCorrectionLevel: 'L', margin: 2 }),
};

async function serve() {
  const server = createServer(async (request, response) => {
    try {
      const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).replace(/^\/+/, '') || 'index.html';
      const file = resolve(ROOT, path);
      if (!file.startsWith(ROOT)) throw new Error(`outside the stage: ${path}`);
      const body = MADE[path] ? await MADE[path]() : await readFile(file);
      response.writeHead(200, { 'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream' });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end();
    }
  });
  await new Promise((listening) => server.listen(0, '127.0.0.1', listening));
  return { server, url: `http://127.0.0.1:${server.address().port}/` };
}

/** The stage, built and ready to seek: `query` picks a mode, such as ?fidelity. */
export async function open(query = '') {
  const { server, url } = await serve();
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--force-color-profile=srgb', '--hide-scrollbars'] });
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    reducedMotion: 'no-preference',
    locale: 'en-US',
  });
  const page = await context.newPage();
  page.on('console', (message) => console.log('[page]', message.text()));
  page.on('pageerror', (error) => console.error('[page error]', error.message));
  await page.goto(`${url}index.html${query}`);
  await page.waitForFunction(() => window.promo?.ready === true, null, { timeout: 120000 });
  return {
    page,
    cdp: await context.newCDPSession(page),
    async close() {
      await browser.close();
      server.close();
    },
  };
}
