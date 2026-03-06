import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/prisma";
import { getWorkspaceId, ensureWorkspaceScope } from "@/lib/workspace-guard";
import { jsonOk, jsonError, jsonNotFound } from "@/lib/api-response";
import { validateByoiImage } from "@/services/byoi-validator";

export async function GET(
  _request: Request,
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

    const assets = await prisma.asset.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "desc" },
    });

    return jsonOk({ assets });
  } catch (error) {
    console.error("GET /api/projects/[id]/assets error:", error);
    return jsonError("Internal server error", 500);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workspaceId = getWorkspaceId();

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

    const sourceType = (formData.get("sourceType") as string) || "uploaded";
    const preserveOriginal = formData.get("preserveOriginal") === "true";
    const skipValidation = formData.get("skipValidation") === "true";

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;

    // Validate image (skip for video/gif uploads)
    let validationResult: { width?: number; height?: number } | null = null;
    if (skipValidation) {
      const MAX_SIZE = 50 * 1024 * 1024; // 50MB
      if (buffer.length > MAX_SIZE) {
        return jsonError("File too large (max 50MB)", 400);
      }
    } else {
      const validation = validateByoiImage(buffer, mimeType);
      if (!validation.valid) {
        return jsonError(validation.reason || "Invalid image", 400);
      }
      validationResult = { width: validation.width, height: validation.height };
    }

    // Save file
    const uploadsDir = join(process.cwd(), "uploads", id);
    await mkdir(uploadsDir, { recursive: true });
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    // Create Asset record
    const asset = await prisma.asset.create({
      data: {
        projectId: id,
        sourceType,
        filePath: `/uploads/${id}/${fileName}`,
        mimeType,
        preserveOriginal,
      },
    });

    return jsonOk(
      {
        asset,
        validation: validationResult,
      },
      201
    );
  } catch (error) {
    console.error("POST /api/projects/[id]/assets error:", error);
    return jsonError("Internal server error", 500);
  }
}
