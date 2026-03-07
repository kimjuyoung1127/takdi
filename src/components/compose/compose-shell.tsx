/** Compose 에디터 쉘 — 3패널 레이아웃 + DndContext + 자동 저장 + Ctrl+S/Z */
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Block, BlockDocument } from "@/types/blocks";
import { saveBlocks } from "@/lib/api-client";
import { PLATFORM_WIDTHS, BLOCK_TYPE_LABELS } from "@/lib/constants";
import { BlockPalette } from "./block-palette";
import { BlockCanvas } from "./block-canvas";
import { BlockPropertiesPanel } from "./block-properties-panel";
import { ComposeToolbar } from "./compose-toolbar";
import { ComposeProvider } from "./compose-context";
import { ExportDialog } from "./export-dialog";
import { BriefBuilder } from "./brief-builder";
import { validateBlocks, autoFixAllBlocks } from "@/lib/design-guardrails";
import { BLOCK_TEMPLATES } from "./block-palette";

const UNDO_COALESCE_MS = 400;

interface ComposeShellProps {
  projectId: string;
  projectName: string;
  initialDoc: BlockDocument;
}

export function ComposeShell({ projectId, projectName, initialDoc }: ComposeShellProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialDoc.blocks);
  const [platform, setPlatform] = useState(initialDoc.platform.name || "coupang");
  const [theme, setTheme] = useState(initialDoc.theme);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [draggingLabel, setDraggingLabel] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;
  const platformRef = useRef(platform);
  platformRef.current = platform;
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const undoStack = useRef<Block[][]>([]);
  const redoStack = useRef<Block[][]>([]);
  const lastUndoHashRef = useRef(JSON.stringify(initialDoc.blocks));
  const lastUndoAtRef = useRef(0);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) ?? null;

  // Build document from state
  const buildDoc = useCallback((): BlockDocument => ({
    format: "blocks",
    blocks: blocksRef.current,
    platform: { width: PLATFORM_WIDTHS[platformRef.current] ?? 780, name: platformRef.current },
    theme: themeRef.current,
    version: 1,
  }), []);

  // Save
  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      await saveBlocks(projectId, buildDoc());
      setLastSaved(new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }));
      toast.success("저장 완료");
    } catch (err) {
      toast.error(`저장 실패: ${err instanceof Error ? err.message : "알 수 없는 오류"}`);
    } finally {
      setSaving(false);
    }
  }, [projectId, saving, buildDoc]);

  // Undo support
  const pushUndo = useCallback((prev: Block[]) => {
    const nextHash = JSON.stringify(prev);
    const now = Date.now();
    if (nextHash === lastUndoHashRef.current) return;
    if (now - lastUndoAtRef.current < UNDO_COALESCE_MS) return;
    undoStack.current = [...undoStack.current.slice(-49), prev];
    redoStack.current = [];
    lastUndoHashRef.current = nextHash;
    lastUndoAtRef.current = now;
  }, []);

  const handleUndo = useCallback(() => {
    const prev = undoStack.current.pop();
    if (prev) {
      redoStack.current.push(blocksRef.current);
      lastUndoHashRef.current = "";
      setBlocks(prev);
    }
  }, []);

  const handleRedo = useCallback(() => {
    const next = redoStack.current.pop();
    if (next) {
      undoStack.current.push(blocksRef.current);
      lastUndoHashRef.current = "";
      setBlocks(next);
    }
  }, []);

  // Block operations
  const handleBlocksChange = useCallback((newBlocks: Block[]) => {
    pushUndo(blocksRef.current);
    setBlocks(newBlocks);
  }, [pushUndo]);

  const handleUpdateBlock = useCallback((id: string, patch: Partial<Block>) => {
    pushUndo(blocksRef.current);
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } as Block : b)),
    );
  }, [pushUndo]);

  const handleAddBlock = useCallback((block: Block) => {
    pushUndo(blocksRef.current);
    if (insertIndex !== null) {
      setBlocks((prev) => {
        const next = [...prev];
        next.splice(insertIndex, 0, block);
        return next;
      });
      setInsertIndex(null);
    } else {
      setBlocks((prev) => [...prev, block]);
    }
    setSelectedBlockId(block.id);
  }, [insertIndex, pushUndo]);

  const handleInsertBlock = useCallback((index: number) => {
    setInsertIndex(index);
  }, []);

  // Platform change
  const handlePlatformChange = useCallback((name: string) => {
    setPlatform(name);
  }, []);

  // Preview
  const handlePreview = useCallback(() => {
    // Save first, then open preview
    saveBlocks(projectId, buildDoc()).then(() => {
      window.open(`/projects/${projectId}/result`, "_blank");
    }).catch(() => {
      toast.error("저장 실패 — 미리보기를 열 수 없습니다");
    });
  }, [projectId, buildDoc]);

  // Design check
  const handleDesignCheck = useCallback(() => {
    const violations = validateBlocks(blocks);
    if (violations.length === 0) {
      toast.success("디자인 검증 통과! 문제가 발견되지 않았습니다");
    } else {
      toast.warning(`${violations.length}개 디자인 개선 사항이 있습니다. 블록 우측 경고 아이콘을 확인하세요`);
    }
  }, [blocks]);

  // Auto-fix all
  const handleAutoFixAll = useCallback(() => {
    const createCta = () => BLOCK_TEMPLATES.find((t) => t.type === "cta")!.create();
    const { blocks: fixed, fixCount } = autoFixAllBlocks(blocks, createCta);
    if (fixCount === 0) {
      toast.success("수정할 항목이 없습니다");
    } else {
      pushUndo(blocksRef.current);
      setBlocks(fixed);
      toast.success(`${fixCount}개 항목을 자동 수정했습니다`);
    }
  }, [blocks, pushUndo]);

  // Export
  const handleExport = useCallback(() => {
    setExportOpen(true);
  }, []);

  // Template apply (no API call — instant block placement)
  const handleApplyTemplate = useCallback((newBlocks: Block[], newTheme?: import("@/types/blocks").ThemePalette) => {
    pushUndo(blocksRef.current);
    setBlocks(newBlocks);
    if (newTheme) {
      setTheme(newTheme);
    }
    toast.success(`${newBlocks.length}개 블록 템플릿 배치 완료`);
  }, [pushUndo]);

  // DnD handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.type === "palette-item") {
      const blockType = data.blockType as string;
      setDraggingLabel(BLOCK_TYPE_LABELS[blockType as keyof typeof BLOCK_TYPE_LABELS] ?? blockType);
    } else {
      // Existing block being reordered
      const block = blocksRef.current.find((b) => b.id === event.active.id);
      if (block) {
        setDraggingLabel(BLOCK_TYPE_LABELS[block.type] ?? block.type);
      }
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setDraggingLabel(null);
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;

    // Palette item dropped onto canvas
    if (activeData?.type === "palette-item") {
      const create = activeData.create as () => Block;
      const overData = over.data.current;
      const newBlock = create();
      pushUndo(blocksRef.current);

      if (overData?.type === "drop-zone") {
        const dropIndex = overData.index as number;
        setBlocks((prev) => {
          const next = [...prev];
          next.splice(dropIndex, 0, newBlock);
          return next;
        });
      } else {
        // Dropped onto a block — insert after it
        const overIndex = blocksRef.current.findIndex((b) => b.id === over.id);
        if (overIndex >= 0) {
          setBlocks((prev) => {
            const next = [...prev];
            next.splice(overIndex + 1, 0, newBlock);
            return next;
          });
        } else {
          setBlocks((prev) => [...prev, newBlock]);
        }
      }
      setSelectedBlockId(newBlock.id);
      setInsertIndex(null);
      return;
    }

    // Existing block reorder
    if (over && active.id !== over.id) {
      const overData = over.data.current;
      if (overData?.type === "drop-zone") {
        // Dropped on a drop zone
        const dropIndex = overData.index as number;
        const oldIndex = blocksRef.current.findIndex((b) => b.id === active.id);
        if (oldIndex >= 0) {
          pushUndo(blocksRef.current);
          setBlocks((prev) => {
            const next = [...prev];
            const [removed] = next.splice(oldIndex, 1);
            const insertAt = dropIndex > oldIndex ? dropIndex - 1 : dropIndex;
            next.splice(insertAt, 0, removed);
            return next;
          });
        }
      } else {
        const oldIndex = blocksRef.current.findIndex((b) => b.id === active.id);
        const newIndex = blocksRef.current.findIndex((b) => b.id === over.id);
        if (oldIndex >= 0 && newIndex >= 0) {
          pushUndo(blocksRef.current);
          setBlocks((prev) => arrayMove(prev, oldIndex, newIndex));
        }
      }
    }
  }, [pushUndo]);

  // Auto-save 30s
  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      try {
        await saveBlocks(projectId, buildDoc());
        setLastSaved(new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }));
      } catch {
        toast.error("자동 저장에 실패했습니다", { id: "autosave-fail" });
      }
    }, 30_000);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [blocks, projectId, buildDoc]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const el = e.target as HTMLElement;
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable) return;

      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleSave();
      } else if (e.ctrlKey && e.shiftKey && e.key === "Z") {
        e.preventDefault();
        handleRedo();
      } else if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        handleUndo();
      } else if (e.key === "Escape") {
        if (insertIndex !== null) {
          e.preventDefault();
          setInsertIndex(null);
        }
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedBlockId) {
          e.preventDefault();
          handleBlocksChange(blocks.filter((b) => b.id !== selectedBlockId));
          setSelectedBlockId(null);
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSave, handleUndo, handleRedo, selectedBlockId, blocks, handleBlocksChange, insertIndex]);

  return (
    <ComposeProvider projectId={projectId} theme={theme}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-screen flex-col bg-gray-50">
          <ComposeToolbar
            projectId={projectId}
            projectName={projectName}
            platformName={platform}
            onPlatformChange={handlePlatformChange}
            onSave={handleSave}
            onPreview={handlePreview}
            onExport={handleExport}
            onAiGenerate={() => setBriefOpen(true)}
            onDesignCheck={handleDesignCheck}
            onAutoFixAll={handleAutoFixAll}
            mobilePreview={mobilePreview}
            onMobilePreviewToggle={() => setMobilePreview((p) => !p)}
            isSaving={saving}
            lastSaved={lastSaved}
            theme={theme}
            onThemeChange={setTheme}
          />

          <div className="flex flex-1 overflow-hidden">
            <BlockPalette onAddBlock={handleAddBlock} />

            <BlockCanvas
              ref={canvasRef}
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              platformWidth={PLATFORM_WIDTHS[platform] ?? 780}
              mobilePreview={mobilePreview}
              exporting={exportOpen}
              insertIndex={insertIndex}
              onBlocksChange={handleBlocksChange}
              onSelectBlock={setSelectedBlockId}
              onInsertBlock={handleInsertBlock}
              onUpdateBlock={handleUpdateBlock}
            />

            <BlockPropertiesPanel
              block={selectedBlock}
              onUpdate={handleUpdateBlock}
            />
          </div>
        </div>

        <DragOverlay>
          {draggingLabel ? (
            <div className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-4 py-2 shadow-lg">
              <span className="text-sm font-medium text-indigo-600">{draggingLabel}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        projectName={projectName}
        platformName={platform}
        captureRef={canvasRef}
        platformWidth={PLATFORM_WIDTHS[platform] ?? 780}
        blocks={blocks}
      />
      <BriefBuilder
        open={briefOpen}
        onClose={() => setBriefOpen(false)}
        onApplyTemplate={handleApplyTemplate}
      />
    </ComposeProvider>
  );
}
