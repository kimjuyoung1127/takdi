/** 히어로 블록 — 전체 이미지 + 텍스트 오버레이 (ImageUploadZone + EditableText) */
"use client";

import type { HeroBlock as HeroBlockType } from "@/types/blocks";
import { ImageUploadZone, EditableText } from "../shared";

interface Props {
  block: HeroBlockType;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<HeroBlockType>) => void;
  readOnly?: boolean;
}

export function HeroBlockRenderer({ block, selected, onSelect, onUpdate, readOnly }: Props) {
  return (
    <div
      className={`relative w-full cursor-pointer overflow-hidden rounded-lg border-2 transition-colors ${selected ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`}
      onClick={onSelect}
      style={{ minHeight: 300 }}
    >
      {readOnly ? (
        block.imageUrl ? (
          <img src={block.imageUrl} alt="Hero" className="h-full w-full object-cover" style={{ minHeight: 300 }} />
        ) : (
          <div className="flex h-full min-h-[300px] items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 text-gray-400">
            <p className="text-sm">히어로 이미지</p>
          </div>
        )
      ) : (
        <ImageUploadZone
          imageUrl={block.imageUrl}
          onImageChange={(url) => onUpdate({ imageUrl: url })}
          className="min-h-[300px]"
          placeholderText="히어로 이미지를 업로드하세요"
        />
      )}

      {/* Text overlays */}
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
