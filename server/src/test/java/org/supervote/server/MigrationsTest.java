package org.supervote.server;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.DisabledInNativeImage;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * A schema change is a new migration, applied at startup to databases that
 * already hold polls: nothing is lost on the way. Each test brings a database
 * to an earlier version, fills it, and migrates it the rest of the way.
 */
@DisabledInNativeImage // Flyway scans the classpath for migrations, which a native image does not have
class MigrationsTest {

    final DriverManagerDataSource database =
        new DriverManagerDataSource("jdbc:h2:mem:migrations-" + System.nanoTime() + ";DB_CLOSE_DELAY=-1", "sa", "");
    final JdbcClient jdbc = JdbcClient.create(database);

    @Test
    void pollsMadeBeforeTheirOptionsHadAnOrderKeepThemAsWritten() {
        migrateTo("1");
        jdbc.sql("""
                INSERT INTO poll (share_token, join_code, creator_id, title, voting_system, visibility,
                                  invitation_only, show_voter_names, results_shown, created_at, handover_open)
                VALUES ('token', 'K7M4QX', 'creator', 'Lunch?', 'APPROVAL', 'UNLISTED', FALSE, FALSE, 'LIVE',
                        CURRENT_TIMESTAMP, FALSE)
                """)
            .update();

        migrateTo("latest");

        assertThat(jdbc.sql("SELECT option_order FROM poll WHERE share_token = 'token'").query(String.class).single())
            .isEqualTo("AS_WRITTEN");
    }

    private void migrateTo(String version) {
        Flyway.configure().dataSource(database).target(version).load().migrate();
    }
}
