import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type { Edge, Node } from "@xyflow/react";
import { prisma } from "@/lib/prisma";
import Loading from "./loading";

const NodeEditorShell = dynamic(
  () => import("@/components/editor/node-editor-shell").then((module) => module.NodeEditorShell),
  { loading: () => <Loading /> },
);

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
    title: project ? `${project.name} | Pipeline Editor | Takdi Studio` : "Pipeline Editor | Takdi Studio",
    description: "Edit the Takdi Studio automation pipeline for this project.",
  };
}

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    select: { id: true, name: true, mode: true, briefText: true, content: true },
  });

  if (!project) {
    notFound();
  }

  let initialGraph: { nodes: Node[]; edges: Edge[] } | null = null;
  if (project.content) {
    try {
      const parsed = JSON.parse(project.content) as { nodes?: Node[]; edges?: Edge[] };
      if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
        initialGraph = { nodes: parsed.nodes, edges: parsed.edges };
      }
    } catch {
      // Ignore malformed saved graph and fall back to the mode defaults.
    }
  }

  return (
    <NodeEditorShell
      projectId={project.id}
      projectName={project.name}
      mode={project.mode ?? "freeform"}
      initialBriefText={project.briefText ?? ""}
      initialGraph={initialGraph}
    />
  );
}
