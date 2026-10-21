import { useI18n } from '../i18n/i18n';
import { useCopy } from './useCopy';

/** Copies a text, and says so for a moment. `label` names what it copies, for screen readers. */
export default function CopyButton({ text, label }: { text: string; label: string }) {
  const { t } = useI18n();
  const { copied, copy } = useCopy();

  // Without clipboard access, the text is on screen, to copy by hand.
  return (
    <button type="button" className="button secondary" aria-label={copied ? t.share.copied : label} onClick={() => copy(text)}>
      {copied ? t.share.copied : t.share.copy}
    </button>
  );
}
