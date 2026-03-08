import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PreviewShell } from "@/components/preview/preview-shell";
import { Button } from "@/components/ui/button";
import { listProjectArtifacts, resolveProjectImagePaths, resolveProjectSections } from "@/lib/project-media";
import { prisma } from "@/lib/prisma";
import { TEMPLATE_TO_COMPOSITION } from "@/components/preview/remotion-preview-config";
import type { ExportArtifactRecord } from "@/lib/api-client";
import type { ExportArtifactType } from "@/types";

function toClientArtifact(artifact: {
  id: string;
  type: string;
  filePath: string;
  metadata: string | null;
  createdAt: Date;
}): ExportArtifactRecord {
  return {
    ...artifact,
    type: artifact.type as ExportArtifactType,
    createdAt: artifact.createdAt.toISOString(),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    select: { name: true },
  });

  return {
    title: project ? `${project.name} | Preview | Takdi Studio` : "Preview | Takdi Studio",
    description: "Preview Remotion output for this Takdi Studio project.",
  };
}

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ templateKey?: string }>;
}) {
  const { id } = await params;
  const { templateKey: rawTemplateKey } = await searchParams;

  const project = await prisma.project.findUnique({
    where: { id },
    select: { id: true, name: true, content: true, status: true, mode: true, briefText: true },
  });

  if (!project) {
    notFound();
  }

  if (project.status !== "generated" && project.status !== "exported") {
    return (
      <main className="p-8">
        <h1 className="text-xl font-bold text-gray-900">Preview unavailable</h1>
        <p className="mt-2 text-sm text-gray-600">
          This project must finish generation before preview can open.
          <br />
          Current status: <strong>{project.status}</strong>
        </p>
        <Link href="/">
          <Button variant="ghost" className="mt-4 text-indigo-600">
            Back to home
          </Button>
        </Link>
      </main>
    );
  }

  const [resolvedSections, imagePaths, artifacts] = await Promise.all([
    resolveProjectSections(project.id, project.content),
    resolveProjectImagePaths(project.id),
    listProjectArtifacts(project.id, ["thumbnail", "marketing-script"]),
  ]);

  const templateKey = rawTemplateKey ?? "9:16";
  const compositionId = TEMPLATE_TO_COMPOSITION[templateKey] ?? "TakdiVideo_916";
  const selectedImages = imagePaths;
  const thumbnailArtifact = artifacts.find((artifact) => artifact.type === "thumbnail");
  const marketingScriptArtifact = artifacts.find((artifact) => artifact.type === "marketing-script");

  return (
    <main className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{project.name} preview</h1>
        <Link href="/">
          <Button variant="outline" className="rounded-xl text-sm">
            Home
          </Button>
        </Link>
      </div>

      <PreviewShell
        projectId={project.id}
        initialCompositionId={compositionId}
        inputProps={{
          title: project.name,
          sections: resolvedSections.sections,
          selectedImages,
          bgmMetadata: { src: "" },
          templateKey,
        }}
        projectName={project.name}
        projectMode={project.mode}
        projectStatus={project.status}
        sectionCount={resolvedSections.sections.length}
        imageCount={selectedImages.length}
        posterSrc={selectedImages[0]}
        initialThumbnail={thumbnailArtifact ? toClientArtifact(thumbnailArtifact) : null}
        initialMarketingScript={marketingScriptArtifact ? toClientArtifact(marketingScriptArtifact) : null}
      />

      <p className="mt-6 text-sm text-gray-400">
        Sections: {resolvedSections.sections.length} | Images: {selectedImages.length} | Status: {project.status}
      </p>
    </main>
  );
}
