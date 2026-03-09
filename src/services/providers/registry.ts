/** Provider registry — factory for ImageGenerationProvider by IMAGE_PROVIDER env */

import type { ImageGenerationProvider } from "./types";
import { KieProvider } from "./kie-provider";
import { ComfyUIProvider } from "./comfyui-provider";

export type ProviderKey = "kie" | "comfyui";

const providers: Record<ProviderKey, () => ImageGenerationProvider> = {
  kie: () => new KieProvider(),
  comfyui: () => new ComfyUIProvider(),
};

let cached: ImageGenerationProvider | null = null;
let cachedKey: string | null = null;

/**
 * Get the active image generation provider.
 * Reads IMAGE_PROVIDER env var; defaults to "kie" for backward compatibility.
 */
export function getProvider(): ImageGenerationProvider {
  const key = (process.env.IMAGE_PROVIDER ?? "kie") as ProviderKey;
  if (cached && cachedKey === key) return cached;

  const factory = providers[key];
  if (!factory) {
    throw new Error(
      `Unknown IMAGE_PROVIDER "${key}". Valid: ${Object.keys(providers).join(", ")}`,
    );
  }

  cached = factory();
  cachedKey = key;
  return cached;
}

/**
 * Get a specific provider by name (for explicit override).
 */
export function getProviderByName(name: ProviderKey): ImageGenerationProvider {
  const factory = providers[name];
  if (!factory) {
    throw new Error(
      `Unknown provider "${name}". Valid: ${Object.keys(providers).join(", ")}`,
    );
  }
  return factory();
}

/**
 * Provider name for GenerationJob.provider field.
 */
export function getProviderLabel(): string {
  const key = (process.env.IMAGE_PROVIDER ?? "kie") as ProviderKey;
  const labels: Record<ProviderKey, string> = {
    kie: "kie-nano-banana-2",
    comfyui: "comfyui-flux",
  };
  return labels[key] ?? key;
}
