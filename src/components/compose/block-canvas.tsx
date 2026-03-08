"use client";

import { type CSSProperties, forwardRef, memo, useCallback, useMemo, useRef } from "react";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { EyeOff, GripVertical, Plus, X } from "lucide-react";
import type { Block } from "@/types/blocks";
import {
  autoFixBlock,
  getBlockViolations,
  type GuardrailViolation,
  validateBlocks,
} from "@/lib/design-guardrails";
import { useCompose } from "./compose-context";
import { GuardrailIndicator } from "./guardrail-indicator";
import {
  ComparisonBlockRenderer,
  CtaBlockRenderer,
  DividerBlockRenderer,
  HeroBlockRenderer,
  ImageFullBlockRenderer,
  ImageGridBlockRenderer,
  ImageTextBlockRenderer,
  ReviewBlockRenderer,
  SellingPointBlockRenderer,
  SpecTableBlockRenderer,
  TextBlockRenderer,
  UsageStepsBlockRenderer,
  VideoBlockRenderer,
  FaqBlockRenderer,
  NoticeBlockRenderer,
  BannerStripBlockRenderer,
  PricePromoBlockRenderer,
  TrustBadgeBlockRenderer,
} from "./block-renderers";
import { WORKSPACE_CONTROL, WORKSPACE_SURFACE, WORKSPACE_TEXT } from "@/lib/workspace-surface";

interface BlockCanvasProps {
  blocks: Block[];
  selectedBlockId: string | null;
  platformWidth: number;
  mobilePreview?: boolean;
  exporting?: boolean;
  insertIndex?: number | null;
  onBlocksChange: (blocks: Block[]) => void;
  onSelectBlock: (id: string | null) => void;
  onInsertBlock: (index: number) => void;
  onUpdateBlock: (id: string, patch: Partial<Block>) => void;
}

interface SortableBlockProps {
  block: Block;
  selected: boolean;
  violations: GuardrailViolation[];
  onSelectBlock: (id: string | null) => void;
  onDeleteBlock: (id: string) => void;
  onUpdateBlock: (id: string, patch: Partial<Block>) => void;
  onAutoFixBlock: (blockId: string, violation: GuardrailViolation) => void;
}

const EMPTY_VIOLATIONS: GuardrailViolation[] = [];

function SortableBlock({
  block,
  selected,
  violations,
  onSelectBlock,
  onDeleteBlock,
  onUpdateBlock,
  onAutoFixBlock,
}: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    disabled: block.lockLayout,
  });

  const handleSelect = useCallback(() => {
    onSelectBlock(block.id);
  }, [block.id, onSelectBlock]);

  const handleDelete = useCallback(() => {
    onDeleteBlock(block.id);
  }, [block.id, onDeleteBlock]);

  const handleToggleVisibility = useCallback(() => {
    onUpdateBlock(block.id, { visible: !block.visible });
  }, [block.id, block.visible, onUpdateBlock]);

  const handleUpdate = useCallback(
    (patch: Partial<Block>) => {
      onUpdateBlock(block.id, patch);
    },
    [block.id, onUpdateBlock],
  );

  const handleAutoFix = useCallback(
    (violation: GuardrailViolation) => {
      onAutoFixBlock(block.id, violation);
    },
    [block.id, onAutoFixBlock],
  );

  const style = useMemo<CSSProperties>(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    }),
    [isDragging, transform, transition],
  );

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <div className="absolute -left-10 top-2 z-10 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          {...attributes}
          {...listeners}
          type="button"
          className={`flex h-7 w-7 items-center justify-center rounded-xl ${WORKSPACE_SURFACE.panelStrong} ${
            block.lockLayout ? "cursor-not-allowed text-gray-200" : "cursor-grab text-gray-400 hover:text-gray-600"
          }`}
          title={block.lockLayout ? "Locked block" : "Drag to reorder"}
          disabled={block.lockLayout}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleDelete();
          }}
          className={`flex h-7 w-7 items-center justify-center rounded-xl ${WORKSPACE_SURFACE.panelStrong} text-gray-400 hover:text-red-500`}
          title="Delete block"
        >
          <X className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleToggleVisibility();
          }}
          className={`flex h-7 w-7 items-center justify-center rounded-xl ${WORKSPACE_SURFACE.panelStrong} ${
            block.visible ? "text-gray-400 hover:text-gray-600" : "text-amber-500"
          }`}
          title={block.visible ? "Hide block" : "Show block"}
        >
          <EyeOff className="h-4 w-4" />
        </button>
      </div>

      <div className={!block.visible ? "opacity-40" : ""}>
        <BlockDispatch block={block} selected={selected} onSelect={handleSelect} onUpdate={handleUpdate} />
      </div>

      <GuardrailIndicator violations={violations} onAutoFix={handleAutoFix} />
    </div>
  );
}

