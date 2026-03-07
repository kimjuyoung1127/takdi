---
name: project-crud-add
description: Add or modify workspace-scoped project CRUD safely.
---

## Trigger
- Use when creating or changing project CRUD endpoints.

## Read First
1. `docs/ref/PRD.md`
2. `docs/ref/ARCHITECTURE.md`
3. `docs/ref/SCHEMA-INDEX.md`

## Do
1. Keep CRUD operations workspace-scoped.
2. Preserve single-workspace runtime guard.
   - Guard 소스: `src/lib/workspace-guard.ts` (또는 미들웨어에서 workspaceId 주입)
   - 모든 프로젝트 쿼리에 `where: { workspaceId }` 포함 필수
3. Update docs if behavior changes.

## Validation
- No cross-workspace access path exists.
- 모든 Prisma 쿼리에 workspaceId 필터 포함
