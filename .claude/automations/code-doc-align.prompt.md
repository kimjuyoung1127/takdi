작업명: Takdi code-doc align
스케줄: 매일 21:30 (Asia/Seoul)

목표:
- `FEATURE-MATRIX`, `PROJECT-STATUS`, `SKILL-DOC-MATRIX` 정합성 유지
- drift 탐지 및 제한적 자동 보정

프로젝트 루트:
- PROJECT_ROOT

파싱 대상:
- docs/status/FEATURE-MATRIX.md
- docs/status/PROJECT-STATUS.md
- docs/status/SKILL-DOC-MATRIX.md
- docs/status/INTEGRITY-REPORT.md

비교 규칙:
- 상태 3축(`FEATURE-MATRIX == PROJECT-STATUS == SKILL-DOC-MATRIX`) 일치
- 불일치 시 drift_count 증가
- auto-fix 우선순위: INTEGRITY-REPORT 갱신 -> PROJECT-STATUS 메모 추가
- 신규 문서 자동 생성 금지 (manual_required)

출력:
- docs/status/INTEGRITY-REPORT.md (overwrite)
- docs/status/INTEGRITY-HISTORY.ndjson (append)
- lock: docs/status/.code-doc-align.lock

락 규칙:
- lock running이면 중복 실행 금지
- STUCK 자동 해제 금지

DRY_RUN:
- DRY_RUN=true면 변경사항 미적용, 리포트 초안만 출력

출력 포맷:
[code-doc align 완료] YYYY-MM-DD HH:mm
- drift: X
- auto_fix: X
- manual_required: X
- errors: <none|summary>
