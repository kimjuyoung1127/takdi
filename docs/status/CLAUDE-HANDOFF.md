# Claude Handoff

Last Updated: 2026-03-06 (KST, MODE-001)
Branch: `main`
Baseline commit: `5259a94`

## Current Snapshot
- All backend API routes implemented (17 endpoints, async where applicable):
  - MVP: projects CRUD, generate (async 202), export (async 202), usage
  - Assets: image upload with BYOI validation, BGM upload with analysis
  - Image generation: async Imagen pipeline with polling
  - Cuts: handoff with preserveOriginal lock
  - Remotion: preview (complete), render (async 202), status (poll)
- **Browser preview page**: `/projects/:id/preview` with @remotion/player + ratio toggle.
- Services: byoi-validator, bgm-analyzer, brief-parser, **gemini-generator**, **imagen-generator**
- **Generate route uses Gemini AI** (`@google/genai`, gemini-2.5-flash) with brief-parser fallback.
- **Image generation uses Imagen** (`imagen-4.0-generate-001`) with async job + polling pattern.
- Client-provided API key supported (`body.apiKey` → future B2B key rotation).
- `styleParams` optional field ready for future category UI.
- **Remotion compositions created**: TakdiVideo_916/1x1/169 with entry point + config.
- Status transitions verified: draft → generating → generated → exported.
- UsageLedger records on generate, image_generation_start, export, render.
- `next build` and `tsc --noEmit` pass cleanly.
- **UI screens complete** with Korean localization and UX improvements (UX-001~005).
- Product flow and wireframe are fixed for:
  - node main editor
  - BYOI path
  - BGM analysis gate
  - Remotion preview/render

## Canonical Docs (Read in Order)
1. `docs/ref/WIREFRAME-NODE-BYOI.md`
2. `docs/ref/USER-FLOW.md`
3. `docs/ref/SCHEMA-INDEX.md`
4. `docs/status/FEATURE-MATRIX.md`
5. `docs/status/PROJECT-STATUS.md`

## Immediate Build Queue
1. ~~Bootstrap runtime~~ — Done
- Next.js + TypeScript + Prisma + SQLite running locally.
- Single-workspace guard implemented (`src/lib/workspace-guard.ts`).

2. ~~Implement data model~~ — Done
- 9 Prisma models with `Asset.sourceType` and `preserveOriginal` fields.

3. ~~Implement API layer~~ — Done
- 12 routes total: 6 MVP + assets + bgm + cuts/handoff + remotion preview/render/status.
- All workspace-scoped with status guards and usage ledger.

4. ~~Brief parser + Remotion compositions~~ — Done
- `src/services/brief-parser.ts`: 3-pass parser (split → extract → assign slots).
- Generate route integrated: stub replaced with parseBrief().
- `src/remotion/`: entry + Root + 3 composition components (916/1x1/169).
- `remotion.config.ts` + package.json scripts added.

5. ~~Gemini AI generation (AI-001)~~ — Done
- `src/services/gemini-generator.ts`: @google/genai SDK, gemini-2.5-flash, structured output.
- Generate route: Gemini → brief-parser fallback. Client apiKey supported.
- Job status transitions: queued → running → done/failed.
- Skill created: `.claude/skills/takdi-guide/generation/gemini-api-call/SKILL.md`.

6. ~~Imagen image generation (AI-002)~~ — Done
- `src/services/imagen-generator.ts`: Imagen 4.0, styleParams optional, callWithRetry.
- `src/lib/save-generated-image.ts`: base64 → file save + Asset record.
- `POST/GET /api/projects/:id/generate-images`: async job + polling pattern.
- Fire-and-forget background processing with GenerationJob status tracking.
- Skill created: `.claude/skills/takdi-guide/generation/async-job-pattern/SKILL.md`.

7. ~~Browser preview (VID-002)~~ — Done
- `src/components/preview/remotion-preview.tsx`: Client component wrapping @remotion/player.
- `src/app/projects/[id]/preview/page.tsx`: Server component with DB fetch + status guard.
- Preview API route updated with complete RemotionInputProps.
- Ratio toggle (9:16 / 1:1 / 16:9) with live composition switching.

8. ~~Sync → Async conversion (ASYNC-001)~~ — Done
- `generate`: POST 202 + GET polling + `processGeneration()` background function.
- `remotion/render`: POST 202 + `processRender()` background (poll via existing `/remotion/status`).
- `export`: POST 202 + GET polling + `processExport()` background function.
- All verified with dev server curl tests: 202 → polling → done.

