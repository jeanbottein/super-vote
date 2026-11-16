package org.supervote.server.common;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalArgumentException;

class SuperVotePropertiesTest {

    @Test
    void aLifetimeLeftOutStopsTheServerRatherThanDeletingEveryPoll() {
        assertThatIllegalArgumentException()
            .isThrownBy(() -> new SuperVoteProperties.Limits(20, 200, 100, 40, 1000, 0))
            .withMessageContaining("poll-lifetime-days");
    }

    @Test
    void aNameLongerThanItsColumnIsRefused() {
        assertThatIllegalArgumentException()
            .isThrownBy(() -> new SuperVoteProperties.Limits(20, 200, 100, 101, 1000, 30))
            .withMessageContaining("max-voter-name-length");
    }

    /** CORS compares origins as strings: one with a slash or a path would never match a page's. */
    @ParameterizedTest
    @ValueSource(strings = {"https://localhost/", "https://localhost/app", "localhost", "https://", "HTTPS://localhost"})
    void anAppOriginIsASchemeAndAHostOnly(String origin) {
        assertThatIllegalArgumentException()
            .isThrownBy(() -> new SuperVoteProperties(null, null, null, List.of(origin)))
            .withMessageContaining("app-origins");
    }

    @Test
    void noAppOriginsWhenLeftOut() {
        assertThat(new SuperVoteProperties(null, null, null, null).appOrigins()).isEmpty();
    }
}
