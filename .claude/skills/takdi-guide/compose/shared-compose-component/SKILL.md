# Skill: Shared Compose Component

## When to Use
Creating reusable UI components for the block editor in `src/components/compose/shared/`.

## Pattern

1. **Location**: `src/components/compose/shared/{component-name}.tsx`
2. **JSDoc**: First line `/** ComponentName — 간단 설명 */`
3. **"use client"** directive required
4. **Context**: Use `useCompose()` from `../compose-context` for `projectId` access (image/video upload)
5. **API**: Use `uploadAsset` from `@/lib/api-client` for file uploads
6. **Export**: Named export, register in `shared/index.ts` barrel

## Key Components
- `EditableText` — contentEditable wrapper with `data-placeholder` support
- `ImageUploadZone` — Click/drop image upload with preview and replace overlay
- `VideoUploadZone` — Video/GIF upload zone
- `ColorStylePicker` — Preset color/style selector buttons

## Conventions
- Handle loading states (Loader2 spinner)
- Stop click propagation on interactive elements (e.stopPropagation)
- Support `readOnly` prop when applicable
- Korean UI labels
