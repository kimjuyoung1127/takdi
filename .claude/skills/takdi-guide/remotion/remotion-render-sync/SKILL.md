---
name: remotion-render-sync
description: Keep Remotion composition contracts synchronized with docs.
---

## Trigger
- Use when changing composition IDs, dimensions, or render props.

## Read First
1. `docs/ref/REMOTION-SPEC.md`
2. `docs/ref/ARCHITECTURE.md`
3. `docs/status/FEATURE-MATRIX.md`

## Do
1. Keep composition IDs stable unless migration is documented.
2. Keep render prop contract compatible.
3. Reflect changes in docs and status.

## Validation
- Composition IDs in code match spec.
- Export flow still maps to `ExportArtifact`.
