# 탁디장 스튜디오 — 기능 추적 매트릭스

> 최종 갱신일: 2026-03-05

---

## 상태 규칙

- `Not Started` → `In Progress` → `Done` / `Blocked` / `Deferred`
- 상태 변경 시 **검증 근거** 필수 기재 (커밋 해시, 테스트 결과, 스크린샷 등)
- `Blocked` 전환 시 비고에 블로커 내용 기재
- `Deferred` 전환 시 비고에 보류 사유 기재

---

## 기능 매트릭스

### Core 기능

| ID | 기능 | Phase | 상태 | 검증 근거 | 비고 |
|----|------|-------|------|-----------|------|
| CORE-001 | 프로젝트 CRUD | 1, 2 | Not Started | - | Prisma 모델 + API 라우트 + UI |
| CORE-002 | TXT 업로드/복붙 + 파싱 | 2 | Not Started | - | 파일 업로드 또는 텍스트 영역 직접 입력 |
| CORE-003 | 이미지 다수 업로드 | 2 | Not Started | - | 드래그앤드롭, 프리뷰 썸네일 |
| CORE-004 | BGM 선택/업로드 | 2 | Not Started | - | 내장 라이브러리 또는 MP3/WAV 업로드 |

### AI 기능

| ID | 기능 | Phase | 상태 | 검증 근거 | 비고 |
|----|------|-------|------|-----------|------|
| AI-001 | TXT→슬라이드 자동 분류 (Ollama) | 5 | Not Started | - | 기획 텍스트 파싱 → 슬라이드 배분 |
| AI-002 | 이미지↔텍스트 매칭 | 5 | Not Started | - | 슬라이드별 이미지-텍스트 최적 조합 |
| AI-003 | 마케팅 스크립트 생성 | 5 | Not Started | - | Ollama LLM 기반 |

### 이미지 처리

| ID | 기능 | Phase | 상태 | 검증 근거 | 비고 |
|----|------|-------|------|-----------|------|
| IMG-001 | 스마트 크롭 (3비율) | 3 | Not Started | - | 9:16, 1:1, 16:9 — sharp + smartcrop-sharp |

### 영상 생성

| ID | 기능 | Phase | 상태 | 검증 근거 | 비고 |
|----|------|-------|------|-----------|------|
| VID-001 | Remotion 컴포지션 | 4 | Not Started | - | 3비율 Composition 등록 |
| VID-002 | 비트 스냅 엔진 | 4 | Not Started | - | aubiojs + 슬라이드 경계 비트 스냅 |
| VID-003 | Remotion Player 미리보기 | 2, 4 | Not Started | - | 브라우저 실시간 미리보기 |
| VID-004 | 사전 번들링 + 렌더 워커 | 4 | Not Started | - | @remotion/bundler 사전 빌드 |

### 산출물

| ID | 기능 | Phase | 상태 | 검증 근거 | 비고 |
|----|------|-------|------|-----------|------|
| OUT-001 | 썸네일 생성 | 6 | Not Started | - | sharp 기반 합성 |
| OUT-002 | NAS 전달 + manifest | 6 | Not Started | - | 로컬 temp → NAS 복사 + JSON manifest |

### UI/UX

| ID | 기능 | Phase | 상태 | 검증 근거 | 비고 |
|----|------|-------|------|-----------|------|
| UI-001 | 디자인 시스템 컴포넌트 | 2 | Not Started | - | 더스티로즈/베이지 톤 — Button, Card, Input 등 |
| UI-002 | 프로젝트 생성 3단계 폼 | 2 | Not Started | - | 업로드 → AI 분석 → 슬라이드 편집 |
| UI-003 | SlideEditor | 2 | Not Started | - | AI 조합 결과 확인/수정 에디터 |
| UI-004 | SSE 실시간 진행률 | 2 | Not Started | - | 렌더링 중 진행률 표시 |

### 인프라

| ID | 기능 | Phase | 상태 | 검증 근거 | 비고 |
|----|------|-------|------|-----------|------|
| INFRA-001 | Docker 배포 | 8 | Not Started | - | 멀티스테이지 빌드 + docker-compose |
| INFRA-002 | CI/CD | 8 | Not Started | - | GitHub Actions |

---

## 요약 통계

| 상태 | 개수 |
|------|------|
| Not Started | 20 |
| In Progress | 0 |
| Done | 0 |
| Blocked | 0 |
| Deferred | 0 |
| **합계** | **20** |
