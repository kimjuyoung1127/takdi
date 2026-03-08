/** Helpers for storing preview/result artifacts under the uploads tree. */
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { sanitizeUploadName, toPublicUploadPath } from "@/lib/asset-images";

export async function saveTextArtifactFile(
  projectId: string,
  prefix: string,
  content: string,
) {
  const uploadsDir = path.join(process.cwd(), "uploads", projectId);
  await mkdir(uploadsDir, { recursive: true });

  const fileName = `${Date.now()}-${sanitizeUploadName(prefix)}.txt`;
  await writeFile(path.join(uploadsDir, fileName), content, "utf8");

  return toPublicUploadPath(projectId, fileName);
}
