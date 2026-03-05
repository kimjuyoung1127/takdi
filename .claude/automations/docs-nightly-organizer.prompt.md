작업명: Takdi docs nightly organizer
스케줄: 매일 22:00 (Asia/Seoul)

목표:
- docs 구조를 ref/status/daily/weekly 기준으로 유지
- 문서 이동/정리 로그를 `docs/status/NIGHTLY-RUN-LOG.md`에 append

프로젝트 루트:
- PROJECT_ROOT (예: C:\Users\ezen601\Desktop\Jason\takdi)

입력:
- docs/ref/**
- docs/status/**
- docs/daily/**
- docs/weekly/**

출력:
- docs/status/NIGHTLY-RUN-LOG.md
- docs/weekly/YYYY-WNN.md (필요 시)
- lock: docs/.docs-nightly.lock

락 규칙:
- lock 존재 + running 2시간 이내면 즉시 종료
- STUCK 자동 해제 금지
- 수동 해제 시 released 메모를 로그에 남김

DRY_RUN:
- DRY_RUN=true면 파일 수정 없이 계획/카운트만 출력

출력 포맷:
[docs nightly organizer 완료] YYYY-MM-DD HH:mm
- moved_ref_count: X
- moved_status_count: X
- moved_daily_count: X
- weekly_created_or_updated: <file|none>
- errors: <none|summary>
