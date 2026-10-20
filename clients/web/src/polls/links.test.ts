import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { handoverIn, handoverUrl, invitationIn, invitationUrl } from './links';

/** A poll's id, or a token's secret, as the server makes them: 128 random bits in base64url. */
const base64url = fc.stringMatching(/^[A-Za-z0-9_-]{22}$/);

describe('links', () => {
  it('give back the invitation or the handover they carry, from the address the browser opens', () => {
    fc.assert(fc.property(base64url, fc.nat(), base64url, (pollId, number, secret) => {
      const invitation = `${number}.${secret}`; // an invitation's number, then its signature
      const invited = new URL(invitationUrl(pollId, invitation));
      const handedOver = new URL(handoverUrl(pollId, secret));

      expect(invited.pathname).toBe(`/p/${pollId}`);
      expect(invitationIn(invited.hash)).toBe(invitation);
      expect(handoverIn(invited.hash)).toBeNull();
      expect(handoverIn(handedOver.hash)).toBe(secret);
      expect(invitationIn(handedOver.hash)).toBeNull();
    }));
  });
});
