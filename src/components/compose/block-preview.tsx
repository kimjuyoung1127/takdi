/** 블록 프리뷰 — readOnly 모드 블록 렌더링, 스크롤 프리뷰 */
"use client";

import { forwardRef } from "react";
import type { Block } from "@/types/blocks";
import { ReadOnlyBlockRenderer } from "./read-only-block-renderers";

interface BlockPreviewProps {
  blocks: Block[];
  platformWidth: number;
}

function ReadOnlyBlock({ block }: { block: Block }) {
  return <ReadOnlyBlockRenderer block={block} />;
}

export const BlockPreview = forwardRef<HTMLDivElement, BlockPreviewProps>(function BlockPreview(
  { blocks, platformWidth },
  ref,
) {
  const visibleBlocks = blocks.filter((b) => b.visible);

  return (
    <div ref={ref} className="mx-auto" style={{ width: platformWidth, maxWidth: "100%" }}>
      {visibleBlocks.map((block) => (
        <div key={block.id}>
          <ReadOnlyBlock block={block} />
        </div>
      ))}
      {visibleBlocks.length === 0 && (
        <div className="flex h-64 items-center justify-center text-center text-gray-400">
          <p>표시할 블록이 없습니다</p>
        </div>
      )}
    </div>
  );
});
