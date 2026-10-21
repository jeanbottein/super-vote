import { Link } from 'react-router';
import { LANGUAGES } from '../i18n/format';
import { MESSAGES, useI18n } from '../i18n/i18n';
import { usePreferences } from '../preferences/preferences';
import { SOURCE_CODE_URL } from './AboutPage';

/** What super-vote is, where to read more, and the other languages it speaks, each in its own words. */
export default function Footer() {
  const { language, t } = useI18n();
  const [, update] = usePreferences();

  return (
    <footer className="app-footer">
      <p>
        {t.app.footer}
        {' '}<span className="app-version">{__SUPER_VOTE_VERSION__}</span>
      </p>
      <nav aria-label={t.app.footerLinks}>
        <Link to="/about">{t.app.about}</Link>
        <Link to="/privacy">{t.app.privacy}</Link>
        <Link to="/legal">{t.app.legal}</Link>
        <Link to="/statistics">{t.app.statistics}</Link>
        <a href={SOURCE_CODE_URL} target="_blank" rel="noreferrer">{t.app.sourceCode}</a>
        {LANGUAGES.filter((other) => other !== language).map((other) => (
          <button key={other} type="button" lang={other} onClick={() => update({ language: other })}>
            {MESSAGES[other].name}
          </button>
        ))}
      </nav>
    </footer>
  );
}
