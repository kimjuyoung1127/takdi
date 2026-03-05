작업명: Takdi automation health monitor
스케줄: 매일 09:30 (Asia/Seoul)

목표:
1. 자동화 프롬프트/아티팩트/락 상태 점검
2. 필수 스킬 존재 여부 점검
3. 문서 정합성 요약

프로젝트 루트:
- PROJECT_ROOT

자동화 점검 대상:
- .claude/automations/docs-nightly-organizer.prompt.md
- .claude/automations/code-doc-align.prompt.md
- .claude/automations/architecture-diagrams-sync.prompt.md
- docs/status/AUTOMATION-HEALTH.md
- docs/status/INTEGRITY-REPORT.md

스킬 점검 대상:
- .claude/skills/meta/sprint-docs-sync/SKILL.md
- .claude/skills/takdi-guide/core/api-contract-sync/SKILL.md
- .claude/skills/takdi-guide/core/usage-ledger-guard/SKILL.md
- .claude/skills/takdi-guide/ops/pre-commit-validate/SKILL.md

출력:
- docs/status/AUTOMATION-HEALTH.md (overwrite)
- docs/status/NIGHTLY-RUN-LOG.md (append on failure or alert)

락 규칙:
- lock 확인은 읽기 전용으로만 수행
- STUCK 자동 해제 금지

DRY_RUN:
- DRY_RUN=true면 파일 변경 없이 체크 결과만 출력

출력 포맷:
[automation health monitor 완료] YYYY-MM-DD HH:mm
- automation_healthy: X/Y
- skill_healthy: X/Y
- drift: X
- errors: <none|summary>
