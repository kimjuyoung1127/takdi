/** Deployment runtime path tests for uploads path resolution. */
import path from "path";
import { afterEach, describe, expect, it } from "vitest";
import { toDiskPath, toPublicUploadPath } from "@/lib/asset-images";
import {
  fromPublicUploadPath,
  getProjectUploadsDir,
  getUploadsRootDir,
} from "@/lib/runtime-paths";

const originalUploadsDir = process.env.UPLOADS_DIR;

afterEach(() => {
  if (originalUploadsDir === undefined) {
    delete process.env.UPLOADS_DIR;
    return;
  }

  process.env.UPLOADS_DIR = originalUploadsDir;
});

describe("runtime upload paths", () => {
  it("defaults uploads root to the repo uploads folder", () => {
    delete process.env.UPLOADS_DIR;

    expect(getUploadsRootDir()).toBe(path.resolve(process.cwd(), "uploads"));
    expect(getProjectUploadsDir("project-1")).toBe(
      path.resolve(process.cwd(), "uploads", "project-1"),
    );
  });

  it("resolves a custom UPLOADS_DIR for project files and public paths", () => {
    process.env.UPLOADS_DIR = "../takdi-runtime/uploads";

    expect(getUploadsRootDir()).toBe(
      path.resolve(process.cwd(), "../takdi-runtime/uploads"),
    );
    expect(toDiskPath("/uploads/project-1/video.mp4")).toBe(
      path.resolve(process.cwd(), "../takdi-runtime/uploads/project-1/video.mp4"),
    );
    expect(toPublicUploadPath("project-1", "video.mp4")).toBe(
      "/uploads/project-1/video.mp4",
    );
    expect(fromPublicUploadPath("/uploads/project-1/video.mp4")).toEqual([
      "project-1",
      "video.mp4",
    ]);
  });
});
