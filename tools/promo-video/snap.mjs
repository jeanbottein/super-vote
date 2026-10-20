// Renders chosen moments as PNGs: node snap.mjs <dir> <seconds>... [--query=?fidelity]
import { mkdirSync } from 'node:fs';
import { open } from './lib.mjs';

const args = process.argv.slice(2);
const query = args.find((a) => a.startsWith('--query='))?.slice(8) ?? '';
const [dir, ...times] = args.filter((a) => !a.startsWith('--'));
mkdirSync(dir, { recursive: true });
const stage = await open(query);
for (const t of times) {
  await stage.page.evaluate((time) => window.promo.seek(time), Number(t));
  await stage.page.screenshot({ path: `${dir}/t${Number(t).toFixed(2).padStart(6, '0')}.png`, type: 'png' });
}
await stage.close();
console.log(`${times.length} frames in ${dir}`);
