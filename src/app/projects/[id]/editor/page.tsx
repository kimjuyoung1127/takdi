/** 프로젝트 노드 에디터 페이지 — 서버 컴포넌트 (DB fetch + status guard) */
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Loading from "./loading";

const NodeEditorShell = dynamic(
  () => import("@/components/editor/node-editor-shell").then((m) => m.NodeEditorShell),
  { loading: () => <Loading /> },
);

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    select: { id: true, name: true, status: true, mode: true },
  });

  if (!project) {
    notFound();
  }

  return <NodeEditorShell projectId={project.id} projectName={project.name} mode={project.mode ?? "freeform"} />;
}
