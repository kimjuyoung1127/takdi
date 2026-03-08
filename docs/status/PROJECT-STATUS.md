# Takdi Project Status

Last Updated: 2026-03-08 (KST, editor surface redesign + settings ops summary)

## Latest Update
- Editor surface redesign completed for operator-first workflow.
- Verified with final `npm run typecheck` and `npm run build` on 2026-03-08.
- Key shipped changes in this pass:
  - added simple/expert editor surface rules in `src/lib/editor-surface.ts`
  - fixed-pipeline modes (`model-shot`, `cutout`, `brand-image`) now default to simple mode
  - added step-card workspace for simple mode and removed technical metadata from the operator-facing panel
  - hid `node id`, raw `nodeType`, History, Cost, and bottom live logs from simple mode
  - moved cost/activity visibility to `/settings` with monthly events, export count, estimated cost, and recent activity cards
  - persisted editor view mode in localStorage per mode
  - repositioned the simple/expert toggle to the top-right to avoid overlap with the centered action toolbar

- Korean-first UI recovery and internal i18n foundation completed and documented in `docs/plans/korean-ui-i18n/`.
- Verified with final `npm run typecheck` and `npm run build` on 2026-03-08.
- Current production build snapshot:
  - `/`: `203 kB`
  - `/projects`: `202 kB`
  - `/settings`: `188 kB`
  - `/projects/[id]/compose`: `191 kB`
  - `/projects/[id]/preview`: `195 kB`
  - `/projects/[id]/result`: `124 kB`
  - shared first load JS: `102 kB`
- Key shipped changes in this pass:
  - added `src/i18n/` typed dictionary, provider, hook, and message-aware formatter helpers
  - connected `RootLayout` to a Korean default message catalog without locale routing
  - restored Korean copy across home, projects, settings, recent-project filters, saved templates, and sidebar/header
  - restored Korean copy across compose shared toolbar, save-template dialog, leave dialog, brief-builder, and toasts
  - removed non-serializable function-valued message entries to keep Next.js Client Component boundaries build-safe
- Previous Remotion on-demand preview pass remains documented in `docs/status/REMOTION-ON-DEMAND-CHECKLIST.md`.

- Remotion on-demand preview pass completed and documented in `docs/status/REMOTION-ON-DEMAND-CHECKLIST.md`.
- Verified with final `npm run build` on 2026-03-07 after clearing a stale `.next` cache.
- Current production build snapshot:
  - `/projects/[id]/preview`: `195 kB`
  - `/projects/[id]/editor`: `212 kB`
  - `/projects/[id]/compose`: `188 kB`
  - `/projects/[id]/result`: `124 kB`
  - shared first load JS: `102 kB`
- Key shipped changes in this pass:
  - preview route now renders a lightweight shell first and delays Remotion browser runtime to explicit user click
  - `@remotion/player` import is isolated to `src/components/preview/remotion-player-runtime.tsx`
  - preview fallback now works without Player and includes a retry flow for runtime import failures
  - compatibility wrapper retained in `src/components/preview/remotion-preview.tsx` without Player imports
  - build blocker fixed by adding `style` support to `EditableText`
- Previous performance optimization pass remains documented in `docs/status/PERFORMANCE-OPTIMIZATION-CHECKLIST.md`.

- Legacy status snapshot from the earlier performance pass:
- Performance optimization pass completed across all 15 tracked items.
- Canonical implementation log: `docs/status/PERFORMANCE-OPTIMIZATION-CHECKLIST.md`
- Verified with final `npm run build` on 2026-03-07.
- Current production build snapshot:
  - `/projects/[id]/preview`: `226 kB`
  - `/projects/[id]/editor`: `212 kB`
  - `/projects/[id]/compose`: `185 kB`
  - `/projects/[id]/result`: `123 kB`
  - shared first load JS: `102 kB`
