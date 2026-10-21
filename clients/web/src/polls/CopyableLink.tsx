import { useId, useRef, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n/i18n';

/** A link in a field, selected on focus, with a button to copy it, and any other buttons beside it. */
export default function CopyableLink({ url, label, children }: { url: string; label: string; children?: ReactNode }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const inputId = useId();

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      input.current?.select(); // no clipboard access (e.g. plain http): let the person copy it
    }
  }

  return (
    <>
      <label className="visually-hidden" htmlFor={inputId}>{label}</label>
      <div className="share-link">
        <input id={inputId} ref={input} value={url} readOnly onFocus={(event) => event.target.select()} />
        <button type="button" className="button primary" onClick={copy}>{copied ? t.share.copied : t.share.copy}</button>
        {children}
      </div>
    </>
  );
}
