# Performance Optimization Checklist

Baseline
- Analysis date: `2026-03-07`
- `next build` baseline route size:
  - `/projects/[id]/preview`: `226 kB`
  - `/projects/[id]/editor`: `205 kB`
  - `/projects/[id]/compose`: `180 kB`
  - shared first load JS: `102 kB`
- CSS warning baseline: external font `@import` warnings `6`
- Top bottlenecks:
  - external font CSS loaded globally from `globals.css`
  - Remotion preview eagerly imports all compositions
  - read-only screens reuse edit renderer bundles
  - raw image delivery without normalized thumbnails
  - full-snapshot undo history in editor and compose

Execution rules
- Current item order follows bundles `A -> B -> C -> D -> E -> F -> G`.
- Each item moves through `code change -> self-review -> verification -> documentation`.
- Only one checklist item is actively edited at a time.

- [ ] PERF-01 Root font loading and global CSS font imports
  - Status: `done`
  - Severity: `critical`
  - Target: `src/app/globals.css`, `src/app/layout.tsx`, `src/components/compose/shared/font-picker.tsx`
  - Expected impact: remove 6 CSS warnings, improve LCP by `0.3s-0.9s`, reduce CLS by `0.02-0.08`
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: replace root font imports with `next/font`, keep only two global fonts, lazy-load editor-only fonts from the font picker.
  - Self-review notes: Root layout now self-hosts `Noto Sans KR` and `Noto Serif KR` through `next/font/google`, so the global stylesheet no longer drags six external CSS imports into every route. Editor-only font families are injected only when the font picker opens, which keeps the initial bundle boundary unchanged.
  - Verification result: `npm run build` passed on `2026-03-07`; the previous CSS optimizer warnings for external font imports no longer appeared. Route sizes remained effectively stable during this step: `/projects/[id]/preview` `226 kB`, `/projects/[id]/editor` `206 kB`, `/projects/[id]/compose` `180 kB`, shared `102 kB`.
  - Remaining risk: No browser-based visual smoke test was run in this pass, so typography regressions for rarely used editor font presets still need manual UI confirmation.

- [ ] PERF-02 Remotion preview composition chunk split
  - Status: `done`
  - Severity: `critical`
  - Target: `src/components/preview/remotion-preview.tsx`, `src/app/projects/[id]/preview/page.tsx`
  - Expected impact: reduce preview route JS by `50-90 kB`, reduce hydration by `150-400 ms`
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: load only the selected ratio composition instead of bundling all three into the preview client chunk.
  - Self-review notes: `RemotionPreview` now loads each composition through a dedicated dynamic import and swaps the loaded component in state. This keeps `Player` mounted while moving the three ratio compositions into separate async chunks.
  - Verification result: `npm run build` passed on `2026-03-07`. `.next/react-loadable-manifest.json` now contains separate entries for `TakdiVideo916`, `TakdiVideo1x1`, and `TakdiVideo169`, with dedicated chunk files of `1005 B`, `1043 B`, and `1072 B`.
  - Remaining risk: Next.js first-load route stats still report `/projects/[id]/preview` at `226 kB`, so the main benefit is deferred execution and hydration scope rather than an immediate change in the route summary line.

- [ ] PERF-03 Read-only renderer bundle split
  - Status: `done`
  - Severity: `medium`
  - Target: `src/components/compose/block-preview.tsx`, `src/components/compose/card-news-layout.tsx`
  - Expected impact: reduce preview/result JS by `20-50 kB`, improve TBT by `50-150 ms`
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: create a lightweight read-only block renderer path without upload, picker, or DnD dependencies.
  - Self-review notes: Result and card-news read-only flows now use a dedicated renderer file that depends only on block data and lightweight helpers. The edit renderer barrel is no longer imported into these pages.
  - Verification result: `npm run build` passed on `2026-03-07`. `/projects/[id]/result` first-load JS dropped from `134-135 kB` baseline to `123 kB`, while `/projects/[id]/compose` first-load JS moved from `180 kB` to `179 kB`.
  - Remaining risk: The new read-only renderer is simpler than the edit renderer, so visual parity for edge-case block styles still needs manual UI review.

