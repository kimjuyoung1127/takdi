# Takdi Wireframe Spec (Editor Surface + BYOI)

Version: 1.3.0
Last Updated: 2026-03-08 (KST)
Owner: Product/Platform

## IA Summary
- Screen 1: Home (`/`)
- Screen 2: Node Editor (`/projects/:id/editor`)
- Screen 3: Compose (`/projects/:id/compose`)
- Screen 4: Result (`/projects/:id/result`)
- Screen 5: Workspace Hub (`/workspace`)

## Screen Wireframes
### 1) Home
- Top starts immediately with `새 작업 시작`
- No hero intro card, no pulse/summary cards, no dashboard note card
- Primary CTA group:
  - mode cards for new work
  - `직접 업로드 (BYOI)`
- Home-only user-facing mode label:
  - `compose` is presented as `상세페이지 제작`
- Lower section:
  - recent projects drawer
  - saved templates panel

### 2) Global Header
- Left:
  - coral brand mark
- Center:
  - search trigger styled as an input
- Right:
  - `작업 시작` global launcher CTA
  - notification bell opens activity panel
  - profile button routes to `/workspace`

### 3) Editor (`/projects/:id/editor`)
- Shared top global actions:
  - Run All
  - Stop
  - Save
  - Preview
  - Export
  - Open Compose
- Shared top controls:
  - project name edit button on the left
  - `간단 모드 / 구조 보기` toggle on the right for `model-shot`, `cutout`, `brand-image`

#### 3-A) Simple Mode
- Applies to:
  - `model-shot`
  - `cutout`
  - `brand-image`
- Left panel:
  - hidden
- Center:
  - step cards only
  - no node drag, edges, minimap, context menu
- Right panel:
  - single current-step panel
  - only user-facing fields and related files
- Hidden in simple mode:
  - node id
  - raw node type
  - history tab
  - cost tab
  - bottom live log panel

#### 3-B) Structure View
- Left panel:
  - node palette or guided read-only structure
- Center:
  - node canvas and edges
- Right panel tabs:
  - 작업 내용
  - 파일
- Advanced metadata:
  - node id shown only inside `고급 정보`
  - raw node type shown only as secondary/internal text

### 4) Compose (`/projects/:id/compose`)
- Keeps the current layout ratio:
  - top toolbar
  - left block palette
  - center canvas
  - right properties panel
- Uses the same warm-gray surface system as home/editor
- Home-facing labels avoid technical `compose` wording where possible

### 5) Result
- Artifact groups:
  - Images
  - GIF
  - Video (with audio)
- Actions:
  - Download
  - Copy share link
  - Re-open editor
  - Start new project

### 6) Workspace Hub (`/workspace`)
- Workspace summary
- Usage and cost summary
- Recent activity
- Placeholder sections for members, permissions, brand settings, and plan/B2B expansion

### 7) Settings
- Runtime/storage summary remains read-only
- Technical and operations settings stay here
- Admin-style metrics remain visible here in addition to the workspace summary surface

## Surface Rules
- `model-shot`, `cutout`, `brand-image` open in simple mode first.
- `freeform` and `gif-source` open in structure-first mode.
- Editor view mode selection persists in localStorage per mode.
- In guided modes, `간단 모드 / 구조 보기` must not imply unrestricted graph editing.
- Home dashboard should stay minimal:
  - no explanatory hero copy before the first work cards
  - no redundant summary cards that repeat project/template counts already visible below
  - no technical wording such as `compose` on the first screen
- Header controls should always map to a concrete action:
  - `작업 시작` -> launcher
  - search -> overlay
  - bell -> activity panel
  - profile -> workspace hub

## API and Type Contract Summary
### API
- `POST /api/projects`
- `POST /api/projects/:id/generate`
- `GET /api/projects/:id`
- `PATCH /api/projects/:id/content`
- `POST /api/projects/:id/export`
- `GET /api/usage/me`
- `POST /api/projects/:id/cuts/handoff`
- `POST /api/projects/:id/remotion/preview`
- `POST /api/projects/:id/remotion/render`
- `GET /api/projects/:id/remotion/status`

### Types
- `ProjectStatus = draft | generating | generated | failed | exported`
- `Asset.sourceType = uploaded | generated | byoi_edited`
- `CutHandoffPayload.preserveOriginal: boolean`
