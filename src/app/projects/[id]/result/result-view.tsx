/** 결과 뷰 — 클라이언트 컴포넌트 (프리뷰 + 내보내기 링크) */
"use client";

import type { BlockDocument } from "@/types/blocks";
import { BlockPreview } from "@/components/compose/block-preview";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";

interface ResultViewProps {
  projectId: string;
  projectName: string;
  doc: BlockDocument;
}

export function ResultView({ projectId, projectName, doc }: ResultViewProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/projects/${projectId}/compose`}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-500"
          >
            <ArrowLeft className="h-4 w-4" />
            편집으로 돌아가기
          </Link>
          <span className="text-sm font-semibold text-gray-900">{projectName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
            {doc.platform.name} · {doc.platform.width}px
          </span>
          <Link
            href={`/projects/${projectId}/compose`}
            className="flex items-center gap-1 rounded bg-indigo-500 px-3 py-1.5 text-xs text-white hover:bg-indigo-600"
          >
            <Edit className="h-3 w-3" />
            편집
          </Link>
        </div>
      </header>

      {/* Preview */}
      <main className="p-8">
        <BlockPreview blocks={doc.blocks} platformWidth={doc.platform.width} />
      </main>
    </div>
  );
}
