# Takdi Schema and API Index

Last Updated: 2026-03-05 (KST)

## API Contract (Fixed for MVP)
- `POST /api/projects`
- `POST /api/projects/:id/generate`
- `GET /api/projects/:id`
- `PATCH /api/projects/:id/content`
- `POST /api/projects/:id/export`
- `GET /api/usage/me`

## Type Contract
- `ProjectStatus = draft | generating | generated | failed | exported`
- `PlanTier = solo_free` (future: `starter | pro | agency`)
- `GenerationResult = { sections: Array<{ headline: string; body: string; imageSlot: string; styleKey: string }> }`

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
