package org.supervote.server.identity;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.supervote.server.common.SuperVoteProperties;

import java.time.Duration;
import java.util.List;

/**
 * The packaged apps' pages (super-vote.app-origins) call the API from an
 * origin of their own, so the API answers them with CORS, and nobody else.
 *
 * Without credentials: a browser then never sends the voter cookie along, and
 * the app proves who it is with its bearer token, which no page can make a
 * browser add on its own. That is what makes letting these origins through
 * safe, whoever else serves a page from one (a local development server holds
 * https://localhost too): such a page can do no more than any script.
 */
@Configuration(proxyBeanMethods = false)
class AppOrigins implements WebMvcConfigurer {

    /** What the web app reads from an answer, beyond what CORS always shows. */
    private static final String[] READ_HEADERS = {"RateLimit", "RateLimit-Policy", HttpHeaders.RETRY_AFTER};

    private final List<String> origins;

    AppOrigins(SuperVoteProperties settings) {
        this.origins = settings.appOrigins();
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        if (origins.isEmpty()) {
            return;
        }
        registry.addMapping("/api/**")
            .allowedOrigins(origins.toArray(String[]::new))
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE")
            .allowedHeaders("*")
            .exposedHeaders(READ_HEADERS)
            .allowCredentials(false)
            .maxAge(Duration.ofDays(1).toSeconds());
    }
}
