# Competitive Analysis & Improvement Roadmap

Last Updated: 2026-03-06 (KST)

## Overview

Analysis of competitor/reference materials (4 Naver blog posts, 1 YouTube video, 1 cafe post, 4 screenshots) to derive features and patterns applicable to Takdi. URLs blocked by bot protection; analysis based on screenshots.

---

## Reference Analysis Summary

### Ref 1-2: Baby/Fashion Product Pages (livy0127, mtree712)
- Consistent color palette (beige/cream tones) for premium impression
- Size guide table + measurement images
- Color swatch (visual color option display)
- Lifestyle usage scene images
- Dedicated brand story section

### Ref 3: Beauty/Skincare Product Page (wesafy)
- Ingredient/efficacy visualization (bar charts, badges)
- Step-by-step usage guide
- Product lineup section (related products horizontal layout)
- Scientific data + clean blue/white tone

### Ref 4: PicCordial AI Tool Review (kkf101)
- **Direct competitor**: AI product image generation tool
- ~150 background templates (season/mood/category)
- Product photo upload -> template select -> AI background compositing
- Batch image generation + download
- ~250 KRW ($0.17) per image -- Takdi Kie.ai $0.04~0.09 is cheaper
- Weakness: **image compositing only** (no text/layout/export)

---

## Takdi's Existing Strengths (vs Competitors)

| Strength | Description | vs PicCordial |
|----------|-------------|---------------|
| End-to-end | Text -> AI gen -> block edit -> image export (full pipeline) | PicCordial: 1 image only |
| Node pipeline | React Flow visual workflow, mode-based auto composition | Unique to Takdi |
| 12 block editor | Drag-and-drop + real-time editing. Competitors use fixed templates | Editing flexibility |
| AI text+image | Gemini (copy) + Kie.ai (image) dual approach | PicCordial: manual copy |
| 6 specialized modes | compose/model-shot/cutout/brand-image/gif/freeform | Versatility |
| 40-75% cheaper | Kie.ai $0.04~0.09 vs PicCordial ~250 KRW ($0.17) | Clear price advantage |

**Strategic positioning**: "Not just one image" but "entire product detail page" automation. Adding C1 (AI background compositing) covers image quality gap and captures both sides' strengths.

---

## Feature Discovery: Tiers

### Tier 1 -- Immediate Value (Low Effort + High Impact)

| ID | Feature | Effort | Impact | Rationale |
|----|---------|--------|--------|-----------|
| **C1** | **AI background/scene compositing** (product+bg prompt) | Low | Very High | Kie.ai `image_input` infra exists. Replicate `model-compose` pattern. Internalize PicCordial core feature. |
| **F1** | **Category-aware prompts** (fashion/beauty/food/baby etc.) | Low | High | Add branching to `gemini-generator.ts` `buildPrompt`. Major quality improvement. |
| **E1** | **Additional platform presets** (11st/Gmarket/SSG/own mall) | Low | Medium | Add values to `platform-presets.ts`. Market coverage expansion. |
| **F2** | **Copywriting tone selection** (premium/friendly/scientific/emotional) | Low | Medium | 1-line prompt addition. UI dropdown. |

### Tier 2 -- Medium-term (Medium Effort + High Impact)

| ID | Feature | Effort | Impact | Trade-off |
|----|---------|--------|--------|-----------|
| **A1** | **Global color palette** | Medium | High | Add `BlockDocument.theme` + renderer reference. Override conflict management needed. |
| **C2** | **Background template library** | Medium | High | Synergy with C1. Prompt curation cost. Start with JSON static file. |
| **B3** | **Usage steps block** (new block type) | Low | High | Similar structure to `selling-point`. Number+image+description combo. Useful across all categories. |
| **D2** | **Category-specific layout presets** | Medium | High | Synergy with F1. Extend `section-to-blocks.ts` mapping. Preset quality = user impression. |

### Tier 3 -- Later (Category-specific Blocks)

