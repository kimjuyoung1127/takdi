# Takdi Orchestration Index

Automation-first documentation index for Takdi.

## Repo Boundary
- Write repo: `C:\Users\gmdqn\takdi`

## Context Loading Order
1. `CLAUDE.md` (this file)
2. `ai-context/START-HERE.md`
3. `docs/status/CLAUDE-HANDOFF.md`
4. `ai-context/master-plan.md`
5. `docs/status/PROJECT-STATUS.md`
6. `docs/status/FEATURE-MATRIX.md`
7. `docs/status/SKILL-DOC-MATRIX.md`
8. `docs/ref/PRD.md`
9. `docs/ref/ARCHITECTURE.md`
10. `docs/ref/SCHEMA-INDEX.md`
11. `docs/ref/REMOTION-SPEC.md`

## Execution Rules (MUST)
1. Keep status file names stable for automation.
2. Update `PROJECT-STATUS.md` and `FEATURE-MATRIX.md` together.
3. Preserve API/type contracts documented in `docs/ref/SCHEMA-INDEX.md`.
4. Run docs automation in `DRY_RUN=true` before real runs.
5. Do not auto-unlock stuck lock files.
6. Keep root documents slim; long-lived specs live in `docs/ref`.
7. New `.ts`/`.tsx` files: add `/** brief description */` JSDoc at top.
8. New folders: create a `CLAUDE.md` describing folder structure, files, and conventions.
9. When adding/moving files: update the relevant folder's `CLAUDE.md`.

## Subagent Rules
- 문서 정합성 체크 시 반드시 Explore 서브에이전트 2~3개 병렬 사용
  - 서브A: 코드 진실 수집 (blocks.ts, constants.ts, API route 목록)
  - 서브B: 문서 숫자 추출 (SCHEMA-INDEX, FEATURE-MATRIX, PROJECT-STATUS)
  - 메인: 두 결과 비교 → 불일치만 직접 수정
- 3개 이상 파일 읽고 요약/비교해야 하는 탐색은 서브에이전트 위임
- 단일 파일 수정, 에러 디버깅, Git 작업은 메인이 직접

## Source of Truth
- Product scope: `docs/ref/PRD.md`
- Architecture: `docs/ref/ARCHITECTURE.md`
- Data/API/type contract: `docs/ref/SCHEMA-INDEX.md`
- Remotion spec: `docs/ref/REMOTION-SPEC.md`
- User flow: `docs/ref/USER-FLOW.md`
- Wireframe spec: `docs/ref/WIREFRAME-NODE-BYOI.md`
- Runtime status: `docs/status/PROJECT-STATUS.md`
- Implementation handoff: `docs/status/CLAUDE-HANDOFF.md`

## Completion Format
- Scope / Files / Validation / Risks / Next Actions
