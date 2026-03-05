/** 프로젝트 프리뷰 페이지 — Remotion Player로 영상 미리보기 */
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RemotionPreview } from "@/components/remotion-preview";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { GenerationResultSection, CompositionId } from "@/types";

const TEMPLATE_TO_COMPOSITION: Record<string, CompositionId> = {
  "9:16": "TakdiVideo_916",
  "1:1": "TakdiVideo_1x1",
  "16:9": "TakdiVideo_169",
};

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
  });

  if (!project) {
    notFound();
  }

  // Status guard
  if (project.status !== "generated" && project.status !== "exported") {
    return (
      <main className="p-8">
        <h1 className="text-xl font-bold text-gray-900">프리뷰 불가</h1>
        <p className="mt-2 text-sm text-gray-600">
          텍스트 생성이 완료된 프로젝트만 프리뷰할 수 있습니다.
          <br />
          현재 상태: <strong>{project.status}</strong>
        </p>
        <Link href="/">
          <Button variant="ghost" className="mt-4 text-indigo-600">
            홈으로 돌아가기
          </Button>
        </Link>
      </main>
    );
  }

  // Parse sections from project content
  let sections: GenerationResultSection[] = [];
  try {
    const content = JSON.parse(project.content ?? "{}");
    sections = content.sections ?? [];
  } catch {
    // Invalid content — empty sections
  }

  // Fetch generated assets
  const assets = await prisma.asset.findMany({
    where: { projectId: id, sourceType: "generated" },
    select: { filePath: true },
  });

  // Determine composition
  const templateKey = rawTemplateKey ?? "9:16";
  const compositionId =
    TEMPLATE_TO_COMPOSITION[templateKey] ?? "TakdiVideo_916";

  const inputProps = {
    title: project.name,
    sections,
    selectedImages: assets.map((a) => a.filePath),
    bgmMetadata: { src: "" },
    templateKey,
  };

  return (
    <main className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          {project.name} — 프리뷰
        </h1>
        <Link href="/">
          <Button variant="outline" className="rounded-xl text-sm">
            홈으로
          </Button>
        </Link>
      </div>

      {/* Player */}
      <RemotionPreview
        initialCompositionId={compositionId}
        inputProps={inputProps}
      />

      {/* Section info */}
      <p className="mt-6 text-sm text-gray-400">
        섹션 {sections.length}개 · 이미지 {assets.length}개 · 상태:{" "}
        {project.status}
      </p>
    </main>
  );
}
