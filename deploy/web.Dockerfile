# super-vote's public address (deploy/compose.yaml): Caddy, with deploy/Caddyfile and the built web app.
# Built from the repository's root, which holds both: docker build -f deploy/web.Dockerfile .
# One image, so the Content Security Policy and the inline script it allows by its hash always ship together.
# Base images are pinned by digest, which Dependabot keeps current.

FROM node:24-trixie-slim@sha256:af02d57b57719b9657a45199a79264a9437940cd55b3c7b3fc99615654f124a0 AS build
WORKDIR /web
COPY app/package.json app/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY app/ ./
RUN npm run build

FROM caddy:2.11.9-alpine@sha256:003a97808e781aa9f7e75cc2f43d34d461099031faf5e20faefb9f61126836f0
LABEL org.opencontainers.image.source="https://github.com/jeanbottein/super-vote" \
      org.opencontainers.image.description="super-vote web app, served by Caddy with its HTTPS edge" \
      org.opencontainers.image.licenses="MIT"
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /web/dist/ /srv/web/
