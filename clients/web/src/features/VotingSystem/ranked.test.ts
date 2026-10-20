import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import type { PollOption } from '../../api/types';
import { ranked } from './ranked';

const option = (index: number, rank: number): PollOption => ({
  id: `option-${index}`,
  label: `Option ${index}`,
  approvalCount: 0,
  judgmentCounts: null,
  rank,
  majorityMention: null,
  score: null,
});

describe('ranked', () => {
  it("shows the options best first by the server's ranks, ties in the order they come, marked ex aequo", () => {
    fc.assert(fc.property(fc.array(fc.integer({ min: 1, max: 6 }), { maxLength: 20 }), (ranks) => {
      const options = ranks.map((rank, index) => option(index, rank));
      const bestFirst = options
        .map((each, index) => ({ each, index }))
        .sort((a, b) => ranks[a.index] - ranks[b.index] || a.index - b.index)
        .map(({ each }) => each);

      const shown = ranked(options);

      expect(shown.map((entry) => entry.option)).toEqual(bestFirst);
      for (const entry of shown) {
        expect(entry.rank).toBe(entry.option.rank);
        expect(entry.exAequo).toBe(ranks.filter((rank) => rank === entry.rank).length > 1);
      }
    }));
  });

  it('shows every option in a tie for first while the results are kept back', () => {
    const kept = [option(0, 1), option(1, 1)].map((each) => ({ ...each, rank: null }));

    expect(ranked(kept)).toEqual(kept.map((each) => ({ option: each, rank: 1, exAequo: true })));
  });
});
