import { Link } from 'react-router';
import type { PollSummary } from '../api/types';
import { useI18n } from '../i18n/i18n';

interface PollListProps {
  polls: PollSummary[];
  /** What to say when there is none. */
  empty: string;
}

export default function PollList({ polls, empty }: PollListProps) {
  const { t } = useI18n();
  if (polls.length === 0) {
    return <p className="empty">{empty}</p>;
  }
  return (
    <ul className="poll-list">
      {polls.map((poll) => (
        <li key={poll.id}>
          <Link className="poll-list-item" to={`/p/${poll.id}`}>
            <span className="poll-list-title">{poll.title}</span>
            <span className="poll-list-meta">
              <span>{t.votingSystems[poll.votingSystem]}</span>
              <span>{t.timeAgo(poll.createdAt)}</span>
              {poll.visibility === 'PUBLIC' && <span className="badge">{t.home.public}</span>}
              {poll.closedAt && <span className="badge">{t.home.closed}</span>}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
