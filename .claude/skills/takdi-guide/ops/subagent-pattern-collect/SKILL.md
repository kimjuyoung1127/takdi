---
name: subagent-pattern-collect
description: Collect implementation patterns via subagent before adding new features.
---

## Trigger
- 블록 추가, API 라우트 추가, 새 기능 설계

## Read First
1. `CLAUDE.md` (Subagent Rules 섹션)

## Do

### 블록 추가 시 — Explore 서브에이전트 1개
프롬프트: "다음 파일에서 기존 블록 패턴(타입 정의, 렌더러 구조, 팔레트 등록, 속성패널 분기)을 줄 번호 + 스니펫으로 수집하라"
대상 파일 (11개):
1. `src/types/blocks.ts` — BlockType enum, 블록 데이터 인터페이스
2. `src/components/compose/block-renderers/index.ts` — barrel export
3. `src/components/compose/block-renderers/<latest-block>.tsx` — 최신 렌더러 전체
4. `src/components/compose/block-palette.tsx` — 팔레트 항목 구조
5. `src/components/compose/block-canvas.tsx` — 렌더러 매핑 switch/map
6. `src/components/compose/block-properties-panel.tsx` — 속성패널 분기
7. `src/components/compose/block-renderers/CLAUDE.md` — 렌더러 규칙
8. `src/components/compose/CLAUDE.md` — compose 규칙
9. `docs/ref/SCHEMA-INDEX.md` — 블록 스키마 섹션
10. `docs/status/FEATURE-MATRIX.md` — 블록 행
11. `src/lib/constants.ts` — 블록 관련 상수

### API 라우트 추가 시 — Explore 서브에이전트 1개
프롬프트: "다음 파일에서 기존 API 라우트 패턴(핸들러 구조, 에러 처리, 응답 포맷)을 수집하라"
대상 파일 (9개):
1. `src/app/api/projects/[id]/route.ts` — 기본 CRUD 패턴
2. `src/app/api/projects/[id]/generate-images/route.ts` — 비동기 작업 패턴
3. `src/lib/api-client.ts` — 클라이언트 호출 패턴
4. `src/services/` — 서비스 레이어 패턴
5. `docs/ref/SCHEMA-INDEX.md` — API 계약
6. `docs/ref/ARCHITECTURE.md` — 아키텍처 규칙
7. `src/lib/CLAUDE.md` — lib 규칙
8. `src/services/CLAUDE.md` — services 규칙
9. `docs/status/FEATURE-MATRIX.md` — API 행

### 반환 포맷
서브에이전트가 다음 형식으로 반환:
```
## 패턴 수집 결과
### 체크리스트
- [ ] 파일1: (요약)
- [ ] 파일2: (요약)
### 코드 스니펫
- 파일:줄번호 — 스니펫
### 주의사항
- (발견된 특이 패턴이나 주의점)
```

## Validation
- 서브에이전트가 대상 파일 전체를 읽었는지 확인
- 체크리스트 기반으로 누락 없이 새 기능 구현
