/** AssetGrid - 프로젝트 에셋 썸네일 그리드 (공용) */
"use client";

import { useState, useEffect } from "react";
import { Loader2, ImageIcon } from "lucide-react";
import { getProjectAssets, type AssetRecord } from "@/lib/api-client";

const SOURCE_LABELS: Record<string, string> = {
  uploaded: "업로드",
  "ai-generated": "AI 생성",
  cutout: "누끼",
  composed: "합성",
};

interface AssetGridProps {
  projectId: string;
  onSelect: (filePath: string) => void;
}

export function AssetGrid({ projectId, onSelect }: AssetGridProps) {
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProjectAssets(projectId)
      .then((res) => {
        if (!cancelled) setAssets(res.assets);
      })
      .catch(() => {
        if (!cancelled) setAssets([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-gray-400">
        <ImageIcon className="mx-auto mb-1 h-6 w-6" />
        아직 파일이 없습니다
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {assets
        .filter((a) => a.mimeType?.startsWith("image/"))
        .map((asset) => (
          <button
            key={asset.id}
            onClick={() => onSelect(asset.filePath)}
            className="group relative aspect-square overflow-hidden rounded border border-gray-200 hover:border-indigo-400"
          >
            <img
              src={asset.filePath}
              alt=""
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-0 left-0 right-0 bg-black/50 px-1 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
              {SOURCE_LABELS[asset.sourceType] || asset.sourceType}
            </span>
          </button>
        ))}
    </div>
  );
}
