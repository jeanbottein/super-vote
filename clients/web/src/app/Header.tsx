import { Link, useLocation } from 'react-router';
import { useI18n } from '../i18n/i18n';
import { BackIcon } from '../ui/icons';
import Logo from '../ui/Logo';
import SettingsMenu from './SettingsMenu';

export default function Header() {
  const { t } = useI18n();
  const atHome = useLocation().pathname === '/';

  return (
    <header className="app-header">
      <div className="app-header-inner">
        {atHome ? (
          <span className="icon-button-placeholder" />
        ) : (
          <Link to="/" className="icon-button" aria-label={t.app.home}>
            <BackIcon />
          </Link>
        )}
        <Link to="/" className="brand"><Logo />super-vote</Link>
        <SettingsMenu />
      </div>
    </header>
  );
}
