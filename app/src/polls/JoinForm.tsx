import { useId, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { joinPoll } from '../api/client';
import { errorMessage } from '../i18n/errorMessage';
import { useI18n } from '../i18n/i18n';
import { formatJoinCode } from './format';

/** A code is six letters and digits, shown as the server writes it down: K7M-4QX. */
const CODE_LENGTH = 6;

/** Its letters and digits, in capitals: dashes and spaces, whatever their kind, only help reading it. */
function charactersOf(text: string): string {
  return text.replace(/[^a-z0-9]/gi, '').toUpperCase();
}

/** As people read it, once there is more than its first half: K7M-4QX. */
function written(characters: string): string {
  return characters.length > 3 ? formatJoinCode(characters) : characters;
}

/**
 * The code's characters after a keystroke, six at most. Deleting the dash
 * deletes the character before it, as it reads: the dash itself would only
 * come back.
 */
function typedInto(before: string, after: string): string {
  const characters = charactersOf(after);
  const dashDeleted = before.includes('-') && !after.includes('-') && charactersOf(before) === characters;
  return (dashDeleted ? characters.slice(0, 2) + characters.slice(3) : characters).slice(0, CODE_LENGTH);
}

/** Opens a poll from the short code someone read out or showed on a screen. */
export default function JoinForm() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const inputId = useId();
  const problemId = useId();
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  async function join(event: FormEvent) {
    event.preventDefault();
    const typed = charactersOf(code);
    if (typed.length !== CODE_LENGTH) {
      setProblem(typed === '' ? t.join.typeTheCode : t.join.notACode);
      return;
    }
    setJoining(true);
    setProblem(null);
    try {
      const poll = await joinPoll(typed);
      navigate(`/p/${poll.id}`);
    } catch (error) {
      setProblem(errorMessage(error, t));
      setJoining(false);
    }
  }

  return (
    <form className="join-form" onSubmit={join} noValidate>
      <label htmlFor={inputId}>{t.join.label}</label>
      <div className="join-row">
        <input
          id={inputId}
          className="join-code"
          value={code}
          placeholder="K7M-4QX"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          enterKeyHint="go"
          aria-invalid={problem ? true : undefined}
          aria-describedby={problem ? problemId : undefined}
          onChange={(event) => setCode(written(typedInto(code, event.target.value)))}
          onPaste={(event) => {
            // Pasted whole, a code fits; anything longer is not one, and is not cut down into one.
            event.preventDefault();
            const pasted = charactersOf(event.clipboardData.getData('text'));
            setProblem(pasted.length === CODE_LENGTH ? null : t.join.notACode);
            if (pasted.length === CODE_LENGTH) setCode(written(pasted));
          }}
        />
        <button type="submit" className="button primary" disabled={joining}>
          {joining ? t.join.joining : t.join.join}
        </button>
      </div>
      {problem && <p id={problemId} className="field-problem" role="alert">{problem}</p>}
    </form>
  );
}
