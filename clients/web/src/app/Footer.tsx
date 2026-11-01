import { Link } from 'react-router';
import { useI18n } from '../i18n/i18n';
import { GlobeIcon } from '../ui/icons';
import { SOURCE_CODE_URL } from './AboutPage';
import LanguageSelect from './LanguageSelect';

/** What super-vote is, where to read more, and the language it speaks, among all of them, each in its own words. */
export default function Footer() {
  const { t } = useI18n();

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
        <span className="footer-language">
          <GlobeIcon />
          <LanguageSelect />
        </span>
      </nav>
    </footer>
  );
}
