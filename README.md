# paycom-preview-staging

A password-protected preview deployment of the Pay.com documentation site, built with Next.js and Fumadocs.

## Syncing content from the source repo

Content is not edited here directly. It is synced from the official docs repo (`/home/heitor/repositorios/docs`) using the included script.

### Prerequisites

- The source repo must be on the `staging` branch before running the script.
- `rsync` must be available (pre-installed on WSL Ubuntu).

### Run the sync

```bash
# 1. Make sure the source repo is on staging
git -C /home/heitor/repositorios/docs checkout staging

# 2. Run the sync from the root of this repo
./sync-from-source.sh
```

The script prints a summary to the terminal and writes a full file-level log to `sync-logs/sync_YYYYMMDD_HHMMSS.log`.

### What gets synced

| Source path | Destination | Notes |
|---|---|---|
| `content/` | `content/` | All MDX and `meta.json` files |
| `scripts/` | `scripts/` | Documentation generation script |
| `src/` | `src/` | App code, components, lib, plugins |
| `openapi.yaml` | `openapi.yaml` | OpenAPI spec |
| `reorganized-openapi.yaml` | `reorganized-openapi.yaml` | Reorganized spec |
| `package.json` | `package.json` | Dependencies |

### What is never touched

- `src/middleware.ts` — basic auth protection for this staging deployment
- `next.config.ts` — redirect rules specific to this repo
- `source.config.ts`, `tsconfig.json`, `.env.local` — local configuration
- `sync-logs/` — log files from previous syncs

### Log files

Each run writes a timestamped log to `sync-logs/`. The log records:

- `[NEW]` — file did not exist in destination and was created
- `[OVERWRITTEN]` — file existed and was replaced (content differed)
- `[SKIP]` — file not found in source, destination unchanged

Files with identical content are silently skipped (rsync checksum match).

### Safety notes

- The script aborts if the source repo is not on `staging`. Switch the branch first.
- Re-running the script is safe — only files with changed content are transferred.
- Files present in the destination but absent from the source are never deleted.
