import { Link } from 'react-router';
import { useI18n } from '../i18n/i18n';
import Notice from '../ui/Notice';

export default function NotFoundPage() {
  const { t } = useI18n();
  return (
    <Notice title={t.app.notFound} action={<Link className="button primary" to="/">{t.backHome}</Link>}>
      <p>{t.app.nothingHere}</p>
    </Notice>
  );
}
