package org.supervote.server.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.supervote.server.api.PollHandoverTest.body;
import static org.supervote.server.api.PollHandoverTest.idOf;
import static org.supervote.server.api.PollHandoverTest.voter;

/** A poll's link as a messaging app shows it: the question, the options, a small icon. */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LinkPreviewTest {

    @Autowired
    MockMvcTester mvc;

    @Test
    void showsTheQuestionAndItsOptions() {
        var poll = create("Where & when?", "\"Lisbon\"", "<Berlin>");

        var result = mvc.get().uri("/p/" + poll).exchange();

        assertThat(result).hasStatus(HttpStatus.OK);
        assertThat(result).hasContentTypeCompatibleWith(MediaType.TEXT_HTML);
        assertThat(result).doesNotContainHeader(HttpHeaders.SET_COOKIE);
        assertThat(body(result))
            .contains("<meta property=\"og:title\" content=\"Where &amp; when?\">")
            .contains("<meta property=\"og:description\" content=\"&quot;Lisbon&quot; · &lt;Berlin&gt;\">")
            .contains("<meta property=\"og:url\" content=\"https://super-vote.test/p/" + poll + "\">")
            .contains("<meta property=\"og:image\" content=\"https://super-vote.test/apple-touch-icon.png\">")
            .contains("<meta name=\"twitter:card\" content=\"summary\">")
            .contains("<meta name=\"robots\" content=\"noindex\">");
    }

    @Test
    void cutsALongListOfOptions() {
        var options = IntStream.rangeClosed(1, 15).mapToObj(n -> "A rather long option, number " + n)
            .toArray(String[]::new);

        var description = body(mvc.get().uri("/p/" + create("Which one?", options)).exchange())
            .lines().filter(line -> line.contains("og:description")).findFirst().orElseThrow();

        assertThat(description).contains("A rather long option, number 1 · ").endsWith("…\">")
            .hasSizeLessThan(LinkPreviewController.DESCRIPTION_LENGTH + 60);
    }

    @Test
    void namesOnlySuperVoteForAPollThatIsGone() {
        var result = mvc.get().uri("/p/nothing-here").exchange();

        assertThat(result).hasStatus(HttpStatus.NOT_FOUND);
        assertThat(body(result)).contains("<meta property=\"og:title\" content=\"super-vote\">")
            .doesNotContain("og:description");
    }

    @Test
    void isNoPartOfTheApi() {
        assertThat(body(mvc.get().uri("/v3/api-docs").exchange())).doesNotContain("\"/p/{shareToken}\"");
    }

    private String create(String title, String... options) {
        var quoted = Arrays.stream(options)
            .map(option -> "\"" + option.replace("\"", "\\\"") + "\"").collect(Collectors.joining(", "));
        var result = mvc.post().uri("/api/polls").cookie(voter()).contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"title": "%s", "votingSystem": "MAJORITY_JUDGMENT", "visibility": "UNLISTED", "options": [%s]}
                """.formatted(title, quoted))
            .exchange();
        assertThat(result).hasStatus(HttpStatus.CREATED);
        return idOf(result);
    }
}