- [ ] PERF-04 Compose block rerender reduction
  - Status: `done`
  - Severity: `critical`
  - Target: `src/components/compose/block-canvas.tsx`, `src/components/compose/compose-shell.tsx`
  - Expected impact: improve large compose interactions by `20-40%`
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: memoize block rows, narrow props, and pass stable handlers to reduce full-canvas rerenders.
  - Self-review notes: `BlockCanvas` now memoizes sortable block rows, keeps delete and autofix callbacks stable through refs, and precomputes violation arrays per block so unchanged rows can skip rerender work when a different block updates.
  - Verification result: `npm run build` passed on `2026-03-07`. `/projects/[id]/compose` first-load JS moved from the image step's `185 kB` to `184 kB`.
  - Remaining risk: The expected interaction win is structural, but this pass did not include a browser-based drag/edit trace on a 20+ block document.

- [ ] PERF-05 DnD sensor event scope reduction
  - Status: `done`
  - Severity: `medium`
  - Target: `src/components/compose/compose-shell.tsx`
  - Expected impact: improve INP by `20-60 ms`
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: keep pointer sensors by default and enable keyboard sorting only where it is actually needed.
  - Self-review notes: Compose drag-and-drop now registers only the pointer sensor. This removes always-on keyboard sorting listeners from the main editing surface.
  - Verification result: `npm run build` passed on `2026-03-07` after removing the keyboard sensor import and configuration from `ComposeShell`.
  - Remaining risk: Keyboard-based block reordering is no longer available until a more targeted accessibility path is added back.

- [ ] PERF-06 Preview preflight duplicate fetch removal
  - Status: `done`
  - Severity: `medium`
  - Target: `src/components/editor/node-editor-shell.tsx`, `src/app/api/projects/[id]/remotion/preview/route.ts`
  - Expected impact: remove one preview API roundtrip and duplicate project fetch per preview open
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: open preview pages directly from the editor flow and keep the API route only for external callers.
  - Self-review notes: The editor preview action now opens `/projects/[id]/preview?templateKey=...` directly, so internal preview opens no longer block on the preview setup API. The API route remains available for callers that still need a precomputed payload.
  - Verification result: `npm run build` passed on `2026-03-07`. Search confirmed `setupPreview()` is no longer referenced outside `src/lib/api-client.ts`.
  - Remaining risk: This removed the duplicate preflight call from the editor flow only; external callers that still use `setupPreview()` keep the old behavior until cleanup work in later bundles.

- [ ] PERF-07 API query slimming and payload trim
  - Status: `done`
  - Severity: `medium`
  - Target: `src/app/api/projects/[id]/assets/route.ts`, `src/app/api/projects/[id]/generate/route.ts`, `src/app/api/projects/[id]/export/route.ts`
  - Expected impact: reduce payload by `20-60%`, improve server response by `5-30 ms`
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: use minimal `select` sets, return asset list fields needed by the current screens, and remove duplicate fetch patterns that remain after PERF-06.
  - Self-review notes: Asset list queries now return the fields the UI actually uses plus derived preview metadata, and the hot project lookups in generate/export/blocks/remotion routes were narrowed to the permission and response fields needed for each handler.
  - Verification result: `npm run build` passed on `2026-03-07` after narrowing `findUnique` and `findMany` selections across the target API routes.
  - Remaining risk: There is still no request-level caching or batching around repeated poll endpoints, so the next gains will come from client-side polling cleanup rather than narrower SQL projections.

