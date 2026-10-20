// The video, scene by scene, on one GSAP timeline (fx.tl). Times are seconds,
// on a 120 BPM grid: a beat is 0.5 s, a bar 2 s, and cuts fall on beats. Each
// scene places its moments from its own start, in T.

import { h, emoji, sentence, between, W, H } from './util.js';
import {
  gsap, tl, onFrame, cue, place, caption, pop, vanish, slam, wobble, shake, shakeHook, finger, showFinger, hideFinger, tap,
  confetti, spot, clamp01, lerp, easeOut, easeInOut,
} from './fx.js';
import * as ui from './ui.js';
import { MENTIONS, approval, judgment, ranks, places } from './ranking.js';

/** Where each scene starts. */
const T = {
  hook: 0, brand: 6, team: 9, method: 23, trip: 29, food: 37, science: 44, blitz: 51, end: 55.5, done: 60,
};

/** What the soundtrack plays when (audio.js): the drop lands on a bar, on F. */
export const MUSIC = {
  intro: [0, 5.5],
  drop: T.brand,
  drums: [[T.brand, 41.75], [42.5, T.science], [T.science + 2, 58]],
  bass: [[T.brand, 58]],
  chords: [[T.brand, 41.75], [42.5, 58]],
  melody: [[10, 18], [24, 29], [31, 36], [T.blitz, T.end]],
  higher: T.blitz, // the melody, an octave up
  end: 58,
};

const FRIENDS = {
  ines: { name: 'Inès', emoji: 'fox', bg: '#ffd9cc', color: '#ff9f80' },
  theo: { name: 'Théo', emoji: 'frog', bg: '#cdeecb', color: '#8fe08a' },
  malik: { name: 'Malik', emoji: 'panda', bg: '#e6e6e6', color: '#cfd5df' },
  zoe: { name: 'Zoé', emoji: 'cowboy_hat_face', bg: '#ffe9a8', color: '#ffd45e' },
  lucas: { name: 'Lucas', emoji: 'alien', bg: '#dcd6ff', color: '#b6a9ff' },
  chloe: { name: 'Chloé', emoji: 'unicorn', bg: '#ffd3ed', color: '#ff9fd6' },
  nathan: { name: 'Nathan', emoji: 'octopus', bg: '#ffd5d5', color: '#ff9494' },
  lea: { name: 'Léa', emoji: 'cat_face', bg: '#ffe8c4', color: '#ffc46b' },
  hugo: { name: 'Hugo', emoji: 'dog_face', bg: '#ecdfd2', color: '#e6b88c' },
  jade: { name: 'Jade', emoji: 'monkey_face', bg: '#eadacb', color: '#dcae86' },
  sami: { name: 'Sami', emoji: 'penguin', bg: '#d2e8ff', color: '#86beff' },
  emma: { name: 'Emma', emoji: 'koala', bg: '#e2e8ee', color: '#b3c2d0' },
};
const SQUAD = Object.values(FRIENDS);

function scene(root, cls, from, to) {
  const el = h('div', { class: `scene ${cls}` });
  root.append(el);
  if (from === 0) gsap.set(el, { autoAlpha: 1 }); // a set at 0 never renders: the playhead starts there
  else tl.set(el, { autoAlpha: 1 }, from);
  if (to !== undefined) tl.set(el, { autoAlpha: 0 }, to);
  return el;
}

/** A scene that slides in over the last one's way out, as in a feed. */
function slideIn(el, at, axis) {
  const from = axis === 'x' ? { x: W } : { y: H };
  tl.fromTo(el, from, { [axis]: 0, duration: 0.34, ease: 'power3.inOut', immediateRender: false }, at);
  gsap.set(el, from);
}

function slideOut(el, at, axis) {
  tl.to(el, { [axis]: axis === 'x' ? -W : -H, duration: 0.34, ease: 'power3.inOut' }, at);
  cue(axis === 'x' ? 'whoosh' : 'swoosh', at);
}

/** A step's caption: a number in a disc, then the words. */
function step(parent, number, text, y, { rot = -2, size, cls = '' } = {}) {
  return caption(parent, '', { y, rot, size, cls, html: [h('span', { class: 'num' }, number), ...sentence(text)] });
}

/**
 * A floating piece of the app at a zoom. GSAP moves the unzoomed holder: a
 * zoomed element's own translation would be zoomed too.
 */
function card(parent, zoom, ...content) {
  const app = ui.app(390, zoom, ...content);
  app.classList.add('card');
  const holder = h('div', { class: 'abs' }, app);
  parent.append(holder);
  return holder;
}

function sticker(parent, name, size, x, y, rot = 0) {
  const el = emoji(name, size);
  el.classList.add('abs');
  parent.append(el);
  return place(el, x, y, rot);
}

function phone(z) {
  const screen = ui.screen();
  const status = h('div', { class: 'statusbar' }, h('span', {}, '9:41'), h('span', {
    style: { display: 'flex' },
    html: '<svg viewBox="0 0 78 13"><g fill="#111"><rect x="0" y="8" width="3" height="5" rx="1"/><rect x="5" y="5.5" width="3" height="7.5" rx="1"/><rect x="10" y="3" width="3" height="10" rx="1"/><rect x="15" y="0.5" width="3" height="12.5" rx="1"/><path d="M29.5 3.2a9.5 9.5 0 0 1 13 0l-1.6 1.7a7.2 7.2 0 0 0-9.8 0zm2.6 2.8a5.8 5.8 0 0 1 7.8 0l-1.6 1.7a3.5 3.5 0 0 0-4.6 0zM36 12.5l-2.3-2.4a3.2 3.2 0 0 1 4.6 0z"/><rect x="50" y="1" width="24" height="11.5" rx="3.5" fill="none" stroke="#111" stroke-opacity=".4"/><rect x="52" y="3" width="17" height="7.5" rx="2"/><rect x="75.5" y="4.5" width="1.6" height="4.5" rx=".8" fill-opacity=".4"/></g></svg>',
  }));
  const glass = h('div', { class: 'glass' }, status, screen.root, h('div', { class: 'island' }));
  const el = h('div', { class: 'phone', style: { '--z': z } }, glass);
  return { el, ...screen, width: 390 * z + 32 };
}

/** Ballots landing one by one: how many have landed, and the glide since the last. */
function arrivals(times, glide = 0.28) {
  return (t) => {
    let k = 0;
    while (k < times.length && times[k] <= t) k++;
    const p = k === 0 ? 1 : easeOut(clamp01((t - times[k - 1]) / glide));
    return { k, p };
  };
}

function slotsOf(measures) {
  return places(ranks(measures));
}

// ----------------------------------------------------------------------------
// 1. The group chat, 0-6 s: everyone talks, nobody decides.

