# editor/
노드 에디터(`/projects/:id/editor`) 전용 컴포넌트.

## Files
- `node-editor-shell.tsx` — 3단 패널 쉘 + 키보드 단축키 + 자동 저장 + 토스트 알림
- `floating-toolbar.tsx` — 플로팅 액션 바 (한글 툴팁, 파이프라인 단계 표시, 마지막 저장 시각)
- `node-palette.tsx` — 좌측 노드 팔레트 (한글 라벨 + 호버 설명)
- `node-canvas.tsx` — React Flow 캔버스 (Delete 키, 빈 캔버스 온보딩, nodeType별 상태 업데이트)
- `takdi-node.tsx` — 커스텀 React Flow 노드 (아이콘 + 라벨 + StatusBadge + Handle)
- `properties-panel.tsx` — 우측 속성 패널 (설정/에셋/기록/비용 탭, 비선택 시 프로젝트 요약 + 단축키 가이드)
- `bottom-logger.tsx` — 하단 접힘/펼침 로그 패널
- `asset-upload.tsx` — BYOI 이미지/BGM 파일 업로드 컴포넌트

## Convention
- 모든 파일 `"use client"` (React Flow + 인터랙션)
- 모든 UI 라벨 한글 (Korean-first)
- API 호출: `src/lib/api-client.ts` 래퍼 사용
- 노드 타입 키: `generate`, `generate-images`, `bgm`, `cuts`, `render`, `export`
- 키보드 단축키: Ctrl+S (저장), Ctrl+Enter (전체 실행), Esc (중지), Delete (노드 삭제)
