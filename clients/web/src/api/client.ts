/**
 * The super-vote API.
 *
 * Who is voting is decided by an HttpOnly cookie the server sets, so every call
 * carries credentials. A call without them would silently count as a brand new
 * voter: polls would stop being "mine" and ballots could not be revised. The
 * Android app is another origin, where the cookie would be a third party's: it
 * asks for a voter token of its own once, keeps it, and sends it as a bearer
 * token instead (`callerOf`).
 *
 * A voter's invitation travels in a header, never in a URL, so that no log
 * along the way keeps it.
 *
 * Every call also says the device's time zone, which is where the server's
 * statistics place it: so that it never needs the address.
 */
import type {
  BallotRequest, InvitationPage, NewPoll, Poll, PollPlaces, PollsLeft, PollSummary, PollUpdate, ServerInfo, Statistics,
} from './types';
import { eventsIn } from './eventStream';
import { appPlatform } from '../native/platform';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

const INVITATION_HEADER = 'Super-Vote-Invitation';
const HANDOVER_HEADER = 'Super-Vote-Handover';
const ADMIN_HEADER = 'Super-Vote-Admin';
const TIME_ZONE_HEADER = 'Super-Vote-Time-Zone';

/** A bearer token the server could not have issued (docs/API.md, "Identity"). */
const UNKNOWN_VOTER = '/problems/unknown-voter';

/** Where the app keeps its voter token (Capacitor Preferences: the app's own storage, never backed up). */
const TOKEN_KEY = 'voter-token';

/**
 * A failed call: its status (0 when the server could not be reached), and
 * what the server said of it, if anything. The message is the server's
 * sentence, in English; what people read is worded from the type, in their
 * language (src/i18n/errorMessage.ts).
 */
export class ApiError extends Error {
  readonly status: number;
  /** The problem's type, such as /problems/poll-closed: what to branch on. Null when the server gave none. */
  readonly type: string | null;
  /** The seconds to wait before trying again (Retry-After), when the server said. */
  readonly retryAfter: number | null;

  constructor(status: number, message = '', type: string | null = null, retryAfter: number | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.type = type;
    this.retryAfter = retryAfter;
  }
}

interface RequestOptions {
  body?: unknown;
  /** The token from the invitation link the voter came with. */
  invitation?: string | null;
  /** The token from a handover link, which makes the caller the poll's creator, once. */
  handover?: string | null;
  /** The token from an admin link, which makes the caller the poll's creator, every time. */
  admin?: string | null;
  /** 'omit': as nobody, a brand new voter (the ballot feeder, and the app asking for its token). */
  credentials?: RequestCredentials;
  /** Where the request says it comes from, instead of this device's time zone (the ballot feeder). */
  timeZone?: string;
}

/**
 * The page's first call, which the others wait for. A browser without its
 * cookie yet would otherwise be given one per call made at once (the home
 * page makes two), keep only the last, and count as several visitors.
 */
let firstCall: Promise<unknown> | null = null;

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await call(method, path, options);
  return (response.status === 204 ? undefined : await response.json()) as T;
}

/** A successful answer, its headers included. */
async function call(method: string, path: string, options: RequestOptions = {}): Promise<Response> {
  if (firstCall === null) {
    const answer = send(method, path, options);
    firstCall = answer.catch(() => {});
    return answer;
  }
  await firstCall;
  return send(method, path, options);
}

