import { screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ApiError, joinPoll, listMyPolls, listPublicPolls } from '../api/client';
import type { PollSummary } from '../api/types';
import { serverInfo } from '../test/fixtures';
import { renderAt } from '../test/render';
import HomePage from './HomePage';
import { useServerInfo } from './useServerInfo';

vi.mock('../api/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api/client')>()),
  listMyPolls: vi.fn(),
  listPublicPolls: vi.fn(),
  joinPoll: vi.fn(),
}));

vi.mock('./useServerInfo', () => ({ useServerInfo: vi.fn() }));


const summary = (id: string, title: string, changes: Partial<PollSummary> = {}): PollSummary => ({
  id,
  title,
  votingSystem: 'MAJORITY_JUDGMENT',
  visibility: 'PUBLIC',
  createdAt: new Date().toISOString(),
  closedAt: null,
  isMine: false,
  ...changes,
});

const lunch = summary('lunch', 'Where do we eat?', { isMine: true, visibility: 'UNLISTED' });
const offsite = summary('offsite', 'Where is the offsite?', { votingSystem: 'APPROVAL', closedAt: new Date().toISOString() });

beforeEach(() => {
  vi.mocked(useServerInfo).mockReturnValue(serverInfo({ publicPolls: true }));
  vi.mocked(listMyPolls).mockResolvedValue([lunch]);
  vi.mocked(listPublicPolls).mockResolvedValue([offsite, { ...lunch, visibility: 'PUBLIC' }]);
});

const openHome = () => renderAt('/', [{ path: '/', element: <HomePage /> }]);

const section = (title: string) => screen.getByRole('heading', { name: title }).closest('section')!;

