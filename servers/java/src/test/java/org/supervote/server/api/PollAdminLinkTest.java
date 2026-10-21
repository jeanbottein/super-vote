package org.supervote.server.api;

import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.supervote.server.api.PollHandoverTest.body;
import static org.supervote.server.api.PollHandoverTest.idOf;
import static org.supervote.server.api.PollHandoverTest.request;
import static org.supervote.server.api.PollHandoverTest.voter;

/** A poll's admin link: its creator manages it from any browser, the link bringing it there. */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PollAdminLinkTest {

    @Autowired
    MockMvcTester mvc;

    final Cookie laptop = voter();
    final Cookie phone = voter();
    final Cookie stranger = voter();

    @Test
    void onlyTheCreatorIsToldTheToken() {
        var created = createPoll(laptop, false);
        var poll = idOf(created);

        assertThat(created).bodyJson().extractingPath("$.adminToken").asString().isNotBlank();
        assertThat(read(laptop, poll)).bodyJson().extractingPath("$.adminToken")
            .isEqualTo(JsonPath.read(body(created), "$.adminToken"));
        assertThat(read(stranger, poll)).bodyJson().extractingPath("$.adminToken").isNull();
    }

    @Test
    void whoeverBringsItBecomesTheCreatorInPlaceOfTheOneBefore() {
        var created = createPoll(laptop, false);
        var poll = idOf(created);

        var taken = administer(phone, poll, JsonPath.read(body(created), "$.adminToken"));

        assertThat(taken).hasStatus(HttpStatus.OK);
        assertThat(taken).bodyJson().extractingPath("$.isMine").isEqualTo(true);
        assertThat(read(laptop, poll)).bodyJson().extractingPath("$.isMine").isEqualTo(false);
        assertThat(close(laptop, poll)).hasStatus(HttpStatus.FORBIDDEN);
        assertThat(close(phone, poll)).hasStatus(HttpStatus.OK);
    }

    /** Unlike a handover, the link works every time: it brings the poll back. */
    @Test
    void itWorksAsOftenAsItIsBrought() {
        var created = createPoll(laptop, false);
        var poll = idOf(created);
        var token = JsonPath.<String>read(body(created), "$.adminToken");
        administer(phone, poll, token);

        assertThat(administer(laptop, poll, token)).hasStatus(HttpStatus.OK);
        assertThat(administer(laptop, poll, token)).hasStatus(HttpStatus.OK);
        assertThat(read(laptop, poll)).bodyJson().extractingPath("$.isMine").isEqualTo(true);
        assertThat(read(phone, poll)).bodyJson().extractingPath("$.isMine").isEqualTo(false);
    }

    @Test
    void anotherPollsTokenOpensNothing() {
        var mine = createPoll(laptop, false);
        var other = idOf(createPoll(laptop, false));

        var crossed = administer(stranger, other, JsonPath.read(body(mine), "$.adminToken"));

        assertThat(crossed).hasStatus(HttpStatus.FORBIDDEN);
        assertThat(crossed).bodyJson().extractingPath("$.type").isEqualTo("/problems/not-admin-link");
        assertThat(read(laptop, other)).bodyJson().extractingPath("$.isMine").isEqualTo(true);
    }

    /** A client creating a poll for somebody else never holds a link that outlives the handover. */
    @Test
    void thereIsNoneWhileAHandoverIsOpen() {
        var created = createPoll(laptop, true);
        var poll = idOf(created);

        assertThat(created).bodyJson().extractingPath("$.adminToken").isNull();
        assertThat(read(laptop, poll)).bodyJson().extractingPath("$.adminToken").isNull();

        mvc.post().uri("/api/polls/" + poll + "/creator").cookie(phone)
            .header(PollController.HANDOVER, JsonPath.<String>read(body(created), "$.handover")).exchange();
        assertThat(read(phone, poll)).bodyJson().extractingPath("$.adminToken").asString().isNotBlank();
    }

    @Test
    void aHandoverTokenIsNoAdminToken() {
        var created = createPoll(laptop, true);

        assertThat(administer(stranger, idOf(created), JsonPath.read(body(created), "$.handover")))
            .hasStatus(HttpStatus.FORBIDDEN);
    }

    @Test
    void oneTokenAtATime() {
        var poll = idOf(createPoll(laptop, false));

        assertThat(mvc.post().uri("/api/polls/" + poll + "/creator").cookie(phone).exchange())
            .hasStatus(HttpStatus.BAD_REQUEST);
        assertThat(mvc.post().uri("/api/polls/" + poll + "/creator").cookie(phone)
            .header(PollController.HANDOVER, "a").header(PollController.ADMIN, "b").exchange())
            .hasStatus(HttpStatus.BAD_REQUEST);
    }

    // --- helpers --------------------------------------------------------------

    MvcTestResult createPoll(Cookie creator, boolean handover) {
        var result = mvc.post().uri("/api/polls").cookie(creator)
            .contentType(MediaType.APPLICATION_JSON).content(request(handover)).exchange();
        assertThat(result).hasStatus(HttpStatus.CREATED);
        return result;
    }

    MvcTestResult read(Cookie voter, String poll) {
        return mvc.get().uri("/api/polls/" + poll).cookie(voter).exchange();
    }

    MvcTestResult administer(Cookie taker, String poll, String token) {
        return mvc.post().uri("/api/polls/" + poll + "/creator").cookie(taker)
            .header(PollController.ADMIN, token).exchange();
    }

    MvcTestResult close(Cookie voter, String poll) {
        return mvc.patch().uri("/api/polls/" + poll).cookie(voter)
            .contentType(MediaType.APPLICATION_JSON).content("{\"closed\": true}").exchange();
    }
}
