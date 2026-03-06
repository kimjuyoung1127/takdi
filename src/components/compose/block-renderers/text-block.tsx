/** 텍스트 블록 — 제목 + 본문 (EditableText) */
"use client";

import type { TextBlockBlock } from "@/types/blocks";
import { EditableText } from "../shared";

interface Props {
  block: TextBlockBlock;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<TextBlockBlock>) => void;
  readOnly?: boolean;
}

const FONT_SIZE_CLASS: Record<string, string> = {
  sm: "text-xs",
  base: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

export function TextBlockRenderer({ block, selected, onSelect, onUpdate, readOnly }: Props) {
  const bodySizeClass = FONT_SIZE_CLASS[block.fontSize ?? "base"];

  return (
    <div
      className={`w-full rounded-lg border-2 bg-white p-6 transition-colors ${selected ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`}
      onClick={onSelect}
      style={{ textAlign: block.align }}
    >
      <EditableText
        value={block.heading}
        placeholder="제목을 입력하세요"
        onChange={(v) => onUpdate({ heading: v })}
        className="mb-3 text-xl font-bold text-gray-900"
        tag="h2"
        readOnly={readOnly}
      />
      <EditableText
        value={block.body}
        placeholder="본문을 입력하세요"
        onChange={(v) => onUpdate({ body: v })}
        className={`whitespace-pre-wrap ${bodySizeClass} leading-relaxed text-gray-600`}
        tag="p"
        readOnly={readOnly}
      />
    </div>
  );
}
