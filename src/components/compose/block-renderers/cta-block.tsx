/** CTA 블록 — EditableText + 스타일 프리셋 4종 */
"use client";

import type { CtaBlock } from "@/types/blocks";
import { EditableText } from "../shared";

interface Props {
  block: CtaBlock;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<CtaBlock>) => void;
  readOnly?: boolean;
}

const STYLE_CONFIG = {
  default: { bg: "bg-white", text: "text-gray-900", sub: "text-gray-500", btn: "bg-indigo-600 text-white" },
  gradient: { bg: "bg-gradient-to-r from-indigo-500 to-purple-600", text: "text-white", sub: "text-white/80", btn: "bg-white text-indigo-600" },
  dark: { bg: "bg-gray-900", text: "text-white", sub: "text-gray-400", btn: "bg-indigo-500 text-white" },
  minimal: { bg: "bg-gray-50", text: "text-gray-900", sub: "text-gray-500", btn: "border border-gray-900 bg-transparent text-gray-900" },
};

export function CtaBlockRenderer({ block, selected, onSelect, onUpdate, readOnly }: Props) {
  const ctaStyle = block.ctaStyle ?? "default";
  const config = STYLE_CONFIG[ctaStyle];
  const customBg = block.bgColor ? { backgroundColor: block.bgColor } : undefined;
  const customBtnColor = block.buttonColor ? { backgroundColor: block.buttonColor } : undefined;

  return (
    <div
      className={`w-full overflow-hidden rounded-lg border-2 transition-colors ${selected ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`}
      onClick={onSelect}
    >
      <div className={`py-8 text-center ${customBg ? "" : config.bg}`} style={customBg}>
        <EditableText
          value={block.text}
          placeholder="지금 바로 시작하세요"
          onChange={(v) => onUpdate({ text: v })}
          className={`mb-2 text-xl font-bold ${config.text}`}
          tag="h3"
          readOnly={readOnly}
        />
        <EditableText
          value={block.subtext}
          placeholder="보조 문구"
          onChange={(v) => onUpdate({ subtext: v })}
          className={`mb-4 text-sm ${config.sub}`}
          tag="p"
          readOnly={readOnly}
        />
        <button
          className={`rounded-full px-8 py-3 text-sm font-semibold ${customBtnColor ? "" : config.btn}`}
          style={customBtnColor}
          onClick={(e) => e.stopPropagation()}
        >
          {readOnly ? (
            block.buttonLabel || "구매하기"
          ) : (
            <EditableText
              value={block.buttonLabel}
              placeholder="구매하기"
              onChange={(v) => onUpdate({ buttonLabel: v })}
              className="inline"
              tag="span"
            />
          )}
        </button>
      </div>
    </div>
  );
}
