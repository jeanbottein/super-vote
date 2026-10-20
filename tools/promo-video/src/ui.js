// The web app's screens, as its components render them (clients/web/src), in
// its own stylesheets (app.css). Each builder returns the element and what
// the scenes may change on it. English copy is en.tsx's.

import { h } from './util.js';
import { MENTIONS, approval, judgment, ranks, total } from './ranking.js';

export const MENTION_NAMES = {
  Excellent: 'Excellent', VeryGood: 'Very Good', Good: 'Good', Fair: 'Fair', Passable: 'Passable', Inadequate: 'Inadequate', Bad: 'Bad',
};

const ICONS = {
  back: '<path d="M15 18l-6-6 6-6" />',
  close: '<path d="M18 6L6 18M6 6l12 12" />',
  settings: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" />',
  share: '<path d="M12 3v12M7 8l5-5 5 5" /><path d="M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6" />',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />',
};

const icon = (name) => h('span', {
  style: { display: 'contents' },
  html: `<svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`,
});

const ballots = (count) => `${count.toLocaleString('en')} ${count === 1 ? 'ballot' : 'ballots'}`;
const percent = (share) => new Intl.NumberFormat('en', { style: 'percent' }).format(share);
const decimal = (value) => new Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

/** A piece of the app: its tokens, fonts and phone layout, at a given zoom. */
export function app(width, zoom, ...children) {
  return h('div', { class: 'app', style: { width: `${width}px`, zoom } }, ...children);
}

function header() {
  return h('header', { class: 'app-header' },
    h('div', { class: 'app-header-inner' },
      h('a', { class: 'icon-button' }, icon('back')),
      h('a', { class: 'brand' }, h('img', { class: 'logo', src: 'assets/logo.svg', alt: '' }), 'super-vote'),
      h('button', { class: 'icon-button', type: 'button' }, icon('settings'))));
}

/** A phone's screen: the header over a page that can scroll. */
export function screen(...content) {
  const page = h('main', { class: 'page' }, ...content);
  const scroller = h('div', { class: 'screen-scroll' }, h('div', { class: 'app-glow' }), page);
  const root = h('div', { class: 'app screen' }, scroller, header());
  return { root, page, scroller };
}

function segmented(legend, labels, chosen, hint, tone) {
  return h('fieldset', { class: 'segmented' },
    h('legend', {}, legend),
    h('div', { class: 'segmented-options' }, labels.map((label) => h('label', { class: 'segmented-option' },
      h('input', { type: 'radio', checked: label === chosen }), h('span', {}, label)))),
    hint && h('p', { class: 'hint', 'data-tone': tone }, hint));
}

/** CreatePollPage: the question, its options, how it runs. */
export function createForm() {
  const title = h('input', { placeholder: 'Where do we eat on Friday?' });
  const rows = h('ol', { class: 'option-rows' });
  const button = h('button', { type: 'button', class: 'button primary wide' }, 'Ask the question');
  const el = h('form', { class: 'panel create-poll' },
    h('h1', {}, 'Decide together'),
    h('div', { class: 'field' }, h('label', {}, 'Question'), title),
    h('fieldset', { class: 'field' }, h('legend', {}, 'Options'), rows,
      h('p', { class: 'hint' }, 'Up to 20 options. A new row appears as you type.')),
    segmented('Order of the options', ['A to Z', 'Shuffled', 'As written'], 'Shuffled',
      'Each voter sees them in an order of their own, drawn again each time they open the poll, so that no option gains from its place.'),
    segmented('Voting system', ['Majority judgment', 'Approval'], 'Majority judgment',
      'Voters rate every option from Excellent to Bad. The option a majority rates best wins: nuanced, and hard to game.'),
    segmented('Who can vote', ['Anyone', 'Invited only'], 'Anyone',
      'Anyone with the link or the code can vote. Someone set on it can vote again from another browser or device: super-vote counts on good faith, and the number of ballots shows if someone did. To count each person once, invite them.', 'warning'),
    segmented('Who voted', ['Anonymous', 'Show names'], 'Anonymous', 'Nobody sees who voted, only how many did.'),
    segmented('Results', ['Live', 'Delayed', 'At close'], 'Live',
      'Careful: everyone sees the results move as each ballot arrives. In a small group, that shows who chose what.', 'warning'),
    h('div', { class: 'create-poll-notes' },
      h('p', { class: 'hint' }, 'Polls are deleted 30 days after they are created, with their ballots.'),
      h('p', { class: 'hint' }, h('span', { class: 'app-name' }, 'super-vote'), ' is for everyday decisions, not for official or binding votes. ', h('a', {}, 'Privacy and limits'))),
    button);

  /** options: the texts typed so far; focus: 'title', a row's index, or null. */
  function set({ question, options, focus }) {
    title.value = question;
    title.classList.toggle('focused', focus === 'title');
    const shown = [...options];
    if (shown.length === 0 || shown[shown.length - 1] !== '') shown.push('');
    while (shown.length < 2) shown.push('');
    while (rows.children.length < shown.length) {
      const index = rows.children.length;
      rows.append(h('li', { class: 'option-row' },
        h('input', { placeholder: `Option ${index + 1}`, 'aria-label': `Option ${index + 1}` }),
        h('button', { type: 'button', class: 'icon-button' }, icon('close'))));
    }
    [...rows.children].forEach((row, index) => {
      row.hidden = index >= shown.length;
      const input = row.querySelector('input');
      input.value = shown[index] ?? '';
      input.classList.toggle('focused', focus === index);
      row.querySelector('.icon-button').style.display = (shown[index] ?? '') === '' ? 'none' : '';
    });
  }
  set({ question: '', options: [], focus: null });
  return { el, set, button };
}

