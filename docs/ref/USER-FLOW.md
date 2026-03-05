# Takdi User Flow

Version: 1.1.0
Last Updated: 2026-03-05 (KST)

## End-to-End Flow
1. Input
  - Upload brief text (TXT or paste).
  - Upload product images.
  - Select template and BGM.
2. AI Analysis
  - Parse brief and extract USP, CTA, and section candidates.
  - Map image assets to section slots.
  - Build draft `GenerationResult.sections`.
3. Review and Edit
  - Inspect generated sections.
  - Edit text, reorder blocks, replace image slots.
  - Preview before export.
4. Export
  - Generate output artifact package.
  - Save export metadata and status.
5. Track Usage
  - Record generation/export usage events.
  - Check monthly usage via `/api/usage/me`.

## Input Contract
| Field | Required | Rule |
|---|---|---|
| Brief text | Yes | TXT upload or direct paste |
| Images | Yes | Multiple uploads, JPG/PNG/WebP |
| Template | Yes | One template key selected |
| BGM | Yes | Library select or MP3/WAV upload |
| Project name | No | Auto-generated if omitted |

## Status Transition
- `draft -> generating -> generated`
- `draft -> generating -> failed`
- `generated -> exported`

## Single-User Operation Rule
- UI exposes one-user flow only.
- Internal records remain workspace-scoped.
