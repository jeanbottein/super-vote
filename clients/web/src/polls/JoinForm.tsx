import { useId, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { joinPoll } from '../api/client';
import { errorMessage } from '../i18n/errorMessage';
import { useI18n } from '../i18n/i18n';

/** A code is six letters and digits, shown as the server writes it down: K7M-4QX. */
const CODE_LENGTH = 6;

/** What was typed or pasted, as a code: capitals and digits only, six at most, a dash after the third. */
function formatCode(typed: string): string {
  const characters = typed.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, CODE_LENGTH);
  return characters.length > 3 ? `${characters.slice(0, 3)}-${characters.slice(3)}` : characters;
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
    const typed = code.replace('-', '');
    if (typed === '') {
      setProblem(t.join.typeTheCode);
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
          onChange={(event) => setCode(formatCode(event.target.value))}
        />
        <button type="submit" className="button primary" disabled={joining}>
          {joining ? t.join.joining : t.join.join}
        </button>
      </div>
      {problem && <p id={problemId} className="field-problem" role="alert">{problem}</p>}
    </form>
  );
}
