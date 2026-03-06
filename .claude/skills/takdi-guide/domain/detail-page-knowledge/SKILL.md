---
name: detail-page-knowledge
description: Korean e-commerce detail page (상세페이지) domain knowledge for Takdi product design.
---

## Trigger
- Use when designing UI screens, writing UI copy, or making product decisions for Takdi.
- Use when building the block editor, result page, or preview/export features.
- Use when writing mode descriptions, onboarding text, or help content.

## Read First
1. This file (domain knowledge)
2. `docs/ref/PRD.md` — product goal
3. `docs/ref/WIREFRAME-NODE-BYOI.md` — wireframe spec
4. `docs/ref/USER-FLOW.md` — user flow

---

## What is 상세페이지?

상세페이지 = e-commerce product detail page. It is the **long-scroll content area** below the product title/price on Korean marketplaces (Coupang, Naver SmartStore, 11번가, Gmarket, etc.).

### Physical Format
- A **vertical stack of images** (sometimes with embedded video) that the buyer scrolls through.
- Each image is typically **780~860px wide**, up to **3,000~5,000px tall** per segment.
- Multiple image segments are uploaded and displayed end-to-end, creating one continuous scroll experience.
- The final output looks like a single, very tall "page" made of stitched image/video blocks.
- **GIF is NOT allowed** on Coupang (JPG/PNG only). Other platforms may allow GIF/MP4.

### Why It Matters
- 80%+ of Korean e-commerce traffic is mobile.
- Buyers decide to purchase (or leave) within the first 2 scrolls.
- Sellers produce these pages **daily** for new products — speed is critical.
- Professional pages cost 50,000~500,000 KRW per page on freelance platforms.

---

## Standard 9-Section Structure

The industry-standard layout follows this order (each section = ~1,000~1,200px tall):

| # | Section | Korean Name | Purpose | Content |
|---|---------|-------------|---------|---------|
| 1 | Hero Banner | 대표 이미지 | First impression, hook | Large product photo + one-line value prop |
| 2 | Brand Intro | 브랜드 소개 | Trust building | Logo, brand story, certification badges |
| 3 | Key Selling Points | 핵심 셀링포인트 | Why buy THIS product | 3 benefits max, icon + short text per benefit |
| 4 | Detail Shots | 상세 컷 | Show the product up close | Multiple angles, zoom-ins, texture shots |
| 5 | Usage / How-to | 사용법 | Remove uncertainty | Step-by-step usage, lifestyle shots |
| 6 | Spec Table | 상세 스펙 | Technical details | Size, weight, material, ingredients as table |
| 7 | Comparison | 비교 | Competitive advantage | Before/after or vs. competitor table |
| 8 | Reviews / Social Proof | 후기/인증 | Build trust | Customer photos, star ratings, testimonials |
| 9 | CTA / Purchase Guide | 구매 안내 | Close the sale | Shipping info, return policy, bundle deals |

**Key rule**: One message per section. Don't cram multiple ideas into one block.

---

## Takdi's Value Proposition

Takdi automates this entire process:

```
Input:  상품 설명 텍스트 + 상품 이미지들
  ↓
AI:    텍스트 분석 → 셀링포인트 추출 → 이미지 생성/배치
  ↓
Editor: 블록 카드 조합 → 순서 드래그 → 텍스트 편집 → 프리뷰
  ↓
Output: 세로 스크롤 이미지/영상 → 원샷 내보내기
```

### What "원샷 제작" Means
The seller inputs brief text + images and gets a **complete, ready-to-upload detail page** without:
- Opening Photoshop/Figma
- Hiring a designer
- Spending hours on layout

---

## Block Types (for Takdi Editor)

Each block = one visual section of the final output.

| Block Type | Description | Editable Properties |
|------------|-------------|---------------------|
| `hero` | Full-width hero banner image + overlay text | image, headline, subtext, text color |
| `selling-point` | Icon + title + description (1~3 points per block) | icon, title, description per point |
| `image-full` | Full-width product image (no text) | image, alt text |
| `image-grid` | 2~4 images in a grid layout | images[], columns (2 or 4) |
| `text-block` | Rich text paragraph | text content, alignment, font size |
| `image-text` | Image on one side, text on the other | image, text, layout (left/right) |
| `spec-table` | Key-value specification table | rows[{key, value}] |
| `comparison` | Before/after or side-by-side comparison | imageA, imageB, labelA, labelB |
| `review` | Customer review card | avatar, name, rating, text, photo |
| `divider` | Visual separator between sections | style (line/space/gradient) |
| `video` | Embedded video clip | videoUrl, autoplay, loop |
| `cta` | Call-to-action banner | text, buttonLabel, buttonUrl, bgColor |

### Block Editor UX Requirements
1. **Drag-to-reorder**: Blocks can be dragged up/down to change order (use `dnd-kit`).
2. **Text overlay on images**: Hero and image blocks support text layers positioned over the image.
3. **Live preview**: Right panel shows the final scrollable output as the user edits.
4. **Add/Remove blocks**: "+" button between blocks to insert, "x" to delete.
5. **Block templates**: Pre-filled block combinations for quick start (e.g., "기본 9단 구성").

---

## Mode-Specific Guidance

