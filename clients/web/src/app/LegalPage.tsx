import { useI18n } from '../i18n/i18n';
import { Section } from './AboutPage';

/**
 * The legal notice: who publishes super-vote, under which law, who hosts it,
 * and where to report unlawful content. The publisher is a private person in
 * Québec, named to the host only (docs/ROADMAP.md, "Legal pages").
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

      <Section title={t.legal.law}>
        <p>{t.legal.lawText}</p>
      </Section>

      <Section title={t.legal.host}>
        <address className="postal">
          {t.legal.hostAddress.map((line) => <span key={line}>{line}</span>)}
          <span>{t.legal.hostPhone(<a href="tel:+18556845463">+1 855 684 5463</a>)}</span>
        </address>
      </Section>

      <Section title={t.legal.report}>
        <p>{t.legal.reportText}</p>
      </Section>
    </>
  );
}
