package org.supervote.server.api;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.UncategorizedSQLException;

import java.sql.SQLException;

import static org.assertj.core.api.Assertions.assertThat;

class ApiExceptionHandlerTest {

    final ApiExceptionHandler handler = new ApiExceptionHandler();

    final Logger log = (Logger) LoggerFactory.getLogger(ApiExceptionHandler.class);
    final ListAppender<ILoggingEvent> logged = new ListAppender<>();

    /** An unexpected failure is logged in full: here, off the console, so that a green run prints nothing. */
    @BeforeEach
    void keepTheLog() {
        logged.start();
        log.addAppender(logged);
        log.setAdditive(false);
    }

    @AfterEach
    void releaseTheLog() {
        log.detachAppender(logged);
        log.setAdditive(true);
    }

    @Test
    void aBallotThatWaitedTooLongOnPostgresqlIsToldToTryAgain() {
        var timedOut = new UncategorizedSQLException("lock", "SELECT ... FOR SHARE",
            new SQLException("canceling statement due to lock timeout", "55P03"));

        var answer = handler.collision(timedOut);

        assertThat(answer.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(answer.getHeaders().getFirst(HttpHeaders.RETRY_AFTER)).isEqualTo("1");
        assertThat(answer.getBody().getDetail()).endsWith("Please try again.");
        assertThat(answer.getBody().getType()).hasToString("/problems/collision");
    }

    @Test
    void anyOtherUncategorizedFailureIsUnexpected() {
        var failure = new UncategorizedSQLException("query", "SELECT 1", new SQLException("disk full", "53100"));

        var answer = handler.collision(failure);

        assertThat(answer.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(answer.getHeaders().getFirst(HttpHeaders.RETRY_AFTER)).isNull();
        assertThat(answer.getBody().getType()).hasToString("/problems/server-error");
        assertThat(logged.list).singleElement()
            .satisfies(event -> assertThat(event.getThrowableProxy().getClassName()).endsWith("UncategorizedSQLException"));
    }
}
