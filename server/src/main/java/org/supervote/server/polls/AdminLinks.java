package org.supervote.server.polls;

import org.springframework.stereotype.Component;
import org.supervote.server.common.VoterSecret;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.Base64;

/**
 * The token of a poll's admin link: the server's signature of the poll, under
 * its secret, as a handover's is (HandoverLinks), but for another purpose, so
 * that neither token opens what the other does.
 *
 * Signed rather than stored, so the database holds no credential, and the
 * creator can be shown it again whenever they open their poll. It cannot be
 * revoked: it lasts as long as the poll, which is deleted after its lifetime.
 */
@Component
record AdminLinks(VoterSecret secret) {

    private static final int SIGNATURE_BYTES = 16;

    String tokenOf(long pollId) {
        var signature = Arrays.copyOf(secret.sign("admin:" + pollId), SIGNATURE_BYTES);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(signature);
    }

    boolean isFor(long pollId, String token) {
        return token != null && MessageDigest.isEqual(
            tokenOf(pollId).getBytes(StandardCharsets.US_ASCII), token.getBytes(StandardCharsets.US_ASCII));
    }
}
