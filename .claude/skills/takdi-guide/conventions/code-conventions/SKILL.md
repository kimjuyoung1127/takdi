---
name: code-conventions
description: Takdi 프로젝트의 코드 구조 컨벤션 — 이름 매핑, 폴더 문서화, 파일 헤더.
---

## Trigger
- 새 파일이나 폴더를 생성할 때 항상 적용.
- 코드 리뷰 시 컨벤션 준수 여부 확인.

## Rule 1: API ↔ Frontend 1:1 이름 매핑

API 라우트의 마지막 경로 세그먼트와 프론트엔드 컴포넌트 폴더명을 일치시킨다.

```
API route                                    → Component folder
src/app/api/projects/[id]/generate/          → src/components/generate/
src/app/api/projects/[id]/generate-images/   → src/components/generate-images/
src/app/api/projects/[id]/export/            → src/components/export/
src/app/api/projects/[id]/remotion/render/   → src/components/remotion/ (or editor/remotion-*)
src/app/api/projects/[id]/assets/            → src/components/assets/
src/app/api/projects/[id]/bgm/              → src/components/bgm/
```

### 복합 화면 (editor)
에디터 페이지는 여러 API를 조합하므로, `src/components/editor/` 폴더 내 파일명에 API 세그먼트를 반영:
```
src/components/editor/generate-panel.tsx   → /api/projects/:id/generate 호출
src/components/editor/assets-panel.tsx     → /api/projects/:id/assets 호출
src/components/editor/export-action.tsx    → /api/projects/:id/export 호출
```

### 단독 페이지
1:1 매핑이 가능한 경우 페이지 경로도 일치:
```
API:   /api/projects/[id]/generate
Page:  /projects/[id]/editor  (generate는 editor 내 기능)

API:   /api/projects/[id]/remotion/preview
Page:  /projects/[id]/preview
```

## Rule 2: 폴더 CLAUDE.md

모든 주요 폴더에 `CLAUDE.md`를 배치하여 폴더의 목적과 파일 목록을 문서화한다.

### 형식
```markdown
# folder-name/
(이 폴더의 존재 이유 1줄)

## Files
- `file-a.tsx` — 간단 설명
- `file-b.tsx` — 간단 설명

## Convention
- (이 폴더 내 파일이 따라야 할 규칙)
```

### 규칙
- 폴더에 파일을 추가/삭제할 때 해당 폴더의 CLAUDE.md도 함께 업데이트.
- 최소 `src/components/`, `src/lib/`, `src/services/`, `src/app/` 하위 주요 폴더에 배치.
- 빈 폴더에는 불필요 (`.gitkeep`만 있으면 스킵).

## Rule 3: 파일 헤더 주석

모든 새 파일의 첫 줄에 JSDoc 형식으로 파일 설명을 추가한다.

### 형식
```typescript
/** 프로젝트 상태를 시각적으로 표시하는 배지 컴포넌트 */
```

### 규칙
- 한 줄, `/** ... */` 형식.
- 컴포넌트: "~하는 컴포넌트" or "~ component"
- 서비스/유틸: "~를 처리하는 서비스" or "~ service"
- 라우트: "POST/GET /api/..." 형태 설명
- 기존 파일은 수정 시에만 추가 (소급 적용 안 함).
- CSS, config 등 비코드 파일은 생략 가능.

## Exceptions
- 테스트 파일 (`*.test.ts`, `*.spec.ts`, `__tests__/`): JSDoc 헤더 생략 가능
- 설정 파일 (`*.config.ts`, `*.config.js`): JSDoc 헤더 생략 가능
- 타입 정의 전용 파일 (`*.d.ts`): JSDoc 헤더 생략 가능
- CSS/JSON/환경 파일: 컨벤션 적용 대상 아님

## Validation
- 새 파일 생성 시: 헤더 주석 존재 여부 확인 (예외 파일 제외)
- 새 폴더 생성 시: CLAUDE.md 존재 여부 확인
- 새 컴포넌트 폴더 생성 시: API 세그먼트 매핑 확인