9. ~~Implement UI screens (UI-001)~~ — Done
- Home: mode cards, BYOI CTA, recent projects.
- Editor: 3-panel layout, floating toolbar, bottom logger, React Flow canvas.
- Preview: Remotion player with ratio toggle.

10. ~~UI-API integration (UI-002)~~ — Done
- `src/lib/api-client.ts`: typed fetch wrappers for all 15 API endpoints.
- `src/hooks/use-async-job.ts` + `use-logger.ts`: polling and log management hooks.
- Editor wiring: Run All (generate→images pipeline), Save, Preview, Export, Stop.
- Properties panel: Assets upload (image/BGM), History (live logs), Cost (usage API).
- File move: `remotion-preview.tsx` → `src/components/preview/`.

11. ~~UX improvements (UX-001~005)~~ — Done
- UX-001: 전체 한글화 (12개 컴포넌트) + 키보드 단축키 (Ctrl+S/Enter/Esc) + Delete/Backspace 노드 삭제.
- UX-002: 빈 캔버스 온보딩 오버레이 (노드 0개 시 안내).
- UX-003: 파이프라인 중 노드 StatusBadge 실시간 변경 (`updateNodesByType`).
- UX-004: sonner 토스트 알림 (저장/생성/내보내기 성공·실패).
- UX-005: Properties 비선택 시 프로젝트 요약 + 단축키 가이드, 30초 자동 저장 + 마지막 저장 시각.
- `src/components/ui/sonner.tsx` 추가 (shadcn sonner).
- UX-006: 파이프라인 실행 중 엣지 `animated` 토글.
- UX-007: React Flow `MiniMap` 추가 (우하단 캔버스 조감).
- UX-008: 프로젝트 이름 인라인 편집 + API `name` 필드 추가.
- UX-009: 노드 우클릭 컨텍스트 메뉴 (복제/삭제/상태초기화).
- UX-010: Undo/Redo (Ctrl+Z/Ctrl+Shift+Z, 50단계 히스토리 스택).

12. ~~Block editor (COMPOSE-001~005)~~ — Done
- `src/types/blocks.ts`: 12 block types (discriminated union) + BlockDocument.
- `src/app/api/projects/[id]/blocks/route.ts`: GET/PUT BlockDocument.
- `src/services/section-to-blocks.ts`: GenerationResult.sections → Block[] conversion.
- `src/lib/platform-presets.ts`: Coupang/Naver output presets.
- `src/lib/api-client.ts`: getBlocks/saveBlocks added.
- `src/app/projects/[id]/compose/page.tsx`: Compose editor page (server component).
- `src/app/projects/[id]/result/page.tsx`: Result preview page.
- `src/components/compose/`: 3-panel editor shell (palette + dnd-kit canvas + properties).
  - compose-shell, compose-toolbar, block-palette, block-canvas, block-properties-panel.
  - block-renderers/: 12 individual files (all blocks fully editable).
  - shared/: EditableText, ImageUploadZone, VideoUploadZone, ColorStylePicker.
  - compose-context.tsx: ComposeProvider + useCompose() (projectId 전달).
  - text-overlay-editor: image text overlay drag editing.
  - image-picker: file upload + URL input.
  - block-preview: readOnly block rendering.
  - Block types extended: ReviewBlock.displayStyle, VideoBlock.mediaType, CtaBlock.ctaStyle/bgColor/buttonColor.
- Generate route: editorMode:"compose" → auto-convert sections to blocks.
- Home page: compose mode card + updated tagline.
- Floating toolbar: compose editor cross-navigation link.
- prisma/schema.prisma: Project.editorMode field added.
- npm: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities.

13. ~~Block editor bug fix (COMPOSE-007)~~ — Done
- `src/app/uploads/[...path]/route.ts`: 업로드 파일 정적 서빙 (path traversal 방어, MIME 자동, immutable cache).
- `src/app/api/projects/[id]/assets/route.ts`: `skipValidation` 파라미터 → 영상/GIF 업로드 시 byoi-validator 건너뜀 (50MB 제한).
- `src/lib/api-client.ts`: `uploadAsset` opts에 `skipValidation` 추가.
- `src/components/compose/shared/video-upload-zone.tsx`: skipValidation=true 전달.
- `src/components/compose/block-renderers/selling-point-block.tsx`: 아이콘 드롭다운 확대 (grid-cols-3, 라벨 텍스트).
- `src/components/compose/block-renderers/divider-block.tsx`: unused props → `_onUpdate`/`_readOnly`.
- `src/types/blocks.ts`: `TextBlockBlock.fontSize` 필드 추가.
- `src/components/compose/block-renderers/text-block.tsx`: fontSize CSS 분기.
- `src/components/compose/block-properties-panel.tsx`: 글꼴 크기 선택기 추가.
- `src/components/compose/block-palette.tsx`: text-block 기본값 `fontSize: "base"`.

