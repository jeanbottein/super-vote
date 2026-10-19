import type { Score } from '../../../api/types';

/** The GMJ score as a number, for showing only: ranking compares the fraction. */
export const gmjScore = (score: Score) => score.numerator / score.denominator;
