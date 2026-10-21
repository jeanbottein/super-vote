import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { errorMessage } from '../i18n/errorMessage';
import { useI18n } from '../i18n/i18n';
import { CupIcon, HeartIcon } from '../ui/icons';
import AgentPrompt from './AgentPrompt';
import JoinForm from './JoinForm';
import PollList from './PollList';
import TwoSystems from './TwoSystems';
import { usePollLists } from './usePollLists';
import { useServerInfo } from './useServerInfo';
import VotingSystemsTable from './VotingSystemsTable';

export const KO_FI_URL = 'https://ko-fi.com/jean64';
export const GITHUB_SPONSORS_URL = 'https://github.com/sponsors/jeanbottein';

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
        <section className="hero home-hero">
          <h1 className="wordmark">
            {/* The mark is an S: it stands for the first letter, which assistive technology reads. */}
            <img className="logo wordmark-s" src="/favicon.svg" alt="S" />UPER VOTE
          </h1>
          <p>{t.home.lead}</p>
        </section>
        <div className="panel start">
          <div className="start-new">
            <p>{t.home.createQuestion}</p>
            <Link className="button primary" to="/new">{t.home.createPoll}</Link>
          </div>
          <JoinForm />
        </div>
        <div className="home-actions">
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

      <div className="home-section how-and-support">
        <section>
          <h2>{t.home.howItWorks}</h2>
          <ol className="steps">
            {t.home.steps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="panel support">
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
      </div>

      <TwoSystems />

      <section className="home-section beside">
        <div>
          <h2>{t.home.compare.title}</h2>
          <p>{t.home.compare.text}</p>
          <Link to="/about">{t.home.compare.science}</Link>
        </div>
        <VotingSystemsTable />
      </section>

      <AgentPrompt />

      <section className="panel home-section good-to-know">
        <h2>{t.home.limitsTitle}</h2>
        <ul>
          <li>{t.home.limits.everyday}</li>
          <li>{t.home.limits.private}</li>
          <li>{t.home.limits.browser(limits.pollLifetimeDays)}</li>
          <li>{t.home.limits.deleted(limits.pollLifetimeDays)}</li>
          <li>{t.home.limits.disclaimer}</li>
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
