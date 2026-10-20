// Builds the stage and its timeline, and lets the renderer seek it frame by frame.
import { ready } from './util.js';
import { tl, runHooks, cues } from './fx.js';
import { build } from './scenes.js';
import { buildFidelity } from './fidelity.js';
import { renderSoundtrack } from './audio.js';

const stage = document.getElementById('camera');
const params = new URLSearchParams(location.search);

/** Everything at time t: GSAP's tweens, the hooks, and the app's own CSS animations. */
function seek(t) {
  tl.seek(t, false);
  runHooks(t);
  for (const animation of document.getAnimations()) {
    animation.pause();
    animation.currentTime = t * 1000;
  }
}

if (params.has('fidelity')) {
  await buildFidelity(stage);
  window.promo = { ready: true, seek() {} };
} else {
  const qr = document.createElement('div');
  qr.id = 'qr-source';
  qr.hidden = true;
  qr.innerHTML = await (await fetch('assets/qr.svg')).text();
  document.body.append(qr);
  const duration = build(stage);
  await ready(document.body);
  seek(0);
  const soundtrack = (withMusic, withSfx = true) => renderSoundtrack(cues, duration, { withMusic, withSfx });
  window.promo = { ready: true, duration, seek, cues, soundtrack };
}