- Completed themes in this pass:
  - global font migration to `next/font` and removal of CSS font import warnings
  - Remotion preview composition chunk splitting and editor preview preflight removal
  - read-only renderer split for result/card-news flows
  - passive preview image sizing plus upload-time WebP/preview normalization
  - compose rerender reduction, pointer-only DnD, debounced editor history, polling cleanup
  - API `select` slimming, page-level metadata coverage, dependency cleanup

## Current Phase
- Runtime bootstrap completed.
- All backend API routes implemented (19 endpoints, all async where applicable).
- Brief text parser implemented (CORE-002): headings/paragraphs → structured sections.
- Remotion composition baseline implemented (VID-001): 3 ratios (9:16, 1:1, 16:9).
- Gemini AI generation implemented (AI-001): `@google/genai` + structured output + fallback.
- ~~Imagen image generation implemented (AI-002)~~ → replaced by Kie.ai Nano Banana 2 (KIE-001).
- Kie.ai Nano Banana 2 image generation implemented (KIE-001): Kie.ai API proxy, 1K/2K/4K, $0.04~0.09/image.
- Browser preview implemented (VID-002): @remotion/player + preview page + ratio toggle.
- Async conversion completed (ASYNC-001): generate, render, export routes → fire-and-forget + polling.
- UI screens implemented (UI-001): Tailwind v4 + shadcn/ui + React Flow.
  - Home: mode cards, BYOI CTA, recent projects list.
  - Editor: 3-panel layout (palette + canvas + properties), floating toolbar, bottom logger.
  - Preview: Tailwind migration from inline styles.
  - 8 folder CLAUDE.md files, code-conventions skill.
- UI-API integration completed (UI-002): api-client layer, editor wiring (Run/Save/Preview/Export), properties panel refactor, file restructure.
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
  - 13 block types with discriminated union types (`src/types/blocks.ts`)
  - Block CRUD API (`GET/PUT /api/projects/:id/blocks`)
  - Compose editor page (`/projects/:id/compose`) with 3-panel layout
  - @dnd-kit sortable canvas with drag-and-drop reordering
  - 13 fully implemented block renderers (개별 파일, 모든 블록 인라인 편집 가능)
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
- Pipeline executor tests implemented (TEST-001): 35 vitest tests, 7 groups, all mocked (0원).
- Global ratio setting implemented (RATIO-001): 플로팅 툴바 비율 토글 (9:16/1:1/16:9), 노드별 비율 UI 제거, PipelineContext로 전달.
- Image generation migrated to Kie.ai (KIE-001): Imagen 4.0 → Nano Banana 2, 2K/4K에서 40~60% 비용 절감.
- Cutout + model-shot pipeline redesigned (CUTOUT-FIX):
  - cutout 모드: `upload-image → remove-bg → export` (프롬프트 불필요, Kie.ai recraft/remove-background)
  - model-shot 모드: `upload-image → prompt → model-compose → export` (Nano Banana 2 + image_input 참조)
  - 새 노드 타입 3종: `upload-image` (수동 업로드, skip), `remove-bg` (배경 제거), `model-compose` (모델 합성)
  - 새 API 2종: `POST/GET /api/projects/:id/remove-bg`, `POST/GET /api/projects/:id/model-compose`
  - 새 서비스: `removebg-service.ts` (Kie.ai recraft/remove-background 클라이언트)
  - Properties panel: upload-image 노드 선택 시 인라인 이미지 업로드 UI
  - PipelineContext에 `uploadedAssetId` 추가 (upload-image 노드 → remove-bg/model-compose 전달)
  - 기존 모드 (brand-image, gif-source, freeform) 영향 없음
  - vitest 테스트 (CUTOUT-FIX 기준 39개, 이후 89개로 확장)
- Editor surface redesign completed (EDITOR-SURFACE-001):
  - `model-shot`, `cutout`, `brand-image` now default to `간단 모드`
  - `freeform` remains `전문가 모드` first
  - simple mode replaces the node graph with step cards and a single current-step panel
  - simple mode hides node id, raw type, History, Cost, and bottom live logs
  - expert mode keeps React Flow editing and moves technical metadata into `고급 정보`
  - `/settings` now owns monthly activity, export count, estimated cost, and recent activity summaries
  - top-right mode toggle placement avoids overlap with the centered action toolbar
