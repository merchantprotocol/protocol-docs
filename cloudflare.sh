#!/usr/bin/env bash
set -euo pipefail

COMMAND="${1:-deploy}"
PROJECT="${2:-protocol-docs}"
BUILD_DIR="./website/build"
BACKUP_DIR=".backups"
BACKUP_PREFIX="build-backup"
PRODUCTION_BRANCH="main"

# ─── Helpers ─────────────────────────────────────────────────
latest_backup() {
    ls -dt "$BACKUP_DIR"/${BACKUP_PREFIX}-* 2>/dev/null | head -1 || true
}

backup_date() {
    echo "$1" | sed 's/.*backup-//' | sed 's/\([0-9]\{4\}\)\([0-9]\{2\}\)\([0-9]\{2\}\)-\([0-9]\{2\}\)\([0-9]\{2\}\)\([0-9]\{2\}\)/\1-\2-\3 \4:\5:\6/'
}

# ─── Backup ──────────────────────────────────────────────────
backup() {
    if [ ! -d "$BUILD_DIR" ] || [ -z "$(ls -A "$BUILD_DIR" 2>/dev/null)" ]; then
        echo "Nothing to back up — website/build/ is empty or missing."
        exit 1
    fi
    mkdir -p "$BACKUP_DIR"
    BACKUP_NEW="$BACKUP_DIR/${BACKUP_PREFIX}-$(date +%Y%m%d-%H%M%S)"
    cp -r "$BUILD_DIR" "$BACKUP_NEW"
    BACKED_UP=$(find "$BACKUP_NEW" -type f | wc -l | tr -d ' ')
    echo "Backup created: $BACKUP_NEW ($BACKED_UP files)"
}

# ─── Verify ──────────────────────────────────────────────────
verify() {
    MIN_FILES=200
    ERRORS=0
    if [ ! -d "$BUILD_DIR" ]; then
        echo "FAIL: website/build/ does not exist. Run 'just build' first."
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
}

# ─── Confirm ─────────────────────────────────────────────────
confirm() {
    BACKUP=$(latest_backup)
    if [ -z "$BACKUP" ]; then
        echo "No backup found to compare against. Skipping diff."
        echo ""
        read -p "  Deploy without comparison? [y/N] " ANSWER < /dev/tty || true
        if [[ ! "$ANSWER" =~ ^[Yy]$ ]]; then
            echo "  Deploy cancelled."
            exit 1
        fi
        return 0
    fi
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  Comparing: $BACKUP (last deploy) → $BUILD_DIR (current)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    DIFF=$(diff -rq "$BACKUP" "$BUILD_DIR" 2>/dev/null || true)
    if [ -z "$DIFF" ]; then
        echo "  No changes detected. Output is identical to last deploy."
        echo ""
        read -p "  Deploy anyway? [y/N] " ANSWER < /dev/tty || true
        if [[ ! "$ANSWER" =~ ^[Yy]$ ]]; then
            echo "  Deploy cancelled."
            exit 1
        fi
        return 0
    fi
    ADDED=$(echo "$DIFF" | { grep "^Only in $BUILD_DIR" || true; } | wc -l | tr -d ' ')
    REMOVED=$(echo "$DIFF" | { grep "^Only in $BACKUP" || true; } | wc -l | tr -d ' ')
    MODIFIED=$(echo "$DIFF" | { grep "^Files " || true; } | wc -l | tr -d ' ')
    echo "  ┌────────────────────────────────────────┐"
    echo "  │  Deploy Change Summary                 │"
    echo "  ├────────────────────────────────────────┤"
    printf "  │  Added:    %-28s│\n" "$ADDED files"
    printf "  │  Removed:  %-28s│\n" "$REMOVED files"
    printf "  │  Modified: %-28s│\n" "$MODIFIED files"
    echo "  └────────────────────────────────────────┘"
    echo ""
    if [ "$MODIFIED" -gt 0 ]; then
        echo "  Files that will be MODIFIED:"
        echo "$DIFF" | grep "^Files " | sed 's|Files \(.*\) and .* differ|    ~ \1|' | sed "s|$BACKUP/||" | head -20
        [ "$MODIFIED" -gt 20 ] && echo "    ... and $((MODIFIED - 20)) more"
        echo ""
    fi
    if [ "$REMOVED" -gt 0 ]; then
        echo "  Files that will be REMOVED from the live site:"
        echo "$DIFF" | grep "^Only in $BACKUP" | sed "s|Only in $BACKUP[/]*: |    - |" | head -20
        [ "$REMOVED" -gt 20 ] && echo "    ... and $((REMOVED - 20)) more"
        echo ""
    fi
    if [ "$ADDED" -gt 0 ]; then
        echo "  Files that will be ADDED:"
        echo "$DIFF" | grep "^Only in $BUILD_DIR" | sed "s|Only in $BUILD_DIR[/]*: |    + |" | head -20
        [ "$ADDED" -gt 20 ] && echo "    ... and $((ADDED - 20)) more"
        echo ""
    fi
    OLD_COUNT=$(find "$BACKUP" -type f | wc -l | tr -d ' ')
    if [ "$OLD_COUNT" -gt 0 ] && [ "$REMOVED" -gt 0 ]; then
        REMOVED_PCT=$((REMOVED * 100 / OLD_COUNT))
        if [ "$REMOVED_PCT" -gt 20 ]; then
            echo "  WARNING: $REMOVED_PCT% of files would be removed!"
            echo ""
        fi
    fi
    read -p "  Proceed with deploy? [y/N] " ANSWER < /dev/tty || true
    if [[ ! "$ANSWER" =~ ^[Yy]$ ]]; then
        echo "  Deploy cancelled."
        exit 1
    fi
}

