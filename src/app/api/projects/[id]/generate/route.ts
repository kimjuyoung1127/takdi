import { prisma } from "@/lib/prisma";
import { getWorkspaceId, ensureWorkspaceScope } from "@/lib/workspace-guard";
import { jsonOk, jsonError, jsonNotFound } from "@/lib/api-response";
import type { GenerationResult } from "@/types";

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

    // Status guard: only draft or failed can generate
    if (project.status !== "draft" && project.status !== "failed") {
      return jsonError("Project status must be 'draft' or 'failed' to generate", 409);
    }

    // Step 1: Create job + transition to generating
    const job = await prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id },
        data: { status: "generating" },
      });

      const newJob = await tx.generationJob.create({
        data: {
          projectId: id,
          status: "queued",
          provider: body.provider ?? "stub",
          input: JSON.stringify({
            briefText: project.briefText,
            mode: project.mode,
          }),
        },
      });

      await tx.usageLedger.create({
        data: {
          workspaceId,
          eventType: "generation_start",
          detail: JSON.stringify({ projectId: id, jobId: newJob.id }),
        },
      });

      return newJob;
    });

    // Step 2: Stub — simulate immediate completion
    const stubOutput: GenerationResult = {
      sections: [
        {
          headline: "Sample Headline",
          body: "Generated content placeholder.",
          imageSlot: "slot-1",
          styleKey: "default",
        },
        {
          headline: "Feature Highlight",
          body: "Another placeholder section.",
          imageSlot: "slot-2",
          styleKey: "default",
        },
      ],
    };

    const [updatedProject, updatedJob] = await prisma.$transaction([
      prisma.project.update({
        where: { id },
        data: {
          status: "generated",
          content: JSON.stringify(stubOutput),
        },
      }),
      prisma.generationJob.update({
        where: { id: job.id },
        data: {
          status: "done",
          output: JSON.stringify(stubOutput),
          startedAt: new Date(),
          doneAt: new Date(),
        },
      }),
    ]);

    return jsonOk({ project: updatedProject, job: updatedJob }, 201);
  } catch (error) {
    console.error("POST /api/projects/[id]/generate error:", error);
    return jsonError("Internal server error", 500);
  }
}