/** PollHeader, and the callout a new poll shows its creator. */
export function pollTop({ title, system }) {
  return h('div', { style: { display: 'contents' } },
    h('section', { class: 'poll-header' },
      h('h1', {}, title),
      h('div', { class: 'poll-header-row' },
        h('p', { class: 'poll-meta' }, h('span', {}, system), h('span', {}, 'Private'), h('span', {}, 'Created just now')),
        h('button', { type: 'button', class: 'button secondary' }, icon('share'), ' Share'))),
    h('section', { class: 'panel callout' },
      h('p', {}, h('strong', {}, 'Your poll is ready.'), ' Share its link to collect ballots.'),
      h('button', { type: 'button', class: 'button primary' }, icon('share'), ' Share')));
}

/** ShareDialog as a phone's sheet, without the native <dialog>'s top layer. */
export function shareSheet({ code, url, qr }) {
  return h('div', { class: 'dialog sheet' },
    h('div', { class: 'dialog-body' },
      h('div', { class: 'dialog-header' }, h('h2', {}, 'Share this poll'),
        h('button', { type: 'button', class: 'icon-button' }, icon('close'))),
      h('p', { class: 'hint' }, 'Anyone with the code or the link can vote. The poll is not listed anywhere else.'),
      h('div', { class: 'share-code' },
        h('span', { class: 'share-code-label' }, 'Join code'),
        h('strong', { class: 'join-code' }, code),
        h('span', { class: 'hint' }, 'to enter at super-vote.org')),
      h('div', { class: 'share-link' }, h('input', { value: url, readOnly: true }),
        h('button', { type: 'button', class: 'button primary' }, 'Copy')),
      h('div', { class: 'share-qr', html: qr }),
      h('button', { type: 'button', class: 'button secondary wide' }, icon('share'), ' Share through an app'),
      h('a', { class: 'button secondary wide' }, icon('mail'), ' Send by email')));
}

/** BallotFrame, live, with the voter's ballot inside. */
function ballotFrame(instructions, body) {
  const withdraw = h('button', { type: 'button', class: 'button link' }, 'Withdraw');
  const status = h('p', { class: 'ballot-status', 'data-counted': 'false' }, 'You have not voted yet.');
  const el = h('section', { class: 'ballot' },
    h('div', { class: 'section-header' }, h('h2', {}, 'Your ballot'), withdraw),
    h('div', { class: 'ballot-body' },
      h('p', { class: 'hint' }, instructions),
      h('p', { class: 'hint' }, 'The options are shuffled for each voter, so that none gains from its place.'),
      body,
      status));
  function setCounted(counted) {
    withdraw.style.visibility = counted ? '' : 'hidden';
    status.dataset.counted = String(counted);
    status.textContent = counted
      ? 'Your ballot is counted. You can change it from this browser until the poll closes.'
      : 'You have not voted yet.';
  }
  setCounted(false);
  return { el, setCounted, status };
}

