/** 블록 캔버스 — @dnd-kit 기반 세로 정렬 드래그 */
"use client";

import { useState, useCallback, forwardRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, X, EyeOff } from "lucide-react";
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

interface BlockCanvasProps {
  blocks: Block[];
  selectedBlockId: string | null;
  platformWidth: number;
  exporting?: boolean;
  onBlocksChange: (blocks: Block[]) => void;
  onSelectBlock: (id: string | null) => void;
  onInsertBlock: (index: number) => void;
  onUpdateBlock: (id: string, patch: Partial<Block>) => void;
}

function SortableBlock({
  block,
  selected,
  onSelect,
  onDelete,
  onUpdate,
}: {
  block: Block;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdate: (patch: Partial<Block>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      {/* Drag handle + controls */}
      <div className="absolute -left-10 top-2 z-10 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          {...attributes}
          {...listeners}
          className="flex h-7 w-7 cursor-grab items-center justify-center rounded bg-white text-gray-400 shadow-sm hover:text-gray-600"
          title="끌어서 순서 변경"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="flex h-7 w-7 items-center justify-center rounded bg-white text-gray-400 shadow-sm hover:text-red-500"
          title="블록 삭제"
        >
          <X className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onUpdate({ visible: !block.visible }); }}
          className={`flex h-7 w-7 items-center justify-center rounded bg-white shadow-sm ${block.visible ? "text-gray-400 hover:text-gray-600" : "text-amber-500"}`}
          title={block.visible ? "숨기기" : "표시하기"}
        >
          <EyeOff className="h-4 w-4" />
        </button>
      </div>

      {/* Block content */}
      <div className={!block.visible ? "opacity-40" : ""}>
        <BlockDispatch block={block} selected={selected} onSelect={onSelect} onUpdate={onUpdate} />
      </div>
    </div>
  );
}

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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const props = { selected, onSelect, onUpdate: onUpdate as any };

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

function InsertButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="group/insert flex items-center justify-center py-1">
      <button
        onClick={onClick}
        className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-400 opacity-0 transition-opacity hover:border-indigo-400 hover:text-indigo-500 group-hover/insert:opacity-100"
        title="블록 추가"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

export const BlockCanvas = forwardRef<HTMLDivElement, BlockCanvasProps>(function BlockCanvas(
  {
    blocks,
    selectedBlockId,
    platformWidth,
    exporting,
    onBlocksChange,
    onSelectBlock,
    onInsertBlock,
    onUpdateBlock,
  },
  ref,
) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = blocks.findIndex((b) => b.id === active.id);
        const newIndex = blocks.findIndex((b) => b.id === over.id);
        onBlocksChange(arrayMove(blocks, oldIndex, newIndex));
      }
    },
    [blocks, onBlocksChange],
  );

  const handleDelete = useCallback(
    (id: string) => {
      onBlocksChange(blocks.filter((b) => b.id !== id));
      if (selectedBlockId === id) onSelectBlock(null);
    },
    [blocks, selectedBlockId, onBlocksChange, onSelectBlock],
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 p-8" onClick={() => onSelectBlock(null)}>
      <div
        ref={ref}
        className="mx-auto"
        style={{ width: platformWidth, maxWidth: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            {!exporting && <InsertButton onClick={() => onInsertBlock(0)} />}
            {blocks.map((block, idx) => (
              <div key={block.id}>
                {exporting ? (
                  <div className={!block.visible ? "hidden" : ""}>
                    <BlockDispatch block={block} selected={false} onSelect={() => {}} onUpdate={(patch) => onUpdateBlock(block.id, patch)} />
                  </div>
                ) : (
                  <SortableBlock
                    block={block}
                    selected={selectedBlockId === block.id}
                    onSelect={() => onSelectBlock(block.id)}
                    onDelete={() => handleDelete(block.id)}
                    onUpdate={(patch) => onUpdateBlock(block.id, patch)}
                  />
                )}
                {!exporting && <InsertButton onClick={() => onInsertBlock(idx + 1)} />}
              </div>
            ))}
          </SortableContext>
        </DndContext>

        {blocks.length === 0 && (
          <div className="flex h-64 items-center justify-center text-center text-gray-400">
            <div>
              <p className="mb-2 text-lg font-medium">블록이 없습니다</p>
              <p className="text-sm">왼쪽에서 블록을 추가하세요</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
