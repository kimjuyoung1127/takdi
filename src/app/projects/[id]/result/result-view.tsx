/** Result screen for compose exports with preview and image download. */
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BlockPreview } from "@/components/compose/block-preview";
import { ComposeProvider } from "@/components/compose/compose-context";
import { buildDefaultFilename, captureBlocksAsImage, exportToDownload } from "@/lib/block-export";
import type { BlockDocument } from "@/types/blocks";

interface ResultViewProps {
  projectId: string;
  projectName: string;
  doc: BlockDocument;
  mobilePreview?: boolean;
}

export function ResultView({
  projectId,
  projectName,
  doc,
  mobilePreview,
}: ResultViewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const previewWidth = mobilePreview ? 375 : doc.platform.width;

  const handleDownload = async () => {
    if (!previewRef.current) {
      return;
    }

    setDownloading(true);
    try {
      const blob = await captureBlocksAsImage(previewRef.current, {
        width: previewWidth,
        format: "jpg",
        scale: 2,
      });
      const filename = buildDefaultFilename(projectName, doc.platform.name || "export", "jpg");
      exportToDownload(blob, filename);
      toast.success("이미지 다운로드 완료");
    } catch (error) {
      toast.error(`다운로드 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ComposeProvider projectId={projectId} theme={doc.theme}>
      <div className="min-h-screen bg-gray-100">
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
              {doc.platform.name} ({previewWidth}px 너비)
            </span>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1 rounded bg-emerald-500 px-3 py-1.5 text-xs text-white hover:bg-emerald-600 disabled:opacity-50"
            >
              {downloading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Download className="h-3 w-3" />
              )}
              이미지 다운로드
            </button>
            <Link
              href={`/projects/${projectId}/compose`}
              className="flex items-center gap-1 rounded bg-indigo-500 px-3 py-1.5 text-xs text-white hover:bg-indigo-600"
            >
              <Edit className="h-3 w-3" />
              편집
            </Link>
          </div>
        </header>

        <main className="p-8">
          <BlockPreview
            ref={previewRef}
            blocks={doc.blocks}
            platformWidth={doc.platform.width}
            theme={doc.theme}
            mobilePreview={mobilePreview}
          />
        </main>
      </div>
    </ComposeProvider>
  );
}