14. MVP Demo deployment (DEPLOY-001) — Done
- ngrok 터널링 (port 3003): `https://43aa-59-12-254-198.ngrok-free.app`
- SQLite + 로컬 uploads/ 기반, dev 서버 + ngrok 두 터미널 필요.

15. ~~Block image export (EXPORT-001)~~ — Done
- `html2canvas-pro` npm 패키지 (Tailwind CSS v4 호환 클라이언트 사이드 DOM 캡처).
- `src/lib/block-export.ts`: captureBlocksAsImage, exportToDownload, buildDefaultFilename 유틸.
- `src/components/compose/export-dialog.tsx`: 파일명/포맷(PNG·JPG) 설정 모달 다이얼로그.
- `src/components/compose/block-canvas.tsx`: forwardRef + exporting prop (캡처 시 DnD 핸들/InsertButton 숨김).
- `src/components/compose/compose-shell.tsx`: exportOpen 상태 + canvasRef + ExportDialog 연동.
- `src/components/compose/block-preview.tsx`: forwardRef 지원 (Result 페이지 캡처용).
- `src/app/projects/[id]/result/result-view.tsx`: "이미지 다운로드" 버튼 (JPG 즉시 다운로드).
- scale: 2 (고해상도), useCORS: true, backgroundColor: #ffffff.

16. ~~UX text polish (UX-011)~~ — Done
- 20+ 파일에서 기술 용어→사용자 친화 한글 변환 (노드→작업 단계, 에셋→파일, 캔버스→작업 영역 등).
- `src/lib/constants.ts`: MODE_LABELS, BLOCK_TYPE_LABELS 공유 상수 추출.
- 블록 팔레트 desc 툴팁, 에러 토스트 추가, BYOI 제거, silent error 수정.
- status-badge.tsx: STATUS_LABELS export + 노드 상태 추가.

17. ~~Page loading performance (PERF-001)~~ — Done
- 5개 loading.tsx 스켈레톤: app/, compose/, editor/, result/, preview/.
- dynamic import: ComposeShell, NodeEditorShell, RemotionPreview (next/dynamic).
- html2canvas-pro: lazy `await import()` (내보내기 시에만 로드).
- API 최적화: `select` 필드 제한, `Promise.all` 병렬 쿼리 (usage API).
- 모드 카드: 로딩 스피너 + 에러 토스트.
- 성능 점검 스킬: `.claude/skills/takdi-guide/ops/perf-page-check/SKILL.md`.

18. ~~Mode-based node filtering (MODE-001)~~ — Done
- `src/lib/constants.ts`: FlowNodeType 타입, MODE_NODE_CONFIG(모드→허용노드+초기파이프라인), NODE_TYPE_LABELS/DESCS.
- `src/app/projects/[id]/editor/page.tsx`: Prisma select에 mode 추가, Shell에 mode prop 전달.
- `src/components/editor/node-editor-shell.tsx`: mode prop → NodePalette/NodeCanvas/FloatingToolbar 전달, updateNodesByType("generate"→"prompt").
- `src/components/editor/node-palette.tsx`: MODE_NODE_CONFIG 기반 모드별 노드 필터링.
- `src/components/editor/node-canvas.tsx`: buildInitialNodes(mode) 동적 초기 노드 생성.
- `src/components/editor/takdi-node.tsx`: ICONS에 prompt + generate(하위호환) 등록.
- `src/components/editor/floating-toolbar.tsx`: 이미지 전용 모드 미리보기 숨김, 단계 라벨 "프롬프트 처리 중".

19. Align docs after each milestone
- Update together:
  - `PROJECT-STATUS.md`
  - `FEATURE-MATRIX.md`
  - `SCHEMA-INDEX.md` (if contract changed)

## Acceptance Checklist
- User can finish one full path:
  - create project -> select mode/BYOI -> cut edit handoff -> BGM analyze -> remotion preview -> render -> export
- Project status transitions are valid:
  - `draft -> generating -> generated -> exported` (+ failed path)
- Usage event is recorded on generation/render/export.

## Guardrails
- Do not open billing/team features before gate (`20+ real outputs`).
- Do not change status file names in `docs/status`.
- Do not break workspace scoping even in single-user mode.
