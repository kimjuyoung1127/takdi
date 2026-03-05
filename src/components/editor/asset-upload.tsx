/** BYOI image and BGM file upload component. */
"use client";

import { useRef, useState, useCallback } from "react";
import { Music, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadAsset, uploadBgm } from "@/lib/api-client";

interface AssetUploadProps {
  projectId: string;
  onUploadComplete?: (asset: { id: string; filePath: string; type: "image" | "bgm" }) => void;
  onError?: (message: string) => void;
}

export function AssetUpload({ projectId, onUploadComplete, onError }: AssetUploadProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const bgmInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<"image" | "bgm" | null>(null);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading("image");
      try {
        const res = await uploadAsset(projectId, file, { sourceType: "uploaded" });
        onUploadComplete?.({ id: res.asset.id, filePath: res.asset.filePath, type: "image" });
      } catch (err) {
        onError?.(err instanceof Error ? err.message : "이미지 업로드 실패");
      } finally {
        setUploading(null);
        if (imageInputRef.current) imageInputRef.current.value = "";
      }
    },
    [projectId, onUploadComplete, onError],
  );

  const handleBgmUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading("bgm");
      try {
        const res = await uploadBgm(projectId, file);
        onUploadComplete?.({ id: res.asset.id, filePath: res.asset.filePath, type: "bgm" });
      } catch (err) {
        onError?.(err instanceof Error ? err.message : "BGM 업로드 실패");
      } finally {
        setUploading(null);
        if (bgmInputRef.current) bgmInputRef.current.value = "";
      }
    },
    [projectId, onUploadComplete, onError],
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Image upload */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2 text-xs"
        onClick={() => imageInputRef.current?.click()}
        disabled={uploading !== null}
      >
        {uploading === "image" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <ImageIcon className="h-3.5 w-3.5" />
        )}
        이미지 업로드
      </Button>

      {/* BGM upload */}
      <input
        ref={bgmInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleBgmUpload}
      />
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2 text-xs"
        onClick={() => bgmInputRef.current?.click()}
        disabled={uploading !== null}
      >
        {uploading === "bgm" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Music className="h-3.5 w-3.5" />
        )}
        BGM 업로드
      </Button>
    </div>
  );
}
