import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getServerInfo, getStatistics, listMyPolls, listPublicPolls } from '../api/client';
import { applyPreferences, loadPreferences } from '../preferences/preferences';
import App from './App';

vi.mock('../api/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api/client')>()),
  listMyPolls: vi.fn(),
  listPublicPolls: vi.fn(),
  getServerInfo: vi.fn(),
  getStatistics: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(listMyPolls).mockResolvedValue([]);
  vi.mocked(listPublicPolls).mockResolvedValue([]);
  vi.mocked(getServerInfo).mockReturnValue(new Promise(() => {})); // the form keeps its assumptions
});

afterEach(() => {
  localStorage.clear();
  applyPreferences(loadPreferences());
  window.history.pushState({}, '', '/');
});

function openAt(path: string) {
  window.history.pushState({}, '', path);
  render(<App />);
}

describe('the app', () => {
  it('opens on the home page, with no way back from there', async () => {
    openAt('/');

    expect(await screen.findByRole('heading', { name: 'SUPER VOTE' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();
  });

  it('leads back home from anywhere else', async () => {
    openAt('/new');

    expect(screen.getByRole('heading', { name: 'Decide together' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: 'Home' }));

    expect(await screen.findByRole('heading', { name: 'SUPER VOTE' })).toBeInTheDocument();
  });

  it('shows the statistics from every page, once their page has loaded', async () => {
    vi.mocked(getStatistics).mockResolvedValue({
      asOf: '2026-10-12T14:00:00Z', polls: 3, openPolls: 1, ballots: 7, voters: 4, places: [], regions: [], days: [],
    });
    openAt('/new');

    await userEvent.click(screen.getByRole('link', { name: 'Statistics' }));

    expect(await screen.findByRole('heading', { name: 'super-vote around the world' })).toBeInTheDocument();
    expect(await screen.findByRole('img', { name: /World map/ })).toBeInTheDocument();
  });

  it('says how results are decided, and cites the research, from every page', async () => {
    openAt('/new');

    await userEvent.click(screen.getByRole('link', { name: 'About and the science behind it' }));

    expect(await screen.findByRole('heading', { name: 'About super-vote' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'A theory of measuring, electing, and ranking' }))
      .toHaveAttribute('href', 'https://doi.org/10.1073/pnas.0702634104');
    expect(screen.getAllByRole('link', { name: /source code/i })[0])
      .toHaveAttribute('href', 'https://github.com/jeanbottein/super-vote');
  });

  it('says what is kept, who sees what, and what super-vote is not for, from every page', async () => {
    openAt('/new');

    // The form says it too, beside the warning that super-vote is not for official votes.
    expect(within(screen.getByRole('main')).getByRole('link', { name: 'Privacy and limits' })).toBeInTheDocument();
    await userEvent.click(within(screen.getByRole('contentinfo')).getByRole('link', { name: 'Privacy and limits' }));

    expect(await screen.findByRole('heading', { name: 'Privacy and limits', level: 1 })).toBeInTheDocument();
    for (const heading of ['What it is for', 'What is kept, and for how long', 'Who sees what', 'Limits to know']) {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    }
    expect(screen.getByText(/until it is deleted, 30 days after it was created at the latest/)).toBeInTheDocument();
  });

  it('says who publishes and hosts super-vote, and where to report a poll, from every page', async () => {
    openAt('/new');

    await userEvent.click(screen.getByRole('link', { name: 'Legal notice' }));

    expect(await screen.findByRole('heading', { name: 'Legal notice', level: 1 })).toBeInTheDocument();
    for (const heading of ['Publisher', 'Host', 'Reporting a poll']) {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    }
    expect(screen.getByText(/OVH Hosting Inc\./)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'write to us on GitHub' }))
      .toHaveAttribute('href', 'https://github.com/jeanbottein/super-vote/issues');
  });

  it('says when there is nothing at an address', () => {
    openAt('/nowhere');

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to the home page' })).toHaveAttribute('href', '/');
  });
});

describe('the settings', () => {
  it('change how the app looks and votes, at once', async () => {
    openAt('/');

    await userEvent.click(screen.getByRole('button', { name: 'Settings' }));
    const settings = screen.getByRole('dialog', { name: 'Settings' });
    await userEvent.click(within(settings).getByRole('radio', { name: 'Dark' }));
    await userEvent.click(within(settings).getByRole('radio', { name: 'Shades of grey' }));
    await userEvent.click(within(settings).getByRole('radio', { name: 'Envelope' }));

    expect(document.documentElement.dataset.appearance).toBe('dark');
    expect(document.body.dataset.colorblind).toBe('true');
    expect(within(settings).getByText('Fill in your ballot, then submit it in one go.')).toBeInTheDocument();
    expect(loadPreferences()).toMatchObject({ appearance: 'dark', colorblind: true, submission: 'envelope' });
  });

  it('close with their button, and with a tap beside them', async () => {
    openAt('/');

    await userEvent.click(screen.getByRole('button', { name: 'Settings' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog', { name: 'Settings' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Settings' }));
    const settings = screen.getByRole('dialog', { name: 'Settings' });
    fireEvent.click(within(settings).getByRole('group', { name: 'Appearance' }));
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument(); // a tap inside keeps them
    fireEvent.click(settings); // the backdrop is part of the dialog element itself

    expect(screen.queryByRole('dialog', { name: 'Settings' })).not.toBeInTheDocument();
  });
});

describe('the language', () => {
  it("is the device's until one is chosen, in Settings, where each is named in its own words", async () => {
    openAt('/');
    expect(document.documentElement.lang).toBe('en');

    await userEvent.click(screen.getByRole('button', { name: 'Settings' }));
    await userEvent.click(within(screen.getByRole('dialog', { name: 'Settings' })).getByRole('radio', { name: 'Français' }));

    expect(screen.getByRole('dialog', { name: 'Réglages' })).toBeInTheDocument();
    expect(screen.getByText('Un système de vote moderne, pour les décisions de groupe du quotidien')).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('fr');
    expect(loadPreferences().language).toBe('fr');
  });

  it('can be switched back from the foot of every page', async () => {
    localStorage.setItem('super-vote.preferences', JSON.stringify({ language: 'fr' }));
    openAt('/new');
    expect(screen.getByRole('heading', { name: 'Décider ensemble' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(screen.getByRole('heading', { name: 'Decide together' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Français' })).toHaveAttribute('lang', 'fr');
  });
});
