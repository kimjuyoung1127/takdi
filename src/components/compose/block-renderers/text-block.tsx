/** 텍스트 블록 — 제목 + 본문 텍스트 */
"use client";

import type { TextBlockBlock } from "@/types/blocks";

interface Props {
  block: TextBlockBlock;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<TextBlockBlock>) => void;
  readOnly?: boolean;
}

export function TextBlockRenderer({ block, selected, onSelect, onUpdate, readOnly }: Props) {
  return (
    <div
      className={`w-full rounded-lg border-2 bg-white p-6 transition-colors ${selected ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`}
      onClick={onSelect}
      style={{ textAlign: block.align }}
    >
      {readOnly ? (
        <>
          {block.heading && <h2 className="mb-3 text-xl font-bold text-gray-900">{block.heading}</h2>}
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{block.body}</p>
        </>
      ) : (
        <>
          <h2
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ heading: e.currentTarget.textContent ?? "" })}
            className="mb-3 text-xl font-bold text-gray-900 outline-none"
            data-placeholder="제목을 입력하세요"
          >
            {block.heading}
          </h2>
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ body: e.currentTarget.textContent ?? "" })}
            className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600 outline-none"
            data-placeholder="본문을 입력하세요"
          >
            {block.body}
          </p>
        </>
      )}
    </div>
  );
}
