import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/prisma";
import { ensureWorkspaceScope } from "@/lib/workspace-guard";
import { jsonOk, jsonError, jsonNotFound } from "@/lib/api-response";
import { analyzeBgm } from "@/services/bgm-analyzer";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return jsonNotFound("Project");

    try {
      ensureWorkspaceScope(project.workspaceId);
    } catch {
      return jsonError("Forbidden: workspace scope violation", 403);
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return jsonError("No file provided", 400);

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;

    // Analyze BGM
    const analysis = analyzeBgm(buffer, mimeType);
    if (!analysis.valid) {
      return jsonError(analysis.reason || "Invalid audio file", 400);
    }

    // Save file
    const bgmDir = join(process.cwd(), "uploads", id, "bgm");
    await mkdir(bgmDir, { recursive: true });
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = join(bgmDir, fileName);
    await writeFile(filePath, buffer);

    // Create Asset record
    const asset = await prisma.asset.create({
      data: {
        projectId: id,
        sourceType: "uploaded",
        filePath: `/uploads/${id}/bgm/${fileName}`,
        mimeType,
      },
    });

    return jsonOk({ asset, analysis }, 201);
  } catch (error) {
    console.error("POST /api/projects/[id]/bgm error:", error);
    return jsonError("Internal server error", 500);
  }
}