const CHAT = [ // the first three are already there when the video starts
  ['hugo', 'tournament is SATURDAY :trophy:', 0],
  ['sami', "we're so in :fire::fire:", 0],
  ['zoe', 'and we still have no team name :skull:', 0],
  ['ines', 'ok we NEED a team name', 0.2],
  ['theo', 'Dragon Rouge :dragon::fire:', 0.75],
  ['malik', "C'est pas faux", 1.3],
  ['zoe', 'Survivors??', 1.8],
  ['theo', 'DRAGON ROUGE', 2.2],
  ['lucas', 'wait what are we voting on', 2.6],
  ['malik', "c'est pas faux.", 2.95],
  ['chloe', 'can we just vote', 3.3],
  ['ines', 'vote HOW :loudly_crying_face:', 3.6],
  ['zoe', ':skull::skull::skull:', 3.85],
  ['nathan', 'brb', 4.05],
  ['theo', 'DRAGON. ROUGE.', 4.25],
  ['lea', 'omg', 4.42],
  ['malik', "C'EST PAS FAUX", 4.57],
  ['lucas', '???', 4.7],
  ['chloe', ':melting_face:', 4.82],
  ['zoe', 'SURVIVORS', 4.93],
  ['hugo', 'lol', 5.03],
  ['ines', ':skull:', 5.12],
];