| ID | Feature | Effort | Impact | Trade-off |
|----|---------|--------|--------|-----------|
| **B1** | Size guide block | Medium | High (fashion only) | Possible overlap with spec-table. Measurement images are the differentiator. |
| **B2** | Material/ingredient block | Medium | High (beauty/food only) | CSS bar chart needed for html2canvas compatibility. |
| **C3** | Batch image generation | Medium | High | API cost Nx increase. Rate limit. Cost prediction display needed. |
| **E2** | HTML code export | Medium | Medium | Tailwind -> inline style conversion complex. Image hosting URL issue. |

### Dropped (Low ROI)

| ID | Feature | Reason |
|----|---------|--------|
| A2 | Color swatch block | Fashion-only, low usage frequency |
| B4 | Care instructions block | Replaceable by selling-point |
| B5 | Product lineup block | Scroll handling issue in image export |
| B6 | Data visualization block | B2 covers 80%. Chart rendering complex. |
| C5-C6 | Detail/multi-angle shots | AI generation limitations. Depends on user uploads. |

---

## Customer Flow Validation (Studio Shooting -> Product Page)

**Customer profile**: Has own studio, creates product pages from self-shot images. Cutout/compositing/editing workflow.

### Customer Flow vs Current Coverage

| Step | Status | Assessment |
|------|--------|------------|
| 1. Upload own photos | Done | uploadAsset API + ImageUploadZone |
| 2. Text overlay | Done | TextOverlay drag editing (hero, image-full) |
| 3. Cutout (bg removal) | Done | Kie.ai recraft/remove-background |
| 4. Quality adjust/upscale | **Gap** | Resolution selection only. No brightness/contrast/saturation/upscale. |
| 5. Compositing (bg replace) | Partial | Model compositing works. No bg selection UI (prompt only). |
| 6. Product page editing | Done | 13 block types + dnd-kit + inline editing |
| 7. Export | Done | html2canvas-pro (image), Remotion (video) |

### Critical Gaps Identified

#### GAP-1: Asset Isolation Between Modes (cutout <-> compose disconnected)
- **Problem**: Cutout mode results cannot be directly used in compose mode (block editor)
- **Customer Impact**: Very High -- "cutout -> straight to product page" is the core workflow
- **Solution Direction**: Share project Assets across all modes. Show project asset list in compose block image picker.
- **Effort**: Medium -- Asset DB already linked by projectId. Need asset browser UI addition.

#### GAP-2: No Image Quality Adjustment/Upscale
- **Problem**: Even studio-shot images need brightness/contrast/saturation adjustment and upscale
- **Customer Impact**: High -- Without this, Photoshop/Lightroom needed separately
- **Solution Direction**:
  - (a) Check Kie.ai upscale model (if available, same pattern as remove-bg)
  - (b) CSS filter-based simple adjustment (brightness, contrast, saturate) -> apply to block renderer
  - (c) External API (Real-ESRGAN etc.) integration
- **Effort**: (a) Low if available, (b) Low, (c) Medium

---

## Revised Priority (Customer Flow Based)

| Priority | ID | Feature | Effort | Customer Impact |
|----------|----|---------|--------|-----------------|
| **1** | **GAP-1** | **Cross-mode asset sharing (cutout->compose link)** | Medium | Very High |
| **2** | **GAP-2** | **Image adjustment/upscale** | Low~Medium | High |
| **3** | **C1** | AI background/scene compositing (cutout+bg) | Low | Very High |
| **4** | **C2** | Background template library | Medium | High |
| **5** | **F1** | Category-aware prompts | Low | High |
| **6** | **E1** | Additional platform presets | Low | Medium |
| **7** | **A1** | Global color palette | Medium | High |
| **8** | **B3** | Usage steps block | Low | High |

---

## B2B Scaling Perspective

Items 1-4 are also critical for B2B expansion:
- **GAP-1 (Asset sharing)**: Workspace asset library -> team shared assets
- **GAP-2 (Image adjustment)**: Essential for small sellers without professional photographers
- **C1+C2 (BG compositing+templates)**: Core features for PicCordial replacement positioning

---

## Note

This is an **analysis document, not an implementation plan**. After deciding which features to implement, create separate detailed implementation plans for each.
