# Takdi Architecture

Last Updated: 2026-03-05 (KST, ASYNC-001 complete)

## Core Principle
- UX is single-user simple.
- Data and authorization are workspace-scoped for future multi-tenant expansion.

## High-Level Components
- Frontend: Next.js 15 App Router + React 19
- API Layer: Next.js route handlers (17 endpoints, async fire-and-forget + polling)
- Data Layer: Prisma 6 + SQLite
- Text Generation: Gemini 2.5 Flash (`@google/genai`, structured output) + brief-parser fallback
- Image Generation: Imagen 4.0 (`@google/genai`, async job + polling)
- Render Layer: Remotion 4 compositions + @remotion/player browser preview
- Async Pattern: POST → 202 + jobId, background processing, GET polling (generate, generate-images, render, export)

## Domain Model Spine
- `User -> Membership -> Workspace`
- `Workspace -> Project -> Asset`
- `Project -> GenerationJob -> ExportArtifact`
- `Workspace -> UsageLedger`

## Lifecycle
1. Create project.
2. Attach brief/assets.
3. Start generation job.
4. Persist generated sections.
5. Save manual edits.
6. Export output artifact.
7. Record usage event.

## Guardrails
- Hard limit to one workspace in MVP runtime.
- All write/read operations require workspace scope.
- Billing entities deferred until post-validation.
