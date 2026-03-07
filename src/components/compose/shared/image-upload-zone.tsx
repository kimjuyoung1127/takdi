/** ImageUploadZone - 클릭으로 이미지 업로드 또는 프로젝트 에셋 선택 */
"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, ImageIcon, Loader2, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { useCompose } from "../compose-context";
import { uploadAsset } from "@/lib/api-client";
import { AssetGrid } from "./asset-grid";

interface ImageUploadZoneProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  className?: string;
  placeholderText?: string;
  aspectRatio?: string;
  objectFit?: "cover" | "contain";
  imageFilter?: string;
}

export function ImageUploadZone({
  imageUrl,
  onImageChange,
  className = "",
  placeholderText = "클릭하여 이미지 업로드",
  aspectRatio,
  objectFit = "cover",
  imageFilter,
}: ImageUploadZoneProps) {
  const { projectId } = useCompose();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showAssets, setShowAssets] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    fileRef.current?.click();
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const result = await uploadAsset(projectId, file, { sourceType: "uploaded" });
        onImageChange(result.asset.filePath);
      } catch {
        toast.error("이미지 업로드에 실패했습니다");
      } finally {
        setUploading(false);
      }
    },
    [projectId, onImageChange],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      if (fileRef.current) fileRef.current.value = "";
    },
    [handleFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("image/")) handleFile(file);
    },
    [handleFile],
  );

  const handleAssetSelect = useCallback(
    (filePath: string) => {
      onImageChange(filePath);
      setShowAssets(false);
    },
    [onImageChange],
  );

  if (showAssets) {
    return (
      <div
        className={`overflow-hidden rounded border border-gray-200 bg-white ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
          <span className="text-xs font-medium text-gray-600">프로젝트 파일</span>
          <button
            onClick={() => setShowAssets(false)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            닫기
          </button>
        </div>
        <div className="max-h-[240px] overflow-y-auto p-2">
          <AssetGrid projectId={projectId} onSelect={handleAssetSelect} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group/upload relative cursor-pointer overflow-hidden ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt=""
            className={`h-full w-full ${objectFit === "contain" ? "object-contain" : "object-cover"}`}
            style={imageFilter ? { filter: imageFilter } : undefined}
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover/upload:opacity-100">
            <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700">
              <Upload className="h-3.5 w-3.5" />
              이미지 교체
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setShowAssets(true); }}
              className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              프로젝트 파일
            </button>
          </div>
        </>
      ) : (
        <div className="flex h-full min-h-[120px] flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-indigo-300 hover:bg-indigo-50/50">
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          ) : (
            <>
              <button
                onClick={handleClick}
                className="flex flex-col items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-5 py-3 text-indigo-600 transition-colors hover:bg-indigo-100"
              >
                <Upload className="h-6 w-6" />
                <span className="text-sm font-medium">이미지 업로드</span>
              </button>
              <p className="mt-2 text-[11px] text-gray-400">또는 파일을 끌어다 놓으세요</p>
              <button
                onClick={(e) => { e.stopPropagation(); setShowAssets(true); }}
                className="mt-2 flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              >
                <FolderOpen className="h-3 w-3" />
                프로젝트 파일에서 선택
              </button>
            </>
          )}
        </div>
      )}

      {uploading && imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
    </div>
  );
}
