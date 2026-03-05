# Takdi Project Status

Last Updated: 2026-03-06 (KST, UX-005 Auto-save + Project Summary)

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
- UI-API integration completed (UI-002): api-client layer, editor wiring (Run/Save/Preview/Export), properties panel (Assets/History/Cost), file restructure.
- UX improvements completed (UX-001~005):
  - UX-001: 전체 한글화 + 키보드 단축키 (Ctrl+S/Enter/Esc) + Delete 키 노드 삭제
  - UX-002: 빈 캔버스 온보딩 오버레이
  - UX-003: 파이프라인 중 노드 상태 실시간 반영 (StatusBadge 연동)
  - UX-004: 토스트 알림 (sonner) — 저장/생성/내보내기 성공·실패
  - UX-005: Properties 프로젝트 요약 + 단축키 가이드 + 30초 자동 저장 + 마지막 저장 시각 표시
- Next target: E2E 테스트, result 페이지 구현.

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
