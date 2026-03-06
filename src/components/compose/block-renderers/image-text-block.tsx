/** 이미지+텍스트 블록 — ImageUploadZone + EditableText */
"use client";

import type { ImageTextBlock as ImageTextBlockType } from "@/types/blocks";
import { ImageUploadZone, EditableText } from "../shared";

interface Props {
  block: ImageTextBlockType;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<ImageTextBlockType>) => void;
  readOnly?: boolean;
}

export function ImageTextBlockRenderer({ block, selected, onSelect, onUpdate, readOnly }: Props) {
  const imgSide = readOnly ? (
    <div className="flex aspect-square w-1/2 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
      {block.imageUrl ? (
        <img src={block.imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="text-center text-gray-400">
          <p className="text-xs">이미지</p>
        </div>
      )}
    </div>
  ) : (
    <div className="w-1/2 overflow-hidden rounded-lg">
      <ImageUploadZone
        imageUrl={block.imageUrl}
        onImageChange={(url) => onUpdate({ imageUrl: url })}
        className="aspect-square"
        placeholderText="이미지 업로드"
      />
    </div>
  );

  const textSide = (
    <div className="flex w-1/2 flex-col justify-center p-4">
      <EditableText
        value={block.heading}
        placeholder="제목을 입력하세요"
        onChange={(v) => onUpdate({ heading: v })}
        className="mb-2 text-lg font-bold text-gray-900"
        tag="h3"
        readOnly={readOnly}
      />
      <EditableText
        value={block.body}
        placeholder="설명을 입력하세요"
        onChange={(v) => onUpdate({ body: v })}
        className="text-sm leading-relaxed text-gray-600"
        tag="p"
        readOnly={readOnly}
      />
    </div>
  );

  return (
    <div
      className={`flex w-full gap-4 rounded-lg border-2 bg-white p-4 transition-colors ${selected ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`}
      onClick={onSelect}
    >
      {block.imagePosition === "left" ? (
        <>
          {imgSide}
          {textSide}
        </>
      ) : (
        <>
          {textSide}
          {imgSide}
        </>
      )}
    </div>
  );
}
