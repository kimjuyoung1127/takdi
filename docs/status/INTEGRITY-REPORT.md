# Code-Doc Integrity Report

Last Run: 2026-03-06 04:00 KST (takdi-dawn-pipeline)
Result: pass (1 metadata drift, 5 architecture drift items, no content drift)

## Validation Summary
- status docs present: yes
- ref docs present: yes
- ai-context docs present: yes
- automation prompts present: yes
- active skills present: yes

## 3-Axis Consistency (FEATURE-MATRIX ↔ PROJECT-STATUS ↔ SKILL-DOC-MATRIX)

| Axis Pair | Content Drift | Metadata Drift | Notes |
|---|---|---|---|
| FEATURE-MATRIX ↔ PROJECT-STATUS | 0 | 0 | Both at label "GAP-1", C1/C2 done in both |
| FEATURE-MATRIX ↔ SKILL-DOC-MATRIX | 0 | 1 | SKILL-DOC-MATRIX label "UX-005 complete" behind "GAP-1" |
| PROJECT-STATUS ↔ SKILL-DOC-MATRIX | 0 | 1 | Same — counted once |

## Architecture Drift (dawn pipeline — 2026-03-06)

| # | Item | Severity | Detail |
|---|---|---|---|
| 1 | API routes not enumerated in ARCHITECTURE.md | MEDIUM | "17 endpoints" stated but not itemized |
| 2 | 5 services missing from ARCHITECTURE.md | MEDIUM | removebg-service, kie-generator, section-to-blocks, byoi-validator, bgm-analyzer |
| 3 | Block type system undocumented | LOW | 13 BlockTypes defined in constants.ts; not referenced in ARCHITECTURE.md |
| 4 | FlowNodeType vs BlockType distinction undocumented | LOW | 9 FlowNodeTypes, 13 BlockTypes — architectural nuance missing |
| 5 | ExportArtifact types not enumerated | LOW | `type: String` in schema, no enum in constants.ts or ARCHITECTURE.md |

## Drift
- status-model drift: 0
- api-contract drift: 0
- metadata drift: 1 (SKILL-DOC-MATRIX `Last Updated` label: "UX-005 complete" → should be updated to current milestone "C2")
- architecture drift: 5 (HIGH: 0 / MEDIUM: 2 / LOW: 3)
- route drift: not enabled (board placeholder mode)

## Auto-Fix Applied
- INTEGRITY-REPORT overwritten with current findings (this file).
- INTEGRITY-HISTORY.ndjson entry appended.

## Manual Required
- Update `docs/status/SKILL-DOC-MATRIX.md` `Last Updated` label to reflect current milestone (C2 complete).

## Errors
- none
