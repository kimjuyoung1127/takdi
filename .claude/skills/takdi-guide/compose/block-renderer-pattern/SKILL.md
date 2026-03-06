# Skill: Block Renderer Pattern

## When to Use
Creating or modifying a block renderer in `src/components/compose/block-renderers/`.

## Pattern

1. **File**: One file per block type, named `{block-type}-block.tsx`
2. **JSDoc**: First line `/** 블록명 블록 — 간단 설명 */`
3. **"use client"** directive required
4. **Props interface**:
   ```ts
   interface Props {
     block: XxxBlock;
     selected: boolean;
     onSelect: () => void;
     onUpdate: (patch: Partial<XxxBlock>) => void;
     readOnly?: boolean;
   }
   ```
5. **Shared components**: Use `EditableText`, `ImageUploadZone`, `VideoUploadZone` from `../shared`
6. **Selection border**: `border-2 ${selected ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`
7. **readOnly guard**: Always check `readOnly` prop — show static content or editable components
8. **Export**: Named export `XxxBlockRenderer`, register in `index.ts` barrel
9. **Types**: Block type defined in `src/types/blocks.ts`

## Checklist
- [ ] Added to `block-renderers/index.ts` barrel
- [ ] `BlockDispatch` in `block-canvas.tsx` handles new type
- [ ] `block-properties-panel.tsx` has section for new type
- [ ] `block-palette.tsx` has template with default values
- [ ] `tsc --noEmit` passes
