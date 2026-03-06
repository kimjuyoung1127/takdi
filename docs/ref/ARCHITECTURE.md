# Takdi Architecture

Last Updated: 2026-03-06 (KST, EXPORT-001 Block Image Export)

## Core Principle
- UX is single-user simple.
- Data and authorization are workspace-scoped for future multi-tenant expansion.

## High-Level Components
- Frontend: Next.js 15 App Router + React 19
- API Layer: Next.js route handlers (17 endpoints, async fire-and-forget + polling)
- Data Layer: Prisma 6 + SQLite
- Text Generation: Gemini 2.5 Flash (`@google/genai`, structured output) + brief-parser fallback
- Image Generation: Imagen 4.0 (`@google/genai`, async job + polling)
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

### Primary: Vercel (예정)
- **App**: Vercel Serverless (Next.js 네이티브 지원)
- **DB**: Supabase PostgreSQL 또는 Vercel Postgres (Neon)
  - Vercel은 서버리스라 SQLite 쓰기 불가 → PostgreSQL 필수
  - 전환: `schema.prisma` provider + `DATABASE_URL`만 변경 (코드 변경 없음)
- **에셋 저장**: Vercel Blob 또는 Supabase Storage
- **환경변수**: Vercel Dashboard에서 `DATABASE_URL`, `GEMINI_API_KEY` 설정

### Secondary: Mac Mini + NAS (자체 운영)
- **Runtime**: Mac Mini (앱 서버 + Next.js)
- **Storage**: NAS (에셋 파일 + DB 백업)
- **DB**: SQLite 유지 가능 (`file:/mnt/nas/takdi/prod.db`) — 1인 운영 시 충분

### DB 전략
- 로컬 개발: SQLite (`file:./dev.db`)
- Vercel 배포: PostgreSQL (Supabase/Neon 무료 티어)
- Mac Mini 자체 운영: SQLite 또는 PostgreSQL 선택
- Prisma 추상화로 코드 변경 없이 provider + DATABASE_URL만 교체

## Guardrails
- Hard limit to one workspace in MVP runtime.
- All write/read operations require workspace scope.
- Billing entities deferred until post-validation.
