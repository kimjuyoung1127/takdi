/** 비교 블록 — Before/After ImageUploadZone + 라벨 편집 */
"use client";

import type { ComparisonBlock } from "@/types/blocks";
import { ImageUploadZone, EditableText } from "../shared";

interface Props {
  block: ComparisonBlock;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<ComparisonBlock>) => void;
  readOnly?: boolean;
}

export function ComparisonBlockRenderer({ block, selected, onSelect, onUpdate, readOnly }: Props) {
  return (
    <div
      className={`w-full rounded-lg border-2 bg-white p-6 transition-colors ${selected ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`}
      onClick={onSelect}
    >
      <EditableText
        value={block.title}
        placeholder="비교 제목"
        onChange={(v) => onUpdate({ title: v })}
        className="mb-3 text-center text-base font-bold text-gray-900"
        tag="h3"
        readOnly={readOnly}
      />
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="mb-2 aspect-square overflow-hidden rounded">
            {readOnly ? (
              block.before.imageUrl ? (
                <img src={block.before.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-50 text-gray-300">
                  <p className="text-xs">Before</p>
                </div>
              )
            ) : (
              <ImageUploadZone
                imageUrl={block.before.imageUrl}
                onImageChange={(url) => onUpdate({ before: { ...block.before, imageUrl: url } })}
                className="h-full"
                placeholderText="Before 이미지"
              />
            )}
          </div>
          <EditableText
            value={block.before.label}
            placeholder="Before"
            onChange={(v) => onUpdate({ before: { ...block.before, label: v } })}
            className="text-sm font-medium text-gray-600"
            tag="span"
            readOnly={readOnly}
          />
        </div>
        <div className="text-center">
          <div className="mb-2 aspect-square overflow-hidden rounded">
            {readOnly ? (
              block.after.imageUrl ? (
                <img src={block.after.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-50 text-gray-300">
                  <p className="text-xs">After</p>
                </div>
              )
            ) : (
              <ImageUploadZone
                imageUrl={block.after.imageUrl}
                onImageChange={(url) => onUpdate({ after: { ...block.after, imageUrl: url } })}
                className="h-full"
                placeholderText="After 이미지"
              />
            )}
          </div>
          <EditableText
            value={block.after.label}
            placeholder="After"
            onChange={(v) => onUpdate({ after: { ...block.after, label: v } })}
            className="text-sm font-medium text-gray-600"
            tag="span"
            readOnly={readOnly}
          />
        </div>
      </div>
    </div>
  );
}
