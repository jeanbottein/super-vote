// A check of ui.js against the app: the scene of the README's screenshots
// (docs/images), ballot and results side by side, as ui.js draws them.
// node snap.mjs <dir> 0 --query=?fidelity
import { h, ready } from './util.js';
import * as ui from './ui.js';
import { judgment, places, ranks } from './ranking.js';

const OPTIONS = ['Lisbon', 'Berlin', 'Barcelona', 'Stay home'];
/** The tallies, the browser's own ballot included: Lisbon wins at -0.05, as in phone-results.png. */
const COUNTS = [
  { Excellent: 18, VeryGood: 21, Good: 11, Fair: 7, Passable: 1 },
  { Excellent: 3, VeryGood: 8, Good: 15, Fair: 29, Passable: 2, Inadequate: 1 },
  { Excellent: 5, VeryGood: 16, Good: 24, Fair: 9, Passable: 4 },
  { Good: 3, Fair: 9, Passable: 15, Inadequate: 21, Bad: 10 },
];

export async function buildFidelity(stage) {
  stage.style.background = '#888';
  const left = ui.screen(ui.pollTop({ title: 'Where should the team offsite be?', system: 'Majority judgment' }));
  const ballot = ui.mjBallot(OPTIONS);
  left.page.append(ballot.el);
  ['Excellent', 'Good', 'VeryGood', 'Passable'].forEach((mention, row) => ballot.choose(row, mention));
  ballot.setCounted(true);
  const right = ui.screen();
  const results = ui.mjResults(OPTIONS);
  right.page.append(results.el);
  for (const screen of [left, right]) screen.root.style.zoom = 1.3;
  stage.append(h('div', { style: { position: 'absolute', left: '10px', top: '10px', display: 'flex', gap: '20px' } }, left.root, right.root));
  await ready(stage);
  results.update({ counts: COUNTS, slots: places(ranks(COUNTS.map(judgment))) });
}
