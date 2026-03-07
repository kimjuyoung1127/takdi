# Takdi Schema and API Index

Last Updated: 2026-03-07 (KST, Phase 1-3 + Compose UX improvements)

## API Contract (Fixed for MVP)
- `POST /api/projects`
- `POST /api/projects/:id/generate` — Async: returns 202 + jobId
- `GET /api/projects/:id/generate?jobId=xxx` — Poll text generation job status
- `GET /api/projects/:id`
- `PATCH /api/projects/:id/content`
- `POST /api/projects/:id/export` — Async: returns 202 + jobId
- `GET /api/projects/:id/export?jobId=xxx` — Poll export job status
- `GET /api/usage/me`

## API Contract (Image Generation — Kie.ai Nano Banana 2)
- `POST /api/projects/:id/generate-images` — Async: returns 202 + jobId (provider: kie-nano-banana-2)
- `GET /api/projects/:id/generate-images?jobId=xxx` — Poll image generation job status
- Body options: `{ aspectRatio?: string, slots?: string[], apiKey?: string }`

## API Contract (Remove Background — Kie.ai recraft/remove-background)
- `POST /api/projects/:id/remove-bg` — Async: returns 202 + jobId (provider: kie-remove-background)
- `GET /api/projects/:id/remove-bg?jobId=xxx` — Poll background removal job status
- Body options: `{ assetId: string }`

## API Contract (Model Compose — Nano Banana 2 + image_input)
- `POST /api/projects/:id/model-compose` — Async: returns 202 + jobId (provider: kie-nano-banana-2-model-compose)
- `GET /api/projects/:id/model-compose?jobId=xxx` — Poll model composition job status
- Body options: `{ assetId: string, aspectRatio?: string }`
- Prompt text: extracted from project.briefText

## Pipeline Executor Contract
- `executePipeline(projectId, nodes, edges, callbacks, context?)` — 토폴로지 순서 실행
- `PipelineContext = { ratio?: string, uploadedAssetId?: string, category?: string }` — generate-images→aspectRatio, render→templateKey, remove-bg/model-compose→assetId, generate→category

## API Contract (Scene Compose — Kie.ai Nano Banana 2)
- `POST /api/projects/:id/scene-compose` — Async: returns 202 + jobId (이미지 URL + 장면 프롬프트 → Kie.ai 합성)
- `GET /api/projects/:id/scene-compose?jobId=xxx` — Poll scene composition job status
- Body options: `{ imageUrl: string, scenePrompt: string }`

## API Contract (Assets + BYOI)
- `POST /api/projects/:id/assets` — Image upload (FormData)
- `GET /api/projects/:id/assets` — List project assets (에셋 목록 조회)
- `POST /api/projects/:id/bgm` — BGM upload (FormData)
- `POST /api/projects/:id/cuts/handoff`

## API Contract (Block Editor)
- `GET /api/projects/:id/blocks` — Read BlockDocument
- `PUT /api/projects/:id/blocks` — Save BlockDocument

## API Contract (Remotion)
- `POST /api/projects/:id/remotion/preview`
- `POST /api/projects/:id/remotion/render` — Async: returns 202 + jobId
- `GET /api/projects/:id/remotion/status` — Poll render job status

## Type Contract
- `ProjectStatus = draft | generating | generated | failed | exported`
- `PlanTier = solo_free` (future: `starter | pro | agency`)
- `GenerationResult = { sections: Array<{ headline: string; body: string; imageSlot: string; styleKey: string }> }`
- `Asset.sourceType = uploaded | generated | byoi_edited`
- `CutHandoffPayload = { projectId: string; selectedImageId: string; preserveOriginal: boolean }`
- `BlockType = hero | selling-point | image-full | image-grid | text-block | image-text | spec-table | comparison | review | divider | video | cta | usage-steps`
- `ImageFilters = { brightness: number; contrast: number; saturate: number }` — 0–200, default 100
- `ThemePalette = { primary: string; secondary: string; background: string; text: string; accent: string }`
- `BlockDocument = { format: "blocks"; blocks: Block[]; platform: { width: number; name: string }; theme?: ThemePalette; version: number }`
- `TextOverlay.fontFamily?: string` — 오버레이별 글꼴 선택 (FONT_PRESETS value)
- `TextBlockBlock.fontFamily?: string` — 텍스트 블록 글꼴
- `ImageTextBlock.fontFamily?: string` — 이미지+텍스트 블록 글꼴
- `FontPreset = { value: string; label: string; family: string; category: "gothic" | "serif" | "display" }` — 글꼴 프리셋 (15종)
- `FONT_PRESETS` — 15종 한국어 웹폰트 프리셋 (고딕 8 + 명조 4 + 디자인 3)
- `getFontFamily(value?: string): string | undefined` — 글꼴 value → CSS font-family 변환
- `BaseBlock.lockLayout?: boolean` — true인 경우 드래그 재정렬 비활성화
- `ExportMode = "single" | "split" | "card-news"` — 이미지 내보내기 모드
- `StepTiming = { nodeId: string; label: string; durationMs: number }` — 파이프라인 단계별 실행 시간
- `GuardrailViolation = { blockId: string; rule: string; message: string; severity: "warning" | "error"; autoFixable: boolean }` — 디자인 가드레일 위반
- `BriefTags = { category: string; tone: string; target: string; keywords: string[] }` — 태그 기반 브리프
- `LayoutTemplate = { id: string; label: string; category: string; sequence: BlockType[]; framework?: PersuasionFramework }` — 레이아웃 템플릿 (9종)
- `PersuasionFramework = "aida" | "pas-korean" | "pastor"` — 설득 프레임워크 타입
- `HookStyle = "empathy" | "shock" | "question" | "story"` — 훅 문구 스타일 타입
- `HOOK_LIBRARY` — 6카테고리 × 4스타일 = 24개 감성 훅 프리셋 문구
- `PERSUASION_FRAMEWORKS` — 3종 프레임워크 정의 (시퀀스 포함)
- `MoodboardPreset = { id: string; label: string; category: string; theme: ThemePalette; promptHint: string; gradient: string }` — 무드보드 프리셋
- `PERSUASION_SEQUENCES` — 7종 카테고리별 설득 구조 블록 순서 (AIDA 기반)
- `Project.editorMode = flow | compose`
- `FlowNodeType = prompt | generate-images | bgm | cuts | render | export | upload-image | remove-bg | model-compose`

## Prisma Domain Entities
- `User`
- `Workspace`
- `Membership`
- `Project`
- `Asset`
- `GenerationJob`
- `ExportArtifact`
- `UsageLedger`
- `PlanCatalog`

## MVP Constraints
- One user and one workspace are enforced.
- `Membership.plan` is fixed to `solo_free`.
- Billing tables are intentionally absent in MVP.

## Future Additions (Post-Gate)
- `BillingSubscription`
- `InvoiceEvent`
