/** 영상 블록 — VideoUploadZone (mp4/gif) + 포스터 이미지 */
"use client";

import type { VideoBlock } from "@/types/blocks";
import { VideoUploadZone, ImageUploadZone } from "../shared";

interface Props {
  block: VideoBlock;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<VideoBlock>) => void;
  readOnly?: boolean;
}

export function VideoBlockRenderer({ block, selected, onSelect, onUpdate, readOnly }: Props) {
  const mediaType = block.mediaType ?? "mp4";

  return (
    <div
      className={`w-full rounded-lg border-2 bg-white p-6 transition-colors ${selected ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`}
      onClick={onSelect}
    >
      {readOnly ? (
        block.videoUrl ? (
          mediaType === "gif" ? (
            <img src={block.videoUrl} alt="" className="w-full rounded object-cover" />
          ) : (
            <video src={block.videoUrl} poster={block.posterUrl} controls className="w-full rounded" />
          )
        ) : (
          <div className="flex h-48 items-center justify-center bg-gray-50 text-gray-400">
            <p className="text-sm">영상을 추가하세요</p>
          </div>
        )
      ) : (
        <>
          <VideoUploadZone
            videoUrl={block.videoUrl}
            posterUrl={block.posterUrl}
            onVideoChange={(url) => onUpdate({ videoUrl: url })}
            mediaType={mediaType}
          />
          {mediaType === "mp4" && block.videoUrl && (
            <div className="mt-3">
              <p className="mb-1 text-xs font-medium text-gray-500">포스터 이미지</p>
              <ImageUploadZone
                imageUrl={block.posterUrl}
                onImageChange={(url) => onUpdate({ posterUrl: url })}
                className="h-24 rounded"
                placeholderText="포스터 이미지 업로드"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
