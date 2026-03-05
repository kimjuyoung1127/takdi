# Takdi Architecture

Last Updated: 2026-03-05 (KST)

## Core Principle
- UX is single-user simple.
- Data and authorization are workspace-scoped for future multi-tenant expansion.

## High-Level Components
- Frontend: Next.js App Router
- API Layer: Next.js route handlers
- Data Layer: Prisma + SQLite
- Generation Layer: Ollama-driven content generation jobs
- Render Layer: Remotion preview and render pipeline

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
