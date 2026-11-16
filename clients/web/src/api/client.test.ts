import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ApiError, castBallot, castBallotAsNewVoter, createPoll, deletePoll, getPoll, RECONNECT_DELAY_MS, revokeInvitation, watchPoll,
} from './client';
import type { NewPoll } from './types';

/** The app's own storage (Capacitor Preferences), in memory. */
const kept = new Map<string, string>();

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: async ({ key }: { key: string }) => ({ value: kept.get(key) ?? null }),
    set: async ({ key, value }: { key: string; value: string }) => { kept.set(key, value); },
    remove: async ({ key }: { key: string }) => { kept.delete(key); },
  },
}));

const lunch: NewPoll = {
  title: 'Lunch?', options: ['Ramen', 'Tacos'], votingSystem: 'APPROVAL', visibility: 'UNLISTED',
  invitationOnly: false, showVoterNames: false, resultsShown: 'LIVE', resultsAfterBallots: null, optionOrder: 'AS_WRITTEN',
};

describe('the API client', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it('sends the voter cookie with every call', async () => {
    fetchMock.mockResolvedValue(Response.json({ id: 'abc' }));

    await getPoll('abc');

    expect(fetchMock).toHaveBeenCalledWith('/api/polls/abc', expect.objectContaining({
      method: 'GET',
      credentials: 'include',
    }));
  });

  it('sends nothing else until the first call is answered, so that a new browser gets one cookie', async () => {
    let answer: (response: Response) => void = () => {};
    fetchMock.mockReturnValueOnce(new Promise((resolve) => { answer = resolve; }));
    fetchMock.mockResolvedValue(Response.json([]));

    vi.resetModules(); // a fresh page load
    const fresh = await import('./client');
    const first = fresh.getPoll('abc');
    const second = fresh.getPoll('def');
    await Promise.resolve();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    answer(Response.json({ id: 'abc' }));
    await Promise.all([first, second]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("says the device's time zone, for the statistics, and never more", async () => {
    fetchMock.mockResolvedValue(Response.json({ id: 'abc' }));

    await getPoll('abc');

    const [, init] = fetchMock.mock.calls[0];
    expect(init?.headers).toEqual({ 'Super-Vote-Time-Zone': Intl.DateTimeFormat().resolvedOptions().timeZone });
  });

  it('sends bodies as JSON', async () => {
    fetchMock.mockResolvedValue(Response.json({ id: 'abc' }, { status: 201 }));

    await createPoll(lunch);

    const [, init] = fetchMock.mock.calls[0];
    expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' });
    expect(JSON.parse(init?.body as string)).toEqual(lunch);
  });

  it('says how many more polls this connection may create, from the RateLimit fields', async () => {
    fetchMock.mockResolvedValue(Response.json({ id: 'abc' }, {
      status: 201,
      headers: { 'RateLimit-Policy': '"polls";q=20;w=86400', RateLimit: '"polls";r=4;t=3600' },
    }));
    const before = Date.now();

    const { poll, pollsLeft } = await createPoll(lunch);

    expect(poll).toEqual({ id: 'abc' });
    expect(pollsLeft).toMatchObject({ count: 4, perDay: 20 });
    expect(pollsLeft?.resetsAt).toBeGreaterThanOrEqual(before + 3_600_000);
    expect(pollsLeft?.resetsAt).toBeLessThanOrEqual(Date.now() + 3_600_000);
  });

  it('knows of no polls left from a server that does not say', async () => {
    fetchMock.mockResolvedValue(Response.json({ id: 'abc' }, { status: 201 }));

    expect((await createPoll(lunch)).pollsLeft).toBeNull();
  });

  it('sends the invitation a voter came with in a header, never in an address', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(Response.json({ id: 'abc' })));

    await getPoll('abc', 't0k3n');
    await castBallot('abc', { approvedOptionIds: ['1'] }, 't0k3n');

    for (const [url, init] of fetchMock.mock.calls) {
      expect(url).not.toContain('t0k3n');
      expect(init?.headers).toMatchObject({ 'Super-Vote-Invitation': 't0k3n' });
    }
  });

  it('takes an invitation back by its number, never its token', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await revokeInvitation('abc', 42);

    expect(fetchMock).toHaveBeenCalledWith('/api/polls/abc/invitations/42', expect.objectContaining({
      method: 'DELETE',
    }));
  });

  it('leaves the cookie out of ballots from the ballot feeder, so each comes from a new voter, from where it is told',
    async () => {
      fetchMock.mockResolvedValue(Response.json({}));

      await castBallotAsNewVoter('abc', { approvedOptionIds: ['1'] }, 'Asia/Tokyo');

      expect(fetchMock).toHaveBeenCalledWith('/api/polls/abc/ballot', expect.objectContaining({
        method: 'PUT',
        credentials: 'omit',
        headers: expect.objectContaining({ 'Super-Vote-Time-Zone': 'Asia/Tokyo' }),
      }));
    });

  it('encodes poll ids into paths', async () => {
    fetchMock.mockResolvedValue(Response.json({}));

    await castBallot('a/b', { approvedOptionIds: ['1'] });

    expect(fetchMock.mock.calls[0][0]).toBe('/api/polls/a%2Fb/ballot');
  });

  it('resolves to nothing on 204 No Content', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(deletePoll('abc')).resolves.toBeUndefined();
  });

  it('reports the problem the server answered: its type, its sentence, and when to try again', async () => {
    fetchMock.mockResolvedValue(Response.json(
      { type: '/problems/too-many-polls', status: 429, detail: 'You can create more in 5 hours.' },
      { status: 429, headers: { 'Content-Type': 'application/problem+json', 'Retry-After': '18000' } },
    ));

    const error = await castBallot('abc', { judgments: {} }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 429, type: '/problems/too-many-polls', message: 'You can create more in 5 hours.', retryAfter: 18000,
    });
  });

  it('explains failures that come without a problem document', async () => {
    fetchMock.mockResolvedValue(new Response('<html>Bad gateway</html>', { status: 502 }));

    await expect(getPoll('abc')).rejects.toMatchObject({ status: 502, type: null, message: '' });
  });

  it('says so when the server cannot be reached', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(getPoll('abc')).rejects.toMatchObject({ status: 0 });
  });
});

