import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PreviewShell } from "@/components/preview/preview-shell";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { TEMPLATE_TO_COMPOSITION } from "@/components/preview/remotion-preview-config";
import type { GenerationResultSection } from "@/types";

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
    select: { id: true, name: true, content: true, status: true },
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

  let sections: GenerationResultSection[] = [];
  try {
    const content = JSON.parse(project.content ?? "{}");
    sections = content.sections ?? [];
  } catch {
    // ignore invalid content
  }

  const assets = await prisma.asset.findMany({
    where: { projectId: id, sourceType: "generated" },
    select: { filePath: true },
  });

  const templateKey = rawTemplateKey ?? "9:16";
  const compositionId = TEMPLATE_TO_COMPOSITION[templateKey] ?? "TakdiVideo_916";
  const selectedImages = assets.map((asset) => asset.filePath);

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
        initialCompositionId={compositionId}
        inputProps={{
          title: project.name,
          sections,
          selectedImages,
          bgmMetadata: { src: "" },
          templateKey,
        }}
        projectName={project.name}
        projectStatus={project.status}
        sectionCount={sections.length}
        imageCount={assets.length}
        posterSrc={selectedImages[0]}
      />

      <p className="mt-6 text-sm text-gray-400">
        Sections: {sections.length} | Images: {assets.length} | Status: {project.status}
      </p>
    </main>
  );
}