const MemoSortableBlock = memo(SortableBlock, (prev, next) => {
  return (
    prev.block === next.block &&
    prev.selected === next.selected &&
    prev.violations === next.violations &&
    prev.onSelectBlock === next.onSelectBlock &&
    prev.onDeleteBlock === next.onDeleteBlock &&
    prev.onUpdateBlock === next.onUpdateBlock &&
    prev.onAutoFixBlock === next.onAutoFixBlock
  );
});

function BlockDispatch({
  block,
  selected,
  onSelect,
  onUpdate,
}: {
  block: Block;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<Block>) => void;
}) {
  const props = { selected, onSelect, onUpdate: onUpdate as never };

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
    case "usage-steps":
      return <UsageStepsBlockRenderer block={block} {...props} />;
    case "faq":
      return <FaqBlockRenderer block={block} {...props} />;
    case "notice":
      return <NoticeBlockRenderer block={block} {...props} />;
    case "banner-strip":
      return <BannerStripBlockRenderer block={block} {...props} />;
    case "price-promo":
      return <PricePromoBlockRenderer block={block} {...props} />;
    case "trust-badge":
      return <TrustBadgeBlockRenderer block={block} {...props} />;
    default:
      return null;
  }
}

function InsertButton({ index, active, onClick }: { index: number; active: boolean; onClick: () => void }) {
  const { isOver, setNodeRef } = useDroppable({ id: `drop-zone-${index}`, data: { type: "drop-zone", index } });

  if (active) {
    return (
      <div className="flex items-center justify-center py-2">
          <div className="flex w-full animate-pulse items-center justify-center rounded-2xl border-2 border-dashed border-[#E6B6A9] bg-[#F8E7E2]/70 py-3">
            <span className={`text-xs font-medium ${WORKSPACE_TEXT.accent}`}>블록을 여기에 넣습니다</span>
          </div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} className="group/insert flex items-center justify-center py-1">
      <div className={`w-full transition-all ${isOver ? "py-2" : ""}`}>
        {isOver ? (
          <div className="flex w-full items-center justify-center rounded-2xl border-2 border-dashed border-[#E6B6A9] bg-[#F8E7E2]/70 py-3">
            <span className={`text-xs font-medium ${WORKSPACE_TEXT.accent}`}>여기에 블록을 놓으세요</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={onClick}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-[#D5CCC3] text-[#9A8B7E] opacity-0 transition-opacity hover:border-[#D97C67] hover:text-[#D97C67] group-hover/insert:opacity-100"
              title="블록 추가"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const BlockCanvas = forwardRef<HTMLDivElement, BlockCanvasProps>(function BlockCanvas(
  {
    blocks,
    selectedBlockId,
    platformWidth,
    mobilePreview,
    exporting,
    insertIndex,
    onBlocksChange,
    onSelectBlock,
    onInsertBlock,
    onUpdateBlock,
  },
  ref,
) {
  const { theme } = useCompose();
  const blocksRef = useRef(blocks);
  const selectedBlockIdRef = useRef(selectedBlockId);
  blocksRef.current = blocks;
  selectedBlockIdRef.current = selectedBlockId;

  const violations = useMemo(() => validateBlocks(blocks), [blocks]);
  const violationsByBlockId = useMemo(() => {
    const map = new Map<string, GuardrailViolation[]>();

    for (const block of blocks) {
      const blockViolations = getBlockViolations(block.id, violations);
      map.set(block.id, blockViolations.length > 0 ? blockViolations : EMPTY_VIOLATIONS);
    }

    return map;
  }, [blocks, violations]);

  const canvasWidth = mobilePreview ? 375 : platformWidth;

  const handleAutoFix = useCallback(
    (blockId: string, violation: GuardrailViolation) => {
      const block = blocksRef.current.find((candidate) => candidate.id === blockId);
      if (!block) {
        return;
      }

      const fixedBlock = autoFixBlock(block, violation);
      if (fixedBlock !== block) {
        onUpdateBlock(blockId, fixedBlock);
      }
    },
    [onUpdateBlock],
  );

  const handleDelete = useCallback(
    (blockId: string) => {
      onBlocksChange(blocksRef.current.filter((block) => block.id !== blockId));
      if (selectedBlockIdRef.current === blockId) {
        onSelectBlock(null);
      }
    },
    [onBlocksChange, onSelectBlock],
  );

  const themeStyle = useMemo<CSSProperties | undefined>(() => {
    if (!theme) {
      return undefined;
    }

    return {
      "--theme-primary": theme.primary,
      "--theme-secondary": theme.secondary,
      "--theme-bg": theme.background,
      "--theme-text": theme.text,
      "--theme-accent": theme.accent,
      backgroundColor: theme.background,
      color: theme.text,
    } as CSSProperties;
  }, [theme]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#EFE9E1] p-8" onClick={() => onSelectBlock(null)}>
      {mobilePreview ? (
        <div className={`mx-auto mb-2 text-center text-[10px] font-medium ${WORKSPACE_TEXT.muted}`}>Mobile preview (375px)</div>
      ) : null}

      <div
        ref={ref}
        className={`mx-auto ${mobilePreview ? "overflow-hidden rounded-[2rem] border-[3px] border-[#D5CCC3] shadow-[0_20px_40px_rgba(55,40,30,0.12)]" : ""}`}
        style={{
          width: canvasWidth,
          maxWidth: "100%",
          ...themeStyle,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
          {!exporting ? <InsertButton index={0} active={insertIndex === 0} onClick={() => onInsertBlock(0)} /> : null}

          {blocks.map((block, index) => (
            <div key={block.id}>
              {exporting ? (
                <div className={!block.visible ? "hidden" : ""} data-block-id={block.id} {...(!block.visible ? { "data-hidden": true } : {})}>
                  <BlockDispatch
                    block={block}
                    selected={false}
                    onSelect={() => {}}
                    onUpdate={(patch) => onUpdateBlock(block.id, patch)}
                  />
                </div>
              ) : (
                <MemoSortableBlock
                  block={block}
                  selected={selectedBlockId === block.id}
                  violations={violationsByBlockId.get(block.id) ?? EMPTY_VIOLATIONS}
                  onSelectBlock={onSelectBlock}
                  onDeleteBlock={handleDelete}
                  onUpdateBlock={onUpdateBlock}
                  onAutoFixBlock={handleAutoFix}
                />
              )}

              {!exporting ? (
                <InsertButton index={index + 1} active={insertIndex === index + 1} onClick={() => onInsertBlock(index + 1)} />
              ) : null}
            </div>
          ))}
        </SortableContext>

        {blocks.length === 0 ? (
          <div className={`flex h-64 items-center justify-center text-center ${WORKSPACE_TEXT.muted}`}>
            <div>
              <p className="mb-2 text-lg font-medium">아직 블록이 없습니다</p>
              <p className="text-sm">왼쪽 패널에서 블록을 추가하거나 캔버스로 끌어오세요.</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
});
