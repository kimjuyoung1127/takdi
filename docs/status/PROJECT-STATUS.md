# Takdi Project Status

Last Updated: 2026-03-06 (KST, MODE-001 모드별 노드 분리)

## Current Phase
- Runtime bootstrap completed.
- All backend API routes implemented (17 endpoints, all async where applicable).
- Brief text parser implemented (CORE-002): headings/paragraphs → structured sections.
- Remotion composition baseline implemented (VID-001): 3 ratios (9:16, 1:1, 16:9).
- Gemini AI generation implemented (AI-001): `@google/genai` + structured output + fallback.
- Imagen image generation implemented (AI-002): async job + polling + file save + Asset record.
- Browser preview implemented (VID-002): @remotion/player + preview page + ratio toggle.
- Async conversion completed (ASYNC-001): generate, render, export routes → fire-and-forget + polling.
- UI screens implemented (UI-001): Tailwind v4 + shadcn/ui + React Flow.
  - Home: mode cards, BYOI CTA, recent projects list.
  - Editor: 3-panel layout (palette + canvas + properties), floating toolbar, bottom logger.
  - Preview: Tailwind migration from inline styles.
  - 8 folder CLAUDE.md files, code-conventions skill.
- UI-API integration completed (UI-002): api-client layer, editor wiring (Run/Save/Preview/Export), properties panel (Assets/History/Cost), file restructure.
- UX improvements completed (UX-001~005):
  - UX-001: 전체 한글화 + 키보드 단축키 (Ctrl+S/Enter/Esc) + Delete 키 노드 삭제
  - UX-002: 빈 캔버스 온보딩 오버레이
  - UX-003: 파이프라인 중 노드 상태 실시간 반영 (StatusBadge 연동)
  - UX-004: 토스트 알림 (sonner) — 저장/생성/내보내기 성공·실패
  - UX-005: Properties 프로젝트 요약 + 단축키 가이드 + 30초 자동 저장 + 마지막 저장 시각 표시
  - UX-006: 파이프라인 실행 중 엣지 애니메이션 (흐르는 점선)
  - UX-007: React Flow MiniMap (우하단 캔버스 조감)
  - UX-008: 프로젝트 이름 인라인 편집 (에디터 좌상단)
  - UX-009: 노드 우클릭 컨텍스트 메뉴 (복제/삭제/상태초기화)
  - UX-010: Undo/Redo (Ctrl+Z / Ctrl+Shift+Z, 50단계 히스토리)
- Block editor implemented (COMPOSE-001~005):
  - 12 block types with discriminated union types (`src/types/blocks.ts`)
  - Block CRUD API (`GET/PUT /api/projects/:id/blocks`)
  - Compose editor page (`/projects/:id/compose`) with 3-panel layout
  - @dnd-kit sortable canvas with drag-and-drop reordering
  - 12 fully implemented block renderers (개별 파일, 모든 블록 인라인 편집 가능)
  - ComposeProvider + useCompose() 컨텍스트 (projectId 전달)
  - 공용 컴포넌트: EditableText, ImageUploadZone, VideoUploadZone, ColorStylePicker
  - data-placeholder CSS로 플레이스홀더 자동 표시/클리어
  - Block properties panel with ImagePicker + ColorStylePicker 연동
  - Text overlay editor for images (drag position, font size, color, weight)
  - Image picker (file upload + URL input)
  - Result/preview page (`/projects/:id/result`)
  - AI generation → block auto-conversion (editorMode:"compose")
  - Cross-navigation between node editor and compose editor
  - Home page updated with compose mode card
  - Platform presets (Coupang 780px, Naver 860px)
  - Auto-save 30s + Ctrl+S + Ctrl+Z/Shift+Z undo/redo
  - Block types extended: ReviewBlock.displayStyle, VideoBlock.mediaType, CtaBlock.ctaStyle/bgColor/buttonColor
- Block editor bug fixes (COMPOSE-007):
  - Upload file serving route (`/uploads/[...path]`) — 이미지 404 해소
  - Video/GIF upload skipValidation — 영상 업로드 400 해소
  - Icon dropdown enlarged (grid-cols-3, labels) — 사용성 개선
  - Divider props cleanup — TS 경고 제거
  - TextBlock fontSize option (sm/base/lg/xl) — 글꼴 크기 변경 지원
- MVP Demo: ngrok을 통한 클라이언트 데모 배포 완료
  - dev 서버 (port 3003) + ngrok 터널링
  - SQLite + 로컬 uploads/ 기반 즉시 배포
- Block image export implemented (EXPORT-001):
  - html2canvas-pro 기반 클라이언트 사이드 DOM→이미지 캡처
  - `src/lib/block-export.ts`: captureBlocksAsImage + exportToDownload + buildDefaultFilename
  - Compose 에디터: 내보내기 다이얼로그 (파일명/포맷 PNG·JPG 선택)
  - Result 페이지: 이미지 다운로드 버튼 (JPG 즉시 다운로드)
  - BlockCanvas forwardRef + exporting 모드 (캡처 시 DnD/UI 숨김)
  - BlockPreview forwardRef 지원
