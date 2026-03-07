/** 이미지 그리드 블록 — 셀별 ImageUploadZone + 캡션 편집 + 추가/삭제 */
"use client";

import type { ImageGridBlock } from "@/types/blocks";
import { X, Plus } from "lucide-react";
import { ImageUploadZone, EditableText, buildFilterStyle } from "../shared";

interface Props {
  block: ImageGridBlock;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<ImageGridBlock>) => void;
  readOnly?: boolean;
}

export function ImageGridBlockRenderer({ block, selected, onSelect, onUpdate, readOnly }: Props) {
  const maxCells = block.columns * 2;
  const images = block.images.length > 0 ? block.images : [];
  const shapeClass = block.shape === "circle" ? "rounded-full" : block.shape === "rounded" ? "rounded-xl" : "rounded";

  const updateImage = (index: number, patch: Partial<{ url: string; caption: string }>) => {
    const next = images.map((img, i) => (i === index ? { ...img, ...patch } : img));
    onUpdate({ images: next });
  };

  const deleteImage = (index: number) => {
    onUpdate({ images: images.filter((_, i) => i !== index) });
  };

  const addImage = () => {
    if (images.length >= maxCells) return;
    onUpdate({ images: [...images, { url: "", caption: "" }] });
  };

  return (
    <div
      className={`w-full rounded-lg border-2 bg-white p-6 transition-colors ${selected ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`}
      onClick={onSelect}
    >
      <div className={`grid gap-2 ${block.columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {images.map((img, i) => (
          <div key={i} className="group/cell relative">
            {!readOnly && (
              <button
                onClick={(e) => { e.stopPropagation(); deleteImage(i); }}
                className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500 opacity-0 transition-opacity group-hover/cell:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            <div className={`aspect-square overflow-hidden ${shapeClass}`}>
              {readOnly ? (
                img.url ? (
                  <img src={img.url} alt={img.caption} className="h-full w-full object-cover" style={buildFilterStyle(block.imageFilters) ? { filter: buildFilterStyle(block.imageFilters) } : undefined} />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-100 text-gray-300">
                    <p className="text-xs">이미지</p>
                  </div>
                )
              ) : (
                <ImageUploadZone
                  imageUrl={img.url}
                  onImageChange={(url) => updateImage(i, { url })}
                  className="h-full"
                  placeholderText="이미지"
                  imageFilter={buildFilterStyle(block.imageFilters)}
                />
              )}
            </div>
            <EditableText
              value={img.caption}
              placeholder="캡션"
              onChange={(v) => updateImage(i, { caption: v })}
              className="mt-1 text-center text-xs text-gray-500"
              tag="p"
              readOnly={readOnly}
            />
          </div>
        ))}

        {!readOnly && images.length < maxCells && (
          <button
            onClick={(e) => { e.stopPropagation(); addImage(); }}
            className="flex aspect-square items-center justify-center rounded border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-indigo-300 hover:text-indigo-500"
          >
            <Plus className="h-6 w-6" />
          </button>
        )}

        {/* Empty placeholders for read-only with no images */}
        {readOnly && images.length === 0 &&
          Array.from({ length: block.columns * 2 }).map((_, i) => (
            <div key={i} className="flex aspect-square items-center justify-center rounded bg-gray-50 text-gray-300">
              <p className="text-xs">이미지</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}
