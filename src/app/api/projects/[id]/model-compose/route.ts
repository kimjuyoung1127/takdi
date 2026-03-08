/** POST /api/projects/:id/model-compose — 모델 합성 (Nano Banana 2 + 참조 이미지) */

import { prisma } from "@/lib/prisma";
import { getWorkspaceId, ensureWorkspaceScope } from "@/lib/workspace-guard";
import { jsonOk, jsonError, jsonNotFound } from "@/lib/api-response";
import { downloadImageAsBase64 } from "@/services/kie-generator";
import { saveGeneratedImage } from "@/lib/save-generated-image";

const KIE_API_BASE = "https://api.kie.ai/api/v1/jobs";
const MODEL = "nano-banana-2";
const POLL_INTERVAL = 3000;
const MAX_POLLS = 100;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const assetId: string | undefined = body.assetId;
  const aspectRatio: string = body.aspectRatio ?? "1:1";

  if (!assetId) {
    return jsonError("Missing assetId", 400);
  }

  try {
    const workspaceId = getWorkspaceId();

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return jsonNotFound("Project");

    try {
      ensureWorkspaceScope(project.workspaceId);
    } catch {
      return jsonError("Forbidden: workspace scope violation", 403);
    }

    const sourceAsset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!sourceAsset || sourceAsset.projectId !== id) {
      return jsonError("Asset not found or not in this project", 404);
    }

    // Extract prompt from project content
    let promptText = "";
    try {
      const content = JSON.parse(project.content ?? "{}");
      promptText = content.briefText ?? project.briefText ?? "";
    } catch {
      promptText = project.briefText ?? "";
    }

    if (!promptText) {
      return jsonError("프롬프트가 비어있습니다. 프롬프트를 먼저 입력해 주세요.", 400);
    }

    const job = await prisma.$transaction(async (tx) => {
      const newJob = await tx.generationJob.create({
        data: {
          projectId: id,
          status: "queued",
          provider: "kie-nano-banana-2-model-compose",
          input: JSON.stringify({ assetId, aspectRatio, promptText }),
        },
      });

      await tx.usageLedger.create({
        data: {
          workspaceId,
          eventType: "model_compose_start",
          detail: JSON.stringify({ projectId: id, jobId: newJob.id, assetId }),
        },
      });

      return newJob;
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const imageUrl = `${baseUrl}/${sourceAsset.filePath.replace(/\\/g, "/")}`;

    processModelCompose(job.id, id, promptText, imageUrl, aspectRatio).catch((err) => {
      console.error("Background model-compose error:", err);
    });

    return jsonOk({ jobId: job.id, status: "queued" }, 202);
  } catch (error) {
    console.error("POST /api/projects/[id]/model-compose error:", error);
    return jsonError("Internal server error", 500);
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return jsonError("Missing jobId query parameter", 400);
  }

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return jsonNotFound("Project");

    try {
      ensureWorkspaceScope(project.workspaceId);
    } catch {
      return jsonError("Forbidden: workspace scope violation", 403);
    }

    const job = await prisma.generationJob.findUnique({ where: { id: jobId } });
    if (!job || job.projectId !== id) {
      return jsonNotFound("GenerationJob");
    }

    let assets: unknown[] = [];
    if (job.status === "done" && job.output) {
      try {
        const output = JSON.parse(job.output);
        const assetIds = (output.assets ?? []).map((a: { assetId: string }) => a.assetId);
        assets = await prisma.asset.findMany({
          where: { id: { in: assetIds } },
          select: { id: true, filePath: true, mimeType: true, sourceType: true },
        });
      } catch {
        // best-effort
      }
    }

    return jsonOk({
      job: {
        id: job.id,
        status: job.status,
        provider: job.provider,
        error: job.error,
        startedAt: job.startedAt,
        doneAt: job.doneAt,
      },
      ...(job.status === "done" ? { assets } : {}),
    });
  } catch (error) {
    console.error("GET /api/projects/[id]/model-compose error:", error);
    return jsonError("Internal server error", 500);
  }
}

async function processModelCompose(
  jobId: string,
  projectId: string,
  promptText: string,
  imageUrl: string,
  aspectRatio: string,
) {
  try {
    await prisma.generationJob.update({
      where: { id: jobId },
      data: { status: "running", startedAt: new Date() },
    });

    const apiKey = process.env.KIE_API_KEY;
    if (!apiKey) throw new Error("KIE_API_KEY not configured");

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    // Create task with Nano Banana 2 + image_input
    const createRes = await fetch(`${KIE_API_BASE}/createTask`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: MODEL,
        input: {
          prompt: promptText,
          aspect_ratio: aspectRatio,
          resolution: "1K",
          output_format: "jpg",
          google_search: false,
          image_input: [imageUrl],
        },
      }),
    });

    if (!createRes.ok) {
      throw new Error(`Kie.ai createTask failed: ${createRes.status}`);
    }

    const createData = (await createRes.json()) as {
      code: number;
      msg: string;
      data?: { taskId: string };
    };

    if (createData.code !== 200 || !createData.data?.taskId) {
      throw new Error(`Kie.ai createTask error: ${createData.msg}`);
    }

    const { taskId } = createData.data;

    // Poll until done
    for (let i = 0; i < MAX_POLLS; i++) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL));

      const pollRes = await fetch(
        `${KIE_API_BASE}/recordInfo?taskId=${taskId}`,
        { headers },
      );

      if (!pollRes.ok) continue;

      const pollData = (await pollRes.json()) as {
        code: number;
        data?: {
          state: string;
          resultJson?: string;
          failMsg?: string | null;
        };
      };

      const state = pollData.data?.state;

      if (state === "success") {
        const resultJson = pollData.data?.resultJson;
        if (!resultJson) throw new Error("Kie.ai: empty resultJson");

        const parsed = JSON.parse(resultJson) as { resultUrls?: string[] };
        if (!parsed.resultUrls?.length) {
          throw new Error("Kie.ai: no result URLs");
        }

        const img = await downloadImageAsBase64(parsed.resultUrls[0]);
        const saved = await saveGeneratedImage(
          projectId,
          img.imageBytes,
          img.mimeType,
          "model-compose",
        );

        await prisma.$transaction([
          prisma.project.update({
            where: { id: projectId },
            data: { status: "generated" },
          }),
          prisma.generationJob.update({
            where: { id: jobId },
            data: {
              status: "done",
              output: JSON.stringify({ assets: [saved] }),
              doneAt: new Date(),
            },
          }),
        ]);
        return;
      }

      if (state === "fail") {
        throw new Error(
          `Kie.ai model-compose failed: ${pollData.data?.failMsg ?? "unknown"}`,
        );
      }
    }

    throw new Error("Kie.ai model-compose timed out");
  } catch (error) {
    await prisma.generationJob.update({
      where: { id: jobId },
      data: { status: "failed", error: String(error), doneAt: new Date() },
    });
  }
}
