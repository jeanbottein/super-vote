// The soundtrack, synthesized: a 120 BPM groove in F major (F C Dm Bb) and a
// sound for every cue the scenes registered, rendered offline so that it
// lines up with the frames to the sample.

import { seeded, BEAT, BAR } from './util.js';

const SR = 48000;
const noiseRandom = seeded(77);
const A4 = 440;
const NOTES = { C: -9, 'C#': -8, Db: -8, D: -7, Eb: -6, E: -5, F: -4, 'F#': -3, Gb: -3, G: -2, Ab: -1, A: 0, Bb: 1, B: 2 };
/** 'Bb3' to hertz. */
export function hz(note) {
  const [, name, octave] = note.match(/^([A-G][b#]?)(-?\d)$/);
  return A4 * 2 ** ((NOTES[name] + (Number(octave) - 4) * 12) / 12);
}
const PENTATONIC = ['C6', 'D6', 'E6', 'G6', 'A6', 'C7', 'D7', 'E7'];

let ctx;
let noise;

function noiseBuffer(seconds = 2) {
  const buffer = ctx.createBuffer(1, SR * seconds, SR);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = noiseRandom() * 2 - 1;
  return buffer;
}

/** A gain whose envelope rises in `attack` and decays exponentially for `decay`. */
function envelope(out, t, { attack = 0.002, decay = 0.2, peak = 0.5, hold = 0 }) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + attack);
  if (hold) g.gain.setValueAtTime(peak, t + attack + hold);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + hold + decay);
  g.connect(out);
  return g;
}

function tone(out, t, { type = 'sine', freq, to, glide = 0.05, attack, decay = 0.2, peak = 0.4, hold, detune = 0 }) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + glide);
  o.detune.value = detune;
  o.connect(envelope(out, t, { attack, decay, peak, hold }));
  o.start(t);
  o.stop(t + (attack ?? 0.002) + (hold ?? 0) + decay + 0.05);
  return o;
}

function hiss(out, t, { filter = 'highpass', freq = 3000, to, glide = 0.2, q = 0.8, attack, decay = 0.1, peak = 0.3, hold, offset = 0 }) {
  const s = ctx.createBufferSource();
  s.buffer = noise;
  const f = ctx.createBiquadFilter();
  f.type = filter;
  f.frequency.setValueAtTime(freq, t);
  if (to) f.frequency.exponentialRampToValueAtTime(to, t + glide);
  f.Q.value = q;
  s.connect(f).connect(envelope(out, t, { attack, decay, peak, hold }));
  s.start(t, offset % 1.5);
  s.stop(t + (attack ?? 0.002) + (hold ?? 0) + decay + 0.05);
}

// --------------------------------------------------------------- plucks

const plucks = new Map();
/** Karplus-Strong: a ukulele-ish string, cached per pitch. */
function pluckBuffer(freq, seconds = 1.4, damping = 0.996) {
  const key = `${freq.toFixed(2)}:${damping}`;
  if (plucks.has(key)) return plucks.get(key);
  const random = seeded(Math.round(freq * 100));
  const n = Math.floor(SR * seconds);
  const period = Math.max(2, Math.round(SR / freq - 0.5));
  const ring = new Float32Array(period);
  let previous = 0;
  for (let i = 0; i < period; i++) {
    const white = random() * 2 - 1;
    ring[i] = (white + previous) / 2; // a softer pick
    previous = white;
  }
  const buffer = ctx.createBuffer(1, n, SR);
  const data = buffer.getChannelData(0);
  let index = 0;
  for (let i = 0; i < n; i++) {
    const a = ring[index];
    const b = ring[(index + 1) % period];
    ring[index] = damping * 0.5 * (a + b);
    data[i] = a;
    index = (index + 1) % period;
  }
  plucks.set(key, buffer);
  return buffer;
}

function pluck(out, t, note, peak = 0.2, damping) {
  const s = ctx.createBufferSource();
  s.buffer = pluckBuffer(hz(note), 1.4, damping);
  const g = ctx.createGain();
  g.gain.value = peak;
  s.connect(g).connect(out);
  s.start(t);
}

function marimba(out, t, note, peak = 0.25) {
  const f = hz(note);
  tone(out, t, { freq: f, decay: 0.5, peak });
  tone(out, t, { freq: f * 3.99, decay: 0.07, peak: peak * 0.35 });
  tone(out, t, { freq: f * 10, decay: 0.012, peak: peak * 0.12 });
}

