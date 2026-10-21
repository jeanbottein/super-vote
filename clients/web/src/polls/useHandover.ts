import { useEffect, useState } from 'react';
import { takePollOver } from '../api/client';

interface Handover {
  /** Whether the poll waits for a token being sent; it is shown once it was. */
  taking: boolean;
  /** The last token sent: a new one means the poll is to be read again. */
  settled: string | null;
}

/**
 * Takes a poll over with the token from a handover link (once) or an admin
 * link (every time), before the poll is read: the page then shows it as this
 * voter's from the first render. A link opened on a page already showing the
 * poll changes only the address's fragment: the poll is read again once the
 * token is sent.
 *
 * The token is dropped from the address afterwards, whether it worked or not:
 * a spent handover would only make a reload fail, an admin token is not to
 * linger in the address bar, and a link that opens the poll should keep
 * opening it.
 */
export function useHandover(id: string, handover: string | null, admin: string | null): Handover {
  const token = handover ?? admin;
  const [settled, setSettled] = useState<string | null>(null);

  useEffect(() => {
    if (token === null || token === settled) return;
    let active = true;
    // Whether it is taken or refused, the poll is read the same way next.
    takePollOver(id, handover !== null ? { handover } : { admin: token }).catch(() => {}).finally(() => {
      if (!active) return;
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setSettled(token);
    });
    return () => { active = false; };
  }, [id, token, handover, settled]);

  return { taking: token !== null && token !== settled, settled };
}