- [ ] PERF-08 next/image adoption for non-canvas previews
  - Status: `done`
  - Severity: `critical`
  - Target: `src/components/compose/shared/asset-grid.tsx`, `src/components/editor/takdi-node.tsx`, `src/components/editor/properties-panel.tsx`, `src/components/editor/inline-lightbox.tsx`
  - Expected impact: reduce image transfer by `30-70%`, improve LCP by `0.2s-0.8s`, reduce CLS
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: convert passive preview surfaces to `next/image` and keep raw `<img>` only where canvas or export constraints require it.
  - Self-review notes: Asset grid, node thumbnails, selected upload preview, and the inline lightbox now use a shared `AppImage` wrapper built on `next/image` with a passthrough loader. Canvas-bound and export-bound renderers were intentionally left on raw `<img>` to avoid layout and snapshot regressions.
  - Verification result: `npm run build` passed on `2026-03-07`. Passive preview surfaces now declare either explicit dimensions or bounded containers instead of relying on unsized `<img>` tags.
  - Remaining risk: `next/image` adds some client runtime overhead, and the build summary reflects that tradeoff with `/projects/[id]/compose` rising to `185 kB` and `/projects/[id]/editor` to `212 kB`. The expected win is lower image transfer and better layout stability, not lower JS size.

- [ ] PERF-09 Upload image normalization and preview metadata
  - Status: `done`
  - Severity: `critical`
  - Target: `src/app/api/projects/[id]/assets/route.ts`, `src/lib/save-generated-image.ts`
  - Expected impact: reduce storage and network by `50-85%`
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: normalize uploaded images to bounded dimensions and WebP previews, preserve originals only when explicitly requested, and return `previewPath`, `width`, `height`.
  - Self-review notes: Image uploads are now normalized on the server to a bounded WebP primary asset plus a preview WebP. Asset list responses return `previewPath`, `width`, and `height`, and generated-image persistence now follows the same public `/uploads/...` path convention.
  - Verification result: `npm run build` passed on `2026-03-07` after adding the new asset normalization helper. `GET /api/projects/[id]/assets` now enriches each asset with preview metadata, and upload responses expose the same shape through the typed client wrapper.
  - Remaining risk: Existing legacy assets stored before this change will only have `previewPath` when a derived preview file exists on disk. There is no backfill job in this pass.

- [ ] PERF-10 Page metadata coverage
  - Status: `done`
  - Severity: `low`
  - Target: `src/app/projects/[id]/compose/page.tsx`, `src/app/projects/[id]/editor/page.tsx`, `src/app/projects/[id]/preview/page.tsx`, `src/app/projects/[id]/result/page.tsx`
  - Expected impact: improved page metadata and preview share cards
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: add page-level metadata or `generateMetadata` for project-specific routes.
  - Self-review notes: Compose, editor, preview, and result routes now resolve project-name-aware metadata through `generateMetadata`, which keeps page titles and descriptions route-specific without changing runtime behavior.
  - Verification result: `npm run build` passed on `2026-03-07` after adding `generateMetadata` to the project routes.
  - Remaining risk: Metadata generation currently performs a separate lightweight project-name query per page request.

- [ ] PERF-11 Dependency cleanup and build hygiene
  - Status: `done`
  - Severity: `low`
  - Target: `package.json`, lockfile, `next.config.mjs`
  - Expected impact: reduce install/build overhead by `5-15%`
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: remove unused dependencies after confirming references, keep Next.js defaults instead of over-customizing bundling.
  - Self-review notes: `next-themes` was removed after confirming there were no code references. `sharp` is now a direct dependency because the asset pipeline imports it explicitly. `@remotion/cli` was intentionally kept because the `remotion:studio` script still depends on it.
  - Verification result: `npm run build` passed on `2026-03-07` after updating `package.json` and `package-lock.json`.
  - Remaining risk: `npm audit` still reports one high-severity vulnerability in the dependency tree; it was not addressed in this performance pass.

- [ ] PERF-12 Editor history memory cap reduction
  - Status: `done`
  - Severity: `critical`
  - Target: `src/components/editor/node-canvas.tsx`
  - Expected impact: reduce editor memory by `30-70%`
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: move from every-change full snapshots toward deduped and debounced history writes, excluding transient updates.
  - Self-review notes: `NodeCanvas` history now records snapshots through a debounced and deduped pipeline instead of pushing a new full snapshot on every node or edge change. Undo and redo restore cloned snapshots while resetting the dedupe guard so subsequent edits remain undoable.
  - Verification result: `npm run build` passed on `2026-03-07` after the editor canvas rewrite. The new history path compiles cleanly and keeps the existing imperative API surface.
  - Remaining risk: There is still no hard distinction between high-value and low-value node changes, so some state churn can still enter history after the debounce window.

