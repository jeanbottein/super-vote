#!/bin/sh
# A copy of super-vote's database, which cron makes every night (deploy/README.md):
#
#   30 3 * * * /opt/super-vote/deploy/backup.sh
#
# Logical (pg_dump), never a copy of PostgreSQL's files: those record which
# transaction wrote each row, and with it which name goes with which ballot
# (docs/ARCHITECTURE.md, "Known limit: what the database itself records").
# Copies are kept 7 days, as the privacy page says: whatever people delete is
# gone from them within a week.
set -eu
cd "$(dirname "$0")"
umask 077
mkdir -p backups
copy="backups/super-vote-$(date -u +%Y-%m-%d).dump"
docker compose exec -T postgres pg_dump --username=super_vote --dbname=super_vote --format=custom > "$copy.part"
mv "$copy.part" "$copy"
find backups -name 'super-vote-*.dump' -mtime +6 -delete
