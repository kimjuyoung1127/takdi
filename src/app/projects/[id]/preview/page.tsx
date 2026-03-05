import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RemotionPreview } from "@/components/remotion-preview";
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
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>프리뷰 불가</h1>
        <p>
          텍스트 생성이 완료된 프로젝트만 프리뷰할 수 있습니다.
          <br />
          현재 상태: <strong>{project.status}</strong>
        </p>
        <a href="/" style={{ color: "#0070f3" }}>
          홈으로 돌아가기
        </a>
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
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>
          {project.name} — 프리뷰
        </h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <a
            href="/"
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              textDecoration: "none",
              color: "#111",
            }}
          >
            홈으로
          </a>
        </div>
      </div>

      {/* Player */}
      <RemotionPreview
        initialCompositionId={compositionId}
        inputProps={inputProps}
      />

      {/* Section info */}
      <div style={{ marginTop: "1.5rem", color: "#666", fontSize: "0.875rem" }}>
        <p>
          섹션 {sections.length}개 · 이미지 {assets.length}개 · 상태:{" "}
          {project.status}
        </p>
      </div>
    </main>
  );
}