# ─── Status (checksum-based) ─────────────────────────────────
status() {
    if [ ! -d "$BUILD_DIR" ] || [ -z "$(ls -A "$BUILD_DIR" 2>/dev/null)" ]; then
        echo "No website/build/ directory found. Run 'just build' first."
        exit 1
    fi
    LOCAL_COUNT=$(find "$BUILD_DIR" -type f | wc -l | tr -d ' ')
    BACKUP=$(latest_backup)
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  Docs Build Status"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "  Build files:   $LOCAL_COUNT"
    if [ -z "$BACKUP" ]; then
        echo "  Last backup:   none found"
        echo ""
        echo "  Run 'just deploy' to create a backup and deploy."
        return 0
    fi
    BACKUP_COUNT=$(find "$BACKUP" -type f | wc -l | tr -d ' ')
    echo "  Backup files:  $BACKUP_COUNT (deployed $(backup_date "$BACKUP"))"
    echo ""

    # Build checksum maps: relative_path -> md5
    declare -A LOCAL_SUMS
    declare -A BACKUP_SUMS

    while IFS= read -r -d '' file; do
        rel="${file#$BUILD_DIR/}"
        LOCAL_SUMS["$rel"]=$(md5 -q "$file")
    done < <(find "$BUILD_DIR" -type f -print0)

    while IFS= read -r -d '' file; do
        rel="${file#$BACKUP/}"
        BACKUP_SUMS["$rel"]=$(md5 -q "$file")
    done < <(find "$BACKUP" -type f -print0)

    # Compare
    ADDED_FILES=()
    MODIFIED_FILES=()
    DELETED_FILES=()

    for rel in "${!LOCAL_SUMS[@]}"; do
        if [ -z "${BACKUP_SUMS[$rel]+x}" ]; then
            ADDED_FILES+=("$rel")
        elif [ "${LOCAL_SUMS[$rel]}" != "${BACKUP_SUMS[$rel]}" ]; then
            MODIFIED_FILES+=("$rel")
        fi
    done

    for rel in "${!BACKUP_SUMS[@]}"; do
        if [ -z "${LOCAL_SUMS[$rel]+x}" ]; then
            DELETED_FILES+=("$rel")
        fi
    done

    ADDED_COUNT=${#ADDED_FILES[@]}
    MODIFIED_COUNT=${#MODIFIED_FILES[@]}
    DELETED_COUNT=${#DELETED_FILES[@]}

    if [ "$ADDED_COUNT" -eq 0 ] && [ "$MODIFIED_COUNT" -eq 0 ] && [ "$DELETED_COUNT" -eq 0 ]; then
        echo "  Build matches the last deployed backup. No changes."
        echo ""
        return 0
    fi

    echo "  ┌────────────────────────────────────────┐"
    echo "  │  Changes Since Last Deploy             │"
    echo "  ├────────────────────────────────────────┤"
    printf "  │  Added:    %-28s│\n" "$ADDED_COUNT files"
    printf "  │  Modified: %-28s│\n" "$MODIFIED_COUNT files"
    printf "  │  Deleted:  %-28s│\n" "$DELETED_COUNT files"
    echo "  └────────────────────────────────────────┘"
    echo ""

    if [ "$MODIFIED_COUNT" -gt 0 ]; then
        echo "  Modified files:"
        IFS=$'\n' SORTED=($(printf '%s\n' "${MODIFIED_FILES[@]}" | sort)); unset IFS
        for i in "${!SORTED[@]}"; do
            [ "$i" -ge 15 ] && echo "    ... and $((MODIFIED_COUNT - 15)) more" && break
            echo "    ~ ${SORTED[$i]}"
        done
        echo ""
    fi

    if [ "$ADDED_COUNT" -gt 0 ]; then
        echo "  New files:"
        IFS=$'\n' SORTED=($(printf '%s\n' "${ADDED_FILES[@]}" | sort)); unset IFS
        for i in "${!SORTED[@]}"; do
            [ "$i" -ge 15 ] && echo "    ... and $((ADDED_COUNT - 15)) more" && break
            echo "    + ${SORTED[$i]}"
        done
        echo ""
    fi

    if [ "$DELETED_COUNT" -gt 0 ]; then
        echo "  Deleted files:"
        IFS=$'\n' SORTED=($(printf '%s\n' "${DELETED_FILES[@]}" | sort)); unset IFS
        for i in "${!SORTED[@]}"; do
            [ "$i" -ge 15 ] && echo "    ... and $((DELETED_COUNT - 15)) more" && break
            echo "    - ${SORTED[$i]}"
        done
        echo ""
    fi
}

# ─── Deploy ──────────────────────────────────────────────────
deploy() {
    BRANCH="${DEPLOY_BRANCH:-$PRODUCTION_BRANCH}"
    FILE_COUNT=$(find "$BUILD_DIR" -type f | wc -l | tr -d ' ')
    echo "Deploying $FILE_COUNT files to Cloudflare Pages project: $PROJECT (branch: $BRANCH)"
    npx wrangler pages deploy "$BUILD_DIR" \
        --project-name "$PROJECT" \
        --branch "$BRANCH" \
        --commit-dirty=true
    echo ""
    echo "  ┌──────────────────────────────────────────────────────┐"
    echo "  │  Deploy complete!                                    │"
    echo "  │  Live at: https://protocol.merchantprotocol.com      │"
    echo "  └──────────────────────────────────────────────────────┘"
}

# ─── Backups management ─────────────────────────────────────
backups_list() {
    ls -dt "$BACKUP_DIR"/${BACKUP_PREFIX}-* 2>/dev/null || echo "No backups found."
}

backups_clean() {
    COUNT=$(ls -d "$BACKUP_DIR"/${BACKUP_PREFIX}-* 2>/dev/null | wc -l | tr -d ' ')
    if [ "$COUNT" -eq 0 ]; then
        echo "No backups to clean."
        return 0
    fi
    echo "Found $COUNT backup(s):"
    ls -dt "$BACKUP_DIR"/${BACKUP_PREFIX}-*
    echo ""
    read -p "Remove all $COUNT backup(s)? [y/N] " ANSWER < /dev/tty || true
    if [[ ! "$ANSWER" =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        return 0
    fi
    rm -rf "$BACKUP_DIR"/${BACKUP_PREFIX}-*
    echo "Removed $COUNT backup(s)."
}

# ─── Run ─────────────────────────────────────────────────────
case "$COMMAND" in
    status)
        status
        ;;
    deploy)
        verify
        confirm
        backup
        deploy
        ;;
    deploy-preview)
        DEPLOY_BRANCH="preview"
        verify
        confirm
        backup
        deploy
        ;;
    backup)
        backup
        ;;
    verify)
        verify
        ;;
    backups)
        backups_list
        ;;
    clean-backups)
        backups_clean
        ;;
    *)
        echo "Usage: ./cloudflare.sh <command> [project]"
        echo ""
        echo "Commands:"
        echo "  status         Compare build against last backup"
        echo "  deploy         Verify, confirm, backup, and deploy to Cloudflare Pages"
        echo "  deploy-preview Deploy to preview branch"
        echo "  backup         Create a backup of current build"
        echo "  verify         Verify build completeness"
        echo "  backups        List all backups"
        echo "  clean-backups  Remove all backups"
        exit 1
        ;;
esac
