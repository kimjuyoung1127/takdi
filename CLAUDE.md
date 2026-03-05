# Takdi Orchestration Index

Automation-first documentation index for Takdi.

## Repo Boundary
- Write repo: `C:\Users\ezen601\Desktop\Jason\takdi`

## Context Loading Order
1. `CLAUDE.md` (this file)
2. `ai-context/START-HERE.md`
3. `ai-context/master-plan.md`
4. `docs/status/PROJECT-STATUS.md`
5. `docs/status/FEATURE-MATRIX.md`
6. `docs/status/SKILL-DOC-MATRIX.md`
7. `docs/ref/PRD.md`
8. `docs/ref/ARCHITECTURE.md`
9. `docs/ref/SCHEMA-INDEX.md`
10. `docs/ref/REMOTION-SPEC.md`

## Execution Rules (MUST)
1. Keep status file names stable for automation.
2. Update `PROJECT-STATUS.md` and `FEATURE-MATRIX.md` together.
3. Preserve API/type contracts documented in `docs/ref/SCHEMA-INDEX.md`.
4. Run docs automation in `DRY_RUN=true` before real runs.
5. Do not auto-unlock stuck lock files.
6. Keep root documents slim; long-lived specs live in `docs/ref`.

## Source of Truth
- Product scope: `docs/ref/PRD.md`
- Architecture: `docs/ref/ARCHITECTURE.md`
- Data/API/type contract: `docs/ref/SCHEMA-INDEX.md`
- Remotion spec: `docs/ref/REMOTION-SPEC.md`
- User flow: `docs/ref/USER-FLOW.md`
- Runtime status: `docs/status/PROJECT-STATUS.md`

## Completion Format
- Scope / Files / Validation / Risks / Next Actions