- UX text polish completed (UX-011):
  - 전체 기술 용어 → 사용자 친화 한글 (20+ 파일, "노드"→"작업 단계", "에셋"→"파일", "캔버스"→"작업 영역")
  - 블록 팔레트 desc 툴팁, 에러 토스트 추가, BYOI 제거
  - `src/lib/constants.ts` 공유 라벨 상수 (MODE_LABELS, BLOCK_TYPE_LABELS)
- Page loading performance improved (PERF-001):
  - 5개 loading.tsx 스켈레톤 (홈, compose, editor, result, preview)
  - dynamic import: ComposeShell, NodeEditorShell, RemotionPreview (번들 사이즈 감소)
  - html2canvas-pro lazy import (내보내기 시에만 로드)
  - API 쿼리 최적화: select 필드 제한, Promise.all 병렬 쿼리
  - 모드 카드 로딩 스피너 + 에러 토스트
  - 성능 점검 스킬 생성 (`.claude/skills/takdi-guide/ops/perf-page-check/`)
- Mode-based node filtering implemented (MODE-001):
  - `src/lib/constants.ts`: FlowNodeType, MODE_NODE_CONFIG, NODE_TYPE_LABELS/DESCS
  - 모드별 허용 노드 필터링 (brand-image: 3종, gif-source: 4종, freeform: 6종)
  - `generate` → `prompt` 노드 리네이밍 ("텍스트 생성" → "프롬프트 입력")
  - 모드별 초기 파이프라인 자동 생성 (buildInitialNodes)
  - 이미지 전용 모드에서 미리보기 버튼 숨김
  - 기존 저장 프로젝트 하위 호환 (ICONS 맵에 generate + prompt 둘 다 등록)
- Next target: 인라인 결과 미리보기, 동적 파이프라인 실행, E2E 테스트, Railway 배포.

## Gate
- Validation gate: 20 real outputs completed.
- Subscription expansion remains `Deferred` until gate pass.

## Current Strategy
- Single-user UX first.
- Multi-tenant-ready internal model.
- Billing integration deferred.

## Deployment Plan
- **Current**: ngrok 터널링 (MVP 데모용, 로컬 PC 필요)
- **Primary**: Railway 배포 예정 (persistent volume, SQLite/PostgreSQL)
- **Secondary**: Mac Mini + NAS (자체 운영, SQLite 가능)
- 로컬 개발: SQLite 유지
- Prisma 추상화로 코드 변경 없이 provider + DATABASE_URL만 교체

## Contract Snapshot
- `ProjectStatus`: `draft | generating | generated | failed | exported`
- `PlanTier`: `solo_free`
- Core APIs (async endpoints return 202 + jobId):
  - `POST /api/projects`
  - `POST /api/projects/:id/generate` → 202
  - `GET /api/projects/:id/generate?jobId=xxx` (poll)
  - `GET /api/projects/:id`
  - `PATCH /api/projects/:id/content`
  - `GET /api/projects/:id/blocks` — Block document read
  - `PUT /api/projects/:id/blocks` — Block document write
  - `POST /api/projects/:id/export` → 202
  - `GET /api/projects/:id/export?jobId=xxx` (poll)
  - `POST /api/projects/:id/remotion/render` → 202
  - `GET /api/projects/:id/remotion/status` (poll)
  - `GET /api/usage/me`

## Next Actions
1. ~~Implement DB schema~~ — Done (prisma/schema.prisma, 9 models, seed complete).
2. ~~Implement project APIs~~ — Done (6 MVP routes with workspace scope guard, status transitions, usage ledger).
3. ~~Implement node editor shell (`/projects/:id/editor`) and BYOI entry path~~ — Done (UI-001: Home + Editor + Preview Tailwind migration).
4. ~~Implement cuts/handoff, remotion/preview, remotion/render, remotion/status~~ — Done (stubs with DB records).
5. ~~Implement brief text parser (CORE-002)~~ — Done (src/services/brief-parser.ts, generate route integrated).
6. ~~Implement Remotion composition baseline (VID-001)~~ — Done (3 compositions + entry + config).
7. ~~Implement Gemini AI generation (AI-001)~~ — Done (gemini-generator service + generate route + fallback).
8. ~~Implement Imagen image generation (AI-002)~~ — Done (imagen-generator + async job + polling + save-generated-image).
9. ~~Implement browser preview (VID-002)~~ — Done (@remotion/player + preview page + ratio toggle).
10. ~~Convert sync routes to async (ASYNC-001)~~ — Done (generate, render, export → 202 + fire-and-forget + polling).
11. ~~Implement UI screens (UI-001)~~ — Done (Home + Editor + Preview, 20+ components, Tailwind v4 + shadcn/ui + React Flow).
12. Keep docs synchronized using `docs/status/CLAUDE-HANDOFF.md` checklist.

## Risks
- Scope creep into billing/team features before validation gate.
- Drift between planning docs and API/type implementation.

## Drift
- status-model drift: 0
- api-contract drift: 0 (doc baseline)
