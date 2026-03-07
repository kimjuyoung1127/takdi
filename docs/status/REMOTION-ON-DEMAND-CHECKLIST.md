# Remotion On-Demand Checklist

Baseline
- Analysis date: `2026-03-07`
- Current Remotion usage points confirmed before this pass:
  - `src/app/projects/[id]/preview/page.tsx`
  - `src/components/preview/remotion-preview.tsx`
  - `src/remotion/index.ts`
  - `src/app/api/projects/[id]/remotion/render/route.ts`
- Baseline `/projects/[id]/preview` first load JS: `226 kB`
- Baseline structure: preview route entered through a route-level preview component import, and the browser preview boundary was prepared before the user clicked play.
- Server render route state: `stub` only, no real `renderMedia()` implementation in this pass.

Execution rules
- Each item was closed in the order `document state -> code change -> self-review -> verification -> documentation`.
- Only one Remotion item was edited at a time.
- Goal of this pass: delay Remotion browser runtime loading to explicit user intent, not remove Remotion from the product.

- [ ] REM-01 Preview route boundary redefinition
  - Status: `done`
  - Target: `src/app/projects/[id]/preview/page.tsx`, `src/components/preview/preview-shell.tsx`
  - Expected impact: stop evaluating the browser preview runtime on first paint and keep the route shell lightweight.
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: replace the route-level preview runtime import with a lightweight `PreviewShell` client component that only manages ratio choice, status text, and the load button.
  - Self-review notes: The preview page now fetches project data and renders `PreviewShell` directly. The shell owns ratio switching and passes runtime loading to a deeper boundary, so the page no longer mounts Remotion browser code on entry.
  - Verification result: `npm run build` passed on `2026-03-07`. `/projects/[id]/preview` first load JS dropped to `195 kB`.
  - Remaining risk: The preview page is still a client-heavy route because the shell remains interactive, but the expensive runtime is no longer part of the initial path.

- [ ] REM-02 Click-triggered Player loading
  - Status: `done`
  - Target: `src/components/preview/preview-player-loader.tsx`, `src/components/preview/remotion-player-runtime.tsx`
  - Expected impact: move `@remotion/player` and composition loading behind an explicit button click.
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: add `PreviewPlayerLoader` as the click boundary, then import `RemotionPlayerRuntime`, `@remotion/player`, and the selected composition only when the user loads the preview.
  - Self-review notes: There is no idle, hover, or route-entry prefetch. The loader keeps the preview in placeholder mode until the user clicks `미리보기 로드`, which is the strictest version of the requested boundary.
  - Verification result: `.next/react-loadable-manifest.json` now shows `components\\preview\\preview-player-loader.tsx -> ./remotion-player-runtime` plus a separate `components\\preview\\remotion-player-runtime.tsx -> @remotion/player` entry.
  - Remaining risk: The first click now pays the runtime setup cost by design. This is acceptable for the goal of trimming initial preview load.

- [ ] REM-03 Shell and runtime split
  - Status: `done`
  - Target: `src/components/preview/preview-shell.tsx`, `src/components/preview/remotion-preview.tsx`, `src/components/preview/remotion-preview-config.ts`
  - Expected impact: keep import flow one-way and prevent shared UI from pulling Player code.
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: split the old all-in-one preview component into config, shell, loader, and runtime layers. Keep `remotion-preview.tsx` as a thin compatibility wrapper only.
  - Self-review notes: `remotion-preview.tsx` no longer imports Player or compositions. It only re-exports `PreviewShell`, which keeps older references safe without weakening the new boundary.
  - Verification result: Code search confirms the only browser-side `@remotion/player` import path is inside `src/components/preview/remotion-player-runtime.tsx`.
  - Remaining risk: Future preview features could accidentally bypass the shell/runtime split if new preview widgets import runtime internals directly.

- [ ] REM-04 Player-free fallback and retry flow
  - Status: `done`
  - Target: `src/components/preview/preview-player-loader.tsx`, `src/components/preview/remotion-player-runtime.tsx`
  - Expected impact: preserve a useful preview screen before Player loads and recover cleanly from runtime load failures.
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: render a static ratio frame with project counts and optional poster image before runtime load, then show an in-runtime retry UI if Player or composition import fails.
  - Self-review notes: The shell fallback works without Remotion and can display the first generated asset as a representative poster. Runtime loading and runtime error states both stay inside the preview card and expose explicit retry actions.
  - Verification result: Build passed, and runtime loading/error branches compile cleanly with no direct Player dependency in the fallback layer.
  - Remaining risk: The poster currently uses the first generated asset file path directly rather than a derived preview image, so large originals may still be shown in the shell state.

- [ ] REM-05 Remotion dependency leakage audit
  - Status: `done`
  - Target: `src/components/preview/remotion-player-runtime.tsx`, `src/remotion/*`, `src/app/api/projects/[id]/remotion/render/route.ts`
  - Expected impact: confirm that browser Remotion code does not leak into editor, compose, or result routes.
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: audit imports after the split and keep `remotion` package usage confined to composition definitions and studio/server-side assets.
  - Self-review notes: The browser runtime boundary is now explicit. Composition source files remain under `src/remotion/*` for studio and future render use, while the server render route remains untouched and still stubbed.
  - Verification result: Import search found `@remotion/player` only in `src/components/preview/remotion-player-runtime.tsx`. `remotion` imports remain in `src/remotion/index.ts`, `src/remotion/Root.tsx`, and the three composition files only.
  - Remaining risk: The real server render path is still not implemented, so a future renderMedia integration will need its own boundary review.

- [ ] REM-06 Final comparison and closeout
  - Status: `done`
  - Target: `docs/status/REMOTION-ON-DEMAND-CHECKLIST.md`, `docs/status/PROJECT-STATUS.md`, `docs/status/CLAUDE-HANDOFF.md`
  - Expected impact: leave a complete execution record and measured before/after comparison for the next pass.
  - [x] Code change complete
  - [x] Self-review complete
  - [x] Verification complete
  - [x] Documentation complete
  - Fix strategy: record final route sizes, runtime chunk boundaries, remaining risks, and the next big candidates after this pass.
  - Self-review notes: The documentation matches the implemented split and does not claim server render improvements that were intentionally left out of scope. A small unrelated `EditableText` `style` prop fix was included only to restore a green build.
  - Verification result: Clean `npm run build` passed on `2026-03-07` after clearing the stale `.next` cache. Final route snapshot: `/projects/[id]/preview` `195 kB`, `/projects/[id]/compose` `188 kB`, `/projects/[id]/editor` `212 kB`, `/projects/[id]/result` `124 kB`, shared `102 kB`.
  - Remaining risk: This pass improves runtime timing more than absolute render capability. The server render endpoint is still stubbed, and no browser trace was captured.

Final comparison table

| Metric | Before | After |
| --- | --- | --- |
| `/projects/[id]/preview` first load JS | `226 kB` | `195 kB` |
| Preview route runtime boundary | route-level preview component import | shell only on entry, runtime loaded on button click |
| `@remotion/player` load timing | preview route entry | explicit user click |
| Composition loading | selected composition async after preview mount | selected composition async after runtime click |
| Import path for `@remotion/player` | preview component route path | `src/components/preview/remotion-player-runtime.tsx` only |
| Render API state | stub | stub |

Next up
- Evaluate a server-side lightweight preview or poster generation path to reduce first-click latency further.
- Replace snapshot-style history with patch-based history in editor and compose.
- Split editor and compose tool panels into finer lazy-loaded feature bundles.

Blocked items
- None.
