# Claude Handoff

Last Updated: 2026-03-05 (KST, ASYNC-001 sync→async conversion complete)
Branch: `main`
Baseline commit: `8df5a22`

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
- **UI screens blocked on designer reference.**
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
- `src/components/remotion-preview.tsx`: Client component wrapping @remotion/player.
- `src/app/projects/[id]/preview/page.tsx`: Server component with DB fetch + status guard.
- Preview API route updated with complete RemotionInputProps.
- Ratio toggle (9:16 / 1:1 / 16:9) with live composition switching.

8. ~~Sync → Async conversion (ASYNC-001)~~ — Done
- `generate`: POST 202 + GET polling + `processGeneration()` background function.
- `remotion/render`: POST 202 + `processRender()` background (poll via existing `/remotion/status`).
- `export`: POST 202 + GET polling + `processExport()` background function.
- All verified with dev server curl tests: 202 → polling → done.

9. Implement UI screens
- `/` home: start CTA, BYOI CTA, recent projects.
- `/projects/:id/editor`: node canvas shell and stage actions.
- `/projects/:id/result`: artifact outputs and usage summary.

10. Align docs after each milestone
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
