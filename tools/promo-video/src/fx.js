// Motion helpers on GSAP: captions that pop, slams, taps, confetti, shakes,
// and the per-frame hooks that draw what GSAP does not tween.

import { h, emoji, sentence, between, pick, W } from './util.js';

const { gsap, CustomEase, CustomWiggle, MotionPathPlugin, Physics2DPlugin } = window;
gsap.registerPlugin(CustomEase, CustomWiggle, MotionPathPlugin, Physics2DPlugin);
CustomWiggle.create('wobble', { wiggles: 3, type: 'uniform' });

export { gsap };
export const tl = gsap.timeline({ paused: true });

/** Functions of the time, run after GSAP on every frame: typing, ballots, shakes. */
const hooks = [];
export const onFrame = (fn) => hooks.push(fn);
export const runHooks = (t) => hooks.forEach((fn) => fn(t));

/** Sound cues, read by audio.js: what plays when. */
export const cues = [];
export const cue = (name, t, params = {}) => cues.push({ name, t, ...params });

export const clamp01 = (x) => Math.max(0, Math.min(1, x));
export const lerp = (a, b, p) => a + (b - a) * p;
export const easeOut = (p) => 1 - (1 - p) ** 3;
export const easeInOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

/** Centres an element on (x, y), hidden until a tween shows it. */
export function place(el, x, y, rotation = 0, extra = {}) {
  gsap.set(el, { x, y, xPercent: -50, yPercent: -50, rotation, autoAlpha: 0, ...extra });
  return el;
}

export function caption(parent, text, { x = W / 2, y, cls = '', rot = 0, size, html } = {}) {
  const el = h('div', { class: `cap ${cls}` }, html ?? sentence(text));
  if (size) el.style.fontSize = `${size}px`;
  parent.append(el);
  return place(el, x, y, rot);
}

/** Scales in with an overshoot, its words one after the other. */
export function pop(el, t, { dur = 0.3, stagger = 0.045, from = 0.2, sound = 'pop', pitch = 0 } = {}) {
  tl.fromTo(el, { scale: from, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: dur, ease: 'back.out(2.2)', immediateRender: false }, t);
  const ws = el.querySelectorAll('.w');
  if (ws.length > 1) {
    tl.fromTo(ws, { scale: 0.45, yPercent: 35, autoAlpha: 0 }, { scale: 1, yPercent: 0, autoAlpha: 1, duration: 0.22, ease: 'back.out(1.8)', stagger, immediateRender: false }, t + 0.03);
  }
  if (sound) cue(sound, t, { pitch });
}

export function vanish(el, t, { dur = 0.2 } = {}) {
  tl.to(el, { scale: 0, autoAlpha: 0, duration: dur, ease: 'back.in(2)' }, t);
}

/** Falls onto the stage from above, too big, and lands with a thud on t. */
export function slam(el, t, { rot = 0, from = 2.4, sound = 'slam' } = {}) {
  tl.fromTo(el, { scale: from, autoAlpha: 0, rotation: rot - 10 },
    { scale: 1, autoAlpha: 1, rotation: rot, duration: 0.16, ease: 'power3.in', immediateRender: false }, t - 0.16);
  tl.to(el, { scale: 1.06, duration: 0.07, ease: 'power1.out', yoyo: true, repeat: 1 }, t);
  if (sound) cue(sound, t);
  shake(t, 14, 0.3);
}

/** A slow wobble, for things that should feel alive. */
export function wobble(el, t, dur, deg = 3) {
  tl.to(el, { rotation: `+=${deg}`, duration: dur, ease: 'wobble' }, t);
}

/** The camera shakes: summed decaying oscillations, so shakes may overlap. */
const shakes = [];
export function shake(t, amp = 16, dur = 0.35) {
  shakes.push({ t, amp, dur, a: between(0, 6.28), b: between(0, 6.28) });
}
export function shakeHook(camera) {
  onFrame((t) => {
    let x = 0;
    let y = 0;
    for (const s of shakes) {
      const p = (t - s.t) / s.dur;
      if (p < 0 || p > 1) continue;
      const k = s.amp * (1 - p) ** 2;
      x += k * Math.sin(p * 2 * Math.PI * 4.5 + s.a);
      y += k * 0.8 * Math.sin(p * 2 * Math.PI * 5.5 + s.b);
    }
    camera.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
  });
}