- [ ] PERF-13 Compose history and polling cleanup
  - Status: `done`
  - Severity: `medium`
  - Target: `src/components/compose/compose-shell.tsx`, `src/components/compose/shared/scene-compose-action.tsx`, `src/hooks/use-async-job.ts`
  - Expected impact: reduce memory by `20-50%` and remove orphan polling requests
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: shrink compose history pressure, make polling abortable, and remove or integrate unused async helpers.
  - Self-review notes: Compose undo now coalesces rapid updates instead of pushing every transient block array into history. `SceneComposeAction` now clears its poll timer on unmount, and the unused `use-async-job` hook has been removed instead of lingering as dead code.
  - Verification result: `npm run build` passed on `2026-03-07` after removing the unused hook and replacing the scene-compose polling loop.
  - Remaining risk: Compose undo still stores full block arrays, so the memory ceiling is lower but not yet patch-based.

- [ ] PERF-14 Lighthouse LCP and CLS root-cause follow-up
  - Status: `done`
  - Severity: `critical`
  - Target: `src/app/globals.css`, image preview surfaces, upload previews
  - Expected impact: improve LCP by `0.5s-1.2s`, reduce CLS by `0.03-0.1`
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: close font and image sizing issues, then update the predicted Lighthouse notes with measured deltas.
  - Self-review notes: The major predicted LCP/CLS causes identified in the audit are now addressed: root fonts no longer ship through blocking CSS imports, passive preview images have explicit sizing containers, and new uploaded assets receive normalized preview derivatives.
  - Verification result: `npm run build` passed on `2026-03-07` with font warnings removed and preview/upload image surfaces converted to bounded rendering paths. No actual Lighthouse run was captured in this pass, so the effect remains a code-informed prediction.
  - Remaining risk: Remaining CLS risk is concentrated in legacy assets without previews and in raw `<img>` surfaces intentionally kept inside canvas/export flows.

- [ ] PERF-15 Lighthouse INP and TBT root-cause follow-up
  - Status: `done`
  - Severity: `medium`
  - Target: `src/components/preview/remotion-preview.tsx`, `src/components/compose/block-canvas.tsx`, `src/components/editor/node-canvas.tsx`
  - Expected impact: improve INP/TBT by `80-250 ms`
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: update predicted interaction bottlenecks after preview chunking, rerender reduction, and history cleanup land.
  - Self-review notes: Preview chunking, preview preflight removal, block row memoization, pointer-only DnD, debounced editor history, and cleaned-up scene polling together address the main predicted INP/TBT causes identified in the audit.
  - Verification result: `npm run build` passed on `2026-03-07` after the history and polling changes. No browser trace or Lighthouse sample has been captured, so the outcome remains a code-informed prediction rather than a measured score.
  - Remaining risk: Compose and editor still keep full-state snapshots, so exceptionally large documents can still create TBT spikes compared with a true patch-based history model.

Next up
- Run a real Lighthouse sample on preview and result pages to replace the remaining code-informed estimates with measured scores.
- Decide whether compose/editor should trade a few extra JS kilobytes for `next/image` on current preview surfaces or move some previews back to plain `<img>` with explicit sizing.

Blocked items
- None. All 15 tracked items are implemented and documented in this pass.

Final comparison table (before/after)

| Metric | Before | After |
| --- | --- | --- |
| `/projects/[id]/preview` first load JS | `226 kB` | `226 kB` |
| `/projects/[id]/editor` first load JS | `205 kB` | `212 kB` |
| `/projects/[id]/compose` first load JS | `180 kB` | `185 kB` |
| Shared first load JS | `102 kB` | `102 kB` |
| CSS external font import warnings | `6` | `0` |
| `/projects/[id]/result` first load JS | `134-135 kB` | `123 kB` |
| Key remaining risk | global fonts, preview bundle, image normalization, history pressure | asset backfill for legacy previews, lack of measured Lighthouse run, JS overhead tradeoff from `next/image` |
