/** 결과 페이지 — 스크롤 프리뷰 + 다운로드 링크 */
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { BlockDocument } from "@/types/blocks";
import { ResultView } from "./result-view";

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
      // invalid
    }
  }

  if (!doc) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        <p>블록 데이터가 없습니다. Compose 에디터에서 블록을 추가하세요.</p>
      </div>
    );
  }

  return <ResultView projectId={project.id} projectName={project.name} doc={doc} />;
}