/** MajorityJudgmentBallot: a scale of the seven mentions per option. */
export function mjBallot(options) {
  const rows = options.map((label) => {
    const chosen = h('span', { class: 'mj-ballot-chosen' }, 'Not rated yet');
    const steps = MENTIONS.map((mention) => {
      const input = h('input', { type: 'radio' });
      return {
        mention,
        input,
        el: h('label', { class: 'mj-scale-step', 'data-mention': mention },
          input, h('span', { class: 'mj-scale-mark' }), h('span', { class: 'mj-scale-name' }, MENTION_NAMES[mention])),
      };
    });
    return {
      chosen,
      steps,
      el: h('div', { class: 'mj-ballot-row' },
        h('div', { class: 'mj-ballot-row-head' }, h('span', { class: 'mj-ballot-option' }, label), chosen),
        h('div', { class: 'mj-scale' }, steps.map((step) => step.el))),
    };
  });
  const frame = ballotFrame('Give every option a mention. Options you have not rated count as Bad.',
    h('div', { class: 'mj-ballot' },
      h('div', { class: 'mj-scale-legend' }, h('span', {}, 'Excellent'), h('span', {}, 'Bad')),
      rows.map((row) => row.el)));

  function choose(index, mention) {
    const row = rows[index];
    for (const step of row.steps) step.input.checked = step.mention === mention;
    if (mention) {
      row.chosen.dataset.mention = mention;
      row.chosen.textContent = MENTION_NAMES[mention];
    } else {
      delete row.chosen.dataset.mention;
      row.chosen.textContent = 'Not rated yet';
    }
  }
  /** Where a mention's swatch is, for a finger to tap it. */
  const step = (index, mention) => rows[index].steps.find((s) => s.mention === mention).el;
  return { el: frame.el, choose, step, setCounted: frame.setCounted, status: frame.status };
}

/** ApprovalBallot: a box per option. */
export function approvalBallot(options) {
  const choices = options.map((label) => {
    const input = h('input', { type: 'checkbox' });
    return { input, el: h('label', { class: 'approval-choice' }, input, h('span', {}, label)) };
  });
  const frame = ballotFrame('Tick every option you would be happy with.',
    h('fieldset', { class: 'approval-ballot' }, h('legend', { class: 'visually-hidden' }, 'Options you approve'), choices.map((c) => c.el)));
  const tick = (index, on) => { choices[index].input.checked = on; };
  const choice = (index) => choices[index].el;
  return { el: frame.el, tick, choice, setCounted: frame.setCounted, status: frame.status };
}

/** ResultsSection's frame: its header, count and live status. */
function resultsPanel(body) {
  const count = h('span', { class: 'results-count' }, ballots(0));
  const live = h('span', { class: 'live-status', 'data-state': 'live', role: 'status' }, 'Live');
  const hint = h('p', { class: 'hint' });
  hint.hidden = true;
  const footer = h('div', { class: 'results-footer' }, h('button', { type: 'button', class: 'button link' }, 'Download the results'));
  const el = h('section', { class: 'panel results' },
    h('div', { class: 'section-header' }, h('h2', {}, 'Results'), count, live),
    hint, body, footer);
  return {
    el,
    footer,
    setCount(n) { count.textContent = ballots(n); },
    setFinal(final) {
      live.dataset.state = final ? 'closed' : 'live';
      live.textContent = final ? 'Final' : 'Live';
    },
    setHint(text) {
      hint.hidden = !text;
      hint.textContent = text ?? '';
    },
  };
}

/** Each mention's share of an option's ballots, 0 to 1. */
export function sharesOf(counts) {
  const n = total(counts);
  return Object.fromEntries(MENTIONS.map((mention) => [mention, n ? (counts[mention] ?? 0) / n : 0]));
}

const TICKS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const MEDALS = ['gold', 'silver', 'bronze'];

/** MajorityJudgmentResultsGraph, one card per option, placed by rank. */
function mjCard(label) {
  const badge = h('div', { class: 'mj-rank-badge' });
  const bars = Object.fromEntries(MENTIONS.map((mention) => [mention, h('div', { class: 'mj-results-bar', 'data-judgment': mention, style: { width: '0%' } })]));
  const majority = h('div', { class: 'mj-results-badge' });
  const score = h('div', { class: 'mj-score-badge' });
  const badges = h('div', { class: 'mj-results-badges-below' },
    h('div', { class: 'mj-results-badges' },
      h('span', { class: 'mj-results-hint' }, 'Majority Mention:'), majority,
      h('span', { class: 'mj-results-hint' }, 'GMJ Score:'), score));
  const rank = h('div', { class: 'mj-rank-container' }, badge);
  const el = h('div', { class: 'mj-results-card', 'data-compact': 'false', 'data-winner': 'false' },
    h('div', { class: 'mj-results-header' }, h('div', { class: 'mj-results-title-section' }, rank, h('div', { class: 'mj-results-title' }, label))),
    h('div', { class: 'mj-results-chart' }, h('div', { class: 'mj-results-bars', role: 'img' }, Object.values(bars))),
    h('div', { class: 'mj-results-axis' }, TICKS.map((tick) => h('div', { class: 'mj-tick', 'data-major': String(tick === 50), style: { '--left': `${tick}%` } },
      h('span', { class: 'mj-tick-label' }, `${tick}%`)))),
    badges);
  return { el, badge, bars, majority, score, badges, rank };
}

