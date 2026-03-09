# Takdi Schema and API Index

Last Updated: 2026-03-09 (KST, Provider abstraction + ComfyUI local)

## API Contract (Core)
- `POST /api/projects`
- `GET /api/projects/:id`
- `PATCH /api/projects/:id/content`
- `GET /api/usage/me`

## API Contract (Async Generation)
- `POST /api/projects/:id/generate` -> returns `202 + jobId`
- `GET /api/projects/:id/generate?jobId=xxx`
- `POST /api/projects/:id/generate-images` -> returns `202 + jobId`
- `GET /api/projects/:id/generate-images?jobId=xxx`
- `POST /api/projects/:id/remove-bg` -> returns `202 + jobId`
- `GET /api/projects/:id/remove-bg?jobId=xxx`
- `POST /api/projects/:id/model-compose` -> returns `202 + jobId`
- `GET /api/projects/:id/model-compose?jobId=xxx`
- `POST /api/projects/:id/scene-compose` -> returns `202 + jobId`
- `GET /api/projects/:id/scene-compose?jobId=xxx`
- `POST /api/projects/:id/export` -> returns `202 + jobId`
- `GET /api/projects/:id/export?jobId=xxx`

## API Contract (Assets)
- `POST /api/projects/:id/assets`
- `GET /api/projects/:id/assets`
- `POST /api/projects/:id/bgm`
- `POST /api/projects/:id/cuts/handoff`

## API Contract (Block Editor)
- `GET /api/projects/:id/blocks`
- `PUT /api/projects/:id/blocks`

## API Contract (Remotion)
- `POST /api/projects/:id/remotion/preview`
- `POST /api/projects/:id/remotion/render` -> returns `202 + jobId`
- `GET /api/projects/:id/remotion/status`

## API Contract (Shortform Preview Artifacts)
- `POST /api/projects/:id/thumbnail` -> returns `202 + jobId`
- `GET /api/projects/:id/thumbnail?jobId=xxx`
- Request body: `{ templateKey?: string }`
- Provider path: Kie.ai image generation with representative image input
- Saved artifact type: `thumbnail`
- `POST /api/projects/:id/marketing-script` -> returns `202 + jobId`
- `GET /api/projects/:id/marketing-script?jobId=xxx`
- Request body: `{ templateKey?: string }`
- Provider path: Gemini text generation
- Saved artifact type: `marketing-script`

## Pipeline Executor Contract
- `executePipeline(projectId, nodes, edges, callbacks, context?)`
- `PipelineContext = { ratio?: string, uploadedAssetId?: string, category?: string }`

## Type Contract
- `ProjectStatus = draft | generating | generated | failed | exported`
- `ProjectMode = compose | shortform-video | model-shot | cutout | brand-image | gif-source | freeform`
- `PlanTier = solo_free`
- `GenerationResult = { sections: Array<{ headline: string; body: string; imageSlot: string; styleKey: string }> }`
- `MarketingScript = { hook: string; body: string; hashtags: string[] }`
- `Asset.sourceType = uploaded | generated | byoi_edited`
- `CutHandoffPayload = { projectId: string; selectedImageId: string; preserveOriginal: boolean }`
- `BlockType = hero | selling-point | image-full | image-grid | text-block | image-text | spec-table | comparison | review | divider | video | cta | usage-steps | faq | notice | banner-strip | price-promo | trust-badge`
- `ImageFilters = { brightness: number; contrast: number; saturate: number }`
- `ThemePalette = { primary: string; secondary: string; background: string; text: string; accent: string }`
- `BlockDocument = { format: "blocks"; blocks: Block[]; platform: { width: number; name: string }; theme?: ThemePalette; version: number }`
- `ExportMode = single | split | card-news`
- `ExportArtifactType = html | single | split | card-news | video | gif | thumbnail | marketing-script`
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

## Provider System
- `IMAGE_PROVIDER` env var: `"kie"` (default) | `"comfyui"`
- `DEPLOYMENT_MODE` env var: `"self-hosted"` | `"saas"`
- `ImageGenerationProvider` interface: `textToImage()`, `removeBackground()`, `healthCheck()`
- Provider registry: `getProvider()` from `src/services/providers/registry.ts`
- `GenerationJob.provider` values: `"kie-nano-banana-2"` | `"comfyui-flux"` | `"kie-remove-background"` | `"comfyui-remove-background"` | `"*-model-compose"` | `"*-scene-compose"`

## Future Additions (Post-Gate)
- `BillingSubscription`
- `InvoiceEvent`
