import { useRef, useState } from 'react';
import { LANGUAGES, LANGUAGE_NAMES, type Language } from '../i18n/format';
import { loadMessages, useI18n } from '../i18n/i18n';
import { usePreferences } from '../preferences/preferences';

/**
 * The language, among all of them, each named in its own words. The choice takes effect once the language's
 * messages have arrived, and the select shows it meanwhile; if the network fails first, the page stays as it
 * was. Only the last choice counts, whichever language arrives first. Labelled by `aria-label` unless a
 * visible label points at its `id`.
 */
export default function LanguageSelect({ id, className }: { id?: string; className?: string }) {
  const { language, t } = useI18n();
  const [, update] = usePreferences();
  const [pending, setPending] = useState<Language | null>(null);
  const latest = useRef<Language | null>(null);

  async function choose(chosen: Language) {
    latest.current = chosen;
    setPending(chosen);
    try {
      await loadMessages(chosen);
      if (latest.current === chosen) update({ language: chosen });
    } catch {
      // Offline: the select goes back to the language the page is in.
    } finally {
      if (latest.current === chosen) setPending(null);
    }
  }

  return (
    <select
      id={id}
      className={className}
      aria-label={id ? undefined : t.settings.language}
      aria-busy={pending !== null}
      value={pending ?? language}
      onChange={(event) => void choose(event.target.value as Language)}
    >
      {LANGUAGES.map((each) => (
        <option key={each} value={each} lang={each}>{LANGUAGE_NAMES[each]}</option>
      ))}
    </select>
  );
}
