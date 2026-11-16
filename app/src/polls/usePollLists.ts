import { useEffect, useState } from 'react';
import { listMyPolls, listPublicPolls } from '../api/client';
import type { PollSummary } from '../api/types';

interface PollLists {
  /** The polls this voter created. */
  mine: PollSummary[];
  /** Other people's public polls. */
  others: PollSummary[];
}

/** The lists, or why they could not be read (failure: null until something failed). */
export function usePollLists(withPublic: boolean) {
  const [lists, setLists] = useState<PollLists | null>(null);
  const [failure, setFailure] = useState<unknown>(null);

  useEffect(() => {
    let active = true;
    Promise.all([listMyPolls(), withPublic ? listPublicPolls() : []]).then(
      ([mine, listed]) => {
        if (active) {
          setLists({ mine, others: listed.filter((poll) => !poll.isMine) });
        }
      },
      (reason: unknown) => {
        if (active) {
          setFailure(reason ?? new Error('The polls could not be read'));
        }
      },
    );
    return () => {
      active = false;
    };
  }, [withPublic]);

  return { lists, failure };
}