- Competitive analysis completed (COMPETITIVE-ANALYSIS):
  - 4개 참조 자료 + 1개 직접 경쟁사(PicCordial) 분석
  - 핵심 갭 2건 발견: GAP-1 모드 간 에셋 단절, GAP-2 이미지 보정/업스케일 미구현
  - 8개 우선순위 기능 도출 (GAP-1 > GAP-2 > C1 AI 배경 합성 > C2 템플릿 > F1 카테고리 프롬프트)
  - Takdi 경쟁 우위 확인: 엔드투엔드 파이프라인, 40~75% 비용 절감, 6개 모드
  - 분석 문서: `docs/ref/COMPETITIVE-ANALYSIS.md`
- Cross-mode asset sharing implemented (GAP-1):
  - `GET /api/projects/:id/assets` — 프로젝트 에셋 목록 조회 API
  - `getProjectAssets()` api-client 함수 추가
  - `AssetGrid` 공용 컴포넌트 (썸네일 그리드, sourceType 라벨)
  - ImagePicker: "프로젝트 파일" 탭 추가 (cutout/model-shot 결과 즉시 사용)
  - ImageUploadZone: "프로젝트 파일에서 선택" 버튼 추가
- Image quality adjustment implemented (GAP-2):
  - `ImageFilters` type (brightness/contrast/saturate, 0–200)
  - `ImageFilterControls` 공용 컴포넌트 (슬라이더 + 초기화)
  - `buildFilterStyle()` CSS filter 문자열 빌더
  - 5종 이미지 블록 적용: hero, image-full, image-text, image-grid, comparison
  - 속성 패널에 보정 슬라이더 추가
- AI scene compositing implemented (C1):
  - `POST/GET /api/projects/:id/scene-compose` — 이미지 URL + 장면 프롬프트 → Kie.ai 합성
  - `startSceneCompose`/`pollSceneCompose` api-client 함수
  - `SceneComposeAction` 공용 컴포넌트 (프롬프트 입력 + 비동기 폴링)
  - hero, image-full, image-text 블록 속성패널에 "AI 배경 합성" 버튼 추가
- Background template library implemented (C2):
  - `src/lib/scene-templates.ts` — 6카테고리 24종 장면 프롬프트 (스튜디오/라이프스타일/자연/시즌/미니멀/프리미엄)
  - SceneComposeAction에 카테고리 탭 + 템플릿 그리드 + 직접 입력 통합 UI
- Category-aware prompts implemented (F1):
  - 6종 카테고리: 패션/뷰티/식품/유아/전자/홈 (`PRODUCT_CATEGORIES`)
  - `CATEGORY_INSTRUCTIONS` — 카테고리별 Gemini 프롬프트 가이드라인
  - generate API에 `category` 파라미터 전달
  - 프롬프트 노드 속성 패널에 카테고리 드롭다운 추가
  - PipelineContext에 `category` 추가, 파이프라인 실행 시 자동 전달
- Additional platform presets implemented (E1):
  - 6종: 쿠팡(780), 네이버(860), 11번가(800), G마켓(860), SSG(750), 자사몰(900)
  - `PLATFORM_PRESETS` / `PLATFORM_WIDTHS` 공유 상수 (constants.ts)
  - compose-shell + compose-toolbar 공유 상수 참조로 전환
- Global color palette implemented (A1):
  - `ThemePalette` type (primary/secondary/background/text/accent)
  - `BlockDocument.theme` optional field
  - 7종 프리셋: 기본/따뜻한/시원한/자연/럭셔리/파스텔/모노톤
  - `ThemePicker` UI (프리셋 선택 + 커스텀 색상 편집)
  - 캔버스에 CSS 변수 + 배경/글자색 적용, ComposeContext에 theme 전달