async function send(
  method: string,
  path: string,
  { body, invitation, handover, admin, credentials = 'include', timeZone = deviceTimeZone() }: RequestOptions,
): Promise<Response> {
  const caller = await callerOf(credentials);
  const headers: Record<string, string> = { ...caller.headers, [TIME_ZONE_HEADER]: timeZone };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (invitation) {
    headers[INVITATION_HEADER] = invitation;
  }
  if (handover) {
    headers[HANDOVER_HEADER] = handover;
  }
  if (admin) {
    headers[ADMIN_HEADER] = admin;
  }
  let response: Response;
  try {
    response = await fetch(BASE_URL + path, {
      method,
      credentials: caller.credentials,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0); // the server cannot be reached
  }
  if (!response.ok) {
    const problem = await problemIn(response);
    if (problem.type === UNKNOWN_VOTER && 'Authorization' in caller.headers) {
      await forgetAppToken(); // the next call starts afresh, rather than every call failing alike
    }
    throw problem;
  }
  return response;
}

interface Caller {
  credentials: RequestCredentials;
  headers: Record<string, string>;
}

/** Who a request comes from: the browser's cookie, the app's token, or nobody. */
async function callerOf(credentials: RequestCredentials): Promise<Caller> {
  if (credentials === 'omit' || appPlatform() === null) {
    return { credentials, headers: {} };
  }
  return { credentials: 'omit', headers: { Authorization: `Bearer ${await appVoterToken()}` } };
}

let appToken: Promise<string> | null = null;

/**
 * The app's voter token: the one it keeps, or, the first time, one the server
 * mints. Asked for once however many calls start together; asked again after
 * a failure, so that a first launch offline does not stay without one.
 */
function appVoterToken(): Promise<string> {
  appToken ??= keptOrMintedToken().catch((error: unknown) => {
    appToken = null;
    throw error;
  });
  return appToken;
}

async function keptOrMintedToken(): Promise<string> {
  const { Preferences } = await import('@capacitor/preferences');
  const kept = (await Preferences.get({ key: TOKEN_KEY })).value;
  if (kept) {
    return kept;
  }
  // Straight to send: through call, it would wait for the first call, which waits for this token.
  const { token } = (await (await send('POST', '/api/voters', { credentials: 'omit' })).json()) as { token: string };
  await Preferences.set({ key: TOKEN_KEY, value: token });
  return token;
}

async function forgetAppToken(): Promise<void> {
  appToken = null;
  const { Preferences } = await import('@capacitor/preferences');
  await Preferences.remove({ key: TOKEN_KEY });
}

/** "Europe/Paris", or what the device says; the server counts a name it does not know nowhere. */
function deviceTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/** Errors are RFC 9457 problem documents: a type to branch on, and a detail, a sentence in English. */
async function problemIn(response: Response): Promise<ApiError> {
  const retryAfter = Number(response.headers.get('Retry-After')) || null;
  try {
    const problem: unknown = await response.json();
    if (problem && typeof problem === 'object') {
      const detail = 'detail' in problem && typeof problem.detail === 'string' ? problem.detail : '';
      const type = 'type' in problem && typeof problem.type === 'string' ? problem.type : null;
      return new ApiError(response.status, detail, type, retryAfter);
    }
  } catch {
    // Not JSON: nothing more to tell than the status.
  }
  return new ApiError(response.status, '', null, retryAfter);
}

const pollPath = (id: string) => `/api/polls/${encodeURIComponent(id)}`;

export const getServerInfo = () => request<ServerInfo>('GET', '/api/server-info');

/** How much super-vote is used, and where, as of the last hour. */
export const getStatistics = () => request<Statistics>('GET', '/api/statistics');

export const listPublicPolls = () => request<PollSummary[]>('GET', '/api/polls');

export const listMyPolls = () => request<PollSummary[]>('GET', '/api/polls/mine');

/** As the caller sees it, with the invitation they came with, if any. */
export const getPoll = (id: string, invitation?: string | null) => request<Poll>('GET', pollPath(id), { invitation });

/** The poll behind a join code: its letters and digits. */
export const joinPoll = (code: string) => request<PollSummary>('GET', `/api/join/${encodeURIComponent(code)}`);

/** Where the poll's ballots come from, as of the last hour; nothing while its results are kept back. */
export const getPollPlaces = (id: string) => request<PollPlaces>('GET', `${pollPath(id)}/places`);

/** The new poll, and how many more this connection may create before its day ends. */
export async function createPoll(poll: NewPoll): Promise<{ poll: Poll; pollsLeft: PollsLeft | null }> {
  const response = await call('POST', '/api/polls', { body: poll });
  return { poll: (await response.json()) as Poll, pollsLeft: pollsLeftIn(response.headers) };
}

/** From the IETF draft's RateLimit fields: `RateLimit: "polls";r=4;t=3600` and the policy's quota, `q`. */
function pollsLeftIn(headers: Headers): PollsLeft | null {
  const count = parameter(headers.get('RateLimit'), 'r');
  const seconds = parameter(headers.get('RateLimit'), 't');
  const perDay = parameter(headers.get('RateLimit-Policy'), 'q');
  if (count === null || seconds === null || perDay === null) {
    return null;
  }
  return { count, perDay, resetsAt: Date.now() + seconds * 1000 };
}

function parameter(field: string | null, name: string): number | null {
  const value = field?.match(new RegExp(`;${name}=(\\d+)`))?.[1];
  return value === undefined ? null : Number(value);
}

/** With the invitation the voter came with, if any: their first ballot makes it theirs. */
export const castBallot = (id: string, ballot: BallotRequest, invitation?: string | null) =>
  request<Poll>('PUT', `${pollPath(id)}/ballot`, { body: ballot, invitation });

/** For good: a closed poll cannot be reopened. */
export const closePoll = (id: string) => request<Poll>('PATCH', pollPath(id), { body: { closed: true } });

export const deletePoll = (id: string) => request<void>('DELETE', pollPath(id));

/**
 * Development only (the ballot feeder): a ballot without the cookie, so from a
 * brand new voter, from the time zone given.
 */
export const castBallotAsNewVoter = (id: string, ballot: BallotRequest, timeZone: string) =>
  request<Poll>('PUT', `${pollPath(id)}/ballot`, { body: ballot, credentials: 'omit', timeZone });

/**
 * Becomes the poll's creator with the token from a handover link: the poll is
 * then this voter's to close, to delete, and whose invitations are theirs to
 * read. The token works once.
 */
/** Makes this browser the poll's creator, with a handover link's token or an admin link's. */
export const takePollOver = (id: string, token: { handover: string } | { admin: string }) =>
  request<Poll>('POST', `${pollPath(id)}/creator`, token);

/** The creator's newest invitations to their poll, `limit` of them at most. */
export const listInvitations = (id: string, limit: number) =>
  request<InvitationPage>('GET', `${pollPath(id)}/invitations?limit=${limit}`);

/**
 * New invitations: one per name, or `count` anonymous ones. Answers the
 * newest invitations, the new ones first.
 */
export const createInvitations = (id: string, invitations: { labels: string[] } | { count: number }) =>
  request<InvitationPage>('POST', `${pollPath(id)}/invitations`, { body: invitations });

/** Only an invitation nobody voted with can be taken back. Its link stops working. */
export const revokeInvitation = (id: string, number: number) =>
  request<void>('DELETE', `${pollPath(id)}/invitations/${number}`);

export interface PollWatcher {
  onUpdate(update: PollUpdate): void;
  onDeleted(): void;
  onConnectionChange(live: boolean): void;
  /** The browser stopped reconnecting, as it does when the server answers with an error. */
  onLost(): void;
}

/** How long a lost stream waits before connecting again, as browsers' `EventSource` does. */
export const RECONNECT_DELAY_MS = 3000;

/**
 * Follows a poll live, over server-sent events. The first update is the poll's
 * current state. After a network hiccup, or the stream ending, it connects
 * again, and the new connection starts with the current state again; but an
 * error from the server, while it restarts for instance, ends it for good,
 * as `EventSource` does. Read with fetch, which can send the app's token.
 * Returns a function that stops watching.
 */
export function watchPoll(id: string, watcher: PollWatcher): () => void {
  const watching = new AbortController();
  void follow(`${pollPath(id)}/events`, watcher, watching);
  return () => watching.abort();
}

async function follow(path: string, watcher: PollWatcher, watching: AbortController): Promise<void> {
  // A loop: each pass is one connection, until the poll is deleted, the server refuses, or watching stops.
  while (!watching.signal.aborted) {
    const response = await connect(path, watching.signal);
    if (watching.signal.aborted) {
      return;
    }
    if (response !== null && !isEventStream(response)) {
      watcher.onConnectionChange(false);
      watcher.onLost();
      return;
    }
    if (response?.body) {
      watcher.onConnectionChange(true);
      if (await relay(response.body, watcher, watching) || watching.signal.aborted) {
        return;
      }
    }
    watcher.onConnectionChange(false);
    await pause(RECONNECT_DELAY_MS, watching.signal);
  }
}

/**
 * What EventSource would follow: a successful answer that is a stream of events. Anything else (an error, a
 * captive portal's page) is a refusal, so that the page loads the poll again rather than show stale results live.
 */
function isEventStream(response: Response): boolean {
  return response.ok && (response.headers.get('Content-Type') ?? '').startsWith('text/event-stream');
}

/** The stream's answer, or null when the server could not be reached. */
async function connect(path: string, signal: AbortSignal): Promise<Response | null> {
  try {
    const caller = await callerOf('include');
    return await fetch(BASE_URL + path, {
      credentials: caller.credentials,
      headers: { ...caller.headers, Accept: 'text/event-stream' },
      signal,
    });
  } catch {
    return null;
  }
}

/** Passes the stream's events on until it ends; true once the poll is deleted, which ends the watch too. */
async function relay(body: ReadableStream<BufferSource>, watcher: PollWatcher, watching: AbortController): Promise<boolean> {
  try {
    for await (const event of eventsIn(body)) {
      if (event.type === 'deleted') {
        watching.abort();
        watcher.onDeleted();
        return true;
      }
      if (event.type === 'update') {
        passOn(event.data, watcher);
      }
    }
  } catch {
    // Reading failed: the connection dropped, or watching stopped. follow tells them apart.
  }
  return false;
}

/**
 * One update to the page. A payload it cannot read, or a page that throws, is reported and the stream goes on,
 * as with EventSource: neither is the connection's fault, and reconnecting would only bring the same state back.
 */
function passOn(data: string, watcher: PollWatcher): void {
  try {
    watcher.onUpdate(JSON.parse(data) as PollUpdate);
  } catch (error) {
    reportError(error);
  }
}

function pause(milliseconds: number, signal: AbortSignal): Promise<void> {
  if (signal.aborted) {
    return Promise.resolve(); // an abort listener added now would never fire
  }
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, milliseconds);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      resolve();
    }, { once: true });
  });
}
