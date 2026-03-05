# Takdi Remotion Spec

Last Updated: 2026-03-05 (KST)

## Purpose
- Provide browser preview and server-side render for generated detail video assets.

## Composition Targets
- `TakdiVideo_916` (1080x1920)
- `TakdiVideo_1x1` (1080x1080)
- `TakdiVideo_169` (1920x1080)

## Runtime Flow
1. Bundle Remotion entry once and cache path.
2. Select composition by target ratio.
3. Render media with generated props.
4. Save output path to `ExportArtifact`.

## Input Props Contract
- product title
- section text blocks
- selected images
- selected bgm metadata
- template key

## Constraints
- No dynamic schema expansion in render path.
- Keep composition IDs stable for automation compatibility.
