/** 노드 에디터 전체 쉘 — 3단 패널 + 플로팅 툴바 + 하단 로거 */
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import type { Node, Edge } from "@xyflow/react";
import { NodePalette } from "./node-palette";
import { NodeCanvas, type NodeCanvasHandle, type NodeData } from "./node-canvas";
import { FloatingToolbar } from "./floating-toolbar";
import { PropertiesPanel } from "./properties-panel";
import { BottomLogger } from "./bottom-logger";
import { useLogger } from "@/hooks/use-logger";
import {
  updateContent,
  setupPreview,
  startExport,
  pollExport,
  ApiError,
  type JobPollResponse,
} from "@/lib/api-client";
import { executePipeline } from "@/lib/pipeline-executor";
import { MODE_NODE_CONFIG, DEFAULT_MODE_CONFIG } from "@/lib/constants";

interface NodeEditorShellProps {
  projectId: string;
  projectName: string;
  mode: string;
}

type PipelineStep = "idle" | "running" | "generating" | "imaging" | "done" | "error";

export function NodeEditorShell({
  projectId,
  projectName,
  mode,
}: NodeEditorShellProps) {
  const [name, setName] = useState(projectName);
  const [editingName, setEditingName] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<NodeData | null>(null);
  const canvasRef = useRef<NodeCanvasHandle>(null);
  const [pipelineStep, setPipelineStep] = useState<PipelineStep>("idle");
  const [globalRatio, setGlobalRatio] = useState("9:16");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { logs, addLog, clearLogs } = useLogger();

  const canvasStateRef = useRef<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });
  const abortRef = useRef(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const handleStateChange = useCallback((nodes: Node[], edges: Edge[]) => {
    canvasStateRef.current = { nodes, edges };

    // Auto-save after 30s of inactivity
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      try {
        await updateContent(projectId, {
          content: JSON.stringify({ nodes, edges }),
        });
        setLastSaved(new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }));
      } catch {
        // silent — auto-save is best-effort
      }
    }, 30_000);
  }, [projectId]);

  const handleNodeSelect = useCallback((nodeId: string | null, nodeData?: NodeData) => {
    setSelectedNodeId(nodeId);
    setSelectedNodeData(nodeData ?? null);
  }, []);

  const handleNodeDataChange = useCallback((nodeId: string, patch: Partial<NodeData>) => {
    canvasRef.current?.updateNodeData(nodeId, patch);
    setSelectedNodeData((prev) => prev ? { ...prev, ...patch } : null);
  }, []);

  // --- Async poll helper (used by standalone export) ---
  async function pollUntilDone(
    pollFn: () => Promise<JobPollResponse>,
    label: string,
  ) {
    const INTERVAL = 2000;
    const MAX_POLLS = 150;
    for (let i = 0; i < MAX_POLLS; i++) {
      if (abortRef.current) throw new Error("중단됨");
      await new Promise((r) => setTimeout(r, INTERVAL));
      const res = await pollFn();
      const { status, error } = res.job;
      if (status === "done") {
        addLog(`${label} 완료`, "info");
        return res;
      }
      if (status === "failed") throw new Error(error ?? `${label} 실패`);
    }
    throw new Error(`${label} 시간 초과`);
  }

  // --- Run All: dynamic pipeline execution based on edge topology ---
  const handleRunAll = useCallback(async () => {
    if (pipelineStep === "running") return;
    abortRef.current = false;
    setPipelineStep("running");
    canvasRef.current?.resetEdgeGlow();
    clearLogs();

    try {
      const { nodes, edges } = canvasStateRef.current;

      // Extract uploadedAssetId from upload-image node (if present)
      const uploadNode = nodes.find((n) => (n.data as NodeData).nodeType === "upload-image");
      const uploadedAssetId = (uploadNode?.data as NodeData | undefined)?.uploadedAssetId as string | undefined;

      // Extract category from prompt node (if set)
      const promptNode = nodes.find((n) => (n.data as NodeData).nodeType === "prompt");
      const category = (promptNode?.data as NodeData | undefined)?.category as string | undefined;

      await executePipeline(projectId, nodes, edges, {
        onStepStart: (nodeId, label) => {
          canvasRef.current?.updateNodeData(nodeId, { status: "generating" });
          addLog(`${label}을(를) 시작합니다...`, "info");
        },
        onStepDone: (nodeId, result) => {
          const node = nodes.find((n) => n.id === nodeId);
          const nodeType = (node?.data as NodeData)?.nodeType;
          const patch: Partial<NodeData> = { status: "generated" };

          // INLINE-001: inject preview data
          if (nodeType === "prompt") {
            const content = (result as Record<string, unknown>).project as Record<string, unknown> | undefined;
            const sections = (content?.content as { sections?: { headline?: string }[] })?.sections;
            if (sections?.length) {
              patch.previewText = sections.map((s) => s.headline).filter(Boolean).slice(0, 2).join(" / ");
            }
          }
          if (nodeType === "generate-images" || nodeType === "remove-bg" || nodeType === "model-compose") {
            const assets = (result as Record<string, unknown>).assets as { filePath?: string }[] | undefined;
            if (assets?.length) {
              patch.previewImages = assets.map((a) => a.filePath).filter((p): p is string => !!p);
            }
          }

          canvasRef.current?.updateNodeData(nodeId, patch);
        },
        onStepError: (nodeId, error) => {
          canvasRef.current?.updateNodeData(nodeId, { status: "failed" });
          addLog(`오류: ${error}`, "error");
        },
        onSkip: (_nodeId, reason) => addLog(reason, "warn"),
        onEdgeActivate: (edgeId) => canvasRef.current?.setEdgeGlow(edgeId, "active"),
        onEdgeDone: (edgeId) => canvasRef.current?.setEdgeGlow(edgeId, "done"),
        shouldAbort: () => abortRef.current,
        addLog,
      }, { ratio: globalRatio, uploadedAssetId, category });

      if (!abortRef.current) {
        setPipelineStep("done");
        addLog("모든 생성이 완료되었습니다! 미리보기로 확인하세요.", "info");
        toast.success("생성 완료! 미리보기 버튼으로 결과를 확인하세요.");
      }
    } catch (err) {
      if (!abortRef.current) {
        const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : "알 수 없는 오류";
        addLog(`오류: ${msg}`, "error");
        setPipelineStep("error");
        toast.error(`생성 실패: ${msg}`);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, pipelineStep]);

  // --- Stop ---
  const handleStop = useCallback(() => {
    abortRef.current = true;
    setPipelineStep("idle");
    canvasRef.current?.resetEdgeGlow();
    addLog("사용자가 작업을 중단했습니다", "warn");
  }, [addLog]);

  // --- Save ---
  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    addLog("프로젝트를 저장하는 중...", "info");

    try {
      const { nodes, edges } = canvasStateRef.current;
      await updateContent(projectId, {
        content: JSON.stringify({ nodes, edges }),
      });
      addLog("프로젝트가 저장되었습니다", "info");
      toast.success("저장 완료");
      setLastSaved(new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "저장 실패";
      addLog(`저장 오류: ${msg}`, "error");
      toast.error(`저장 실패: ${msg}`);
    } finally {
      setSaving(false);
    }
  }, [projectId, saving, addLog]);

  // --- Preview ---
  const handlePreview = useCallback(async () => {
    addLog("미리보기를 준비하는 중...", "info");
    try {
      await setupPreview(projectId, globalRatio);
      window.open(`/projects/${projectId}/preview`, "_blank");
      addLog("미리보기가 새 탭에서 열렸습니다", "info");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "미리보기 준비 실패";
      addLog(`미리보기 오류: ${msg}`, "error");
    }
  }, [projectId, addLog]);

  // --- Export ---
  const handleExport = useCallback(async () => {
    if (exporting) return;
    setExporting(true);
    addLog("내보내기를 시작합니다...", "info");

    try {
      canvasRef.current?.updateNodesByType("export", { status: "generating" });
      const job = await startExport(projectId);
      addLog(`내보내기 작업 시작됨 (${job.jobId.slice(0, 8)}...)`, "info");

      await pollUntilDone(
        () => pollExport(projectId, job.jobId),
        "내보내기",
      );
      canvasRef.current?.updateNodesByType("export", { status: "exported" });
      addLog("내보내기가 완료되었습니다!", "info");
      toast.success("내보내기 완료!");
    } catch (err) {
      canvasRef.current?.updateNodesByType("export", { status: "failed" });
      const msg = err instanceof Error ? err.message : "내보내기 실패";
      addLog(`내보내기 오류: ${msg}`, "error");
    } finally {
      setExporting(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, exporting]);

  const isRunning = pipelineStep === "running" || pipelineStep === "generating" || pipelineStep === "imaging";

  // --- Inline project name edit ---
  const handleNameBlur = useCallback(async () => {
    setEditingName(false);
    const trimmed = name.trim();
    if (!trimmed || trimmed === projectName) {
      setName(projectName);
      return;
    }
    try {
      await updateContent(projectId, { name: trimmed });
      toast.success("프로젝트 이름이 변경되었습니다");
    } catch {
      setName(projectName);
      toast.error("이름 변경 실패");
    }
  }, [name, projectName, projectId]);

  // Cleanup auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, []);

  // --- Keyboard shortcuts ---
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Ignore when typing in inputs
      const el = e.target as HTMLElement;
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable) return;

      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleSave();
      } else if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        handleRunAll();
      } else if (e.key === "Escape" && isRunning) {
        e.preventDefault();
        handleStop();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSave, handleRunAll, handleStop, isRunning]);

  return (
    <div className="flex h-screen bg-gray-50">
      <NodePalette mode={mode} />

      <div className="relative flex-1">
        {/* Inline project name */}
        <div className="absolute left-4 top-7 z-10">
          {editingName ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") { setName(projectName); setEditingName(false); } }}
              autoFocus
              className="rounded-lg border border-indigo-300 bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-300"
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="rounded-lg px-2 py-1 text-sm font-semibold text-gray-700 transition-colors hover:bg-white hover:shadow-sm"
              title="클릭하여 프로젝트 이름 변경"
            >
              {name}
            </button>
          )}
        </div>

        <FloatingToolbar
          projectId={projectId}
          mode={mode}
          ratio={globalRatio}
          onRatioChange={setGlobalRatio}
          onRunAll={handleRunAll}
          onStop={handleStop}
          onSave={handleSave}
          onPreview={handlePreview}
          onExport={handleExport}
          runningState={{
            isRunning,
            isSaving: saving,
            isExporting: exporting,
          }}
          pipelineStep={pipelineStep}
          lastSaved={lastSaved}
        />
        <NodeCanvas
          ref={canvasRef}
          mode={mode}
          onStateChange={handleStateChange}
          onNodeSelect={handleNodeSelect}
        />
        <BottomLogger logs={logs} />
      </div>

      <PropertiesPanel
        selectedNodeId={selectedNodeId}
        selectedNodeData={selectedNodeData}
        onNodeDataChange={handleNodeDataChange}
        projectId={projectId}
        projectName={name}
        nodeCount={canvasStateRef.current.nodes.length}
        logs={logs}
      />
    </div>
  );
}
