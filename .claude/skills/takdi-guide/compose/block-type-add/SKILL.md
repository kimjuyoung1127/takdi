---
name: block-type-add
description: 10-step checklist for adding a new block type to the compose editor.
---

## Trigger
- "블록 추가", "새 블록 타입", "add block type", "new block"

## Read First
1. `src/types/blocks.ts` — 기존 BlockType 목록, Block union, 인터페이스 패턴
2. `src/components/compose/block-renderers/index.ts` — 배럴 export 패턴
3. `src/components/compose/block-palette.tsx` — 팔레트 등록 패턴
4. `src/components/compose/block-canvas.tsx` — BlockDispatch 매핑
5. `docs/ref/SCHEMA-INDEX.md` — BlockType 계약

## Do — 10단계 체크리스트

### Step 1: types 정의
- `src/types/blocks.ts`에 새 인터페이스 추가 (기존 패턴 따름)
  ```ts
  export interface NewBlock extends BaseBlock {
    type: "new-type";
    // 블록 고유 필드
  }
  ```
- `BlockType` union에 `"new-type"` 추가
- `Block` union에 `NewBlock` 추가

### Step 2: 렌더러 생성
- `src/components/compose/block-renderers/new-type-block.tsx` 생성
- `block-renderer-pattern` 스킬의 패턴 준수:
  - `"use client"`, JSDoc, Props 인터페이스, readOnly 가드, 선택 보더

### Step 3: 배럴 export
- `src/components/compose/block-renderers/index.ts`에 export 추가

### Step 4: 캔버스 디스패치
- `src/components/compose/block-canvas.tsx`의 BlockDispatch에 새 타입 case 추가

### Step 5: 팔레트 등록
- `src/components/compose/block-palette.tsx`에 템플릿 추가
  - 사용자 친화 한글 라벨 + desc 툴팁 + 기본값

### Step 6: 속성 패널
- `src/components/compose/block-properties-panel.tsx`에 새 타입 섹션 추가
  - 해당 블록의 편집 가능한 속성 UI

### Step 7: SCHEMA-INDEX 업데이트
- `docs/ref/SCHEMA-INDEX.md` — `BlockType` 목록에 새 타입 추가

### Step 8: FEATURE-MATRIX 업데이트
- `docs/status/FEATURE-MATRIX.md` — 새 블록 기능 행 추가

### Step 9: CLAUDE.md 업데이트
- `src/components/compose/CLAUDE.md` — 블록 수 갱신 (예: "13종" → "14종")
- `src/components/compose/block-renderers/CLAUDE.md` — 렌더러 파일 목록에 추가
- `src/components/CLAUDE.md` — 블록 수 갱신

### Step 10: 타입 체크
- `tsc --noEmit` 실행하여 타입 에러 없음 확인

## Validation
- [ ] `src/types/blocks.ts`에 인터페이스 + BlockType + Block union 모두 추가
- [ ] 렌더러 파일 생성 + index.ts 배럴 등록
- [ ] block-canvas.tsx 디스패치 + block-palette.tsx 템플릿 등록
- [ ] block-properties-panel.tsx 섹션 추가
- [ ] SCHEMA-INDEX, FEATURE-MATRIX, CLAUDE.md 3곳 문서 갱신
- [ ] `tsc --noEmit` 통과
