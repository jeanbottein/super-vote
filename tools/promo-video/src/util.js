// Shared helpers: the canvas, the beat, seeded randomness, element builders.

export const W = 1080;
export const H = 1920;
export const BPM = 120;
export const BEAT = 60 / BPM; // half a second
export const BAR = 4 * BEAT;

/** A seeded random generator, so that every render draws the same confetti. */
export function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = seeded(2026);
export const between = (min, max) => min + (max - min) * random();
export const pick = (list) => list[Math.floor(random() * list.length)];

/** h('div', { class: 'x', style: { left: '10px' } }, child, 'text') */
export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === 'style' && typeof value === 'object') {
      for (const [name, v] of Object.entries(value)) {
        if (name.startsWith('--')) el.style.setProperty(name, v);
        else el.style[name] = v;
      }
    }
    else if (key === 'html') el.innerHTML = value;
    else if (key in el && typeof value !== 'string') el[key] = value;
    else el.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

/**
 * Microsoft's Fluent Emoji 3D (MIT), at a fixed commit, so that a render only
 * changes when this line does. Never a system emoji font: Apple's are not ours
 * to publish.
 */
const FLUENT = 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/1ffb34c752ecf5d402f04cfb4b392c77f57c54bc/assets';
/** Those that come in skin tones, of which the default one is drawn. */
const TONED = new Set(['backhand_index_pointing_up', 'person_gesturing_no']);

/** 'see-no-evil_monkey' is assets/See-no-evil monkey/3D/see-no-evil_monkey_3d.png. */
export function emojiSrc(name) {
  const folder = encodeURIComponent(name[0].toUpperCase() + name.slice(1).replaceAll('_', ' '));
  return TONED.has(name) ? `${FLUENT}/${folder}/Default/3D/${name}_3d_default.png` : `${FLUENT}/${folder}/3D/${name}_3d.png`;
}

/** An emoji as an image. */
export function emoji(name, size, props = {}) {
  return h('img', { class: `em ${props.class ?? ''}`.trim(), src: emojiSrc(name), alt: '', style: { width: `${size}px`, height: `${size}px`, ...props.style } });
}

/**
 * Words for a caption: "vibe-check :fire:" becomes word spans, each emoji an
 * image the size of the text, so that every word can pop on its own.
 */
export function words(text, { emojiScale = 1.05 } = {}) {
  return text.split(' ').map((word) => {
    const span = h('span', { class: 'w' });
    for (const part of word.split(/(:[a-z0-9_-]+:)/).filter(Boolean)) {
      if (/^:[a-z0-9_-]+:$/.test(part)) {
        span.append(h('img', { class: 'em-inline', src: emojiSrc(part.slice(1, -1)), alt: '', style: { height: `${emojiScale}em`, width: `${emojiScale}em` } }));
      } else {
        span.append(part);
      }
    }
    return span;
  });
}

/** Joins word spans with spaces that break like text. */
export function sentence(text, options) {
  const parts = [];
  words(text, options).forEach((word, index) => {
    if (index > 0) parts.push(' ');
    parts.push(word);
  });
  return parts;
}

/** Resolves when every image under root is decoded, and the fonts are loaded. */
export async function ready(root) {
  await document.fonts.ready;
  await Promise.all([...root.querySelectorAll('img')].map((img) => img.decode().catch(() => {})));
}
