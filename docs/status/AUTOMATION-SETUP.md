# Automation Setup (External Scheduler)

This project uses prompt-based external automation.
No local automation script is required.

## Prompt Paths (압축 후, 2026-03-06)

| 파일 | 스케줄 | 포함 작업 |
|------|--------|-----------|
| `.claude/automations/takdi-nightly.prompt.md` | 매일 23:00 KST | docs-nightly-organizer + code-doc-align |
| `.claude/automations/takdi-dawn-pipeline.prompt.md` | 매일 04:00 KST | architecture-diagrams-sync + automation-health-monitor + Slack 보고 |

## 구 프롬프트 (deprecated)
- `docs-nightly-organizer.prompt.md` → takdi-nightly로 통합
- `code-doc-align.prompt.md` → takdi-nightly로 통합
- `automation-health-monitor.prompt.md` → takdi-dawn-pipeline으로 통합
- `architecture-diagrams-sync.prompt.md` → takdi-dawn-pipeline으로 통합

## Registration Guide
- Copy prompt content into your external automation tool.
- Set timezone to `Asia/Seoul`.
- First run with `DRY_RUN=true`.
- Second run with `DRY_RUN=false`.

## Required Env
- `PROJECT_ROOT` = `C:\Users\gmdqn\takdi`

## Slack 보고 채널
- Dawn pipeline → `D09LC7XLBQ9`

## First Real-Run Acceptance
- lock behavior follows prompt rules
- status docs updated
- errors are recorded in `docs/status/NIGHTLY-RUN-LOG.md`
