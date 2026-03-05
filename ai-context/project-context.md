# Takdi Project Context

Last Updated: 2026-03-05 (KST)

## Product
- Input: product text brief + image assets + template + BGM.
- Output: generated detail-page content and export artifacts.

## Technical Direction
- Web: Next.js App Router + TypeScript.
- Data: Prisma + SQLite for MVP.
- Video: Remotion rendering and preview.
- AI: Ollama-based text analysis and structure generation.

## Operating Constraints
- Single-user workflow first.
- Internal workspace scoping preserved for later multi-tenant migration.
- Billing integration intentionally deferred.

## Contract Snapshot
- ProjectStatus: `draft | generating | generated | failed | exported`
- PlanTier: `solo_free` (future: `starter | pro | agency`)
- Core APIs:
  - `POST /api/projects`
  - `POST /api/projects/:id/generate`
  - `GET /api/projects/:id`
  - `PATCH /api/projects/:id/content`
  - `POST /api/projects/:id/export`
  - `GET /api/usage/me`
