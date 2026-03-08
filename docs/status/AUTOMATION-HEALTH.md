# Automation Health

Checked At: 2026-03-08 04:00 KST (takdi-dawn-pipeline)

| automation | schedule | status | lock | latest_artifact | note |
|---|---|---|---|---|---|
| docs-nightly-organizer | daily 23:00 KST | HEALTHY | LOCK_STUCK | docs/weekly/2026-W10.md (created 2026-03-06) | last run: 2026-03-06 23:00; lock created 2026-03-06 14:21 — STUCK (>60h) |
| code-doc-align | daily 21:30 KST | HEALTHY | LOCK_STUCK | INTEGRITY-REPORT.md | last run: 2026-03-06 23:00; lock created 2026-03-06 14:21 — STUCK (>60h) |
| architecture-diagrams-sync | daily 04:00 KST | HEALTHY | LOCK_CLEAR | PROJECT-STATUS.md, INTEGRITY-REPORT.md | ran 2026-03-08 04:00 KST |
| automation-health-monitor | daily 04:00 KST | HEALTHY | LOCK_CLEAR | AUTOMATION-HEALTH.md | ran 2026-03-08 04:00 KST |

| skill | path | status |
|---|---|---|
| sprint-docs-sync | .claude/skills/meta/sprint-docs-sync/SKILL.md | HEALTHY |
| api-contract-sync | .claude/skills/takdi-guide/core/api-contract-sync/SKILL.md | HEALTHY |
| usage-ledger-guard | .claude/skills/takdi-guide/core/usage-ledger-guard/SKILL.md | HEALTHY |
| pre-commit-validate | .claude/skills/takdi-guide/ops/pre-commit-validate/SKILL.md | HEALTHY |

State enum: `HEALTHY`, `RUNNING`, `STALE`, `MISSING`, `STUCK`, `FILE_MISSING`

## Summary
- automation healthy: 4/4 prompts present; 2/2 nightly automations BLOCKED by STUCK locks
- skills healthy: 4/4
- locks: 2 STUCK, 1 CLEAR — **CRITICAL: manual intervention required**
- errors: 2 stuck locks (docs/.docs-nightly.lock, docs/status/.code-doc-align.lock)
- warnings: Locks have been stuck >60 hours; automation pipeline blocked since 2026-03-07 14:06

## Lock Status (READ-ONLY — do not auto-unlock)
- `docs/.docs-nightly.lock`: created 2026-03-06 14:21 KST, age 60+ hours — **REQUIRES MANUAL REMOVAL**
- `docs/status/.code-doc-align.lock`: created 2026-03-06 14:21 KST, age 60+ hours — **REQUIRES MANUAL REMOVAL**
- `docs/ref/.architecture-sync.lock`: not present (CLEAR)

## Immediate Actions Required
1. **Remove stuck locks manually** (do not auto-unlock per policy):
   - `docs/.docs-nightly.lock`
   - `docs/status/.code-doc-align.lock`
2. Trigger docs-nightly-organizer catch-up run after locks cleared
3. Trigger code-doc-align catch-up run after nightly-organizer completes
4. Update SKILL-DOC-MATRIX.md label from "UX-005 complete" to "C2 complete" (manual fix from INTEGRITY-REPORT)

## Next Dawn Pipeline Run
- Expected: 2026-03-09 04:00 KST
- Condition: Stuck locks must be cleared before then for nightly automation to resume