// ------------------------------------------------------------------ drums

const kick = (out, t, peak = 0.9) => {
  tone(out, t, { freq: 150, to: 46, glide: 0.09, decay: 0.32, peak });
  tone(out, t, { type: 'triangle', freq: 900, to: 120, glide: 0.02, decay: 0.02, peak: peak * 0.25 });
};
const clap = (out, t, peak = 0.4) => {
  for (const d of [0, 0.011, 0.023]) hiss(out, t + d, { filter: 'bandpass', freq: 1500, q: 1.1, decay: 0.03, peak });
  hiss(out, t + 0.03, { filter: 'bandpass', freq: 1300, q: 0.9, decay: 0.14, peak: peak * 0.7 });
};
const hat = (out, t, peak = 0.09, open = false) => hiss(out, t, { freq: 8000, decay: open ? 0.16 : 0.035, peak, offset: t * 7.3 });
const snare = (out, t, peak = 0.3) => {
  hiss(out, t, { filter: 'bandpass', freq: 1900, q: 0.7, decay: 0.07, peak, offset: t * 3.1 });
  tone(out, t, { freq: 200, to: 160, glide: 0.04, decay: 0.05, peak: peak * 0.6 });
};
const crash = (out, t, peak = 0.22) => hiss(out, t, { freq: 4500, decay: 1.6, peak, attack: 0.003 });

// ------------------------------------------------------------------ music

const CHORDS = [
  { root: 'F2', notes: ['F3', 'A3', 'C4', 'F4'], melody: ['A4', null, 'C5', 'A4', 'F5', null, 'E5', 'C5'] },
  { root: 'C2', notes: ['E3', 'G3', 'C4', 'E4'], melody: ['G4', null, 'C5', 'G4', 'E5', null, 'D5', 'C5'] },
  { root: 'D2', notes: ['D3', 'F3', 'A3', 'D4'], melody: ['A4', null, 'D5', 'A4', 'F5', null, 'E5', 'D5'] },
  { root: 'Bb1', notes: ['D3', 'F3', 'Bb3', 'D4'], melody: ['Bb4', null, 'D5', 'Bb4', 'F5', null, 'D5', 'C5'] },
];
const octave = (note, by) => note.replace(/-?\d$/, (o) => String(Number(o) + by));

/** Whether t falls in one of [from, to) spans, in seconds. */
const inside = (t, spans) => spans.some(([a, b]) => t >= a - 1e-6 && t < b - 1e-6);

