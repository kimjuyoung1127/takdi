---
name: subagent-doc-check
description: Subagent-based document consistency check across code and docs.
---

## Trigger
- "문서 체크", "정합성", "doc sync", "drift check"

## Read First
1. `CLAUDE.md` (Subagent Rules 섹션)

## Do

### 1. Explore 서브에이전트 3개 병렬 실행

**서브A — 코드 진실 수집**
프롬프트: "다음 파일에서 실제 구현된 항목 수와 이름 목록을 추출하라"
- `src/types/blocks.ts` — BlockType enum 멤버 수, 이름
- `src/components/compose/block-renderers/index.ts` — export 수
- `src/components/compose/block-palette.tsx` — 팔레트 항목 수
- `src/app/api/projects/[id]/` — API route 폴더 목록
- `src/lib/constants.ts` — 플랫폼 프리셋 수, 카테고리 수

**서브B — 문서 숫자 추출**
프롬프트: "다음 문서에서 숫자/목록 항목을 추출하라"
- `docs/ref/SCHEMA-INDEX.md` — BlockType 목록, API endpoint 목록
- `docs/status/FEATURE-MATRIX.md` — 기능별 상태 행 수
- `docs/status/PROJECT-STATUS.md` — 완료/진행중 항목 수

**서브C — CLAUDE.md 체인 추출**
프롬프트: "다음 CLAUDE.md 파일에서 파일 수/블록 수 언급을 추출하라"
- `src/components/compose/CLAUDE.md`
- `src/components/compose/block-renderers/CLAUDE.md`
- `src/components/CLAUDE.md`

### 2. 메인에서 비교
- 서브A 결과 vs 서브B 결과: 코드-문서 드리프트
- 서브A 결과 vs 서브C 결과: 코드-CLAUDE.md 드리프트
- 불일치 항목만 정리

### 3. 수정
- 불일치 항목을 문서 쪽에서 코드 진실에 맞춰 수정

## Validation
- 서브에이전트 3개가 병렬 실행되었는지 확인
- 드리프트 0건이면 "정합성 OK" 보고
- 드리프트 발견 시 항목별 수정 완료 후 목록 출력

## Report Format
```
## 정합성 체크 결과
- 코드 진실: 블록 N종, API M개, 프리셋 K개
- 문서 드리프트: X건 (수정 완료 / 미수정)
- CLAUDE.md 드리프트: Y건 (수정 완료 / 미수정)
```
