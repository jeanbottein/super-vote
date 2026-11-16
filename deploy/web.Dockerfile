# super-vote's public address (deploy/compose.yaml): Caddy, with deploy/Caddyfile and the built web app.
# Built from the repository's root, which holds both: docker build -f deploy/web.Dockerfile .
# One image, so the Content Security Policy and the inline script it allows by its hash always ship together.
# Base images are pinned by digest, which Dependabot keeps current.

FROM node:24-trixie-slim@sha256:7f486cabe892bff8fef04c0f7da8dba84a560be3e4e2740b7a86afc57ebec315 AS build
WORKDIR /web
COPY app/package.json app/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY app/ ./
RUN npm run build

FROM caddy:2.11.8-alpine@sha256:f6228111e5fafa1a5238258d0858e103f10599b8d1659a146e7726681a002bb9
LABEL org.opencontainers.image.source="https://github.com/jeanbottein/super-vote" \
      org.opencontainers.image.description="super-vote web app, served by Caddy with its HTTPS edge" \
      org.opencontainers.image.licenses="MIT"
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /web/dist/ /srv/web/
