import { prisma } from "@/lib/prisma";
import { getWorkspaceId, ensureWorkspaceScope } from "@/lib/workspace-guard";
import { jsonOk, jsonError, jsonNotFound } from "@/lib/api-response";

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

    // Create render job + artifact + usage record in transaction
    const [job, artifact] = await prisma.$transaction(async (tx) => {
      const renderJob = await tx.generationJob.create({
        data: {
          projectId: id,
          status: "queued",
          provider: "remotion",
          input: JSON.stringify({ compositionId, templateKey }),
        },
      });

      // Stub: immediately complete
      const completedJob = await tx.generationJob.update({
        where: { id: renderJob.id },
        data: {
          status: "done",
          startedAt: new Date(),
          doneAt: new Date(),
          output: JSON.stringify({ compositionId, rendered: true }),
        },
      });

      const exportArtifact = await tx.exportArtifact.create({
        data: {
          projectId: id,
          type: "video",
          filePath: `/exports/${id}/${Date.now()}.mp4`,
          metadata: JSON.stringify({ compositionId, templateKey, stub: true }),
        },
      });

      await tx.usageLedger.create({
        data: {
          workspaceId,
          eventType: "render_complete",
          detail: JSON.stringify({
            projectId: id,
            jobId: completedJob.id,
            artifactId: exportArtifact.id,
          }),
        },
      });

      return [completedJob, exportArtifact] as const;
    });

    return jsonOk({ job, artifact }, 201);
  } catch (error) {
    console.error("POST /api/projects/[id]/remotion/render error:", error);
    return jsonError("Internal server error", 500);
  }
}
