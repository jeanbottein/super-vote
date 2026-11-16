import { useEffect, useState } from 'react';
import { getStatistics } from '../api/client';
import type { Activity, Statistics } from '../api/types';
import { errorMessage } from '../i18n/errorMessage';
import { useI18n } from '../i18n/i18n';
import SegmentedControl from '../ui/SegmentedControl';
import ActivityChart from './ActivityChart';
import { placeOf, regionName } from './geography';
import PlacesTable, { type Column } from './PlacesTable';
import WorldMap from './WorldMap';

type Measure = keyof Activity;

const MEASURES: Measure[] = ['voters', 'polls', 'ballots'];

/**
 * How much super-vote is used, when and where: totals, the last 90 days, and a
 * map of the time zones people came from. The server publishes them once an
 * hour, places people by their device's time zone, never their address, and
 * names no country.
 */
export default function StatisticsPage() {
  const { t } = useI18n();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [failure, setFailure] = useState<unknown>(null);
  const [measure, setMeasure] = useState<Measure>('voters');
  const [selected, setSelected] = useState<string | null>(null);
  const [focus, setFocus] = useState(0);

  useEffect(() => {
    let active = true;
    getStatistics().then(
      (answer) => active && setStatistics(answer),
      (reason: unknown) => active && setFailure(reason ?? new Error('The statistics could not be read')),
    );
    return () => {
      active = false;
    };
  }, []);

  const showOnMap = (timeZone: string) => {
    setSelected(timeZone);
    setFocus((count) => count + 1);
  };
  const columns: Column<Measure>[] = MEASURES.map((key) => ({ key, label: t.statistics.measures[key].label }));

  return (
    <>
      <title>{t.statistics.title}</title>
      <section className="hero">
        <h1>{t.statistics.heading}</h1>
        <p>{t.statistics.lead}</p>
      </section>

      {failure !== null ? (
        <p className="panel error-text" role="alert">{errorMessage(failure, t)}</p>
      ) : !statistics ? (
        <p className="empty" aria-busy="true">{t.loading}</p>
      ) : (
        <>
          <Totals statistics={statistics} />
          <SegmentedControl<Measure> legend={t.statistics.show} name="measure" value={measure}
            options={columns.map((column) => ({ value: column.key, label: column.label }))}
            onChange={setMeasure} />
          <section className="panel statistics-panel">
            <h2>{t.statistics.lastDays}</h2>
            <ActivityChart days={statistics.days} asOf={statistics.asOf} measure={measure} />
          </section>
          <section className="panel statistics-panel">
            <h2>{t.statistics.where}</h2>
            <WorldMap
              dots={statistics.places.map((place) => ({ timeZone: place.timeZone, count: place[measure] }))}
              what={t.statistics.measures[measure].plural}
              selected={selected}
              onSelect={setSelected}
              focus={focus}
            />
            <Chosen timeZone={selected} statistics={statistics} />
          </section>
          <section className="panel statistics-panel">
            <h2>{t.statistics.byRegion}</h2>
            {statistics.regions.length === 0 ? (
              <p className="empty">{t.statistics.noRegion}</p>
            ) : (
              <PlacesTable regions={statistics.regions} places={statistics.places} columns={columns}
                orderBy={measure} onShow={showOnMap} />
            )}
            <Unplaced statistics={statistics} />
          </section>
          <section className="panel statistics-panel">
            <h2>{t.statistics.howCounted}</h2>
            <p>{t.statistics.howCountedText}</p>
            <p>{t.statistics.places(t.moment(statistics.asOf))}</p>
            <p className="hint">{t.statistics.sources}</p>
          </section>
        </>
      )}
    </>
  );
}

function Totals({ statistics }: { statistics: Statistics }) {
  const { t } = useI18n();
  const totals = [
    { label: t.statistics.totals.polls, value: statistics.polls },
    { label: t.statistics.totals.openPolls, value: statistics.openPolls },
    { label: t.statistics.totals.ballots, value: statistics.ballots },
    { label: t.statistics.totals.voters, value: statistics.voters },
  ];
  return (
    <dl className="statistics-totals">
      {totals.map((total) => (
        <div key={total.label} className="panel">
          <dt>{total.label}</dt>
          <dd>{t.number(total.value)}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The numbers of the place chosen on the map or in the table. */
function Chosen({ timeZone, statistics }: { timeZone: string | null; statistics: Statistics }) {
  const { t } = useI18n();
  const place = statistics.places.find((candidate) => candidate.timeZone === timeZone);
  if (!place) {
    return <p className="statistics-chosen hint">{t.statistics.tapADot}</p>;
  }
  const { city, region } = placeOf(place.timeZone);
  const { voters, polls, ballots } = t.statistics.measures;
  return (
    <div className="statistics-chosen" aria-live="polite">
      <h3>{city} <span className="hint">· {regionName(region, t.statistics.regions)}</span></h3>
      <p>{voters.count(place.voters)} · {polls.count(place.polls)} · {ballots.count(place.ballots)}</p>
    </div>
  );
}

/** What the totals hold that no region shows: no time zone, or too few to show. */
function Unplaced({ statistics }: { statistics: Statistics }) {
  const { t } = useI18n();
  const rest = (measure: Measure) =>
    statistics[measure] - statistics.regions.reduce((sum, region) => sum + region[measure], 0);
  if (rest('voters') + rest('polls') + rest('ballots') === 0) {
    return null;
  }
  const { voters, polls, ballots } = t.statistics.measures;
  return (
    <p className="hint">
      {t.statistics.unplaced(voters.count(rest('voters')), polls.count(rest('polls')), ballots.count(rest('ballots')))}
    </p>
  );
}
