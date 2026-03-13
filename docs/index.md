---
slug: /overview
---

# Deploy to Every Node in Seconds. Not Hours.

Protocol is a deployment CLI that turns your servers into self-healing, always-listening endpoints. Push a release, and every node picks it up — automatically. No build servers. No pipelines. No SSH chains. Just one command and your entire fleet is running the new version.

```
protocol deploy:push v1.2.0
```

That's it. Every node in your infrastructure sees the change and deploys it. Rollback is the same — one command, instant, across all nodes.

---

## The Problem with Traditional CI/CD

You know the drill. You merge to main and then you wait.

Your pipeline kicks off a build. It runs tests. It packages an artifact. It pushes to a registry. Then a deploy script SSHs into each server — one by one — pulls the image, restarts the service, and prays nothing breaks. If you have 20 nodes, you're waiting for 20 sequential deploys. If one fails, you're debugging YAML at 2am.

Traditional CI/CD was designed for a world where deployments were rare events. But modern teams deploy daily — sometimes hourly. And the infrastructure hasn't kept up:

- **Slow rollouts** — Nodes update sequentially. A 20-node fleet can take 30+ minutes to fully deploy.
- **Fragile pipelines** — One flaky step in a 15-stage pipeline and the whole deploy stalls. You're not shipping code — you're babysitting YAML.
- **SSH orchestration nightmares** — Ansible, Capistrano, deploy scripts — they all require a central controller that pushes to each node. If the controller dies mid-deploy, you're left with half your fleet on v1.2 and half on v1.1.
- **No instant rollback** — Rolling back means re-running the entire pipeline in reverse. That's not a rollback — that's another deploy.
- **Config drift** — Environment variables live in dashboards, vaults, CI secrets, and sticky notes. No single source of truth. No version history.

The fundamental flaw? Traditional CI/CD is **push-based**. A central system pushes code to passive servers. Every node is a destination that has to be reached, authenticated, and updated individually.

---

## A Fundamentally Different Architecture

Protocol flips the model. Instead of pushing code to servers, **your servers pull it themselves.**

Every node runs a lightweight daemon — **slave mode** — that constantly listens for one thing: "what version should I be running?" When you update the target version, every node independently detects the change, pulls the code, decrypts its secrets, rebuilds its containers, and starts serving traffic. No central controller. No SSH. No orchestration layer.

```
You run:                              Every node (simultaneously):
─────────                             ────────────────────────────
protocol deploy:push v1.2.0    ───▶   "v1.2.0? On it."
                                       ✓ git checkout tags/v1.2.0
                                       ✓ secrets decrypted
                                       ✓ containers rebuilt
                                       ✓ health check passed
                                       ✓ serving traffic
```

### Self-Healing by Design

Nodes aren't just deployment targets — they're autonomous agents. If a node reboots, it comes back up, checks the target version, and deploys it. If a container crashes, the daemon restarts it. If a node falls behind, it catches up on its own. There's no state to lose because the source of truth is always external — a git tag and a version pointer.

You don't manage individual servers. You declare the version you want, and your fleet converges on it.

### From 30 Minutes to 60 Seconds

Because every node acts independently and in parallel, fleet size doesn't affect deploy speed. Whether you have 3 nodes or 300, they all start deploying the moment the version pointer changes. The bottleneck isn't orchestration — it's your slowest container build. And with shadow deployment, even that happens in the background before you promote.

---

## Zero-Downtime Releases with Shadow Deployment

Speed is nothing without safety. Protocol's shadow deployment gives you zero-downtime releases with instant rollback — a true blue-green process at the node level.

Here's how it works: while your current version serves live traffic on port 80, Protocol builds the next version in a separate directory with its own containers on a shadow port. Once the shadow is healthy, you promote it — a sub-second port swap that puts the new version in front of traffic and keeps the old version on standby.

```
                Port 80 (live traffic)
                        │
                ┌───────┴────────┐
                │                │
           ┌────▼───┐      ┌────▼───┐
           │ v1.2.0 │      │ v1.3.0 │
           │ active │      │ shadow │
           │  :80   │      │ :8080  │
           └────────┘      └────────┘

1. v1.2.0 serves traffic on port 80
2. v1.3.0 builds in the background on port 8080
3. Health checks pass on :8080
4. Promote: v1.3.0 gets :80 — sub-second swap
5. Something wrong? Swap back in 1 second.
```

