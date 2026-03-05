# Takdi Coding Guideline

## General
- Keep API and type contracts backward compatible.
- Prefer additive changes over destructive rewrites.
- Keep docs and implementation status synchronized.

## Documentation Discipline
- If feature state changes, update both:
  - `docs/status/PROJECT-STATUS.md`
  - `docs/status/FEATURE-MATRIX.md`
- If API/type shape changes, update:
  - `docs/ref/SCHEMA-INDEX.md`
  - `docs/status/SKILL-DOC-MATRIX.md`

## Safety
- Do not auto-remove lock files marked as running.
- Keep `DRY_RUN=true` for first automation execution.
- Use KST timestamps in status documents.
