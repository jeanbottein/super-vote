import { useId, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router';
import { createPoll } from '../api/client';
import type { OptionOrder, ResultsShown, Visibility, VotingSystem } from '../api/types';
import { errorMessage } from '../i18n/errorMessage';
import { useI18n } from '../i18n/i18n';
import { CloseIcon } from '../ui/icons';
import { isEnter } from '../ui/keys';
import SegmentedControl from '../ui/SegmentedControl';
import {
  checkPollForm, filledOptions, MIN_RESULTS_AFTER_BALLOTS, offeredVisibilities, offeredVotingSystems, optionRows, tidy,
} from './pollForm';
import { useServerInfo } from './useServerInfo';

const RESULTS: ResultsShown[] = ['LIVE', 'AFTER_BALLOTS', 'AFTER_CLOSING'];
// The creator's own order last, and never the default: an order they chose can be taken for a thumb on the scale.
const ORDERS: OptionOrder[] = ['ALPHABETICAL', 'SHUFFLED', 'AS_WRITTEN'];

export default function CreatePollPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const info = useServerInfo();
  const { limits } = info;
  const ids = useId();

  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [votingSystem, setVotingSystem] = useState<VotingSystem>('MAJORITY_JUDGMENT');
  const [visibility, setVisibility] = useState<Visibility>('UNLISTED');
  const [invitationOnly, setInvitationOnly] = useState(false);
  const [showVoterNames, setShowVoterNames] = useState(false);
  // Until chosen, results wait for closing on polls that show who voted (as the server decides).
  const [chosenResultsShown, setChosenResultsShown] = useState<ResultsShown | null>(null);
  const resultsShown = chosenResultsShown ?? (invitationOnly || showVoterNames ? 'AFTER_CLOSING' : 'LIVE');
  const [resultsAfterBallots, setResultsAfterBallots] = useState('5');
  const [optionOrder, setOptionOrder] = useState<OptionOrder>('SHUFFLED');
  const [showProblems, setShowProblems] = useState(false);
  const [creating, setCreating] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const systems = offeredVotingSystems(info);
  const visibilities = offeredVisibilities(info);
  // Whatever this server offers, one of its choices is always selected.
  const chosenSystem = systems.includes(votingSystem) ? votingSystem : systems[0];
  const chosenVisibility = visibilities.includes(visibility) ? visibility : visibilities[0];

  const rows = optionRows(options, limits.maxOptions);
  const allProblems = checkPollForm({ title, options, resultsShown, resultsAfterBallots }, limits, t.newPoll.problems);
  const problems = showProblems ? allProblems : {};

  function setOption(index: number, value: string) {
    setOptions((current) => {
      const next = [...current];
      while (next.length < index) {
        next.push('');
      }
      next[index] = value;
      return next;
    });
  }

  function removeOption(index: number) {
    setOptions((current) => current.filter((_, i) => i !== index));
  }

  /** Enter moves to the next row rather than submitting a half-written poll. */
  function focusRowOnEnter(event: KeyboardEvent<HTMLInputElement>, row: number) {
    if (!isEnter(event)) {
      return;
    }
    event.preventDefault();
    const next = event.currentTarget.form?.elements.namedItem(`option-${row}`);
    if (next instanceof HTMLInputElement) {
      next.focus();
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setShowProblems(true);
    if (Object.keys(allProblems).length > 0) {
      return;
    }
    if (!chosenSystem || !chosenVisibility) {
      setFailure(t.newPoll.noNewPolls);
      return;
    }
    setCreating(true);
    setFailure(null);
    try {
      const { poll, pollsLeft } = await createPoll({
        title: tidy(title),
        options: filledOptions(options),
        votingSystem: chosenSystem,
        visibility: chosenVisibility,
        invitationOnly,
        showVoterNames,
        resultsShown,
        resultsAfterBallots: resultsShown === 'AFTER_BALLOTS' ? Number(resultsAfterBallots) : null,
        optionOrder,
      });
      navigate(`/p/${poll.id}`, { state: { created: true, pollsLeft } });
    } catch (error) {
      setFailure(errorMessage(error, t));
      setCreating(false);
    }
  }

  return (
    <form className="panel create-poll" onSubmit={submit} noValidate>
      <title>{t.newPoll.title}</title>
      <h1>{t.newPoll.heading}</h1>

      <div className="field">
        <label htmlFor={`${ids}-title`}>{t.newPoll.question}</label>
        <input
          id={`${ids}-title`}
          value={title}
          maxLength={limits.maxTitleLength}
          placeholder={t.newPoll.questionPlaceholder}
          enterKeyHint="next"
          aria-invalid={problems.title ? true : undefined}
          aria-describedby={problems.title ? `${ids}-title-problem` : undefined}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => focusRowOnEnter(event, 0)}
        />
        {problems.title && <p id={`${ids}-title-problem`} className="field-problem">{problems.title}</p>}
      </div>

      <fieldset className="field" aria-describedby={problems.options ? `${ids}-options-problem` : undefined}>
        <legend>{t.newPoll.options}</legend>
        <ol className="option-rows">
          {rows.map((option, row) => (
            <li key={row} className="option-row">
              <input
                name={`option-${row}`}
                value={option}
                maxLength={limits.maxOptionLength}
                placeholder={t.newPoll.option(row + 1)}
                aria-label={t.newPoll.option(row + 1)}
                enterKeyHint="next"
                onChange={(event) => setOption(row, event.target.value)}
                onKeyDown={(event) => focusRowOnEnter(event, row + 1)}
              />
              {option !== '' && (
                <button type="button" className="icon-button" aria-label={t.newPoll.remove(option)} onClick={() => removeOption(row)}>
                  <CloseIcon />
                </button>
              )}
            </li>
          ))}
        </ol>
        {problems.options
          ? <p id={`${ids}-options-problem`} className="field-problem">{problems.options}</p>
          : <p className="hint">{t.newPoll.optionsHint(limits.maxOptions)}</p>}
      </fieldset>

      <SegmentedControl
        legend={t.newPoll.optionOrder}
        name="optionOrder"
        value={optionOrder}
        options={ORDERS.map((order) => ({ value: order, label: t.newPoll.orders[order] }))}
        onChange={(order) => setOptionOrder(order)}
        hint={t.newPoll.orderHints[optionOrder]}
        hintTone={optionOrder === 'AS_WRITTEN' ? 'warning' : undefined}
      />

      {chosenSystem && systems.length > 1 && (
        <SegmentedControl
          legend={t.newPoll.votingSystem}
          name="votingSystem"
          value={chosenSystem}
          options={systems.map((system) => ({ value: system, label: t.newPoll.systems[system] }))}
          onChange={(system) => setVotingSystem(system)}
          hint={t.newPoll.systemHints[chosenSystem]}
        />
      )}

      {chosenVisibility && visibilities.length > 1 && (
        <SegmentedControl
          legend={t.newPoll.whoCanFindIt}
          name="visibility"
          value={chosenVisibility}
          options={visibilities.map((choice) => ({ value: choice, label: t.visibilities[choice] }))}
          onChange={(choice) => setVisibility(choice)}
          hint={t.newPoll.visibilityHints[chosenVisibility]}
        />
      )}

      {/* A browser is all that tells voters apart, unless the creator invites each one: the creator is warned. */}
      <SegmentedControl
        legend={t.newPoll.whoCanVote}
        name="whoCanVote"
        value={invitationOnly ? 'invited' : 'anyone'}
        options={[
          { value: 'anyone', label: t.newPoll.anyone },
          { value: 'invited', label: t.newPoll.invitedOnly },
        ]}
        onChange={(choice) => setInvitationOnly(choice === 'invited')}
        hint={invitationOnly ? t.newPoll.invitedHint : t.newPoll.anyoneHint}
        hintTone={invitationOnly ? undefined : 'warning'}
      />

      <SegmentedControl
        legend={t.newPoll.whoVoted}
        name="voterNames"
        value={showVoterNames ? 'shown' : 'anonymous'}
        options={[
          { value: 'anonymous', label: t.newPoll.anonymous },
          { value: 'shown', label: t.newPoll.showNames },
        ]}
        onChange={(choice) => setShowVoterNames(choice === 'shown')}
        hint={showVoterNames ? t.newPoll.showNamesHint : t.newPoll.anonymousHint}
      />

      {/* Results that move with each ballot show whoever watches them what each voter chose: the creator is warned. */}
      <SegmentedControl
        legend={t.newPoll.results}
        name="results"
        value={resultsShown}
        options={RESULTS.map((choice) => ({ value: choice, label: t.newPoll.resultsChoices[choice] }))}
        onChange={(choice) => setChosenResultsShown(choice)}
        hint={t.newPoll.resultsHints[resultsShown]}
        hintTone={resultsShown === 'AFTER_CLOSING' ? undefined : 'warning'}
      >
        {resultsShown === 'AFTER_BALLOTS' && (
          <div className="field results-after">
            <label htmlFor={`${ids}-results-after`}>{t.newPoll.ballotsBeforeResults}</label>
            <input
              id={`${ids}-results-after`}
              type="number"
              inputMode="numeric"
              min={MIN_RESULTS_AFTER_BALLOTS}
              step={1}
              value={resultsAfterBallots}
              aria-invalid={problems.resultsAfterBallots ? true : undefined}
              aria-describedby={problems.resultsAfterBallots ? `${ids}-results-after-problem` : undefined}
              onChange={(event) => setResultsAfterBallots(event.target.value)}
            />
            {problems.resultsAfterBallots && (
              <p id={`${ids}-results-after-problem`} className="field-problem">{problems.resultsAfterBallots}</p>
            )}
          </div>
        )}
      </SegmentedControl>

      <div className="create-poll-notes">
        <p className="hint">{t.newPoll.deletedAfter(limits.pollLifetimeDays)}</p>
        <p className="hint">{t.newPoll.notForElections}</p>
      </div>

      {failure && <p className="error-text" role="alert">{failure}</p>}

      <button type="submit" className="button primary wide" disabled={creating}>
        {creating ? t.newPoll.creating : t.newPoll.create}
      </button>
    </form>
  );
}