No downtime. No deploy-and-pray. You verify the new version is healthy before a single user sees it. And if something goes wrong after promotion, rollback is a one-second port swap — not a 30-minute pipeline re-run.

### Or Go Fast with Branch Mode

Not every environment needs blue-green. For development, staging, or fast-moving prototypes, Protocol's branch mode follows the tip of a git branch. Push a commit, and every node watching that branch pulls it automatically. No tags, no releases, no ceremony — just instant deploys on every push.

---

## Secrets and Config Management Across Environments

Most deployment tools stop at code. Protocol manages your entire environment — code, configuration, and secrets — as a single deployable unit.

### One Config Repo, Many Environments

Protocol uses a separate git repository for environment-specific files: `.env`, nginx configs, PHP settings, cron schedules. Each **branch** in the config repo maps to an environment — `production`, `staging`, `localhost-dev`. When Protocol starts, it symlinks the right config files into your application directory. Your app doesn't know the difference.

```
myapp/                    ← your code (same across all environments)
myapp-config/             ← your configs (branch per environment)
├── production branch     ← production .env, nginx.conf, php.ini
├── staging branch        ← staging .env, nginx.conf, php.ini
└── localhost-dev branch  ← local .env, nginx.conf, php.ini
```

### Encrypted Secrets in Git

Your `.env` files are encrypted with AES-256-GCM before they touch git. The encryption key lives on your machines — never in any repository. When a node starts, Protocol decrypts the secrets automatically. Your team commits secrets to version control without risk, and every environment gets exactly the files it needs.

```
Your Machine                    Git (safe to push)              Production Node
─────────────                   ──────────────────              ───────────────
.env (plaintext)  ──encrypt──▶  .env.enc (encrypted)  ──pull──▶  auto-decrypt
                                                                      │
                                                                      ▼
                                                                 .env (plaintext)
```

### Environment-Aware Nodes

Every node knows what environment it belongs to. Set `protocol config:env production` on your production servers and `protocol config:env staging` on staging. Protocol pulls the right config branch, decrypts the right secrets, and applies the right settings — automatically. No environment variables scattered across dashboards. No secrets in CI pipelines. One system, fully version-controlled.

---

## Quick Start

```bash
# Install Protocol
sudo curl -L "https://raw.githubusercontent.com/merchantprotocol/protocol/master/bin/install" | bash

# Set your environment
protocol config:env localhost-yourname

# Initialize a project
cd /path/to/your/repo
protocol init

# Start everything (slave mode + Docker + config)
protocol start

# Check status
protocol status
```

---

## Documentation

| Document                                         | Description                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------- |
| [Getting Started](getting-started.md)            | Install, init, config, deploy — step by step                              |
| [Deployment Strategies](deployment-types.md)     | Branch, release, and shadow mode — how they work and when to use each     |
| [Architecture Overview](architecture.md)         | System design, components, data flow, and namespace structure             |
| [Installation Guide](installation.md)            | System requirements, quick install, manual install, production node setup |
| [Command Reference](commands.md)                 | Complete reference for all CLI commands                                   |
| [Configuration Reference](configuration.md)      | `protocol.json` schema, config repo pattern, symlink mechanics            |
| [Secrets Management](secrets.md)                 | Encryption, key transfer, auto-decryption, GitHub Actions integration     |
| [Shadow Deployment](blue-green.md)               | Zero-downtime blue-green deploys with instant rollback                    |
| [SOC 2 Ready](soc2.md)                           | Trust Service Criteria mapping, automated checks, auditor-ready docs      |
| [SOC 2 Controls Matrix](soc2-controls-matrix.md) | Every SOC 2 criterion mapped to controls and evidence                     |
| [Security & Hardening](security.md)              | Encryption internals, audit logs, vulnerability scanning                  |
| [Incident Response](incident-response.md)        | Severity levels, detection, triage, containment, resolution               |
| [Key Rotation](key-rotation.md)                  | Step-by-step key rotation and rollback                                    |
| [Deployment SOPs](deployment-sops.md)            | Standard operating procedures for deploys, rollbacks, and hotfixes        |
| [Migration Guide](migration.md)                  | Upgrade from branch-based to release-based deployment                     |
| [Troubleshooting](troubleshooting.md)            | Common issues and fixes                                                   |

## Support

For issues and feature requests, visit the [GitHub repository](https://github.com/merchantprotocol/protocol).
