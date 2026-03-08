/** Server-side helpers for resolving sections, artifacts, and representative media for a project. */
import { prisma } from "@/lib/prisma";
import type { ExportArtifactType, GenerationResultSection } from "@/types";

export interface ResolvedProjectSections {
  sections: GenerationResultSection[];
  source: "content" | "generation-job" | "none";
}

export async function resolveProjectSections(
  projectId: string,
  projectContent?: string | null,
): Promise<ResolvedProjectSections> {
  if (projectContent) {
    try {
      const parsed = JSON.parse(projectContent) as { sections?: GenerationResultSection[] };
      if (Array.isArray(parsed.sections)) {
        return { sections: parsed.sections, source: "content" };
      }
    } catch {
      // fall through
    }
  }

  const jobs = await prisma.generationJob.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { output: true },
  });

  for (const job of jobs) {
    if (!job.output) {
      continue;
    }

    try {
      const parsed = JSON.parse(job.output) as { sections?: GenerationResultSection[] };
      if (Array.isArray(parsed.sections)) {
        return { sections: parsed.sections, source: "generation-job" };
      }
    } catch {
      // continue
    }
  }

  return { sections: [], source: "none" };
}

export async function resolveProjectImagePaths(projectId: string) {
  const assets = await prisma.asset.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: {
      filePath: true,
      mimeType: true,
      sourceType: true,
      createdAt: true,
    },
  });

  return assets
    .filter((asset) => asset.mimeType?.startsWith("image/"))
    .sort((left, right) => {
      if (left.sourceType === right.sourceType) {
        return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
      }
      if (left.sourceType === "generated") {
        return -1;
      }
      if (right.sourceType === "generated") {
        return 1;
      }
      return 0;
    })
    .map((asset) => asset.filePath);
}

export async function listProjectArtifacts(
  projectId: string,
  types?: ExportArtifactType[],
) {
  return prisma.exportArtifact.findMany({
    where: {
      projectId,
      ...(types ? { type: { in: types } } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      filePath: true,
      metadata: true,
      createdAt: true,
    },
  });
}
