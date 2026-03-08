# Shortform Roadmap

Last Updated: 2026-03-09 (KST)

## Validated MVP Baseline
- `shortform-video` now has a verified zero-cost completion path.
- Validation date: 2026-03-09.
- Validation method:
  - `Gemini` and `Kie` keys disabled
  - brief generated through `brief-parser` fallback
  - scene images manually uploaded and assigned
  - BGM uploaded through `/api/projects/:id/bgm`
  - preview, render, export, and result page checked end-to-end
- Verified outputs:
  - `9:16` MP4
  - `1:1` MP4
  - `16:9` MP4
  - exported project state with `shortform.renderPresets`

## Current MVP Contract
- Required operator path:
  - brief input
  - scene preparation
  - preview
  - render
  - export
- Optional editing path:
  - BGM upload and replacement
  - scene order changes
  - scene duration changes
  - reference image selection up to 3 assets
- Optional AI path:
  - Gemini section generation when available
  - Kie scene image generation when available

## Next Milestone
### 1. Advanced Timeline
- Goal:
  - replace list-based cuts editing with a real timeline editor
- Scope:
  - scene trim handles
  - transition duration controls
  - BGM in/out range
  - beat-snap alignment
  - summary timeline in simple mode, full editor in advanced panel
- Acceptance:
  - operator can reorder, trim, mute, and retime scenes from one timeline surface
  - preview updates from timeline state without manual JSON sync

### 2. Multi-Reference Tuning
- Goal:
  - make `1~3` reference images semantically useful instead of just passing raw ids
- Scope:
  - reference roles:
    - product reference
    - mood reference
    - composition/person reference
  - scene-level override support
  - Kie prompt builder role hints
- Acceptance:
  - each scene can inherit shared references or override them
  - AI image generation requests contain role-aware reference inputs

### 3. Thumbnail / Script Quality Optimization
- Goal:
  - improve artifact usefulness without changing preview-only generation placement
- Scope:
  - thumbnail:
    - hero cut selection
    - hook tone preset
    - copy length guardrails
    - 2~3 variation compare view
  - marketing script:
    - output presets for `릴스`, `쇼츠`, `상세페이지 삽입용`
    - stronger CTA and hashtag shaping
    - 2~3 variation compare view
- Acceptance:
  - user can compare multiple variants before saving one
  - artifact metadata records the selected preset and winning variant

## Implementation Order
1. Advanced timeline
2. Multi-reference tuning
3. Thumbnail/script quality optimization

## Non-Goals For This Milestone
- external paid video generation APIs
- replacing Remotion local render with SaaS render
- auto-beat detection beyond the current BGM metadata gate
