import { prisma } from "@/lib/prisma";
import { getWorkspaceId, ensureWorkspaceScope } from "@/lib/workspace-guard";
import { jsonOk, jsonError, jsonNotFound } from "@/lib/api-response";

/**
 * POST /api/projects/:id/export
 * Start async export job. Returns 202 with jobId; client polls GET for status.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const workspaceId = getWorkspaceId();

    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        workspaceId: true,
        status: true,
      },
    });
    if (!project) return jsonNotFound("Project");

    try {
      ensureWorkspaceScope(project.workspaceId);
    } catch {
      return jsonError("Forbidden: workspace scope violation", 403);
    }

    // Status guard: only generated or exported can export
    if (project.status !== "generated" && project.status !== "exported") {
      return jsonError("Project must be in 'generated' or 'exported' status to export", 409);
    }

    const exportType = body.type ?? "html";

    // Create export job + usage record
    const job = await prisma.$transaction(async (tx) => {
      const exportJob = await tx.generationJob.create({
        data: {
          projectId: id,
          status: "queued",
          provider: "export",
          input: JSON.stringify({ type: exportType }),
        },
      });

      await tx.usageLedger.create({
        data: {
          workspaceId,
          eventType: "export_start",
          detail: JSON.stringify({
            projectId: id,
            jobId: exportJob.id,
            type: exportType,
          }),
        },
      });

      return exportJob;
    });

    // Fire-and-forget: start background export
    processExport(job.id, id, workspaceId, exportType).catch((err) => {
      console.error("Background export error:", err);
    });

    return jsonOk({ jobId: job.id, status: "queued" }, 202);
  } catch (error) {
    console.error("POST /api/projects/[id]/export error:", error);
    return jsonError("Internal server error", 500);
  }
}

/**
 * GET /api/projects/:id/export?jobId=xxx
 * Poll export job status.
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
    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        workspaceId: true,
      },
    });
    if (!project) return jsonNotFound("Project");

    try {
      ensureWorkspaceScope(project.workspaceId);
    } catch {
      return jsonError("Forbidden: workspace scope violation", 403);
    }

    const job = await prisma.generationJob.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        projectId: true,
        status: true,
        provider: true,
        error: true,
        startedAt: true,
        doneAt: true,
        output: true,
      },
    });

    if (!job || job.projectId !== id) {
      return jsonNotFound("GenerationJob");
    }

    // If done, include artifact
    let artifact = null;
    if (job.status === "done" && job.output) {
      try {
        const output = JSON.parse(job.output);
        if (output.artifactId) {
          artifact = await prisma.exportArtifact.findUnique({
            where: { id: output.artifactId },
            select: {
              id: true,
              projectId: true,
              type: true,
              filePath: true,
              metadata: true,
              createdAt: true,
            },
          });
        }
      } catch {
        // Best-effort
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
      ...(artifact ? { artifact } : {}),
    });
  } catch (error) {
    console.error("GET /api/projects/[id]/export error:", error);
    return jsonError("Internal server error", 500);
  }
}

/**
 * Background processing: export project artifacts.
 */
async function processExport(
  jobId: string,
  projectId: string,
  workspaceId: string,
  exportType: string
) {
  try {
    await prisma.generationJob.update({
      where: { id: jobId },
      data: { status: "running", startedAt: new Date() },
    });

    // TODO: 실제 export 로직이 들어올 자리
    // 현재는 stub: 즉시 완료
    await prisma.$transaction(async (tx) => {
      const artifact = await tx.exportArtifact.create({
        data: {
          projectId,
          type: exportType,
          filePath: `/exports/${projectId}/${Date.now()}.${exportType}`,
          metadata: JSON.stringify({ stub: true }),
        },
      });

      await tx.project.update({
        where: { id: projectId },
        data: { status: "exported" },
      });

      await tx.usageLedger.create({
        data: {
          workspaceId,
          eventType: "export_complete",
          detail: JSON.stringify({
            projectId,
            artifactId: artifact.id,
            type: exportType,
          }),
        },
      });

      await tx.generationJob.update({
        where: { id: jobId },
        data: {
          status: "done",
          output: JSON.stringify({ artifactId: artifact.id }),
          doneAt: new Date(),
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
