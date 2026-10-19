import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { JudgmentCounts, Mention, Score } from '../../../api/types';
import { useI18n } from '../../../i18n/i18n';
import { gmjScore } from './gmjScore';
import { MENTIONS_BEST_FIRST } from './mentions';

interface MajorityJudgmentResultsGraphProps {
  optionLabel: string;
  judgmentCounts: JudgmentCounts;
  totalBallots: number;
  /** The mention and score the server ranked this option by (see api.Ranking). */
  majorityMention: Mention | null;
  score: Score | null;
  compact?: boolean;
  rank?: number;
  isExAequo?: boolean;
}

const TICKS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const MEDALS = ['gold', 'silver', 'bronze'];

/** Each mention given, best first: where its slice starts, its share, and the share of it or better, in %. */
function slicesOf(counts: JudgmentCounts, total: number) {
  const slices = [];
  let before = 0;
  for (const mention of MENTIONS_BEST_FIRST) {
    const count = counts[mention] || 0;
    if (count > 0) {
      slices.push({
        mention,
        start: (before / total) * 100,
        share: (count / total) * 100,
        orBetter: ((before + count) / total) * 100,
      });
    }
    before += count;
  }
  return slices;
}

/**
 * One option's merit profile: how its ballots spread over the seven mentions,
 * best on the left, as one bar over a graduated axis. The mention above the
 * axis's bold 50% mark is the option's majority mention.
 *
 * Pointing at a mention (or tapping it) dims the worse ones and says how many
 * voters gave that mention or better. Nothing moves.
 */
export default function MajorityJudgmentResultsGraph({
  optionLabel,
  judgmentCounts,
  totalBallots,
  majorityMention,
  score,
  compact = false,
  rank,
  isExAequo = false,
}: MajorityJudgmentResultsGraphProps) {
  const { t } = useI18n();
  const [focused, setFocused] = useState<number | null>(null);
  const chart = useRef<HTMLDivElement>(null);

  // Details shown by a tap go away with a tap anywhere else.
  useEffect(() => {
    if (focused === null) return;
    const dismiss = (event: PointerEvent) => {
      if (!chart.current?.contains(event.target as Node)) setFocused(null);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [focused]);
  const empty = totalBallots === 0;
  const slices = slicesOf(judgmentCounts, totalBallots);
  const focus = focused === null ? undefined : slices[focused];
  const medal = rank && rank <= 3 ? MEDALS[rank - 1] : 'false';
  const percent = (share: number) => t.percent(share / 100);
  const description = empty
    ? t.results.noBallotsFor(optionLabel)
    : t.results.profile(optionLabel, slices.map((s) => `${t.mentions[s.mention]} ${percent(s.share)}`).join(', '));

  return (
    <div className="mj-results-card" data-compact={compact} data-winner={!empty && rank === 1}>
      <div className="mj-results-header">
        <div className="mj-results-title-section">
          {!empty && rank && (
            <div className="mj-rank-container">
              <div className="mj-rank-badge" data-medal={medal}>{rank}</div>
              {isExAequo && <span className="mj-ex-aequo">{t.results.exAequo}</span>}
            </div>
          )}
          <div className="mj-results-title">{optionLabel}</div>
        </div>
      </div>

      <div
        ref={chart}
        className="mj-results-chart"
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') setFocused(null);
        }}
      >
        <div className="mj-results-bars" role="img" aria-label={description}>
          {slices.map((slice, index) => (
            <div
              key={slice.mention}
              className="mj-results-bar"
              data-judgment={slice.mention}
              data-dimmed={focused !== null && index > focused}
              style={{ width: `${slice.share}%` }}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') setFocused(index);
              }}
              onPointerDown={(event) => {
                if (event.pointerType !== 'mouse') setFocused((current) => (current === index ? null : index));
              }}
            />
          ))}
        </div>
        {focus && (
          <div
            className="mj-results-tooltip"
            aria-hidden="true"
            style={{ '--at': `${focus.start + focus.share / 2}%` } as CSSProperties}
          >
            <strong>{t.results.mentionShare(t.mentions[focus.mention], percent(focus.share))}</strong>
            {focused !== 0 && (
              <span>{t.results.orBetter(percent(focus.orBetter), t.mentions[focus.mention])}</span>
            )}
          </div>
        )}
      </div>

      <div className="mj-results-axis" aria-hidden="true">
        {TICKS.map((tick) => (
          <div
            key={tick}
            className="mj-tick"
            data-major={tick === 50}
            style={{ '--left': `${tick}%` } as CSSProperties}
          >
            <span className="mj-tick-label">{t.results.tick(tick)}</span>
          </div>
        ))}
      </div>

      {!empty && majorityMention && score && (
        <div className="mj-results-badges-below">
          <div className="mj-results-badges">
            <span className="mj-results-hint">{t.results.majorityMention}</span>
            <div className="mj-results-badge" data-judgment={majorityMention}>
              {t.mentions[majorityMention]}
            </div>
            <span className="mj-results-hint">{t.results.gmjScore}</span>
            <div className="mj-score-badge" title={t.results.gmjScoreTitle(t.decimal(gmjScore(score), 4))}>
              {t.decimal(gmjScore(score), 2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
