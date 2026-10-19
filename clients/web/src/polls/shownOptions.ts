import type { OptionOrder } from '../api/types';

/** A visit's seed: drawn once, when a poll's page opens. */
export function newSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0];
}

/**
 * The options as this voter sees them. A SHUFFLED poll shows them in an order
 * drawn from the visit's seed: each voter and each visit gets its own, so
 * that no option gains from its place, and it holds while the page is open,
 * through every live update, for the ballot and the results alike. Any other
 * poll shows its own order, which an ALPHABETICAL one was sorted into when it
 * was created.
 *
 * Only what is shown moves: a ballot names its options by id, and the server
 * keeps them in the poll's order.
 */
export function shownOptions<T>(options: T[], order: OptionOrder, seed: number): T[] {
  if (order !== 'SHUFFLED') {
    return options;
  }
  const shuffled = [...options];
  const next = random(seed);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Numbers in [0, 1), the same from the same seed (Mulberry32): Fisher–Yates over them draws every order alike. */
function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = Math.imul(state ^ (state >>> 15), state | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4_294_967_296;
  };
}
