package org.supervote.server.identity;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * The Android app's pages run on https://localhost (super-vote.app-origins),
 * so every request they make is cross-site to the server: let through, and
 * answered with CORS, without credentials. Any other site stays refused.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AppOriginApiTest {

    static final String APP = "https://localhost";
    static final String OTHER_SITE = "https://evil.example";

    @Autowired
    MockMvcTester mvc;

    @Test
    void answersTheAppsPreflightWithoutAnIdentity() {
        var result = preflight(APP, "PUT", "authorization, content-type, super-vote-time-zone, super-vote-client");

        assertThat(result).hasStatus(HttpStatus.OK);
        assertThat(result).hasHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, APP);
        assertThat(result.getResponse().getHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS))
            .containsIgnoringCase("authorization").containsIgnoringCase("super-vote-client");
        assertThat(result).doesNotContainHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS);
        assertThat(result).doesNotContainHeader(HttpHeaders.SET_COOKIE);
    }

    @Test
    void refusesAnotherSitesPreflight() {
        var result = preflight(OTHER_SITE, "PUT", "authorization");

        assertThat(result).hasStatus(HttpStatus.FORBIDDEN);
        assertThat(result).doesNotContainHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN);
    }

    @Test
    void letsTheAppActWithItsBearerToken() {
        var token = JsonPath.<String>read(body(fromTheApp(mvc.post().uri("/api/voters")).exchange()), "$.token");

        var result = fromTheApp(mvc.post().uri("/api/polls"))
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"title": "Lunch?", "votingSystem": "APPROVAL", "visibility": "UNLISTED",
                 "options": ["Ramen", "Tacos"]}
                """)
            .exchange();

        assertThat(result).hasStatus(HttpStatus.CREATED);
        assertThat(result).hasHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, APP);
        assertThat(result.getResponse().getHeader(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS))
            .contains("RateLimit", "RateLimit-Policy", "Retry-After");
        assertThat(result).doesNotContainHeader(HttpHeaders.SET_COOKIE);
    }

    @Test
    void stillRefusesAnotherSitesPage() {
        var result = mvc.get().uri("/api/polls/mine")
            .header(HttpHeaders.ORIGIN, OTHER_SITE)
            .header("Sec-Fetch-Site", "cross-site").header("Sec-Fetch-Mode", "cors")
            .exchange();

        assertThat(result).hasStatus(HttpStatus.FORBIDDEN);
        assertThat(result).bodyJson().extractingPath("$.type").isEqualTo("/problems/cross-site");
    }

    // --- helpers --------------------------------------------------------------

    MvcTestResult preflight(String origin, String method, String headers) {
        return mvc.options().uri("/api/polls/x/ballot")
            .header(HttpHeaders.ORIGIN, origin)
            .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, method)
            .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, headers)
            .header("Sec-Fetch-Site", "cross-site").header("Sec-Fetch-Mode", "cors")
            .exchange();
    }

    static MockMvcTester.MockMvcRequestBuilder fromTheApp(MockMvcTester.MockMvcRequestBuilder request) {
        return request.header(HttpHeaders.ORIGIN, APP)
            .header("Sec-Fetch-Site", "cross-site").header("Sec-Fetch-Mode", "cors");
    }

    static String body(MvcTestResult result) {
        return VoterIdentityApiTest.body(result);
    }
}
