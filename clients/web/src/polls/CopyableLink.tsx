import { useId, useRef, type ReactNode } from 'react';
import { useI18n } from '../i18n/i18n';
import { useCopy } from './useCopy';

/** A link in a field, selected on focus, with a button to copy it, and any other buttons beside it. */
export default function CopyableLink({ url, label, children }: { url: string; label: string; children?: ReactNode }) {
  const { t } = useI18n();
  const { copied, copy } = useCopy();
  const input = useRef<HTMLInputElement>(null);
  const inputId = useId();

  async function copyUrl() {
    if (!await copy(url)) {
      input.current?.select(); // no clipboard access (e.g. plain http): let the person copy it
    }
  }

  return (
    <>
      <label className="visually-hidden" htmlFor={inputId}>{label}</label>
      <div className="share-link">
        <input id={inputId} ref={input} value={url} readOnly onFocus={(event) => event.target.select()} />
        <button type="button" className="button primary" onClick={copyUrl}>{copied ? t.share.copied : t.share.copy}</button>
        {children}
      </div>
    </>
  );
}
