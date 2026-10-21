import type { Messages } from '../i18n/en';
import { useI18n } from '../i18n/i18n';
import { CheckIcon, CloseIcon, PartlyIcon } from '../ui/icons';

type Mark = 'yes' | 'partly' | 'no';
type Criterion = keyof Messages['home']['compare']['criteria'];

/**
 * How a single choice, approval voting and majority judgment answer each
 * criterion, in that order. Facts, not words: the same in every language.
 * "Hard to game" follows Balinski and Laraki (2014, on the About page); no
 * rule is immune (Gibbard, Satterthwaite), which the caption says.
 */
const MARKS: Record<Criterion, readonly [Mark, Mark, Mark]> = {
  nuance: ['no', 'partly', 'yes'],
  splitting: ['no', 'yes', 'yes'],
  lesserEvil: ['no', 'yes', 'yes'],
  tactics: ['no', 'partly', 'yes'],
  quick: ['yes', 'yes', 'partly'],
  familiar: ['yes', 'partly', 'no'],
};

const ICONS = { yes: CheckIcon, partly: PartlyIcon, no: CloseIcon };

/** The pros and cons of super-vote's two voting systems, beside the single choice most elections ask for. */
export default function VotingSystemsTable() {
  const { t } = useI18n();
  const { compare } = t.home;
  return (
    <figure className="panel compare">
      <table>
        <thead>
          <tr>
            <td />
            <th scope="col">{compare.single}<span className="hint">{compare.singleNote}</span></th>
            <th scope="col">{compare.approval}</th>
            <th scope="col" data-highlight>{compare.majorityJudgment}</th>
          </tr>
        </thead>
        <tbody>
          {(Object.keys(MARKS) as Criterion[]).map((criterion) => (
            <tr key={criterion}>
              <th scope="row">{compare.criteria[criterion]}</th>
              {MARKS[criterion].map((mark, column) => {
                const Icon = ICONS[mark];
                return (
                  <td key={column} data-mark={mark} data-highlight={column === 2 || undefined}>
                    <Icon />
                    <span className="visually-hidden">{compare.marks[mark]}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="hint">{compare.caption}</figcaption>
    </figure>
  );
}
