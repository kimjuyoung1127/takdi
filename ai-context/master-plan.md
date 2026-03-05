# Takdi Master Plan

Last Updated: 2026-03-05 (KST)
Current Strategy: Single-user validation first, subscription-ready architecture

## Phase 0 - Documentation Baseline (Done)
- Migrate docs to `docs/ref` and `docs/status`.
- Define automation prompt assets.
- Lock status and integrity templates.

## Phase 1 - Core MVP Foundation
- Auth/session with one-user UX.
- Workspace-scoped data model with hard single-workspace guard.
- Project CRUD and asset upload flow.

## Phase 2 - Generation Pipeline
- AI draft generation job pipeline.
- Failure recovery and retry-safe generation lifecycle.
- Manual content edit and save cycle.

## Phase 3 - Export and Operations
- Export artifacts (HTML/image package).
- Usage ledger accumulation and monthly summary.
- Basic operation reports and integrity checks.

## Expansion Gate
- Trigger condition:
  - 20+ real production outputs
  - repeated reuse intent confirmed
- On gate pass:
  - enable multi-user membership flow
  - open paid plan rollout
