# Takdi Schema and API Index

Last Updated: 2026-03-06 (KST, COMPOSE-001 Block Editor)

## API Contract (Fixed for MVP)
- `POST /api/projects`
- `POST /api/projects/:id/generate` — Async: returns 202 + jobId
- `GET /api/projects/:id/generate?jobId=xxx` — Poll text generation job status
- `GET /api/projects/:id`
- `PATCH /api/projects/:id/content`
- `POST /api/projects/:id/export` — Async: returns 202 + jobId
- `GET /api/projects/:id/export?jobId=xxx` — Poll export job status
- `GET /api/usage/me`

## API Contract (Image Generation)
- `POST /api/projects/:id/generate-images` — Async: returns 202 + jobId
- `GET /api/projects/:id/generate-images?jobId=xxx` — Poll image generation job status

## API Contract (Assets + BYOI)
- `POST /api/projects/:id/assets` — Image upload (FormData)
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
- `BlockType = hero | selling-point | image-full | image-grid | text-block | image-text | spec-table | comparison | review | divider | video | cta`
- `BlockDocument = { format: "blocks"; blocks: Block[]; platform: { width: number; name: string }; version: number }`
- `Project.editorMode = flow | compose`

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
