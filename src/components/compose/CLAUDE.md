# compose/
상세페이지 블록 에디터(`/projects/:id/compose`) 전용 컴포넌트.

## Files
- `compose-shell.tsx` — 3패널 레이아웃 쉘 (팔레트 / 캔버스 / 속성패널) + ComposeProvider + 자동 저장 + Undo/Redo
- `compose-context.tsx` — ComposeProvider + useCompose() 훅 (projectId 전달)
- `compose-toolbar.tsx` — 상단 도구바 (저장, 미리보기, 내보내기, 플랫폼 선택)
- `block-palette.tsx` — 좌측 12종 블록 팔레트 (사용자 친화 라벨 + desc 툴팁)
- `block-canvas.tsx` — @dnd-kit 기반 세로 드래그 정렬 캔버스
- `block-properties-panel.tsx` — 우측 블록 타입별 동적 설정 패널 (ImagePicker + ColorStylePicker 연동, 사용자 친화 라벨)
- `image-picker.tsx` — 이미지 선택/교체 팝오버 (파일 업로드 + URL 입력)
- `export-dialog.tsx` — 이미지 내보내기 다이얼로그 (파일명/포맷 설정 + html2canvas-pro 캡처)
- `block-preview.tsx` — readOnly 블록 프리뷰 (forwardRef 지원, 결과 페이지에서 캡처용)

## Sub-folders
- `block-renderers/` — 13종 블록 렌더러 (개별 파일)
- `shared/` — 공용 재사용 컴포넌트 (EditableText, ImageUploadZone, VideoUploadZone, ColorStylePicker)

## Convention
- 모든 파일 `"use client"` (dnd-kit + 인터랙션)
- 블록 타입: `src/types/blocks.ts` 정의 참조
- API: `src/lib/api-client.ts`의 `getBlocks`/`saveBlocks`/`uploadAsset` 사용
- 이미지 업로드: `useCompose()` → projectId → `uploadAsset()`
- UI 라벨 한글 (Korean-first)
- 키보드 단축키: Ctrl+S (저장), Ctrl+Z (실행 취소), Ctrl+Shift+Z (다시 실행), Delete (블록 삭제)
