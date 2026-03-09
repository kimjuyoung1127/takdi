import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import {
  normalizeImageVariants,
  sanitizeUploadName,
  shouldNormalizeImage,
  toPublicUploadPath,
} from "@/lib/asset-images";
import { getProjectUploadsDir } from "@/lib/runtime-paths";

export async function saveGeneratedImage(
  projectId: string,
  imageBytes: string,
  mimeType: string,
  slotLabel: string,
): Promise<{ assetId: string; filePath: string }> {
  const uploadsDir = getProjectUploadsDir(projectId);
  await mkdir(uploadsDir, { recursive: true });

  const buffer = Buffer.from(imageBytes, "base64");
  const timestamp = Date.now();
  const safeSlotLabel = sanitizeUploadName(slotLabel);

  let filePath: string;
  let storedMimeType = mimeType;

  if (shouldNormalizeImage(mimeType)) {
    const { mainBuffer, previewBuffer } = await normalizeImageVariants(buffer);
    const mainFileName = `gen-${safeSlotLabel}-${timestamp}.webp`;
    const previewFileName = `gen-${safeSlotLabel}-${timestamp}-preview.webp`;

    await Promise.all([
      writeFile(path.join(uploadsDir, mainFileName), mainBuffer),
      writeFile(path.join(uploadsDir, previewFileName), previewBuffer),
    ]);

    filePath = toPublicUploadPath(projectId, mainFileName);
    storedMimeType = "image/webp";
  } else {
    const extension = mimeType === "image/png" ? "png" : "jpg";
    const fileName = `gen-${safeSlotLabel}-${timestamp}.${extension}`;
    await writeFile(path.join(uploadsDir, fileName), buffer);
    filePath = toPublicUploadPath(projectId, fileName);
  }

  const asset = await prisma.asset.create({
    data: {
      projectId,
      sourceType: "generated",
      filePath,
      mimeType: storedMimeType,
    },
  });

  return { assetId: asset.id, filePath };
}
