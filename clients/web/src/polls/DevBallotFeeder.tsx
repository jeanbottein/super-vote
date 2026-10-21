import { useState } from 'react';
import { castBallotAsNewVoter } from '../api/client';
import type { BallotRequest, Poll } from '../api/types';
import { MENTIONS_BEST_FIRST } from '../features/VotingSystem/MajorityJudgment/mentions';
import { errorMessage } from '../i18n/errorMessage';
import { useI18n } from '../i18n/i18n';
import { useToast } from '../ui/Toasts';

/**
 * Development only (the poll page renders it when import.meta.env.DEV): casts
 * random ballots to watch the results move, each from a new anonymous voter,
 * and from one of a few time zones, so that the poll's places fill in too.
 * A developer's tool, in English: its words are not messages, so that no trace
 * of it ships in a production build.
 */
export default function DevBallotFeeder({ poll }: { poll: Poll }) {
  const { t } = useI18n();
  const showToast = useToast();
  const [count, setCount] = useState(20);
  const [cast, setCast] = useState<number | null>(null);

  async function feed() {
    const places = randomPlaces(count);
    try {
      for (let i = 1; i <= count; i++) {
        setCast(i);
        await castBallotAsNewVoter(poll.id, randomBallot(poll), pick(places));
      }
    } catch (error) {
      showToast(errorMessage(error, t), 'error');
    } finally {
      setCast(null);
    }
  }

  return (
    <section className="panel dev-tool">
      <h2>Ballot feeder <span className="badge">dev only</span></h2>
      <div className="button-row">
        <input
          type="number"
          min={1}
          max={500}
          value={count}
          aria-label="Number of random ballots"
          onChange={(event) => setCount(Number(event.target.value))}
        />
        <button type="button" className="button secondary" disabled={cast !== null} onClick={feed}>
          {cast === null ? 'Cast random ballots' : `Casting ${cast} of ${count}…`}
        </button>
      </div>
    </section>
  );
}

/**
 * About one time zone for every five ballots: a place shows once three ballots
 * come from it (StatisticsService.VISIBLE), so spread over every time zone,
 * a feed would show none.
 */
function randomPlaces(ballots: number): string[] {
  const timeZones = Intl.supportedValuesOf('timeZone');
  return Array.from({ length: Math.max(1, Math.round(ballots / 5)) }, () => pick(timeZones));
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomBallot(poll: Poll): BallotRequest {
  if (poll.votingSystem === 'APPROVAL') {
    return { approvedOptionIds: poll.options.filter(() => Math.random() < 0.5).map((option) => option.id) };
  }
  return {
    judgments: Object.fromEntries(poll.options.map((option) => [
      option.id,
      pick(MENTIONS_BEST_FIRST),
    ])),
  };
}
