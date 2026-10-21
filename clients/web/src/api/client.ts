/**
 * The super-vote API.
 *
 * Who is voting is decided by an HttpOnly cookie the server sets, so every call
 * carries credentials. A call without them would silently count as a brand new
 * voter: polls would stop being "mine" and ballots could not be revised.
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

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

const INVITATION_HEADER = 'Super-Vote-Invitation';
const HANDOVER_HEADER = 'Super-Vote-Handover';
const ADMIN_HEADER = 'Super-Vote-Admin';
const TIME_ZONE_HEADER = 'Super-Vote-Time-Zone';

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
  const headers: Record<string, string> = { [TIME_ZONE_HEADER]: timeZone };
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
      credentials,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0); // the server cannot be reached
  }
  if (!response.ok) {
    throw await problemIn(response);
  }
  return response;
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

/**
 * Follows a poll live, over server-sent events. The first update is the poll's
 * current state. After a network hiccup the browser reconnects by itself, and
 * the new connection starts with the current state again; but an error from
 * the server, while it restarts for instance, ends the stream for good.
 * Returns a function that stops watching.
 */
export function watchPoll(id: string, watcher: PollWatcher): () => void {
  const source = new EventSource(`${BASE_URL}${pollPath(id)}/events`, { withCredentials: true });
  source.addEventListener('update', (event: MessageEvent<string>) => {
    watcher.onUpdate(JSON.parse(event.data) as PollUpdate);
  });
  source.addEventListener('deleted', () => {
    source.close();
    watcher.onDeleted();
  });
  source.addEventListener('open', () => watcher.onConnectionChange(true));
  source.addEventListener('error', () => {
    watcher.onConnectionChange(false);
    if (source.readyState === EventSource.CLOSED) {
      watcher.onLost();
    }
  });
  return () => source.close();
}
