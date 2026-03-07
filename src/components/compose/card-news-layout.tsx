/** 카드뉴스(정방형) 내보내기 — 블록을 1080×1080 슬라이드로 재배치 */
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
  UsageStepsBlockRenderer,
} from "./block-renderers";

interface CardNewsLayoutProps {
  blocks: Block[];
}

function CardBlockDispatch({ block }: { block: Block }) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const noop = { selected: false, onSelect: () => {}, onUpdate: (() => {}) as any };

  switch (block.type) {
    case "hero": return <HeroBlockRenderer block={block} {...noop} />;
    case "selling-point": return <SellingPointBlockRenderer block={block} {...noop} />;
    case "text-block": return <TextBlockRenderer block={block} {...noop} />;
    case "image-text": return <ImageTextBlockRenderer block={block} {...noop} />;
    case "image-full": return <ImageFullBlockRenderer block={block} {...noop} />;
    case "image-grid": return <ImageGridBlockRenderer block={block} {...noop} />;
    case "spec-table": return <SpecTableBlockRenderer block={block} {...noop} />;
    case "comparison": return <ComparisonBlockRenderer block={block} {...noop} />;
    case "review": return <ReviewBlockRenderer block={block} {...noop} />;
    case "divider": return <DividerBlockRenderer block={block} {...noop} />;
    case "video": return <VideoBlockRenderer block={block} {...noop} />;
    case "cta": return <CtaBlockRenderer block={block} {...noop} />;
    case "usage-steps": return <UsageStepsBlockRenderer block={block} {...noop} />;
  }
}

export const CardNewsLayout = forwardRef<HTMLDivElement, CardNewsLayoutProps>(
  function CardNewsLayout({ blocks }, ref) {
    const visibleBlocks = blocks.filter((b) => b.visible);

    return (
      <div ref={ref} className="flex flex-col gap-4">
        {visibleBlocks.map((block) => (
          <div
            key={block.id}
            data-card-slide={block.id}
            className="flex items-center justify-center overflow-hidden bg-white"
            style={{ width: 1080, height: 1080 }}
          >
            <div className="w-full p-12">
              <CardBlockDispatch block={block} />
            </div>
          </div>
        ))}
      </div>
    );
  },
);
