/** 내보내기 다이얼로그 — 파일명/포맷 설정 + 다운로드 실행 */
"use client";

import { useState, useRef, useEffect } from "react";
import { X, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExportFormat } from "@/lib/block-export";
import { buildDefaultFilename, captureBlocksAsImage, exportToDownload } from "@/lib/block-export";
import { toast } from "sonner";

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  projectName: string;
  platformName: string;
  captureRef: React.RefObject<HTMLElement | null>;
  platformWidth: number;
}

export function ExportDialog({
  open,
  onClose,
  projectName,
  platformName,
  captureRef,
  platformWidth,
}: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>("jpg");
  const [filename, setFilename] = useState("");
  const [exporting, setExporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 다이얼로그 열릴 때 기본 파일명 세팅
  useEffect(() => {
    if (open) {
      setFilename(buildDefaultFilename(projectName, platformName, format).replace(/\.\w+$/, ""));
      setTimeout(() => inputRef.current?.select(), 50);
    }
  }, [open, projectName, platformName, format]);

  if (!open) return null;

  const handleExport = async () => {
    if (!captureRef.current) {
      toast.error("미리보기를 로드할 수 없습니다. 페이지를 새로고침해주세요");
      return;
    }

    setExporting(true);
    try {
      const blob = await captureBlocksAsImage(captureRef.current, {
        width: platformWidth,
        format,
        scale: 2,
      });
      const fullFilename = `${filename}.${format}`;
      exportToDownload(blob, fullFilename);
      toast.success("이미지 다운로드 완료");
      onClose();
    } catch (err) {
      toast.error(`내보내기 실패: ${err instanceof Error ? err.message : "알 수 없는 오류"}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-96 rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">이미지 내보내기</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 파일명 */}
        <label className="mb-1 block text-xs text-gray-500">파일명</label>
        <div className="mb-4 flex items-center gap-1">
          <input
            ref={inputRef}
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="flex-1 rounded border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
          />
          <span className="text-sm text-gray-400">.{format}</span>
        </div>

        {/* 포맷 선택 */}
        <label className="mb-1 block text-xs text-gray-500">포맷</label>
        <div className="mb-6 flex gap-2">
          {(["png", "jpg"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`rounded border px-3 py-1.5 text-xs font-medium transition ${
                format === f
                  ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 내보내기 버튼 */}
        <Button
          onClick={handleExport}
          disabled={exporting || !filename.trim()}
          className="flex w-full items-center justify-center gap-2"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {exporting ? "내보내는 중..." : "이미지 다운로드"}
        </Button>
      </div>
    </div>
  );
}
