import { describe, expect, it } from 'vitest';
import { shownOptions } from './shownOptions';

const OPTIONS = ['A', 'B', 'C', 'D', 'E'];

describe('shownOptions', () => {
  it("keeps the poll's own order unless the poll is shuffled", () => {
    expect(shownOptions(OPTIONS, 'AS_WRITTEN', 42)).toBe(OPTIONS);
    expect(shownOptions(OPTIONS, 'ALPHABETICAL', 42)).toBe(OPTIONS);
  });

  it('shows every option of a shuffled poll once, in the same order for as long as the visit lasts', () => {
    const shown = shownOptions(OPTIONS, 'SHUFFLED', 42);

    expect([...shown].sort()).toEqual(OPTIONS);
    expect(shownOptions(OPTIONS, 'SHUFFLED', 42)).toEqual(shown);
  });

  it('gives every option its turn in every place, visit after visit', () => {
    const first = new Map<string, number>();
    for (let seed = 0; seed < 5_000; seed++) {
      const option = shownOptions(OPTIONS, 'SHUFFLED', seed)[0];
      first.set(option, (first.get(option) ?? 0) + 1);
    }
    // 1,000 each, give or take what chance does: no option is favoured by its place.
    for (const option of OPTIONS) {
      expect(first.get(option)).toBeGreaterThan(850);
      expect(first.get(option)).toBeLessThan(1_150);
    }
  });
});
