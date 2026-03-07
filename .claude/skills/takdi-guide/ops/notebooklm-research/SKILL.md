---
name: notebooklm-research
description: Use NotebookLM MCP to query domain knowledge before implementation.
---

## Trigger
- 외부 문서/레퍼런스 기반 구현, 도메인 지식 확인, "노트북에서 찾아봐"
- 경쟁사 분석, 디자인 패턴, 기술 스펙 등 프로젝트 노트북에 저장된 자료 참조
- NOT triggered for: 코드 내부 패턴 질문 (→ subagent-pattern-collect), 문서 정합성 (→ subagent-doc-check)

## Read First
1. `CLAUDE.md` (Subagent Rules -- 3개+ 파일 탐색은 서브에이전트)

## Prerequisites Check
사용 전 반드시 확인:
1. **MCP 서버 등록 여부**: `.claude/settings.local.json`에 notebooklm MCP 설정 존재하는지 확인
2. **인증 상태**: `get_health` 호출로 연결 상태 확인
   - 실패 시: `setup_auth` 또는 `re_auth`로 Google 인증 재시도
3. **노트북 존재 여부**: `list_notebooks`로 사용 가능한 노트북 목록 확인
   - 빈 목록 시: 사용자에게 NotebookLM에서 노트북 생성 및 공유 설정 안내

## Do

### 1. 셋업 상태 체크
```
get_health → 연결 OK?
  → No: setup_auth / re_auth
  → Yes: 계속
list_notebooks → 노트북 존재?
  → No: 사용자에게 안내 ("NotebookLM에서 노트북을 만들고 공유 링크를 활성화해주세요")
  → Yes: 계속
```

### 2. 노트북 연결
- 노트북 URL 확인 또는 `list_notebooks`로 기존 목록 조회
- `select_notebook`으로 활성 노트북 설정

### 3. 질의
- `ask_question`으로 구현에 필요한 정보 질의
- 한 번에 하나의 구체적 질문 (예: "상세페이지 블록 구조 가이드라인은?")
- 답변이 불충분하면 후속 질문으로 좁히기

### 4. 결과 활용
- 노트북 답변을 코드 구현의 근거로 사용
- 할루시네이션 방지: 노트북에 없는 정보는 "없음"으로 반환됨
- 필요시 서브에이전트와 조합 (서브에이전트가 코드 패턴 수집, 메인이 노트북 지식과 매칭)

## Validation
- Prerequisites Check 3단계 모두 통과 후 질의 진행
- 노트북 응답이 "information not found" 아닌 실질적 답변인지 확인
- 구현 근거가 노트북 자료에 기반하는지 확인
