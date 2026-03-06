/** 블록 프리뷰 — readOnly 모드 블록 렌더링, 스크롤 프리뷰 */
"use client";

import { forwardRef } from "react";
import type { Block } from "@/types/blocks";
import {
  HeroBlockRenderer,
  SellingPointBlockRenderer,
  TextBlockRenderer,
  ImageTextBlockRenderer,
  ImageFullBlockRenderer,
  ImageGridBlockRenderer,
  SpecTableBlockRenderer,
  ComparisonBlockRenderer,
  ReviewBlockRenderer,
  DividerBlockRenderer,
  VideoBlockRenderer,
  CtaBlockRenderer,
} from "./block-renderers";

interface BlockPreviewProps {
  blocks: Block[];
  platformWidth: number;
}

function ReadOnlyBlock({ block }: { block: Block }) {
  const noop = () => {};
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const props = { selected: false, onSelect: noop, onUpdate: noop as any, readOnly: true };

  switch (block.type) {
    case "hero":
      return <HeroBlockRenderer block={block} {...props} />;
    case "selling-point":
      return <SellingPointBlockRenderer block={block} {...props} />;
    case "text-block":
      return <TextBlockRenderer block={block} {...props} />;
    case "image-text":
      return <ImageTextBlockRenderer block={block} {...props} />;
    case "image-full":
      return <ImageFullBlockRenderer block={block} {...props} />;
    case "image-grid":
      return <ImageGridBlockRenderer block={block} {...props} />;
    case "spec-table":
      return <SpecTableBlockRenderer block={block} {...props} />;
    case "comparison":
      return <ComparisonBlockRenderer block={block} {...props} />;
    case "review":
      return <ReviewBlockRenderer block={block} {...props} />;
    case "divider":
      return <DividerBlockRenderer block={block} {...props} />;
    case "video":
      return <VideoBlockRenderer block={block} {...props} />;
    case "cta":
      return <CtaBlockRenderer block={block} {...props} />;
  }
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
