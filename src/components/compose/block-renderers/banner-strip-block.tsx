/** 띠배너 블록 — 전체폭 배경색 + 텍스트 강조 */
"use client";

import type { BannerStripBlock } from "@/types/blocks";
import { EditableText } from "../shared";

interface Props {
  block: BannerStripBlock;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<BannerStripBlock>) => void;
  readOnly?: boolean;
}

export function BannerStripBlockRenderer({ block, selected, onSelect, onUpdate, readOnly }: Props) {
  const bgColor = block.bgColor || "#4f46e5";
  const textColor = block.textColor || "#ffffff";

  return (
    <div
      className={`w-full rounded-lg border-2 transition-colors ${selected ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`}
      onClick={onSelect}
    >
      <div
        className="px-6 py-4 text-center"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <EditableText
          value={block.text}
          placeholder="무료배송 | 오늘만 특가"
          onChange={(v) => onUpdate({ text: v })}
          className="text-base font-bold"
          style={{ color: textColor }}
          tag="p"
          readOnly={readOnly}
        />
        {(block.subtext || !readOnly) && (
          <EditableText
            value={block.subtext ?? ""}
            placeholder="보조 문구를 입력하세요"
            onChange={(v) => onUpdate({ subtext: v })}
            className="mt-1 text-xs opacity-80"
            style={{ color: textColor }}
            tag="p"
            readOnly={readOnly}
          />
        )}
      </div>
    </div>
  );
}
