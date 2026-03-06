/** 전체 이미지 블록 — ImageUploadZone + 오버레이 */
"use client";

import type { ImageFullBlock } from "@/types/blocks";
import { ImageUploadZone, EditableText, buildFilterStyle } from "../shared";

interface Props {
  block: ImageFullBlock;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<ImageFullBlock>) => void;
  readOnly?: boolean;
}

export function ImageFullBlockRenderer({ block, selected, onSelect, onUpdate, readOnly }: Props) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg border-2 transition-colors ${selected ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`}
      onClick={onSelect}
    >
      {readOnly ? (
        block.imageUrl ? (
          <img src={block.imageUrl} alt="" className="w-full rounded object-cover" style={buildFilterStyle(block.imageFilters) ? { filter: buildFilterStyle(block.imageFilters) } : undefined} />
        ) : (
          <div className="flex h-48 items-center justify-center bg-gray-50 text-gray-400">
            <p className="text-sm">전체 이미지</p>
          </div>
        )
      ) : (
        <ImageUploadZone
          imageUrl={block.imageUrl}
          onImageChange={(url) => onUpdate({ imageUrl: url })}
          className="min-h-[192px]"
          placeholderText="전체 이미지를 업로드하세요"
          imageFilter={buildFilterStyle(block.imageFilters)}
        />
      )}

      {/* Overlays */}
      {block.overlays.map((overlay) => (
        <div
          key={overlay.id}
          className="absolute select-none"
          style={{
            left: `${overlay.x}%`,
            top: `${overlay.y}%`,
            transform: "translate(-50%, -50%)",
            fontSize: overlay.fontSize,
            color: overlay.color,
            fontWeight: overlay.fontWeight,
            textAlign: overlay.textAlign,
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            maxWidth: "80%",
          }}
        >
          <EditableText
            value={overlay.text}
            placeholder="텍스트 입력"
            onChange={(newText) => {
              onUpdate({
                overlays: block.overlays.map((o) =>
                  o.id === overlay.id ? { ...o, text: newText } : o,
                ),
              });
            }}
            tag="span"
            readOnly={readOnly}
          />
        </div>
      ))}
    </div>
  );
}
