작업명: Takdi architecture diagrams sync
스케줄: 매일 04:00 (Asia/Seoul)

목표:
- `docs/ref/ARCHITECTURE.md`와 현재 코드 구조의 핵심 흐름 정합성 점검

대상:
- docs/ref/ARCHITECTURE.md
- src/**
- prisma/**

출력:
- docs/status/PROJECT-STATUS.md의 architecture sync 메모 갱신
- docs/status/INTEGRITY-REPORT.md의 architecture drift 섹션 갱신
- lock: docs/ref/.architecture-sync.lock

규칙:
- 코드 변경 금지
- 문서와 코드의 불일치만 기록
- 심각도(HIGH/MEDIUM/LOW)로 분류

DRY_RUN:
- DRY_RUN=true면 차이 리포트만 출력