- Usage steps block implemented (B3):
  - 13번째 블록 타입: `usage-steps` (번호 + 이미지 + 라벨 + 설명)
  - 추가/삭제 (최대 6단계), ImageUploadZone + EditableText 인라인 편집
  - 팔레트, 캔버스, 프리뷰, 속성패널 통합 완료
- Persuasion layout mapping implemented (LAYOUT-001):
  - 7종 카테고리별 AIDA 설득 구조 블록 순서 자동 매핑 (PERSUASION_SEQUENCES)
  - section-to-blocks에 category 파라미터, sortByPersuasionSequence() 정렬
  - Gemini 프롬프트에 styleKey 순서 힌트 주입
- Pipeline speed measurement implemented (SPEED-001):
  - StepTiming 인터페이스, performance.now() 기반 단계별 타이밍
  - onStepTiming/onPipelineDone 콜백, 완료 토스트에 총 소요 시간 표시
- Zero-prompt template builder implemented (TEMPLATE-001):
  - 태그 기반 브리프 빌더 (카테고리/톤/타겟/키워드 선택)
  - 6종 레이아웃 템플릿 (layout-templates.ts), 템플릿 배치 전용 (API 호출 없음)
  - BriefBuilder 모달: 카테고리 선택 → 레이아웃 템플릿 → 무드보드 선택
- Multi-format export implemented (EXPORT-002):
  - 4모드 내보내기: 단일 이미지, 분할 ZIP (JSZip), 카드뉴스 1080×1080, HTML 인라인 스타일
  - html-exporter.ts: 13종 블록 → 인라인 스타일 HTML 변환 (XSS 방지)
  - export-dialog.tsx 4모드 선택 UI
- Design guardrail system implemented (GUARD-001):
  - 5종 규칙: max-text-length(150자), min-font-size(14px), adjacent-duplicate, missing-image, no-cta
  - validateBlocks() 규칙 엔진 + GuardrailIndicator 경고 아이콘
  - "디자인 점검" 버튼 (compose-toolbar)
- Moodboard selection implemented (MOOD-001):
  - 24종 무드보드 프리셋 (6카테고리 × 4스타일), ThemePalette 자동 매핑
  - MoodboardPicker 타일 UI, 선택 시 테마 즉시 적용
- Layout lock implemented (LOCK-001):
  - BaseBlock.lockLayout 필드, 잠금 블록 드래그 비활성화
- Guardrail auto-fix implemented (GUARD-002):
  - `autoFixBlock()`: min-font-size 14px 교정, max-text-length 150자 절단
  - `autoFixAllBlocks()`: 일괄 수정 + CTA 블록 자동 추가
  - GuardrailIndicator에 "자동 수정" 버튼, compose-toolbar에 "전체 수정" 버튼
  - max-text-length, no-cta → autoFixable: true로 변경
- Persuasion framework expansion implemented (FRAMEWORK-001):
  - 3종 프레임워크: AIDA(기본), 한국형 PAS, PASTOR
  - 프레임워크별 레이아웃 템플릿 3종 추가 (총 9종)
  - BriefBuilder에 프레임워크 선택 UI (시퀀스 프리뷰 포함)
- Hook phrase library implemented (HOOK-001):
  - 6카테고리 × 4스타일 = 24개 감성 훅 프리셋 (HOOK_LIBRARY)
  - BriefBuilder에 훅 스타일 선택 UI, 적용 시 hero 블록 오버레이에 자동 삽입
- Mobile real-time preview implemented (MOBILE-001):
  - 375px 모바일 프레임 래퍼 + 모바일/데스크탑 전환 토글 (Smartphone↔Monitor 아이콘)
  - compose-toolbar에 상태별 "모바일"/"데스크탑" 토글, block-canvas에 프레임 UI
