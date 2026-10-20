// The video, scene by scene, on one GSAP timeline (fx.tl). Times are seconds,
// on a 120 BPM grid: a beat is 0.5 s, and cuts fall on beats.

import { h, emoji, sentence, between, W, H } from './util.js';
import {
  gsap, tl, onFrame, cue, place, caption, pop, vanish, slam, wobble, shake, shakeHook, finger, showFinger, hideFinger, tap,
  confetti, spot, clamp01, lerp, easeOut, easeInOut,
} from './fx.js';
import * as ui from './ui.js';
import { MENTIONS, approval, judgment, ranks, places } from './ranking.js';

const T = {
  hook: 0, brand: 4, team: 6, share: 7.8, grade: 9, live: 11.5, trip: 15, food: 21, blitz: 26.5, end: 30.5, done: 35,
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

/** Ballots landing one by one: counts after each, and a glide between them. */
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
// 1. The group chat, 0-4 s: everyone talks, nobody decides.

const CHAT = [ // the first three are already there when the video starts
  ['hugo', 'tournament is SATURDAY :trophy:', 0],
  ['sami', "we're so in :fire::fire:", 0],
  ['zoe', 'and we still have no team name :skull:', 0],
  ['ines', 'ok we NEED a team name', 0.12],
  ['theo', 'Dragon Rouge :dragon::fire:', 0.45],
  ['malik', "C'est pas faux", 0.85],
  ['zoe', 'Survivors??', 1.17],
  ['theo', 'DRAGON ROUGE', 1.45],
  ['lucas', 'wait what are we voting on', 1.7],
  ['malik', "c'est pas faux.", 1.92],
  ['chloe', 'can we just vote', 2.12],
  ['ines', 'vote HOW :loudly_crying_face:', 2.3],
  ['zoe', ':skull::skull::skull:', 2.46],
  ['nathan', 'brb', 2.6],
  ['theo', 'DRAGON. ROUGE.', 2.72],
  ['lea', 'omg', 2.83],
  ['malik', "C'EST PAS FAUX", 2.93],
  ['lucas', '???', 3.02],
  ['chloe', ':melting_face:', 3.1],
  ['zoe', 'SURVIVORS', 3.17],
  ['hugo', 'lol', 3.24],
  ['ines', ':skull:', 3.3],
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
    cue('blip', t, { pitch: i % 6, gain: i > 9 ? 0.6 : 1 });
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
    num.textContent = String(Math.round(lerp(23, 147, clamp01(t / 3.3) ** 2)));
  });

  // Everything spirals into the middle, where the logo lands.
  const vortex = 3.36;
  const y = bottom - bottomOf(messages[messages.length - 1]);
  [...messages].reverse().forEach((m, i) => {
    const cx = 40 + m.offsetWidth / 2;
    const cy = y + m.offsetTop + m.offsetHeight / 2;
    tl.to(m, {
      x: 540 - cx, y: 900 - cy, scale: 0.05, rotation: between(-300, 300), duration: 0.42, ease: 'power3.in',
    }, vortex + i * 0.012);
  });
  tl.to([title, counter], { x: 540, y: 900, scale: 0.05, rotation: 200, duration: 0.42, ease: 'power3.in' }, vortex + 0.05);
  shake(2.6, 6, 0.8);
  cue('suck', vortex);
}

// ----------------------------------------------------------------------------
// 2. The brand, 4-6 s.

