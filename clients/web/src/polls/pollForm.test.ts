import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { en } from '../i18n/en';
import { fr } from '../i18n/fr';
import { checkPollForm, filledOptions, offeredVotingSystems, optionRows, tidy } from './pollForm';

const limits = {
  maxOptions: 4, maxTitleLength: 10, maxOptionLength: 6, maxVoterNameLength: 40, maxInvitations: 1000, pollLifetimeDays: 30,
};

const form = (title: string, options: string[], resultsAfterBallots?: string) => ({
  title,
  options,
  resultsShown: resultsAfterBallots === undefined ? 'LIVE' as const : 'AFTER_BALLOTS' as const,
  resultsAfterBallots: resultsAfterBallots ?? '',
});

const say = en.newPoll.problems;

describe('checkPollForm', () => {
  it('accepts a title and two distinct options', () => {
    expect(checkPollForm(form('Lunch?', ['Ramen', 'Tacos']), limits, say)).toEqual({});
  });

  it('ignores blank rows', () => {
    expect(checkPollForm(form('Lunch?', ['Ramen', ' ', 'Tacos', '']), limits, say)).toEqual({});
    expect(filledOptions([' Ramen ', '', 'Tacos'])).toEqual(['Ramen', 'Tacos']);
  });

  it.each([
    ['  ', ['Ramen', 'Tacos'], { title: 'Give your poll a title.' }],
    ['Lunch at noon?', ['Ramen', 'Tacos'], { title: 'A title can be at most 10 characters long.' }],
    ['Lunch?', ['Ramen', ''], { options: 'Add at least two options.' }],
    ['Lunch?', ['A', 'B', 'C', 'D', 'E'], { options: 'A poll can have at most 4 options.' }],
    ['Lunch?', ['Ramen', 'Burritos'], { options: 'An option can be at most 6 characters long.' }],
    ['Lunch?', ['Ramen', 'ramen'], { options: '"ramen" is listed twice. Each option must be different.' }],
    // The server's rules: an "é" typed two ways is one letter, a joiner nobody sees makes no other option.
    ['Lunch?', ['Café', 'Cafe\u0301'], { options: '"Café" is listed twice. Each option must be different.' }],
    ['Lunch?', ['Ramen', 'Ra\u200Dmen'], { options: '"Ra\u200Dmen" is listed twice. Each option must be different.' }],
    ['Lunch?', ['Yes', 'Yes\u200B'], { options: 'An option can only hold visible characters.' }],
    ['\u202ELunch?', ['Ramen', 'Tacos'], { title: 'A title can only hold visible characters.' }],
    // At either end too: tidying takes spaces away, nothing invisible.
    ['\u001CLunch?', ['Ramen', 'Tacos'], { title: 'A title can only hold visible characters.' }],
    ['Lunch?\uFEFF', ['Ramen', 'Tacos'], { title: 'A title can only hold visible characters.' }],
  ])('explains what is wrong with "%s" and %j', (title, options, problems) => {
    expect(checkPollForm(form(title, options), limits, say)).toEqual(problems);
  });

  it.each(['', '2', '3.5', '1e30'])('refuses to show the results after "%s" ballots', (ballots) => {
    expect(checkPollForm(form('Lunch?', ['Ramen', 'Tacos'], ballots), limits, say)).toEqual({
      resultsAfterBallots: 'Choose a whole number of ballots, at least 3.',
    });
  });

  it('shows the results after 3 ballots or more, billions included', () => {
    expect(checkPollForm(form('Lunch?', ['Ramen', 'Tacos'], '3'), limits, say)).toEqual({});
    expect(checkPollForm(form('Lunch?', ['Ramen', 'Tacos'], '5000000000'), limits, say)).toEqual({});
  });

  it('says what is wrong in the language it is given', () => {
    expect(checkPollForm(form(' ', ['Ramen']), limits, fr.newPoll.problems)).toEqual({
      title: 'Donnez une question à votre sondage.',
      options: 'Ajoutez au moins deux options.',
    });
  });
});

describe('tidy', () => {
  it('keeps text as everyone will read it, as the server keeps it', () => {
    expect(tidy('  Where\n do we\teat? ')).toBe('Where do we eat?');
    expect(tidy('Cafe\u0301\u00a0 du coin')).toBe('Café du coin');
  });

  it('only ever makes spaces single and takes them from the ends, whatever it is given', () => {
    // A space, on both sides: a tab, a line break or a Unicode separator. U+FEFF and controls are not.
    const spaces = /[\t\n\v\f\r\p{Z}]+/gu;
    const unit = fc.oneof(
      fc.constantFrom(' ', '\t', '\n', '\u00a0', '\u2028', '\u3000', '\ufeff', '\u001c', 'e', '\u0301', '\u212b'),
      fc.string({ unit: 'binary', minLength: 1, maxLength: 1 }),
    );
    fc.assert(fc.property(fc.string({ unit }), (text) => {
      const tidied = tidy(text);

      expect(tidied.replaceAll(' ', '')).toBe(text.normalize('NFC').replace(spaces, ''));
      expect(tidied).not.toMatch(/^ | $| {2}/);
      expect(tidied).toBe(tidied.normalize('NFC'));
      expect(tidy(tidied)).toBe(tidied);
    }));
  });
});

describe('optionRows', () => {
  it('always shows at least two rows', () => {
    expect(optionRows([], 4)).toEqual(['', '']);
    expect(optionRows(['Ramen'], 4)).toEqual(['Ramen', '']);
  });

  it('offers a blank row for the next option', () => {
    expect(optionRows(['Ramen', 'Tacos'], 4)).toEqual(['Ramen', 'Tacos', '']);
  });

  it('offers no more rows once the poll is full', () => {
    expect(optionRows(['A', 'B', 'C', 'D'], 4)).toEqual(['A', 'B', 'C', 'D']);
  });

  it('does not stack blank rows', () => {
    expect(optionRows(['Ramen', 'Tacos', ''], 4)).toEqual(['Ramen', 'Tacos', '']);
  });
});

describe('offeredVotingSystems', () => {
  it('only offers what the server offers', () => {
    const info = {
      features: { publicPolls: true, unlistedPolls: true, approvalVoting: false, majorityJudgment: true },
      limits,
      publicUrl: null,
    };

    expect(offeredVotingSystems(info)).toEqual(['MAJORITY_JUDGMENT']);
  });
});
