import { describe, expect, it } from 'vitest';
import { ApiError } from '../api/client';
import { en } from './en';
import { errorMessage } from './errorMessage';
import { fr } from './fr';

describe('errorMessage', () => {
  it("words a refusal from its type, in the reader's language, whatever the server's English says", () => {
    const closed = new ApiError(409, 'This poll is closed and no longer accepts ballots.', '/problems/poll-closed');

    expect(errorMessage(closed, en)).toBe('This poll is closed: it takes no more ballots.');
    expect(errorMessage(closed, fr)).toBe('Ce sondage est fermé : il n’accepte plus de bulletins.');
  });

  it('says when to try again, from Retry-After', () => {
    const tooMany = new ApiError(429, 'Twenty polls...', '/problems/too-many-polls', 5 * 3600 - 120);

    expect(errorMessage(tooMany, en)).toMatch(/you can create more in 5 hours\.$/);
    expect(errorMessage(tooMany, fr)).toMatch(/dans 5 heures\.$/);
  });

  it("shows the server's own sentence for a rule broken, the one thing it alone can say", () => {
    const invalid = new ApiError(400, 'A name can only hold visible characters.', '/problems/invalid-request');

    expect(errorMessage(invalid, fr)).toBe('A name can only hold visible characters.');
  });

  it('says the server cannot be reached, or that something failed, when there is no sentence at all', () => {
    expect(errorMessage(new ApiError(0), fr)).toBe(fr.errors.unreachable);
    expect(errorMessage(new ApiError(502), en)).toBe('Something went wrong (error 502). Please try again.');
    expect(errorMessage(new TypeError('x is undefined'), en)).toBe(en.errors.unexpected);
  });

  it('has words for every problem the server documents but invalid-request', () => {
    const documented = [
      'unknown-voter', 'not-poll-creator', 'not-invited', 'handover-unavailable', 'cross-site', 'poll-not-found',
      'poll-closed', 'invitation-used', 'collision', 'too-many-polls', 'too-many-wrong-codes', 'server-error',
    ];
    expect(Object.keys(en.problems).sort()).toEqual([...documented].sort());
  });
});
