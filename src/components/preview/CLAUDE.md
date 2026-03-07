# preview/
Preview-specific components for the browser Remotion experience.

## Files
- `preview-shell.tsx` - lightweight ratio selector and preview shell shown on route entry
- `preview-player-loader.tsx` - click boundary that imports the runtime only after explicit user intent
- `remotion-player-runtime.tsx` - the only browser runtime file allowed to import `@remotion/player`
- `remotion-preview-config.ts` - shared composition metadata and template mapping
- `remotion-preview.tsx` - compatibility wrapper that re-exports `PreviewShell`

## Convention
- Keep the shell/runtime split intact.
- Do not import `@remotion/player` outside `remotion-player-runtime.tsx`.
- Preview route entry must remain useful even when the runtime has not been loaded yet.
