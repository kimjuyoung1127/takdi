# Takdi Architecture

Last Updated: 2026-03-09 (KST, Provider abstraction + ComfyUI local + Docker deployment)

## Core Principle
- UX is single-user simple.
- Data and authorization are workspace-scoped for future multi-tenant expansion.

## High-Level Components
- Frontend: Next.js 15 App Router + React 19
- API Layer: Next.js route handlers (17 endpoints, async fire-and-forget + polling)
- Data Layer: Prisma 6 + SQLite
- Runtime Storage: local/NAS-backed uploads directory configurable via `UPLOADS_DIR`
- Text Generation: Gemini 2.5 Flash (`@google/genai`, structured output) + brief-parser fallback
- Image Generation: Provider abstraction layer (`IMAGE_PROVIDER` env var)
  - Kie.ai (Nano Banana 2, API) — default for SaaS
  - ComfyUI (FLUX.1, local) — default for self-hosted
  - Provider interface: `src/services/providers/types.ts`
- Render Layer: Remotion 4 compositions + @remotion/player browser preview
- Async Pattern: POST → 202 + jobId, background processing, GET polling (generate, generate-images, render, export)
- Image Export: html2canvas-pro (client-side DOM→PNG/JPG capture, Tailwind v4 compatible)

## Domain Model Spine
- `User -> Membership -> Workspace`
- `Workspace -> Project -> Asset`
- `Project -> GenerationJob -> ExportArtifact`
- `Workspace -> UsageLedger`

## Lifecycle
1. Create project.
2. Attach brief/assets.
3. Start generation job.
4. Persist generated sections.
5. Save manual edits.
6. Export output artifact.
7. Record usage event.

## Deployment Target

### Primary: Mac Mini + NAS (current)
- **App**: Mac Mini running `next build` + `next start`
- **Access**: Tailscale first, external demo exposure through Cloudflare Tunnel or ngrok when needed
- **DB**: SQLite on Mac Mini local disk only
- **Media**: `UPLOADS_DIR` on local disk or NAS-backed uploads path
- **Process**: pm2 (`ecosystem.config.cjs`)
- **Proxy**: Caddy (`Caddyfile.example`)

### Secondary: Railway (post-validation)
- **App**: Railway app service for the public SaaS phase
- **DB**: PostgreSQL (Railway Postgres, Neon, or Supabase)
- **Storage**: object storage instead of local `uploads`
- **Render**: dedicated worker/job runtime instead of route-handler `spawn`

### DB 전략
- 로컬 개발: SQLite (`file:./dev.db`)
- Mac Mini 자체 운영: SQLite on local disk
- Railway 공개 전환: PostgreSQL
- Prisma 추상화로 provider + `DATABASE_URL` 전환 가능, but local file storage and render worker separation are still required for public SaaS

## Provider Abstraction
- `ImageGenerationProvider` interface: `textToImage()`, `removeBackground()`, `healthCheck()`
- `IMAGE_PROVIDER` env var selects active provider: `"kie"` | `"comfyui"`
- Provider registry: `src/services/providers/registry.ts`
- All image generation API routes use `getProvider()` — no direct service imports
- HTTP contracts unchanged: 202 + jobId polling pattern preserved
- `DEPLOYMENT_MODE` env var: `"self-hosted"` (Mac Mini) | `"saas"` (cloud)

## Docker Deployment (Self-Hosted)
- `docker-compose.yml`: app (Next.js:3000) + comfyui (Python:8188) + backup (cron) + watchtower
- Watchtower: auto-updates from GHCR on every `git push` to main
- GitHub Actions: `.github/workflows/docker-publish.yml` builds and pushes Docker image
- NAS integration: optional volume mounts for models and backups
- Client scripts: `scripts/start.command`, `scripts/stop.command` (Finder double-click)

## Guardrails
- Hard limit to one workspace in MVP runtime.
- All write/read operations require workspace scope.
- Billing entities deferred until post-validation.
