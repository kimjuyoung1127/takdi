import { prisma } from "@/lib/prisma";
import { getWorkspaceId, ensureWorkspaceScope } from "@/lib/workspace-guard";
import { jsonOk, jsonError, jsonNotFound } from "@/lib/api-response";
import type { GenerationResultSection } from "@/types";
import { generateImageWithKie, downloadImageAsBase64 } from "@/services/kie-generator";
import { saveGeneratedImage } from "@/lib/save-generated-image";

/**
 * POST /api/projects/:id/generate-images
 * Start async image generation for each section's imageSlot.
 * Returns 202 with jobId immediately; client polls GET for status.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  try {
    const workspaceId = getWorkspaceId();

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return jsonNotFound("Project");

    try {
      ensureWorkspaceScope(project.workspaceId);
    } catch {
      return jsonError("Forbidden: workspace scope violation", 403);
    }

    // Status guard: only "generated" projects can generate images
    if (project.status !== "generated") {
      return jsonError(
        "Project status must be 'generated' to generate images (text generation must complete first)",
        409
      );
    }

    // Parse sections from project content
    let sections: GenerationResultSection[];
    try {
      const content = JSON.parse(project.content ?? "{}");
      sections = content.sections ?? [];
    } catch {
      return jsonError("Invalid project content: cannot parse sections", 400);
    }

    if (sections.length === 0) {
      return jsonError("No sections found in project content", 400);
    }

    // Filter to requested slots if specified
    const requestedSlots: string[] | undefined = body.slots;
    const targetSections = requestedSlots
      ? sections.filter((s) => requestedSlots.includes(s.imageSlot))
      : sections;

    if (targetSections.length === 0) {
      return jsonError("No matching slots found", 400);
    }

    // Create job + usage record
    const job = await prisma.$transaction(async (tx) => {
      const newJob = await tx.generationJob.create({
        data: {
          projectId: id,
          status: "queued",
          provider: "kie-nano-banana-2",
          input: JSON.stringify({
            slots: targetSections.map((s) => s.imageSlot),
            aspectRatio: body.aspectRatio ?? "1:1",
            styleParams: body.styleParams ?? {},
          }),
        },
      });

      await tx.usageLedger.create({
        data: {
          workspaceId,
          eventType: "image_generation_start",
          detail: JSON.stringify({
            projectId: id,
            jobId: newJob.id,
            slotCount: targetSections.length,
          }),
        },
      });

      return newJob;
    });

    // Fire-and-forget: start background processing
    processImageGeneration(job.id, id, targetSections, {
      apiKey: body.apiKey,
      aspectRatio: body.aspectRatio,
      styleParams: body.styleParams,
    }).catch((err) => {
      console.error("Background image generation error:", err);
    });

    return jsonOk({ jobId: job.id, status: "queued" }, 202);
  } catch (error) {
    console.error("POST /api/projects/[id]/generate-images error:", error);
    return jsonError("Internal server error", 500);
  }
}

/**
 * GET /api/projects/:id/generate-images?jobId=xxx
 * Poll image generation job status.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const job = await prisma.generationJob.findUnique({
      where: { id: jobId },
    });

    if (!job || job.projectId !== id) {
      return jsonNotFound("GenerationJob");
    }

    // If done, include generated assets
    let assets: unknown[] = [];
    if (job.status === "done" && job.output) {
      try {
        const output = JSON.parse(job.output);
        const assetIds = (output.assets ?? []).map(
          (a: { assetId: string }) => a.assetId
        );
        assets = await prisma.asset.findMany({
          where: { id: { in: assetIds } },
          select: {
            id: true,
            filePath: true,
            mimeType: true,
            sourceType: true,
          },
        });
      } catch {
        // Best-effort: return job without assets
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
    console.error("GET /api/projects/[id]/generate-images error:", error);
    return jsonError("Internal server error", 500);
  }
}

/**
 * Background processing: generate images for each section sequentially.
 * Updates GenerationJob status as it progresses.
 */
async function processImageGeneration(
  jobId: string,
  projectId: string,
  sections: GenerationResultSection[],
  options: {
    apiKey?: string;
    aspectRatio?: string;
    styleParams?: Record<string, string>;
  }
) {
  try {
    // job → running
    await prisma.generationJob.update({
      where: { id: jobId },
      data: { status: "running", startedAt: new Date() },
    });

    const assets: { assetId: string; filePath: string }[] = [];
    for (const section of sections) {
      const prompt = `${section.headline}. ${section.body}`;
      const kieResult = await generateImageWithKie(prompt, {
        apiKey: options.apiKey,
        aspectRatio: options.aspectRatio,
      });
      // Download the first result URL and save as base64
      const img = await downloadImageAsBase64(kieResult.imageUrls[0]);
      const saved = await saveGeneratedImage(
        projectId,
        img.imageBytes,
        img.mimeType,
        section.imageSlot,
      );
      assets.push(saved);
    }

    // job → done
    await prisma.generationJob.update({
      where: { id: jobId },
      data: {
        status: "done",
        output: JSON.stringify({ assets }),
        doneAt: new Date(),
      },
    });
  } catch (error) {
    // job → failed
    await prisma.generationJob.update({
      where: { id: jobId },
      data: { status: "failed", error: String(error), doneAt: new Date() },
    });
  }
}
