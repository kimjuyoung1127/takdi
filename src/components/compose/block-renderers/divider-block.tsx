/** 구분선 블록 — line/space/dot 스타일 */
"use client";

import type { DividerBlock } from "@/types/blocks";

interface Props {
  block: DividerBlock;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<DividerBlock>) => void;
  readOnly?: boolean;
}

export function DividerBlockRenderer({ block, selected, onSelect, onUpdate: _onUpdate, readOnly: _readOnly }: Props) {
  return (
    <div
      className={`w-full rounded border-2 transition-colors ${selected ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`}
      onClick={onSelect}
      style={{ height: block.height || 32 }}
    >
      {block.style === "line" && <hr className="mt-4 border-gray-200" />}
      {block.style === "dot" && (
        <div className="flex h-full items-center justify-center gap-2 text-gray-300">
          <span>&#8226;</span><span>&#8226;</span><span>&#8226;</span>
        </div>
      )}
    </div>
  );
}
