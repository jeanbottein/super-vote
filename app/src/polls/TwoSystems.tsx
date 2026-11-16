import { useI18n } from '../i18n/i18n';

/** Each option's bar, in tenths of its voters, from Excellent down to Bad: a drawing, not data. */
const GRADED = [
  [['Excellent', 2], ['VeryGood', 3], ['Good', 3], ['Fair', 1], ['Passable', 1]],
  [['Excellent', 3], ['VeryGood', 1], ['Fair', 1], ['Passable', 1], ['Inadequate', 2], ['Bad', 2]],
  [['VeryGood', 1], ['Good', 2], ['Fair', 3], ['Passable', 2], ['Inadequate', 1], ['Bad', 1]],
] as const;

/** How many of ten voters approve each option. */
const APPROVED = [7, 5, 3];

/** The two ways to decide super-vote offers, in a few words each, with a small drawing of each. */
export default function TwoSystems() {
  const { t } = useI18n();
  const { majorityJudgment, approval } = t.home.systems;
  return (
    <section className="home-section">
      <h2>{t.home.systems.title}</h2>
      <div className="systems">
        <article className="panel">
          <div className="schema graded" aria-hidden="true">
            {GRADED.map((bar, row) => (
              <div key={row} className="schema-bar">
                {bar.map(([mention, tenths]) => (
                  <span key={mention} data-judgment={mention} style={{ flexGrow: tenths }} />
                ))}
              </div>
            ))}
          </div>
          <h3>{majorityJudgment.title}</h3>
          <p>{majorityJudgment.text}</p>
        </article>
        <article className="panel">
          <div className="schema approved" aria-hidden="true">
            {APPROVED.map((tenths, row) => (
              <div key={row} className="schema-bar" data-first={row === 0 || undefined}>
                <span style={{ width: `${tenths * 10}%` }} />
              </div>
            ))}
          </div>
          <h3>{approval.title}</h3>
          <p>{approval.text}</p>
        </article>
      </div>
    </section>
  );
}
