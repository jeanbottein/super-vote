import { useId } from 'react';
import type { Messages } from '../i18n/en';
import { useI18n } from '../i18n/i18n';

interface VoterNamesProps {
  names: string[];
  /** More voters gave a name than are shown. */
  more: boolean;
  totalBallots: number;
}

/**
 * Who took part, on a poll that shows names: the first names voters gave, in
 * alphabetical order (in the order they came, they would line up with the
 * results as they moved), and how many stayed anonymous. Every name is the same
 * size: a bigger one would seem to mean something. Nothing links a name to a
 * choice.
 */
export default function VoterNames({ names, more, totalBallots }: VoterNamesProps) {
  const { t } = useI18n();
  const titleId = useId();
  const others = totalBallots - names.length;
  if (totalBallots === 0) {
    return null;
  }
  return (
    <section className="voter-names" aria-labelledby={titleId}>
      <h3 id={titleId}>{t.results.whoVoted}</h3>
      {names.length > 0 && (
        <ul className="name-cloud">
          {keyed(names).map(({ key, name }) => <li key={key}>{name}</li>)}
        </ul>
      )}
      {others > 0 && <p className="hint">{othersOf(others, more, names.length > 0, t)}</p>}
    </section>
  );
}

/** Past the names shown: "and 1,234 more voters" if more gave names, else how many stayed anonymous. */
function othersOf(others: number, more: boolean, afterNames: boolean, t: Messages): string {
  if (more) {
    return t.results.moreVoters(others);
  }
  return afterNames ? t.results.andAnonymousVoters(others) : t.results.anonymousVoters(others);
}

/** Two voters can give the same name: the second "Sam" is "Sam#2", so each keeps its element (and its entrance). */
function keyed(names: string[]) {
  const seen = new Map<string, number>();
  return names.map((name) => {
    const nth = (seen.get(name) ?? 0) + 1;
    seen.set(name, nth);
    return { key: `${name}#${nth}`, name };
  });
}
