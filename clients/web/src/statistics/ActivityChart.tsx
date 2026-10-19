import { useState, type PointerEvent } from 'react';
import type { Activity, Statistics } from '../api/types';
import { useI18n } from '../i18n/i18n';

interface ActivityChartProps {
  days: Statistics['days'];
  /** The day the statistics were published, the chart's last. */
  asOf: string;
  measure: keyof Activity;
}

const DAYS = 90;
const BAR = 10; // each day's width, in the chart's units
const HEIGHT = 120;

/** The last 90 UTC days, oldest first, those without any counted as nothing. */
export function lastDays(days: Statistics['days'], asOf: string): (Activity & { day: string })[] {
  const counted = new Map(days.map((day) => [day.day, day]));
  const last = new Date(asOf.slice(0, 10) + 'T00:00:00Z');
  return Array.from({ length: DAYS }, (_, index) => {
    const date = new Date(last);
    date.setUTCDate(last.getUTCDate() - (DAYS - 1 - index));
    const day = date.toISOString().slice(0, 10);
    return counted.get(day) ?? { day, polls: 0, ballots: 0, voters: 0 };
  });
}

/** One bar per day; point at one, or tap it, to read it. */
export default function ActivityChart({ days, asOf, measure }: ActivityChartProps) {
  const { t } = useI18n();
  const series = lastDays(days, asOf);
  const [pointed, setPointed] = useState<number | null>(null);
  const largest = Math.max(1, ...series.map((day) => day[measure]));
  const total = series.reduce((sum, day) => sum + day[measure], 0);
  const busiest = series.reduce((best, day) => (day[measure] > best[measure] ? day : best), series[0]);
  const shown = series[pointed ?? DAYS - 1];
  const { count: counted, noun } = t.statistics.measures[measure];

  const point = (event: PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    if (box.width > 0) {
      setPointed(Math.min(DAYS - 1, Math.max(0, Math.floor(((event.clientX - box.left) / box.width) * DAYS))));
    }
  };

  return (
    <figure className="activity-chart">
      <p className="activity-chart-reading" aria-live="polite">
        {t.statistics.onDay(t.number(shown[measure]), noun(shown[measure]), t.day(shown.day))}
      </p>
      <svg
        viewBox={`0 0 ${DAYS * BAR} ${HEIGHT}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={t.statistics.overLastDays(counted(total), DAYS)
          + (total > 0 ? t.statistics.busiest(t.day(busiest.day), t.number(busiest[measure])) : '.')}
        onPointerDown={point}
        onPointerMove={(event) => (event.pointerType === 'mouse' || event.buttons) && point(event)}
        onPointerLeave={() => setPointed(null)}
      >
        <line className="activity-chart-grid" x1="0" x2={DAYS * BAR} y1="0.5" y2="0.5" />
        {series.map((day, index) => {
          const height = (day[measure] / largest) * (HEIGHT - 2);
          return day[measure] > 0 && (
            <rect key={day.day} className="activity-chart-bar" data-pointed={index === pointed || undefined}
              x={index * BAR + 1} y={HEIGHT - height} width={BAR - 2} height={height} />
          );
        })}
        <line className="activity-chart-axis" x1="0" x2={DAYS * BAR} y1={HEIGHT - 0.5} y2={HEIGHT - 0.5} />
      </svg>
      <figcaption className="activity-chart-scale">
        <span>{t.day(series[0].day)}</span>
        <span>{t.statistics.topLine(t.number(largest))}</span>
        <span>{t.day(series[DAYS - 1].day)}</span>
      </figcaption>
    </figure>
  );
}
