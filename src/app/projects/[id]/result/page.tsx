import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { BlockDocument } from "@/types/blocks";
import { listProjectArtifacts } from "@/lib/project-media";
import type { ExportArtifactRecord } from "@/lib/api-client";
import type { ExportArtifactType } from "@/types";
import { ResultView } from "./result-view";
import { ShortformResultView } from "./shortform-result-view";

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
    title: project ? `${project.name} | Result | Takdi Studio` : "Result | Takdi Studio",
    description: "Review the exported block result for this Takdi Studio project.",
  };
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    select: { id: true, name: true, content: true, mode: true },
  });

  if (!project) {
    notFound();
  }

  if (project.mode === "compose") {
    let doc: BlockDocument | null = null;
    if (project.content) {
      try {
        const parsed = JSON.parse(project.content);
        if (parsed.format === "blocks") {
          doc = parsed as BlockDocument;
        }
      } catch {
        // ignore invalid content
      }
    }

    if (!doc) {
      return (
        <div className="flex h-screen items-center justify-center text-gray-500">
          <p>No block document was found for this project.</p>
        </div>
      );
    }

    return <ResultView projectId={project.id} projectName={project.name} doc={doc} />;
  }

  const artifacts = await listProjectArtifacts(project.id, ["video", "gif", "thumbnail", "marketing-script"]);
  return (
    <ShortformResultView
      projectId={project.id}
      projectName={project.name}
      artifacts={artifacts.map(toClientArtifact)}
    />
  );
}
