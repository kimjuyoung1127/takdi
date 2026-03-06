# Feature Matrix

Last Updated: 2026-03-06 (KST, COMPOSE-001 Block Editor)
Status enum: `Not Started | In Progress | Done | Blocked | Deferred`

| ID | Feature | Status | Owner | Notes |
|---|---|---|---|---|
| BOOT-001 | Runtime bootstrap (Next.js + Prisma + SQLite + seed) | Done | claude | 9 models, types, workspace guard |
| CORE-001 | Workspace-scoped project CRUD | Done | claude | 6 MVP API routes, workspace guard enforced |
| CORE-002 | Text brief input and parse entry | Done | claude | brief-parser service + generate route integration |
| CORE-003 | Multi-image asset upload | Done | claude | POST /api/projects/:id/assets + BYOI validator |
| AI-001 | Brief-to-sections generation | Done | claude | Gemini 2.5 Flash + structured output + brief-parser fallback + async 202 |
| AI-002 | Image-slot mapping | Done | claude | Imagen 4.0 + async job + polling + save-generated-image |
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
| COMPOSE-001 | Block editor (12 block types + dnd-kit canvas) | Done | claude | 상세페이지 블록 에디터: 타입, DB, API, UI, 프리뷰, 통합 |
| COMPOSE-002 | Section → Block auto-conversion | Done | claude | AI 생성 결과 → 블록 자동 변환 (editorMode:compose) |
| COMPOSE-003 | Block preview + result page | Done | claude | /projects/:id/result 프리뷰 페이지 |
| COMPOSE-004 | Text overlay editor | Done | claude | 이미지 위 텍스트 오버레이 드래그 편집 |
| COMPOSE-005 | Image picker | Done | claude | 파일 업로드/URL 입력 이미지 선택기 |
| BILL-001 | Billing integration | Deferred | unassigned | after gate pass |
| TEAM-001 | Team roles and invites | Deferred | unassigned | after gate pass |