function hookScene(root) {
  const s = scene(root, 'chat-bg', T.hook, T.brand + 0.1);
  const mask = h('div', { class: 'layer chat-mask' });
  const thread = h('div', { class: 'thread' });
  mask.append(thread);
  s.append(mask);
  const messages = CHAT.map(([who, text]) => {
    const friend = FRIENDS[who];
    return h('div', { class: 'msg' },
      h('div', { class: 'avatar', style: { background: friend.bg } }, emoji(friend.emoji, 78)),
      h('div', {}, h('div', { class: 'msg-name', style: { color: friend.color } }, friend.name), h('div', { class: 'bubble' }, sentence(text))));
  });
  thread.append(...messages);
  const bottom = 1500;
  const bottomOf = (m) => m.offsetTop + m.offsetHeight;
  gsap.set(thread, { y: bottom - bottomOf(messages[2]) });
  messages.forEach((m, i) => {
    const t = CHAT[i][2];
    if (i < 3) return;
    gsap.set(m, { autoAlpha: 0 });
    tl.fromTo(m, { scale: 0.35, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.22, ease: 'back.out(2)', immediateRender: false }, t);
    tl.to(thread, { y: bottom - bottomOf(m), duration: 0.16, ease: 'power2.out' }, t);
    cue('blip', t, { pitch: i % 6, gain: i > 12 ? 0.6 : 1 });
  });

  const title = caption(s, 'POV: your group chat picking a team name', { y: 250, rot: -2, cls: 'wrap', size: 84 });
  title.style.width = '880px';
  title.style.textAlign = 'center';
  gsap.set(title, { autoAlpha: 1 });
  tl.fromTo(title, { scale: 1 }, { scale: 1.04, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.out' }, 0.05);

  const num = h('span', { class: 'num' }, '23');
  const counter = h('div', { class: 'counter' }, emoji('speech_balloon', 60), num, ' messages · ', h('span', { class: 'zero' }, '0 decisions'));
  s.append(counter);
  place(counter, 540, 500, 1.5, { autoAlpha: 1 });
  onFrame((t) => {
    if (t > T.brand) return;
    num.textContent = String(Math.round(lerp(23, 147, clamp01(t / 5.1) ** 2)));
  });

  // Everything spirals into the middle, where the logo lands.
  const vortex = T.brand - 0.64;
  const y = bottom - bottomOf(messages[messages.length - 1]);
  [...messages].reverse().forEach((m, i) => {
    const cx = 40 + m.offsetWidth / 2;
    const cy = y + m.offsetTop + m.offsetHeight / 2;
    tl.to(m, {
      x: 540 - cx, y: 900 - cy, scale: 0.05, rotation: between(-300, 300), duration: 0.42, ease: 'power3.in',
    }, vortex + i * 0.012);
  });
  tl.to([title, counter], { x: 540, y: 900, scale: 0.05, rotation: 200, duration: 0.42, ease: 'power3.in' }, vortex + 0.05);
  shake(4.2, 6, 1.2);
  cue('suck', vortex);
}

// ----------------------------------------------------------------------------
// 2. The brand, 6-9 s.

function brandScene(root) {
  const t0 = T.brand;
  const s = scene(root, '', t0 - 0.22, T.team + 0.1);
  const ground = h('div', { class: 'layer ink-bg' });
  const rays = h('div', { class: 'rays' });
  ground.append(rays);
  s.append(ground);
  gsap.set(ground, { clipPath: 'circle(0% at 50% 40%)' });
  tl.to(ground, { clipPath: 'circle(150% at 50% 40%)', duration: 0.24, ease: 'power2.in' }, t0 - 0.16);
  const behind = h('div', { class: 'layer' });
  s.append(behind);
  tl.fromTo(rays, { rotation: 0 }, { rotation: 55, duration: 3.4, ease: 'none' }, t0 - 0.22);

  const logo = h('img', { class: 'logo-big', src: 'assets/logo.svg', alt: '' });
  s.append(logo);
  place(logo, 540, 760);
  tl.fromTo(logo, { scale: 0, rotation: -40, autoAlpha: 1 }, { scale: 1.2, rotation: 8, duration: 0.22, ease: 'power3.out', immediateRender: false }, t0 - 0.2);
  tl.to(logo, { scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' }, t0 + 0.02);
  cue('boom', t0);
  shake(t0, 34, 0.55);
  confetti(behind, t0, { x: 540, y: 760, count: 70, angle: -90, spread: 360, velocity: [900, 2000], gravity: 2200, dur: 1.9 });
  const flash = h('div', { class: 'flash' });
  s.append(flash);
  tl.fromTo(flash, { autoAlpha: 0.75 }, { autoAlpha: 0, duration: 0.3, ease: 'power2.out', immediateRender: false }, t0);
  gsap.set(flash, { autoAlpha: 0 });

  const word = h('div', { class: 'wordmark' }, [...'super-vote'].map((c) => h('span', {}, c)));
  s.append(word);
  place(word, 540, 1100, 0, { autoAlpha: 1 });
  const letters = word.querySelectorAll('span');
  gsap.set(letters, { autoAlpha: 0 });
  tl.fromTo(letters, { y: -300, autoAlpha: 0, rotation: () => between(-50, 50) },
    { y: 0, autoAlpha: 1, rotation: 0, duration: 0.42, ease: 'back.out(2.2)', stagger: 0.032, immediateRender: false }, t0 + 0.2);
  for (let i = 0; i < 10; i += 3) cue('tick', t0 + 0.28 + i * 0.032, { pitch: i });

  const tagline = caption(s, 'decide together.', { y: 1330, rot: -3 });
  pop(tagline, t0 + 0.9);
  const stamp = caption(s, 'no drama.', { y: 1490, rot: 7, cls: 'coral' });
  slam(stamp, t0 + 1.5, { rot: 7 });
  wobble(logo, t0 + 0.7, 1.6, 4);

  slideOut(s, T.team - 0.28, 'y');
}

// ----------------------------------------------------------------------------
// 3. The team's name, 9-23 s: ask, share, grade, watch.

const TEAM = ["C'est pas faux", 'Survivors', 'Dragon Rouge'];
const TEAM_BALLOTS = [ // C'est pas faux, Survivors, Dragon Rouge; the first is the viewer's
  ['Passable', 'VeryGood', 'Excellent'],
  ['Fair', 'VeryGood', 'Excellent'],
  ['Inadequate', 'Fair', 'Excellent'],
  ['Passable', 'Good', 'Excellent'],
  ['Bad', 'Good', 'Excellent'],
  ['Passable', 'VeryGood', 'Good'],
  ['Good', 'Excellent', 'Inadequate'],
  ['Inadequate', 'VeryGood', 'Good'],
  ['VeryGood', 'VeryGood', 'Fair'],
  ['Good', 'Excellent', 'Bad'],
  ['Fair', 'Good', 'Inadequate'],
  ['Passable', 'VeryGood', 'Good'],
];

function teamScene(root) {
  const t0 = T.team;
  const at = (x) => t0 + x;
  const s = scene(root, 'cream-bg', at(-0.28), T.method + 0.35);
  slideIn(s, at(-0.28), 'y');
  const hand = finger(s);

  // Ask: the form on a phone.
  const z = 1.75;
  const ph = phone(z);
  s.append(ph.el);
  ph.el.classList.add('abs');
  const phoneX = (W - ph.width) / 2;
  gsap.set(ph.el, { x: phoneX, y: 2000, rotation: 6 });
  const form = ui.createForm();
  ph.page.append(form.el);
  tl.to(ph.el, { y: 470, rotation: -1.5, duration: 0.5, ease: 'back.out(1.25)' }, at(0));
  cue('whoosh', at(0));

  const ask = step(s, '1', 'ask the question', 290);
  pop(ask, at(0.15));

  const typing = [
    { field: 'title', text: 'Team name?', from: at(0.5), to: at(0.9) },
    { field: 0, text: "C'est pas faux", from: at(1.0), to: at(1.4) },
    { field: 1, text: 'Survivors', from: at(1.5), to: at(1.75) },
    { field: 2, text: 'Dragon Rouge', from: at(1.85), to: at(2.15) },
  ];
  for (const { text, from, to } of typing) {
    for (let i = 0; i < text.length; i += 2) cue('key', from + ((to - from) * i) / text.length, { pitch: i });
  }
  const share = at(3);
  onFrame((t) => {
    if (t < at(-0.3) || t > share + 0.1) return;
    let question = '';
    const options = [];
    let focus = null;
    for (const { field, text, from, to } of typing) {
      const typed = text.slice(0, Math.round(clamp01((t - from) / (to - from)) * text.length));
      if (t >= from - 0.06) focus = field;
      if (field === 'title') question = typed;
      else if (t >= from - 0.06) options[field] = typed;
    }
    form.set({ question, options, focus: t > at(2.2) ? null : focus });
    form.button.classList.toggle('pressed', t >= at(2.56) && t < at(2.68));
  });

  // Scroll down to the button, and tap it.
  form.set({ question: 'Team name?', options: [...TEAM], focus: null });
  const screenTop = 470 + 16 + 54 * z;
  const buttonRect = form.button.getBoundingClientRect();
  const scrollerRect = ph.scroller.getBoundingClientRect();
  const buttonY = (buttonRect.top + buttonRect.height / 2 - scrollerRect.top) / z;
  const scroll = buttonY - (1330 - screenTop) / z;
  tl.to(ph.scroller, { y: -scroll, duration: 0.18, ease: 'power2.inOut' }, at(2.25));
  showFinger(hand, at(1.9), 540, 1330);
  tap(hand, 540, 1330, at(2.6));
  hideFinger(hand, at(2.8));

  // Share: the poll's page, and its sheet.
  const pollPage = h('div', { style: { display: 'contents' } }, ui.pollTop({ title: 'Team name?', system: 'Majority judgment' }));
  ph.page.append(pollPage);
  const backdrop = h('div', { class: 'backdrop' });
  const qr = document.getElementById('qr-source').innerHTML.replace('<svg ', '<svg width="192" height="192" ');
  const sheet = ui.shareSheet({ code: 'VYB-CHK', url: 'https://super-vote.org/p/Xq7rLm2pK9vBw4ZcR8nYaA', qr });
  ph.root.append(backdrop, sheet);
  gsap.set(backdrop, { autoAlpha: 0 });
  gsap.set(sheet, { yPercent: 105 });
  const grade = at(5);
  onFrame((t) => {
    if (t < at(-0.3) || t > grade + 0.5) return;
    form.el.hidden = t >= share;
    pollPage.hidden = t < share;
  });
  tl.set(ph.scroller, { y: 0 }, share);
  tl.to(ph.el, { y: 120, duration: 0.5, ease: 'power3.inOut' }, share + 0.1);
  tl.to(backdrop, { autoAlpha: 1, duration: 0.2 }, share + 0.2);
  tl.to(sheet, { yPercent: 0, duration: 0.32, ease: 'power3.out' }, share + 0.2);
  cue('swoosh', share + 0.2, { gain: 0.6 });
  vanish(ask, share);
  const shareIt = step(s, '2', 'share it', 250, { rot: 2 });
  pop(shareIt, share + 0.15);

  // The squad flies in.
  const code = spot(sheet.querySelector('.join-code'), ph.el, { x: phoneX, y: 120 }, share + 0.7, [sheet]);
  SQUAD.slice(0, 11).forEach((friend, i) => {
    const angle = (i / 11) * Math.PI * 2 + 0.3;
    const face = emoji(friend.emoji, 130);
    face.classList.add('abs');
    s.append(face);
    gsap.set(face, { x: 540 + Math.cos(angle) * 900, y: 960 + Math.sin(angle) * 1100, xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const t = share + 0.6 + i * 0.05;
    tl.to(face, { autoAlpha: 1, duration: 0.01 }, t);
    tl.to(face, { x: code.x + between(-60, 60), y: code.y + between(-20, 20), scale: 0.2, rotation: between(-180, 180), duration: 0.38, ease: 'power2.in' }, t);
    tl.to(face, { autoAlpha: 0, duration: 0.05 }, t + 0.35);
    cue('bloop', t + 0.38, { pitch: i });
  });
  const squad = caption(s, "the squad's in :saluting_face:", { x: 700, y: 430, cls: 'small mint', rot: 4 });
  pop(squad, share + 1.35);

  // Grade: the ballot, big.
  tl.to(ph.el, { y: -1900, rotation: -10, duration: 0.36, ease: 'power3.in' }, grade - 0.02);
  vanish(shareIt, grade);
  vanish(squad, grade);
  cue('whoosh', grade);
  const zb = 2.1;
  const ballot = ui.mjBallot(TEAM);
  const bcard = card(s, zb, ballot.el);
  const bx = (W - 390 * zb) / 2;
  gsap.set(bcard, { x: bx, y: 2000, rotation: 6 });
  tl.to(bcard, { y: 470, rotation: 0, duration: 0.5, ease: 'back.out(1.2)' }, grade + 0.1);
  const restB = { x: bx, y: 470 };
  const grading = step(s, '3', 'vibe-check every option', 280, { size: 74 });
  pop(grading, grade + 0.15);
  const choices = [[0, 'Passable', grade + 0.9], [1, 'VeryGood', grade + 1.7], [2, 'Excellent', grade + 2.5]];
  const counted = grade + 2.9;
  const live = at(9);
  onFrame((t) => {
    if (t < grade - 0.5 || t > live + 0.5) return;
    for (const [row, mention, when] of choices) ballot.choose(row, t >= when ? mention : null);
    ballot.setCounted(t >= counted);
  });
  const reactions = [
    ['mid :face_with_rolling_eyes:', 'pink', -6],
    ['W :handshake:', 'mint', 7],
    ['ICONIC :fire:', 'sun', 6],
  ];
  const first = spot(ballot.step(0, 'Passable'), bcard, restB, choices[0][2]);
  showFinger(hand, grade + 0.45, first.x, first.y);
  choices.forEach(([row, mention, when], i) => {
    const swatch = spot(ballot.step(row, mention), bcard, restB, when);
    tap(hand, swatch.x, swatch.y, when);
    cue('mention', when + 0.02, { mention });
    const [text, color, rot] = reactions[i];
    const react = caption(s, text, { x: 885, y: swatch.y - 6, cls: `small ${color}`, rot });
    pop(react, when + 0.06, { sound: 'boing' });
    wobble(react, when + 0.4, 1.2, 5);
    vanish(react, live - 0.15);
  });
  hideFinger(hand, counted - 0.15);
  const drRow = spot(ballot.step(2, 'Excellent'), bcard, restB, choices[2][2]);
  const dragon = sticker(s, 'dragon', 170, 72, drRow.y - 40, -12);
  pop(dragon, choices[2][2] + 0.07, { sound: null, from: 0 });
  vanish(dragon, live - 0.15);

  // Watch: the results, live. Dragon Rouge has the loudest fans; Survivors, everyone's grades.
  tl.to(bcard, { x: -1300, rotation: -14, duration: 0.36, ease: 'power3.in' }, live - 0.2);
  vanish(grading, live - 0.18);
  const zr = 2.05;
  const results = ui.mjResults(TEAM);
  const rcard = card(s, zr, results.el);
  const rx = (W - 390 * zr) / 2;
  gsap.set(rcard, { x: 1300, y: 450, rotation: 10 });
  tl.to(rcard, { x: rx, rotation: 0, duration: 0.45, ease: 'back.out(1.2)' }, live - 0.1);
  cue('whoosh', live - 0.15);
  const watch = step(s, '4', 'watch it live :eyes:', 280, { rot: 2 });
  pop(watch, live + 0.05);
  tl.to(rcard, { scale: 1.035, duration: 4, ease: 'sine.inOut' }, live + 0.4);

  const times = [0, 0.18, 0.34, 0.49, 0.63, 0.76, 0.89, 1.02, 1.15, 1.4, 1.58, 1.74].map((d) => live + 0.5 + d);
  const states = [TEAM.map(() => ({}))];
  for (const row of TEAM_BALLOTS) {
    states.push(states[states.length - 1].map((counts, i) => ({ ...counts, [row[i]]: (counts[row[i]] ?? 0) + 1 })));
  }
  const slots = states.map((counts) => slotsOf(counts.map(judgment)));
  const widths = states.map((counts) => counts.map(ui.sharesOf));
  const progress = arrivals(times);
  onFrame((t) => {
    if (t < live - 0.5 || t > T.method + 0.4) return;
    const { k, p } = progress(t);
    const before = Math.max(0, k - 1);
    results.update({
      counts: states[k],
      widths: widths[k].map((w, i) => Object.fromEntries(MENTIONS.map((m) => [m, lerp(widths[before][i][m], w[m], p)]))),
      slots: slots[k].map((slot, i) => lerp(slots[before][i], slot, easeInOut(p))),
    });
  });
  const restR = { x: rx, y: 450 };
  const count = spot(results.el.querySelector('.results-count'), rcard, restR, live + 0.4);
  times.forEach((t, i) => {
    const friend = SQUAD[i % SQUAD.length];
    const face = emoji(friend.emoji, 110);
    face.classList.add('abs');
    s.append(face);
    const side = i % 2 ? 1 : -1;
    gsap.set(face, { x: 540 + side * 700, y: between(300, 1700), xPercent: -50, yPercent: -50, autoAlpha: 0 });
    tl.to(face, { autoAlpha: 1, duration: 0.01 }, t - 0.3);
    tl.to(face, { x: count.x, y: count.y, scale: 0.25, rotation: side * 160, duration: 0.3, ease: 'power2.in' }, t - 0.3);
    tl.to(face, { autoAlpha: 0, duration: 0.04 }, t - 0.02);
    cue('coin', t, { pitch: i });
  });

  const won = times[times.length - 1] + 0.3;
  const winner = spot(results.cards[1].el, rcard, restR, won + 0.2);
  confetti(s, won + 0.02, { x: winner.x, y: winner.y, count: 80, spread: 300, velocity: [800, 1700] });
  cue('tada', won);
  vanish(watch, won - 0.05);
  const wins = caption(s, 'Survivors wins :trophy:', { y: 285, cls: 'sun', rot: -3, size: 84 });
  slam(wins, won + 0.05, { rot: -3 });
  const moral = caption(s, 'not the loudest. the most liked. :handshake:', { y: 1620, cls: 'black small wrap', rot: 2 });
  moral.style.width = '860px';
  moral.style.textAlign = 'center';
  pop(moral, won + 0.7);

  slideOut(s, T.method - 0.25, 'x');
}

// ----------------------------------------------------------------------------
// 4. The method, 23-29 s: grades, and no strategy.

function methodScene(root) {
  const t0 = T.method;
  const at = (x) => t0 + x;
  const s = scene(root, 'night-bg', at(-0.25), T.trip + 0.1);
  slideIn(s, at(-0.25), 'x');

  const title = caption(s, 'that was majority judgment :nerd_face:', { y: 300, rot: -2, size: 76 });
  pop(title, at(0.2));

  // The seven mentions, in the app's own colours (mentions.css).
  const scale = h('div', { class: 'app layer' });
  s.append(scale);
  const chips = MENTIONS.map((mention, i) => {
    const chip = h('div', { class: 'mention-chip', 'data-mention': mention }, ui.MENTION_NAMES[mention]);
    scale.append(chip);
    place(chip, 540, 540 + i * 118, i % 2 ? 2 : -2);
    pop(chip, at(0.7 + i * 0.13), { sound: null });
    cue('mention', at(0.7 + i * 0.13), { mention });
    return chip;
  });
  const gradeAll = caption(s, 'grade every option, not just one', { y: 1440, rot: 2, size: 66, cls: 'sun' });
  pop(gradeAll, at(1.8));
  const best = caption(s, 'the best majority grade wins', { y: 1590, rot: -2, size: 56, cls: 'small' });
  pop(best, at(2.4));
  for (const el of [title, gradeAll, best, ...chips]) vanish(el, at(3.15) + chips.indexOf(el) * 0.02);

  // No strategy.
  const noStrategy = caption(s, 'no strategic voting needed', { y: 640, rot: -3, size: 92, cls: 'coral wrap' });
  noStrategy.style.width = '820px';
  noStrategy.style.textAlign = 'center';
  slam(noStrategy, at(3.5), { rot: -3 });
  const nope = sticker(s, 'person_gesturing_no', 230, 880, 420, 10);
  pop(nope, at(3.6), { sound: 'boing', from: 0 });
  wobble(nope, at(4), 1.5, 8);
  [['no lesser evil', 'mint', 960, 3], ['no wasted vote', 'lilac', 1110, -3], ['just say what you think :sparkles:', '', 1260, 2]]
    .forEach(([text, cls, y, rot], i) => pop(caption(s, text, { y, rot, size: 64, cls }), at(4.1 + i * 0.4), { pitch: i * 2 }));

  slideOut(s, T.trip - 0.34, 'y');
}

// ----------------------------------------------------------------------------
// 5. The trip, 29-37 s: approval voting, and a live plot twist.

/** The question as asked... */
const DESTINATIONS = [['Japan', 'mount_fuji'], ['Canada', 'maple_leaf'], ['Brazil', 'parrot'], ['Guadeloupe', 'desert_island'], ['Ecuador', 'volcano']];
/** ...and in the order this voter's shuffle shows them, which also orders ties in the results. */
const TRIP = ['Japan', 'Guadeloupe', 'Ecuador', 'Brazil', 'Canada'];
const APPROVED = [ // the ballots each option is approved on, the first being the viewer's
  [1, 4, 6, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18],
  [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15],
  [1, 4, 5, 7, 10, 12, 14, 16, 18],
  [2, 5, 8, 10, 13, 16, 17],
  [3, 7, 9, 11, 14, 17],
];

function tripScene(root) {
  const t0 = T.trip;
  const at = (x) => t0 + x;
  const s = scene(root, 'sky-bg', at(-0.34), T.food + 0.35);
  slideIn(s, at(-0.34), 'y');
  const hand = finger(s);

  [[-60, 260, 1], [620, 160, 0.7], [760, 1640, 1.1], [-120, 1460, 0.8], [300, 1820, 0.9]].forEach(([x, y, k], i) => {
    const cloud = h('div', { class: 'cloud' });
    s.prepend(cloud);
    gsap.set(cloud, { x, y, scale: k });
    tl.to(cloud, { x: x + (i % 2 ? -160 : 180), duration: 8.5, ease: 'none' }, at(-0.3));
  });

  const trip = h('div', { class: 'big' }, sentence('summer trip?'));
  s.append(trip);
  place(trip, 540, 640, -4, { autoAlpha: 1 });
  const tripWords = trip.querySelectorAll('.w');
  gsap.set(tripWords, { autoAlpha: 0 });
  tl.fromTo(tripWords, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'back.out(3)', stagger: 0.2, immediateRender: false }, at(0.32));
  cue('pop', at(0.32));
  cue('pop', at(0.52), { pitch: 2 });

  const plane = sticker(s, 'airplane', 300, 0, 0);
  tl.set(plane, { autoAlpha: 1 }, at(0.08));
  tl.fromTo(plane, { x: -260, y: 560 }, {
    motionPath: { path: [{ x: -260, y: 560 }, { x: 300, y: 430 }, { x: 800, y: 400 }, { x: 1380, y: 450 }], curviness: 1.2, autoRotate: 45 },
    duration: 0.8, ease: 'none', immediateRender: false,
  }, at(0.08));
  cue('plane', at(0.08));

  const spots = [[250, 960, -6], [560, 920, 4], [860, 980, -3], [360, 1250, 3], [760, 1270, -5]];
  const ballotIn = at(2.1);
  DESTINATIONS.forEach(([name, icon], i) => {
    const el = h('div', { class: 'sticker' }, emoji(icon, 140), h('span', {}, name));
    s.append(el);
    const [x, y, rot] = spots[i];
    place(el, x, y, rot);
    pop(el, at(0.85 + i * 0.15), { pitch: i + 2 });
    wobble(el, at(1.6 + i * 0.05), 0.9, 4);
    tl.to(el, { scale: 0, autoAlpha: 0, rotation: rot + 30, duration: 0.22, ease: 'back.in(2)' }, ballotIn - 0.1 + i * 0.03);
  });
  vanish(trip, ballotIn - 0.1);

  // Approval voting: tick every place you would go.
  const za = 2.1;
  const ballot = ui.approvalBallot(TRIP);
  const bcard = card(s, za, ballot.el);
  gsap.set(bcard, { x: (W - 390 * za) / 2, y: 2000, rotation: -5 });
  tl.to(bcard, { y: 450, rotation: 0, duration: 0.48, ease: 'back.out(1.2)' }, ballotIn);
  const restA = { x: (W - 390 * za) / 2, y: 450 };
  cue('whoosh', ballotIn);
  const tickAll = caption(s, "tick all you're down for :check_mark_button:", { y: 290, size: 70, rot: 2 });
  pop(tickAll, ballotIn + 0.05);
  const system = caption(s, 'approval voting', { x: 740, y: 395, cls: 'small ink', rot: -4 });
  system.style.zIndex = 5; // a tag on whichever caption is above it
  pop(system, ballotIn + 0.2);
  const ticks = [[0, ballotIn + 0.9], [1, ballotIn + 1.4], [2, ballotIn + 1.9]];
  const counted = ballotIn + 2.05;
  const race = ballotIn + 2.4;
  onFrame((t) => {
    if (t < ballotIn - 0.5 || t > race + 1) return;
    for (const [row, when] of ticks) ballot.tick(row, t >= when);
    ballot.setCounted(t >= counted);
  });
  const firstTick = spot(ballot.choice(0), bcard, restA, ticks[0][1]);
  showFinger(hand, ballotIn + 0.45, firstTick.left + 55, firstTick.y);
  for (const [row, when] of ticks) {
    const box = spot(ballot.choice(row), bcard, restA, when);
    tap(hand, box.left + 55, box.y, when);
    cue('check', when + 0.02, { pitch: row });
  }
  hideFinger(hand, counted + 0.1);

  // Results, live: Guadeloupe leads, then Japan.
  tl.to(bcard, { x: -1300, rotation: -12, duration: 0.34, ease: 'power3.in' }, race - 0.1);
  const za2 = 2.15;
  const results = ui.approvalResults(TRIP);
  const rcard = card(s, za2, results.el);
  gsap.set(rcard, { x: 1300, y: 470, rotation: 9 });
  tl.to(rcard, { x: (W - 390 * za2) / 2, rotation: 0, duration: 0.45, ease: 'back.out(1.2)' }, race);
  cue('whoosh', race - 0.05);
  vanish(tickAll, race - 0.05);
  const moving = caption(s, 'results move live :eyes:', { y: 290, rot: -2 });
  pop(moving, race + 0.15);
  tl.to(rcard, { scale: 1.03, duration: 3, ease: 'sine.inOut' }, race + 0.5);

  const times = Array.from({ length: 18 }, (_, i) => race + 0.5 + 1.9 * (i / 17) ** 0.85);
  const counts = Array.from({ length: 19 }, (_, k) => APPROVED.map((set) => set.filter((b) => b <= k).length));
  const slots = counts.map((c) => slotsOf(c.map(approval)));
  const progress = arrivals(times, 0.25);
  onFrame((t) => {
    if (t < race - 0.5 || t > T.food + 0.4) return;
    const { k, p } = progress(t);
    const before = Math.max(0, k - 1);
    const share = (c, n) => (n ? c / n : 0);
    results.update({
      approvals: counts[k],
      n: k,
      shares: counts[k].map((c, i) => lerp(share(counts[before][i], before), share(c, k), p)),
      slots: slots[k].map((slot, i) => lerp(slots[before][i], slot, easeInOut(p))),
    });
  });
  times.forEach((t, i) => cue('coin', t, { pitch: i % 8, gain: 0.7 }));

  const twistAt = times[times.length - 1] + 0.12;
  const twist = caption(s, 'PLOT TWIST :face_screaming_in_fear:', { y: 1560, cls: 'coral', rot: -5, size: 96 });
  slam(twist, twistAt, { rot: -5 });
  vanish(twist, twistAt + 0.75);
  vanish(moving, twistAt + 0.05);
  const japan = caption(s, 'Japan it is :sushi::airplane:', { y: 300, cls: 'sun', rot: 3 });
  pop(japan, twistAt + 0.15, { sound: 'tada' });
  for (let i = 0; i < 26; i++) {
    const x = between(40, 1040);
    const petal = sticker(s, 'cherry_blossom', between(60, 110), x, -120, between(0, 360));
    gsap.set(petal, { autoAlpha: 1 });
    tl.to(petal, { y: between(1500, 2100), x: x + between(-200, 200), rotation: `+=${between(-360, 360)}`, duration: between(1.1, 1.6), ease: 'power1.in' }, twistAt + 0.08 + between(0, 0.6));
  }

  slideOut(s, T.food - 0.16, 'y');
}

// ----------------------------------------------------------------------------
// 6. Dinner, 37-44 s: a join code shouted, results kept until closing.

const FOOD = ['Pizza', 'Sushi', 'Tacos', 'Burgers'];
const FOOD_COUNTS = [
  { Excellent: 3, VeryGood: 5, Good: 4, Fair: 2 },
  { Excellent: 6, Good: 2, Fair: 1, Passable: 2, Inadequate: 2, Bad: 1 },
  { Excellent: 1, VeryGood: 3, Good: 5, Fair: 3, Passable: 2 },
  { VeryGood: 2, Good: 3, Fair: 4, Passable: 3, Inadequate: 2 },
];

function foodScene(root) {
  const t0 = T.food;
  const at = (x) => t0 + x;
  const s = scene(root, 'gingham', at(-0.16), T.science + 0.1);
  slideIn(s, at(-0.16), 'y');
  const hand = finger(s);

  const dinner = h('div', { class: 'big' }, sentence('dinner tonight?'));
  dinner.style.fontSize = '176px';
  s.append(dinner);
  place(dinner, 540, 600, -3, { autoAlpha: 1 });
  const dinnerWords = dinner.querySelectorAll('.w');
  gsap.set(dinnerWords, { autoAlpha: 0 });
  tl.fromTo(dinnerWords, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'back.out(3)', stagger: 0.25, immediateRender: false }, at(0.15));
  cue('pop', at(0.15));
  cue('pop', at(0.4), { pitch: 3 });

  const foods = ['pizza', 'sushi', 'taco', 'hamburger', 'pizza', 'french_fries', 'sushi', 'taco', 'steaming_bowl', 'hamburger', 'pizza', 'sushi', 'taco', 'french_fries', 'hamburger', 'pizza'];
  foods.forEach((name, i) => {
    const food = sticker(s, name, between(150, 210), 90 + ((i * 397) % 900), -250, between(-30, 30));
    gsap.set(food, { autoAlpha: 1 });
    const t = at(0.1 + i * 0.05);
    tl.to(food, { y: between(1560, 1800), rotation: `+=${between(-60, 60)}`, duration: between(0.55, 0.75), ease: 'bounce.out' }, t);
    if (i % 4 === 0) cue('boing', t + 0.4, { pitch: i });
  });

  // The join code, out loud.
  const shoutAt = at(1.4);
  vanish(dinner, shoutAt - 0.2);
  const codeCard = h('div', { class: 'code-card' },
    h('span', { class: 'label' }, 'JOIN CODE'),
    h('span', { class: 'code' }, 'YUM-YUM'),
    h('span', { class: 'where' }, 'to enter at super-vote.org'));
  s.append(codeCard);
  place(codeCard, 540, 900, -2);
  slam(codeCard, shoutAt, { rot: -2, from: 2 });
  const shout = caption(s, 'no link? just shout the code', { y: 330, rot: 2, size: 76 });
  pop(shout, shoutAt + 0.1);
  const megaphone = sticker(s, 'megaphone', 230, 190, 1230);
  gsap.set(megaphone, { scaleX: -1 });
  pop(megaphone, shoutAt + 0.15, { sound: 'honk', from: 0 });
  tl.to(megaphone, { rotation: '+=10', duration: 0.8, ease: 'wobble' }, shoutAt + 0.35);
  const waves = h('div', {
    class: 'wave',
    html: `<svg width="300" height="300" viewBox="0 0 300 300" style="overflow:visible">${[60, 105, 150].map((r) => `<path d="M ${r * 0.7} ${-r * 0.7} A ${r} ${r} 0 0 1 ${r * 0.7} ${r * 0.7}" transform="translate(40 150)" fill="none" stroke="#121212" stroke-width="12" stroke-linecap="round"/>`).join('')}</svg>`,
  });
  s.append(waves);
  gsap.set(waves, { x: 270, y: 990, autoAlpha: 0, rotation: -40, transformOrigin: '40px 150px' });
  tl.set(waves, { autoAlpha: 1 }, shoutAt + 0.2);
  tl.fromTo(waves.querySelectorAll('path'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, stagger: 0.1, repeat: 3, repeatDelay: 0.1, immediateRender: false }, shoutAt + 0.2);
  const joiners = ['fox', 'frog', 'unicorn', 'alien'].map((name, i) => {
    const face = sticker(s, name, 140, [790, 930, 610, 900][i], [1210, 1090, 1320, 1380][i], between(-15, 15));
    pop(face, shoutAt + 0.5 + i * 0.15, { sound: 'bloop', pitch: i * 2, from: 0 });
    return face;
  });
  const resultsIn = at(3);
  for (const el of [codeCard, megaphone, waves, shout, ...joiners]) vanish(el, resultsIn - 0.1);

  // Results kept until the poll closes; the creator closes it.
  const zf = 2.0;
  const results = ui.mjResults(FOOD);
  const owner = ui.ownerActions();
  const column = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } }, results.el, owner.el);
  const fcard = card(s, zf, column);
  gsap.set(fcard, { x: (W - 390 * zf) / 2, y: 2000, rotation: 5 });
  tl.to(fcard, { y: 470, rotation: 0, duration: 0.48, ease: 'back.out(1.2)' }, resultsIn);
  const restF = { x: (W - 390 * zf) / 2, y: 470 };
  cue('whoosh', resultsIn);
  const peek = caption(s, 'no peeking till it closes :see-no-evil_monkey:', { y: 300, size: 68, rot: -2 });
  pop(peek, resultsIn + 0.15);
  const reveal = at(5.5);
  const press = reveal - 0.8;
  const empty = FOOD.map(() => ({}));
  const slotsFinal = slotsOf(FOOD_COUNTS.map(judgment));
  onFrame((t) => {
    if (t < resultsIn - 0.4 || t > T.science + 0.2) return;
    const closed = t >= reveal;
    results.setFinal(closed);
    results.list.style.display = closed ? '' : 'none';
    results.footer.style.display = closed ? '' : 'none';
    owner.el.style.display = closed ? 'none' : '';
    owner.close.classList.toggle('pressed', t >= press - 0.05 && t < press + 0.1);
    if (closed) {
      const grow = easeOut(clamp01((t - reveal) / 0.35));
      results.update({ counts: FOOD_COUNTS, widths: FOOD_COUNTS.map((c) => Object.fromEntries(Object.entries(ui.sharesOf(c)).map(([m, w]) => [m, w * grow]))), slots: slotsFinal });
    } else {
      results.update({ counts: empty, slots: [0, 1, 2, 3] });
      results.setCount(Math.min(14, 9 + Math.max(0, Math.floor((t - resultsIn - 0.3) / 0.16))));
      results.setHint('The results show once you close the poll.');
    }
  });
  for (let i = 0; i < 5; i++) cue('coin', resultsIn + 0.46 + i * 0.16, { pitch: i, gain: 0.7 });
  const monkey = sticker(s, 'see-no-evil_monkey', 200, 930, 470, 14);
  pop(monkey, resultsIn + 0.45, { sound: 'boing', from: 0 });
  wobble(monkey, resultsIn + 0.8, 1.5, 8);
  vanish(monkey, reveal - 0.05);

  const close = spot(owner.close, fcard, restF, press - 0.1);
  showFinger(hand, press - 0.5, close.x, close.y);
  tap(hand, close.x, close.y, press);
  hideFinger(hand, press + 0.2);
  cue('drumroll', press + 0.05, { until: reveal });
  tl.to(s, { scale: 1.04, duration: reveal - press, ease: 'power1.in' }, press);
  tl.to(s, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, reveal);
  cue('crash', reveal);
  shake(reveal, 26, 0.5);
  vanish(peek, reveal - 0.05);

  const pizza = spot(results.cards[0].el, fcard, restF, reveal + 0.4);
  confetti(s, reveal + 0.05, { x: pizza.x, y: pizza.top + 60, count: 26, emojis: ['pizza'], size: 110, spread: 220, velocity: [900, 1700], sound: 'tada' });
  const crown = sticker(s, 'crown', 170, pizza.left + 120, pizza.top - 30, -18);
  tl.fromTo(crown, { y: -200, autoAlpha: 0 }, { y: pizza.top - 30, autoAlpha: 1, duration: 0.45, ease: 'bounce.out', immediateRender: false }, reveal + 0.15);
  cue('boing', reveal + 0.4);
  const obviously = caption(s, ':pizza: pizza. obviously.', { y: 300, cls: 'sun', rot: 3 });
  slam(obviously, reveal + 0.25, { rot: 3 });

  tl.to(s, { scale: 0.6, autoAlpha: 0, duration: 0.16, ease: 'power2.in' }, T.science - 0.3);
}

// ----------------------------------------------------------------------------
// 7. The science, 44-51 s: elections still ask for one choice; super-vote asks better.

function scienceScene(root) {
  const t0 = T.science;
  const at = (x) => t0 + x;
  const s = scene(root, 'notebook-bg', at(-0.2), T.blitz + 0.1);
  tl.fromTo(s, { scale: 1.3 }, { scale: 1, duration: 0.25, ease: 'power3.out', immediateRender: false }, at(-0.2));
  cue('whoosh', at(-0.25));

  const fact = caption(s, 'fun fact :thinking_face:', { y: 230, cls: 'small sun', rot: -4 });
  pop(fact, at(0.1));
  const government = caption(s, 'your government was elected with a 100+ year old voting system :moai:', { y: 450, size: 70, rot: 1.5, cls: 'wrap' });
  government.style.width = '900px';
  government.style.textAlign = 'center';
  pop(government, at(0.45), { stagger: 0.06 });

  const old = h('div', { class: 'old-ballot' },
    h('h3', {}, 'BALLOT'),
    h('p', {}, 'Vote for ONE candidate only'),
    ...['Candidate A', 'Candidate B', 'Candidate C'].map((name, i) => h('div', { class: 'choice' }, h('span', { class: 'box' }, i === 1 ? '✕' : ''), name)));
  s.append(old);
  place(old, 540, 1000, -3);
  pop(old, at(1.3), { sound: 'pop' });
  const stamp = h('div', { class: 'stamp' }, 'DEPRECATED');
  s.append(stamp);
  place(stamp, 540, 1010, -14);
  slam(stamp, at(2.1), { rot: -14, from: 2.6 });
  const pickOne = caption(s, 'pick one = split votes & lesser evils :skull:', { y: 1430, cls: 'black small', rot: 2, size: 52 });
  pop(pickOne, at(2.7));
  const turn = at(3.6);
  for (const [i, el] of [fact, government, old, stamp, pickOne].entries()) vanish(el, turn - 0.2 + i * 0.03);

  // super-vote's two methods, and where they come from.
  const science = caption(s, "super-vote's 2 voting systems? backed by science :brain:", { y: 330, size: 70, rot: -2, cls: 'wrap' });
  science.style.width = '880px';
  science.style.textAlign = 'center';
  pop(science, turn);
  [['Majority judgment', 'Balinski & Laraki, 2007', 'var(--mint)', 700, -3], ['Approval voting', 'Brams & Fishburn, 1978', 'var(--sky)', 930, 3]]
    .forEach(([method, source, color, y, rot], i) => {
      const cite = h('div', { class: 'sticker cite', style: { background: color } }, h('strong', {}, method), h('span', {}, source));
      s.append(cite);
      place(cite, 540, y, rot);
      pop(cite, turn + 0.6 + i * 0.45, { pitch: i * 3 });
    });
  const accurate = caption(s, 'probably more accurate than your last election :smiling_face_with_sunglasses:', { y: 1250, size: 68, rot: 2, cls: 'sun wrap' });
  accurate.style.width = '880px';
  accurate.style.textAlign = 'center';
  slam(accurate, turn + 1.7, { rot: 2 });

  tl.to(s, { scale: 0.6, autoAlpha: 0, duration: 0.16, ease: 'power2.in' }, T.blitz - 0.3);
}

// ----------------------------------------------------------------------------
// 8. The blitz, 51-55.5 s: one promise a beat.

const PROMISES = [
  ['no account', 'person_gesturing_no', '#fff'],
  ['100% free', 'money_with_wings', 'var(--sun)'],
  ['open source', 'red_heart', 'var(--mint)'],
  ['nobody sees your ballot', 'locked', 'var(--pink)'],
  ['live results', 'high_voltage', 'var(--lilac)'],
  ['gone after 30 days', 'broom', 'var(--coral)'],
  ['multilingual', 'globe_showing_europe-africa', 'var(--sky)'],
  ['AI agents welcome', 'robot', '#fff'],
];

function blitzScene(root) {
  const t0 = T.blitz;
  const s = scene(root, 'ink-bg blitz', t0 - 0.2, T.end + 0.4);
  const dots = h('div', { class: 'halftone' });
  s.append(dots);
  tl.fromTo(dots, { rotation: 0 }, { rotation: 20, duration: 5, ease: 'none' }, t0 - 0.2);
  tl.fromTo(s, { scale: 1.3 }, { scale: 1, duration: 0.25, ease: 'power3.out', immediateRender: false }, t0 - 0.2);
  cue('whoosh', t0 - 0.25);
  const spots = [[420, 330, -6], [690, 500, 5], [380, 670, -4], [560, 840, 3], [700, 1010, -5], [400, 1180, 4], [620, 1350, -3], [470, 1520, 5]];
  PROMISES.forEach(([text, name, color], i) => {
    const el = h('div', { class: 'sticker row', style: { background: color } }, emoji(name, 100), h('span', {}, text));
    s.append(el);
    const [x, y, rot] = spots[i];
    place(el, x, y, rot);
    slam(el, t0 + i * 0.5, { rot, from: 1.9 });
    tl.to(el, { x: 540 + (i % 2 ? 1 : -1) * 1400, y: `+=${between(-400, 400)}`, rotation: between(-90, 90), duration: 0.3, ease: 'power3.in' }, T.end - 0.3 + i * 0.012);
  });
  cue('whoosh', T.end - 0.3);
}

// ----------------------------------------------------------------------------
// 9. The end card, 55.5-60 s.

function endScene(root) {
  const t0 = T.end;
  const at = (x) => t0 + x;
  const s = scene(root, 'end-bg', t0);
  tl.fromTo(s, { clipPath: 'circle(0% at 50% 40%)' }, { clipPath: 'circle(150% at 50% 40%)', duration: 0.4, ease: 'power2.in', immediateRender: false }, t0);
  gsap.set(s, { clipPath: 'circle(0% at 50% 40%)' });
  const burst = h('div', { class: 'sunburst' });
  s.append(burst);
  tl.fromTo(burst, { rotation: 0 }, { rotation: 30, duration: T.done - t0, ease: 'none' }, t0);

  const logo = h('img', { class: 'logo-big', src: 'assets/logo.svg', alt: '' });
  logo.style.width = logo.style.height = '360px';
  s.append(logo);
  place(logo, 540, 700);
  tl.fromTo(logo, { scale: 0, rotation: -30, autoAlpha: 1 }, { scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)', immediateRender: false }, at(0.12));
  cue('boom', at(0.12), { gain: 0.6 });
  wobble(logo, at(0.9), T.done - at(0.9), 3);

  const word = h('div', { class: 'wordmark dark' }, [...'super-vote'].map((c) => h('span', {}, c)));
  word.style.fontSize = '150px';
  s.append(word);
  place(word, 540, 990, 0, { autoAlpha: 1 });
  const letters = word.querySelectorAll('span');
  gsap.set(letters, { autoAlpha: 0 });
  tl.fromTo(letters, { y: -240, autoAlpha: 0, rotation: () => between(-40, 40) },
    { y: 0, autoAlpha: 1, rotation: 0, duration: 0.4, ease: 'back.out(2.2)', stagger: 0.03, immediateRender: false }, at(0.4));
  for (let i = 0; i < 10; i += 3) cue('tick', at(0.48) + i * 0.03, { pitch: i });

  const url = h('div', { class: 'url' }, 'super-vote.org');
  s.append(url);
  place(url, 540, 1190, -2);
  slam(url, at(0.95), { rot: -2, sound: 'ding' });

  const tagline = h('div', { class: 'tagline' }, sentence('decide together.'));
  s.append(tagline);
  place(tagline, 540, 1370);
  pop(tagline, at(1.35), { sound: 'pop' });
  const fine = h('div', { class: 'small-print' }, 'free · no account · open source');
  s.append(fine);
  place(fine, 540, 1460);
  pop(fine, at(1.65), { sound: null });

  const orbit = [['dragon', 170, 500, -12], ['mount_fuji', 910, 470, 10], ['pizza', 150, 1560, -8], ['handshake', 930, 1560, 8], ['fire', 880, 860, 12], ['party_popper', 190, 880, -10]];
  orbit.forEach(([name, x, y, rot], i) => {
    const el = sticker(s, name, 170, x, y, rot);
    pop(el, at(0.25 + i * 0.09), { sound: i % 2 ? null : 'bloop', pitch: i, from: 0 });
    tl.to(el, { y: `+=${i % 2 ? 26 : -26}`, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: 2 }, at(0.8 + i * 0.1));
  });
}

export function build(root) {
  shakeHook(root);
  hookScene(root);
  brandScene(root);
  teamScene(root);
  methodScene(root);
  tripScene(root);
  foodScene(root);
  scienceScene(root);
  blitzScene(root);
  endScene(root);
  tl.set({}, {}, T.done);
  return T.done;
}
