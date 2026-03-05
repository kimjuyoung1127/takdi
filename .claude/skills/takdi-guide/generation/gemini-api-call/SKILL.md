---
name: gemini-api-call
description: Pattern for calling Google Gemini API with structured output in Takdi.
---

## Trigger
- Use when adding or modifying Gemini API calls.
- Use when integrating new AI features (text generation, image generation).

## Read First
1. `src/services/gemini-generator.ts` — canonical implementation
2. `src/types/index.ts` — GenerationResult contract
3. `docs/ref/SCHEMA-INDEX.md` — API/type contracts

## SDK
- Package: `@google/genai` (NOT `@google/generative-ai` which is deprecated)
- Model: `gemini-2.5-flash` for text, `imagen-4.0-generate-001` for images

## Pattern

### Client Initialization
```typescript
import { GoogleGenAI } from "@google/genai";
// Accept client-provided key, fallback to server env
const ai = new GoogleGenAI({ apiKey: options.apiKey ?? process.env.GEMINI_API_KEY });
```

### Structured Output
```typescript
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: prompt,
  config: {
    responseMimeType: "application/json",
    responseSchema: {
      type: "OBJECT",
      properties: { /* schema */ },
      required: ["field1"],
    },
  },
});
const parsed = JSON.parse(response.text);
```

### Error Handling
- API key missing → throw early
- 429 rate limit → retry once with 2s delay
- Other errors → throw with message (caller handles fallback)

### Key Rules
- Always accept `apiKey` as parameter (client keys will replace server key)
- Always use `responseSchema` for structured output (not free-form JSON)
- Always validate parsed response before returning
- Keep `buildPrompt()` as separate function for future mode-specific customization

## Validation
- `GenerationResult` shape matches `src/types/index.ts`
- Fallback to `brief-parser` when Gemini fails
- Job status transitions: queued → running → done/failed
