import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPoll, takePollOver, watchPoll } from '../api/client';
import { lunchPoll } from '../test/fixtures';
import { renderAt } from '../test/render';
import PollPage from './PollPage';

vi.mock('../api/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api/client')>()),
  getPoll: vi.fn(),
  watchPoll: vi.fn(),
  takePollOver: vi.fn(),
}));

/**
 * A poll created for somebody else: the client that made it sends them a
 * handover link, and opening it makes the poll theirs.
 */
describe('a handover link', () => {
  beforeEach(() => {
    vi.mocked(watchPoll).mockReturnValue(() => {});
    window.history.replaceState(null, '', '/p/abc');
  });

  it('makes the poll yours before it is shown, then leaves the address clean', async () => {
    vi.mocked(takePollOver).mockResolvedValue(lunchPoll({ isMine: true }));
    vi.mocked(getPoll).mockResolvedValue(lunchPoll({ isMine: true }));

    renderAt('/p/abc#handover=secret-token', [{ path: '/p/:id', element: <PollPage /> }]);

    await waitFor(() => expect(takePollOver).toHaveBeenCalledWith('abc', { handover: 'secret-token' }));
    expect(await screen.findByText('Where do we eat?')).toBeInTheDocument();
    expect(window.location.hash).toBe('');
  });

  /** The token works once, so a reload must still open the poll. */
  it('still shows the poll when the token is spent', async () => {
    vi.mocked(takePollOver).mockRejectedValue(new Error('spent'));
    vi.mocked(getPoll).mockResolvedValue(lunchPoll({ isMine: false }));

    renderAt('/p/abc#handover=spent-token', [{ path: '/p/:id', element: <PollPage /> }]);

    expect(await screen.findByText('Where do we eat?')).toBeInTheDocument();
  });

  it('is not sent when the address carries none', async () => {
    vi.mocked(getPoll).mockResolvedValue(lunchPoll());

    renderAt('/p/abc', [{ path: '/p/:id', element: <PollPage /> }]);

    expect(await screen.findByText('Where do we eat?')).toBeInTheDocument();
    expect(takePollOver).not.toHaveBeenCalled();
  });
});

/** A poll's admin link: its creator opens it in another browser to manage the poll from there. */
describe('an admin link', () => {
  beforeEach(() => {
    vi.mocked(watchPoll).mockReturnValue(() => {});
    window.history.replaceState(null, '', '/p/abc');
  });

  it('makes the poll yours, then takes the token out of the address', async () => {
    vi.mocked(takePollOver).mockResolvedValue(lunchPoll({ isMine: true }));
    vi.mocked(getPoll).mockResolvedValue(lunchPoll({ isMine: true, adminToken: 'admin-token' }));

    renderAt('/p/abc#admin=admin-token', [{ path: '/p/:id', element: <PollPage /> }]);

    await waitFor(() => expect(takePollOver).toHaveBeenCalledWith('abc', { admin: 'admin-token' }));
    expect(await screen.findByRole('heading', { name: 'Manage your poll' })).toBeInTheDocument();
    expect(window.location.hash).toBe('');
  });

  it('is shown to the creator, to open elsewhere', async () => {
    vi.mocked(getPoll).mockResolvedValue(lunchPoll({ isMine: true, adminToken: 'admin-token' }));

    renderAt('/p/abc', [{ path: '/p/:id', element: <PollPage /> }]);

    expect(await screen.findByRole('textbox', { name: 'Admin link of the poll' }))
      .toHaveValue(`${window.location.origin}/p/abc#admin=admin-token`);
  });
});