function brandScene(root) {
  const s = scene(root, '', 3.78, T.team + 0.1);
  const ground = h('div', { class: 'layer ink-bg' });
  const rays = h('div', { class: 'rays' });
  ground.append(rays);
  s.append(ground);
  gsap.set(ground, { clipPath: 'circle(0% at 50% 40%)' });
  tl.to(ground, { clipPath: 'circle(150% at 50% 40%)', duration: 0.24, ease: 'power2.in' }, 3.84);
  const behind = h('div', { class: 'layer' });
  s.append(behind);
  tl.fromTo(rays, { rotation: 0 }, { rotation: 45, duration: 2.5, ease: 'none' }, 3.78);

  const logo = h('img', { class: 'logo-big', src: 'assets/logo.svg', alt: '' });
  s.append(logo);
  place(logo, 540, 760);
  tl.fromTo(logo, { scale: 0, rotation: -40, autoAlpha: 1 }, { scale: 1.2, rotation: 8, duration: 0.22, ease: 'power3.out', immediateRender: false }, 3.8);
  tl.to(logo, { scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' }, 4.02);
  cue('boom', T.brand);
  shake(T.brand, 34, 0.55);
  confetti(behind, T.brand, { x: 540, y: 760, count: 70, angle: -90, spread: 360, velocity: [900, 2000], gravity: 2200, dur: 1.9 });
  const flash = h('div', { class: 'flash' });
  s.append(flash);
  tl.fromTo(flash, { autoAlpha: 0.75 }, { autoAlpha: 0, duration: 0.3, ease: 'power2.out', immediateRender: false }, T.brand);
  gsap.set(flash, { autoAlpha: 0 });

  const word = h('div', { class: 'wordmark' }, [...'super-vote'].map((c) => h('span', {}, c)));
  s.append(word);
  place(word, 540, 1100, 0, { autoAlpha: 1 });
  const letters = word.querySelectorAll('span');
  gsap.set(letters, { autoAlpha: 0 });
  tl.fromTo(letters, { y: -300, autoAlpha: 0, rotation: () => between(-50, 50) },
    { y: 0, autoAlpha: 1, rotation: 0, duration: 0.42, ease: 'back.out(2.2)', stagger: 0.032, immediateRender: false }, 4.2);
  for (let i = 0; i < 10; i += 3) cue('tick', 4.28 + i * 0.032, { pitch: i });

  const tagline = caption(s, 'decide together.', { y: 1330, rot: -3 });
  pop(tagline, 4.75);
  const stamp = caption(s, 'no drama.', { y: 1490, rot: 7, cls: 'coral' });
  slam(stamp, 5.25, { rot: 7 });
  wobble(logo, 4.7, 1.2, 4);

  // Swipe up to the next scene, as in a feed.
  tl.to(s, { y: -H, duration: 0.34, ease: 'power3.inOut' }, 5.72);
  cue('swoosh', 5.74);
}

// ----------------------------------------------------------------------------
// 3. The team's name, 6-15 s: ask, share, grade, watch.

const TEAM = ["C'est pas faux", 'Survivors', 'Dragon Rouge'];
const TEAM_BALLOTS = [ // C'est pas faux, Survivors, Dragon Rouge; the first is the viewer's
  ['VeryGood', 'Passable', 'Excellent'],
  ['VeryGood', 'Fair', 'Excellent'],
  ['Fair', 'Inadequate', 'Excellent'],
  ['Good', 'Passable', 'Excellent'],
  ['Good', 'Bad', 'Excellent'],
  ['VeryGood', 'Passable', 'Good'],
  ['Excellent', 'Good', 'Inadequate'],
  ['VeryGood', 'Inadequate', 'Good'],
  ['VeryGood', 'VeryGood', 'Fair'],
  ['Excellent', 'Good', 'Bad'],
  ['Good', 'Fair', 'Inadequate'],
  ['VeryGood', 'Passable', 'Good'],
];
const TEAM_TIMES = [11.95, 12.1, 12.24, 12.37, 12.49, 12.6, 12.71, 12.82, 12.93, 13.12, 13.27, 13.4];

function teamScene(root) {
  const s = scene(root, 'cream-bg', 5.72, T.trip + 0.35);
  tl.fromTo(s, { y: H }, { y: 0, duration: 0.34, ease: 'power3.inOut', immediateRender: false }, 5.72);
  gsap.set(s, { y: H });
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
  tl.to(ph.el, { y: 470, rotation: -1.5, duration: 0.5, ease: 'back.out(1.25)' }, 6.0);
  cue('whoosh', 6.0);

  const ask = step(s, '1', 'ask the question', 290);
  pop(ask, 6.1);

  const typing = [
    { field: 'title', text: 'Team name?', from: 6.38, to: 6.66 },
    { field: 0, text: "C'est pas faux", from: 6.74, to: 7.02 },
    { field: 1, text: 'Survivors', from: 7.07, to: 7.24 },
    { field: 2, text: 'Dragon Rouge', from: 7.29, to: 7.5 },
  ];
  for (const { text, from, to } of typing) {
    for (let i = 0; i < text.length; i += 2) cue('key', from + ((to - from) * i) / text.length, { pitch: i });
  }
  onFrame((t) => {
    if (t < 5.7 || t > T.share + 0.1) return;
    let question = '';
    const options = [];
    let focus = null;
    for (const { field, text, from, to } of typing) {
      const typed = text.slice(0, Math.round(clamp01((t - from) / (to - from)) * text.length));
      if (t >= from - 0.06) focus = field;
      if (field === 'title') question = typed;
      else if (t >= from - 0.06) options[field] = typed;
    }
    form.set({ question, options, focus: t > 7.52 ? null : focus });
    form.button.classList.toggle('pressed', t >= 7.66 && t < 7.78);
  });

  // Scroll down to the button, and tap it.
  form.set({ question: 'Team name?', options: [...TEAM], focus: null });
  const screenTop = 470 + 16 + 54 * z;
  const buttonRect = form.button.getBoundingClientRect();
  const scrollerRect = ph.scroller.getBoundingClientRect();
  const buttonY = (buttonRect.top + buttonRect.height / 2 - scrollerRect.top) / z;
  const scroll = buttonY - (1330 - screenTop) / z;
  tl.to(ph.scroller, { y: -scroll, duration: 0.16, ease: 'power2.inOut' }, 7.5);
  showFinger(hand, 7.22, 540, 1330);
  tap(hand, 540, 1330, 7.7);
  hideFinger(hand, 7.86);

  // Share: the poll's page, and its sheet.
  const pollPage = h('div', { style: { display: 'contents' } }, ui.pollTop({ title: 'Team name?', system: 'Majority judgment' }));
  ph.page.append(pollPage);
  const backdrop = h('div', { class: 'backdrop' });
  const qr = document.getElementById('qr-source').innerHTML.replace('<svg ', '<svg width="192" height="192" ');
  const sheet = ui.shareSheet({ code: 'VYB-CHK', url: 'https://super-vote.org/p/Xq7rLm2pK9vBw4ZcR8nYaA', qr });
  ph.root.append(backdrop, sheet);
  gsap.set(backdrop, { autoAlpha: 0 });
  gsap.set(sheet, { yPercent: 105 });
  onFrame((t) => {
    if (t < 5.7 || t > T.grade + 0.5) return;
    form.el.hidden = t >= T.share;
    pollPage.hidden = t < T.share;
  });
  tl.set(ph.scroller, { y: 0 }, T.share);
  tl.to(ph.el, { y: 120, duration: 0.5, ease: 'power3.inOut' }, 7.9);
  tl.to(backdrop, { autoAlpha: 1, duration: 0.2 }, 8.0);
  tl.to(sheet, { yPercent: 0, duration: 0.32, ease: 'power3.out' }, 8.0);
  cue('swoosh', 8.0, { gain: 0.6 });
  vanish(ask, T.share);
  const share = step(s, '2', 'share it', 250, { rot: 2 });
  pop(share, 7.95);

  // The squad flies in.
  const code = spot(sheet.querySelector('.join-code'), ph.el, { x: phoneX, y: 120 }, 8.45, [sheet]);
  SQUAD.slice(0, 11).forEach((friend, i) => {
    const angle = (i / 11) * Math.PI * 2 + 0.3;
    const from = { x: 540 + Math.cos(angle) * 900, y: 960 + Math.sin(angle) * 1100 };
    const face = emoji(friend.emoji, 130);
    face.classList.add('abs');
    s.append(face);
    gsap.set(face, { x: from.x, y: from.y, xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const t = 8.35 + i * 0.045;
    tl.to(face, { autoAlpha: 1, duration: 0.01 }, t);
    tl.to(face, { x: code.x + between(-60, 60), y: code.y + between(-20, 20), scale: 0.2, rotation: between(-180, 180), duration: 0.36, ease: 'power2.in' }, t);
    tl.to(face, { autoAlpha: 0, duration: 0.05 }, t + 0.33);
    cue('bloop', t + 0.36, { pitch: i });
  });
  const squad = caption(s, "the squad's in :saluting_face:", { x: 700, y: 430, cls: 'small mint', rot: 4 });
  pop(squad, 8.9);

  // Grade: the ballot, big.
  tl.to(ph.el, { y: -1900, rotation: -10, duration: 0.36, ease: 'power3.in' }, 8.98);
  vanish(share, 9.0);
  vanish(squad, 9.0);
  cue('whoosh', 9.0);
  const zb = 2.1;
  const ballot = ui.mjBallot(TEAM);
  const bcard = card(s, zb, ballot.el);
  const bx = (W - 390 * zb) / 2;
  gsap.set(bcard, { x: bx, y: 2000, rotation: 6 });
  tl.to(bcard, { y: 470, rotation: 0, duration: 0.5, ease: 'back.out(1.2)' }, 9.1);
  const restB = { x: bx, y: 470 };
  const grade = step(s, '3', 'vibe-check every option', 280, { size: 74 });
  pop(grade, 9.15);
  const choices = [[0, 'VeryGood', 9.75], [1, 'Passable', 10.25], [2, 'Excellent', 10.75]];
  onFrame((t) => {
    if (t < 8.5 || t > T.live + 0.5) return;
    for (const [row, mention, at] of choices) ballot.choose(row, t >= at ? mention : null);
    ballot.setCounted(t >= 11.0);
  });
  const reactions = [
    ['W :handshake:', 'mint', 7],
    ['mid :face_with_rolling_eyes:', 'pink', -6],
    ['ICONIC :fire:', 'sun', 6],
  ];
  const first = spot(ballot.step(0, 'VeryGood'), bcard, restB, 9.7);
  showFinger(hand, 9.25, first.x, first.y);
  choices.forEach(([row, mention, at], i) => {
    const swatch = spot(ballot.step(row, mention), bcard, restB, at);
    tap(hand, swatch.x, swatch.y, at);
    cue('mention', at + 0.02, { mention });
    const [text, color, rot] = reactions[i];
    const react = caption(s, text, { x: 885, y: swatch.y - 6, cls: `small ${color}`, rot });
    pop(react, at + 0.06, { sound: 'boing' });
    wobble(react, at + 0.4, 0.9, 5);
    vanish(react, T.live - 0.15);
  });
  hideFinger(hand, 10.95);
  const dragon = emoji('dragon', 170);
  dragon.classList.add('abs');
  s.append(dragon);
  const drRow = spot(ballot.step(2, 'Excellent'), bcard, restB, 10.8);
  place(dragon, 72, drRow.y - 40, -12);
  pop(dragon, 10.82, { sound: null, from: 0 });
  vanish(dragon, T.live - 0.15);

  // Watch: the results, live.
  tl.to(bcard, { x: -1300, rotation: -14, duration: 0.36, ease: 'power3.in' }, 11.3);
  vanish(grade, 11.32);
  const zr = 2.05;
  const results = ui.mjResults(TEAM);
  const rcard = card(s, zr, results.el);
  const rx = (W - 390 * zr) / 2;
  gsap.set(rcard, { x: 1300, y: 450, rotation: 10 });
  tl.to(rcard, { x: rx, rotation: 0, duration: 0.45, ease: 'back.out(1.2)' }, 11.4);
  cue('whoosh', 11.35);
  const watch = step(s, '4', 'watch it live :eyes:', 280, { rot: 2 });
  pop(watch, 11.55);
  tl.to(rcard, { scale: 1.035, duration: 2.9, ease: 'sine.inOut' }, 11.9);

  const states = [TEAM.map(() => ({}))];
  for (const ballotRow of TEAM_BALLOTS) {
    states.push(states[states.length - 1].map((counts, i) => ({ ...counts, [ballotRow[i]]: (counts[ballotRow[i]] ?? 0) + 1 })));
  }
  const slots = states.map((counts) => slotsOf(counts.map(judgment)));
  const widths = states.map((counts) => counts.map(ui.sharesOf));
  const progress = arrivals(TEAM_TIMES);
  onFrame((t) => {
    if (t < 11 || t > T.trip + 0.4) return;
    const { k, p } = progress(t);
    const before = Math.max(0, k - 1);
    results.update({
      counts: states[k],
      widths: widths[k].map((w, i) => Object.fromEntries(MENTIONS.map((m) => [m, lerp(widths[before][i][m], w[m], p)]))),
      slots: slots[k].map((slot, i) => lerp(slots[before][i], slot, easeInOut(p))),
    });
  });
  const restR = { x: rx, y: 450 };
  const count = spot(results.el.querySelector('.results-count'), rcard, restR, 11.9);
  TEAM_TIMES.forEach((t, i) => {
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

  const winner = spot(results.cards[0].el, rcard, restR, 13.8);
  confetti(s, 13.62, { x: winner.x, y: winner.y, count: 80, spread: 300, velocity: [800, 1700] });
  cue('tada', 13.6);
  vanish(watch, 13.55);
  const wins = caption(s, "C'est pas faux wins :trophy:", { y: 285, cls: 'sun', rot: -3, size: 80 });
  slam(wins, 13.65, { rot: -3 });
  const moral = caption(s, 'not the loudest. the most liked. :handshake:', { y: 1620, cls: 'black small wrap', rot: 2 });
  moral.style.width = '860px';
  moral.style.textAlign = 'center';
  pop(moral, 14.15);

  // Whip pan to the trip.
  tl.to(s, { x: -W, duration: 0.32, ease: 'power3.inOut' }, 14.85);
  cue('whoosh', 14.85);
}

// ----------------------------------------------------------------------------
// 4. The trip, 15-21 s: approval voting, and a live plot twist.

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
const TRIP_TIMES = Array.from({ length: 18 }, (_, i) => 18.4 + 1.38 * (i / 17) ** 0.85);

function tripScene(root) {
  const s = scene(root, 'sky-bg', 14.85, T.food + 0.35);
  tl.fromTo(s, { x: W }, { x: 0, duration: 0.32, ease: 'power3.inOut', immediateRender: false }, 14.85);
  gsap.set(s, { x: W });
  const hand = finger(s);

  [[-60, 260, 1], [620, 160, 0.7], [760, 1640, 1.1], [-120, 1460, 0.8], [300, 1820, 0.9]].forEach(([x, y, k], i) => {
    const cloud = h('div', { class: 'cloud' });
    s.prepend(cloud);
    gsap.set(cloud, { x, y, scale: k });
    tl.to(cloud, { x: x + (i % 2 ? -120 : 140), duration: 6, ease: 'none' }, 15);
  });

  const trip = h('div', { class: 'big' }, sentence('summer trip?'));
  s.append(trip);
  place(trip, 540, 640, -4, { autoAlpha: 1 });
  const tripWords = trip.querySelectorAll('.w');
  gsap.set(tripWords, { autoAlpha: 0 });
  tl.fromTo(tripWords, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'back.out(3)', stagger: 0.2, immediateRender: false }, 15.32);
  cue('pop', 15.32);
  cue('pop', 15.52, { pitch: 2 });

  const plane = emoji('airplane', 300);
  plane.classList.add('abs');
  s.append(plane);
  gsap.set(plane, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
  tl.set(plane, { autoAlpha: 1 }, 15.08);
  tl.fromTo(plane, { x: -260, y: 560 }, {
    motionPath: { path: [{ x: -260, y: 560 }, { x: 300, y: 430 }, { x: 800, y: 400 }, { x: 1380, y: 450 }], curviness: 1.2, autoRotate: 45 },
    duration: 0.8, ease: 'none', immediateRender: false,
  }, 15.08);
  cue('plane', 15.08);

  const spots = [[250, 960, -6], [560, 920, 4], [860, 980, -3], [360, 1250, 3], [760, 1270, -5]];
  DESTINATIONS.forEach(([name, icon], i) => {
    const el = h('div', { class: 'sticker' }, emoji(icon, 140), h('span', {}, name));
    s.append(el);
    const [x, y, rot] = spots[i];
    place(el, x, y, rot);
    pop(el, 15.78 + i * 0.12, { pitch: i + 2 });
    wobble(el, 16.1 + i * 0.05, 0.8, 4);
    tl.to(el, { scale: 0, autoAlpha: 0, rotation: rot + 30, duration: 0.22, ease: 'back.in(2)' }, 16.42 + i * 0.03);
  });
  vanish(trip, 16.4);

  // Tick every place you would go.
  const za = 2.1;
  const ballot = ui.approvalBallot(TRIP);
  const bcard = card(s, za, ballot.el);
  gsap.set(bcard, { x: (W - 390 * za) / 2, y: 2000, rotation: -5 });
  tl.to(bcard, { y: 450, rotation: 0, duration: 0.48, ease: 'back.out(1.2)' }, 16.5);
  const restA = { x: (W - 390 * za) / 2, y: 450 };
  cue('whoosh', 16.5);
  const tickAll = caption(s, "tick all you're down for :check_mark_button:", { y: 290, size: 70, rot: 2 });
  pop(tickAll, 16.55);
  const system = caption(s, 'approval voting', { x: 760, y: 388, cls: 'tiny ink', rot: -4 });
  system.style.zIndex = 5; // a tag on whichever caption is above it
  pop(system, 16.68);
  const ticks = [[0, 17.0], [1, 17.32], [2, 17.64]];
  onFrame((t) => {
    if (t < 16 || t > 18.5) return;
    for (const [row, at] of ticks) ballot.tick(row, t >= at);
    ballot.setCounted(t >= 17.74);
  });
  const firstTick = spot(ballot.choice(0), bcard, restA, 16.95);
  showFinger(hand, 16.5, firstTick.left + 55, firstTick.y);
  for (const [row, at] of ticks) {
    const box = spot(ballot.choice(row), bcard, restA, at);
    tap(hand, box.left + 55, box.y, at);
    cue('check', at + 0.02, { pitch: row });
  }
  hideFinger(hand, 17.78);

  // Results, live: Guadeloupe leads, then Japan.
  tl.to(bcard, { x: -1300, rotation: -12, duration: 0.34, ease: 'power3.in' }, 17.86);
  const za2 = 2.15;
  const results = ui.approvalResults(TRIP);
  const rcard = card(s, za2, results.el);
  gsap.set(rcard, { x: 1300, y: 470, rotation: 9 });
  tl.to(rcard, { x: (W - 390 * za2) / 2, rotation: 0, duration: 0.45, ease: 'back.out(1.2)' }, 17.95);
  cue('whoosh', 17.9);
  vanish(tickAll, 17.9);
  const moving = caption(s, 'results move live :eyes:', { y: 290, rot: -2 });
  pop(moving, 18.08);
  tl.to(rcard, { scale: 1.03, duration: 2.4, ease: 'sine.inOut' }, 18.4);

  const counts = Array.from({ length: 19 }, (_, k) => APPROVED.map((set) => set.filter((b) => b <= k).length));
  const slots = counts.map((c) => slotsOf(c.map(approval)));
  const progress = arrivals(TRIP_TIMES, 0.25);
  onFrame((t) => {
    if (t < 17.5 || t > T.food + 0.4) return;
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
  TRIP_TIMES.forEach((t, i) => cue('coin', t, { pitch: i % 8, gain: 0.7 }));

  const twist = caption(s, 'PLOT TWIST :face_screaming_in_fear:', { y: 1560, cls: 'coral', rot: -5, size: 96 });
  slam(twist, 19.9, { rot: -5 });
  vanish(twist, 20.55);
  vanish(moving, 19.95);
  const japan = caption(s, 'Japan it is :sushi::airplane:', { y: 300, cls: 'sun', rot: 3 });
  pop(japan, 20.05, { sound: 'tada' });
  for (let i = 0; i < 26; i++) {
    const petal = emoji('cherry_blossom', between(60, 110));
    petal.classList.add('abs');
    s.append(petal);
    const x = between(40, 1040);
    gsap.set(petal, { x, y: -120, xPercent: -50, yPercent: -50, rotation: between(0, 360) });
    const t = 19.98 + between(0, 0.6);
    tl.to(petal, { y: between(1500, 2100), x: x + between(-200, 200), rotation: `+=${between(-360, 360)}`, duration: between(1.1, 1.6), ease: 'power1.in' }, t);
  }

  // Swipe up to dinner.
  tl.to(s, { y: -H, duration: 0.34, ease: 'power3.inOut' }, 20.84);
  cue('swoosh', 20.84);
}

// ----------------------------------------------------------------------------
// 5. Dinner, 21-26.5 s: a join code shouted, results kept until closing.

const FOOD = ['Pizza', 'Sushi', 'Tacos', 'Burgers'];
const FOOD_COUNTS = [
  { Excellent: 3, VeryGood: 5, Good: 4, Fair: 2 },
  { Excellent: 6, Good: 2, Fair: 1, Passable: 2, Inadequate: 2, Bad: 1 },
  { Excellent: 1, VeryGood: 3, Good: 5, Fair: 3, Passable: 2 },
  { VeryGood: 2, Good: 3, Fair: 4, Passable: 3, Inadequate: 2 },
];

function foodScene(root) {
  const s = scene(root, 'gingham', 20.84, T.blitz + 0.1);
  tl.fromTo(s, { y: H }, { y: 0, duration: 0.34, ease: 'power3.inOut', immediateRender: false }, 20.84);
  gsap.set(s, { y: H });
  const hand = finger(s);

  const dinner = h('div', { class: 'big' }, sentence('dinner tonight?'));
  dinner.style.fontSize = '176px';
  s.append(dinner);
  place(dinner, 540, 600, -3, { autoAlpha: 1 });
  const dinnerWords = dinner.querySelectorAll('.w');
  gsap.set(dinnerWords, { autoAlpha: 0 });
  tl.fromTo(dinnerWords, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'back.out(3)', stagger: 0.2, immediateRender: false }, 21.15);
  cue('pop', 21.15);
  cue('pop', 21.35, { pitch: 3 });

  const foods = ['pizza', 'sushi', 'taco', 'hamburger', 'pizza', 'french_fries', 'sushi', 'taco', 'steaming_bowl', 'hamburger', 'pizza', 'sushi', 'taco', 'french_fries', 'hamburger', 'pizza'];
  foods.forEach((name, i) => {
    const food = emoji(name, between(150, 210));
    food.classList.add('abs');
    s.append(food);
    const x = 90 + ((i * 397) % 900);
    const floor = between(1560, 1800);
    gsap.set(food, { x, y: -250, xPercent: -50, yPercent: -50, rotation: between(-30, 30) });
    const t = 21.1 + i * 0.045;
    tl.to(food, { y: floor, rotation: `+=${between(-60, 60)}`, duration: between(0.55, 0.75), ease: 'bounce.out' }, t);
    if (i % 4 === 0) cue('boing', t + 0.4, { pitch: i });
  });

  // The join code, out loud.
  vanish(dinner, 21.95);
  const codeCard = h('div', { class: 'code-card' },
    h('span', { class: 'label' }, 'JOIN CODE'),
    h('span', { class: 'code' }, 'YUM-YUM'),
    h('span', { class: 'where' }, 'to enter at super-vote.org'));
  s.append(codeCard);
  place(codeCard, 540, 900, -2);
  slam(codeCard, 22.1, { rot: -2, from: 2 });
  const shout = caption(s, 'no link? just shout the code', { y: 330, rot: 2, size: 76 });
  pop(shout, 22.2);
  const megaphone = emoji('megaphone', 230);
  megaphone.classList.add('abs');
  s.append(megaphone);
  place(megaphone, 190, 1230, 0, { scaleX: -1 });
  pop(megaphone, 22.25, { sound: 'honk', from: 0 });
  tl.to(megaphone, { rotation: '+=10', duration: 0.6, ease: 'wobble' }, 22.45);
  const waves = h('div', {
    class: 'wave',
    html: `<svg width="300" height="300" viewBox="0 0 300 300" style="overflow:visible">${[60, 105, 150].map((r) => `<path d="M ${r * 0.7} ${-r * 0.7} A ${r} ${r} 0 0 1 ${r * 0.7} ${r * 0.7}" transform="translate(40 150)" fill="none" stroke="#121212" stroke-width="12" stroke-linecap="round"/>`).join('')}</svg>`,
  });
  s.append(waves);
  gsap.set(waves, { x: 270, y: 990, autoAlpha: 0, rotation: -40, transformOrigin: '40px 150px' });
  const arcs = waves.querySelectorAll('path');
  tl.set(waves, { autoAlpha: 1 }, 22.3);
  tl.fromTo(arcs, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, stagger: 0.1, repeat: 2, repeatDelay: 0.1, immediateRender: false }, 22.3);
  const joiners = ['fox', 'frog', 'unicorn', 'alien'].map((name, i) => {
    const face = emoji(name, 140);
    face.classList.add('abs');
    s.append(face);
    place(face, [790, 930, 610, 900][i], [1210, 1090, 1320, 1380][i], between(-15, 15));
    pop(face, 22.55 + i * 0.1, { sound: 'bloop', pitch: i * 2, from: 0 });
    return face;
  });
  for (const el of [codeCard, megaphone, waves, ...joiners]) vanish(el, 23.3);
  vanish(shout, 23.3);

  // Results kept until the poll closes; the creator closes it.
  const zf = 2.0;
  const results = ui.mjResults(FOOD);
  const owner = ui.ownerActions();
  const column = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } }, results.el, owner.el);
  const fcard = card(s, zf, column);
  gsap.set(fcard, { x: (W - 390 * zf) / 2, y: 2000, rotation: 5 });
  tl.to(fcard, { y: 470, rotation: 0, duration: 0.48, ease: 'back.out(1.2)' }, 23.4);
  const restF = { x: (W - 390 * zf) / 2, y: 470 };
  cue('whoosh', 23.4);
  const peek = caption(s, 'no peeking till it closes :see-no-evil_monkey:', { y: 300, size: 68, rot: -2 });
  pop(peek, 23.55);
  const empty = FOOD.map(() => ({}));
  const slotsFinal = slotsOf(FOOD_COUNTS.map(judgment));
  onFrame((t) => {
    if (t < 23 || t > T.blitz + 0.2) return;
    const closed = t >= 25.5;
    const n = closed ? 14 : Math.min(14, 9 + Math.max(0, Math.floor((t - 23.7) / 0.14)));
    results.setFinal(closed);
    results.list.style.display = closed ? '' : 'none';
    results.footer.style.display = closed ? '' : 'none';
    owner.el.style.display = closed ? 'none' : '';
    owner.close.classList.toggle('pressed', t >= 24.7 && t < 24.85);
    if (closed) {
      const p = clamp01((t - 25.5) / 0.35);
      results.update({ counts: FOOD_COUNTS, widths: FOOD_COUNTS.map((c) => Object.fromEntries(Object.entries(ui.sharesOf(c)).map(([m, w]) => [m, w * easeOut(p)]))), slots: slotsFinal });
    } else {
      results.update({ counts: empty, slots: [0, 1, 2, 3] });
      results.setCount(n);
      results.setHint('The results show once you close the poll.');
    }
  });
  for (let i = 0; i < 5; i++) cue('coin', 23.84 + i * 0.14, { pitch: i, gain: 0.7 });
  const monkey = emoji('see-no-evil_monkey', 200);
  monkey.classList.add('abs');
  s.append(monkey);
  place(monkey, 930, 470, 14);
  pop(monkey, 23.85, { sound: 'boing', from: 0 });
  wobble(monkey, 24.2, 1.2, 8);
  vanish(monkey, 25.45);

  const close = spot(owner.close, fcard, restF, 24.6);
  showFinger(hand, 24.25, close.x, close.y);
  tap(hand, close.x, close.y, 24.75);
  hideFinger(hand, 24.95);
  cue('drumroll', 24.8, { until: 25.5 });
  tl.to(s, { scale: 1.04, duration: 0.7, ease: 'power1.in' }, 24.8);
  tl.to(s, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, 25.5);
  cue('crash', 25.5);
  shake(25.5, 26, 0.5);
  vanish(peek, 25.45);

  const pizza = spot(results.cards[0].el, fcard, restF, 25.9);
  confetti(s, 25.55, { x: pizza.x, y: pizza.top + 60, count: 26, emojis: ['pizza'], size: 110, spread: 220, velocity: [900, 1700], sound: 'tada' });
  const crown = emoji('crown', 170);
  crown.classList.add('abs');
  s.append(crown);
  place(crown, pizza.left + 120, pizza.top - 30, -18);
  tl.fromTo(crown, { y: -200, autoAlpha: 0 }, { y: pizza.top - 30, autoAlpha: 1, duration: 0.45, ease: 'bounce.out', immediateRender: false }, 25.65);
  cue('boing', 25.9);
  const obviously = caption(s, ':pizza: pizza. obviously.', { y: 300, cls: 'sun', rot: 3 });
  slam(obviously, 25.75, { rot: 3 });

  // Cut to the blitz.
  tl.to(s, { scale: 0.6, autoAlpha: 0, duration: 0.16, ease: 'power2.in' }, T.blitz - 0.3);
}

// ----------------------------------------------------------------------------
// 6. The blitz, 26.5-30.5 s: one promise a beat.

const PROMISES = [
  ['no account', 'person_gesturing_no', '#fff'],
  ['100% free', 'money_with_wings', 'var(--sun)'],
  ['open source', 'red_heart', 'var(--mint)'],
  ['nobody sees your ballot', 'locked', 'var(--pink)'],
  ['live results', 'high_voltage', 'var(--lilac)'],
  ['gone after 30 days', 'broom', 'var(--coral)'],
  ['English & français', 'globe_showing_europe-africa', 'var(--sky)'],
  ['AI agents welcome', 'robot', '#fff'],
];

/** On the beat, then twice as fast. */
const BLITZ_TIMES = [26.5, 27, 27.5, 28, 28.5, 28.75, 29, 29.25];

function blitzScene(root) {
  const s = scene(root, 'ink-bg blitz', T.blitz - 0.2, T.end + 0.4);
  const dots = h('div', { class: 'halftone' });
  s.append(dots);
  tl.fromTo(dots, { rotation: 0 }, { rotation: 20, duration: 4.6, ease: 'none' }, T.blitz - 0.2);
  tl.fromTo(s, { scale: 1.3 }, { scale: 1, duration: 0.25, ease: 'power3.out', immediateRender: false }, T.blitz - 0.2);
  cue('whoosh', T.blitz - 0.25);
  const spots = [[420, 330, -6], [690, 500, 5], [380, 670, -4], [560, 840, 3], [700, 1010, -5], [400, 1180, 4], [600, 1350, -3], [470, 1520, 5]];
  const stickers = PROMISES.map(([text, name, color], i) => {
    const el = h('div', { class: 'sticker row', style: { background: color } }, emoji(name, 100), h('span', {}, text));
    s.append(el);
    const [x, y, rot] = spots[i];
    place(el, x, y, rot);
    slam(el, BLITZ_TIMES[i], { rot, from: 1.9 });
    return el;
  });
  stickers.forEach((el, i) => {
    tl.to(el, { x: 540 + (i % 2 ? 1 : -1) * 1400, y: `+=${between(-400, 400)}`, rotation: between(-90, 90), duration: 0.3, ease: 'power3.in' }, T.end - 0.3 + i * 0.012);
  });
  cue('whoosh', T.end - 0.3);
}

// ----------------------------------------------------------------------------
// 7. The end card, 30.5-35 s.

function endScene(root) {
  const s = scene(root, 'end-bg', T.end);
  tl.fromTo(s, { clipPath: 'circle(0% at 50% 40%)' }, { clipPath: 'circle(150% at 50% 40%)', duration: 0.4, ease: 'power2.in', immediateRender: false }, T.end);
  gsap.set(s, { clipPath: 'circle(0% at 50% 40%)' });
  const burst = h('div', { class: 'sunburst' });
  s.append(burst);
  tl.fromTo(burst, { rotation: 0 }, { rotation: 30, duration: 4.6, ease: 'none' }, T.end);

  const logo = h('img', { class: 'logo-big', src: 'assets/logo.svg', alt: '' });
  logo.style.width = logo.style.height = '360px';
  s.append(logo);
  place(logo, 540, 700);
  tl.fromTo(logo, { scale: 0, rotation: -30, autoAlpha: 1 }, { scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)', immediateRender: false }, 30.62);
  cue('boom', 30.62, { gain: 0.6 });
  wobble(logo, 31.4, 3.4, 3);

  const word = h('div', { class: 'wordmark dark' }, [...'super-vote'].map((c) => h('span', {}, c)));
  word.style.fontSize = '150px';
  s.append(word);
  place(word, 540, 990, 0, { autoAlpha: 1 });
  const letters = word.querySelectorAll('span');
  gsap.set(letters, { autoAlpha: 0 });
  tl.fromTo(letters, { y: -240, autoAlpha: 0, rotation: () => between(-40, 40) },
    { y: 0, autoAlpha: 1, rotation: 0, duration: 0.4, ease: 'back.out(2.2)', stagger: 0.03, immediateRender: false }, 30.9);
  for (let i = 0; i < 10; i += 3) cue('tick', 30.98 + i * 0.03, { pitch: i });

  const url = h('div', { class: 'url' }, 'super-vote.org');
  s.append(url);
  place(url, 540, 1190, -2);
  slam(url, 31.45, { rot: -2, sound: 'ding' });

  const tagline = h('div', { class: 'tagline' }, sentence('decide together.'));
  s.append(tagline);
  place(tagline, 540, 1370);
  pop(tagline, 31.85, { sound: 'pop' });
  const fine = h('div', { class: 'small-print' }, 'free · no account · open source');
  s.append(fine);
  place(fine, 540, 1460);
  pop(fine, 32.15, { sound: null });

  const orbit = [['dragon', 170, 500, -12], ['mount_fuji', 910, 470, 10], ['pizza', 150, 1560, -8], ['handshake', 930, 1560, 8], ['fire', 880, 860, 12], ['party_popper', 190, 880, -10]];
  orbit.forEach(([name, x, y, rot], i) => {
    const el = emoji(name, 170);
    el.classList.add('abs');
    s.append(el);
    place(el, x, y, rot);
    pop(el, 30.75 + i * 0.09, { sound: i % 2 ? null : 'bloop', pitch: i, from: 0 });
    tl.to(el, { y: `+=${i % 2 ? 26 : -26}`, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: 2 }, 31.3 + i * 0.1);
  });
}

export function build(root) {
  shakeHook(root);
  hookScene(root);
  brandScene(root);
  teamScene(root);
  tripScene(root);
  foodScene(root);
  blitzScene(root);
  endScene(root);
  tl.set({}, {}, T.done);
  return T.done;
}
