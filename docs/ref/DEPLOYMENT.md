# Takdi Deployment Guide

Last Updated: 2026-03-09 (KST, Mac Mini runtime-path deployment bootstrap)

## Recommended Stages

### Stage 1: Primary runtime (current)
- Runtime: Mac Mini running `next build` + `next start`
- Access: Tailscale first, Cloudflare Tunnel or ngrok only when external demo access is needed
- DB: SQLite on the Mac Mini local disk
- Media: uploads and render artifacts on local disk or a NAS-mounted uploads path
- Process manager: `pm2` via `ecosystem.config.cjs`
- Reverse proxy: Caddy using `Caddyfile.example`

### Stage 2: External pilot before SaaS
- Keep the app on the Mac Mini
- Expose only the web entrypoint through Tailscale Funnel, Cloudflare Tunnel, or ngrok
- Limit concurrent usage and monitor Remotion render load

### Stage 3: Public SaaS after validation
- Web: Railway app service
- DB: PostgreSQL (Railway Postgres, Neon, or Supabase)
- Storage: object storage instead of local `uploads`
- Render: dedicated worker/job runtime, not route-handler `spawn`

## Runtime Environment

Required:
- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `UPLOADS_DIR`

Optional:
- `UPLOADS_BACKUP_DIR`
- `GEMINI_API_KEY`
- `KIE_API_KEY`
- `OLLAMA_BASE_URL`

Recommended production example:

```env
DATABASE_URL="file:/Users/your-user/Library/Application Support/takdi/prod.db"
NEXT_PUBLIC_APP_URL="https://takdi.example.com"
UPLOADS_DIR="/Users/your-user/takdi-runtime/uploads"
UPLOADS_BACKUP_DIR="/Volumes/NAS/takdi-backups"
```

## Important Rules
- Do not place the SQLite database on a NAS network share.
- Keep SQLite on the Mac Mini local disk.
- Use NAS for uploads, render artifact backup, or mirrored storage only.
- Verify `NEXT_PUBLIC_APP_URL` matches the externally reachable domain before Remotion render runs.

## Ops Files Included In Repo
- `ecosystem.config.cjs`: pm2 app definition
- `Caddyfile.example`: reverse proxy example
- `npm run runtime:paths`: prints resolved runtime paths
- `npm run backup:uploads`: creates a timestamped uploads snapshot under `UPLOADS_BACKUP_DIR`

## Mac Mini Bootstrap
1. Install Node.js LTS and system dependencies required by Next.js, Sharp, and Remotion.
2. Copy `.env.example` to `.env` and set production values.
3. Run `npm install`.
4. Run `npm run build`.
5. Run `npm run runtime:paths` and confirm the resolved DB/app/uploads values.
6. Start the app with `pm2 start ecosystem.config.cjs`.
7. Put Caddy in front of `127.0.0.1:3000`.
8. Schedule `npm run backup:uploads` if NAS snapshots are required.

## Railway Migration Triggers
Move to Railway only after these are complete:
- Prisma provider switched from SQLite to PostgreSQL
- local file persistence replaced with object storage contracts
- Remotion rendering moved out of route handlers into a worker/job flow