describe('the home page', () => {
  it("lists the voter's polls, then other people's public polls", async () => {
    openHome();

    const mine = await screen.findByRole('link', { name: /Where do we eat\?/ });
    expect(mine).toHaveAttribute('href', '/p/lunch');
    expect(within(section('Decide together…')).queryByText('Public')).not.toBeInTheDocument();

    const others = within(section('Public polls')).getAllByRole('link');
    expect(others).toHaveLength(1); // the voter's own public poll is listed once, above
    expect(others[0]).toHaveAttribute('href', '/p/offsite');
    expect(within(others[0]).getByText('Approval voting')).toBeInTheDocument();
    expect(within(others[0]).getByText('Closed')).toBeInTheDocument();
  });

  it('lists no public polls when the server does not offer them', async () => {
    vi.mocked(useServerInfo).mockReturnValue(serverInfo());
    openHome();

    await screen.findByRole('link', { name: /Where do we eat\?/ });
    expect(screen.queryByRole('heading', { name: 'Public polls' })).not.toBeInTheDocument();
    expect(listPublicPolls).not.toHaveBeenCalled();
  });

  it('lists no polls of the visitor before they create one, and says when there are no public ones', async () => {
    vi.mocked(listMyPolls).mockResolvedValue([]);
    vi.mocked(listPublicPolls).mockResolvedValue([]);
    openHome();

    expect(await screen.findByText('No public polls yet.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Decide together…' })).not.toBeInTheDocument();
  });

  it('then says how it works, how it decides and compares, how to support it, and what it is not for', () => {
    openHome();

    for (const heading of ['How it works', 'Two ways to decide', 'Fairer than most official elections',
      'Ready for AI', 'Free, open source, no ads', 'Good to know']) {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: 'Ko-fi' })).toHaveAttribute('href', 'https://ko-fi.com/jean64');
    expect(screen.getByRole('link', { name: 'GitHub Sponsors' }))
      .toHaveAttribute('href', 'https://github.com/sponsors/jeanbottein');
    expect(screen.getByRole('link', { name: 'All about privacy and limits' })).toHaveAttribute('href', '/privacy');
  });

  it('weighs a single choice, approval and majority judgment, in words a screen reader says', () => {
    openHome();

    const table = within(section('Fairer than most official elections')).getByRole('table');
    expect(within(table).getAllByRole('columnheader').map((header) => header.textContent))
      .toEqual(['One choicemost elections', 'Approval', 'Majority judgment']);
    const row = (criterion: string) => within(table).getByRole('rowheader', { name: criterion }).closest('tr')!;
    expect(within(row('Hard to game')).getAllByRole('cell').map((cell) => cell.textContent))
      .toEqual(['No', 'Partly', 'Yes']);
    expect(within(row('Quick to fill in')).getAllByRole('cell').map((cell) => cell.textContent))
      .toEqual(['Yes', 'Yes', 'Partly']);
    expect(within(section('Fairer than most official elections')).getByRole('link', { name: 'The science behind it' }))
      .toHaveAttribute('href', '/about');
  });

  it("gives a prompt to copy into an AI agent, naming this site and its guide for agents", async () => {
    const user = userEvent.setup();
    openHome();

    const agent = section('Ready for AI');
    const opening = `Use ${window.location.host} to create a poll for my team (instructions for agents: `
      + `${window.location.origin}/llms.txt).`;
    const prompt = within(agent).getByText((text) => text.startsWith(opening)).textContent;
    expect(prompt).toContain('Hand the poll over to me');

    await user.click(within(agent).getByRole('button', { name: 'Copy the prompt' }));

    expect(await navigator.clipboard.readText()).toBe(prompt);
    expect(within(agent).getByRole('button', { name: 'Prompt copied' })).toBeInTheDocument();
  });

  it('selects the prompt for the person to copy when the clipboard is out of reach', async () => {
    const user = userEvent.setup();
    openHome();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new DOMException('Denied', 'NotAllowedError'));

    await user.click(screen.getByRole('button', { name: 'Copy the prompt' }));

    expect(window.getSelection()?.toString()).toMatch(/^Use .+ give me the link to share with the team\.$/);
    expect(screen.getByRole('button', { name: 'Copy the prompt' })).toBeInTheDocument();
  });

  it('names the two ways to decide, in a few words', () => {
    openHome();

    const systems = section('Two ways to decide');
    expect(within(systems).getByRole('heading', { name: 'Majority judgment' })).toBeInTheDocument();
    expect(within(systems).getByRole('heading', { name: 'Approval' })).toBeInTheDocument();
  });

  it('says why the polls could not be listed', async () => {
    vi.mocked(listPublicPolls).mockRejectedValue(new ApiError(0, 'The server cannot be reached.'));
    openHome();

    expect(await screen.findByRole('alert')).toHaveTextContent('The server cannot be reached.');
  });

  it('opens the poll behind a join code', async () => {
    vi.mocked(joinPoll).mockResolvedValue(lunch);
    openHome();

    await userEvent.type(screen.getByLabelText('Got a code?'), 'k7m-4qx');
    await userEvent.click(screen.getByRole('button', { name: 'Vote!' }));

    expect(joinPoll).toHaveBeenCalledWith('K7M4QX');
    expect(await screen.findByText('Poll page lunch')).toBeInTheDocument();
  });

  it('writes the code as it is typed: capitals, six characters, a dash after three', async () => {
    openHome();
    const field = screen.getByLabelText('Got a code?');

    await userEvent.type(field, 'k7m');
    expect(field).toHaveValue('K7M');
    await userEvent.type(field, '4qxzz');
    expect(field).toHaveValue('K7M-4QX');
    await userEvent.clear(field);
    await userEvent.paste(' k7m 4qx ');
    expect(field).toHaveValue('K7M-4QX');
    await userEvent.type(field, '{Backspace}{Backspace}{Backspace}');
    expect(field).toHaveValue('K7M');
  });

  it('says when no poll has the code', async () => {
    vi.mocked(joinPoll).mockRejectedValue(new ApiError(404, 'No poll has this code.'));
    openHome();

    await userEvent.type(screen.getByLabelText('Got a code?'), 'AAAAAA{Enter}');

    expect(await screen.findByRole('alert')).toHaveTextContent('No poll has this code.');
    expect(screen.getByLabelText('Got a code?')).toHaveAttribute('aria-invalid', 'true');
  });

  it('leads to creating a poll', () => {
    openHome();

    expect(screen.getByRole('link', { name: 'Decide together!' })).toHaveAttribute('href', '/new');
  });
});
