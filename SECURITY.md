# Security policy

super-vote asks people to trust it with their ballots, so a weakness in it is
worth reporting, and worth fixing first.

## Reporting a vulnerability

Report it privately, through GitHub: on this repository's **Security** tab,
**Report a vulnerability** (GitHub's private vulnerability reporting). Please
do not open a public issue for it, and give us a reasonable time to fix it
before you tell anyone else.

Say what you found, how to reproduce it, and what it lets someone do. We will
answer, tell you what we do about it, and credit you in the fix if you wish.

## What is covered

The code in this repository, and super-vote.org, which runs the `main`
branch. Only the latest version is supported: there are no releases to patch
separately.

Test against a copy you run yourself (`./dev.sh`, see the README) rather than
against super-vote.org, where real people vote: no load testing, no
automated scanning, nothing that touches other people's polls.

## What is a known limit, not a vulnerability

super-vote has no accounts yet, and says so to the people using it. These are
documented choices, with what protects against them
([docs/SECURITY.md](docs/SECURITY.md)):

- On a poll that takes no invitations, someone can vote again from another
  browser or device. Invitations count each person once.
- Whoever runs the server is trusted: ballots are unlinkable at rest, not
  hidden from the running server.
- Live results can show what a voter in a small group chose; a poll's creator
  chooses when results show, and is warned.

## How the project watches itself

Every pull request runs the tests, CodeQL (security and quality queries) and a
review of new dependencies, and none reaches `main` without them. Dependabot
watches every dependency of `main`, transitive ones included, and proposes
updates. The details: [docs/SECURITY.md](docs/SECURITY.md).
