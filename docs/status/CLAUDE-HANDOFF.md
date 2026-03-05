# Claude Handoff

Last Updated: 2026-03-05 (KST)
Branch: `main`
Baseline commit: `8828d88`

## Current Snapshot
- Documentation framework migration is complete.
- Product flow and wireframe are fixed for:
  - node main editor
  - BYOI path
  - BGM analysis gate
  - Remotion preview/render
- No core runtime/API implementation is done yet.

## Canonical Docs (Read in Order)
1. `docs/ref/WIREFRAME-NODE-BYOI.md`
2. `docs/ref/USER-FLOW.md`
3. `docs/ref/SCHEMA-INDEX.md`
4. `docs/status/FEATURE-MATRIX.md`
5. `docs/status/PROJECT-STATUS.md`

## Immediate Build Queue
1. Bootstrap runtime
- Ensure Next.js + TypeScript + Prisma + SQLite run locally.
- Keep single-workspace guard as default runtime policy.

2. Implement data model
- Add entities from `SCHEMA-INDEX.md`.
- Include:
  - `Asset.sourceType = uploaded | generated | byoi_edited`
  - `CutHandoffPayload.preserveOriginal` usage path

3. Implement API layer
- MVP fixed:
  - `POST /api/projects`
  - `POST /api/projects/:id/generate`
  - `GET /api/projects/:id`
  - `PATCH /api/projects/:id/content`
  - `POST /api/projects/:id/export`
  - `GET /api/usage/me`
- Planned for node+BYOI:
  - `POST /api/projects/:id/cuts/handoff`
  - `POST /api/projects/:id/remotion/preview`
  - `POST /api/projects/:id/remotion/render`
  - `GET /api/projects/:id/remotion/status`

4. Implement UI screens
- `/` home: start CTA, BYOI CTA, recent projects.
- `/projects/:id/editor`: node canvas shell and stage actions.
- `/projects/:id/result`: artifact outputs and usage summary.

5. Align docs after each milestone
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
