---
name: api-contract-sync
description: Keep API routes and type contracts synchronized with docs.
---

## Trigger
- Use when API handlers or shared type contracts change.
- "API 동기화", "스키마 업데이트", "contract sync"

## Read First
1. `docs/ref/SCHEMA-INDEX.md`
2. `src/app/api/projects/[id]/*/route.ts` — 모든 API route 파일
3. `src/types/blocks.ts` — BlockType, BlockDocument 등 타입 정의
4. `docs/status/PROJECT-STATUS.md`

## Do

### 1. 라우트 순회 — 실제 API 목록 수집
- `src/app/api/` 하위의 모든 `route.ts` 파일을 탐색
- 각 파일에서 export된 HTTP 메서드 (GET, POST, PUT, PATCH, DELETE) 확인
- 경로 + 메서드 + 주요 파라미터(body/query) 목록 작성

### 2. SCHEMA-INDEX 비교
- 수집된 라우트 목록과 `docs/ref/SCHEMA-INDEX.md`의 `## API Contract` 섹션 비교
- 불일치 유형:
  - **누락:** 코드에 존재하지만 문서에 없는 엔드포인트 → 문서에 추가
  - **잔존:** 문서에 존재하지만 코드에서 삭제된 엔드포인트 → 문서에서 제거
  - **불일치:** 메서드/파라미터/응답 형식이 다른 경우 → 코드 기준으로 문서 수정

### 3. 타입 계약 동기화
- `src/types/blocks.ts`의 실제 타입 정의와 SCHEMA-INDEX `## Type Contract` 비교
- BlockType enum 멤버, BlockDocument 구조, ProjectStatus 등 핵심 타입 갱신

### 4. Breaking Change 문서화
- 기존 계약과 다른 변경이 있을 경우 SCHEMA-INDEX 하단에 기록:
  ```
  ## Breaking Changes
  - [날짜] `POST /api/projects/:id/generate` body에 `category` 필드 추가 (optional)
  - [날짜] `BlockType`에서 `comparison` 제거
  ```

### 5. 커밋
- 커밋 메시지 패턴: `docs: api-contract-sync — [변경 요약]`

## Validation
- SCHEMA-INDEX의 API 목록이 실제 route 파일과 1:1 대응
- Type Contract의 BlockType/ProjectStatus/PlanTier가 코드와 일치
- Breaking change가 있으면 해당 섹션에 기록됨
