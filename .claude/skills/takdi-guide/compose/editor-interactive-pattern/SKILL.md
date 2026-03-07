---
name: editor-interactive-pattern
description: Drag, selection, keyboard, and inline editing patterns for the compose editor.
---

## Trigger
- "에디터 인터랙션", "드래그 패턴", "키보드 단축키", "editor interaction"

## Read First
1. `src/components/compose/block-canvas.tsx` — dnd-kit 설정, 블록 정렬
2. `src/components/compose/compose-shell.tsx` — 키보드 단축키, Undo/Redo
3. `src/components/compose/shared/editable-text.tsx` — contentEditable 패턴
4. `src/components/compose/compose-context.tsx` — ComposeProvider 상태

## Do

### 1. 블록 선택 패턴
- 블록 클릭 시 `onSelect()` 호출 → `selectedBlockId` 상태 갱신
- 선택된 블록: `border-2 border-indigo-500`
- 미선택 블록: `border-2 border-transparent hover:border-gray-200`
- 캔버스 빈 영역 클릭 시 선택 해제

### 2. dnd-kit 드래그 정렬
```tsx
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
```
- `block-canvas.tsx`에서 `DndContext` + `SortableContext` 설정
- 각 블록을 `useSortable`로 래핑
- `onDragEnd`에서 `arrayMove`로 블록 순서 변경
- 드래그 핸들: 블록 좌측 grip 아이콘

### 3. 키보드 단축키
| 단축키 | 동작 | 구현 위치 |
|---|---|---|
| `Ctrl+S` | 저장 | `compose-shell.tsx` |
| `Ctrl+Z` | 실행 취소 (Undo) | `compose-shell.tsx` |
| `Ctrl+Shift+Z` | 다시 실행 (Redo) | `compose-shell.tsx` |
| `Delete` / `Backspace` | 선택된 블록 삭제 | `compose-shell.tsx` |

- `useEffect`로 `keydown` 이벤트 리스너 등록
- `e.preventDefault()` 로 브라우저 기본 동작 방지

### 4. 인라인 텍스트 편집 (EditableText)
- `contentEditable` 기반, `data-placeholder` 속성으로 플레이스홀더 표시
- `onBlur` 시 `onUpdate()` 호출하여 데이터 저장
- `readOnly` 모드에서는 `contentEditable={false}`

### 5. stopPropagation 규칙
- **필수 적용 대상:** 인라인 편집, 이미지 업로드, 색상 피커, 팝오버, 드롭다운
- **이유:** 블록 내부 인터랙션이 블록 선택/드래그와 충돌 방지
- 패턴:
  ```tsx
  <div onClick={(e) => e.stopPropagation()}>
    {/* 인터랙티브 UI */}
  </div>
  ```

### 6. readOnly 모드
- 전체 에디터가 readOnly일 때:
  - 드래그 비활성화 (`DndContext` 미렌더)
  - 블록 선택 비활성화
  - 키보드 단축키 비활성화
  - 인라인 편집 비활성화 (`contentEditable={false}`)
  - 업로드/삭제 UI 숨김

## Validation
- [ ] 블록 선택/해제가 정상 동작
- [ ] dnd-kit 드래그 정렬이 블록 순서 변경에 반영
- [ ] Ctrl+S/Z/Shift+Z/Delete 단축키 동작
- [ ] 인라인 편집 시 블록 선택 이벤트 미발생 (stopPropagation)
- [ ] readOnly 모드에서 모든 편집 기능 비활성화
