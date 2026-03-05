---
name: generation-pipeline-update
description: Update AI generation pipeline while preserving lifecycle contracts.
---

## Trigger
- Use when generation job flow or state transitions change.

## Read First
1. `docs/ref/PRD.md`
2. `docs/ref/USER-FLOW.md`
3. `docs/ref/SCHEMA-INDEX.md`

## Do
1. Preserve documented status transitions.
2. Keep retry and failure behavior explicit.
3. Keep output shape aligned with `GenerationResult`.

## Validation
- Transition rules match docs.
- Failure path remains recoverable.
