import { prisma } from "@/lib/prisma";
import { getWorkspaceId } from "@/lib/workspace-guard";
import { jsonOk, jsonError } from "@/lib/api-response";

export async function GET() {
  try {
    const workspaceId = getWorkspaceId();

    const entries = await prisma.usageLedger.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });

    const summary = {
      totalEvents: entries.length,
      generationCount: entries.filter((e) => e.eventType === "generation_start").length,
      exportCount: entries.filter((e) => e.eventType === "export_complete").length,
      totalEstimatedCost: entries.reduce((sum, e) => sum + (e.costEstimate ?? 0), 0),
    };

    return jsonOk({ workspaceId, summary, entries });
  } catch (error) {
    console.error("GET /api/usage/me error:", error);
    return jsonError("Internal server error", 500);
  }
}
