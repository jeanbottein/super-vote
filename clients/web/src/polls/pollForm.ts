import type { ResultsShown, ServerInfo, Visibility, VotingSystem } from '../api/types';
import type { Messages } from '../i18n/en';

type Limits = ServerInfo['limits'];

/** Fewer ballots than this, and the results are the ballots: two voters would each read the other's. */
export const MIN_RESULTS_AFTER_BALLOTS = 3;

export interface PollForm {
  title: string;
  options: string[];
  resultsShown: ResultsShown;
  /** As typed: AFTER_BALLOTS only. */
  resultsAfterBallots: string;
}

export interface PollFormProblems {
  title?: string;
  options?: string;
  resultsAfterBallots?: string;
}

/** Tabs, line breaks and every Unicode space, as the server reads them: not \s, which takes in the invisible U+FEFF. */
const SPACES = /[\t\n\v\f\r\p{Z}]+/gu;
/** The space left at either end once spaces are single: trim() would take an invisible U+FEFF away too. */
const SPACE_AT_ENDS = /^ | $/g;
/** Controls, bidi overrides and zero widths, but the joiners Persian words and emoji sequences need. */
const INVISIBLE = /(?![‌‍])[\p{Cc}\p{Cf}]/u;
const JOINERS = /[‌‍]/g;

/**
 * Text as everyone will read it, as the server keeps it: composed one way
 * (NFC), with single spaces between its words and none around them.
 */
export function tidy(text: string): string {
  return text.normalize('NFC').replace(SPACES, ' ').replace(SPACE_AT_ENDS, '');
}

/** The options that were filled in, tidied. Blank rows are just ignored. */
export function filledOptions(options: string[]): string[] {
  return options.map(tidy).filter((option) => option !== '');
}

/** The same rules the server applies (PollService), checked before sending so mistakes show at once. */
export function checkPollForm(
  { title, options, resultsShown, resultsAfterBallots }: PollForm, limits: Limits, say: Messages['newPoll']['problems'],
): PollFormProblems {
  const problems: PollFormProblems = {};

  const tidyTitle = tidy(title);
  if (tidyTitle === '') {
    problems.title = say.titleMissing;
  } else if (tidyTitle.length > limits.maxTitleLength) {
    problems.title = say.titleTooLong(limits.maxTitleLength);
  } else if (INVISIBLE.test(tidyTitle)) {
    problems.title = say.titleInvisible;
  }

  const labels = filledOptions(options);
  const seen = new Set<string>();
  // Two options that differ only by case, or by a joiner nobody sees, would look alike on the ballot.
  const repeated = labels.find((label) => {
    const key = label.replace(JOINERS, '').toLowerCase();
    if (seen.has(key)) {
      return true;
    }
    seen.add(key);
    return false;
  });
  if (labels.length < 2) {
    problems.options = say.tooFewOptions;
  } else if (labels.length > limits.maxOptions) {
    problems.options = say.tooManyOptions(limits.maxOptions);
  } else if (labels.some((label) => label.length > limits.maxOptionLength)) {
    problems.options = say.optionTooLong(limits.maxOptionLength);
  } else if (labels.some((label) => INVISIBLE.test(label))) {
    problems.options = say.optionInvisible;
  } else if (repeated) {
    problems.options = say.optionTwice(repeated);
  }

  const ballots = Number(resultsAfterBallots);
  if (resultsShown === 'AFTER_BALLOTS' && (resultsAfterBallots.trim() === '' || !Number.isSafeInteger(ballots)
    || ballots < MIN_RESULTS_AFTER_BALLOTS)) {
    problems.resultsAfterBallots = say.resultsAfterBallots(MIN_RESULTS_AFTER_BALLOTS);
  }

  return problems;
}

/**
 * The rows the form shows: the options typed so far, a blank row to type the
 * next one into (while there is room), and never fewer than two.
 */
export function optionRows(options: string[], maxOptions: number): string[] {
  const rows = [...options];
  const lastIsFilled = rows.length === 0 || rows[rows.length - 1].trim() !== '';
  if (lastIsFilled && rows.length < maxOptions) {
    rows.push('');
  }
  while (rows.length < 2) {
    rows.push('');
  }
  return rows;
}

export function offeredVotingSystems(info: ServerInfo): VotingSystem[] {
  return [
    info.features.majorityJudgment && 'MAJORITY_JUDGMENT' as const,
    info.features.approvalVoting && 'APPROVAL' as const,
  ].filter((system) => system !== false);
}

export function offeredVisibilities(info: ServerInfo): Visibility[] {
  return [
    info.features.publicPolls && 'PUBLIC' as const,
    info.features.unlistedPolls && 'UNLISTED' as const,
  ].filter((visibility) => visibility !== false);
}