describe('watching a poll', () => {
  const fetchMock = vi.fn<typeof fetch>();
  const watcher = { onUpdate: vi.fn(), onDeleted: vi.fn(), onConnectionChange: vi.fn(), onLost: vi.fn() };

  /** A stream the test writes to, as the server would, and ends or breaks. */
  function openStream() {
    const encoder = new TextEncoder();
    let controller!: ReadableStreamDefaultController<Uint8Array>;
    const body = new ReadableStream<Uint8Array>({ start: (opened) => { controller = opened; } });
    return {
      response: new Response(body, { headers: { 'Content-Type': 'text/event-stream' } }),
      send: (type: string, data: unknown) => controller.enqueue(encoder.encode(`event:${type}\ndata:${JSON.stringify(data)}\n\n`)),
      sendRaw: (text: string) => controller.enqueue(encoder.encode(text)),
      end: () => controller.close(),
      fail: () => controller.error(new TypeError('network error')),
    };
  }

  const signalOf = (call: number) => fetchMock.mock.calls[call][1]?.signal as AbortSignal;

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it('subscribes to the poll with credentials', async () => {
    fetchMock.mockResolvedValue(openStream().response);

    watchPoll('abc', watcher);

    await vi.waitFor(() => expect(watcher.onConnectionChange).toHaveBeenCalledWith(true));
    expect(fetchMock).toHaveBeenCalledWith('/api/polls/abc/events', expect.objectContaining({
      credentials: 'include',
      headers: { Accept: 'text/event-stream' },
    }));
  });

  it('passes updates on', async () => {
    const stream = openStream();
    fetchMock.mockResolvedValue(stream.response);
    watchPoll('abc', watcher);

    await vi.waitFor(() => expect(watcher.onConnectionChange).toHaveBeenCalledWith(true));
    stream.send('update', { closedAt: null, totalBallots: 3, options: [] });

    await vi.waitFor(() => expect(watcher.onUpdate).toHaveBeenCalledWith({ closedAt: null, totalBallots: 3, options: [] }));
  });

  it('stops listening once the poll is deleted, for good', async () => {
    const stream = openStream();
    fetchMock.mockResolvedValue(stream.response);
    watchPoll('abc', watcher);

    await vi.waitFor(() => expect(watcher.onConnectionChange).toHaveBeenCalledWith(true));
    stream.send('deleted', {});

    await vi.waitFor(() => expect(watcher.onDeleted).toHaveBeenCalled());
    expect(signalOf(0).aborted).toBe(true);
    await vi.advanceTimersByTimeAsync(RECONNECT_DELAY_MS * 2);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('connects again when the stream ends or breaks, and the connection says so', async () => {
    const first = openStream();
    const second = openStream();
    fetchMock.mockResolvedValueOnce(first.response).mockResolvedValueOnce(second.response).mockResolvedValue(openStream().response);
    watchPoll('abc', watcher);

    await vi.waitFor(() => expect(watcher.onConnectionChange).toHaveBeenCalledWith(true));
    first.end(); // as the server does when it shuts down
    await vi.waitFor(() => expect(watcher.onConnectionChange).toHaveBeenLastCalledWith(false));
    await vi.advanceTimersByTimeAsync(RECONNECT_DELAY_MS);
    await vi.waitFor(() => expect(watcher.onConnectionChange).toHaveBeenLastCalledWith(true));
    second.fail();
    await vi.waitFor(() => expect(watcher.onConnectionChange).toHaveBeenLastCalledWith(false));
    await vi.advanceTimersByTimeAsync(RECONNECT_DELAY_MS);

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(watcher.onConnectionChange.mock.calls).toEqual([[true], [false], [true], [false], [true]]);
    expect(watcher.onLost).not.toHaveBeenCalled();
  });

  it('tries again when the server cannot be reached', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch')).mockResolvedValue(openStream().response);
    watchPoll('abc', watcher);

    await vi.waitFor(() => expect(watcher.onConnectionChange).toHaveBeenCalledWith(false));
    await vi.advanceTimersByTimeAsync(RECONNECT_DELAY_MS);

    await vi.waitFor(() => expect(watcher.onConnectionChange).toHaveBeenLastCalledWith(true));
    expect(watcher.onLost).not.toHaveBeenCalled();
  });

  it('gives up when the server answers with an error, as while it restarts', async () => {
    fetchMock.mockResolvedValue(new Response('Bad Gateway', { status: 502 }));
    watchPoll('abc', watcher);

    await vi.waitFor(() => expect(watcher.onLost).toHaveBeenCalled());
    expect(watcher.onConnectionChange).toHaveBeenCalledWith(false);
    await vi.advanceTimersByTimeAsync(RECONNECT_DELAY_MS * 2);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('closes the stream when asked, never connects again, and tells the page nothing more', async () => {
    fetchMock.mockResolvedValue(openStream().response);
    const stop = watchPoll('abc', watcher);
    await vi.waitFor(() => expect(watcher.onConnectionChange).toHaveBeenCalledWith(true));

    stop();

    expect(signalOf(0).aborted).toBe(true);
    await vi.advanceTimersByTimeAsync(RECONNECT_DELAY_MS * 2);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(watcher.onConnectionChange.mock.calls).toEqual([[true]]); // the page that stopped watching is gone
    expect(watcher.onLost).not.toHaveBeenCalled();
  });

  it('keeps the stream when the page cannot take an update, as EventSource does', async () => {
    const reportError = vi.fn();
    vi.stubGlobal('reportError', reportError);
    const stream = openStream();
    fetchMock.mockResolvedValue(stream.response);
    watchPoll('abc', watcher);
    await vi.waitFor(() => expect(watcher.onConnectionChange).toHaveBeenCalledWith(true));

    stream.sendRaw('event:update\ndata:{not JSON\n\n');
    watcher.onUpdate.mockImplementationOnce(() => { throw new Error('the page broke'); });
    stream.send('update', { totalBallots: 4 });
    stream.send('update', { totalBallots: 5 });

    await vi.waitFor(() => expect(watcher.onUpdate).toHaveBeenCalledWith({ totalBallots: 5 }));
    expect(reportError).toHaveBeenCalledTimes(2);
    expect(reportError.mock.calls[0][0]).toBeInstanceOf(SyntaxError);
    expect(reportError).toHaveBeenCalledWith(new Error('the page broke'));
    expect(watcher.onConnectionChange.mock.calls).toEqual([[true]]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('gives up on an answer that is not a stream of events, as a captive portal gives', async () => {
    fetchMock.mockResolvedValue(new Response('<html>Sign in to the Wi-Fi</html>', { headers: { 'Content-Type': 'text/html' } }));
    watchPoll('abc', watcher);

    await vi.waitFor(() => expect(watcher.onLost).toHaveBeenCalled());
    expect(watcher.onConnectionChange.mock.calls).toEqual([[false]]);
  });
});

describe('in the Android app', () => {
  const fetchMock = vi.fn<typeof fetch>();

  /** A fresh launch of the app: nothing asked for yet. */
  async function launch() {
    vi.resetModules();
    return import('./client');
  }

  const minting = (call: unknown[]) => call[0] === '/api/voters';

  beforeEach(() => {
    vi.stubEnv('MODE', 'android');
    vi.stubGlobal('fetch', fetchMock);
    kept.clear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it('asks for a voter token once, keeps it, and sends it instead of the cookie, with its version', async () => {
    fetchMock.mockImplementation(async (url) =>
      url === '/api/voters' ? Response.json({ token: 'minted' }, { status: 201 }) : Response.json({ id: 'abc' }));
    const app = await launch();

    await Promise.all([app.getPoll('abc'), app.getPoll('def')]);

    expect(fetchMock.mock.calls.filter(minting)).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/voters', expect.objectContaining({ method: 'POST', credentials: 'omit' }));
    expect(kept.get('voter-token')).toBe('minted');
    expect(fetchMock).toHaveBeenCalledWith('/api/polls/abc', expect.objectContaining({
      credentials: 'omit',
      headers: expect.objectContaining({
        Authorization: 'Bearer minted',
        'Super-Vote-Client': `android/${__SUPER_VOTE_APP_VERSION__}`,
      }),
    }));
  });

  it('uses the token it kept', async () => {
    kept.set('voter-token', 'kept');
    fetchMock.mockResolvedValue(Response.json({ id: 'abc' }));
    const app = await launch();

    await app.getPoll('abc');

    expect(fetchMock.mock.calls.filter(minting)).toHaveLength(0);
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({ Authorization: 'Bearer kept' });
  });

  it('asks again after a first launch without a network', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    const app = await launch();
    await expect(app.getPoll('abc')).rejects.toMatchObject({ status: 0 });

    fetchMock.mockImplementation(async (url) =>
      url === '/api/voters' ? Response.json({ token: 'minted' }, { status: 201 }) : Response.json({ id: 'abc' }));
    await app.getPoll('abc');

    expect(kept.get('voter-token')).toBe('minted');
  });

  it('forgets a token the server does not know, so that the next call starts afresh', async () => {
    kept.set('voter-token', 'refused');
    fetchMock.mockResolvedValueOnce(Response.json({ type: '/problems/unknown-voter', detail: 'Not a token.' }, { status: 401 }));
    const app = await launch();
    await expect(app.getPoll('abc')).rejects.toMatchObject({ status: 401 });
    expect(kept.has('voter-token')).toBe(false);

    fetchMock.mockImplementation(async (url) =>
      url === '/api/voters' ? Response.json({ token: 'fresh' }, { status: 201 }) : Response.json({ id: 'abc' }));
    await app.getPoll('abc');

    expect(fetchMock.mock.calls.at(-1)?.[1]?.headers).toMatchObject({ Authorization: 'Bearer fresh' });
  });

  it('watches a poll with its token too', async () => {
    kept.set('voter-token', 'kept');
    fetchMock.mockResolvedValue(new Response(new ReadableStream(), { headers: { 'Content-Type': 'text/event-stream' } }));
    const app = await launch();

    const stop = app.watchPoll('abc', { onUpdate() {}, onDeleted() {}, onConnectionChange() {}, onLost() {} });

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/polls/abc/events', expect.objectContaining({
      credentials: 'omit',
      headers: expect.objectContaining({ Authorization: 'Bearer kept', Accept: 'text/event-stream' }),
    })));
    stop();
  });
});