export function mjResults(options, { gap = 12 } = {}) {
  const cards = options.map(mjCard);
  const list = h('div', { class: 'mj-results stack' }, cards.map((card) => card.el));
  const panel = resultsPanel(list);

  /**
   * counts: each option's counts; widths: each mention's share of the bar,
   * eased between ballots; slots: each card's place, fractional while moving.
   */
  function update({ counts, widths = counts.map(sharesOf), slots }) {
    const n = total(counts[0]);
    panel.setCount(n);
    panel.setHint(n ? null : 'No ballots yet. The results fill in as they arrive.');
    const measures = counts.map(judgment);
    const rankList = ranks(measures);
    cards.forEach((card, index) => {
      for (const mention of MENTIONS) {
        card.bars[mention].style.width = `${(widths[index][mention] ?? 0) * 100}%`;
      }
      const empty = n === 0;
      card.rank.style.display = empty ? 'none' : '';
      card.badges.style.display = empty ? 'none' : '';
      card.el.dataset.winner = String(!empty && rankList[index] === 1);
      card.badge.textContent = rankList[index];
      card.badge.dataset.medal = rankList[index] <= 3 ? MEDALS[rankList[index] - 1] : 'false';
      card.majority.dataset.judgment = measures[index].majority;
      card.majority.textContent = MENTION_NAMES[measures[index].majority];
      card.score.textContent = decimal(measures[index].numerator / measures[index].denominator);
    });
    const pitch = cards[0].el.offsetHeight + gap;
    list.style.height = `${pitch * cards.length - gap}px`;
    cards.forEach((card, index) => { card.el.style.transform = `translateY(${slots[index] * pitch}px)`; });
    return rankList;
  }
  return { ...panel, cards, list, update };
}

/** ApprovalResults, one bar per option, placed by rank. */
export function approvalResults(options, { gap = 10 } = {}) {
  const rows = options.map((label) => {
    const rank = h('span', { class: 'approval-rank' });
    const count = h('span', { class: 'approval-result-count' });
    const fill = h('div', { class: 'approval-bar-fill', style: { width: '0%' } });
    const el = h('li', { class: 'approval-result', 'data-winner': 'false' },
      h('div', { class: 'approval-result-head' }, rank, h('span', { class: 'approval-result-label' }, label), count),
      h('div', { class: 'approval-bar' }, fill));
    return { el, rank, count, fill };
  });
  const list = h('ol', { class: 'approval-results stack' }, rows.map((row) => row.el));
  const panel = resultsPanel(list);

  /** approvals: counts after n ballots; shares: the bars' widths, 0 to 1; slots: places. */
  function update({ approvals, n, shares, slots }) {
    panel.setCount(n);
    panel.setHint(n ? null : 'No ballots yet. The results fill in as they arrive.');
    const rankList = ranks(approvals.map(approval));
    rows.forEach((row, index) => {
      row.rank.textContent = rankList[index];
      row.rank.style.display = n ? '' : 'none';
      row.el.dataset.winner = String(n > 0 && rankList[index] === 1);
      row.count.textContent = `${approvals[index]} ${approvals[index] === 1 ? 'approval' : 'approvals'}${n ? ` · ${percent(Math.round((approvals[index] / n) * 100) / 100)}` : ''}`;
      row.fill.style.width = `${shares[index] * 100}%`;
    });
    const pitch = rows[0].el.offsetHeight + gap;
    list.style.height = `${pitch * rows.length - gap}px`;
    rows.forEach((row, index) => { row.el.style.transform = `translateY(${slots[index] * pitch}px)`; });
    return rankList;
  }
  return { ...panel, rows, update };
}

/** OwnerActions, asking before closing for good. */
export function ownerActions() {
  const close = h('button', { type: 'button', class: 'button primary' }, 'Close for good');
  const el = h('section', { class: 'panel owner-actions' },
    h('h2', {}, 'Manage your poll'),
    h('div', { class: 'confirm' },
      h('p', {}, 'Close voting for good? Nobody can vote or change their ballot any more, and everyone sees the final results. A closed poll cannot be reopened.'),
      h('div', { class: 'button-row' }, h('button', { type: 'button', class: 'button secondary' }, 'Keep it open'), close)));
  return { el, close };
}
