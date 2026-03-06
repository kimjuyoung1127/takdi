# Claude Handoff

Last Updated: 2026-03-06 (KST, UX-010 undo/redo)
Branch: `main`
Baseline commit: `9fc29c0`

## Current Snapshot
- All backend API routes implemented (17 endpoints, async where applicable):
  - MVP: projects CRUD, generate (async 202), export (async 202), usage
  - Assets: image upload with BYOI validation, BGM upload with analysis
  - Image generation: async Imagen pipeline with polling
  - Cuts: handoff with preserveOriginal lock
  - Remotion: preview (complete), render (async 202), status (poll)
- **Browser preview page**: `/projects/:id/preview` with @remotion/player + ratio toggle.
- Services: byoi-validator, bgm-analyzer, brief-parser, **gemini-generator**, **imagen-generator**
- **Generate route uses Gemini AI** (`@google/genai`, gemini-2.5-flash) with brief-parser fallback.
- **Image generation uses Imagen** (`imagen-4.0-generate-001`) with async job + polling pattern.
- Client-provided API key supported (`body.apiKey` → future B2B key rotation).
- `styleParams` optional field ready for future category UI.
- **Remotion compositions created**: TakdiVideo_916/1x1/169 with entry point + config.
- Status transitions verified: draft → generating → generated → exported.
- UsageLedger records on generate, image_generation_start, export, render.
- `next build` and `tsc --noEmit` pass cleanly.
- **UI screens complete** with Korean localization and UX improvements (UX-001~005).
- Product flow and wireframe are fixed for:
  - node main editor
  - BYOI path
  - BGM analysis gate
  - Remotion preview/render

## Canonical Docs (Read in Order)
1. `docs/ref/WIREFRAME-NODE-BYOI.md`
2. `docs/ref/USER-FLOW.md`
3. `docs/ref/SCHEMA-INDEX.md`
4. `docs/status/FEATURE-MATRIX.md`
5. `docs/status/PROJECT-STATUS.md`

## Immediate Build Queue
1. ~~Bootstrap runtime~~ — Done
- Next.js + TypeScript + Prisma + SQLite running locally.
- Single-workspace guard implemented (`src/lib/workspace-guard.ts`).

2. ~~Implement data model~~ — Done
- 9 Prisma models with `Asset.sourceType` and `preserveOriginal` fields.

3. ~~Implement API layer~~ — Done
- 12 routes total: 6 MVP + assets + bgm + cuts/handoff + remotion preview/render/status.
- All workspace-scoped with status guards and usage ledger.

4. ~~Brief parser + Remotion compositions~~ — Done
- `src/services/brief-parser.ts`: 3-pass parser (split → extract → assign slots).
- Generate route integrated: stub replaced with parseBrief().
- `src/remotion/`: entry + Root + 3 composition components (916/1x1/169).
- `remotion.config.ts` + package.json scripts added.

5. ~~Gemini AI generation (AI-001)~~ — Done
- `src/services/gemini-generator.ts`: @google/genai SDK, gemini-2.5-flash, structured output.
- Generate route: Gemini → brief-parser fallback. Client apiKey supported.
- Job status transitions: queued → running → done/failed.
- Skill created: `.claude/skills/takdi-guide/generation/gemini-api-call/SKILL.md`.

6. ~~Imagen image generation (AI-002)~~ — Done
- `src/services/imagen-generator.ts`: Imagen 4.0, styleParams optional, callWithRetry.
- `src/lib/save-generated-image.ts`: base64 → file save + Asset record.
- `POST/GET /api/projects/:id/generate-images`: async job + polling pattern.
- Fire-and-forget background processing with GenerationJob status tracking.
- Skill created: `.claude/skills/takdi-guide/generation/async-job-pattern/SKILL.md`.

7. ~~Browser preview (VID-002)~~ — Done
- `src/components/preview/remotion-preview.tsx`: Client component wrapping @remotion/player.
- `src/app/projects/[id]/preview/page.tsx`: Server component with DB fetch + status guard.
- Preview API route updated with complete RemotionInputProps.
- Ratio toggle (9:16 / 1:1 / 16:9) with live composition switching.

8. ~~Sync → Async conversion (ASYNC-001)~~ — Done
- `generate`: POST 202 + GET polling + `processGeneration()` background function.
- `remotion/render`: POST 202 + `processRender()` background (poll via existing `/remotion/status`).
- `export`: POST 202 + GET polling + `processExport()` background function.
- All verified with dev server curl tests: 202 → polling → done.

9. ~~Implement UI screens (UI-001)~~ — Done
- Home: mode cards, BYOI CTA, recent projects.
- Editor: 3-panel layout, floating toolbar, bottom logger, React Flow canvas.
- Preview: Remotion player with ratio toggle.

10. ~~UI-API integration (UI-002)~~ — Done
- `src/lib/api-client.ts`: typed fetch wrappers for all 15 API endpoints.
- `src/hooks/use-async-job.ts` + `use-logger.ts`: polling and log management hooks.
- Editor wiring: Run All (generate→images pipeline), Save, Preview, Export, Stop.
- Properties panel: Assets upload (image/BGM), History (live logs), Cost (usage API).
- File move: `remotion-preview.tsx` → `src/components/preview/`.

11. ~~UX improvements (UX-001~005)~~ — Done
- UX-001: 전체 한글화 (12개 컴포넌트) + 키보드 단축키 (Ctrl+S/Enter/Esc) + Delete/Backspace 노드 삭제.
- UX-002: 빈 캔버스 온보딩 오버레이 (노드 0개 시 안내).
- UX-003: 파이프라인 중 노드 StatusBadge 실시간 변경 (`updateNodesByType`).
- UX-004: sonner 토스트 알림 (저장/생성/내보내기 성공·실패).
- UX-005: Properties 비선택 시 프로젝트 요약 + 단축키 가이드, 30초 자동 저장 + 마지막 저장 시각.
- `src/components/ui/sonner.tsx` 추가 (shadcn sonner).
- UX-006: 파이프라인 실행 중 엣지 `animated` 토글.
- UX-007: React Flow `MiniMap` 추가 (우하단 캔버스 조감).
- UX-008: 프로젝트 이름 인라인 편집 + API `name` 필드 추가.
- UX-009: 노드 우클릭 컨텍스트 메뉴 (복제/삭제/상태초기화).
- UX-010: Undo/Redo (Ctrl+Z/Ctrl+Shift+Z, 50단계 히스토리 스택).

12. Align docs after each milestone
- Update together:
  - `PROJECT-STATUS.md`
  - `FEATURE-MATRIX.md`
  - `SCHEMA-INDEX.md` (if contract changed)

## Acceptance Checklist
- User can finish one full path:
  - create project -> select mode/BYOI -> cut edit handoff -> BGM analyze -> remotion preview -> render -> export
- Project status transitions are valid:
  - `draft -> generating -> generated -> exported` (+ failed path)
- Usage event is recorded on generation/render/export.

## Guardrails
- Do not open billing/team features before gate (`20+ real outputs`).
- Do not change status file names in `docs/status`.
- Do not break workspace scoping even in single-user mode.
