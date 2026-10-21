import { describe, expect, it } from 'vitest';
import { en } from './en';
import { deviceLanguage, formatStamp, plural, timeAgo, waitUntil } from './format';
import { fr } from './fr';

describe('formatStamp', () => {
  it('writes a moment as yyyy-mm-dd hh:mm, in the device\'s time zone', () => {
    expect(formatStamp(new Date(2026, 0, 5, 9, 7).toISOString())).toBe('2026-01-05 09:07');
  });
});

describe('timeAgo', () => {
  const now = Date.parse('2026-09-24T12:00:00Z');

  it.each([
    ['2026-09-24T11:59:30Z', null, null],
    ['2026-09-24T11:55:00Z', '5 minutes ago', 'il y a 5 minutes'],
    ['2026-09-24T09:00:00Z', '3 hours ago', 'il y a 3 heures'],
    ['2026-09-23T12:00:00Z', 'yesterday', 'hier'],
    ['2026-09-10T12:00:00Z', '2 weeks ago', 'il y a 2 semaines'],
    ['2025-09-24T12:00:00Z', 'last year', 'l’année dernière'],
  ])('reads %s as "%s" and "%s"', (date, english, french) => {
    expect(timeAgo('en', date, now)).toBe(english);
    expect(timeAgo('fr', date, now)).toBe(french);
  });

  it('says a moment ago as each language does', () => {
    expect(en.timeAgo(new Date().toISOString())).toBe('just now');
    expect(fr.timeAgo(new Date().toISOString())).toBe('à l’instant');
  });
});

describe('waitUntil', () => {
  const now = Date.parse('2026-09-24T12:00:00Z');

  it.each([
    [1_000, 1, 'minute'],
    [60_000, 1, 'minute'],
    [61_000, 2, 'minute'],
    [3_600_000, 1, 'hour'],
    [5 * 3_600_000 + 60_000, 6, 'hour'],
    [24 * 3_600_000, 24, 'hour'],
  ])('rounds a wait of %i ms up, to %i %s, so that it is never too soon', (wait, count, unit) => {
    expect(waitUntil(now + wait, now)).toEqual({ count, unit });
  });

  it('says at least a minute, even for a moment past', () => {
    expect(waitUntil(now - 5_000, now)).toEqual({ count: 1, unit: 'minute' });
  });

  it('is worded in each language', () => {
    const inFiveHours = Date.now() + 5 * 3_600_000 - 60_000;
    expect(en.waitUntil(inFiveHours)).toBe('5 hours');
    expect(fr.waitUntil(inFiveHours)).toBe('5 heures');
    expect(fr.waitUntil(Date.now() + 1_000)).toBe('1 minute');
  });
});

describe('plural', () => {
  it('follows each language: French says 0 bulletin, English 0 ballots', () => {
    expect([0, 1, 2].map((count) => plural('en', count, 'ballot', 'ballots'))).toEqual(['ballots', 'ballot', 'ballots']);
    expect([0, 1, 2].map((count) => plural('fr', count, 'bulletin', 'bulletins')))
      .toEqual(['bulletin', 'bulletin', 'bulletins']);
    expect(en.results.ballots(1_234)).toBe('1,234 ballots');
    expect(fr.results.ballots(1_234)).toBe('1 234 bulletins');
  });
});

describe('deviceLanguage', () => {
  it('takes the first of the device languages super-vote speaks', () => {
    expect(deviceLanguage(['fr-CA', 'en-US'])).toBe('fr');
    expect(deviceLanguage(['de-DE', 'fr-FR', 'en'])).toBe('fr');
    expect(deviceLanguage(['EN-gb'])).toBe('en');
  });

  it('falls back to English', () => {
    expect(deviceLanguage(['de-DE', 'ja'])).toBe('en');
    expect(deviceLanguage([])).toBe('en');
  });
});
