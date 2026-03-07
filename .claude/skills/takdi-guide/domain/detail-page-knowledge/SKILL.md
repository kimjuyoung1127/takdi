---
name: detail-page-knowledge
description: Korean e-commerce detail page domain knowledge for Takdi product design.
---

## Trigger
- Use when designing UI screens, writing UI copy, or making product decisions for Takdi.
- Use when building the block editor, result page, or preview/export features.

## Read First
1. This file (domain knowledge)
2. `docs/ref/PRD.md` -- product goal
3. `docs/ref/WIREFRAME-NODE-BYOI.md` -- wireframe spec
4. `docs/ref/USER-FLOW.md` -- user flow

---

## What is 상세페이지?

e-commerce product detail page. The **long-scroll content area** below the product title/price on Korean marketplaces (Coupang, Naver SmartStore, 11번가, Gmarket, etc.).

- A **vertical stack of images** (sometimes with embedded video) that the buyer scrolls through.
- Each image: **780~860px wide**, up to **3,000~5,000px tall** per segment.
- 80%+ of Korean e-commerce traffic is mobile. Buyers decide within the first 2 scrolls.

---

## Standard 9-Section Structure

| # | Section | Korean Name | Purpose |
|---|---------|-------------|---------|
| 1 | Hero Banner | 대표 이미지 | First impression, hook |
| 2 | Brand Intro | 브랜드 소개 | Trust building |
| 3 | Key Selling Points | 핵심 셀링포인트 | Why buy THIS product |
| 4 | Detail Shots | 상세 컷 | Show product up close |
| 5 | Usage / How-to | 사용법 | Remove uncertainty |
| 6 | Spec Table | 상세 스펙 | Technical details |
| 7 | Comparison | 비교 | Competitive advantage |
| 8 | Reviews / Social Proof | 후기/인증 | Build trust |
| 9 | CTA / Purchase Guide | 구매 안내 | Close the sale |

**Key rule**: One message per section.

---

## Block Types → `src/types/blocks.ts`

13종: `hero`, `selling-point`, `image-full`, `image-grid`, `text-block`, `image-text`, `spec-table`, `comparison`, `review`, `divider`, `video`, `cta`, `usage-steps`

Full type definitions and editable properties: see `docs/ref/SCHEMA-INDEX.md` (Type Contract section).

---

## Platform Rules

| Platform | Width | Max Height/Image | GIF | Video |
|----------|-------|-------------------|-----|-------|
| Coupang | 780px | 5,000px | No | Limited |
| Naver SmartStore | 860px | No hard limit | Yes | Yes |
| 11번가 | 860px | 3,000px | Yes | No |
| Gmarket | 860px | No hard limit | Yes | No |

---

## UI Copy Guidelines (Korean)

- **Tone**: 존댓말 (polite form), concise (max 2 lines), action-oriented
- **Key vocabulary**: 상세페이지, 블록, 셀링포인트, 대표 이미지, 내보내기, 원샷 제작, 미리보기, 순서 변경

Full mode descriptions and UI copy examples: see `docs/ref/PRD.md`.

---

## Output Specifications

- **Image**: JPG/PNG, 860px wide (780px for Coupang), max 3,000px/segment, sRGB
- **Video**: MP4 H.264, 9:16/1:1/16:9, 15~60s, 1080px min
- **원샷 export**: 세로 스크롤 프리뷰 + 개별/전체 이미지 다운로드 + 영상 다운로드

---

## Validation
- UI copy follows Korean tone guidelines.
- Block types cover standard sections.
- Output specs match platform requirements.
