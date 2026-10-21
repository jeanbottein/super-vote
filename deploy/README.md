# Putting super-vote on the internet

What runs, what protects it, and how to go from an empty VPS to
`https://super-vote.org`, then update it, go back, and back it up.

## What runs

```
 internet
    │ 443: HTTPS and HTTP/3     80: redirects to HTTPS, certificate challenges
 ┌──┴─────────────────────────────────┐
 │ Caddy (deploy/Caddyfile)           │  certificates, security headers, the web app's files
 └──┬─────────────────────────────────┘
    │ /api/*, /v3/api-docs*, /llms.txt, to 127.0.0.1:8080
 ┌──┴─────────────────────────────────┐
 │ Java server                        │  reached from this machine only
 └──┬─────────────────────────────────┘
    │ a network of Docker's own
 ┌──┴─────────────────────────────────┐
 │ PostgreSQL 18                      │  reached from the server only
 └────────────────────────────────────┘
```

`https://super-vote.org` is the web app, `/api` its API, `/api/mcp` the MCP
tools, `/v3/api-docs` the OpenAPI document and `/llms.txt` the guide for
agents: people and agents use the same address, and nothing else has a port.
Caddy gets and renews the certificate itself (Let's Encrypt), answers HTTP
with a redirect, and sends HSTS so that browsers never try HTTP again;
`www.super-vote.org` redirects to the bare domain.

They run with Docker Compose ([compose.yaml](compose.yaml)), from two images
that CI builds and checks together for every pull request, and publishes for
every commit on `main` ([images.yml](../.github/workflows/images.yml)), tagged
`main` and with the commit's SHA. They are public, as the repository is, so
the VPS pulls them without logging in:

| Image | What | Built by |
|---|---|---|
| `ghcr.io/jeanbottein/super-vote-web` | Caddy, with this Caddyfile and the built web app | [clients/web/Dockerfile](../clients/web/Dockerfile) |
| `ghcr.io/jeanbottein/super-vote-server` | the Java server, on the JVM | [servers/java/Dockerfile](../servers/java/Dockerfile) |

Caddy uses the machine's own network rather than one of Docker's. Behind
Docker's port publishing, a visitor coming over IPv6 shows as Docker's own
address: every such visitor would be one network to the limits, sharing 20
polls a day, and a guesser would bar them all from join codes. Caddy passes
the real address on in `X-Forwarded-For`, which the server believes from a
private address only. The server listens on `127.0.0.1:8080` for Caddy, and
PostgreSQL on Docker's network for the server: neither is published.

Its settings are four, in `deploy/.env` ([.env.example](.env.example)):

| Variable | What |
|---|---|
| `SUPER_VOTE_DOMAIN` | the site's address; the server's public URL (invitation links, `/llms.txt`) is `https://` and it |
| `SUPER_VOTE_VOTER_SECRET` | keys who owns each ballot and signs invitation links: `openssl rand -base64 48`, and never changed while polls are open ([ARCHITECTURE.md](../docs/ARCHITECTURE.md#anonymity)) |
| `POSTGRES_PASSWORD` | the database's: `openssl rand -hex 32` |
| `SUPER_VOTE_TAG` | which images run: `main`, or a commit's SHA |

## The first time

1. **A VPS.** At OVHcloud, in France, on Debian 13 or Ubuntu 24.04. Two
   gigabytes of memory are plenty: the server takes about 300 MB at rest and
   600 under load ([PERFORMANCE.md](../docs/PERFORMANCE.md)), PostgreSQL and
   Caddy little. Leave OVHcloud's automated backup and snapshots off: they
   copy PostgreSQL's files, which say which name goes with which ballot (see
   [Backups](#backups-and-restoring-one)).
2. **DNS.** `super-vote.org` and `www.super-vote.org` point to it: an `A`
   record each, and an `AAAA` each for its IPv6 address. Caddy asks for both
   certificates at its first start.
3. **The VPS itself**, before anything listens:
   - SSH with keys only (`PasswordAuthentication no`), no root login
     (`PermitRootLogin no`), and fail2ban's `sshd` jail, which bans an
     address after failed logins.
   - The firewall: `ufw default deny incoming`, then allow 22/tcp, 80/tcp,
     443/tcp and 443/udp (HTTP/3).
   - `unattended-upgrades`, for security fixes.
4. **Docker**, from Docker's own repository
   ([docs.docker.com/engine/install](https://docs.docker.com/engine/install/)),
   which brings Compose.
5. **super-vote:**

   ```bash
   sudo git clone https://github.com/jeanbottein/super-vote.git /opt/super-vote
   cd /opt/super-vote/deploy
   sudo install -m 600 .env.example .env
   sudoedit .env                      # the domain, and the two secrets
   sudo docker compose up -d --wait   # done when all three are up, the server and PostgreSQL healthy
   ```

   Then `https://super-vote.org` answers. `sudo docker compose logs caddy`
   says when the certificates were obtained.
6. **The nightly backup:** `sudo crontab -e`, and add
   `30 3 * * * /opt/super-vote/deploy/backup.sh`.
7. **The legal notices:** the privacy page is written; the publisher's
   notice (mentions légales) and the record of processing are the
   operator's ([ROADMAP.md](../docs/ROADMAP.md), phase 6).

## Updating, and going back

Each commit on main runs on the VPS by itself, once CI has checked and
published its images: the last job of
[images.yml](../.github/workflows/images.yml) logs in as `deploy`, whose key
can run nothing but [update.sh](update.sh), with the commit's SHA. It checks
that commit out, sets `SUPER_VOTE_TAG` to it, and starts its images; if they
do not come up healthy, the previous commit runs again and the job fails.
Two commits close together deploy one after the other, in order: main's runs
wait for each other, and update.sh takes a lock and refuses a commit older
than the one running.

To set it up, once (the key pair is made for this alone, on your computer):

```bash
ssh-keygen -t ed25519 -N '' -C super-vote-deploy -f deploy_key
scp deploy/update.sh deploy_key.pub ubuntu@<the VPS>:
ssh ubuntu@<the VPS>
  sudo install -m 755 update.sh /usr/local/sbin/super-vote-update
  sudo adduser --system --group --shell /bin/sh deploy
  echo 'deploy ALL=(root) NOPASSWD: /usr/local/sbin/super-vote-update' | sudo tee /etc/sudoers.d/super-vote-deploy
  sudo chmod 440 /etc/sudoers.d/super-vote-deploy
  sudo install -d -m 700 -o deploy -g deploy ~deploy/.ssh
  echo "restrict,command=\"sudo -n /usr/local/sbin/super-vote-update \\\"\$SSH_ORIGINAL_COMMAND\\\"\" $(cat deploy_key.pub)" \
    | sudo install -m 600 -o deploy -g deploy /dev/stdin ~deploy/.ssh/authorized_keys
```

Then, in the repository's settings, an environment `production` that only
main may deploy to, with the secrets `DEPLOY_SSH_KEY` (`deploy_key`, the
private half) and `DEPLOY_KNOWN_HOSTS` (`ssh-keyscan <the VPS>`, checked
against what the VPS says of its keys), and the variable `DEPLOY_HOST`.
Delete `deploy_key` from your computer once it is in GitHub.

By hand, the same: `sudo super-vote-update <SHA>`.

While the server restarts, Caddy holds each request for it, 15 seconds at
most, rather than failing it: nobody's ballot is lost to an update, and open
poll pages reconnect by themselves.

To go back, the simplest is a revert on main, which deploys like any commit.
By hand: put the SHA of the commit to run in `.env` (`SUPER_VOTE_TAG`), then
`sudo docker compose up -d --wait`; the next commit on main comes forward. An
older server starts on a database a newer one migrated: Flyway skips the
migrations it does not know, and since migrations only ever add, with
defaults ([servers/java/README.md](../servers/java/README.md#schema-changes)),
what it reads and writes is still there.

## Backups, and restoring one

[backup.sh](backup.sh) writes `deploy/backups/super-vote-<date>.dump` (a
`pg_dump`, compressed), readable by root only, and deletes those older than
7 days, as the privacy page says: whatever people delete is gone from the
backups within a week.

Backups stay logical: never `pg_basebackup`, a replica, or a copy of the
VPS's disk. PostgreSQL's files record which transaction wrote each row, and
with it which name goes with which ballot; a dump does not
([ARCHITECTURE.md](../docs/ARCHITECTURE.md#known-limit-what-the-database-itself-records)).

They stay on the VPS: copy them off it too (OVHcloud's Object Storage, with
`rclone copy`, say), `backups/` alone, never `.env` with them, and deleted
there after 7 days as well.

To restore one, stop the server, restore over the database, start it again:

```bash
cd /opt/super-vote/deploy
sudo docker compose stop server
sudo docker compose exec -T postgres pg_restore --clean --if-exists \
  --username=super_vote --dbname=super_vote < backups/super-vote-2026-10-20.dump
sudo docker compose start server
```

A new major version of PostgreSQL cannot open the files of the previous one,
so Dependabot never proposes one. Moving to it is a dump, a new volume, and a
restore.

## Logs

`sudo docker compose logs server` (or `caddy`, `postgres`). Docker keeps
them rotated, 30 MB at most per service.

Neither the server nor Caddy writes down an address or a page: the server
logs no request, and Caddy, which keeps no access log unless told to, drops
the request from its own messages (its `log` options, in the Caddyfile).
Without that, each visitor leaving a poll's live results left a line with
their address and the poll's link. Keep it so: an access log would be a
record of who opened which poll.

## What protects what

| Layer | Against |
|---|---|
| OVHcloud's network (anti-DDoS, included) | floods, before they reach the VPS |
| The VPS's firewall | everything but SSH, 80 and 443 |
| Caddy | plain HTTP (HSTS), slow clients (timeouts), bodies over 64 KB, injected scripts and framing (Content Security Policy), other sites' windows and reads (`Cross-Origin-Opener-Policy`, `-Resource-Policy`), a poll's address passed on to other sites (`Referrer-Policy: no-referrer`), unlisted polls in search engines (`X-Robots-Tag: noindex` on `/p/*`) |
| The server | a network creating more than 20 polls a day, or guessing join codes ([docs/API.md](../docs/API.md#fair-use)); requests other sites' pages make; personal answers left in caches (`no-store`); and identity, invitations and ballots ([docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md#identity)). The whole picture: [docs/SECURITY.md](../docs/SECURITY.md) |
| Docker | the server and PostgreSQL out of reach; the server's files read-only, as an unprivileged user without capabilities; Caddy with only what serving 80 and 443 needs |

Nothing that grants anything can be guessed: a poll's link holds 128 random
bits, a voter's token 256, an invitation or a handover a 128-bit signature. A
ballot can only be changed by whoever cast it. What anyone holding a link can
do is vote, from as many browsers as they like, on a poll that takes no
invitations: counting each person once is what invitations are for.

The voter secret and the database password live in `deploy/.env` only, which
only root reads: never in an image, the repository or a backup.

If abuse comes anyway: one address hammering the site is for CrowdSec or
fail2ban reading an access log kept briefly, or the `caddy-ratelimit` plugin
(a custom build); many addresses, for OVHcloud's mitigation, or Cloudflare in
front, which Caddy must then trust for the client's address
(`trusted_proxies`).

## Trying it elsewhere

The whole stack runs on any Linux machine with Docker, as CI runs it: build
the images, then start them on `localhost`, where Caddy signs its own
certificate.

```bash
docker build -t ghcr.io/jeanbottein/super-vote-server:local servers/java
docker build -t ghcr.io/jeanbottein/super-vote-web:local -f clients/web/Dockerfile .
cd deploy && printf '%s\n' SUPER_VOTE_DOMAIN=localhost SUPER_VOTE_TAG=local \
  "SUPER_VOTE_VOTER_SECRET=$(openssl rand -base64 48)" "POSTGRES_PASSWORD=$(openssl rand -hex 32)" > .env
docker compose up -d --wait   # https://localhost
```

The Caddyfile alone: `caddy validate --config deploy/Caddyfile` checks it. To
run it over plain HTTP, in front of `./dev.sh server` and a built web app:

```bash
sed -e 's|^{$SUPER_VOTE_DOMAIN:super-vote.org} {|http://localhost:8443 {|' -e '/^www\./,/^}/d' \
  deploy/Caddyfile > /tmp/Caddyfile.local
SUPER_VOTE_WEB=clients/web/dist caddy run --config /tmp/Caddyfile.local
```

Its Content Security Policy lets `index.html`'s inline script run by its
hash: change the script and `npm test` names the hash to put in its place.
