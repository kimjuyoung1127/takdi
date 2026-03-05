import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

/**
 * Save base64 image bytes to disk and create an Asset record.
 * Returns the new asset ID and file path.
 */
export async function saveGeneratedImage(
  projectId: string,
  imageBytes: string,
  mimeType: string,
  slotLabel: string
): Promise<{ assetId: string; filePath: string }> {
  const ext = mimeType === "image/png" ? "png" : "jpg";
  const fileName = `gen_${projectId}_${slotLabel}_${Date.now()}.${ext}`;
  const filePath = path.join("uploads", fileName);

  await fs.mkdir("uploads", { recursive: true });
  await fs.writeFile(filePath, Buffer.from(imageBytes, "base64"));

  const asset = await prisma.asset.create({
    data: {
      projectId,
      sourceType: "generated",
      filePath,
      mimeType,
    },
  });

  return { assetId: asset.id, filePath };
}
