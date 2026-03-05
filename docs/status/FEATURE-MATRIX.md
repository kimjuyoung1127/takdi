# Feature Matrix

Last Updated: 2026-03-05 (KST, backend APIs complete)
Status enum: `Not Started | In Progress | Done | Blocked | Deferred`

| ID | Feature | Status | Owner | Notes |
|---|---|---|---|---|
| BOOT-001 | Runtime bootstrap (Next.js + Prisma + SQLite + seed) | Done | claude | 9 models, types, workspace guard |
| CORE-001 | Workspace-scoped project CRUD | Done | claude | 6 MVP API routes, workspace guard enforced |
| CORE-002 | Text brief input and parse entry | Not Started | unassigned | TXT/paste |
| CORE-003 | Multi-image asset upload | Done | claude | POST /api/projects/:id/assets + BYOI validator |
| AI-001 | Brief-to-sections generation | Not Started | unassigned | Ollama pipeline |
| AI-002 | Image-slot mapping | Not Started | unassigned | per section |
| AI-003 | Manual edit save loop | Done | claude | PATCH /api/projects/:id/content |
| UI-001 | Node main editor canvas | Not Started | unassigned | left palette + center canvas + right panel |
| IMG-004 | BYOI validation and original lock | Done | claude | byoi-validator + preserveOriginal + cuts/handoff |
| AUD-001 | BGM analysis gate | Done | claude | POST /api/projects/:id/bgm + bgm-analyzer (duration gate) |
| VID-001 | Remotion composition baseline | Not Started | unassigned | 9:16, 1:1, 16:9 |
| VID-002 | Browser preview integration | Not Started | unassigned | @remotion/player |
| VID-003 | Remotion preview + render pipeline | Done | claude | preview/render/status API stubs with UsageLedger |
| OUT-001 | Export artifact generation | Done | claude | POST /api/projects/:id/export (stub) |
| OPS-001 | Usage ledger monthly aggregation | Done | claude | GET /api/usage/me with summary |
| BILL-001 | Billing integration | Deferred | unassigned | after gate pass |
| TEAM-001 | Team roles and invites | Deferred | unassigned | after gate pass |
