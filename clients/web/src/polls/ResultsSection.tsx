import { useId } from 'react';
import type { Poll, PollOption } from '../api/types';
import ApprovalResults from '../features/VotingSystem/Approval/ApprovalResults';
import MajorityJudgmentResults from '../features/VotingSystem/MajorityJudgment/MajorityJudgmentResults';
import type { Messages } from '../i18n/en';
import { useI18n } from '../i18n/i18n';
import { downloadResults } from './exportResults';
import type { Connection } from './usePoll';
import VoterNames from './VoterNames';

interface ResultsSectionProps {
  poll: Poll;
  /** The poll's options in the order this voter sees them: options tied in the results keep it. */
  options: PollOption[];
  connection: Connection;
}

/** The server sends no tallies while the poll keeps its results back. */
export function resultsKeptBack(poll: Poll): boolean {
  return poll.options.every((option) => option.approvalCount === null && option.judgmentCounts === null);
}

export default function ResultsSection({ poll, options, connection }: ResultsSectionProps) {
  const { t } = useI18n();
  const titleId = useId();
  const hidden = resultsKeptBack(poll);

  return (
    <section className="panel results" aria-labelledby={titleId}>
      <div className="section-header">
        <h2 id={titleId}>{t.results.heading}</h2>
        <span className="results-count">{t.results.ballots(poll.totalBallots)}</span>
        <LiveStatus connection={connection} closed={poll.closedAt !== null} />
      </div>
      {hidden
        ? <p className="hint">{keptBack(poll, t)}</p>
        : <>
          {poll.totalBallots === 0 && <p className="hint">{t.results.noBallotsYet}</p>}
          {poll.votingSystem === 'MAJORITY_JUDGMENT'
            ? <MajorityJudgmentResults options={options} />
            : <ApprovalResults options={options} totalBallots={poll.totalBallots} />}
        </>}
      {poll.voterNames && (
        <VoterNames names={poll.voterNames} more={poll.moreVoterNames} totalBallots={poll.totalBallots} />
      )}
      {!hidden && poll.totalBallots > 0 && (
        <div className="results-footer">
          <button type="button" className="button link" onClick={() => downloadResults(poll)}>
            {t.results.download}
          </button>
        </div>
      )}
    </section>
  );
}

function keptBack(poll: Poll, t: Messages) {
  if (poll.resultsShown === 'AFTER_BALLOTS') {
    return t.results.keptUntilBallots(poll.resultsAfterBallots ?? 0);
  }
  return poll.isMine ? t.results.keptUntilYouClose : t.results.keptUntilClosed;
}

function LiveStatus({ connection, closed }: { connection: Connection; closed: boolean }) {
  const { t } = useI18n();
  if (closed) {
    return <span className="live-status" data-state="closed">{t.results.final}</span>;
  }
  const label = { connecting: t.results.connecting, live: t.results.live, offline: t.results.reconnecting }[connection];
  return <span className="live-status" data-state={connection} role="status">{label}</span>;
}
