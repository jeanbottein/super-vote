#!/bin/sh
# Runs one commit of main on this machine, as CI asks once it has published
# that commit's images (.github/workflows/images.yml, deploy/README.md):
#
#   update.sh <commit SHA>
#
# Installed as /usr/local/sbin/super-vote-update, outside the repository, which
# it checks out; each run installs the copy it checked out, for the next one.
#
# One run at a time (flock), and never backwards: a commit that is not on
# main, or older than the one running, is refused. CI already runs main's
# commits one after the other, but a re-run of an old workflow would otherwise
# go back. To go back on purpose, see "Updating, and going back".
#
# If the new images do not come up healthy, the previous commit runs again,
# and the run fails.
set -eu

sha=${1:-}
case $sha in
  *[!0-9a-f]* | '') echo "Expected a commit's full SHA, got: $sha" >&2; exit 2 ;;
esac
[ ${#sha} -eq 40 ] || { echo "Expected a commit's full SHA, got: $sha" >&2; exit 2; }

repository=/opt/super-vote
cd "$repository"
exec 9> /run/super-vote-update.lock
flock 9

git fetch --quiet origin main
if ! git merge-base --is-ancestor "$sha" origin/main; then
  echo "$sha is not on main." >&2
  exit 1
fi
running=$(git rev-parse HEAD)
if [ "$sha" != "$running" ] && git merge-base --is-ancestor "$sha" "$running"; then
  echo "$sha is older than $running, which runs: nothing to do."
  exit 0
fi

# Which images run, in .env, as an update by hand would set it.
tag() { sed -i "s/^SUPER_VOTE_TAG=.*/SUPER_VOTE_TAG=$1/" deploy/.env; }
start() { (cd deploy && docker compose pull --quiet && docker compose up --detach --wait --wait-timeout 180); }

previous=$(sed -n 's/^SUPER_VOTE_TAG=//p' deploy/.env)
git checkout --quiet --detach "$sha"
tag "$sha"
if start; then
  install -m 755 deploy/update.sh /usr/local/sbin/super-vote-update
  docker image prune --force > /dev/null
  echo "$sha runs."
else
  echo "$sha did not come up healthy: back to $running." >&2
  git checkout --quiet --detach "$running"
  tag "$previous"
  start
  exit 1
fi
