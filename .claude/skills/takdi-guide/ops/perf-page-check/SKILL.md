---
name: perf-page-check
description: Check page loading performance patterns when adding or reviewing pages.
---

## Trigger
- 새 page.tsx 추가 시
- 기존 페이지 성능 점검 요청 시

## Read First
1. 대상 `page.tsx`
2. 대응 `loading.tsx` (같은 디렉토리)
3. 관련 API route (데이터 소스)

## Checklist
1. **loading.tsx** 존재하는가? — 없으면 스켈레톤 UI 파일 생성
2. **무거운 클라이언트 컴포넌트**에 `next/dynamic` + `ssr: false` 적용했는가?
   - ReactFlow, dnd-kit, Remotion, html2canvas 등 대형 라이브러리 포함 컴포넌트
3. **Prisma 쿼리**에 `select` 사용하는가? 불필요한 `include` 없는가?
4. **순차 쿼리**가 `Promise.all`로 병렬화 가능한가?
5. **네비게이션 트리거**(버튼/카드 클릭)에 로딩 피드백(스피너/disabled) 있는가?
6. **대형 라이브러리**가 lazy import(`await import()`)로 처리되었는가?

## Validation
- `npx next build --no-lint` 통과
- 브라우저에서 해당 페이지 진입 시 스켈레톤이 즉시 표시됨
- Network 탭에서 불필요한 대형 chunk가 초기 로드에 포함되지 않음
