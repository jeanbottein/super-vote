import { useI18n } from '../i18n/i18n';
import { Section } from './AboutPage';

/**
 * The legal notice French law asks of a website (mentions légales): who
 * publishes it, who hosts it, and where to report unlawful content. A private
 * person may name the host only, having given the host their identity
 * (docs/ROADMAP.md, "Legal pages").
 */
export default function LegalPage() {
  const { t } = useI18n();
  return (
    <>
      <title>{t.legal.title}</title>
      <section className="hero">
        <h1>{t.legal.heading}</h1>
      </section>

      <Section title={t.legal.publisher}>
        <p>{t.legal.publisherText}</p>
      </Section>

      <Section title={t.legal.host}>
        <p>{t.legal.hostText}</p>
      </Section>

      <Section title={t.legal.report}>
        <p>{t.legal.reportText}</p>
      </Section>
    </>
  );
}
