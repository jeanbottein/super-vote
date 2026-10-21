import { useState } from 'react';
import type { Poll } from '../api/types';
import { useI18n } from '../i18n/i18n';
import { ShareIcon } from '../ui/icons';
import { pollUrl } from './links';
import ShareDialog from './ShareDialog';

interface ShareButtonProps {
  poll: Pick<Poll, 'id' | 'title' | 'visibility' | 'joinCode'>;
  className?: string;
}

/** The link and join code of a poll anyone may vote on, to share: a poll by invitation has none. */
export default function ShareButton({ poll, className = 'button secondary' }: ShareButtonProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        <ShareIcon /> {t.share.share}
      </button>
      <ShareDialog
        open={open}
        onClose={() => setOpen(false)}
        title={t.share.title}
        hint={<>
          {t.share.anyone}
          {poll.visibility === 'UNLISTED' && ` ${t.share.unlisted}`}
        </>}
        url={pollUrl(poll.id)}
        linkLabel={t.share.linkLabel}
        subject={poll.title}
        message={t.share.message(poll.title)}
        joinCode={poll.joinCode}
      />
    </>
  );
}
