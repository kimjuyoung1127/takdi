# Takdi Nightly Pipeline
스케줄: 매일 23:00 (Asia/Seoul)
PROJECT_ROOT: C:\Users\gmdqn\takdi

## 목표
1. **docs-nightly-organizer** — docs 구조 정합성 유지 및 로그 기록
2. **code-doc-align** — FEATURE-MATRIX / PROJECT-STATUS / SKILL-DOC-MATRIX 3축 정합성 유지

---

## STEP 1: docs-nightly-organizer

입력:
- docs/ref/**
- docs/status/**
- docs/daily/**
- docs/weekly/**

작업:
- docs 파일이 ref/status/daily/weekly 기준 폴더에 올바르게 위치하는지 점검
- 잘못된 위치 파일 이동 (신규 파일 자동 생성 금지)
- 필요 시 docs/weekly/YYYY-WNN.md 생성 또는 갱신
- docs/status/NIGHTLY-RUN-LOG.md에 결과 append

락:
- lock: docs/.docs-nightly.lock
- running 2시간 이내면 즉시 종료 (STUCK 자동 해제 금지)

출력 포맷:
[docs nightly organizer 완료] YYYY-MM-DD HH:mm
- moved_ref_count: X
- moved_status_count: X
- moved_daily_count: X
- weekly_created_or_updated: <file|none>
- errors: <none|summary>

---

## STEP 2: code-doc-align

파싱 대상:
- docs/status/FEATURE-MATRIX.md
- docs/status/PROJECT-STATUS.md
- docs/status/SKILL-DOC-MATRIX.md
- docs/status/INTEGRITY-REPORT.md

작업:
- 상태 3축(FEATURE-MATRIX == PROJECT-STATUS == SKILL-DOC-MATRIX) 일치 점검
- 불일치 시 drift_count 증가
- auto-fix 우선순위: INTEGRITY-REPORT 갱신 → PROJECT-STATUS 메모 추가
- 신규 문서 자동 생성 금지 (manual_required 표시)

출력:
- docs/status/INTEGRITY-REPORT.md (overwrite)
- docs/status/INTEGRITY-HISTORY.ndjson (append)

락:
- lock: docs/status/.code-doc-align.lock
- running이면 중복 실행 금지 (STUCK 자동 해제 금지)

출력 포맷:
[code-doc align 완료] YYYY-MM-DD HH:mm
- drift: X
- auto_fix: X
- manual_required: X
- errors: <none|summary>

---

## DRY_RUN
DRY_RUN=true면 파일 변경 없이 계획/카운트만 출력 (양 STEP 공통).
