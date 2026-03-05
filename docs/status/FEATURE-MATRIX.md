# Feature Matrix

Last Updated: 2026-03-05 (KST, UI-001 Home + Node Editor)
Status enum: `Not Started | In Progress | Done | Blocked | Deferred`

| ID | Feature | Status | Owner | Notes |
|---|---|---|---|---|
| BOOT-001 | Runtime bootstrap (Next.js + Prisma + SQLite + seed) | Done | claude | 9 models, types, workspace guard |
| CORE-001 | Workspace-scoped project CRUD | Done | claude | 6 MVP API routes, workspace guard enforced |
| CORE-002 | Text brief input and parse entry | Done | claude | brief-parser service + generate route integration |
| CORE-003 | Multi-image asset upload | Done | claude | POST /api/projects/:id/assets + BYOI validator |
| AI-001 | Brief-to-sections generation | Done | claude | Gemini 2.5 Flash + structured output + brief-parser fallback + async 202 |
| AI-002 | Image-slot mapping | Done | claude | Imagen 4.0 + async job + polling + save-generated-image |
| AI-003 | Manual edit save loop | Done | claude | PATCH /api/projects/:id/content |
| UI-001 | Node main editor canvas | Done | claude | Home + Editor screens: Tailwind v4, shadcn/ui, React Flow, 20+ components |
| IMG-004 | BYOI validation and original lock | Done | claude | byoi-validator + preserveOriginal + cuts/handoff |
| AUD-001 | BGM analysis gate | Done | claude | POST /api/projects/:id/bgm + bgm-analyzer (duration gate) |
| VID-001 | Remotion composition baseline | Done | claude | 3 compositions (916/1x1/169) + Root + entry + config |
| VID-002 | Browser preview integration | Done | claude | @remotion/player + preview page + ratio toggle |
| VID-003 | Remotion preview + render pipeline | Done | claude | preview/render/status API + async 202 render |
| OUT-001 | Export artifact generation | Done | claude | POST /api/projects/:id/export + async 202 + polling |
| OPS-001 | Usage ledger monthly aggregation | Done | claude | GET /api/usage/me with summary |
| BILL-001 | Billing integration | Deferred | unassigned | after gate pass |
| TEAM-001 | Team roles and invites | Deferred | unassigned | after gate pass |
