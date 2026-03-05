---
name: pre-commit-validate
description: Run minimum validation checks before committing.
---

## Trigger
- Use before commit or merge.

## Read First
1. `docs/status/INTEGRITY-REPORT.md`
2. `docs/status/FEATURE-MATRIX.md`

## Do
1. Ensure docs contract files exist and are updated.
2. Ensure drift report has no blocking errors.
3. Ensure status docs are not contradictory.

## Validation
- No blocking drift in integrity report.
- Required docs exist and are readable.
