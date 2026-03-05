import { prisma } from "@/lib/prisma";
import { getWorkspaceId, ensureWorkspaceScope } from "@/lib/workspace-guard";
import { jsonOk, jsonError, jsonNotFound } from "@/lib/api-response";

/**
 * POST /api/projects/:id/remotion/render
 * Start async render job. Returns 202 with jobId; client polls GET /remotion/status.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const workspaceId = getWorkspaceId();

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return jsonNotFound("Project");

    try {
      ensureWorkspaceScope(project.workspaceId);
    } catch {
      return jsonError("Forbidden: workspace scope violation", 403);
    }

    // Must have generated content
    if (project.status !== "generated" && project.status !== "exported") {
      return jsonError("Project must be in 'generated' or 'exported' status to render", 409);
    }

    const compositionId = body.compositionId || "TakdiVideo_916";
    const templateKey = body.templateKey || "9:16";

    // Create render job + usage record
    const job = await prisma.$transaction(async (tx) => {
      const renderJob = await tx.generationJob.create({
        data: {
          projectId: id,
          status: "queued",
          provider: "remotion",
          input: JSON.stringify({ compositionId, templateKey }),
        },
      });

      await tx.usageLedger.create({
        data: {
          workspaceId,
          eventType: "render_start",
          detail: JSON.stringify({
            projectId: id,
            jobId: renderJob.id,
          }),
        },
      });

      return renderJob;
    });

    // Fire-and-forget: start background render
    processRender(job.id, id, workspaceId, { compositionId, templateKey }).catch(
      (err) => {
        console.error("Background render error:", err);
      }
    );

    return jsonOk({ jobId: job.id, status: "queued" }, 202);
  } catch (error) {
    console.error("POST /api/projects/[id]/remotion/render error:", error);
    return jsonError("Internal server error", 500);
  }
}

/**
 * Background processing: render video composition.
 * Polling via GET /api/projects/:id/remotion/status (existing endpoint).
 */
async function processRender(
  jobId: string,
  projectId: string,
  workspaceId: string,
  options: { compositionId: string; templateKey: string }
) {
  try {
    await prisma.generationJob.update({
      where: { id: jobId },
      data: { status: "running", startedAt: new Date() },
    });

    // TODO: 실제 Remotion renderMedia() 호출이 들어올 자리
    // 현재는 stub: 즉시 완료
    const outputPath = `/exports/${projectId}/${Date.now()}.mp4`;

    await prisma.$transaction(async (tx) => {
      await tx.generationJob.update({
        where: { id: jobId },
        data: {
          status: "done",
          output: JSON.stringify({
            compositionId: options.compositionId,
            rendered: true,
          }),
          doneAt: new Date(),
        },
      });

      await tx.exportArtifact.create({
        data: {
          projectId,
          type: "video",
          filePath: outputPath,
          metadata: JSON.stringify({
            compositionId: options.compositionId,
            templateKey: options.templateKey,
            stub: true,
          }),
        },
      });

      await tx.usageLedger.create({
        data: {
          workspaceId,
          eventType: "render_complete",
          detail: JSON.stringify({ projectId, jobId }),
        },
      });
    });
  } catch (error) {
    await prisma.generationJob.update({
      where: { id: jobId },
      data: { status: "failed", error: String(error), doneAt: new Date() },
    });
  }
}
