import type { Mention } from '../../../api/types';

/** Best first: the order in which the ballots and the results graph show them. */
export const MENTIONS_BEST_FIRST: Mention[] = [
  'Excellent', 'VeryGood', 'Good', 'Fair', 'Passable', 'Inadequate', 'Bad',
];

// Their names, in each language, are the messages' mentions (src/i18n).
