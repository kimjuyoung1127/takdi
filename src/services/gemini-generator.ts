import { GoogleGenAI } from "@google/genai";
import type { GenerationResult } from "@/types";

const MODEL = "gemini-2.5-flash";

const GENERATION_RESULT_SCHEMA = {
  type: "OBJECT" as const,
  properties: {
    sections: {
      type: "ARRAY" as const,
      items: {
        type: "OBJECT" as const,
        properties: {
          headline: { type: "STRING" as const },
          body: { type: "STRING" as const },
          imageSlot: { type: "STRING" as const },
          styleKey: { type: "STRING" as const },
        },
        required: ["headline", "body", "imageSlot", "styleKey"],
      },
    },
  },
  required: ["sections"],
};

export interface GeminiGenerateOptions {
  apiKey?: string;
  mode?: string;
  maxSections?: number;
}

/**
 * Generate structured sections from brief text using Gemini API.
 * Accepts optional client-provided API key (falls back to server env).
 */
export async function generateWithGemini(
  briefText: string,
  options?: GeminiGenerateOptions
): Promise<GenerationResult> {
  const apiKey = options?.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(briefText, options?.mode, options?.maxSections);

  const response = await callWithRetry(async () => {
    return ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: GENERATION_RESULT_SCHEMA,
      },
    });
  });

  const text = response.text;
  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  const parsed: GenerationResult = JSON.parse(text);

  // Validate sections exist
  if (!parsed.sections || !Array.isArray(parsed.sections)) {
    throw new Error("Invalid response structure: missing sections array");
  }

  return parsed;
}

/** Build prompt from brief text and mode. Generic placeholder — refine per mode after UI is finalized. */
function buildPrompt(
  briefText: string,
  mode?: string,
  maxSections?: number
): string {
  const sectionCount = maxSections ?? 5;
  const modeLabel = mode ?? "freeform";

  return [
    "You are an e-commerce product detail page content specialist.",
    "Analyze the provided product brief and structure it into detail page sections.",
    "",
    "Requirements:",
    `- Generate up to ${sectionCount} sections.`,
    "- Each section must have: headline (concise, attention-grabbing), body (persuasive copy, 50-150 chars), imageSlot (slot-1, slot-2, ...), styleKey (\"default\").",
    "- Write in the same language as the brief text.",
    `- Content mode: ${modeLabel}`,
    "",
    "Product brief:",
    briefText,
  ].join("\n");
}

/** Retry once on rate limit (429). */
async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 1
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const status = (err as { status?: number }).status;
      if (status === 429 && attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Unreachable");
}
