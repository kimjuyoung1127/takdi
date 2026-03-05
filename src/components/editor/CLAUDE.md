# editor/
노드 에디터(`/projects/:id/editor`) 전용 컴포넌트.

## Files
- `node-editor-shell.tsx` — 3단 패널 쉘 (Palette + Canvas + Properties)
- `floating-toolbar.tsx` — 캔버스 상단 플로팅 액션 바 (Run, Stop, Save, Preview, Export)
- `node-palette.tsx` — 좌측 드래그 가능한 노드 타입 리스트
- `node-canvas.tsx` — React Flow 캔버스 (커스텀 노드, 드래그&드롭)
- `takdi-node.tsx` — 커스텀 React Flow 노드 (아이콘 + 라벨 + StatusBadge + Handle)
- `properties-panel.tsx` — 우측 속성 패널 (Settings/Assets/History/Cost 탭)
- `bottom-logger.tsx` — 하단 접힘/펼침 로그 패널

## Convention
- 모든 파일 `"use client"` (React Flow + 인터랙션)
- API 호출: `/api/projects/:id/generate`, `/api/projects/:id/render` 등 1:1 매핑
- 노드 타입 키: `generate`, `generate-images`, `bgm`, `cuts`, `render`, `export`
