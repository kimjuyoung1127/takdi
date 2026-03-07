# Skill Doc Matrix

Last Updated: 2026-03-06 (KST, UX-005 complete)

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

## Phase 3 Implementation Skills
| skill | tier | required_docs | target_area | acceptance |
|---|---|---|---|---|
| `gemini-api-call` | implementation | `SCHEMA-INDEX`, `gemini-generator.ts` | AI generation | structured output + retry + client key |
| `async-job-pattern` | implementation | `SCHEMA-INDEX`, `GenerationJob model` | async pipeline | fire-and-forget + polling + job status |
| `code-conventions` | required | folder `CLAUDE.md`, file headers | all source | API↔FE 1:1 mapping, folder CLAUDE.md, JSDoc headers |

## Domain Knowledge Skills
| skill | tier | required_docs | target_area | acceptance |
|---|---|---|---|---|
| `detail-page-knowledge` | domain | `PRD`, `WIREFRAME-NODE-BYOI`, `USER-FLOW` | UI/UX, product design | UI copy follows Korean tone, blocks cover 9 standard sections, output specs match platform rules |

## Compose Skills
| skill | tier | required_docs | target_area | acceptance |
|---|---|---|---|---|
| `block-renderer-pattern` | compose | `blocks.ts`, renderers barrel | block renderers | renderer follows pattern, barrel registered |
| `shared-compose-component` | compose | `api-client.ts`, compose-context | shared components | upload/edit components reusable |
| `block-type-add` | compose | `blocks.ts`, `SCHEMA-INDEX`, `FEATURE-MATRIX` | new block creation | 10-step checklist complete, tsc passes |
| `image-asset-upload-pattern` | compose | `api-client.ts`, compose-context, shared components | image upload | uploadAsset() unified, readOnly guarded |
| `editor-interactive-pattern` | compose | `block-canvas`, `compose-shell`, dnd-kit | editor interaction | drag/select/keyboard/readOnly all covered |

## Integrity Gates
- Gate 1: `FEATURE-MATRIX` == `PROJECT-STATUS` == `SKILL-DOC-MATRIX`
- Gate 2: route gate enabled only after real route registry exists
