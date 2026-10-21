import { useId, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { castBallot } from '../api/client';
import type { Admission, Mention, Poll, PollOption } from '../api/types';
import ApprovalBallot from '../features/VotingSystem/Approval/ApprovalBallot';
import MajorityJudgmentBallot from '../features/VotingSystem/MajorityJudgment/MajorityJudgmentBallot';
import MajorityJudgmentDropdownBallot from '../features/VotingSystem/MajorityJudgment/MajorityJudgmentDropdownBallot';
import type { Messages } from '../i18n/en';
import { errorMessage } from '../i18n/errorMessage';
import { useI18n } from '../i18n/i18n';
import { usePreferences } from '../preferences/preferences';
import { isEnter } from '../ui/keys';
import { useToast } from '../ui/Toasts';
import { useBallot, type SubmissionMode } from './useBallot';
import { useServerInfo } from './useServerInfo';

interface BallotSectionProps {
  poll: Poll;
  /** The poll's options in the order this voter sees them (shownOptions). */
  options: PollOption[];
  /** The token from the invitation link the voter came with, if any. */
  invitation: string | null;
  /** Receives the poll as the server returns it after a ballot. */
  onCast(poll: Poll): void;
}

/** The voter's own ballot, in the poll's voting system, or why they cannot vote. */
export default function BallotSection(props: BallotSectionProps) {
  const { t } = useI18n();
  const { poll, invitation } = props;
  if (poll.admission !== 'ADMITTED') {
    return <p className="panel callout">{whyNotAdmitted(poll.admission, invitation !== null, t)}</p>;
  }
  return poll.votingSystem === 'MAJORITY_JUDGMENT'
    ? <MajorityJudgmentBallotSection {...props} />
    : <ApprovalBallotSection {...props} />;
}

function whyNotAdmitted(admission: Exclude<Admission, 'ADMITTED'>, withInvitation: boolean, t: Messages): string {
  if (admission === 'INVITATION_USED') {
    return t.ballot.invitationUsed;
  }
  return withInvitation ? t.ballot.invitationNotValid : t.ballot.notInvited;
}

const NO_JUDGMENTS: Record<string, Mention> = {};
const NO_APPROVALS: string[] = [];

function pick(judgments: Record<string, Mention>, optionIds: Set<string>): Record<string, Mention> {
  return Object.fromEntries(Object.entries(judgments).filter(([optionId]) => optionIds.has(optionId)));
}

function MajorityJudgmentBallotSection({ poll, options, invitation, onCast }: BallotSectionProps) {
  const { t } = useI18n();
  const [{ mjBallot, submission }] = usePreferences();
  const showToast = useToast();
  const voter = useVoterName(poll);
  const ballot = useBallot({
    saved: poll.myBallot?.judgments ?? NO_JUDGMENTS,
    mode: submission,
    equals: sameJudgments,
    cast: async (judgments) => onCast(await castBallot(poll.id, { judgments, voterName: voter.forBallot }, invitation)),
    castChanged: voter.changedSinceCast,
    onError: (error) => showToast(errorMessage(error, t), 'error'),
  });
  // The server counts an option left unrated as Bad, and answers with it: shown, every row the voter has not
  // touched yet would turn Bad and step back. Until the page reloads, rows show only what the voter chose here.
  const [rated, setRated] = useState<Set<string> | null>(() => (poll.myBallot ? null : new Set()));
  const shown = rated ? pick(ballot.ballot, rated) : ballot.ballot;
  const complete = options.every((option) => shown[option.id]);
  const Ballot = mjBallot === 'dropdown' ? MajorityJudgmentDropdownBallot : MajorityJudgmentBallot;

  return (
    <BallotFrame
      mode={submission}
      counted={poll.myBallot !== null}
      unsent={ballot.hasChanges}
      busy={ballot.busy}
      canSubmit={ballot.hasChanges && complete}
      submitLabel={complete ? t.ballot.submit : t.ballot.rateEveryOption}
      onSubmit={ballot.submit}
      onWithdraw={() => {
        setRated(new Set());
        ballot.withdraw(NO_JUDGMENTS);
      }}
      instructions={submission === 'live' ? t.ballot.majorityJudgmentLive : t.ballot.majorityJudgmentEnvelope}
      invited={poll.invitationOnly && !poll.isMine}
      nameField={poll.showVoterNames && <VoterNameField poll={poll} voter={voter} onCommit={ballot.recast} />}
    >
      <Ballot
        options={options}
        ballot={shown}
        onChange={(judgments) => {
          setRated((before) => before && new Set(Object.keys(judgments)));
          ballot.change(judgments);
        }}
      />
    </BallotFrame>
  );
}

function ApprovalBallotSection({ poll, options, invitation, onCast }: BallotSectionProps) {
  const { t } = useI18n();
  const [{ submission }] = usePreferences();
  const showToast = useToast();
  const voter = useVoterName(poll);
  const ballot = useBallot({
    saved: poll.myBallot?.approvedOptionIds ?? NO_APPROVALS,
    mode: submission,
    equals: sameApprovals,
    cast: async (approvedOptionIds) =>
      onCast(await castBallot(poll.id, { approvedOptionIds, voterName: voter.forBallot }, invitation)),
    castChanged: voter.changedSinceCast,
    onError: (error) => showToast(errorMessage(error, t), 'error'),
  });

  return (
    <BallotFrame
      mode={submission}
      counted={poll.myBallot !== null}
      unsent={ballot.hasChanges}
      busy={ballot.busy}
      canSubmit={ballot.hasChanges}
      submitLabel={t.ballot.submit}
      onSubmit={ballot.submit}
      onWithdraw={() => ballot.withdraw(NO_APPROVALS)}
      instructions={t.ballot.approval}
      invited={poll.invitationOnly && !poll.isMine}
      nameField={poll.showVoterNames && <VoterNameField poll={poll} voter={voter} onCommit={ballot.recast} />}
    >
      <ApprovalBallot options={options} approved={ballot.ballot} onChange={ballot.change} />
    </BallotFrame>
  );
}

interface BallotFrameProps {
  mode: SubmissionMode;
  /** The server holds a ballot from this voter. */
  counted: boolean;
  /** Envelope mode: changes not submitted yet. */
  unsent: boolean;
  busy: boolean;
  canSubmit: boolean;
  submitLabel: string;
  onSubmit(): void;
  onWithdraw(): void;
  instructions: string;
  /** The voter came with an invitation, which this ballot uses. */
  invited: boolean;
  /** Polls that show names: the voter's name, above the ballot. */
  nameField: ReactNode;
  children: ReactNode;
}

/**
 * A ballot counted before the page opened starts hidden: whoever looks at
 * this screen, over a shoulder or on a projector, does not see what the voter
 * chose. They open it to change it, and can hide it again. A ballot the voter
 * touches stays open, so that it does not vanish once counted.
 */
function BallotFrame(props: BallotFrameProps) {
  const {
    mode, counted, unsent, busy, canSubmit, submitLabel, onSubmit, onWithdraw, instructions, invited, nameField,
    children,
  } = props;
  const { t } = useI18n();
  const titleId = useId();
  const body = useRef<HTMLDivElement>(null);
  const changeButton = useRef<HTMLButtonElement>(null);
  const [revealed, setRevealed] = useState(false);

  /** Focus goes to the voter's choices, not to the name field, which would open the keyboard on a phone. */
  function reveal() {
    flushSync(() => setRevealed(true));
    body.current?.querySelector<HTMLElement>('input[type="radio"]:checked, input[type="checkbox"], select')?.focus();
  }

  function hide() {
    flushSync(() => setRevealed(false));
    changeButton.current?.focus();
  }

  return (
    <section className="ballot" aria-labelledby={titleId}>
      <div className="section-header">
        <h2 id={titleId}>{t.ballot.yourBallot}</h2>
        {counted && (
          <button type="button" className="button danger" disabled={busy} onClick={onWithdraw}>
            {t.ballot.withdraw}
          </button>
        )}
      </div>
      {revealed || !counted
        ? <div className="ballot-body" ref={body} onChange={() => setRevealed(true)}>
          {nameField}
          <p className="hint">{instructions}</p>
          {invited && !counted && <p className="hint">{t.ballot.invited}</p>}
          {children}
          {mode === 'envelope' && (
            <button type="button" className="button primary wide" disabled={!canSubmit || busy} onClick={onSubmit}>
              {busy ? t.ballot.submitting : submitLabel}
            </button>
          )}
          <p className="ballot-status" data-counted={counted}>
            {counted ? t.ballot.counted : t.ballot.notVoted}
          </p>
          {counted && !unsent && (
            <button type="button" className="button paper" onClick={hide}>
              {t.ballot.hide}
            </button>
          )}
        </div>
        : <>
          <p className="ballot-status" data-counted={true}>{t.ballot.hidden}</p>
          <button type="button" className="button paper wide" ref={changeButton} onClick={reveal}>
            {t.ballot.change}
          </button>
        </>}
    </section>
  );
}

type VoterName = ReturnType<typeof useVoterName>;

/**
 * The name this voter gives on a poll that shows names. It starts as the name
 * their ballot carries, or, before they vote, the one they last gave anywhere
 * (remembered in this browser). Blank means anonymous.
 */
function useVoterName(poll: Poll) {
  const [preferences, updatePreferences] = usePreferences();
  // A counted ballot says whether this voter gave a name here; an anonymous one stays anonymous.
  const [name, setName] = useState(() => (poll.myBallot ? poll.myBallot.voterName ?? '' : preferences.voterName));
  const trimmed = name.trim();
  return {
    name,
    change: setName,
    /** Offers the name again on the next poll. */
    remember() {
      if (trimmed !== preferences.voterName) {
        updatePreferences({ voterName: trimmed });
      }
    },
    /** What the ballot carries: nothing at all on a poll that hides names. */
    forBallot: poll.showVoterNames ? trimmed || null : undefined,
    changedSinceCast: poll.myBallot !== null && trimmed !== (poll.myBallot.voterName ?? ''),
  };
}

interface VoterNameFieldProps {
  poll: Poll;
  voter: VoterName;
  onCommit(): void;
}

function VoterNameField({ poll, voter, onCommit }: VoterNameFieldProps) {
  const { t } = useI18n();
  const { limits } = useServerInfo();
  const inputId = useId();
  const hintId = useId();

  function commit() {
    voter.remember();
    onCommit();
  }

  return (
    <div className="field voter-name">
      <label htmlFor={inputId}>{t.ballot.yourName}</label>
      <input
        id={inputId}
        value={voter.name}
        maxLength={limits.maxVoterNameLength}
        placeholder={t.ballot.namePlaceholder}
        autoComplete="nickname"
        enterKeyHint="done"
        aria-describedby={hintId}
        onChange={(event) => voter.change(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (isEnter(event)) {
            event.currentTarget.blur(); // commits
          }
        }}
      />
      <p id={hintId} className="hint">
        {poll.resultsShown === 'AFTER_CLOSING' ? t.ballot.namesAtClose : t.ballot.namesLive}
      </p>
    </div>
  );
}

function sameJudgments(a: Record<string, Mention>, b: Record<string, Mention>): boolean {
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every((key) => a[key] === b[key]);
}

function sameApprovals(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((id) => b.includes(id));
}
