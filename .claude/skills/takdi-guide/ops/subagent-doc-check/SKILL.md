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
프롬프트 (그대로 사용):
```
다음 파일을 읽고, 각 파일에서 실제 구현된 항목의 "수"와 "이름 목록"을 정확히 추출하라.
추측하지 말고 파일 내용만 기반으로 답하라.

1. src/types/blocks.ts — BlockType union/enum의 모든 멤버 이름과 총 개수
2. src/components/compose/block-renderers/index.ts — export된 렌더러 이름과 총 개수
3. src/components/compose/block-palette.tsx — 팔레트에 표시되는 블록 항목 이름과 총 개수
4. src/app/api/projects/[id]/ — 하위 폴더 목록 (각각이 API route)
5. src/lib/constants.ts — PLATFORM_PRESETS 키 목록과 개수, CATEGORY 관련 상수 목록과 개수

출력 형식:
- BlockType: [목록] (N개)
- Renderers: [목록] (N개)
- Palette: [목록] (N개)
- API Routes: [목록] (N개)
- Platforms: [목록] (N개)
- Categories: [목록] (N개)
```

**서브B — 문서 숫자 추출**
프롬프트 (그대로 사용):
```
다음 문서를 읽고, 각 문서에서 언급된 항목의 "수"와 "이름 목록"을 정확히 추출하라.
추측하지 말고 문서 내용만 기반으로 답하라.

1. docs/ref/SCHEMA-INDEX.md — BlockType 목록과 개수, API endpoint 목록과 개수
2. docs/status/FEATURE-MATRIX.md — 기능별 상태 행의 기능명과 총 행 수
3. docs/status/PROJECT-STATUS.md — Completed 항목 수, In Progress 항목 수

출력 형식:
- SCHEMA BlockType: [목록] (N개)
- SCHEMA API: [목록] (N개)
- FEATURE-MATRIX rows: [목록] (N개)
- PROJECT-STATUS completed: N개, in-progress: N개
```

**서브C — CLAUDE.md 체인 추출**
프롬프트 (그대로 사용):
```
다음 CLAUDE.md 파일을 읽고, 파일 수/블록 수/컴포넌트 수 등 숫자가 언급된 부분을 모두 추출하라.

1. src/components/compose/CLAUDE.md
2. src/components/compose/block-renderers/CLAUDE.md
3. src/components/CLAUDE.md
4. src/lib/CLAUDE.md
5. src/services/CLAUDE.md

출력 형식:
- [파일경로]: "[인용문]" → 숫자 N
```

### 2. 메인에서 비교

**충돌 해결 규칙: 코드가 진실 (Code is Truth)**
- 서브A(코드) vs 서브B(문서) 불일치 → 문서를 코드에 맞춰 수정
- 서브A(코드) vs 서브C(CLAUDE.md) 불일치 → CLAUDE.md를 코드에 맞춰 수정
- 절대로 코드를 문서에 맞추지 않음

비교 항목:
| 비교 | 서브A 키 | 서브B/C 키 |
|---|---|---|
| 블록 수 | BlockType 개수 | SCHEMA BlockType 개수 |
| 렌더러 수 | Renderers 개수 | CLAUDE.md 블록 렌더러 수 |
| API 수 | API Routes 개수 | SCHEMA API 개수 |
| 팔레트 수 | Palette 개수 | CLAUDE.md 팔레트 수 |

### 3. 수정
- 불일치 항목만 문서 쪽에서 코드 진실에 맞춰 수정
- 수정 대상 파일: SCHEMA-INDEX.md, FEATURE-MATRIX.md, PROJECT-STATUS.md, 각 CLAUDE.md

## Validation
- 서브에이전트 3개가 병렬 실행되었는지 확인
- 드리프트 0건이면 "정합성 OK" 보고
- 드리프트 발견 시 항목별 수정 완료 후 목록 출력

## Report Format
```
## 정합성 체크 결과
- 코드 진실: 블록 N종, API M개, 프리셋 K개
- 문서 드리프트: X건 (수정 완료 / 미수정)
  - [파일]: [항목] 코드=N, 문서=M → 수정됨
- CLAUDE.md 드리프트: Y건 (수정 완료 / 미수정)
  - [파일]: [항목] 코드=N, CLAUDE.md=M → 수정됨
```

## Drift Example
코드에 BlockType이 13종이지만 SCHEMA-INDEX에 12종으로 기록:
```
- docs/ref/SCHEMA-INDEX.md: BlockType 코드=13, 문서=12 → "usage-steps" 누락 → 추가하여 수정됨
```
