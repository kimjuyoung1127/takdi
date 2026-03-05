---
name: api-contract-sync
description: Keep API routes and type contracts synchronized with docs.
---

## Trigger
- Use when API handlers or shared type contracts change.

## Read First
1. `docs/ref/SCHEMA-INDEX.md`
2. `docs/status/PROJECT-STATUS.md`
3. `docs/status/SKILL-DOC-MATRIX.md`

## Do
1. Update fixed API contract list.
2. Update type contract section.
3. Add drift notes when behavior differs.

## Validation
- API list includes all active endpoints.
- ProjectStatus/PlanTier definitions are unchanged or documented.
