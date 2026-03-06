# compose/
상세페이지 블록 에디터(`/projects/:id/compose`) 전용 컴포넌트.

## Files
- `compose-shell.tsx` — 3패널 레이아웃 쉘 (팔레트 / 캔버스 / 속성패널) + 자동 저장 + Undo/Redo
- `compose-toolbar.tsx` — 상단 도구바 (저장, 미리보기, 내보내기, 플랫폼 선택)
- `block-palette.tsx` — 좌측 12종 블록 팔레트
- `block-canvas.tsx` — @dnd-kit 기반 세로 드래그 정렬 캔버스
- `block-properties-panel.tsx` — 우측 블록 타입별 동적 속성 패널
- `block-renderers/` — 12종 블록 렌더러

## Sub-folders
- `block-renderers/index.ts` — barrel export
- `block-renderers/hero-block.tsx` — 히어로 (전체 이미지 + 오버레이)
- `block-renderers/selling-point-block.tsx` — 셀링포인트 (아이콘 + 제목 + 설명)
- `block-renderers/text-block.tsx` — 텍스트 블록 (제목 + 본문)
- `block-renderers/image-text-block.tsx` — 이미지+텍스트 (좌/우 레이아웃)
- `block-renderers/placeholder-blocks.tsx` — 나머지 8종 플레이스홀더

## Convention
- 모든 파일 `"use client"` (dnd-kit + 인터랙션)
- 블록 타입: `src/types/blocks.ts` 정의 참조
- API: `src/lib/api-client.ts`의 `getBlocks`/`saveBlocks` 사용
- UI 라벨 한글 (Korean-first)
- 키보드 단축키: Ctrl+S (저장), Ctrl+Z (실행 취소), Ctrl+Shift+Z (다시 실행), Delete (블록 삭제)
