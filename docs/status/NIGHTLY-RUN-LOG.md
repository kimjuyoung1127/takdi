# Nightly Run Log

Execution log for docs automation runs.

## Entry Template
- run_at:
- automation:
- dry_run:
- changes:
- errors:

## Runs
- run_at: 2026-03-05 00:00 KST
  - automation: bootstrap
  - dry_run: manual
  - changes: documentation baseline initialized
  - errors: none

- run_at: 2026-03-05 14:30 KST
  - automation: migration-bootstrap
  - dry_run: manual
  - changes: ref/status/ai-context/.claude templates initialized
  - errors: none

- run_at: 2026-03-06 23:00 KST
  - automation: docs-nightly-organizer
  - dry_run: false
  - changes:
    - moved_ref_count: 0
    - moved_status_count: 0
    - moved_daily_count: 0
    - weekly_created_or_updated: docs/weekly/2026-W10.md (created)
  - errors: none
