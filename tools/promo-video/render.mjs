// Renders the video: node render.mjs <out.mp4> [--no-music] [--draft] [--fps=60] [--from=0] [--to=35]
// Frames come from headless Chrome one by one (the timeline is seeked, never played),
// the soundtrack from an OfflineAudioContext in the same page, normalized to -14 LUFS.
import { spawn, spawnSync } from 'node:child_process';
import { unlinkSync, writeFileSync } from 'node:fs';
import { open } from './lib.mjs';

const args = process.argv.slice(2);
const flag = (name, fallback) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1] ?? fallback;
const out = args.find((a) => !a.startsWith('--'));
if (!out?.endsWith('.mp4')) {
  console.error('usage: node render.mjs <out.mp4> [--no-music] [--draft] [--fps=60] [--from=0] [--to=35]');
  process.exit(1);
}
const draft = args.includes('--draft');
const withMusic = !args.includes('--no-music');
const fps = Number(flag('fps', draft ? 30 : 60));

const stage = await open();
const { page, cdp } = stage;
const duration = await page.evaluate(() => window.promo.duration);
const from = Number(flag('from', 0));
const to = Number(flag('to', duration));

// The soundtrack, then its loudness: measured, and corrected linearly.
const raw = out.replace(/\.mp4$/, '.raw.wav');
const wav = out.replace(/\.mp4$/, '.wav');
writeFileSync(raw, Buffer.from(await page.evaluate((m) => window.promo.soundtrack(m), withMusic), 'base64'));
const target = 'I=-14:TP=-2:LRA=11';
const measured = spawnSync('ffmpeg', ['-hide_banner', '-i', raw, '-af', `loudnorm=${target}:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
const m = JSON.parse(measured.slice(measured.lastIndexOf('{'), measured.lastIndexOf('}') + 1));
console.log(`soundtrack: ${m.input_i} LUFS, true peak ${m.input_tp} dBTP`);
spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-af',
  `loudnorm=${target}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`,
  '-ar', '48000', wav], { stdio: 'inherit' });
unlinkSync(raw);

const ffmpeg = spawn('ffmpeg', [
  '-y', '-loglevel', 'error',
  '-f', 'image2pipe', '-framerate', String(fps), '-c:v', draft ? 'mjpeg' : 'png', '-i', '-',
  '-ss', String(from), '-t', String(to - from), '-i', wav,
  '-map', '0:v', '-map', '1:a',
  '-vf', 'scale=out_color_matrix=bt709:out_range=tv',
  '-c:v', 'libx264', '-preset', draft ? 'veryfast' : 'slow', '-crf', draft ? '22' : '15', '-pix_fmt', 'yuv420p',
  '-profile:v', 'high', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
  '-c:a', 'aac', '-b:a', '192k',
  '-movflags', '+faststart', '-shortest', out,
], { stdio: ['pipe', 'inherit', 'inherit'] });
const done = new Promise((resolve) => ffmpeg.on('close', resolve));

const frames = Math.round((to - from) * fps);
const started = Date.now();
for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => window.promo.seek(t), from + i / fps);
  const { data } = await cdp.send('Page.captureScreenshot', draft ? { format: 'jpeg', quality: 88, optimizeForSpeed: true } : { format: 'png', optimizeForSpeed: true });
  if (!ffmpeg.stdin.write(Buffer.from(data, 'base64'))) await new Promise((resolve) => ffmpeg.stdin.once('drain', resolve));
  if (i % 120 === 0) console.log(`frame ${i}/${frames}, ${((Date.now() - started) / (i + 1)).toFixed(0)} ms each`);
}
ffmpeg.stdin.end();
const code = await done;
await stage.close();
console.log(code === 0 ? `${out}: ${frames} frames at ${fps} fps` : `ffmpeg failed: ${code}`);
