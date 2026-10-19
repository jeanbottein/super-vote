package org.supervote.server.identity;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.supervote.server.common.VoterSecret;
import org.supervote.server.statistics.Activity;
import org.supervote.server.statistics.StatisticsService;

import java.io.IOException;
import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;

/**
 * Resolves the caller on every API request, issuing a voter token to
 * newcomers, so that handlers simply declare
 * {@code @RequestAttribute(VoterIdentity.ATTRIBUTE) Voter voter}.
 *
 * A browser is known by its cookie, which is SameSite=Lax: browsers do not
 * send it on cross-site POST, PUT, PATCH or DELETE requests, and the server
 * enables no CORS, so another site cannot act as a voter (no CSRF token
 * needed). Every other client - an agent, a script, a packaged app - sends the
 * same token as {@code Authorization: Bearer}, which beats the cookie and
 * takes no cookie back.
 *
 * Before anything, a request another website's page made is refused, as its
 * browser tells (Fetch Metadata, Sec-Fetch-Site: cross-site): without a
 * cookie it would still try join codes from its visitor's network, which a
 * few wrong ones bar for a day, and hand each visitor an identity, counted in
 * the statistics. Following a link (a GET navigation) is let through, and so
 * is every client that is not a browser, which sends no such header.
 *
 * POST /api/voters mints identities, so it is given none.
 */
@Component
public class VoterIdentityFilter extends OncePerRequestFilter {

    private static final Duration COOKIE_LIFETIME = Duration.ofDays(365);
    private static final String BEARER = "Bearer ";
    private static final String MINTING = "/api/voters";

    private final VoterSecret secret;
    private final StatisticsService statistics;
    private final HandlerExceptionResolver resolver;

    public VoterIdentityFilter(VoterSecret secret, StatisticsService statistics,
                               @Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver) {
        this.secret = secret;
        this.statistics = statistics;
        this.resolver = resolver;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith("/api/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {
        try {
            refuseOtherSites(request);
            if (!request.getRequestURI().equals(MINTING)) {
                request.setAttribute(VoterIdentity.ATTRIBUTE, new Voter(tokenOf(request, response), secret));
            }
        } catch (CrossSiteRequestException | UnknownVoterException e) {
            // A filter throws outside the dispatcher, where @RestControllerAdvice
            // cannot see it: hand it to the same resolver so one place shapes every error.
            resolver.resolveException(request, response, null, e);
            return;
        }
        chain.doFilter(request, response);
    }

    private static void refuseOtherSites(HttpServletRequest request) {
        var followingALink = "navigate".equals(request.getHeader("Sec-Fetch-Mode"))
            && "GET".equals(request.getMethod());
        if ("cross-site".equals(request.getHeader("Sec-Fetch-Site")) && !followingALink) {
            throw new CrossSiteRequestException();
        }
    }

    private String tokenOf(HttpServletRequest request, HttpServletResponse response) {
        var authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authorization != null) {
            return bearerOf(authorization);
        }
        return cookieOf(request).orElseGet(() -> issue(request, response));
    }

    private static String bearerOf(String authorization) {
        var token = authorization.regionMatches(true, 0, BEARER, 0, BEARER.length())
            ? authorization.substring(BEARER.length()).trim()
            : "";
        if (!VoterIdentity.TOKEN.matcher(token).matches()) {
            throw new UnknownVoterException("This voter token is not one this server issued. "
                + "Ask for one at POST /api/voters, and send it as \"Authorization: Bearer <token>\".");
        }
        return token;
    }

    private static Optional<String> cookieOf(HttpServletRequest request) {
        var cookies = request.getCookies();
        if (cookies == null) {
            return Optional.empty();
        }
        return Arrays.stream(cookies)
            .filter(cookie -> VoterIdentity.COOKIE.equals(cookie.getName()))
            .map(Cookie::getValue)
            .filter(VoterIdentity.TOKEN.asMatchPredicate())
            .findFirst();
    }

    /** First visit, or a cookie we did not issue: start a fresh identity. */
    private String issue(HttpServletRequest request, HttpServletResponse response) {
        var token = VoterIdentity.newToken();
        statistics.count(Activity.VOTER);
        response.addHeader(HttpHeaders.SET_COOKIE, ResponseCookie.from(VoterIdentity.COOKIE, token)
            .httpOnly(true)
            .secure(request.isSecure())
            .sameSite("Lax")
            .path("/")
            .maxAge(COOKIE_LIFETIME)
            .build()
            .toString());
        return token;
    }
}
