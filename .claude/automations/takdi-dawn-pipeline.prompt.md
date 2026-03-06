# Takdi Dawn Pipeline
스케줄: 매일 04:00 (Asia/Seoul)
PROJECT_ROOT: C:\Users\gmdqn\takdi
Slack 보고 채널: D09LC7XLBQ9

## 목표
1. **architecture-diagrams-sync** — ARCHITECTURE.md와 코드 구조 정합성 점검
2. **automation-health-monitor** — 자동화 프롬프트/스킬/락 상태 점검
3. **Slack 보고** — 점검 결과 요약을 D09LC7XLBQ9 채널로 전송

---

## STEP 1: architecture-diagrams-sync

대상:
- docs/ref/ARCHITECTURE.md
- src/**
- prisma/**

작업:
- ARCHITECTURE.md와 현재 코드 구조의 핵심 흐름 정합성 점검
- 불일치 항목 심각도 분류 (HIGH / MEDIUM / LOW)
- 코드 변경 금지 — 문서 불일치 기록만 수행

출력:
- docs/status/PROJECT-STATUS.md의 architecture sync 메모 갱신
- docs/status/INTEGRITY-REPORT.md의 architecture drift 섹션 갱신

락:
- lock: docs/ref/.architecture-sync.lock
- STUCK 자동 해제 금지

---

## STEP 2: automation-health-monitor

자동화 점검 대상:
- .claude/automations/takdi-nightly.prompt.md
- .claude/automations/takdi-dawn-pipeline.prompt.md
- docs/status/AUTOMATION-HEALTH.md
- docs/status/INTEGRITY-REPORT.md

스킬 점검 대상:
- .claude/skills/meta/sprint-docs-sync/SKILL.md
- .claude/skills/takdi-guide/core/api-contract-sync/SKILL.md
- .claude/skills/takdi-guide/core/usage-ledger-guard/SKILL.md
- .claude/skills/takdi-guide/ops/pre-commit-validate/SKILL.md

작업:
- 프롬프트/아티팩트/락 상태 점검
- 스킬 파일 존재 여부 점검
- 문서 정합성 요약

출력:
- docs/status/AUTOMATION-HEALTH.md (overwrite)
- 오류/경고 시 docs/status/NIGHTLY-RUN-LOG.md (append)

락 확인: 읽기 전용만 수행 (STUCK 자동 해제 금지)

---

## STEP 3: Slack 보고

STEP 1~2 완료 후 D09LC7XLBQ9 채널로 아래 포맷으로 전송:

```
[Takdi Dawn Pipeline] YYYY-MM-DD HH:mm KST
• architecture drift: X건 (HIGH: X / MEDIUM: X / LOW: X)
• automation healthy: X/Y
• skill healthy: X/Y
• integrity drift: X건
• errors: <none|summary>
```

오류 없으면 간단 요약, 오류 있으면 항목별 명시.

---

## DRY_RUN
DRY_RUN=true면 파일 변경 없이 체크 결과만 출력하고 Slack 전송 스킵.
