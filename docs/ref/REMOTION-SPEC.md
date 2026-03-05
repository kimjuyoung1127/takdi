# Takdi Remotion Spec

Last Updated: 2026-03-06 (KST, file path fix)

## Purpose
- Provide browser preview and server-side render for generated detail video assets.

## Composition Targets
- `TakdiVideo_916` (1080x1920, 9:16 mobile)
- `TakdiVideo_1x1` (1080x1080, square)
- `TakdiVideo_169` (1920x1080, 16:9 landscape)
- All: 30fps, 150 frames (5s default)

## Browser Preview (VID-002)
- Page: `/projects/:id/preview?templateKey=9:16`
- Component: `src/components/preview/remotion-preview.tsx` (client, @remotion/player)
- Server page: `src/app/projects/[id]/preview/page.tsx` (DB fetch + status guard)
- Ratio toggle: live switching between 9:16 / 1:1 / 16:9
- Status guard: `generated` or `exported` only

## Server Render Flow
1. Bundle Remotion entry once and cache path.
2. Select composition by target ratio.
3. Render media with generated props.
4. Save output path to `ExportArtifact`.

## Input Props Contract (`RemotionInputProps`)
- `title`: string — product/project title
- `sections`: GenerationResultSection[] — headline, body, imageSlot, styleKey
- `selectedImages`: string[] — asset file paths
- `bgmMetadata`: { src, bpm?, durationMs? }
- `templateKey`: string — "9:16" | "1:1" | "16:9"

## Constraints
- No dynamic schema expansion in render path.
- Keep composition IDs stable for automation compatibility.
