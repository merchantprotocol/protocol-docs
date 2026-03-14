# Cloudflare Pages

Protocol's Cloudflare plugin handles the full lifecycle of deploying a static WordPress site to Cloudflare Pages — preparing the output, verifying completeness, diffing against the last deploy, backing up, and pushing.

## How It Works

The typical workflow is:

1. Generate static files from WordPress (via Simply Static or similar)
2. Run `protocol cf:deploy` from your project directory

That single command runs five stages: **prepare** the output (fix URLs, handle 404), **verify** file counts and key pages, **review** a diff against the last deploy, **backup** the current state, and **deploy** to Cloudflare Pages via Wrangler.

You can also run each stage independently.

## Setup

### Enable the Plugin

```bash
protocol plugin:enable cloudflare
```

### Run the Setup Wizard

The fastest way to get started is the interactive wizard:

```bash
protocol cf:init
```

The wizard walks you through five steps:

1. **Wrangler authentication** — checks if you're logged in, offers to open the login flow
2. **Project connection** — lists your existing Cloudflare Pages projects and lets you pick one or create a new one
3. **Configuration** — asks for your production URL, local dev origin, static directory, and minimum file threshold
4. **Deploy exclusions** — scans your static directory for non-deploy files (docker-compose.yml, justfile, node_modules, etc.) and generates a `.cfignore`
5. **Save & verify** — writes everything to `protocol.json` and runs `cf:verify` to confirm the setup

If you've already configured, re-running `cf:init` offers to reconfigure.

### Manual Configuration

You can also configure manually by adding a `cloudflare` block to your project's `protocol.json`:

```json
{
  "cloudflare": {
    "project_name": "my-site",
    "production_url": "https://example.com",
    "local_origin": "https://localhost",
    "static_dir": "./static-output",
    "min_files": 500
  }
}
```

| Key              | Description                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| `project_name`   | Your Cloudflare Pages project name (as shown in the Cloudflare dashboard)                                          |
| `production_url` | The production URL that localhost references should be rewritten to                                                |
| `local_origin`   | The local development URL used during static generation (usually `https://localhost`)                              |
| `static_dir`     | Path to the static output directory, relative to project root. Use `.` if the project root is the deploy directory |
| `min_files`      | Minimum file count for verification to pass (default: `10`). Set higher for large sites like WordPress exports     |

And make sure Wrangler is authenticated: `npx wrangler login`.

---

## Commands

### `protocol cf:init`

Interactive setup wizard. Authenticates with Cloudflare, connects or creates a Pages project, configures `protocol.json`, and generates a `.cfignore` file. Safe to re-run — detects existing configuration and offers to update.

```bash
protocol cf:init
```

### `protocol cf:prepare`

Prepare static output for Cloudflare Pages deployment. This command does two things:

1. **404 handling** — Cloudflare Pages expects a `404.html` at the root of the deploy directory. If one doesn't exist but `404/index.html` does (the default WordPress/Simply Static output), it copies it into place.

2. **URL rewriting** — Static site generators that run against a local WordPress instance bake `https://localhost` into the HTML, JavaScript, JSON-LD, and CSS output. This command scans all `.html`, `.js`, `.css`, `.json`, `.xml`, `.txt`, and `.svg` files and replaces the local origin with your production URL. It handles plain URLs, escaped-slash variants (common in JSON), and protocol-relative references.

```bash
protocol cf:prepare
```

```
  ── Cloudflare · Prepare Static Output ─────────────────────

    ✓ 404.html already exists

    Scanning for localhost URLs...
    Replacing: https://localhost → https://merchantprotocol.com

    ✓ Replaced 847 occurrences across 82 files

    Preparation complete. Static output is ready for deployment.
```

Run this after generating static files and before deploying. It's also called automatically as the first step of `cf:deploy`.

### `protocol cf:deploy`

The full deployment pipeline. Runs all five stages in sequence:

```bash
protocol cf:deploy
```

```
  ┌─────────────────────────────────────────────────────────┐
  │   CLOUDFLARE PAGES · Deploy                             │
  │   Project: merchantprotocol                             │
  └─────────────────────────────────────────────────────────┘

  ── [1/5] Prepare ─────────────────────────────────────────
  ── [2/5] Verify ──────────────────────────────────────────
  ── [3/5] Review Changes ──────────────────────────────────
  ── [4/5] Backup ──────────────────────────────────────────
  ── [5/5] Deploy ──────────────────────────────────────────
```

Each stage can halt the pipeline if something is wrong — missing files, too few pages, or if you decline the confirmation prompt. Backups are stored in `.backups/` with timestamps so you can always compare or roll back.

### `protocol cf:verify`

Verify that the static output is complete and ready to deploy. Checks that the output directory exists, has enough files (controlled by `min_files` in your config), and that key pages like `index.html` are present.

```bash
protocol cf:verify
```

### `protocol cf:status`

Compare your local static files against the last deployed backup. Shows added, modified, and deleted files using MD5 checksums.

```bash
protocol cf:status
```

### `protocol cf:backup`

Create a manual backup of the current static output.

```bash
protocol cf:backup
```

### `protocol cf:backups`

List or clean up deployment backups.

```bash
protocol cf:backups
protocol cf:backups --clean
```

---

## Configuration Reference

All configuration is stored in your project's `protocol.json` under the `cloudflare` key. These values are read by the helper at runtime — there's no global state.

| Config Key                  | Default               | Description                         |
| --------------------------- | --------------------- | ----------------------------------- |
| `cloudflare.project_name`   | `my-project`          | Cloudflare Pages project name       |
| `cloudflare.production_url` | `https://example.com` | Production URL for URL rewriting    |
| `cloudflare.local_origin`   | `https://localhost`   | Local origin to find and replace    |
| `cloudflare.static_dir`     | `./static-output`     | Static output directory path        |
| `cloudflare.min_files`      | `10`                  | Minimum file count for verification |

---

## Excluding Files with .cfignore

If your deploy directory contains files you don't want included — source configs, Docker files, build scripts — create a `.cfignore` file in the root of your static directory. It works like `.gitignore`:

```
# Build and development files
docker-compose.yml
justfile
Makefile
protocol.json
protocol.lock

# Directories
nginx.d/
cron.d/
functions/
.backups/

# Patterns
*.log
*.sh
```

When a `.cfignore` is present, excluded files are:

- **Not counted** during `cf:verify` (so `min_files` reflects only deployable content)
- **Not checksummed** during `cf:status` diffs (so you don't see noise from config changes)
- **Not scanned** during `cf:prepare` URL rewriting (so source files are never modified)

The `.cfignore` file itself is not deployed — Wrangler ignores files starting with `.` by default.

> For projects where `static_dir` is `.` (the project root is the deploy directory), `.cfignore` is essential. For projects with a dedicated `static-output/` directory, it's usually not needed since only generated files live there.

---

## Why Prepare Matters

When you generate a static site from a local WordPress instance, every URL that WordPress produces — canonical links, JSON-LD structured data, Open Graph meta tags, script paths, stylesheet references — contains the local development URL (typically `https://localhost`).

If you deploy these files as-is, you'll see issues like:

- SEO structured data pointing to `https://localhost/about/` instead of your real domain
- Canonical tags telling search engines the wrong URL
- Asset references that break when loaded from the production domain
- `dns-prefetch` and `preconnect` hints pointing nowhere useful

The `cf:prepare` step fixes all of this automatically before deployment, so you never have to think about it.
