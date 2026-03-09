/** ComfyUI local provider — connects to ComfyUI REST API (localhost:8188) */

import { readFile } from "fs/promises";
import { join } from "path";
import type {
  ImageGenerationProvider,
  TextToImageRequest,
  TextToImageResult,
  RemoveBgRequest,
  RemoveBgResult,
} from "./types";

const POLL_INTERVAL = 2000;
const MAX_POLLS = 150; // 5 minutes

const ASPECT_RATIO_MAP: Record<string, { width: number; height: number }> = {
  "1:1": { width: 1024, height: 1024 },
  "9:16": { width: 768, height: 1344 },
  "16:9": { width: 1344, height: 768 },
  "4:5": { width: 896, height: 1120 },
  "3:4": { width: 896, height: 1152 },
  "4:3": { width: 1152, height: 896 },
};

function getComfyUrl(): string {
  return process.env.COMFYUI_URL ?? "http://localhost:8188";
}

function getComfyModel(): string {
  return process.env.COMFYUI_MODEL ?? "flux1-dev-fp8.safetensors";
}

async function loadWorkflow(name: string): Promise<Record<string, unknown>> {
  const workflowDir = join(
    process.cwd(),
    "src/services/providers/comfyui-workflows",
  );
  const raw = await readFile(join(workflowDir, `${name}.json`), "utf-8");
  return JSON.parse(raw);
}

function patchWorkflow(
  workflow: Record<string, unknown>,
  patches: Record<string, Record<string, unknown>>,
): Record<string, unknown> {
  const patched = JSON.parse(JSON.stringify(workflow));
  for (const [nodeId, inputs] of Object.entries(patches)) {
    const node = patched[nodeId] as
      | { inputs?: Record<string, unknown> }
      | undefined;
    if (node?.inputs) {
      Object.assign(node.inputs, inputs);
    }
  }
  return patched;
}

async function submitPrompt(
  baseUrl: string,
  workflow: Record<string, unknown>,
): Promise<string> {
  const res = await fetch(`${baseUrl}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: workflow }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`ComfyUI /prompt failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as { prompt_id?: string };
  if (!data.prompt_id) {
    throw new Error("ComfyUI: no prompt_id in response");
  }
  return data.prompt_id;
}

async function pollHistory(
  baseUrl: string,
  promptId: string,
): Promise<Record<string, unknown>> {
  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL));

    const res = await fetch(`${baseUrl}/history/${promptId}`);
    if (!res.ok) continue;

    const data = (await res.json()) as Record<
      string,
      { outputs?: Record<string, unknown>; status?: { completed?: boolean } }
    >;
    const entry = data[promptId];
    if (!entry) continue;

    if (entry.status?.completed && entry.outputs) {
      return entry.outputs;
    }
  }

  throw new Error("ComfyUI generation timed out");
}

function extractImageUrls(
  baseUrl: string,
  outputs: Record<string, unknown>,
): string[] {
  const urls: string[] = [];
  for (const nodeOutput of Object.values(outputs)) {
    const node = nodeOutput as {
      images?: Array<{
        filename: string;
        subfolder?: string;
        type?: string;
      }>;
    };
    if (node.images) {
      for (const img of node.images) {
        const subfolder = img.subfolder ? `&subfolder=${img.subfolder}` : "";
        const type = img.type ?? "output";
        urls.push(
          `${baseUrl}/view?filename=${encodeURIComponent(img.filename)}${subfolder}&type=${type}`,
        );
      }
    }
  }
  return urls;
}

export class ComfyUIProvider implements ImageGenerationProvider {
  name = "comfyui";

  async textToImage(req: TextToImageRequest): Promise<TextToImageResult> {
    const baseUrl = getComfyUrl();
    const dims = ASPECT_RATIO_MAP[req.aspectRatio ?? "1:1"] ?? {
      width: 1024,
      height: 1024,
    };

    let workflow: Record<string, unknown>;

    if (req.imageInput?.length) {
      workflow = await loadWorkflow("img2img-compose");
      workflow = patchWorkflow(workflow, {
        "6": { text: req.prompt },
        "11": { image: req.imageInput[0] },
        "5": { width: dims.width, height: dims.height },
        "4": { ckpt_name: getComfyModel() },
      });
    } else {
      workflow = await loadWorkflow("text-to-image");
      workflow = patchWorkflow(workflow, {
        "6": { text: req.prompt },
        "5": { width: dims.width, height: dims.height },
        "4": { ckpt_name: getComfyModel() },
      });
    }

    const promptId = await submitPrompt(baseUrl, workflow);
    const outputs = await pollHistory(baseUrl, promptId);
    const imageUrls = extractImageUrls(baseUrl, outputs);

    if (imageUrls.length === 0) {
      throw new Error("ComfyUI: no images in output");
    }

    return { imageUrls };
  }

  async removeBackground(req: RemoveBgRequest): Promise<RemoveBgResult> {
    const baseUrl = getComfyUrl();
    let workflow = await loadWorkflow("remove-background");
    workflow = patchWorkflow(workflow, {
      "1": { image: req.imageUrl },
    });

    const promptId = await submitPrompt(baseUrl, workflow);
    const outputs = await pollHistory(baseUrl, promptId);
    const imageUrls = extractImageUrls(baseUrl, outputs);

    if (imageUrls.length === 0) {
      throw new Error("ComfyUI: no images in remove-background output");
    }

    return { imageUrls };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const baseUrl = getComfyUrl();
      const res = await fetch(`${baseUrl}/system_stats`, {
        signal: AbortSignal.timeout(5000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
