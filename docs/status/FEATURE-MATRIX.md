# Feature Matrix

Last Updated: 2026-03-09 (KST, deployment bootstrap)
Status enum: `Not Started | In Progress | Done | Blocked | Deferred`

| ID | Feature | Status | Owner | Notes |
|---|---|---|---|---|
| BOOT-001 | Runtime bootstrap (Next.js + Prisma + SQLite + seed) | Done | claude | 9 models, types, workspace guard |
| CORE-001 | Workspace-scoped project CRUD | Done | claude | 6 MVP API routes, workspace guard enforced |
| CORE-002 | Text brief input and parse entry | Done | claude | brief-parser service + generate route integration |
| CORE-003 | Multi-image asset upload | Done | claude | POST /api/projects/:id/assets + BYOI validator |
| AI-001 | Brief-to-sections generation | Done | claude | Gemini 2.5 Flash + structured output + brief-parser fallback + async 202 |
| AI-002 | Image-slot mapping | Done | claude | ~~Imagen 4.0~~ → Kie.ai Nano Banana 2 (KIE-001) + async job + polling |
| AI-003 | Manual edit save loop | Done | claude | PATCH /api/projects/:id/content |
| UI-001 | Node main editor canvas | Done | claude | Home + Editor screens: Tailwind v4, shadcn/ui, React Flow, 20+ components |
| UI-002 | UI-API integration | Done | claude | api-client layer, editor wiring (Run/Save/Preview/Export), properties panel, file restructure |
| IMG-004 | BYOI validation and original lock | Done | claude | byoi-validator + preserveOriginal + cuts/handoff |
| AUD-001 | BGM analysis gate | Done | claude | POST /api/projects/:id/bgm + bgm-analyzer (duration gate) |
| VID-001 | Remotion composition baseline | Done | claude | 3 compositions (916/1x1/169) + Root + entry + config |
| VID-002 | Browser preview integration | Done | claude | @remotion/player + preview page + ratio toggle |
| VID-003 | Remotion preview + render pipeline | Done | claude | preview/render/status API + async 202 render |
| OUT-001 | Export artifact generation | Done | claude | POST /api/projects/:id/export + async 202 + polling |
| OPS-001 | Usage ledger monthly aggregation | Done | claude | GET /api/usage/me with summary |
| UX-001 | Korean localization + keyboard shortcuts | Done | claude | 전체 한글화, Ctrl+S/Enter/Esc, Delete 키 노드 삭제 |
| UX-002 | Empty canvas onboarding | Done | claude | 노드 0개 시 안내 오버레이 |
| UX-003 | Real-time node status badges | Done | claude | 파이프라인 중 노드 StatusBadge 실시간 변경 |
| UX-004 | Toast notifications | Done | claude | sonner 토스트: 저장/생성/내보내기 성공·실패 |
| UX-005 | Project summary + auto-save | Done | claude | 비선택 시 프로젝트 요약 + 단축키 가이드, 30초 자동 저장 |
| UX-006 | Animated edges during pipeline | Done | claude | 실행 중 엣지 흐르는 점선 애니메이션 |
| UX-007 | MiniMap | Done | claude | React Flow 내장 미니맵, 우하단 |
| UX-008 | Inline project name editing | Done | claude | 에디터 좌상단 클릭 편집, API name 필드 추가 |
| UX-009 | Node context menu | Done | claude | 우클릭 복제/삭제/상태초기화 |
| UX-010 | Undo/Redo | Done | claude | Ctrl+Z/Ctrl+Shift+Z, 50단계 히스토리 스택 |
| COMPOSE-001 | Block editor (13 block types + dnd-kit canvas) | Done | claude | 상세페이지 블록 에디터: 타입, DB, API, UI, 프리뷰, 통합 |
| COMPOSE-002 | Section → Block auto-conversion | Done | claude | AI 생성 결과 → 블록 자동 변환 (editorMode:compose) |
| COMPOSE-003 | Block preview + result page | Done | claude | /projects/:id/result 프리뷰 페이지 |
| COMPOSE-004 | Text overlay editor | Done | claude | 이미지 위 텍스트 오버레이 드래그 편집 |
| COMPOSE-005 | Image picker | Done | claude | 파일 업로드/URL 입력 이미지 선택기 |
| COMPOSE-006 | Block editor UX upgrade | Done | claude | 공용 인프라(ComposeContext, shared/), 12종 풀 편집, ImageUploadZone, EditableText, placeholder CSS, 8종 개별 파일 추출 |
| COMPOSE-007 | Block editor bug fix + UX | Done | claude | 이미지 404, 영상 400, 아이콘 드롭다운, divider 경고, fontSize 지원 |
| COMPOSE-008 | Result preview render parity | Done | codex | `BlockPreview`/result now reuse the same block renderers and theme wrapper as compose; removed divergent read-only renderer path |
| DEPLOY-001 | MVP demo (ngrok) | Done | claude | ngrok 터널링으로 클라이언트 데모 배포 |
| DEPLOY-002 | Mac Mini runtime path + ops bootstrap | Done | codex | `UPLOADS_DIR` 지원, pm2/Caddy templates, runtime path print, uploads backup snapshot script, deployment guide |
| EXPORT-001 | Block image export (html2canvas-pro) | Done | claude | 클라이언트 사이드 DOM→PNG/JPG 캡처, Compose 다이얼로그 + Result 다운로드 |
| UX-011 | User-friendly text polish | Done | claude | 기술 용어→한글 친화 (20+ 파일), 공유 라벨 상수, desc 툴팁, 에러 토스트 |
| PERF-001 | Page loading performance | Done | claude | 5개 loading.tsx 스켈레톤, dynamic import, lazy html2canvas, API 쿼리 최적화 |
| MODE-001 | Mode-based node filtering + prompt rename | Done | claude | 모드별 허용 노드 필터링, generate→prompt 리네이밍, 초기 파이프라인 자동 생성 |
| SHORTFORM-001 | Guided shortform video mode | Done | codex | `shortform-video` mode, shared home/launcher definitions, fixed simple-mode pipeline |
| SHORTFORM-002 | Zero-cost shortform completion path | Done | codex | Validated on 2026-03-09: brief-parser fallback + manual scene assignment + BGM + preview + render + export + result |
| SHORTFORM-003 | Advanced timeline editor | Not Started | codex | Next milestone: trim, transition duration, BGM in/out, beat-snap timeline UX |
| SHORTFORM-004 | Multi-reference role tuning | Not Started | codex | Next milestone: product/mood/composition roles + scene-level overrides for Kie inputs |
| OUT-003 | Shortform preview artifacts | Done | codex | `thumbnail` + `marketing-script` APIs, preview actions, result artifact view |
| OUT-004 | Thumbnail/script quality optimization | Not Started | codex | Next milestone: channel presets, copy guardrails, multi-variation compare in preview |
| UX-012 | Unified direct upload hub | Done | codex | Home and global launcher now open the same staged upload flow before project creation |
| CORE-004 | Project delete API | Done | codex | `DELETE /api/projects/:id`, workspace validation, relational cleanup, best-effort upload folder removal |
| UX-013 | Drawer-based project/template management | Done | codex | Home recent projects and saved templates now share the same collapsible drawer pattern |
| UX-014 | Bulk delete on `/projects` | Done | codex | Projects and templates each support independent selection mode, confirmation, and sequential delete progress |
| COPY-001 | User-facing terminology cleanup | Done | codex | Korean UI labels now prefer `상세페이지` over `compose` while internal mode keys stay unchanged |
| PIPE-001 | Dynamic pipeline executor | Done | claude | Kahn 토폴로지 정렬 + 콜백 기반 실행 엔진 |
| TEST-001 | Pipeline executor tests | Done | claude | 35 vitest tests, 7 groups, all mocked (0원) |
| RATIO-001 | Global ratio setting | Done | claude | 플로팅 툴바 비율 토글, PipelineContext, 노드별 비율 UI 제거 |
| KIE-001 | Kie.ai Nano Banana 2 migration | Done | claude | Imagen 4.0→Nano Banana 2, 2K/4K 40~60% 비용 절감, 4K 네이티브 |
| CUTOUT-FIX | Cutout + model-shot pipeline redesign | Done | claude | cutout: upload→remove-bg→export, model-shot: upload→prompt→model-compose→export, 새 노드 3종+API 2종+서비스 1종, 39 tests |
| COMP-001 | Competitive analysis & improvement roadmap | Done | claude | 4 refs + PicCordial analysis, GAP-1/GAP-2 identified, 8 priority features, docs/ref/COMPETITIVE-ANALYSIS.md |
| GAP-1 | Cross-mode asset sharing (cutout->compose) | Done | claude | GET /assets API + AssetGrid + ImagePicker 에셋탭 + ImageUploadZone 에셋선택 |
| GAP-2 | Image quality adjustment (CSS filters) | Done | claude | ImageFilters type + 밝기/대비/채도 슬라이더 + 5종 이미지 블록 적용 |
| C1 | AI background/scene compositing | Done | claude | scene-compose API + SceneComposeAction UI + 3종 이미지 블록 속성패널 적용 |
| C2 | Background template library | Done | claude | 6카테고리 24종 장면 템플릿 + SceneComposeAction 템플릿 선택 UI |
| F1 | Category-aware prompts | Done | claude | 6종 카테고리 (패션/뷰티/식품/유아/전자/홈) + buildPrompt 분기 + 프롬프트 노드 카테고리 선택 UI |
| E1 | Additional platform presets (11st/Gmarket/SSG) | Done | claude | 6종 플랫폼 (쿠팡/네이버/11번가/G마켓/SSG/자사몰) + PLATFORM_PRESETS 공유 상수 |
| A1 | Global color palette (BlockDocument.theme) | Done | claude | ThemePalette type + 7종 프리셋 + ThemePicker UI + CSS 변수 캔버스 적용 |
| B3 | Usage steps block (new block type) | Done | claude | 13번째 블록: 번호+이미지+라벨+설명, 추가/삭제(최대 6), 팔레트+캔버스+프리뷰+속성패널 통합 |
| LAYOUT-001 | Persuasion layout mapping (AIDA) | Done | claude | 7종 카테고리별 설득 구조 블록 순서 자동 매핑 (PERSUASION_SEQUENCES), section-to-blocks 연동 |
| SPEED-001 | Pipeline speed measurement | Done | claude | StepTiming, performance.now() 단계별 타이밍, onStepTiming/onPipelineDone 콜백 |
| TEMPLATE-001 | Zero-prompt template builder | Done | claude | 태그 브리프 빌더 + 6종 레이아웃 템플릿 + BriefBuilder 모달, 템플릿 배치 전용 (API 호출 없음) |
| EXPORT-002 | Multi-format export (ZIP/HTML/card-news) | Done | claude | 4모드: 단일이미지/분할ZIP(JSZip)/카드뉴스1080/HTML인라인, html-exporter 13블록 변환 |
| GUARD-001 | Design guardrail system | Done | claude | 5종 규칙 엔진 + GuardrailIndicator + "디자인 점검" 버튼, validateBlocks() |
| MOOD-001 | Moodboard selection | Done | claude | 24종 프리셋 (6카테고리×4스타일) + ThemePalette 자동 매핑 + MoodboardPicker UI |
| LOCK-001 | Layout lock (lockLayout) | Done | claude | BaseBlock.lockLayout, 잠금 블록 드래그 비활성화 |
| TEST-002 | Guardrail + template tests | Done | claude | 가드레일 10 + 브리프/템플릿 11 = 21 신규 테스트, 총 89개 |
| GUARD-002 | Guardrail auto-fix | Done | claude | autoFixBlock(font/text) + autoFixAllBlocks(일괄+CTA추가) + "자동 수정"/"전체 수정" 버튼 |
| FRAMEWORK-001 | Persuasion framework expansion | Done | claude | AIDA/한국형PAS/PASTOR 3종 프레임워크 + 레이아웃 템플릿 9종 + BriefBuilder 선택 UI |
| HOOK-001 | Hook phrase library | Done | claude | 6카테고리×4스타일=24 감성 훅 프리셋 + BriefBuilder 훅 선택 UI + hero 블록 자동 삽입 |
| MOBILE-001 | Mobile real-time preview | Done | claude | 375px 모바일 프레임 래퍼 + 모바일/데스크탑 전환 토글, 반응형 폰트 스케일링 |
| FONT-001 | Font selection system (15 Korean webfonts) | Done | claude | FontPicker 팝오버 (카테고리탭+실시간 프리뷰), FONT_PRESETS 15종, hero/text-block/image-text 적용 |
| DND-001 | Palette drag & drop to canvas | Done | claude | DndContext compose-shell 통합, useDraggable 팔레트, useDroppable 드롭존, DragOverlay 고스트 |
| INSERT-001 | Insert position indicator | Done | claude | "+" 클릭 시 인디고색 삽입 표시줄, ESC 취소, 팔레트 클릭 시 해당 위치 삽입 |
| UPLOAD-001 | Explicit upload button | Done | claude | ImageUploadZone 빈 상태에 명시적 "이미지 업로드" 버튼 + 드래그앤드롭 안내 |
| OVERLAY-001 | Hero overlay drag + align presets | Done | claude | 오버레이 드래그 위치 편집, 9방향 빠른 정렬, 속성패널 오버레이 편집기 (추가/삭제/위치/크기/색상/굵기/정렬/글꼴) |
| BILL-001 | Billing integration | Deferred | unassigned | after gate pass |
| TEAM-001 | Team roles and invites | Deferred | unassigned | after gate pass |
