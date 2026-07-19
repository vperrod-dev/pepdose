#!/usr/bin/env bash
# Build and deploy pepdose to the claude-dev VM (served by Caddy at /pepdose/).
#
# Replaces .github/workflows/deploy.yml, which cannot run while the GitHub
# account is blocked (Actions disabled account-wide, ticket 4583559).
#
# Usage: scripts/deploy.sh [--skip-tests]
#
# Supabase config comes from .env.local (gitignored) — vite loads it
# automatically. Both values are public-safe: the URL is public and the
# publishable key is protected by row-level security.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

TARGET="${PEPDOSE_TARGET:-/srv/pepdose}"

[[ -r .env.local ]] || {
  echo "ERROR: .env.local missing — build would ship without Supabase config" >&2
  echo "       needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example)" >&2
  exit 1
}
grep -q '^VITE_SUPABASE_URL=.\+' .env.local && grep -q '^VITE_SUPABASE_ANON_KEY=.\+' .env.local || {
  echo "ERROR: .env.local is missing or has an empty Supabase value" >&2
  exit 1
}

echo "==> npm ci"
npm ci

if [[ "${1:-}" != "--skip-tests" ]]; then
  echo "==> tests"
  npm test
fi

echo "==> build"
npm run build

# vite.config keeps base: '/pepdose/', which matches the Caddy `handle_path
# /pepdose*` route. Do NOT "fix" it to '/': the matching subpath is exactly what
# lets this app move back to GitHub Pages untouched when the account is restored.
grep -q "base: '/pepdose/'" vite.config.ts || {
  echo "WARNING: vite base is no longer '/pepdose/' — assets will 404 behind Caddy" >&2
}

echo "==> deploy to $TARGET"
sudo /usr/bin/rsync -a --delete --chown=caddy:caddy dist/ "$TARGET/"

echo
echo "Deployed: https://claude-dev-vperrod.westeurope.cloudapp.azure.com/pepdose/"
echo "Note: sw.js CACHE_NAME is unchanged, so returning clients may serve cached"
echo "      shell until the service worker updates. Hard-reload to verify."
