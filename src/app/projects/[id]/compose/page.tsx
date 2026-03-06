/** Compose 블록 에디터 페이지 — 서버 컴포넌트 (DB fetch → ComposeShell) */
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ComposeShell } from "@/components/compose/compose-shell";
import type { BlockDocument } from "@/types/blocks";

const DEFAULT_DOC: BlockDocument = {
  format: "blocks",
  blocks: [],
  platform: { width: 780, name: "coupang" },
  version: 1,
};

export default async function ComposePage({
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

  let initialDoc = DEFAULT_DOC;
  if (project.content) {
    try {
      const parsed = JSON.parse(project.content);
      if (parsed.format === "blocks") {
        initialDoc = parsed as BlockDocument;
      }
    } catch {
      // invalid JSON, use default
    }
  }

  return (
    <ComposeShell
      projectId={project.id}
      projectName={project.name}
      initialDoc={initialDoc}
    />
  );
}
