import type { ReactNode } from 'react';
import type { Messages } from '../i18n/en';
import { useI18n } from '../i18n/i18n';
import { useServerInfo } from '../polls/useServerInfo';

export const SOURCE_CODE_URL = 'https://github.com/jeanbottein/super-vote';

interface Reference {
  /** Its note, in about.notes: what the work brings to super-vote. */
  id: keyof Messages['about']['notes'];
  authors: string;
  year: number;
  /** In the language it was published in. */
  title: string;
  /** Journal, volume and pages, or publisher. */
  source: string;
  url: string;
}

const REFERENCES: Reference[] = [
  {
    id: 'pnas2007',
    authors: 'Michel Balinski and Rida Laraki',
    year: 2007,
    title: 'A theory of measuring, electing, and ranking',
    source: 'Proceedings of the National Academy of Sciences 104(21), 8720–8725',
    url: 'https://doi.org/10.1073/pnas.0702634104',
  },
  {
    id: 'book2011',
    authors: 'Michel Balinski and Rida Laraki',
    year: 2011,
    title: 'Majority Judgment: Measuring, Electing, and Ranking',
    source: 'MIT Press',
    url: 'https://doi.org/10.7551/mitpress/9780262015134.001.0001',
  },
  {
    id: 'judge2014',
    authors: 'Michel Balinski and Rida Laraki',
    year: 2014,
    title: "Judge: Don't vote!",
    source: 'Operations Research 62(3), 483–511',
    url: 'https://doi.org/10.1287/opre.2014.1269',
  },
  {
    id: 'fabre2021',
    authors: 'Adrien Fabre',
    year: 2021,
    title: 'Tie-breaking the highest median: alternatives to the majority judgment',
    source: 'Social Choice and Welfare 56, 101–124',
    url: 'https://doi.org/10.1007/s00355-020-01269-9',
  },
  {
    id: 'brams1978',
    authors: 'Steven J. Brams and Peter C. Fishburn',
    year: 1978,
    title: 'Approval voting',
    source: 'American Political Science Review 72(3), 831–847',
    url: 'https://doi.org/10.2307/1955105',
  },
  {
    id: 'laslier2009',
    authors: 'Jean-François Laslier',
    year: 2009,
    title: 'The leader rule: a model of strategic approval voting in a large electorate',
    source: 'Journal of Theoretical Politics 21(1), 113–136',
    url: 'https://doi.org/10.1177/0951629808097286',
  },
  {
    id: 'gibbard1973',
    authors: 'Allan Gibbard',
    year: 1973,
    title: 'Manipulation of voting schemes: a general result',
    source: 'Econometrica 41(4), 587–601',
    url: 'https://doi.org/10.2307/1914083',
  },
  {
    id: 'satterthwaite1975',
    authors: 'Mark A. Satterthwaite',
    year: 1975,
    title: "Strategy-proofness and Arrow's conditions",
    source: 'Journal of Economic Theory 10(2), 187–217',
    url: 'https://doi.org/10.1016/0022-0531(75)90050-2',
  },
];

/** What super-vote is, how it decides, the research it rests on, and who makes it. */
export default function AboutPage() {
  const { t } = useI18n();
  const { limits } = useServerInfo();
  return (
    <>
      <title>{t.about.title}</title>
      <section className="hero">
        <h1>{t.about.heading}</h1>
        <p>{t.about.lead(limits.pollLifetimeDays)}</p>
      </section>

      <Section title={t.about.howDecided}>
        <p>{t.about.howDecidedText}</p>
        <h3>{t.about.majorityJudgment}</h3>
        <p>{t.about.majorityJudgmentText}</p>
        <h3>{t.about.approval}</h3>
        <p>{t.about.approvalText}</p>
      </Section>

      <Section title={t.about.science}>
        <p>{t.about.scienceText}</p>
        <ol className="references">
          {REFERENCES.map((reference) => (
            <li key={reference.url}>
              <span>{reference.authors} ({reference.year}). </span>
              <a href={reference.url} target="_blank" rel="noreferrer" lang="en">{reference.title}</a>
              <span>. <em>{reference.source}</em>.</span>
              <span className="hint">{t.about.notes[reference.id]}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title={t.about.whoMakesIt}>
        <p>{t.about.whoMakesItText}</p>
        <p>
          <a href={SOURCE_CODE_URL} target="_blank" rel="noreferrer">{t.about.seeTheCode}</a>
        </p>
      </Section>
    </>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="panel about-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
