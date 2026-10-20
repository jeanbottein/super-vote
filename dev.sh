#!/usr/bin/env bash
set -euo pipefail

# super-vote local development.
#
#   ./dev.sh            start the server (:8080) and the web client (:5173)
#   ./dev.sh server     start only the Java server
#   ./dev.sh client     start only the web client
#   ./dev.sh test       run every check: server tests, client lint, build (with types) and tests
#
# Requires a JDK (25+) and Node (24.15+ or 22.22+). Versions are pinned in .tool-versions:
# with mise or asdf installed, `mise install` provisions both. Maven is NOT
# required: the committed wrapper (servers/java/mvnw) is used instead.
#
# No database setup is needed. H2 runs inside the server process and stores its
# data in SUPER_VOTE_DATA_DIR below, so the repo folder stays self-contained and
# can be copied between machines with its data intact.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$ROOT/servers/java"
CLIENT_DIR="$ROOT/clients/web"

# Absolute, repo-rooted data directory. Exported so the server never depends on
# the working directory it happens to be launched from.
export SUPER_VOTE_DATA_DIR="${SUPER_VOTE_DATA_DIR:-$ROOT/data}"

HEALTH_URL="http://localhost:8080/actuator/health"
MODE="${1:-all}"

SERVER_PID=""
CLIENT_PID=""

# Each half runs in a process group of its own (job control), so that stopping
# it stops what it started too: Maven forks the server's JVM, npm starts Vite.
# Killing only the subshell left that JVM running, holding :8080 for days.
set -m

# stop <pid, or -pgid for a whole group>: politely, then not.
stop() {
  kill -TERM -- "$1" 2>/dev/null || return 0
  for _ in $(seq 1 40); do
    kill -0 -- "$1" 2>/dev/null || return 0
    sleep 1
  done
  kill -KILL -- "$1" 2>/dev/null || true
}

cleanup() {
  trap - EXIT INT TERM
  for pid in "$CLIENT_PID" "$SERVER_PID"; do
    if [ -n "$pid" ]; then
      stop "-$pid"
    fi
  done
  wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

require() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Error: $1 not found. Install it, or run 'mise install' for the pinned versions." >&2
    exit 1
  }
}

require_java() {
  local java="${JAVA_HOME:+$JAVA_HOME/bin/}java"
  require "$java"
  local version
  version=$("$java" -XshowSettings:properties -version 2>&1 | awk -F'= ' '/java.specification.version/ {print $2}')
  if [ "${version%%.*}" -lt 25 ]; then
    echo "Error: Java $version is too old; the server needs 25 or newer: run 'mise install' for the pinned version, or install any JDK 25." >&2
    exit 1
  fi
}

require_node() {
  require node
  require npm
  node -e 'const [major, minor] = process.versions.node.split(".").map(Number);
    process.exit(major >= 26 || (major === 24 && minor >= 15) || (major === 22 && minor >= 22) ? 0 : 1)' || {
    echo "Error: the client does not run on Node $(node --version): it needs 24.15+, 22.22+ or 26+ (24 LTS recommended)." >&2
    exit 1
  }
  if [ ! -d "$CLIENT_DIR/node_modules" ]; then
    echo "Installing client dependencies..."
    (cd "$CLIENT_DIR" && npm ci)
  fi
}

# A port still held by an earlier run from this folder (a server whose terminal
# was closed, say) is freed. One held by anything else stops us: otherwise the
# health check below would be answered by that program, not by our server.
free_port() {
  local port=$1 pid cwd
  command -v lsof >/dev/null 2>&1 || return 0
  for pid in $(lsof -nP -t -iTCP:"$port" -sTCP:LISTEN 2>/dev/null); do
    cwd=$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')
    if [[ "$cwd" == "$ROOT"/* ]]; then
      echo "Stopping the previous run on :$port (pid $pid)"
      stop "$pid"
    else
      echo "Error: port $port is taken by another program (pid $pid: $(ps -o command= -p "$pid" | cut -c1-80))." >&2
      exit 1
    fi
  done
}

start_server() {
  require_java
  free_port 8080
  mkdir -p "$SUPER_VOTE_DATA_DIR"
  echo "Starting the server on :8080 (data in $SUPER_VOTE_DATA_DIR)"
  (cd "$SERVER_DIR" && ./mvnw -q spring-boot:run) &
  SERVER_PID=$!
}

wait_for_server() {
  echo -n "Waiting for the server "
  for _ in $(seq 1 90); do
    if curl -fsS -o /dev/null "$HEALTH_URL" 2>/dev/null; then
      echo " ready."
      return 0
    fi
    if ! kill -0 "$SERVER_PID" 2>/dev/null; then
      echo ""
      echo "Error: the server stopped before becoming ready. Its output is above." >&2
      exit 1
    fi
    printf '.'
    sleep 1
  done
  echo ""
  echo "Error: the server did not answer within 90 seconds." >&2
  exit 1
}

start_client() {
  require_node
  free_port 5173
  echo "Starting the web client on http://localhost:5173"
  (cd "$CLIENT_DIR" && npm run dev) &
  CLIENT_PID=$!
}

run_checks() {
  require_java
  require_node
  echo "== Server: architecture, API and live-stream tests"
  (cd "$SERVER_DIR" && ./mvnw -q test)
  echo "== Client: lint, production build (with types), tests"
  (cd "$CLIENT_DIR" && npm run lint && npm run build && npm test)
  echo "All checks passed."
}

case "$MODE" in
  server)
    start_server
    wait
    ;;
  client)
    start_client
    wait
    ;;
  all)
    start_server
    wait_for_server
    start_client
    wait
    ;;
  test)
    run_checks
    ;;
  *)
    echo "Usage: ./dev.sh [server|client|test]" >&2
    exit 2
    ;;
esac
