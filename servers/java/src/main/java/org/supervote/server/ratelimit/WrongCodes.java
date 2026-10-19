package org.supervote.server.ratelimit;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;
import java.util.stream.Stream;

/**
 * Join codes a network tried that lead to no poll. A code is short enough to
 * type, so it can be guessed, unlike a link: a network that gets
 * wrongCodesInARow of them wrong one after the other, or wrongCodesPerDay in a
 * day, is refused codes for a day.
 *
 * A right code ends a run of wrong ones, so that a room sharing one
 * connection, where a few people mistype the code on the screen, is not
 * barred; the count over the day stops a guesser who slips right codes in
 * between.
 *
 * A network's lookups run one at a time: checked, looked up and counted
 * apart, a burst of parallel guesses would all pass the check before the
 * first of them was counted.
 */
@Component
public class WrongCodes {

    private final RateLimits limits;
    private final RecentNetworks<Tries> tries = new RecentNetworks<>();
    /** Locks shared out among networks: a lookup waits for its own network's, rarely another's. */
    private final Object[] lookups = Stream.generate(Object::new).limit(256).toArray();

    WrongCodes(RateLimits limits) {
        this.limits = limits;
    }

    /**
     * What a code leads to, looked up for a network unless it is barred from
     * codes, and counted: a code leading nowhere is a wrong one.
     */
    public <T> Optional<T> lookUp(Network network, Supplier<Optional<T>> lookup) {
        synchronized (lookups[Math.floorMod(network.hashCode(), lookups.length)]) {
            check(network);
            var found = lookup.get();
            if (found.isPresent()) {
                right(network);
            } else {
                wrong(network);
            }
            return found;
        }
    }

    /** Refuses a network barred from codes. */
    synchronized void check(Network network) {
        var now = Instant.now();
        var tried = tries.get(network);
        if (tried != null && tried.barredAt(now)) {
            throw new TooManyWrongCodesException(Duration.between(now, tried.barredUntil()));
        }
    }

    synchronized void right(Network network) {
        tries.computeIfPresent(network, (key, tried) -> tried.right());
    }

    synchronized void wrong(Network network) {
        var now = Instant.now();
        var tried = tries.getOrDefault(network, Tries.none(now)).wrong(now);
        var tooMany = tried.inARow() >= limits.wrongCodesInARow()
            || tried.today().count() >= limits.wrongCodesPerDay();
        tries.put(network, tooMany ? tried.bar(now.plus(DailyCount.DAY)) : tried);
    }

    /** No address is kept longer than its limit needs it. */
    @Scheduled(fixedRate = 1, timeUnit = TimeUnit.HOURS)
    synchronized void forgetThePast() {
        var now = Instant.now();
        tries.values().removeIf(tried -> tried.isPast(now));
    }

    /** A network's wrong codes: in a row, over its day, and until when codes are refused from it. */
    record Tries(int inARow, DailyCount today, Instant barredUntil) {

        static Tries none(Instant now) {
            return new Tries(0, DailyCount.startingAt(now), Instant.MIN);
        }

        boolean barredAt(Instant now) {
            return now.isBefore(barredUntil);
        }

        Tries right() {
            return new Tries(0, today, barredUntil);
        }

        Tries wrong(Instant now) {
            return new Tries(inARow + 1, today.asOf(now).plusOne(), barredUntil);
        }

        /** The bar outlasts the day it was earned in, so the network starts afresh after it. */
        Tries bar(Instant until) {
            return new Tries(0, today, until);
        }

        /** Nothing left to hold against the network: not barred, and its day over. */
        boolean isPast(Instant now) {
            return !barredAt(now) && !now.isBefore(today.ends());
        }
    }
}
