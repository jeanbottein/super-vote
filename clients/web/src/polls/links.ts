/** The addresses people share: a poll's, and an invitation's, built on the site's origin (`useSiteOrigin`). */
import { appPlatform } from '../native/platform';
import { useServerInfo } from './useServerInfo';

/**
 * Where people reach super-vote. On the website, the page's own origin. In the Android app, whose pages run on
 * https://localhost, an address that leads nowhere for anyone else, the server's public address, which its own
 * invitation links are built from too; until the server says it, the API's, which is the same in production.
 */
export function useSiteOrigin(): string {
  const { publicUrl } = useServerInfo();
  if (appPlatform() === null) {
    return window.location.origin;
  }
  return publicUrl ?? (import.meta.env.VITE_API_BASE_URL || window.location.origin);
}

/** An address as people type it: "super-vote.org". */
export function hostOf(origin: string): string {
  return new URL(origin).host;
}

export function pollUrl(site: string, pollId: string): string {
  return `${site}/p/${pollId}`;
}

/**
 * The poll's address, with the invitation in its fragment: browsers never
 * send a fragment to the server, so no log along the way keeps it.
 */
export function invitationUrl(site: string, pollId: string, token: string): string {
  return `${pollUrl(site, pollId)}#invitation=${token}`;
}

/**
 * The poll's address, with the token that hands it over in its fragment. A
 * client that created a poll for somebody sends them this, and opening it
 * makes them its creator. Like an invitation, it stays out of every log.
 */
export function handoverUrl(site: string, pollId: string, token: string): string {
  return `${pollUrl(site, pollId)}#handover=${token}`;
}

/**
 * The poll's address, with its admin token in the fragment: opening it makes
 * that browser the poll's creator, every time. Its creator's to keep.
 */
export function adminUrl(site: string, pollId: string, token: string): string {
  return `${pollUrl(site, pollId)}#admin=${token}`;
}

/** The invitation in a page address's fragment (location.hash), if there is one. */
export function invitationIn(hash: string): string | null {
  return tokenIn(hash, 'invitation');
}

/** The handover token in a page address's fragment, if there is one. */
export function handoverIn(hash: string): string | null {
  return tokenIn(hash, 'handover');
}

/** The admin token in a page address's fragment, if there is one. */
export function adminIn(hash: string): string | null {
  return tokenIn(hash, 'admin');
}

function tokenIn(hash: string, name: string): string | null {
  return new URLSearchParams(hash.slice(1)).get(name) || null;
}
