package org.supervote.server.identity;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.filter.CorsFilter;
import org.supervote.server.common.SuperVoteProperties;

import java.time.Duration;
import java.util.List;

/**
 * The packaged apps' pages (super-vote.app-origins) call the API from an
 * origin of their own, so the API answers them with CORS, and nobody else:
 * another site's request finds no CORS here, and VoterIdentityFilter refuses it.
 *
 * Without credentials: a browser then never sends the voter cookie along, and
 * the app proves who it is with its bearer token, which no page can make a
 * browser add on its own. That is what makes letting these origins through
 * safe, whoever else serves a page from one (a local development server holds
 * https://localhost too): such a page can do no more than any script.
 *
 * A servlet filter, ahead of VoterIdentityFilter, rather than Spring MVC's CORS:
 * what that filter refuses (a bearer token it did not issue) must reach the
 * app readable, or the app would take a 401 for a lost network. It answers the
 * app's preflights itself, so they never get an identity.
 */
@Configuration(proxyBeanMethods = false)
class AppOrigins {

    /** What the web app reads from an answer, beyond what CORS always shows. */
    private static final List<String> READ_HEADERS = List.of("RateLimit", "RateLimit-Policy", HttpHeaders.RETRY_AFTER);

    @Bean
    FilterRegistrationBean<CorsFilter> appOriginsCors(SuperVoteProperties settings) {
        var origins = settings.appOrigins();
        var cors = corsFor(origins);
        // Out of the way of everything else: CorsFilter would end any preflight itself, another site's included.
        var filter = new CorsFilter(request -> cors) {
            @Override
            protected boolean shouldNotFilter(HttpServletRequest request) {
                return !fromAnApp(request, origins);
            }
        };
        var registration = new FilterRegistrationBean<CorsFilter>(filter);
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 1); // before VoterIdentityFilter, which has no order
        return registration;
    }

    private static CorsConfiguration corsFor(List<String> origins) {
        var cors = new CorsConfiguration();
        cors.setAllowedOrigins(origins);
        cors.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE"));
        cors.addAllowedHeader(CorsConfiguration.ALL);
        cors.setExposedHeaders(READ_HEADERS);
        cors.setAllowCredentials(false);
        cors.setMaxAge(Duration.ofDays(1));
        return cors;
    }

    private static boolean fromAnApp(HttpServletRequest request, List<String> origins) {
        var origin = request.getHeader(HttpHeaders.ORIGIN);
        // Checked for null first: an immutable list throws on contains(null).
        return origin != null && origins.contains(origin) && request.getRequestURI().startsWith("/api/");
    }
}
