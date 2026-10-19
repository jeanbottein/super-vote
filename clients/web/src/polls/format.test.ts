import { describe, expect, it } from 'vitest';
import { ballotCount, timeAgo, waitUntil } from './format';

describe('timeAgo', () => {
  const now = Date.parse('2026-09-24T12:00:00Z');

  it.each([
    ['2026-09-24T11:59:30Z', 'just now'],
    ['2026-09-24T11:55:00Z', '5 minutes ago'],
    ['2026-09-24T09:00:00Z', '3 hours ago'],
    ['2026-09-23T12:00:00Z', 'yesterday'],
    ['2026-09-10T12:00:00Z', '2 weeks ago'],
    ['2025-09-24T12:00:00Z', 'last year'],
  ])('reads %s as "%s"', (date, expected) => {
    expect(timeAgo(date, now)).toBe(expected);
  });
});

describe('waitUntil', () => {
  const now = Date.parse('2026-09-24T12:00:00Z');

  it.each([
    [1_000, '1 minute'],
    [60_000, '1 minute'],
    [61_000, '2 minutes'],
    [3_600_000, '1 hour'],
    [5 * 3_600_000 + 60_000, '6 hours'],
    [24 * 3_600_000, '24 hours'],
  ])('rounds a wait of %i ms up, to "%s", so that it is never too soon', (wait, expected) => {
    expect(waitUntil(now + wait, now)).toBe(expected);
  });

  it('says at least a minute, even for a moment past', () => {
    expect(waitUntil(now - 5_000, now)).toBe('1 minute');
  });
});

describe('ballotCount', () => {
  it('agrees in number', () => {
    expect(ballotCount(0)).toBe('0 ballots');
    expect(ballotCount(1)).toBe('1 ballot');
    expect(ballotCount(12)).toBe('12 ballots');
  });
});