Each Takdi mode generates different default block arrangements:

| Mode | Korean | Target Products | Default Blocks | Key Feature |
|------|--------|-----------------|----------------|-------------|
| `model-shot` | 모델 촬영 | Clothing, shoes, accessories | hero → detail-shots → spec → cta | AI model wearing the product |
| `cutout` | 컷아웃 | All products (general) | hero → selling-points → image-grid → spec → cta | Background removal, clean product shots |
| `brand-image` | 브랜드 이미지 | Cosmetics, premium goods | brand-intro → hero → selling-points → comparison → cta | Brand-first storytelling |
| `gif-source` | GIF 소스 | Food, gadgets, demo products | hero(video) → detail-shots → usage → spec → cta | Motion content for attention |
| `freeform` | 자유 형식 | Any | Empty canvas, user builds from scratch | Maximum flexibility |

### Mode Card Copy (for Home Page)
Each mode card should communicate:
1. **What it produces** (output type)
2. **Who it's for** (product category)
3. **Why choose this mode** (key differentiator)

Example improved copy:
- **모델 촬영**: "의류/패션 상세페이지 — AI 모델이 착용한 상품 이미지를 자동 생성"
- **컷아웃**: "범용 상세페이지 — 배경 제거 후 깔끔한 상품 이미지로 구성"
- **브랜드 이미지**: "브랜드 스토리텔링 — 프리미엄 감성의 브랜드 중심 레이아웃"
- **GIF 소스**: "움직이는 상세페이지 — 영상/GIF로 상품 사용감을 전달"
- **자유 형식**: "직접 구성 — 블록을 자유롭게 조합해서 나만의 레이아웃"

---

## Output Specifications

### Image Output (for marketplace upload)
- Format: JPG (Coupang) or PNG
- Width: 860px (standard), 780px (Coupang minimum)
- Max height per segment: 3,000px (split if longer)
- Max file size: 10~20MB per image
- Color space: sRGB

### Video Output (for social/ad use)
- Ratios: 9:16 (Reels/Shorts), 1:1 (feed), 16:9 (YouTube)
- Format: MP4 (H.264)
- Duration: 15~60 seconds typical
- Resolution: 1080px on short side minimum

### Combined Output (Takdi "원샷")
The result page should offer:
1. **세로 스크롤 프리뷰** — The full detail page as a scrollable preview
2. **개별 이미지 다운로드** — Each block/section as a separate image file
3. **전체 이어붙이기 다운로드** — All blocks stitched as one long image
4. **영상 다운로드** — Animated version (Remotion render)
5. **플랫폼별 최적화** — Coupang/Naver/etc. preset exports

---

## Platform-Specific Rules

| Platform | Width | Max Height/Image | Max File Size | GIF | Video |
|----------|-------|-------------------|---------------|-----|-------|
| Coupang | 780px | 5,000px | 20MB | No | Limited |
| Naver SmartStore | 860px | No hard limit | 10MB | Yes | Yes (embedded) |
| 11번가 | 860px | 3,000px | 10MB | Yes | No |
| Gmarket | 860px | No hard limit | 10MB | Yes | No |

---

## UI Copy Guidelines (Korean)

### Tone
- 존댓말 (polite form) for all user-facing text
- Concise — max 2 lines per description
- Action-oriented — tell the user what they can DO

### Key Vocabulary
| English | Korean | Context |
|---------|--------|---------|
| Detail page | 상세페이지 | The product |
| Block | 블록 | Editor unit |
| Section | 섹션 | Output unit |
| Selling point | 셀링포인트 | Key benefit |
| Hero image | 대표 이미지 | First section |
| Export | 내보내기 | Final output |
| One-shot | 원샷 제작 | Value prop |
| Preview | 미리보기 | Before export |
| Reorder | 순서 변경 | Drag blocks |
| Text overlay | 텍스트 오버레이 | Text on image |
| Template | 템플릿 | Preset layout |

### Home Page Tagline Options
- "AI 상세페이지, 원샷으로 완성하세요"
- "상품 설명만 입력하면, 상세페이지가 자동으로 만들어집니다"
- "쿠팡/스마트스토어 상세페이지를 1분 만에"

---

## Technical Implementation Notes

### Block Editor (Recommended Stack)
- **Drag & drop**: `@dnd-kit/core` + `@dnd-kit/sortable` (React 19 compatible, 10KB, 60fps)
- **Text overlay**: HTML `<canvas>` or absolute-positioned `<div>` over image
- **Image rendering**: Server-side with Sharp or Puppeteer for final export
- **State shape**: `Block[]` where each block has `id`, `type`, `props`, `order`

### Block State Schema
```typescript
interface Block {
  id: string;
  type: BlockType; // 'hero' | 'selling-point' | 'image-full' | ...
  order: number;
  props: Record<string, unknown>; // type-specific properties
}

interface DetailPage {
  blocks: Block[];
  metadata: {
    targetPlatform: 'coupang' | 'naver' | '11st' | 'gmarket';
    width: number; // 780 or 860
  };
}
```

## Validation
- All UI copy follows Korean tone guidelines above.
- Mode descriptions explain output type + target product + differentiator.
- Block types cover all 9 standard sections.
- Output specs match platform requirements.
