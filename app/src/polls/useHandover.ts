import { useEffect, useState } from 'react';
import { takePollOver } from '../api/client';
import { errorMessage } from '../i18n/errorMessage';
import { useI18n } from '../i18n/i18n';
import { useToast } from '../ui/Toasts';

interface Handover {
  /** Whether the poll waits for a token being sent; it is shown once it was. */
  taking: boolean;
  /** Which arrival at the page was settled last: a new one means the poll is to be read again. */
  settled: string | null;
}

/**
 * Takes a poll over with the token from a handover link (once) or an admin
 * link (every time), before the poll is read: the page then shows it as this
 * voter's from the first render. Each arrival at the page with a token sends
 * it, `arrival` (the router's location key) telling them apart: a link opened
 * on a page already showing the poll changes only the address's fragment,
 * and the same admin link opened again must take the poll back again.
 *
 * The token is dropped from the address afterwards, whether it worked or not:
 * a spent handover would only make a reload fail, an admin token is not to
 * linger in the address bar, and a link that opens the poll should keep
 * opening it. A refused admin link says so; a spent handover does not, since
 * a reload is what spends it most often.
 */
export function useHandover(id: string, handover: string | null, admin: string | null, arrival: string): Handover {
  const { t } = useI18n();
  const showToast = useToast();
  const [settled, setSettled] = useState<string | null>(null);
  const token = handover ?? admin;

  useEffect(() => {
    if (token === null || arrival === settled) return;
    let active = true;
    takePollOver(id, handover !== null ? { handover } : { admin: token })
      .catch((error: unknown) => {
        if (active && handover === null) showToast(errorMessage(error, t), 'error');
      })
      .finally(() => {
        if (!active) return;
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        setSettled(arrival);
      });
    return () => { active = false; };
  }, [id, token, handover, arrival, settled, showToast, t]);

  return { taking: token !== null && arrival !== settled, settled };
}
