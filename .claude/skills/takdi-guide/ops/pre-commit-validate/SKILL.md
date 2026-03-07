---
name: pre-commit-validate
description: Run minimum validation checks before committing.
---

## Trigger
- Use before commit or merge.

## Read First
1. `docs/status/INTEGRITY-REPORT.md`
2. `docs/status/FEATURE-MATRIX.md`

## Do

### 1. 필수 문서 존재 확인
다음 파일이 모두 존재하고 읽을 수 있는지 확인:
- `docs/ref/SCHEMA-INDEX.md`
- `docs/ref/PRD.md`
- `docs/ref/ARCHITECTURE.md`
- `docs/status/PROJECT-STATUS.md`
- `docs/status/FEATURE-MATRIX.md`
- `docs/status/INTEGRITY-REPORT.md`
- `docs/status/SKILL-DOC-MATRIX.md`

### 2. 드리프트 리포트 확인
- `INTEGRITY-REPORT.md`에 blocking 에러가 없는지 확인
- blocking = 코드-문서 불일치 중 타입/API 계약 관련 항목

### 3. 상태 문서 정합성 확인
- `PROJECT-STATUS`의 완료 항목이 `FEATURE-MATRIX`에 `done`으로 반영되었는지
- 모순되는 상태가 없는지 (예: PROJECT-STATUS는 완료인데 FEATURE-MATRIX는 planned)

## Validation
- 필수 문서 7개 모두 존재
- INTEGRITY-REPORT에 blocking 에러 0건
- PROJECT-STATUS와 FEATURE-MATRIX 정합
