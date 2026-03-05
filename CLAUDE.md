# 탁디장 스튜디오 — AI 에이전트 운영 지침

> 기획 문서(TXT) + 이미지 다수 업로드 → AI 자동 조합 → 3종 숏폼 영상 + 썸네일 + 마케팅 스크립트를 자동 생성하는 완전 독립형 사내 렌더링 엔진.

---

## 1. 7대 실행 규칙

| # | 규칙 | 비고 |
|---|------|------|
| 1 | **런타임/프레임워크 고정:** Node 20.x, TypeScript strict, Next.js 14.x App Router, Tailwind 3.x | 버전 변경 금지 |
| 2 | **문서 동기화:** 모든 코드 변경은 `docs/` 문서와 동기화한다 | 코드만 바꾸고 문서를 빠뜨리지 않는다 |
| 3 | **커밋 메시지:** Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:` 등) | 한글 본문 허용 |
| 4 | **비밀값 관리:** `.env`에만 기록, 절대 커밋 금지 | `.env.example`로 키 이름만 공유 |
| 5 | **타입 우선:** `types/*.ts`에 인터페이스 먼저 정의 → `tsc --noEmit` 통과 확인 후 구현 | 컴파일 실패 상태로 PR 금지 |
| 6 | **Remotion 번들 분리:** `scripts/bundle-remotion.ts`로 사전 빌드, API route에서 `@remotion/bundler` 직접 호출 금지 | Webpack 충돌 방지 |
| 7 | **테스트 필수:** 테스트 없이 PR 금지 | unit 또는 e2e 최소 1건 포함 |

---

## 2. 기술 스택

| 항목 | 기술 | 버전 | 고정 |
|------|------|------|------|
| Framework | Next.js (App Router) | 14.2.x | O |
| Language | TypeScript (strict) | 5.x | O |
| Styling | Tailwind CSS | 3.4.x | O |
| State | Zustand | ^4.5 | O |
| DB | SQLite via Prisma | 5.x | O |
| Video Render | Remotion | 4.x | O |
| Video Preview | @remotion/player | 4.x | O |
| Image | sharp + smartcrop-sharp | latest | - |
| Object Detection | @tensorflow-models/coco-ssd | 4.x | - |
| Audio | aubiojs (WASM) | latest | - |
| LLM | Ollama REST API | localhost:11434 | - |
| Form | React Hook Form + Zod | latest | - |
| Container | Docker + docker-compose | - | - |
| CI/CD | GitHub Actions | - | - |

---

## 3. 문서 인덱스

| 경로 | 역할 |
|------|------|
| `CLAUDE.md` | 루트 허브 — 이 파일. 실행 규칙, 스택, 문서 인덱스 |
| `PLAN.md` | 마스터 구현 계획 (Phase 0-8, 데이터 모델, 성능 예산) |
| `AGENTS.md` | 시스템 스펙 원본 (하드웨어, 핵심 기능, 산출물 정의) |
| `docs/ref/PRD.md` | 제품 요구사항 상세 명세 |
| `docs/ref/ARCHITECTURE.md` | 시스템 아키텍처 다이어그램 |
| `docs/ref/REMOTION-SPEC.md` | Remotion 영상 생성 상세 스펙 |
| `docs/ref/SCHEMA-INDEX.md` | DB 스키마 인덱스 |
| `docs/ref/USER-FLOW.md` | 사용자 플로우 정의 |
| `docs/status/PROJECT-STATUS.md` | 실시간 진행 현황 |
| `docs/status/FEATURE-MATRIX.md` | 기능별 구현 상태 추적 |

---

## 4. 자동화 스케줄

외부 자동화 프로그램(Claude Code 등)이 참조하는 야간 스케줄.

| 작업 ID | 실행 시각 (UTC+9) | 설명 |
|---------|-------------------|------|
| `docs-nightly-organizer` | 매일 22:00 | 문서 구조 검증, 깨진 링크 체크, 누락 문서 탐지 |
| `code-doc-align` | 매일 03:30 | 코드 변경 사항과 `docs/` 문서 간 동기화 점검 및 자동 반영 |
| `integrity-report` | 매일 05:00 | 정합성 리포트 생성 → `docs/status/PROJECT-STATUS.md` 갱신 |

---

## 5. 우선순위 로드맵

아래 순서대로 구현한다. 상세 내용은 [`PLAN.md`](./PLAN.md) 참조.

| Phase | 이름 | 핵심 산출물 |
|-------|------|------------|
| 0 | 프로젝트 부트스트랩 | 디렉토리, 설정 파일, CI, docs 구조 |
| 1 | 타입 & 데이터 레이어 | `types/*.ts`, Prisma 스키마, 시드 데이터 |
| 2 | 웹 대시보드 | UI 컴포넌트, 3단계 폼, Remotion Player 미리보기 |
| 3 | 이미지 처리 | smartCrop, objectDetect, 3비율 병렬 처리 |
| 4 | Remotion 영상 렌더링 | 사전 번들링, 3 Composition, 비트 스냅 |
| 5 | LLM 연동 | TXT 분석 → 슬라이드 자동 분류, 마케팅 스크립트 생성 |
| 6 | 산출물 통합 | 파이프라인 오케스트레이터, 썸네일, NAS 전달 |
| 7 | 테스트 | Jest unit + Playwright e2e, 커버리지 70%+ |
| 8 | 배포 | Docker 멀티스테이지, docker-compose, Mac Mini 배포 |

```
Phase 0 → Phase 1
  ├→ Phase 2 (대시보드)    ─┐
  ├→ Phase 3 (이미지)      ─┤
  ├→ Phase 4 (Remotion)    ─┼→ Phase 6 (통합) → Phase 7 (테스트) → Phase 8 (배포)
  └→ Phase 5 (LLM)        ─┘
```
