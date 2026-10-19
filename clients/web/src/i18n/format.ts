/**
 * The languages the web app speaks, and the formatting that follows them:
 * numbers, dates, plurals, all from the browser's Intl. Each language's
 * messages (en.tsx, fr.tsx) say things with these.
 */

export const LANGUAGES = ['en', 'fr'] as const;

export type Language = (typeof LANGUAGES)[number];

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.includes(value as Language);
}

/** Made once per language: a formatter costs more to make than to use. */
function perLanguage<T>(make: (language: Language) => T): (language: Language) => T {
  const made = new Map<Language, T>();
  return (language) => {
    let value = made.get(language);
    if (value === undefined) {
      value = make(language);
      made.set(language, value);
    }
    return value;
  };
}

const numbers = perLanguage((language) => new Intl.NumberFormat(language));
const percents = perLanguage((language) => new Intl.NumberFormat(language, { style: 'percent', maximumFractionDigits: 1 }));
const plurals = perLanguage((language) => new Intl.PluralRules(language));
const longDates = perLanguage((language) => new Intl.DateTimeFormat(language, { dateStyle: 'long' }));
const moments = perLanguage((language) => new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }));
const utcDays = perLanguage((language) => new Intl.DateTimeFormat(language, { month: 'short', day: 'numeric', timeZone: 'UTC' }));
const relativeTimes = perLanguage((language) => new Intl.RelativeTimeFormat(language, { numeric: 'auto' }));

/** "1,234,567", "1 234 567": counts can run to billions. */
export function formatNumber(language: Language, count: number): string {
  return numbers(language).format(count);
}

const decimals = perLanguage(() => new Map<number, Intl.NumberFormat>());

/** "0.33", "0,33": a number with that many decimals, as a GMJ score is shown. */
export function formatDecimal(language: Language, value: number, digits: number): string {
  const made = decimals(language);
  let format = made.get(digits);
  if (format === undefined) {
    format = new Intl.NumberFormat(language, { minimumFractionDigits: digits, maximumFractionDigits: digits });
    made.set(digits, format);
  }
  return format.format(value);
}

/** "12.5%", "12,5 %", from a share between 0 and 1. */
export function formatPercent(language: Language, share: number): string {
  return percents(language).format(share);
}

/** The singular or the plural, as the language decides: French says "0 bulletin", English "0 ballots". */
export function plural(language: Language, count: number, one: string, other: string): string {
  return plurals(language).select(count) === 'one' ? one : other;
}

/** "October 30, 2026", "30 octobre 2026". */
export function formatDate(language: Language, isoDate: string): string {
  return longDates(language).format(new Date(isoDate));
}

/** "Oct 19, 2026, 2:00 PM", "19 oct. 2026, 14:00". */
export function formatMoment(language: Language, isoDate: string): string {
  return moments(language).format(new Date(isoDate));
}

/** "Oct 19", "19 oct.": a UTC day, as the statistics count them. */
export function formatUtcDay(language: Language, day: string): string {
  return utcDays(language).format(new Date(`${day}T00:00:00Z`));
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
];

/** "3 hours ago", "yesterday", "il y a 3 heures", "hier"; null within the last minute. */
export function timeAgo(language: Language, isoDate: string, now = Date.now()): string | null {
  const seconds = (new Date(isoDate).getTime() - now) / 1000;
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) {
      return relativeTimes(language).format(Math.round(seconds / size), unit);
    }
  }
  return null;
}

/**
 * The wait until a moment, in minutes or hours, rounded up as the server
 * words it (RateLimitedException.inWords), so that trying again then works.
 */
export function waitUntil(at: number, now = Date.now()): { count: number; unit: 'minute' | 'hour' } {
  const minutes = Math.max(1, Math.ceil((at - now) / 60_000));
  return minutes < 60 ? { count: minutes, unit: 'minute' } : { count: Math.ceil(minutes / 60), unit: 'hour' };
}

/** The first of the device's languages that the web app speaks, or English. */
export function deviceLanguage(preferred: readonly string[] = navigator.languages): Language {
  for (const tag of preferred) {
    const language = tag.split('-')[0].toLowerCase();
    if (isLanguage(language)) {
      return language;
    }
  }
  return 'en';
}
