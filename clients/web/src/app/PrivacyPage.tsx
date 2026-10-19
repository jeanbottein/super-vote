import { useI18n } from '../i18n/i18n';
import { useServerInfo } from '../polls/useServerInfo';
import { Section } from './AboutPage';

/**
 * What super-vote keeps, who sees what, and what it cannot do yet: said
 * plainly, so that people can trust it for what it does, and know what not to
 * use it for. docs/SECURITY.md says the same for whoever runs or reviews it.
 */
export default function PrivacyPage() {
  const { t } = useI18n();
  const { limits } = useServerInfo();
  return (
    <>
      <title>{t.privacy.title}</title>
      <section className="hero">
        <h1>{t.privacy.heading}</h1>
        <p>{t.privacy.lead}</p>
      </section>

      <Section title={t.privacy.forWhat}>
        <p>{t.privacy.forWhatText}</p>
      </Section>

      <Section title={t.privacy.kept}>
        <List items={t.privacy.keptItems(limits.pollLifetimeDays)} />
      </Section>

      <Section title={t.privacy.whoSees}>
        <List items={t.privacy.whoSeesItems} />
      </Section>

      <Section title={t.privacy.limits}>
        <List items={t.privacy.limitsItems} />
      </Section>

      <Section title={t.privacy.rights}>
        <p>{t.privacy.rightsText}</p>
        <p>{t.privacy.contact}</p>
        <p>{t.privacy.openSource}</p>
      </Section>
    </>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="facts">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}
