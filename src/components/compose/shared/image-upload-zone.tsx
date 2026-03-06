/** ImageUploadZone - 클릭으로 이미지 업로드 또는 교체 */
"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCompose } from "../compose-context";
import { uploadAsset } from "@/lib/api-client";

interface ImageUploadZoneProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  className?: string;
  placeholderText?: string;
  aspectRatio?: string;
  objectFit?: "cover" | "contain";
}

export function ImageUploadZone({
  imageUrl,
  onImageChange,
  className = "",
  placeholderText = "클릭하여 이미지 업로드",
  aspectRatio,
  objectFit = "cover",
}: ImageUploadZoneProps) {
  const { projectId } = useCompose();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

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
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/upload:opacity-100">
            <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700">
              <Upload className="h-3.5 w-3.5" />
              이미지 교체
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-full min-h-[120px] items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-indigo-300 hover:bg-indigo-50/50">
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          ) : (
            <div className="text-center text-gray-400">
              <ImageIcon className="mx-auto mb-2 h-8 w-8" />
              <p className="text-xs">{placeholderText}</p>
            </div>
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
