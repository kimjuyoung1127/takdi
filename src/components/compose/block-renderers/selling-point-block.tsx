/** 셀링포인트 블록 — 아이콘 + 제목 + 설명 1~3개 */
"use client";

import type { SellingPointBlock as SellingPointBlockType } from "@/types/blocks";
import { Star, Zap, Shield, Heart } from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  star: <Star className="h-6 w-6" />,
  zap: <Zap className="h-6 w-6" />,
  shield: <Shield className="h-6 w-6" />,
  heart: <Heart className="h-6 w-6" />,
};

interface Props {
  block: SellingPointBlockType;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<SellingPointBlockType>) => void;
  readOnly?: boolean;
}

export function SellingPointBlockRenderer({ block, selected, onSelect, onUpdate, readOnly }: Props) {
  const updateItem = (index: number, patch: Partial<SellingPointBlockType["items"][0]>) => {
    const items = block.items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onUpdate({ items });
  };

  return (
    <div
      className={`w-full rounded-lg border-2 bg-white p-6 transition-colors ${selected ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`}
      onClick={onSelect}
    >
      <div className={`grid gap-6 ${block.items.length === 1 ? "grid-cols-1" : block.items.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {block.items.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              {ICON_MAP[item.icon] ?? <Star className="h-6 w-6" />}
            </div>
            {readOnly ? (
              <>
                <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </>
            ) : (
              <>
                <h3
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateItem(idx, { title: e.currentTarget.textContent ?? "" })}
                  className="text-base font-bold text-gray-900 outline-none"
                >
                  {item.title}
                </h3>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateItem(idx, { description: e.currentTarget.textContent ?? "" })}
                  className="text-sm text-gray-500 outline-none"
                >
                  {item.description}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
