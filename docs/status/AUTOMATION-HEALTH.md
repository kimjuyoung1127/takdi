# Automation Health

Checked At: 2026-03-06 04:00 KST (takdi-dawn-pipeline)

| automation | schedule | status | lock | latest_artifact | note |
|---|---|---|---|---|---|
| docs-nightly-organizer | daily 22:00 KST | MISSING | LOCK_CLEAR | - | prompt not found |
| code-doc-align | daily 21:30 KST | MISSING | LOCK_CLEAR | - | prompt not found |
| architecture-diagrams-sync | daily 04:00 KST | HEALTHY | LOCK_CLEAR | PROJECT-STATUS.md, INTEGRITY-REPORT.md | ran 2026-03-06 04:00 KST |
| automation-health-monitor | daily 09:30 KST | HEALTHY | LOCK_CLEAR | AUTOMATION-HEALTH.md | ran 2026-03-06 04:00 KST |

| skill | path | status |
|---|---|---|
| sprint-docs-sync | .claude/skills/meta/sprint-docs-sync/SKILL.md | HEALTHY |
| api-contract-sync | .claude/skills/takdi-guide/core/api-contract-sync/SKILL.md | HEALTHY |
| usage-ledger-guard | .claude/skills/takdi-guide/core/usage-ledger-guard/SKILL.md | HEALTHY |
| pre-commit-validate | .claude/skills/takdi-guide/ops/pre-commit-validate/SKILL.md | HEALTHY |

State enum: `HEALTHY`, `RUNNING`, `STALE`, `MISSING`, `STUCK`, `FILE_MISSING`

## Summary
- automation healthy: 2/4 (docs-nightly-organizer, code-doc-align prompts not present)
- skills healthy: 4/4
- locks: all CLEAR (no stuck processes)
- errors: none
- warnings: 2 automations show MISSING status (docs-nightly-organizer, code-doc-align)
