#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# Cloudflare Pages Deploy Script for Protocol Documentation
# Idempotent: creates the project if it doesn't exist, then deploys.
# ─────────────────────────────────────────────────────────────────────────────

PROJECT_NAME="protocol-docs"
BUILD_DIR="website/build"
PRODUCTION_BRANCH="main"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*" >&2; }

# ─── Preflight checks ────────────────────────────────────────────────────────

if ! command -v npx &> /dev/null; then
    error "npx is required but not found. Install Node.js first."
    exit 1
fi

# Verify wrangler is available
if ! npx wrangler --version &> /dev/null; then
    error "wrangler is not available. Run: npm install -g wrangler"
    exit 1
fi

# Verify build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    error "Build directory '$BUILD_DIR' not found. Run 'just build' first."
    exit 1
fi

# Verify 404.html exists in build output
if [ ! -f "$BUILD_DIR/404.html" ]; then
    error "404.html not found in build output. Build may be incomplete."
    exit 1
fi

# ─── Ensure Cloudflare Pages project exists (idempotent) ─────────────────────

info "Checking if Cloudflare Pages project '$PROJECT_NAME' exists..."

if npx wrangler pages project list 2>/dev/null | grep -q "^${PROJECT_NAME}$\|${PROJECT_NAME} "; then
    info "Project '$PROJECT_NAME' already exists."
else
    warn "Project '$PROJECT_NAME' not found. Creating..."
    npx wrangler pages project create "$PROJECT_NAME" --production-branch "$PRODUCTION_BRANCH"
    info "Project '$PROJECT_NAME' created."
fi

# ─── Deploy ──────────────────────────────────────────────────────────────────

BRANCH="${1:-$PRODUCTION_BRANCH}"

info "Deploying '$BUILD_DIR' to Cloudflare Pages project '$PROJECT_NAME' (branch: $BRANCH)..."

npx wrangler pages deploy "$BUILD_DIR" \
    --project-name "$PROJECT_NAME" \
    --branch "$BRANCH" \
    --commit-dirty=true

info "Deploy complete!"
echo ""
info "Next steps:"
info "  - Set custom domain: https://dash.cloudflare.com → Pages → $PROJECT_NAME → Custom domains"
info "  - Add 'protocol.merchantprotocol.com' as a custom domain"
info "  - Cloudflare will auto-provision SSL"
echo ""
info "404 handling: Cloudflare Pages automatically serves 404.html with HTTP 404 status."
