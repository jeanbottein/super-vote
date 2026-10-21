import { useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router';
import { closePoll, deletePoll } from '../api/client';
import type { Poll } from '../api/types';
import { errorMessage } from '../i18n/errorMessage';
import { useI18n } from '../i18n/i18n';
import Confirmation from '../ui/Confirmation';
import { useToast } from '../ui/Toasts';
import CopyableLink from './CopyableLink';
import { adminUrl } from './links';

interface OwnerActionsProps {
  poll: Poll;
  onChange(poll: Poll): void;
}

/**
 * What only the poll's creator can do: close voting, for good, and delete the
 * poll. Both ask first. It is done from one browser at a time; the admin link
 * brings the poll to another one.
 */
export default function OwnerActions({ poll, onChange }: OwnerActionsProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const showToast = useToast();
  const titleId = useId();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState<'close' | 'delete' | null>(null);
  // Shown on demand: a creator's page is often the one on a projector, for its code and results.
  const [showingAdminLink, setShowingAdminLink] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const deleteButton = useRef<HTMLButtonElement>(null);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    try {
      await action();
    } catch (error) {
      showToast(errorMessage(error, t), 'error');
    } finally {
      setBusy(false);
    }
  }

  /** Back to the button that asked, so that keyboard and screen reader users keep their place. */
  function keep() {
    const asked = confirming === 'close' ? closeButton : deleteButton;
    flushSync(() => setConfirming(null));
    asked.current?.focus();
  }

  // No toast: the page itself shows the poll closing.
  const close = () => run(async () => {
    onChange(await closePoll(poll.id));
    setConfirming(null);
  });

  const remove = () => run(async () => {
    await deletePoll(poll.id);
    showToast(t.owner.deletedToast);
    navigate('/');
  });

  return (
    <section className="panel owner-actions" aria-labelledby={titleId}>
      <h2 id={titleId}>{t.owner.manage}</h2>
      {poll.adminToken ? (
        <>
          <p className="hint">{t.owner.adminLinkHint}</p>
          {showingAdminLink
            ? <CopyableLink url={adminUrl(poll.id, poll.adminToken)} label={t.owner.adminLink} />
            : (
              <button type="button" className="button secondary admin-reveal" onClick={() => setShowingAdminLink(true)}>
                {t.owner.showAdminLink}
              </button>
            )}
        </>
      ) : <p className="hint">{t.owner.onlyThisBrowser}</p>}
      {confirming === null && (
        <div className="button-row">
          {poll.closedAt === null && (
            <button
              type="button" className="button secondary" ref={closeButton} disabled={busy}
              onClick={() => setConfirming('close')}
            >
              {t.owner.close}
            </button>
          )}
          <button
            type="button" className="button danger" ref={deleteButton} disabled={busy}
            onClick={() => setConfirming('delete')}
          >
            {t.owner.delete}
          </button>
        </div>
      )}
      {confirming === 'close' && (
        <Confirmation
          id={`${titleId}-confirm`}
          question={t.owner.closeQuestion}
          busy={busy}
          keep={t.owner.keepOpen}
          confirm={t.owner.closeForGood}
          tone="primary"
          onKeep={keep}
          onConfirm={close}
        />
      )}
      {confirming === 'delete' && (
        <Confirmation
          id={`${titleId}-confirm`}
          question={t.owner.deleteQuestion}
          busy={busy}
          keep={t.owner.keep}
          confirm={t.owner.deleteForGood}
          tone="danger"
          onKeep={keep}
          onConfirm={remove}
        />
      )}
    </section>
  );
}
