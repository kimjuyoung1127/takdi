import { prisma } from "@/lib/prisma";
import { ensureWorkspaceScope } from "@/lib/workspace-guard";
import { jsonOk, jsonError, jsonNotFound } from "@/lib/api-response";
import { resolveProjectImagePaths, resolveProjectSections } from "@/lib/project-media";
import type { CompositionId } from "@/types";

const TEMPLATE_TO_COMPOSITION: Record<string, CompositionId> = {
  "9:16": "TakdiVideo_916",
  "1:1": "TakdiVideo_1x1",
  "16:9": "TakdiVideo_169",
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        workspaceId: true,
        name: true,
        content: true,
        id: true,
      },
    });
    if (!project) return jsonNotFound("Project");

    try {
      ensureWorkspaceScope(project.workspaceId);
    } catch {
      return jsonError("Forbidden: workspace scope violation", 403);
    }

    const { templateKey } = body;
    if (!templateKey || !TEMPLATE_TO_COMPOSITION[templateKey]) {
      return jsonError("templateKey is required. Allowed: '9:16', '1:1', '16:9'", 400);
    }

    const compositionId = TEMPLATE_TO_COMPOSITION[templateKey];

    // Build complete RemotionInputProps
    const [resolvedSections, imagePaths] = await Promise.all([
      resolveProjectSections(project.id, project.content),
      resolveProjectImagePaths(project.id),
    ]);

    return jsonOk({
      compositionId,
      templateKey,
      inputProps: {
        title: project.name,
        sections: resolvedSections.sections,
        selectedImages: imagePaths,
        bgmMetadata: { src: "" },
        templateKey,
      },
      previewReady: true,
    });
  } catch (error) {
    console.error("POST /api/projects/[id]/remotion/preview error:", error);
    return jsonError("Internal server error", 500);
  }
}
