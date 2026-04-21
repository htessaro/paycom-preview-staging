#!/usr/bin/env bash
# Syncs documentation content from the source repo into this preview repo.
# The source repo must be on the 'staging' branch before running.
set -euo pipefail

SRC="/home/heitor/repositorios/docs"
DST="/home/heitor/repositorios/paycom-preview-staging"
LOG_DIR="$DST/sync-logs"
LOG_FILE="$LOG_DIR/sync_$(date +%Y%m%d_%H%M%S).log"

COUNT_NEW=0
COUNT_OVERWRITTEN=0

# ─── Preflight ────────────────────────────────────────────────────────────────

[[ -d "$SRC/.git" ]] || { echo "ERROR: Source repo not found at $SRC"; exit 1; }
[[ -d "$DST/.git" ]] || { echo "ERROR: Destination repo not found at $DST"; exit 1; }

SRC_BRANCH=$(git -C "$SRC" rev-parse --abbrev-ref HEAD)
if [[ "$SRC_BRANCH" != "staging" ]]; then
  echo ""
  echo "  ERROR: Source repo is on branch '$SRC_BRANCH', not 'staging'."
  echo "  Switch branches first:"
  echo "    git -C \"$SRC\" checkout staging"
  echo ""
  exit 1
fi

SRC_COMMIT=$(git -C "$SRC" rev-parse HEAD)
mkdir -p "$LOG_DIR"

{
  echo "Sync started:  $(date '+%Y-%m-%d %H:%M:%S')"
  echo "Source:        $SRC"
  echo "Branch:        staging"
  echo "Commit:        $SRC_COMMIT"
  echo "Destination:   $DST"
  echo ""
} >> "$LOG_FILE"

# ─── Sync helper ──────────────────────────────────────────────────────────────
# Parses rsync --itemize-changes output. Format is 11 chars + space + path.
# ">f+++++++++" = new file (all attributes being set for first time)
# ">f" + other chars = existing file overwritten (checksum differed)
# No line = file unchanged (checksum matched, no transfer)

sync_path() {
  local label="$1" src_path="$2" dst_path="$3"
  shift 3
  local -a extra=("$@")

  echo "  Syncing $label"
  echo "--- $label ---" >> "$LOG_FILE"

  local output
  output=$(rsync \
    --archive \
    --checksum \
    --itemize-changes \
    "${extra[@]+"${extra[@]}"}" \
    "$src_path" \
    "$dst_path")

  while IFS= read -r line; do
    [[ -z "$line" ]] && continue
    local flags="${line:0:11}"
    local filepath="${line:12}"

    [[ "${flags:0:1}" != ">" ]] && continue  # only outgoing transfers
    [[ "${flags:1:1}" != "f" ]] && continue  # only regular files (skip dirs)

    if [[ "$flags" == ">f+++++++++" ]]; then
      echo "[NEW]         $filepath" >> "$LOG_FILE"
      COUNT_NEW=$((COUNT_NEW + 1))
    else
      echo "[OVERWRITTEN] $filepath" >> "$LOG_FILE"
      COUNT_OVERWRITTEN=$((COUNT_OVERWRITTEN + 1))
    fi
  done <<< "$output"
}

# ─── Directories ──────────────────────────────────────────────────────────────

for dir in content scripts; do
  if [[ -d "$SRC/$dir" ]]; then
    sync_path "$dir/" "$SRC/$dir/" "$DST/$dir/"
  else
    echo "  Skipping $dir/ (not found in source)"
    echo "[SKIP]        $dir/ — not found in source" >> "$LOG_FILE"
  fi
done

# src/ is synced with middleware.ts excluded — that file is custom to this repo
if [[ -d "$SRC/src" ]]; then
  sync_path "src/" "$SRC/src/" "$DST/src/" --exclude="/middleware.ts"
else
  echo "  Skipping src/ (not found in source)"
  echo "[SKIP]        src/ — not found in source" >> "$LOG_FILE"
fi

# ─── Individual root files ────────────────────────────────────────────────────

for file in openapi.yaml reorganized-openapi.yaml package.json; do
  if [[ -f "$SRC/$file" ]]; then
    sync_path "$file" "$SRC/$file" "$DST/$file"
  else
    echo "  Skipping $file (not found in source)"
    echo "[SKIP]        $file — not found in source" >> "$LOG_FILE"
  fi
done

# ─── Summary ──────────────────────────────────────────────────────────────────

{
  echo ""
  echo "═══════════════════════════════════════════"
  echo " Sync complete: $(date '+%Y-%m-%d %H:%M:%S')"
  echo " New files:     $COUNT_NEW"
  echo " Overwritten:   $COUNT_OVERWRITTEN"
  echo "═══════════════════════════════════════════"
} | tee -a "$LOG_FILE"

echo " Log saved to:  $LOG_FILE"
echo ""
