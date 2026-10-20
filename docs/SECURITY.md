# super-vote security

What super-vote protects, against whom, and what it does not: for whoever
runs it, reviews it, or wonders whether to trust it. People read the short
version on the web app's "Privacy and limits" page (`/privacy`); reporting a
vulnerability is in [SECURITY.md](../SECURITY.md).

## Is it secure enough for a first version?

Yes, for what it says it is for: everyday decisions among people who trust
each other enough, with nothing official or binding at stake. Without accounts
or sessions, what makes it trustworthy is that nothing grants anything unless
it is unguessable, nothing stored says who chose what, and every limit that
remains is stated to the people it concerns, where it concerns them. It is
not suited to elections, and says so on the home page, the creation form and
the privacy page: a vote like that needs each voter identified and counted
once, and a count anyone can verify.

The review that led to this release (October 2026) found no way to read
someone else's ballot, to act as another voter, or to take over a poll, and
fixed the weaknesses listed under [Hardened](#hardened-for-the-first-users).

## What is protected, and how

| What | Against | How | Where |
|---|---|---|---|
| Who chose what, at rest | a copy of the database, a curious admin | a voter's ballot, name and used invitation are stored under different keyed HMACs, per poll; no time is kept with any of them; the token itself is never stored | `identity.Voter`, ARCHITECTURE.md "Anonymity" |
| Who chose what, on screen | a shoulder, a projector | a counted ballot starts hidden; results can be kept back until a number of ballots, or the close; live results warn the creator | `BallotFrame`, `Poll.ResultsShown` |
| Who chose what, on the device | someone using the same browser later | no API answer is cached (`Cache-Control: no-store`) unless it is the same for everyone | `api.PrivateAnswers` |
| A voter's identity | another site's page (CSRF), scripts | a 256-bit token in an `HttpOnly`, `SameSite=Lax` cookie, `Secure` behind HTTPS; no CORS; requests another site's page makes are refused (`Sec-Fetch-Site: cross-site`) | `identity.VoterIdentityFilter` |
| A poll | strangers | its link is 128 random bits; a join code is short, so a network gets 5 wrong in a row or 20 a day, then none for a day | `PollService`, `ratelimit.WrongCodes` |
| An invitation, a handover | guessing, a leaked link | 128-bit signatures, compared in constant time; an invitation binds to the first browser that votes, a handover works once; both travel in the fragment, never to a server log | `InvitationLinks`, `HandoverLinks` |
| What people read | injected scripts, framing | React escapes all text; a Content Security Policy allows the page's own scripts and one hashed inline script; `frame-ancestors 'none'`, `Cross-Origin-Opener-Policy` and `-Resource-Policy` | `deploy/Caddyfile` |
| What a ballot shows | look-alike or reordered options | titles, options and names are composed one way (NFC), and refuse controls, bidi overrides and zero widths; two options differing by case or an unseen joiner are the same | `PollService.tidy`, `pollForm.ts` |
| The service | a script creating polls, big requests | 20 polls a day per network (an IPv4 address or an IPv6 /64), counted in memory only; bodies over 64 KB refused at the edge; header and body timeouts | `ratelimit.PollQuota`, Caddyfile |
| The link to the outside | eavesdropping | HTTPS only, HSTS, Caddy's automatic certificates | Caddyfile |
| Personal data | keeping it | polls and their ballots deleted after 30 days, and gone from the nightly copies a week later; statistics are totals by time zone, from 3 up, published hourly; addresses are never written, in the database or in a log | `PollRetention`, `StatisticsService`, `deploy/backup.sh`, the Caddyfile's `log` |
| The code itself | known vulnerabilities, a compromised dependency | every pull request runs the tests, CodeQL (security and quality) and a review of new dependencies; Dependabot watches the whole tree of `main`; actions pinned by commit; Scorecard | `.github/` |

## What it does not protect against

Known, stated where they matter, and the way out of each:

1. **Voting twice, without invitations.** Anyone with a poll's link can vote
   again from another browser; a script can do it a thousand times. Ballots
   are not limited by network, because a room votes from one address. The
   creation form warns, the ballot count shows abuse, and invitations count
   each person once. Accounts (roadmap, phase 7) will raise the bar.
2. **The operator is trusted.** Whoever runs the server sees requests as they
   happen; nothing hides a ballot from the running server, and the count
   cannot be verified independently (that would take cryptographic voting).
   On PostgreSQL, the transaction id of each row (`xmin`) can join a first
   ballot with its name or invitation for whoever can query the live
   database: backups stay logical (`pg_dump`). Said on the privacy page.
3. **Inference in small groups.** Live results, or a name appearing, can show
   what one person chose. The creator chooses when results show and is
   warned; polls showing names or taking invitations wait for the close by
   default.
4. **Floods.** One small server: OVHcloud's network filters floods, Caddy
   bounds requests, but nothing limits open event streams per network (a
   room behind one address opens hundreds) or the overall request rate.
   If abuse comes: a rate limit at the edge (`caddy-ratelimit`, CrowdSec),
   then a cap on streams per network (deploy/README.md).
5. **Losing the browser.** Ballots and polls belong to the browser that made
   them: clearing its data, or another device, loses the right to change or
   manage them, and there is no recovery. Said on the poll page and the
   privacy page.
6. **Inflated statistics.** A voter token is one request away
   (`POST /api/voters`), so the "visitors" count can be inflated. It grants
   nothing.
7. **Content.** Polls are private by link and are not moderated. Illegal
   content can be reported through the GitHub issues linked from the privacy
   page; the operator must act on such reports promptly (EU Digital Services
   Act).

## Hardened for the first users

October 2026, with this release:

- Requests made by other websites' pages are refused before they are
  anyone's: without it, a page could have its visitors' browsers try join
  codes, barring their networks from codes for a day, and hand each of them
  an identity. Following a link still works.
- API answers are never cached unless they are the same for everyone, so a
  ballot is not left in a browser's cache, readable after it was hidden.
- Invisible characters are refused in titles and options as they already were
  in names, so that two options cannot look alike, nor text read out of order.
- `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy` at the edge.
- Caddy's own messages leave out the request they are about: a warning was
  written each time a visitor left a poll's live results, with their address
  and the poll's link, which is its key.
- The tests, CodeQL and dependency checks run on every change, and must pass
  before merging; Dependabot alerts and security updates, secret scanning
  with push protection, and private vulnerability reporting are on.

## For the deployment

What the server needs to keep these promises, which `deploy/compose.yaml`
and the Caddyfile set up (deploy/README.md has the rest):

- `SUPER_VOTE_VOTER_SECRET` from the host's secrets (`deploy/.env`, read by
  root only), never in an image, the repository or a backup, and never
  changed while polls are open.
- HTTPS through Caddy only: the Java server reached from the machine alone,
  PostgreSQL from the server alone.
- Caddy on the machine's own network, so that the limits see each visitor's
  address: behind Docker's port publishing, every IPv6 visitor would be one
  network.
- PostgreSQL with `lock_timeout`; logical backups only (`pg_dump`, kept 7
  days), never a copy of the disk; logs rotated, naming no address and no
  page.
- `unattended-upgrades`, SSH keys only, the firewall closed but for 22, 80 and
  443.
- The legal notices: the privacy page is written; the publisher's notice
  (mentions légales) and a way to report content are the operator's.

Follow-ups worth doing when they become cheap: the `__Host-` cookie prefix in
production (it needs HTTPS everywhere, which development on a phone lacks),
HSTS preload once the domain is settled, a cap on event streams per network,
and an independent review before anything official is decided with
super-vote.