- Compose editor UX improvements implemented (FONT-001, DND-001, INSERT-001, UPLOAD-001, OVERLAY-001):
  - **글꼴 선택 (FONT-001)**: 15종 한국어 웹폰트 (고딕 8 + 명조 4 + 디자인 3)
    - `FONT_PRESETS` 상수, `getFontFamily()` 헬퍼, `FontPreset` 타입
    - `FontPicker` 팝오버 (카테고리 탭: 전체/고딕/명조/디자인 + 실시간 폰트 프리뷰)
    - `fontFamily?` 필드: TextOverlay, TextBlockBlock, ImageTextBlock
    - globals.css에 Google Fonts + CDN @import (14종 웹폰트)
    - hero/text-block/image-text 블록 렌더러 + 속성패널 적용
  - **팔레트 드래그 앤 드롭 (DND-001)**: 팔레트→캔버스 직접 드래그
    - DndContext를 compose-shell로 끌어올려 팔레트+캔버스 통합
    - `useDraggable` 팔레트 아이템, `useDroppable` 블록 사이 드롭존
    - `DragOverlay`로 드래그 중 라벨 고스트, 기존 클릭 추가 유지
  - **삽입 위치 인디케이터 (INSERT-001)**: "+" 클릭 시 시각적 안내
    - 인디고색 점선 박스 + "여기에 블록이 추가됩니다" 텍스트 (pulse 효과)
    - ESC 키로 해제, 팔레트 블록 클릭 시 해당 위치에 삽입 후 소멸
  - **업로드 버튼 명확화 (UPLOAD-001)**: ImageUploadZone 빈 상태 UI 개선
    - 명시적 "이미지 업로드" 버튼 (Upload 아이콘) + "또는 파일을 끌어다 놓으세요" 안내
    - 기존 전체 영역 클릭, 드래그 드롭, 프로젝트 파일 선택 유지
  - **오버레이 드래그 + 정렬 (OVERLAY-001)**: hero 블록 텍스트 위치 편집
    - 캔버스 내 오버레이 드래그 위치 변경 (mousedown/move/up, contentEditable 충돌 방지)
    - 드래그 중 직접 DOM 업데이트 (부드러운 시각 피드백), mouseup 시 단일 상태 커밋
    - 속성패널 오버레이 편집기: 추가/삭제, 9방향 빠른 정렬 프리셋 (3×3 그리드), X/Y 수치 입력, 크기/색상/굵기/정렬/글꼴
    - 반응형 폰트 스케일링: ResizeObserver로 컨테이너 너비 감지, 모바일(375px) 전환 시 자동 축소 (hero, image-full)
- 89개 vitest 테스트 통과 (기존 39 + 가드레일 10 + 브리프/템플릿 11 + 기타 29)
- Next target: P1 구현 (플랫폼별 HTML 내보내기, 품질 검사 고도화, 대화형 위자드, 공유 링크, 톤별 플레이스홀더).

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
  - `GET /api/projects/:id/assets` — 에셋 목록 조회
  - `POST /api/projects/:id/remove-bg` → 202 (배경 제거)
  - `GET /api/projects/:id/remove-bg?jobId=xxx` (poll)
  - `POST /api/projects/:id/model-compose` → 202 (모델 합성)
  - `GET /api/projects/:id/model-compose?jobId=xxx` (poll)
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

## Architecture Sync (dawn pipeline — 2026-03-08)
- Last checked: 2026-03-08 04:00 KST
- Overall: MEDIUM confidence alignment — 2 enumeration gaps, 3 documentation gaps, no contradictions detected
- HIGH: 0 | MEDIUM: 2 | LOW: 3
- MEDIUM-1: API routes count off by ±1 (ARCHITECTURE.md says 17, actual 18 route.ts files); no itemization in doc
- MEDIUM-2: 5 active/stub services missing from architecture narrative (kie-generator, removebg-service, section-to-blocks, byoi-validator, bgm-analyzer)
- LOW-1: Block type system (18 BlockTypes) not referenced in ARCHITECTURE.md
- LOW-2: FlowNodeType (9 nodes) vs BlockType (18 blocks) architectural distinction undocumented
- LOW-3: ExportArtifact types not enumerated (HTML / single / split / card-news) — no validation on DB side
- Manual required: Update ARCHITECTURE.md to enumerate routes and services; add BlockType system reference; define ExportArtifactType enum in code
