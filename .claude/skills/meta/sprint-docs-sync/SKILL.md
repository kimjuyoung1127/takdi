---
name: sprint-docs-sync
description: Sync status docs after implementation milestones.
---

## Trigger
- Use when sprint milestone completes or status docs drift.
- "문서 동기화", "상태 업데이트", "sprint sync"

## Read First
1. `docs/status/PROJECT-STATUS.md`
2. `docs/status/FEATURE-MATRIX.md`
3. `docs/status/SKILL-DOC-MATRIX.md`
4. `docs/status/INTEGRITY-REPORT.md`
5. `ai-context/master-plan.md`

## Do

### 1. PROJECT-STATUS.md 업데이트
- `## Current Phase` 섹션: 현재 phase 번호와 이름 갱신
- `## Completed` 섹션: 완료된 기능을 `- [x] 기능명 (날짜)` 형식으로 추가
- `## In Progress` 섹션: 진행 중 항목 갱신, 완료 항목은 Completed로 이동
- `## Next Actions` 섹션: 다음 우선순위 항목 갱신

### 2. FEATURE-MATRIX.md 반영
- 각 기능 행의 `status` 열을 코드 실제 상태에 맞춤
  - `planned` → `in-progress` → `done` → `shipped`
- 새 기능이 추가되었으면 행 추가
- PROJECT-STATUS와 FEATURE-MATRIX의 기능 목록이 1:1 대응되는지 확인

### 3. SKILL-DOC-MATRIX.md 반영
- 신규 스킬이 추가되었으면 해당 tier 테이블에 행 추가
- 삭제된 스킬이 있으면 행 제거

### 4. INTEGRITY-REPORT.md 갱신
- `Last Run` 타임스탬프를 현재 날짜(KST)로 갱신
- 드리프트 항목이 있으면 기록, 없으면 "No drift" 명시

### 5. 커밋
- 커밋 메시지 패턴: `docs: sprint sync — [변경 요약] ([날짜])`
- 예시: `docs: sprint sync — Phase 2 complete, 3 features shipped (2026-03-07)`

## Drift Examples

**예시 1 — 기능 완료인데 문서 미반영:**
코드에 `usage-steps` 블록이 구현되어 있으나 FEATURE-MATRIX에 `in-progress`로 남아 있음
→ FEATURE-MATRIX를 `done`으로 변경, PROJECT-STATUS의 Completed에 추가

**예시 2 — 삭제된 기능이 문서에 잔존:**
`comparison` 블록이 코드에서 제거되었으나 FEATURE-MATRIX에 `done`으로 남아 있음
→ FEATURE-MATRIX에서 해당 행 제거 또는 `removed`로 표시

## Validation
- `PROJECT-STATUS` and `FEATURE-MATRIX` are aligned (기능 목록 1:1 대응).
- `SKILL-DOC-MATRIX` reflects current skill set.
- Integrity report timestamp is updated.
