# Takdi User Flow

Version: 1.3.0
Last Updated: 2026-03-05 (KST)

Related spec:
- `docs/ref/WIREFRAME-NODE-BYOI.md`

## End-to-End Flow
1. Create project and select mode.
2. Run generation path (`Gemini -> Imagen fallback`) or BYOI path.
3. Confirm selected image and handoff to cut edit.
4. Analyze BGM and preview composition.
5. Render with Remotion and export artifacts.
6. Record usage and estimated cost.

## Flow Diagram
```mermaid
flowchart TD
  A["Project Create"] --> B["Mode Select"]
  A --> M0["BGM Select or Upload"]

  B --> B1["Model Generate"]
  B --> B2["Cutout Generate"]
  B --> B3["Brand Image Generate"]
  B --> B4["GIF Generate"]
  B --> B5["Freeform Generate"]
  B --> B6["BYOI Upload"]

  B1 --> C["Gemini Generate"]
  B2 --> C
  B3 --> C
  B5 --> C
  C --> CQ{"Quality Check"}
  CQ -->|"pass"| D["Image Results"]
  CQ -->|"fail"| C2["Imagen Fallback"]
  C2 --> D

  B4 --> G0["GIF Source Pick"] --> G1["GIF Build"] --> D
  B6 --> V0["BYOI Validate"] --> D

  D --> E["Intermediate Confirm"]
  E -->|"regenerate"| B
  E -->|"confirm"| F["Cut Edit Handoff"]

  F --> F1["Auto Mask or Crop Draft"] --> F2["Manual Adjustment"] --> F3["Cut Edit Save"]

  M0 --> M1["BGM Analyze"] --> M2{"Valid?"}
  M2 -->|"no"| M0
  M2 -->|"yes"| R0["Template Ratio Select"]

  F3 --> R0
  R0 --> R1["Remotion Preview"]
  R1 --> R2{"Render?"}
  R2 -->|"no"| F2
  R2 -->|"yes"| R3["Render with Audio Mix"]

  R3 --> R4{"Render Result"}
  R4 -->|"ok"| X["ExportArtifact Save"]
  R4 -->|"retry"| R3
  X --> U["UsageLedger Record"] --> Z["Done"]
```

## Input Contract
| Field | Required | Rule |
|---|---|---|
| Brief text | Yes | TXT upload or direct paste |
| Images | Conditional | Required for non-BYOI modes |
| Mode | Yes | `model-shot`, `cutout`, `brand-image`, `gif-source`, `freeform`, `byoi` |
| BGM | Yes | Library select or MP3/WAV upload |
| Template ratio | Yes | `9:16`, `1:1`, `16:9` |
| Project name | No | Auto-generated if omitted |

## Status Transition
- Project: `draft -> generating -> generated -> exported`
- Project fail path: `draft -> generating -> failed`
- Image job: `queued -> running -> done | failed`

## Contract Keys
- `Asset.sourceType = uploaded | generated | byoi_edited`
- `CutHandoffPayload.preserveOriginal: boolean`

## Single-User Operation Rule
- UI exposes one-user flow only.
- Internal records remain workspace-scoped.
