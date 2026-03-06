/** POST/GET /api/projects/:id/scene-compose — AI 배경 합성 (이미지 URL + 장면 프롬프트) */

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
  const imageUrl: string | undefined = body.imageUrl;
  const scenePrompt: string | undefined = body.scenePrompt;
  const aspectRatio: string = body.aspectRatio ?? "1:1";

  if (!imageUrl) return jsonError("Missing imageUrl", 400);
  if (!scenePrompt) return jsonError("Missing scenePrompt", 400);

  try {
    const workspaceId = getWorkspaceId();

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return jsonNotFound("Project");

    try {
      ensureWorkspaceScope(project.workspaceId);
    } catch {
      return jsonError("Forbidden: workspace scope violation", 403);
    }

    const job = await prisma.$transaction(async (tx) => {
      const newJob = await tx.generationJob.create({
        data: {
          projectId: id,
          status: "queued",
          provider: "kie-nano-banana-2-scene-compose",
          input: JSON.stringify({ imageUrl, scenePrompt, aspectRatio }),
        },
      });

      await tx.usageLedger.create({
        data: {
          workspaceId,
          eventType: "scene_compose_start",
          detail: JSON.stringify({ projectId: id, jobId: newJob.id }),
        },
      });

      return newJob;
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const fullImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `${baseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;

    processSceneCompose(job.id, id, scenePrompt, fullImageUrl, aspectRatio).catch((err) => {
      console.error("Background scene-compose error:", err);
    });

    return jsonOk({ jobId: job.id, status: "queued" }, 202);
  } catch (error) {
    console.error("POST /api/projects/[id]/scene-compose error:", error);
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

  if (!jobId) return jsonError("Missing jobId query parameter", 400);

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return jsonNotFound("Project");

    try {
      ensureWorkspaceScope(project.workspaceId);
    } catch {
      return jsonError("Forbidden: workspace scope violation", 403);
    }

    const job = await prisma.generationJob.findUnique({ where: { id: jobId } });
    if (!job || job.projectId !== id) return jsonNotFound("GenerationJob");

    let assets: unknown[] = [];
    if (job.status === "done" && job.output) {
      try {
        const output = JSON.parse(job.output);
        const assetIds = (output.assets ?? []).map((a: { assetId: string }) => a.assetId);
        assets = await prisma.asset.findMany({
          where: { id: { in: assetIds } },
          select: { id: true, filePath: true, mimeType: true, sourceType: true },
        });
      } catch { /* best-effort */ }
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
    console.error("GET /api/projects/[id]/scene-compose error:", error);
    return jsonError("Internal server error", 500);
  }
}

async function processSceneCompose(
  jobId: string,
  projectId: string,
  scenePrompt: string,
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

    const createRes = await fetch(`${KIE_API_BASE}/createTask`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: MODEL,
        input: {
          prompt: scenePrompt,
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

    for (let i = 0; i < MAX_POLLS; i++) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL));

      const pollRes = await fetch(
        `${KIE_API_BASE}/recordInfo?taskId=${taskId}`,
        { headers },
      );

      if (!pollRes.ok) continue;

      const pollData = (await pollRes.json()) as {
        code: number;
        data?: { state: string; resultJson?: string; failMsg?: string | null };
      };

      const state = pollData.data?.state;

      if (state === "success") {
        const resultJson = pollData.data?.resultJson;
        if (!resultJson) throw new Error("Kie.ai: empty resultJson");

        const parsed = JSON.parse(resultJson) as { resultUrls?: string[] };
        if (!parsed.resultUrls?.length) throw new Error("Kie.ai: no result URLs");

        const img = await downloadImageAsBase64(parsed.resultUrls[0]);
        const saved = await saveGeneratedImage(projectId, img.imageBytes, img.mimeType, "composed");

        await prisma.generationJob.update({
          where: { id: jobId },
          data: {
            status: "done",
            output: JSON.stringify({ assets: [saved] }),
            doneAt: new Date(),
          },
        });
        return;
      }

      if (state === "fail") {
        throw new Error(`Kie.ai scene-compose failed: ${pollData.data?.failMsg ?? "unknown"}`);
      }
    }

    throw new Error("Kie.ai scene-compose timed out");
  } catch (error) {
    await prisma.generationJob.update({
      where: { id: jobId },
      data: { status: "failed", error: String(error), doneAt: new Date() },
    });
  }
}
