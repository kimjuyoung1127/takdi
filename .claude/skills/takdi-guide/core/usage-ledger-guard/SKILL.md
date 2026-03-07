---
name: usage-ledger-guard
description: Protect usage accounting behavior for generation and export events.
---

## Trigger
- Use when generation/export flow or usage endpoints change.
- "사용량", "usage", "ledger", "과금"

## Read First
1. `docs/ref/SCHEMA-INDEX.md` — UsageLedger 엔티티, API contract
2. `src/app/api/usage/me/route.ts` — 사용량 조회 API 구현
3. `src/app/api/projects/[id]/generate/route.ts` — 생성 시 usage 기록 로직
4. `docs/status/FEATURE-MATRIX.md`

## Do

### 1. 이벤트 타입 확인
UsageLedger에 기록되는 이벤트 타입:
- `text_generation` — 텍스트 생성 1회
- `image_generation` — 이미지 생성 1회
- `export` — 내보내기 1회
- 각 이벤트는 API route handler에서 `UsageLedger.create()` 호출로 기록

### 2. 집계 로직 확인
- `/api/usage/me` — 현재 월 기준 집계
- 집계 기준: `createdAt >= 이번 달 1일 00:00 UTC`
- 반환 형식: `{ used: number, limit: number, plan: string }`
- `solo_free` 플랜의 제한은 PlanCatalog 테이블에서 조회

### 3. 변경 영향 검증
- generation/export route 수정 시 UsageLedger.create() 호출이 유지되는지 확인
- 새 이벤트 타입 추가 시 `/api/usage/me` 집계에 반영되는지 확인
- 에러 발생 시에도 사용량이 차감되지 않는지 확인 (성공 후에만 기록)

### 4. 문서 동기화
- 이벤트 타입 추가/변경 시 SCHEMA-INDEX에 반영

## Validation
- `/api/usage/me` 응답이 문서와 호환
- 모든 과금 이벤트가 성공 시에만 기록
- 월간 집계가 정확
