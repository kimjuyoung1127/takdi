---
name: usage-ledger-guard
description: Protect usage accounting behavior for generation and export events.
---

## Trigger
- Use when generation/export flow or usage endpoints change.

## Read First
1. `docs/ref/SCHEMA-INDEX.md`
2. `docs/status/FEATURE-MATRIX.md`
3. `docs/status/INTEGRITY-REPORT.md`

## Do
1. Verify usage events are still recorded per run.
2. Verify monthly aggregation assumptions.
3. Document any deviation.

## Validation
- `/api/usage/me` behavior remains compatible with docs.
