# Protocol Documentation Site

# Show available commands
default:
    @just --list

# Install all dependencies
install:
    yarn install

# Start the dev server with hot reload on port 80
start:
    yarn website:start -- --port 80 --host 0.0.0.0

# Build the static site for production
build:
    yarn website:build

# Serve the production build on port 80
serve:
    yarn website:serve -- --port 80 --host 0.0.0.0

# Clean build artifacts and Docusaurus cache
clean:
    cd website && rm -rf build .docusaurus

# Full rebuild from clean state
rebuild: clean build

# Backup the build output before deploying
backup:
    #!/usr/bin/env bash
    set -euo pipefail
    BUILD_DIR="./website/build"
    if [ ! -d "$BUILD_DIR" ] || [ -z "$(ls -A "$BUILD_DIR" 2>/dev/null)" ]; then
        echo "Nothing to back up — website/build/ is empty or missing."
        exit 1
    fi
    BACKUP="./website/build-backup"
    rm -rf "$BACKUP"
    cp -r "$BUILD_DIR" "$BACKUP"
    echo "Backup created: $BACKUP"

# Verify build output looks complete before deploying
verify:
    #!/usr/bin/env bash
    set -euo pipefail
    BUILD_DIR="./website/build"
    MIN_FILES=200
    ERRORS=0
    if [ ! -d "$BUILD_DIR" ]; then
        echo "FAIL: website/build/ does not exist."
        exit 1
    fi
    COUNT=$(find "$BUILD_DIR" -type f | wc -l | tr -d ' ')
    if [ "$COUNT" -lt "$MIN_FILES" ]; then
        echo "FAIL: Only $COUNT files found (expected at least $MIN_FILES)"
        ERRORS=$((ERRORS+1))
    fi
    for page in index.html 404.html; do
        if [ ! -f "$BUILD_DIR/$page" ]; then
            echo "FAIL: Missing $page"
            ERRORS=$((ERRORS+1))
        fi
    done
    if [ "$ERRORS" -gt 0 ]; then
        echo "Verification failed with $ERRORS error(s). Aborting."
        exit 1
    fi
    echo "Verified: $COUNT files, key pages present. Safe to deploy."

# Compare new build output against the backup and prompt for confirmation
confirm:
    #!/usr/bin/env bash
    set -euo pipefail
    BUILD_DIR="./website/build"
    BACKUP="./website/build-backup"
    if [ ! -d "$BACKUP" ]; then
        echo "No backup found to compare against. Skipping diff."
        exit 0
    fi
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  Comparing: $BACKUP (old) → $BUILD_DIR (new)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    DIFF_OUTPUT=$(diff -rq "$BACKUP" "$BUILD_DIR" 2>/dev/null || true)
    if [ -z "$DIFF_OUTPUT" ]; then
        echo "  No changes detected. Output is identical to backup."
        echo ""
        read -p "  Deploy anyway? [y/N] " ANSWER
        if [[ ! "$ANSWER" =~ ^[Yy]$ ]]; then
            echo "  Deploy cancelled."
            exit 1
        fi
        exit 0
    fi
    ADDED=$(echo "$DIFF_OUTPUT" | grep "^Only in $BUILD_DIR" | wc -l | tr -d ' ')
    REMOVED=$(echo "$DIFF_OUTPUT" | grep "^Only in $BACKUP" | wc -l | tr -d ' ')
    MODIFIED=$(echo "$DIFF_OUTPUT" | grep "^Files " | wc -l | tr -d ' ')
    echo "  ┌────────────────────────────────────┐"
    echo "  │  Deploy Change Summary             │"
    echo "  ├────────────────────────────────────┤"
    printf "  │  Added:    %-24s│\n" "$ADDED files"
    printf "  │  Removed:  %-24s│\n" "$REMOVED files"
    printf "  │  Modified: %-24s│\n" "$MODIFIED files"
    echo "  └────────────────────────────────────┘"
    echo ""
    # Show removed files explicitly (these are the dangerous ones)
    if [ "$REMOVED" -gt 0 ]; then
        echo "  Files that will be REMOVED from the live site:"
        echo "$DIFF_OUTPUT" | grep "^Only in $BACKUP" | sed "s|Only in $BACKUP[/]*: |    - |" | head -20
        if [ "$REMOVED" -gt 20 ]; then
            echo "    ... and $((REMOVED - 20)) more"
        fi
        echo ""
    fi
    # Warn if large percentage of files removed
    OLD_COUNT=$(find "$BACKUP" -type f | wc -l | tr -d ' ')
    if [ "$OLD_COUNT" -gt 0 ] && [ "$REMOVED" -gt 0 ]; then
        REMOVED_PCT=$((REMOVED * 100 / OLD_COUNT))
        if [ "$REMOVED_PCT" -gt 20 ]; then
            echo "  ⚠  WARNING: $REMOVED_PCT% of files would be removed!"
            echo ""
        fi
    fi
    read -p "  Proceed with deploy? [y/N] " ANSWER
    if [[ ! "$ANSWER" =~ ^[Yy]$ ]]; then
        echo "  Deploy cancelled."
        exit 1
    fi

# Deploy to Cloudflare Pages (production) — runs build, backup, verify, confirm
deploy: build backup verify confirm
    ./deploy.sh

# Deploy a preview (non-production branch) — runs build, backup, verify, confirm
deploy-preview: build backup verify confirm
    ./deploy.sh preview

# Format all source files
format:
    cd website && yarn format:source && yarn format:markdown && yarn format:style

# Lint docs and source
lint:
    cd website && yarn lint

# Clear cache, reinstall, and start fresh
reset: clean
    rm -rf node_modules website/node_modules
    yarn install
