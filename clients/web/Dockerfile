# super-vote's public address (deploy/compose.yaml): Caddy, with deploy/Caddyfile and the built web app.
# Built from the repository's root, which holds both: docker build -f clients/web/Dockerfile .
# One image, so the Content Security Policy and the inline script it allows by its hash always ship together.
# Base images are pinned by digest, which Dependabot keeps current.

FROM node:24-trixie-slim@sha256:7f486cabe892bff8fef04c0f7da8dba84a560be3e4e2740b7a86afc57ebec315 AS build
WORKDIR /web
COPY clients/web/package.json clients/web/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY clients/web/ ./
RUN npm run build

FROM caddy:2.11.7-alpine@sha256:d8542f48d34a9cf4e4c11a478865229840e87e4c96ea3f439101f31a5d35f75f
LABEL org.opencontainers.image.source="https://github.com/jeanbottein/super-vote" \
      org.opencontainers.image.description="super-vote web app, served by Caddy with its HTTPS edge" \
      org.opencontainers.image.licenses="MIT"
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /web/dist/ /srv/web/