/** plan: when each part plays (scenes.js, MUSIC). */
function music(out, duration, plan) {
  const drums = ctx.createGain();
  drums.gain.value = 1;
  drums.connect(out);
  // Bass and chords duck under each kick, as a sidechain would.
  const ducked = ctx.createGain();
  ducked.connect(out);
  const bass = ctx.createGain();
  bass.gain.value = 0.9;
  bass.connect(ducked);
  const chords = ctx.createGain();
  chords.gain.value = 0.55;
  chords.connect(ducked);
  const lead = ctx.createGain();
  lead.gain.value = 0.5;
  lead.connect(out);
  lead.connect(reverbSend);
  chords.connect(reverbSend);

  const sixteenth = BEAT / 4;
  for (let i = 0; i * sixteenth < duration; i++) {
    const t = i * sixteenth;
    const bar = Math.floor(t / BAR + 1e-6);
    const pos = i % 16; // sixteenth within the bar
    const chord = CHORDS[(((bar - plan.drop / BAR) % 4) + 4) % 4]; // the drop lands on F

    if (inside(t, plan.drums)) {
      if (pos % 4 === 0) {
        kick(drums, t);
        ducked.gain.setValueAtTime(0.45, t);
        ducked.gain.linearRampToValueAtTime(1, t + 0.18);
      }
      if (pos === 4 || pos === 12) clap(drums, t);
      if (pos % 2 === 0) hat(drums, t, pos % 4 === 2 ? 0.08 : 0.05, pos % 4 === 2);
    }
    const [introStart, introEnd] = plan.intro;
    if (inside(t, [plan.intro])) {
      const build = (t - introStart) / (introEnd - introStart);
      if (pos % 2 === 0) hat(drums, t, 0.05 + 0.04 * build, pos % 4 === 2);
      if (pos % 4 === 0) for (const [k, note] of chord.notes.entries()) pluck(chords, t + k * 0.008, octave(note, 1), 0.2 + 0.15 * build, 0.993);
      if (t >= introEnd - 2.5 && pos % 8 === 0) kick(drums, t, 0.7);
      if (t >= introEnd - 0.5 && pos % 2 === 0) snare(drums, t, 0.08 + 0.15 * (t - introEnd + 0.5) / 0.5);
    } else if (!inside(t, plan.drums) && t >= plan.drop && t < plan.end && pos % 4 === 2) {
      hat(drums, t, 0.06); // a break: the off-beats keep time
    }
    if (inside(t, plan.bass) && pos % 2 === 0) {
      const step = pos / 2; // eighth within the bar
      const note = [chord.root, null, chord.root, octave(chord.root, 1), chord.root, null, chord.root, octave(chord.root, 1)][step];
      if (note) {
        const f = hz(note);
        const o = ctx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.value = f;
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.Q.value = 3;
        lp.frequency.setValueAtTime(900, t);
        lp.frequency.exponentialRampToValueAtTime(180, t + 0.16);
        const sub = ctx.createOscillator();
        sub.frequency.value = f;
        o.connect(lp).connect(envelope(bass, t, { attack: 0.004, decay: 0.2, peak: 0.32 }));
        sub.connect(envelope(bass, t, { attack: 0.004, decay: 0.22, peak: 0.28 }));
        o.start(t);
        o.stop(t + 0.3);
        sub.start(t);
        sub.stop(t + 0.3);
      }
    }
    if (inside(t, plan.chords) && [0, 6, 8, 12].includes(pos)) {
      chord.notes.forEach((note, k) => pluck(chords, t + k * 0.009, octave(note, 1), pos === 0 ? 0.13 : 0.1));
    }
    if (inside(t, plan.melody) && pos % 2 === 0) {
      const note = chord.melody[pos / 2];
      const up = t >= plan.higher ? 1 : 0;
      if (note) marimba(lead, t, octave(note, up), 0.22);
    }
  }
  // The end: a last strum, held, and a final hit half a bar later.
  const end = plan.end;
  const hit = end + 1;
  for (const t of [end, end + 0.5, hit]) {
    tone(bass, t, { type: 'sawtooth', freq: hz('F1'), decay: 0.4, peak: 0.12 });
    tone(bass, t, { freq: hz('F2'), decay: t === hit ? 1.2 : 0.4, peak: 0.3 });
  }
  CHORDS[0].notes.forEach((note, k) => pluck(chords, end + k * 0.03, octave(note, 1), 0.16, 0.9985));
  kick(drums, hit, 1);
  crash(drums, hit, 0.18);
  CHORDS[0].notes.forEach((note, k) => pluck(chords, hit + k * 0.012, octave(note, 1), 0.18, 0.9985));
  marimba(lead, hit, 'F5', 0.3);
  marimba(lead, hit, 'A5', 0.22);
  marimba(lead, hit, 'C6', 0.2);
}

// ---------------------------------------------------------------- effects

