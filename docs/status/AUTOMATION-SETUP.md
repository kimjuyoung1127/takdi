# Automation Setup (External Scheduler)

This project uses prompt-based external automation.
No local automation script is required.

## Prompt Paths
1. `.claude/automations/docs-nightly-organizer.prompt.md`
2. `.claude/automations/code-doc-align.prompt.md`
3. `.claude/automations/automation-health-monitor.prompt.md`
4. `.claude/automations/architecture-diagrams-sync.prompt.md`

## Registration Guide
- Copy prompt content into your external automation tool.
- Set timezone to `Asia/Seoul`.
- First run with `DRY_RUN=true`.
- Second run with `DRY_RUN=false`.

## Required Env
- `PROJECT_ROOT` (absolute path to Takdi repository)

## First Real-Run Acceptance
- lock behavior follows prompt rules
- status docs updated
- errors are recorded in `docs/status/NIGHTLY-RUN-LOG.md`
