package org.supervote.server.api;

import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;
import org.supervote.server.common.SuperVoteProperties;
import org.supervote.server.polls.PollNotFoundException;
import org.supervote.server.polls.PollOption;
import org.supervote.server.polls.PollService;

import java.util.Objects;
import java.util.stream.Collectors;

/**
 * A poll's link as the apps it is shared in show it (Messenger, WhatsApp,
 * Slack...): its question, its options and a small icon, written as Open
 * Graph tags. Their robots read a page without running it, and the web app's
 * page is JavaScript, so Caddy sends them here instead (deploy/Caddyfile);
 * people get the web app.
 *
 * Only what the link already opens to anyone holding it: never a count, nor
 * who is ahead. Not part of the API, so not in its OpenAPI document.
 */
@Hidden
@RestController
class LinkPreviewController {

    /** In characters: the apps show two or three lines of it. */
    static final int DESCRIPTION_LENGTH = 200;

    private final PollService polls;
    private final String base;

    LinkPreviewController(PollService polls, SuperVoteProperties settings) {
        this.polls = polls;
        this.base = Objects.requireNonNullElse(settings.publicUrl(), "");
    }

    @GetMapping(value = "/p/{shareToken}", produces = MediaType.TEXT_HTML_VALUE)
    ResponseEntity<String> preview(@PathVariable String shareToken) {
        try {
            var poll = polls.find(shareToken);
            var options = polls.optionsOf(poll).stream().map(PollOption::label).collect(Collectors.joining(" · "));
            return ResponseEntity.ok(page(poll.title(), shortened(options), "/p/" + shareToken));
        } catch (PollNotFoundException gone) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(page("super-vote", null, "/"));
        }
    }

    private String page(String title, String description, String path) {
        var html = new StringBuilder("""
            <!doctype html>
            <html>
            <head>
            <meta charset="utf-8">
            <meta name="robots" content="noindex">
            """);
        html.append("<title>").append(escaped(title)).append("</title>\n");
        tag(html, "og:site_name", "super-vote");
        tag(html, "og:type", "website");
        tag(html, "og:url", base + path);
        tag(html, "og:title", title);
        if (description != null) {
            tag(html, "og:description", description);
        }
        // Square and small: the apps show it beside the title rather than above it, as a banner.
        tag(html, "og:image", base + "/apple-touch-icon.png");
        tag(html, "og:image:width", "180");
        tag(html, "og:image:height", "180");
        html.append("<meta name=\"twitter:card\" content=\"summary\">\n");
        return html.append("</head>\n<body><h1>").append(escaped(title)).append("</h1></body>\n</html>\n").toString();
    }

    private static void tag(StringBuilder html, String property, String content) {
        html.append("<meta property=\"").append(property).append("\" content=\"").append(escaped(content))
            .append("\">\n");
    }

    private static String escaped(String text) {
        return HtmlUtils.htmlEscape(text, "UTF-8");
    }

    /** Cut between characters, never inside one (an emoji is two chars). */
    private static String shortened(String text) {
        return text.codePointCount(0, text.length()) <= DESCRIPTION_LENGTH
            ? text
            : text.substring(0, text.offsetByCodePoints(0, DESCRIPTION_LENGTH - 1)).strip() + "…";
    }
}
