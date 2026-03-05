/** 노드 에디터 전체 쉘 — 3단 패널 + 플로팅 툴바 + 하단 로거 */
"use client";

import { useState, useCallback } from "react";
import { NodePalette } from "./node-palette";
import { NodeCanvas } from "./node-canvas";
import { FloatingToolbar } from "./floating-toolbar";
import { PropertiesPanel } from "./properties-panel";
import { BottomLogger } from "./bottom-logger";

interface NodeEditorShellProps {
  projectId: string;
  projectName: string;
}

export function NodeEditorShell({
  projectId,
  projectName,
}: NodeEditorShellProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleRunAll = useCallback(() => {
    console.log("Run all nodes for project:", projectId);
  }, [projectId]);

  const handleSave = useCallback(() => {
    console.log("Save project:", projectId);
  }, [projectId]);

  const handlePreview = useCallback(() => {
    window.open(`/projects/${projectId}/preview`, "_blank");
  }, [projectId]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left: Node Palette */}
      <NodePalette />

      {/* Center: Canvas + Toolbar + Logger */}
      <div className="relative flex-1">
        <FloatingToolbar
          onRunAll={handleRunAll}
          onSave={handleSave}
          onPreview={handlePreview}
        />
        <NodeCanvas />
        <BottomLogger />
      </div>

      {/* Right: Properties Panel */}
      <PropertiesPanel selectedNodeId={selectedNodeId} />
    </div>
  );
}
