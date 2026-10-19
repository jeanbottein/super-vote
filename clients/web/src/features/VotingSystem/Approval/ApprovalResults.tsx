import type { PollOption } from '../../../api/types';
import { useI18n } from '../../../i18n/i18n';
import { ranked } from '../ranked';
import './approval.css';

interface ApprovalResultsProps {
  options: PollOption[];
  totalBallots: number;
}

/** The options, most approved first, each with the share of voters who approved it. */
export default function ApprovalResults({ options, totalBallots }: ApprovalResultsProps) {
  const { t } = useI18n();
  const counted = totalBallots > 0;

  return (
    <ol className="approval-results">
      {ranked(options).map(({ option, rank }) => {
        const approvals = option.approvalCount ?? 0;
        const share = counted ? approvals / totalBallots : 0;
        return (
          <li key={option.id} className="approval-result" data-winner={counted && rank === 1}>
            <div className="approval-result-head">
              {counted && <span className="approval-rank" aria-label={t.results.rank(rank)}>{rank}</span>}
              <span className="approval-result-label">{option.label}</span>
              <span className="approval-result-count">
                {t.results.approvals(approvals)}
                {counted && ` · ${t.percent(Math.round(share * 100) / 100)}`}
              </span>
            </div>
            <div className="approval-bar" aria-hidden="true">
              <div className="approval-bar-fill" style={{ width: `${share * 100}%` }} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
