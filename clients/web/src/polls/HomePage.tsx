import type { ReactNode } from 'react';
import { Link } from 'react-router';
import type { JudgmentCounts, PollOption } from '../api/types';
import MajorityJudgmentResults from '../features/VotingSystem/MajorityJudgment/MajorityJudgmentResults';
import { errorMessage } from '../i18n/errorMessage';
import { useI18n } from '../i18n/i18n';
import { CupIcon, HeartIcon, QuestionIcon, ResultsIcon, ShareIcon } from '../ui/icons';
import Logo from '../ui/Logo';
import AgentPrompt from './AgentPrompt';
import JoinForm from './JoinForm';
import PollList from './PollList';
import { usePollLists } from './usePollLists';
import { useServerInfo } from './useServerInfo';
import VotingSystemsTable from './VotingSystemsTable';

export const KO_FI_URL = 'https://ko-fi.com/jean64';
export const GITHUB_SPONSORS_URL = 'https://github.com/sponsors/jeanbottein';

const STEP_ICONS = [QuestionIcon, ShareIcon, ResultsIcon];

/**
 * First what people come to do, create a poll or join one; below, in few
 * words, how it works, how majority judgment decides and how it compares,
 * how to have an AI agent create a poll, how to support super-vote, and what
 * it is not for.
 */
export default function HomePage() {
  const { t } = useI18n();
  const { features, limits } = useServerInfo();
  const { lists, failure } = usePollLists(features.publicPolls);

  return (
    <>
      <title>{t.home.title}</title>
      <div className="home-start">
        <section className="hero">
          <Logo />
          <h1>{t.home.headline}</h1>
          <p>{t.home.lead}</p>
          <Link className="button primary" to="/new">{t.home.createPoll}</Link>
        </section>
        <div className="home-actions">
          <JoinForm />
          {failure !== null ? (
            <p className="panel error-text" role="alert">{errorMessage(failure, t)}</p>
          ) : (
            <>
              {/* A first visit has none to list: the page goes straight on to what super-vote is. */}
              {lists && lists.mine.length > 0 && (
                <Panel title={t.home.yourPolls}><PollList polls={lists.mine} empty="" /></Panel>
              )}
              {features.publicPolls && (
                <Panel title={t.home.publicPolls}>
                  {lists
                    ? <PollList polls={lists.others} empty={t.home.noPublicPolls} />
                    : <p className="empty" aria-busy="true">{t.loading}</p>}
                </Panel>
              )}
            </>
          )}
        </div>
      </div>

      <section className="home-section">
        <h2>{t.home.howItWorks}</h2>
        <ol className="steps">
          {t.home.steps.map((step, index) => {
            const Icon = STEP_ICONS[index];
            return (
              <li key={step.title}>
                <span className="step-icon"><Icon /></span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="home-section beside">
        <div>
          <h2>{t.home.gradeTitle}</h2>
          <p>{t.home.gradeText}</p>
        </div>
        <figure className="panel example">
          <h3>{t.home.example.question}</h3>
          <MajorityJudgmentResults options={exampleOptions(t.home.example.options)} />
          <figcaption className="hint">{t.home.example.caption}</figcaption>
        </figure>
      </section>

      <section className="home-section beside">
        <div>
          <h2>{t.home.compare.title}</h2>
          <p>{t.home.compare.text}</p>
          <Link to="/about">{t.home.compare.science}</Link>
        </div>
        <VotingSystemsTable />
      </section>

      <AgentPrompt />

      <section className="home-section support">
        <h2>{t.home.supportTitle}</h2>
        <p>{t.home.supportText}</p>
        <div className="button-row">
          <a className="button secondary" href={KO_FI_URL} target="_blank" rel="noreferrer">
            <CupIcon />Ko-fi
          </a>
          <a className="button secondary" href={GITHUB_SPONSORS_URL} target="_blank" rel="noreferrer">
            <HeartIcon />GitHub Sponsors
          </a>
        </div>
      </section>

      <section className="panel home-section good-to-know">
        <h2>{t.home.limitsTitle}</h2>
        <ul>
          <li>{t.home.limits.everyday}</li>
          <li>{t.home.limits.private}</li>
          <li>{t.home.limits.browser(limits.pollLifetimeDays)}</li>
          <li>{t.home.limits.deleted(limits.pollLifetimeDays)}</li>
        </ul>
        <Link to="/privacy">{t.home.limitsLink}</Link>
      </section>
    </>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

/**
 * Twenty friends choosing dinner: one option most of them like, one with the
 * most fans that as many reject, one in between. The places are what the
 * server ranks them (api/Ranking.java): pizza has the best majority mention,
 * Good; sushi and burgers share Fair, and the GMJ score, (above - below) /
 * at, separates them: (10 - 9) / 1 against (8 - 7) / 5.
 */
const EXAMPLE: { counts: JudgmentCounts; rank: number; majorityMention: PollOption['majorityMention'];
  score: PollOption['score'] }[] = [
  {
    counts: { Excellent: 3, VeryGood: 7, Good: 6, Fair: 3, Passable: 1, Inadequate: 0, Bad: 0 },
    rank: 1, majorityMention: 'Good', score: { numerator: 6, denominator: 6 },
  },
  {
    counts: { Excellent: 8, VeryGood: 1, Good: 1, Fair: 1, Passable: 2, Inadequate: 3, Bad: 4 },
    rank: 2, majorityMention: 'Fair', score: { numerator: 1, denominator: 1 },
  },
  {
    counts: { Excellent: 1, VeryGood: 3, Good: 4, Fair: 5, Passable: 4, Inadequate: 2, Bad: 1 },
    rank: 3, majorityMention: 'Fair', score: { numerator: 1, denominator: 5 },
  },
];

function exampleOptions(labels: readonly string[]): PollOption[] {
  return EXAMPLE.map((option, index) => ({
    id: `example-${index}`,
    label: labels[index],
    approvalCount: null,
    judgmentCounts: option.counts,
    rank: option.rank,
    majorityMention: option.majorityMention,
    score: option.score,
  }));
}