/** A pointing hand and its ripple. The fingertip is at (58, 6) of the 150 px image. */
export function finger(parent) {
  const el = h('div', { class: 'finger' }, emoji('backhand_index_pointing_up', 150));
  const ripple = h('div', { class: 'ripple' });
  parent.append(ripple, el);
  gsap.set(el, { autoAlpha: 0, transformOrigin: '58px 6px' });
  gsap.set(ripple, { autoAlpha: 0 });
  return { el, ripple };
}

export function showFinger(f, t, x, y) {
  tl.fromTo(f.el, { x: x - 58 + 160, y: y - 6 + 260, autoAlpha: 0 },
    { x: x - 58 + 30, y: y - 6 + 40, autoAlpha: 1, duration: 0.2, ease: 'power3.out', immediateRender: false }, t);
}

export function hideFinger(f, t) {
  tl.to(f.el, { x: '+=200', y: '+=320', autoAlpha: 0, duration: 0.22, ease: 'power2.in' }, t);
}

/** Taps (x, y) at t: the hand moves there, presses, and a ripple spreads. */
export function tap(f, x, y, t, { move = 0.2, sound = 'tap' } = {}) {
  tl.to(f.el, { x: x - 58 + 6, y: y - 6 + 22, duration: move, ease: 'power3.inOut' }, t - move - 0.06);
  tl.to(f.el, { x: x - 58, y: y - 6, scale: 0.86, duration: 0.06, ease: 'power2.in' }, t - 0.06);
  tl.to(f.el, { x: x - 58 + 6, y: y - 6 + 22, scale: 1, duration: 0.14, ease: 'power2.out' }, t);
  tl.fromTo(f.ripple, { x, y, scale: 0.25, autoAlpha: 1 }, { scale: 1.5, autoAlpha: 0, duration: 0.42, ease: 'power2.out', immediateRender: false }, t);
  if (sound) cue(sound, t);
}

/** Paper confetti, or emojis, thrown from (x, y). */
export function confetti(parent, t, {
  x, y, count = 60, colors = ['#ff7a5c', '#ffd23f', '#7fe0a3', '#63c7ff', '#c4b2ff', '#ff9ecb', '#2f4ad0'],
  emojis = null, size = 80, angle = -90, spread = 140, velocity = [900, 1800], gravity = 2600, dur = 1.7, sound = 'confetti',
} = {}) {
  for (let i = 0; i < count; i++) {
    const el = emojis ? emoji(pick(emojis), size * between(0.7, 1.15)) : h('div', { class: 'confetti', style: { background: pick(colors) } });
    el.classList.add('abs');
    parent.append(el);
    const scale = emojis ? 1 : between(0.6, 1.3);
    gsap.set(el, { x, y, xPercent: -50, yPercent: -50, autoAlpha: 0, rotation: between(0, 360), scale });
    const start = t + between(0, 0.06);
    tl.set(el, { autoAlpha: 1 }, start);
    tl.to(el, {
      physics2D: { velocity: between(...velocity), angle: angle + between(-spread / 2, spread / 2), gravity },
      rotation: `+=${between(-540, 540)}`,
      ...(emojis ? {} : { rotationX: `+=${between(360, 1080)}` }),
      duration: dur,
      ease: 'none',
    }, start);
    tl.to(el, { autoAlpha: 0, duration: 0.25 }, start + dur - 0.25);
  }
  if (sound) cue(sound, t);
}

/**
 * Where el will be on the stage once `holder` rests at (x, y), unturned and
 * unscaled, in the hooks' state at time t. The transforms of `inner` (a sheet
 * that slides in) are taken at rest too. Nothing seeks the timeline: a tween
 * rendered out of order would keep the wrong starting values.
 */
export function spot(el, holder, rest, t, inner = []) {
  if (t !== undefined) runHooks(t);
  const all = [holder, ...inner];
  const saved = all.map((e) => e.style.transform);
  all.forEach((e) => { e.style.transform = 'none'; });
  const r = el.getBoundingClientRect();
  const c = holder.getBoundingClientRect();
  all.forEach((e, i) => { e.style.transform = saved[i]; });
  const left = rest.x + r.left - c.left;
  const top = rest.y + r.top - c.top;
  return { left, top, width: r.width, height: r.height, x: left + r.width / 2, y: top + r.height / 2 };
}