const SFX = {
  blip: (out, { t, pitch = 0, gain = 1 }) => {
    const f = hz(['A5', 'C6', 'D6', 'E6', 'G6', 'A6'][pitch % 6]);
    tone(out, t, { freq: f * 0.75, to: f * 1.2, glide: 0.05, decay: 0.09, peak: 0.28 * gain });
  },
  pop: (out, { t, pitch = 0 }) => {
    const f = 520 * 2 ** (pitch / 12);
    tone(out, t, { freq: f, to: f * 1.9, glide: 0.045, decay: 0.08, peak: 0.42 });
    hiss(out, t, { freq: 5000, decay: 0.012, peak: 0.12 });
  },
  tick: (out, { t, pitch = 0 }) => tone(out, t, { type: 'triangle', freq: 1800 * 2 ** (pitch / 24), decay: 0.03, peak: 0.12 }),
  key: (out, { t, pitch = 0 }) => hiss(out, t, { filter: 'bandpass', freq: 2600 + (pitch % 5) * 300, q: 1.5, decay: 0.022, peak: 0.22, offset: pitch * 0.13 }),
  tap: (out, { t }) => {
    tone(out, t, { freq: 1700, decay: 0.045, peak: 0.35 });
    tone(out, t, { freq: 2650, decay: 0.025, peak: 0.15 });
  },
  slam: (out, { t }) => {
    tone(out, t, { freq: 170, to: 52, glide: 0.12, decay: 0.26, peak: 0.75 });
    hiss(out, t, { filter: 'lowpass', freq: 1400, decay: 0.09, peak: 0.45 });
  },
  boom: (out, { t, gain = 1 }) => {
    tone(out, t, { freq: 130, to: 36, glide: 0.4, decay: 1.0, peak: 1.0 * gain });
    tone(out, t, { type: 'triangle', freq: 260, to: 70, glide: 0.2, decay: 0.3, peak: 0.3 * gain });
    hiss(out, t, { freq: 3000, decay: 1.3, peak: 0.22 * gain });
    hiss(out, t, { filter: 'lowpass', freq: 900, decay: 0.25, peak: 0.5 * gain });
  },
  suck: (out, { t }) => {
    hiss(out, t, { filter: 'bandpass', freq: 300, to: 5000, glide: 0.45, q: 1.2, attack: 0.42, decay: 0.03, peak: 0.5 });
    tone(out, t, { type: 'triangle', freq: 180, to: 900, glide: 0.45, attack: 0.4, decay: 0.03, peak: 0.12 });
  },
  whoosh: (out, { t, gain = 1 }) => hiss(out, t, { filter: 'bandpass', freq: 700, to: 2600, glide: 0.25, q: 0.9, attack: 0.1, decay: 0.2, peak: 0.32 * gain }),
  swoosh: (out, { t, gain = 1 }) => hiss(out, t, { filter: 'bandpass', freq: 2800, to: 600, glide: 0.3, q: 0.9, attack: 0.08, decay: 0.24, peak: 0.32 * gain }),
  bloop: (out, { t, pitch = 0 }) => {
    const f = hz(PENTATONIC[pitch % PENTATONIC.length]) / 2;
    tone(out, t, { freq: f, to: f * 1.6, glide: 0.07, decay: 0.12, peak: 0.26 });
  },
  mention: (out, { t, mention }) => {
    const note = { Excellent: 'C6', VeryGood: 'A5', Good: 'G5', Fair: 'E5', Passable: 'D5', Inadequate: 'C5', Bad: 'A4' }[mention];
    marimba(out, t, note, 0.4);
  },
  boing: (out, { t }) => {
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(170, t);
    o.frequency.exponentialRampToValueAtTime(340, t + 0.22);
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 17;
    const depth = ctx.createGain();
    depth.gain.setValueAtTime(45, t);
    depth.gain.exponentialRampToValueAtTime(2, t + 0.35);
    lfo.connect(depth).connect(o.frequency);
    o.connect(envelope(out, t, { attack: 0.005, decay: 0.34, peak: 0.3 }));
    o.start(t);
    lfo.start(t);
    o.stop(t + 0.4);
    lfo.stop(t + 0.4);
  },
  coin: (out, { t, pitch = 0, gain = 1 }) => {
    const f = hz(PENTATONIC[pitch % PENTATONIC.length]);
    tone(out, t, { type: 'triangle', freq: f, decay: 0.14, peak: 0.16 * gain });
    tone(out, t + 0.05, { type: 'triangle', freq: f * 1.5, decay: 0.16, peak: 0.12 * gain });
  },
  check: (out, { t, pitch = 0 }) => {
    tone(out, t, { type: 'triangle', freq: 1200, decay: 0.05, peak: 0.2 });
    marimba(out, t + 0.01, ['F5', 'A5', 'C6', 'D6', 'F6'][pitch % 5], 0.3);
  },
  tada: (out, { t }) => {
    ['F5', 'A5', 'C6', 'F6'].forEach((note, i) => {
      tone(out, t + i * 0.045, { type: 'triangle', freq: hz(note), decay: 0.7, peak: 0.16 });
      tone(out, t + i * 0.045, { freq: hz(note) * 2, decay: 0.3, peak: 0.05 });
    });
    hiss(out, t + 0.1, { freq: 7000, decay: 0.5, peak: 0.08 });
  },
  confetti: (out, { t }) => {
    const random = seeded(Math.round(t * 1000));
    for (let i = 0; i < 26; i++) hiss(out, t + random() * 0.7, { freq: 6000, decay: 0.01, peak: 0.07 + random() * 0.06, offset: random() });
  },
  plane: (out, { t }) => {
    hiss(out, t, { filter: 'bandpass', freq: 350, to: 1600, glide: 0.45, q: 0.7, attack: 0.35, decay: 0.45, peak: 0.42 });
    tone(out, t, { type: 'sawtooth', freq: 120, to: 95, glide: 0.8, attack: 0.3, decay: 0.5, peak: 0.05 });
  },
  honk: (out, { t }) => {
    for (const [d, f] of [[0, 330], [0.16, 300]]) {
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1700;
      lp.connect(out);
      tone(lp, t + d, { type: 'sawtooth', freq: f, to: f * 0.92, glide: 0.12, attack: 0.01, hold: 0.05, decay: 0.1, peak: 0.22 });
    }
  },
  drumroll: (out, { t, until }) => {
    const step = 1 / 24;
    for (let x = t; x < until; x += step) snare(out, x, 0.08 + 0.22 * ((x - t) / (until - t)) ** 1.5);
  },
  crash: (out, { t }) => {
    crash(out, t, 0.3);
    kick(out, t, 1);
  },
  ding: (out, { t }) => {
    const f = hz('E6');
    [[1, 0.3, 1.6], [2.76, 0.12, 0.8], [5.4, 0.06, 0.45], [8.93, 0.03, 0.25]].forEach(([ratio, peak, decay]) => tone(out, t, { freq: f * ratio, decay, peak }));
    tone(out, t, { freq: hz('B5'), decay: 1.2, peak: 0.12 });
  },
};

