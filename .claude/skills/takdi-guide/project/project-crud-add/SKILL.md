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
3. Update docs if behavior changes.

## Validation
- No cross-workspace access path exists.
