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

    // Status guard: only generated or exported can export
    if (project.status !== "generated" && project.status !== "exported") {
      return jsonError("Project must be in 'generated' or 'exported' status to export", 409);
    }

    const exportType = body.type ?? "html";

    const [updatedProject, artifact] = await prisma.$transaction(async (tx) => {
      const newArtifact = await tx.exportArtifact.create({
        data: {
          projectId: id,
          type: exportType,
          filePath: `/exports/${id}/${Date.now()}.${exportType}`,
          metadata: JSON.stringify({ stub: true }),
        },
      });

      const updated = await tx.project.update({
        where: { id },
        data: { status: "exported" },
      });

      await tx.usageLedger.create({
        data: {
          workspaceId,
          eventType: "export_complete",
          detail: JSON.stringify({
            projectId: id,
            artifactId: newArtifact.id,
            type: exportType,
          }),
        },
      });

      return [updated, newArtifact] as const;
    });

    return jsonOk({ project: updatedProject, artifact }, 201);
  } catch (error) {
    console.error("POST /api/projects/[id]/export error:", error);
    return jsonError("Internal server error", 500);
  }
}
