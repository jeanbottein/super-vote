package org.supervote.server.polls;

import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.relational.core.sql.LockMode;
import org.springframework.data.relational.repository.Lock;
import org.springframework.data.repository.ListCrudRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

interface PollRepository extends ListCrudRepository<Poll, Long> {

    Optional<Poll> findByShareToken(String shareToken);

    /**
     * The same, holding a shared lock on the poll until the transaction ends
     * (FOR SHARE on PostgreSQL; H2 only has FOR UPDATE): ballots do not wait
     * for each other, but closing or deleting the poll waits for them.
     */
    @Lock(LockMode.PESSIMISTIC_READ)
    Optional<Poll> findLockedByShareToken(String shareToken);

    Optional<Poll> findByJoinCode(String joinCode);

    boolean existsByJoinCode(String joinCode);

    @Query("SELECT id FROM poll WHERE created_at < :cutoff")
    List<Long> findIdsCreatedBefore(Instant cutoff);

    /** One statement: what they have a few of goes with them (ON DELETE CASCADE), their ballots and the like later. */
    @Modifying
    @Query("DELETE FROM poll WHERE created_at < :cutoff")
    void deleteCreatedBefore(Instant cutoff);

    @Modifying
    @Query("INSERT INTO poll_removal (poll_id) VALUES (:pollId)")
    void scheduleRemoval(Long pollId);

    @Modifying
    @Query("INSERT INTO poll_removal (poll_id) SELECT id FROM poll WHERE created_at < :cutoff")
    void scheduleRemovalsCreatedBefore(Instant cutoff);

    @Query("SELECT poll_id FROM poll_removal")
    List<Long> findRemovals();

    @Modifying
    @Query("DELETE FROM poll_removal WHERE poll_id = :pollId")
    void removalDone(Long pollId);

    /*
     * Changes to one poll that may come at the same moment as another, each
     * writing only its own columns: saving the whole row read a moment before
     * would undo the other one - reopen a poll just closed, or give a poll
     * back to the browser that just lost it.
     */

    /** Closes the poll if it is still its creator's and open: how many rows changed, 0 or 1. */
    @Modifying
    @Query("UPDATE poll SET closed_at = :closedAt WHERE id = :id AND creator_id = :creatorId AND closed_at IS NULL")
    int close(Long id, String creatorId, Instant closedAt);

    /** Hands the poll over if its handover is still open, and closes the handover: 0 or 1. */
    @Modifying
    @Query("UPDATE poll SET creator_id = :creatorId, handover_open = FALSE WHERE id = :id AND handover_open = TRUE")
    int handOver(Long id, String creatorId);

    /** Gives the poll a new creator, unless a handover is open: 0 or 1. */
    @Modifying
    @Query("UPDATE poll SET creator_id = :creatorId WHERE id = :id AND handover_open = FALSE")
    int setCreator(Long id, String creatorId);

    long countByClosedAtIsNull();

    List<Poll> findTop50ByVisibilityOrderByCreatedAtDesc(Poll.Visibility visibility);

    List<Poll> findTop100ByCreatorIdOrderByCreatedAtDesc(String creatorId);
}
