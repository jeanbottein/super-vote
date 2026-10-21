import { useRef, useState } from 'react';
import { useI18n } from '../i18n/i18n';

/**
 * Creating a poll through an AI agent: a prompt to copy into one, naming this
 * site and the guide it writes for agents (/llms.txt). The agent creates the
 * poll for whoever asked, and hands it over to them with a link that makes
 * them its creator (docs/API.md, "Creating a poll for somebody else").
 */
export default function AgentPrompt() {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const quote = useRef<HTMLQuoteElement>(null);
  const prompt = t.home.agent.prompt(window.location.host, `${window.location.origin}/llms.txt`);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // No clipboard access (e.g. plain http): select it, for the person to copy.
      if (quote.current) window.getSelection()?.selectAllChildren(quote.current);
    }
  }

  return (
    <section className="home-section beside">
      <div>
        <h2>{t.home.agent.title}</h2>
        <p>{t.home.agent.text}</p>
      </div>
      <figure className="panel agent-prompt">
        <blockquote ref={quote}>
          <p>{prompt}</p>
        </blockquote>
        <button type="button" className="button secondary" onClick={copy}>
          {/* Both labels hold the button's width: it does not shrink under the finger once copied. */}
          <span className="copy-labels">
            <span aria-hidden={copied}>{t.home.agent.copy}</span>
            <span aria-hidden={!copied}>{t.home.agent.copied}</span>
          </span>
        </button>
        <figcaption className="hint">{t.home.agent.caption}</figcaption>
      </figure>
    </section>
  );
}
