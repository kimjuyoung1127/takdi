# Skill Doc Matrix

Last Updated: 2026-03-05 (KST)

## Phase 1 Active Skills
| skill | tier | required_docs | target_area | acceptance |
|---|---|---|---|---|
| `sprint-docs-sync` | required | `PROJECT-STATUS`, `FEATURE-MATRIX`, `INTEGRITY-REPORT` | docs/status | no drift between status docs |
| `api-contract-sync` | required | `SCHEMA-INDEX`, `PROJECT-STATUS` | api/types | contract section updated with API changes |
| `usage-ledger-guard` | required | `SCHEMA-INDEX`, `FEATURE-MATRIX` | usage tracking | usage rules preserved |
| `pre-commit-validate` | required | `INTEGRITY-REPORT` | quality gate | checks run before commit |

## Phase 2 Expansion Skills
| skill | tier | required_docs | target_area | acceptance |
|---|---|---|---|---|
| `project-crud-add` | expansion | `PRD`, `ARCHITECTURE`, `SCHEMA-INDEX` | project domain | workspace scope preserved |
| `generation-pipeline-update` | expansion | `PRD`, `USER-FLOW` | generation domain | state lifecycle is valid |
| `remotion-render-sync` | expansion | `REMOTION-SPEC`, `ARCHITECTURE` | render domain | composition contract preserved |

## Integrity Gates
- Gate 1: `FEATURE-MATRIX` == `PROJECT-STATUS` == `SKILL-DOC-MATRIX`
- Gate 2: route gate enabled only after real route registry exists