let reverbSend;

function reverb(out) {
  const convolver = ctx.createConvolver();
  const length = SR * 1.8;
  const impulse = ctx.createBuffer(2, length, SR);
  const random = seeded(5);
  for (let c = 0; c < 2; c++) {
    const data = impulse.getChannelData(c);
    for (let i = 0; i < length; i++) data[i] = (random() * 2 - 1) * (1 - i / length) ** 3;
  }
  convolver.buffer = impulse;
  const wet = ctx.createGain();
  wet.gain.value = 0.18;
  convolver.connect(wet).connect(out);
  return convolver;
}

/** Renders the soundtrack, and returns it as a 16-bit stereo WAV, base64. */
export async function renderSoundtrack(cues, duration, plan, { withMusic = true, withSfx = true } = {}) {
  ctx = new OfflineAudioContext(2, Math.ceil(duration * SR), SR);
  noise = noiseBuffer();
  plucks.clear();
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -12;
  limiter.knee.value = 4;
  limiter.ratio.value = 10;
  limiter.attack.value = 0.002;
  limiter.release.value = 0.15;
  limiter.connect(ctx.destination);
  const master = ctx.createGain();
  master.gain.value = 0.8;
  master.connect(limiter);
  reverbSend = reverb(master);
  const musicBus = ctx.createGain();
  musicBus.gain.value = 0.46;
  musicBus.connect(master);
  const sfxBus = ctx.createGain();
  sfxBus.gain.value = 0.7;
  sfxBus.connect(master);
  sfxBus.connect(reverbSend);

  if (withMusic) music(musicBus, duration, plan);
  for (const c of withSfx ? cues : []) {
    if (!SFX[c.name]) throw new Error(`no sound called ${c.name}`);
    SFX[c.name](sfxBus, c);
  }
  const buffer = await ctx.startRendering();
  return wav(buffer);
}

function wav(buffer) {
  const channels = buffer.numberOfChannels;
  const frames = buffer.length;
  const bytes = new DataView(new ArrayBuffer(44 + frames * channels * 2));
  const text = (offset, s) => [...s].forEach((c, i) => bytes.setUint8(offset + i, c.charCodeAt(0)));
  text(0, 'RIFF');
  bytes.setUint32(4, 36 + frames * channels * 2, true);
  text(8, 'WAVE');
  text(12, 'fmt ');
  bytes.setUint32(16, 16, true);
  bytes.setUint16(20, 1, true);
  bytes.setUint16(22, channels, true);
  bytes.setUint32(24, SR, true);
  bytes.setUint32(28, SR * channels * 2, true);
  bytes.setUint16(32, channels * 2, true);
  bytes.setUint16(34, 16, true);
  text(36, 'data');
  bytes.setUint32(40, frames * channels * 2, true);
  const data = [...Array(channels).keys()].map((c) => buffer.getChannelData(c));
  let offset = 44;
  for (let i = 0; i < frames; i++) {
    for (let c = 0; c < channels; c++) {
      const v = Math.max(-1, Math.min(1, data[c][i]));
      bytes.setInt16(offset, v < 0 ? v * 0x8000 : v * 0x7fff, true);
      offset += 2;
    }
  }
  const u8 = new Uint8Array(bytes.buffer);
  let binary = '';
  for (let i = 0; i < u8.length; i += 0x8000) binary += String.fromCharCode(...u8.subarray(i, i + 0x8000));
  return btoa(binary);
}
