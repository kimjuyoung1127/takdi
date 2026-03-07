# Skill: Shared Compose Component

## When to Use
Creating reusable UI components for the block editor in `src/components/compose/shared/`.

## Pattern

1. **Location**: `src/components/compose/shared/{component-name}.tsx`
2. **JSDoc**: First line `/** ComponentName -- brief description */`
3. **"use client"** directive required
4. **Context**: Use `useCompose()` from `../compose-context` for `projectId` access (image/video upload)
5. **API**: Use `uploadAsset` from `@/lib/api-client` for file uploads
6. **Export**: Named export, register in `shared/index.ts` barrel

## Key Components
- `EditableText` -- contentEditable wrapper with `data-placeholder` support
- `ImageUploadZone` -- Click/drop image upload with preview and replace overlay
- `VideoUploadZone` -- Video/GIF upload zone
- `ColorStylePicker` -- Preset color/style selector buttons

## Error Handling
- 파일 업로드 실패: `try/catch` + `toast.error()` 로 사용자에게 알림
- 네트워크 에러: 기존 데이터 유지, 에러 메시지 표시
- 파일 타입 불일치: 업로드 전 클라이언트 검증, 불일치 시 `toast` 경고

## File Constraints
- 이미지: `image/png, image/jpeg, image/webp, image/gif`
- 비디오: `video/mp4, video/webm, image/gif`
- 업로드 시 `accept` 속성으로 파일 선택 제한

## readOnly Mode
- 모든 공용 컴포넌트는 `readOnly?: boolean` prop 지원
- readOnly=true 시:
  - `EditableText`: `contentEditable={false}`, 플레이스홀더 숨김
  - `ImageUploadZone`: 이미지만 표시, 클릭/드롭 비활성화
  - `VideoUploadZone`: 비디오만 표시, 업로드 UI 숨김
  - `ColorStylePicker`: 현재 값만 표시, 선택 비활성화

## Conventions
- Handle loading states (Loader2 spinner)
- Stop click propagation on interactive elements (e.stopPropagation)
- Korean UI labels
