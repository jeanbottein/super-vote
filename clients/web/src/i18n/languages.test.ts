import { isValidElement } from 'react';
import { describe, expect, it } from 'vitest';
import { said } from '../test/said';
import { en, type Messages } from './en';
import { direction, LANGUAGE_NAMES, LANGUAGES, pluralForm, type Language } from './format';
import { loadMessages } from './i18n';

// Every language is a file of its own, named for it (es.tsx exports es): the glob finds them all, so that a
// language added to LANGUAGES without its file, or the other way round, fails here.
const modules = import.meta.glob<Record<string, Messages>>('./*.tsx', { eager: true });
const translations = LANGUAGES.filter((language) => language !== 'en')
  .map((language) => [language, modules[`./${language}.tsx`]?.[language]] as [Language, Messages]);

/** Digits as any of the languages writes them, for the probe values 7, 8 and 9. */
const DIGITS = [/[7٧]/, /[8٨]/, /[9٩]/];
/** The formatting functions take dates and numbers, not text: what they say is Intl's. A noun (`.noun`) is chosen by a count that a language without plurals ignores. */
const FORMATTING = ['number', 'percent', 'decimal', 'date', 'moment', 'day', 'timeAgo', 'waitUntil'];

/** Which of the probes a message uses, from its answer to 7, 8 and 9. */
function usedProbes(message: (...values: unknown[]) => unknown): boolean[] {
  const text = said(message, [7, 8, 9]).join(' ');
  return DIGITS.slice(0, message.length).map((digit) => digit.test(text));
}

/** Every message of a language, with the path to it. */
function leaves(messages: unknown, path = ''): [string, unknown][] {
  if (typeof messages === 'string' || typeof messages === 'function' || isValidElement(messages)) {
    return [[path, messages]];
  }
  if (Array.isArray(messages)) {
    return messages.flatMap((each, index) => leaves(each, `${path}[${index}]`));
  }
  if (messages && typeof messages === 'object') {
    return Object.entries(messages).flatMap(([key, value]) => leaves(value, path ? `${path}.${key}` : key));
  }
  return [];
}

describe('the languages', () => {
  it('are each named in their own words, and each has its file', () => {
    expect(Object.keys(LANGUAGE_NAMES).sort()).toEqual([...LANGUAGES].sort());
    expect(translations.filter(([, messages]) => !messages).map(([language]) => language)).toEqual([]);
  });

  it('write from left to right, but Arabic', () => {
    expect(LANGUAGES.filter((language) => direction(language) === 'rtl')).toEqual(['ar']);
  });

  it('are fetched on demand', async () => {
    await Promise.all(LANGUAGES.map(loadMessages));
  });
});

describe.each(translations)('the %s messages', (language, messages) => {
  const english = leaves(en);
  const translated = new Map(leaves(messages));

  it('say everything the English ones do, and nothing else', () => {
    expect([...translated.keys()].sort()).toEqual(english.map(([path]) => path).sort());
  });

  it('are never empty', () => {
    const empty = [...translated].filter(([, message]) => typeof message === 'string' && message.trim() === '');
    expect(empty.map(([path]) => path)).toEqual([]);
  });

  it('use each value a message is given as the English ones do', () => {
    const wrong = english
      .filter(([path, message]) => typeof message === 'function' && !FORMATTING.includes(path) && !path.endsWith('.noun'))
      .filter(([path, message]) => {
        const mine = translated.get(path) as (...values: unknown[]) => unknown;
        return usedProbes(mine).join() !== usedProbes(message as (...values: unknown[]) => unknown).join();
      })
      .map(([path]) => path);
    expect(wrong).toEqual([]);
  });

  it('name the seven mentions differently', () => {
    expect(new Set(Object.values(messages.mentions)).size).toBe(7);
  });

  it('are written with typographic apostrophes and quotation marks', () => {
    const text = said(messages).filter((each) => /\p{L}/u.test(each));
    expect(text.filter((each) => /['"]/.test(each))).toEqual([]);
  });

  it('count in the language', () => {
    expect(messages.number(1234.5)).toBe(new Intl.NumberFormat(language).format(1234.5));
    expect(messages.results.ballots(7)).toContain(messages.number(7));
  });
});

describe('pluralForm', () => {
  const forms = { zero: 'zero', one: 'one', two: 'two', few: 'few', many: 'many', other: 'other' };

  it.each([
    ['en', 1, 'one'], ['en', 0, 'other'], ['en', 2, 'other'],
    ['fr', 0, 'one'], ['fr', 2, 'other'],
    ['ru', 1, 'one'], ['ru', 3, 'few'], ['ru', 5, 'many'], ['ru', 21, 'one'], ['ru', 22, 'few'],
    ['ar', 0, 'zero'], ['ar', 1, 'one'], ['ar', 2, 'two'], ['ar', 7, 'few'], ['ar', 11, 'many'], ['ar', 100, 'other'],
    ['ja', 1, 'other'],
  ] as const)('reads %s %i as "%s"', (language, count, expected) => {
    expect(pluralForm(language, count, forms)).toBe(expected);
  });

  it('falls back on "other" for a form a language lacks', () => {
    expect(pluralForm('ru', 3, { one: 'one', other: 'other' })).toBe('other');
  });
});
