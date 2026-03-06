/** Compose 에디터 쉘 — 3패널 레이아웃 + 자동 저장 + Ctrl+S/Z */
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import type { Block, BlockDocument } from "@/types/blocks";
import { saveBlocks } from "@/lib/api-client";
import { PLATFORM_WIDTHS } from "@/lib/constants";
import { BlockPalette } from "./block-palette";
import { BlockCanvas } from "./block-canvas";
import { BlockPropertiesPanel } from "./block-properties-panel";
import { ComposeToolbar } from "./compose-toolbar";
import { ComposeProvider } from "./compose-context";
import { ExportDialog } from "./export-dialog";

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
  const canvasRef = useRef<HTMLDivElement>(null);

  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;
  const platformRef = useRef(platform);
  platformRef.current = platform;
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const undoStack = useRef<Block[][]>([]);
  const redoStack = useRef<Block[][]>([]);

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
    undoStack.current = [...undoStack.current.slice(-49), prev];
    redoStack.current = [];
  }, []);

  const handleUndo = useCallback(() => {
    const prev = undoStack.current.pop();
    if (prev) {
      redoStack.current.push(blocksRef.current);
      setBlocks(prev);
    }
  }, []);

  const handleRedo = useCallback(() => {
    const next = redoStack.current.pop();
    if (next) {
      undoStack.current.push(blocksRef.current);
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

  // Export
  const handleExport = useCallback(() => {
    setExportOpen(true);
  }, []);

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
  }, [handleSave, handleUndo, handleRedo, selectedBlockId, blocks, handleBlocksChange]);

  return (
    <ComposeProvider projectId={projectId} theme={theme}>
      <div className="flex h-screen flex-col bg-gray-50">
        <ComposeToolbar
          projectId={projectId}
          projectName={projectName}
          platformName={platform}
          onPlatformChange={handlePlatformChange}
          onSave={handleSave}
          onPreview={handlePreview}
          onExport={handleExport}
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
            exporting={exportOpen}
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
      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        projectName={projectName}
        platformName={platform}
        captureRef={canvasRef}
        platformWidth={PLATFORM_WIDTHS[platform] ?? 780}
      />
    </ComposeProvider>
  );
}
