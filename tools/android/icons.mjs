#!/usr/bin/env node
// The Android app's launcher icons, rendered from the web app's favicon (clients/web/public/favicon.svg, the
// owner's icon.svg without the editor's data) with headless Chrome, as docs/DESIGN.md renders the other PNGs:
// there stays one copy of the drawing. Run it after the logo changes:
//
//   node tools/android/icons.mjs            (CHROME=/path/to/chrome if it is not in the usual place)
//
// It writes, under clients/web/android/app/src/main/res:
// - mipmap-*/ic_launcher_foreground.png: the mark alone, on transparency, for the adaptive icon (Android 8+),
//   whose background is the tile's gradient (drawable/ic_launcher_background.xml, written by hand). The tile's
//   264 units span the 72 dp a launcher shows of the 108, so the mark stays within the 66 dp safe circle.
// - mipmap-*/ic_launcher.png and ic_launcher_round.png: the whole icon, tile included, for Android 7.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../../', import.meta.url).pathname;
const res = join(root, 'clients/web/android/app/src/main/res');
const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const favicon = readFileSync(join(root, 'clients/web/public/favicon.svg'), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
const tile = /<rect x="-32" y="-17" width="264" height="264" rx="59" fill="url\(#bg\)"\/>/;
if (!tile.test(favicon)) {
  throw new Error("favicon.svg's tile is not the one this script knows: update the script with the logo");
}

/** Pixels per dp: mdpi to xxxhdpi. */
const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

const variants = {
  // 264 units in 72 dp of 108: a viewBox 396 wide, centred on the tile's centre (100, 115).
  ic_launcher_foreground: { dp: 108, svg: favicon.replace(tile, '').replace(/viewBox="[^"]*"/, 'viewBox="-98 -83 396 396"') },
  ic_launcher: { dp: 48, svg: favicon },
  ic_launcher_round: { dp: 48, svg: favicon.replace(tile, '<circle cx="100" cy="115" r="132" fill="url(#bg)"/>') },
};

const work = mkdtempSync(join(tmpdir(), 'super-vote-icons-'));
try {
  for (const [name, { dp, svg }] of Object.entries(variants)) {
    for (const [density, scale] of Object.entries(densities)) {
      const size = Math.round(dp * scale);
      // Sized in pixels: Chrome keeps a window some 500 px wide at least, so 100vw is not the icon's size.
      const page = join(work, `${name}-${density}.html`);
      writeFileSync(page, `<!doctype html><style>html,body{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
      execFileSync(chrome, [
        '--headless', '--disable-gpu', '--hide-scrollbars', '--default-background-color=00000000',
        `--window-size=${size},${size}`, `--screenshot=${join(res, `mipmap-${density}`, `${name}.png`)}`, `file://${page}`,
      ], { stdio: 'ignore' });
    }
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
console.log(`Launcher icons written under ${res}`);
