# Takdi Project Status

Last Updated: 2026-03-05 (KST, UI-001 Home + Node Editor)

## Current Phase
- Runtime bootstrap completed.
- All backend API routes implemented (17 endpoints, all async where applicable).
- Brief text parser implemented (CORE-002): headings/paragraphs → structured sections.
- Remotion composition baseline implemented (VID-001): 3 ratios (9:16, 1:1, 16:9).
- Gemini AI generation implemented (AI-001): `@google/genai` + structured output + fallback.
- Imagen image generation implemented (AI-002): async job + polling + file save + Asset record.
- Browser preview implemented (VID-002): @remotion/player + preview page + ratio toggle.
- Async conversion completed (ASYNC-001): generate, render, export routes → fire-and-forget + polling.
- UI screens implemented (UI-001): Tailwind v4 + shadcn/ui + React Flow.
  - Home: mode cards, BYOI CTA, recent projects list.
  - Editor: 3-panel layout (palette + canvas + properties), floating toolbar, bottom logger.
  - Preview: Tailwind migration from inline styles.
  - 8 folder CLAUDE.md files, code-conventions skill.
- Next target: real data integration (editor ↔ API 연결), E2E 테스트.

## Gate
- Validation gate: 20 real outputs completed.
- Subscription expansion remains `Deferred` until gate pass.

## Current Strategy
- Single-user UX first.
- Multi-tenant-ready internal model.
- Billing integration deferred.

## Contract Snapshot
- `ProjectStatus`: `draft | generating | generated | failed | exported`
- `PlanTier`: `solo_free`
- Core APIs (async endpoints return 202 + jobId):
  - `POST /api/projects`
  - `POST /api/projects/:id/generate` → 202
  - `GET /api/projects/:id/generate?jobId=xxx` (poll)
  - `GET /api/projects/:id`
  - `PATCH /api/projects/:id/content`
  - `POST /api/projects/:id/export` → 202
  - `GET /api/projects/:id/export?jobId=xxx` (poll)
  - `POST /api/projects/:id/remotion/render` → 202
  - `GET /api/projects/:id/remotion/status` (poll)
  - `GET /api/usage/me`

## Next Actions
1. ~~Implement DB schema~~ — Done (prisma/schema.prisma, 9 models, seed complete).
2. ~~Implement project APIs~~ — Done (6 MVP routes with workspace scope guard, status transitions, usage ledger).
3. ~~Implement node editor shell (`/projects/:id/editor`) and BYOI entry path~~ — Done (UI-001: Home + Editor + Preview Tailwind migration).
4. ~~Implement cuts/handoff, remotion/preview, remotion/render, remotion/status~~ — Done (stubs with DB records).
5. ~~Implement brief text parser (CORE-002)~~ — Done (src/services/brief-parser.ts, generate route integrated).
6. ~~Implement Remotion composition baseline (VID-001)~~ — Done (3 compositions + entry + config).
7. ~~Implement Gemini AI generation (AI-001)~~ — Done (gemini-generator service + generate route + fallback).
8. ~~Implement Imagen image generation (AI-002)~~ — Done (imagen-generator + async job + polling + save-generated-image).
9. ~~Implement browser preview (VID-002)~~ — Done (@remotion/player + preview page + ratio toggle).
10. ~~Convert sync routes to async (ASYNC-001)~~ — Done (generate, render, export → 202 + fire-and-forget + polling).
11. ~~Implement UI screens (UI-001)~~ — Done (Home + Editor + Preview, 20+ components, Tailwind v4 + shadcn/ui + React Flow).
12. Keep docs synchronized using `docs/status/CLAUDE-HANDOFF.md` checklist.

## Risks
- Scope creep into billing/team features before validation gate.
- Drift between planning docs and API/type implementation.

## Drift
- status-model drift: 0
- api-contract drift: 0 (doc baseline)
