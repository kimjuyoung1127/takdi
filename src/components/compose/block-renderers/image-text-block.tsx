/** 이미지+텍스트 블록 — 좌/우 이미지와 텍스트 */
"use client";

import type { ImageTextBlock as ImageTextBlockType } from "@/types/blocks";
import { ImageIcon } from "lucide-react";

interface Props {
  block: ImageTextBlockType;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<ImageTextBlockType>) => void;
  readOnly?: boolean;
}

export function ImageTextBlockRenderer({ block, selected, onSelect, onUpdate, readOnly }: Props) {
  const imgSide = (
    <div className="flex aspect-square w-1/2 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
      {block.imageUrl ? (
        <img src={block.imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="text-center text-gray-400">
          <ImageIcon className="mx-auto mb-1 h-8 w-8" />
          <p className="text-xs">이미지</p>
        </div>
      )}
    </div>
  );

  const textSide = (
    <div className="flex w-1/2 flex-col justify-center p-4">
      {readOnly ? (
        <>
          <h3 className="mb-2 text-lg font-bold text-gray-900">{block.heading}</h3>
          <p className="text-sm leading-relaxed text-gray-600">{block.body}</p>
        </>
      ) : (
        <>
          <h3
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ heading: e.currentTarget.textContent ?? "" })}
            className="mb-2 text-lg font-bold text-gray-900 outline-none"
          >
            {block.heading}
          </h3>
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ body: e.currentTarget.textContent ?? "" })}
            className="text-sm leading-relaxed text-gray-600 outline-none"
          >
            {block.body}
          </p>
        </>
      )}
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
