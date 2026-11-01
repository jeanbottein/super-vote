import { LANGUAGES, LANGUAGE_NAMES, type Language } from '../i18n/format';
import { loadMessages, useI18n } from '../i18n/i18n';
import { usePreferences } from '../preferences/preferences';

/**
 * The language, among all of them, each named in its own words. The choice takes effect once the language's
 * messages have arrived; if the network fails first, the page stays as it was.
 */
export default function LanguageSelect({ id, className }: { id?: string; className?: string }) {
  const { language, t } = useI18n();
  const [, update] = usePreferences();

  async function choose(chosen: Language) {
    try {
      await loadMessages(chosen);
      update({ language: chosen });
    } catch {
      // Offline: the select snaps back to the language the page is in.
    }
  }

  return (
    <select
      id={id}
      className={className}
      aria-label={t.settings.language}
      value={language}
      onChange={(event) => void choose(event.target.value as Language)}
    >
      {LANGUAGES.map((each) => (
        <option key={each} value={each} lang={each}>{LANGUAGE_NAMES[each]}</option>
      ))}
    </select>
  );
}
