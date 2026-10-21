import { useState } from 'react';
import { useI18n } from '../i18n/i18n';

/** Copies a text, and says so for a moment. `label` names what it copies, for screen readers. */
export default function CopyButton({ text, label }: { text: string; label: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // No clipboard access (e.g. plain http): the text is on screen, to copy by hand.
    }
  }

  return (
    <button type="button" className="button secondary" aria-label={copied ? t.share.copied : label} onClick={copy}>
      {copied ? t.share.copied : t.share.copy}
    </button>
  );
}
