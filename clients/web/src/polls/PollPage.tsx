import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { ApiError } from '../api/client';
import type { Poll, PollsLeft } from '../api/types';
import { errorMessage } from '../i18n/errorMessage';
import { useI18n } from '../i18n/i18n';
import Notice from '../ui/Notice';
import BallotSection from './BallotSection';
import CopyableLink from './CopyableLink';
import DevBallotFeeder from './DevBallotFeeder';
import Invitations from './Invitations';
import { formatJoinCode } from './format';
import { adminIn, adminUrl, handoverIn, invitationIn, pollUrl } from './links';
import OwnerActions from './OwnerActions';
import ResultsSection, { resultsKeptBack } from './ResultsSection';
import ShareButton from './ShareButton';
import { newSeed, shownOptions } from './shownOptions';
import { useHandover } from './useHandover';
import { usePoll } from './usePoll';

/** Loaded with its map, only on polls that may have places to show. */
const PollPlacesSection = lazy(() => import('../statistics/PollPlacesSection'));

/** Fewer ballots than a place needs to show (StatisticsService.VISIBLE): nothing to ask for. */
const FEWEST_PLACED = 3;

/** The last polls a connection may create in its day come with a warning, so that running out is no surprise. */
const LAST_POLLS = 5;

/**
 * A poll: your ballot, and the results as they come in. Its address is its
 * share link; an invitation's link adds the invitation in the fragment, and a
 * handover or admin link the token that makes you the poll's creator.
 */
export default function PollPage() {
  const { t } = useI18n();
  const { id = '' } = useParams();
  const hash = useLocation().hash;
  const invitation = invitationIn(hash);
  const handover = useHandover(id, handoverIn(hash), adminIn(hash));

  if (handover.taking) {
    return <p className="panel">{t.poll.takingOver}</p>;
  }
  // Keyed, so that moving to another poll, another invitation, or taking it over, starts from a clean slate.
  return <PollScreen key={`${id}#${invitation}#${handover.settled}`} id={id} invitation={invitation} />;
}

function PollScreen({ id, invitation }: { id: string; invitation: string | null }) {
  const { t } = useI18n();
  const { poll, failure, deleted, connection, setPoll } = usePoll(id, invitation);
  // Drawn once per visit: a shuffled poll's options keep one order while the page is open.
  const [seed] = useState(newSeed);
  const location = useLocation();
  const navigate = useNavigate();
  const arrival = location.state as { created?: boolean; pollsLeft?: PollsLeft | null } | null;
  const justCreated = arrival?.created === true;
  // Kept for this visit only: a reload or a step back would show a count since gone stale.
  const [pollsLeft] = useState(arrival?.pollsLeft ?? null);
  const arrivedWithPollsLeft = arrival?.pollsLeft !== undefined;
  useEffect(() => {
    if (arrivedWithPollsLeft) {
      navigate(location, { replace: true, state: { created: justCreated } });
    }
  }, [arrivedWithPollsLeft, justCreated, location, navigate]);

  const home = <Link className="button primary" to="/">{t.backHome}</Link>;
  if (deleted) {
    return <Notice title={t.poll.deleted} action={home}><p>{t.poll.deletedText}</p></Notice>;
  }
  if (failure instanceof ApiError && failure.status === 404) {
    return <Notice title={t.poll.notFound} action={home}><p>{t.poll.notFoundText}</p></Notice>;
  }
  if (failure !== null) {
    return (
      <Notice
        title={t.poll.notLoaded}
        action={<button type="button" className="button primary" onClick={() => window.location.reload()}>{t.tryAgain}</button>}
      >
        <p>{errorMessage(failure, t)}</p>
      </Notice>
    );
  }
  if (!poll) {
    return <p className="panel empty" aria-busy="true">{t.poll.loadingPoll}</p>;
  }

  const options = shownOptions(poll.options, poll.optionOrder, seed);
  return (
    <>
      <title>{t.poll.title(poll.title)}</title>
      <PollHeader poll={poll} />
      {justCreated && poll.isMine && poll.totalBallots === 0 && (
        <>
          {poll.invitationOnly
            ? <p className="panel callout"><span>{t.poll.readyToInvite}</span></p>
            : <section className="panel callout ready">
              <p>{t.poll.readyToShare}</p>
              <CopyableLink url={pollUrl(poll.id)} label={t.share.linkLabel} />
              <p className="ready-code">
                <span>{t.share.joinCode}</span> <strong className="join-code">{formatJoinCode(poll.joinCode)}</strong>
              </p>
              <ShareButton poll={poll} />
            </section>}
          {poll.adminToken && (
            <section className="panel keep">
              <h2>{t.poll.keepTitle}</h2>
              <p>{t.poll.keepText}</p>
              <CopyableLink url={adminUrl(poll.id, poll.adminToken)} label={t.owner.adminLink} />
            </section>
          )}
        </>
      )}
      {pollsLeft && pollsLeft.count < LAST_POLLS && <PollsLeftHint pollsLeft={pollsLeft} />}
      {poll.closedAt
        ? <p className="panel callout">{t.poll.closedAgo(t.timeAgo(poll.closedAt))}</p>
        : <BallotSection poll={poll} options={options} invitation={invitation} onCast={setPoll} />}
      {poll.isMine && poll.invitationOnly && <Invitations poll={poll} />}
      <ResultsSection poll={poll} options={options} connection={connection} />
      {!resultsKeptBack(poll) && poll.totalBallots >= FEWEST_PLACED && (
        <Suspense fallback={null}>
          {/* Asked again when the poll closes, which may be when it shows its places. */}
          <PollPlacesSection key={poll.closedAt ?? 'open'} pollId={poll.id} />
        </Suspense>
      )}
      <p className="hint expiry">{t.poll.deletedOn(t.date(poll.expiresAt))}</p>
      {poll.isMine && <OwnerActions poll={poll} onChange={setPoll} />}
      {import.meta.env.DEV && poll.isMine && !poll.invitationOnly && <DevBallotFeeder poll={poll} />}
    </>
  );
}

function PollsLeftHint({ pollsLeft: { count, perDay, resetsAt } }: { pollsLeft: PollsLeft }) {
  const { t } = useI18n();
  const wait = t.waitUntil(resetsAt);
  return (
    <p className="hint" data-tone="warning">
      {count === 0 ? t.poll.lastPoll(wait) : t.poll.pollsLeft(count, wait)}
      {' '}{t.poll.fairShare(perDay)}
    </p>
  );
}

function PollHeader({ poll }: { poll: Poll }) {
  const { t } = useI18n();
  return (
    <section className="poll-header">
      <h1>{poll.title}</h1>
      <div className="poll-header-row">
        <p className="poll-meta">
          <span>{t.votingSystems[poll.votingSystem]}</span>
          <span>{t.visibilities[poll.visibility]}</span>
          {poll.invitationOnly && <span>{t.poll.byInvitation}</span>}
          <span>{t.poll.created(t.timeAgo(poll.createdAt))}</span>
          {poll.closedAt && <span className="badge">{t.poll.closed}</span>}
        </p>
        {!poll.invitationOnly && <ShareButton poll={poll} />}
      </div>
    </section>
  );
}
