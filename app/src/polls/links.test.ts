import { renderHook } from '@testing-library/react';
import fc from 'fast-check';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handoverIn, invitationIn, invitationUrl, useSiteOrigin } from './links';

const serverInfo = vi.hoisted(() => ({ publicUrl: null as string | null }));
vi.mock('./useServerInfo', () => ({ useServerInfo: () => serverInfo }));

/** A poll's id, or a token's secret, as the server makes them: 128 random bits in base64url. */
const base64url = fc.stringMatching(/^[A-Za-z0-9_-]{22}$/);

describe('links', () => {
  it('give back the invitation or the handover they carry, from the address the browser opens', () => {
    fc.assert(fc.property(base64url, fc.nat(), base64url, (pollId, number, secret) => {
      const invitation = `${number}.${secret}`; // an invitation's number, then its signature
      const invited = new URL(invitationUrl(window.location.origin, pollId, invitation));
      // As the server writes a handover link (docs/API.md, "Creating a poll for somebody else").
      const handedOver = new URL(`${window.location.origin}/p/${pollId}#handover=${secret}`);

      expect(invited.pathname).toBe(`/p/${pollId}`);
      expect(invitationIn(invited.hash)).toBe(invitation);
      expect(handoverIn(invited.hash)).toBeNull();
      expect(handoverIn(handedOver.hash)).toBe(secret);
      expect(invitationIn(handedOver.hash)).toBeNull();
    }));
  });
});

describe('where links lead', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    serverInfo.publicUrl = null;
  });

  it("is the page's own origin on the website", () => {
    serverInfo.publicUrl = 'https://elsewhere.example';

    expect(renderHook(useSiteOrigin).result.current).toBe(window.location.origin);
  });

  it("is the server's public address in the app, whose pages run on localhost", () => {
    vi.stubEnv('MODE', 'android');
    serverInfo.publicUrl = 'https://super-vote.org';

    expect(renderHook(useSiteOrigin).result.current).toBe('https://super-vote.org');
  });

  it("is the API's address in the app until the server says", () => {
    vi.stubEnv('MODE', 'android');
    vi.stubEnv('VITE_API_BASE_URL', 'https://super-vote.org');

    expect(renderHook(useSiteOrigin).result.current).toBe('https://super-vote.org');
  });
});
