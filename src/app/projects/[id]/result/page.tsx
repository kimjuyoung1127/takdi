import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { BlockDocument } from "@/types/blocks";
import { ResultView } from "./result-view";

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
    select: { id: true, name: true, content: true },
  });

  if (!project) {
    notFound();
  }

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
