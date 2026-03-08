"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Edge, Node } from "@xyflow/react";
import { AlertTriangle, Loader2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { FloatingToolbar } from "./floating-toolbar";
import { NodeCanvas, type NodeCanvasHandle, type NodeData } from "./node-canvas";
import { NodePalette } from "./node-palette";
import { PropertiesPanel } from "./properties-panel";
import { StepEditorWorkspace } from "./step-editor-workspace";
import { Button } from "@/components/ui/button";
import { MODE_NODE_CONFIG } from "@/lib/constants";
import {
  pollExport,
  startExport,
  updateContent,
  type JobPollResponse,
} from "@/lib/api-client";
import {
  repairEditorGraph,
  validateEditorGraph,
} from "@/lib/editor-graph";
import {
  getModeSurfaceConfig,
  getSimpleModeSteps,
  getViewModeStorageKey,
  isGuidedMode,
  type EditorViewMode,
} from "@/lib/editor-surface";
import { executePipeline } from "@/lib/pipeline-executor";

interface NodeEditorShellProps {
  projectId: string;
  projectName: string;
  mode: string;
  initialBriefText: string;
  initialGraph?: {
    nodes: Node[];
    edges: Edge[];
  } | null;
}

type PipelineStep = "idle" | "running" | "generating" | "imaging" | "done" | "error";

type CanvasSnapshot = {
  nodes: Node[];
  edges: Edge[];
};

const EMPTY_SNAPSHOT: CanvasSnapshot = { nodes: [], edges: [] };

function GuidedGraphRecoveryPanel({
  mode,
  issueMessages,
  repairStepLabels,
  onRepair,
}: {
  mode: string;
  issueMessages: string[];
  repairStepLabels: string[];
  onRepair: () => void;
}) {
  return (
    <div className="flex h-full items-center justify-center px-6 pb-6 pt-28">
      <div className="w-full max-w-3xl rounded-[32px] border border-amber-200 bg-white p-8 shadow-[0_16px_60px_rgba(15,23,42,0.08)]">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-700">구조 복구 필요</p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-950">
              {mode} 모드의 저장된 그래프가 가이드형 규칙과 맞지 않습니다.
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              이 모드는 단계형 자동화 편집기입니다. 단계 중복이나 임의 연결이 포함되면 결과가 불명확해질 수 있어
              편집과 실행을 잠시 막고 복구를 먼저 안내합니다.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">감지된 문제</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
              {issueMessages.map((message, index) => (
                <li key={`${index}-${message}`}>{message}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">복구 후 구조</p>
            <ol className="mt-4 space-y-2 text-sm text-gray-700">
              {repairStepLabels.map((label, index) => (
                <li key={label}>
                  {index + 1}. {label}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 rounded-3xl bg-indigo-50 px-5 py-4">
          <p className="text-sm text-indigo-800">기본 구조로 되돌리되, 각 단계의 첫 번째 유효 데이터는 최대한 보존합니다.</p>
          <Button type="button" onClick={onRepair} className="gap-2 rounded-full">
            <RefreshCcw className="h-4 w-4" />
            기본 구조로 복구
          </Button>
        </div>
      </div>
    </div>
  );
}

export function NodeEditorShell({
  projectId,
  projectName,
  mode,
  initialBriefText,
  initialGraph,
}: NodeEditorShellProps) {
  const surfaceConfig = getModeSurfaceConfig(mode);
  const guidedMode = isGuidedMode(mode);
  const allowSimpleMode = surfaceConfig.allowSimpleMode;

  const [name, setName] = useState(projectName);
  const [editingName, setEditingName] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [pipelineStep, setPipelineStep] = useState<PipelineStep>("idle");
  const [globalRatio, setGlobalRatio] = useState("9:16");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [projectBriefText, setProjectBriefText] = useState(initialBriefText);
  const [viewMode, setViewMode] = useState<EditorViewMode>(surfaceConfig.defaultViewMode);
  const [canvasSnapshot, setCanvasSnapshot] = useState<CanvasSnapshot>(initialGraph ?? EMPTY_SNAPSHOT);

  const canvasRef = useRef<NodeCanvasHandle>(null);
  const canvasStateRef = useRef<CanvasSnapshot>(initialGraph ?? EMPTY_SNAPSHOT);
  const briefTextRef = useRef(initialBriefText);
  const abortRef = useRef(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const effectiveViewMode: EditorViewMode = allowSimpleMode ? viewMode : "expert";
  const graphValidation = useMemo(
    () => validateEditorGraph(mode, canvasSnapshot.nodes, canvasSnapshot.edges),
    [canvasSnapshot.edges, canvasSnapshot.nodes, mode],
  );
  const guidedReadOnlyStructure = guidedMode && effectiveViewMode === "expert";
  const invalidGuidedGraph = guidedMode && !graphValidation.valid;
  const repairStepLabels = (graphValidation.repairedSnapshot?.nodes ?? []).map(
    (node) => ((node.data as NodeData).label ?? ""),
  );

  const selectedNodeData = useMemo(() => {
    if (!selectedNodeId) {
      return null;
    }
    const selectedNode = canvasSnapshot.nodes.find((node) => node.id === selectedNodeId);
    return (selectedNode?.data as NodeData | undefined) ?? null;
  }, [canvasSnapshot.nodes, selectedNodeId]);

  const setProjectBriefTextWithRef = useCallback((nextValue: string) => {
    briefTextRef.current = nextValue;
    setProjectBriefText(nextValue);
  }, []);

  const syncProjectState = useCallback(async (overrides?: { name?: string }) => {
    const payload: {
      name?: string;
      content: string;
      briefText: string;
    } = {
      content: JSON.stringify(canvasStateRef.current),
      briefText: briefTextRef.current,
    };

    if (overrides?.name) {
      payload.name = overrides.name;
    }

    await updateContent(projectId, payload);
    setLastSaved(new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }));
  }, [projectId]);

  const handleStateChange = useCallback((nodes: Node[], edges: Edge[]) => {
    const nextSnapshot = { nodes, edges };
    canvasStateRef.current = nextSnapshot;
    setCanvasSnapshot(nextSnapshot);

    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    const nextValidation = validateEditorGraph(mode, nodes, edges);
    if (guidedMode && !nextValidation.valid) {
      return;
    }

    autoSaveTimer.current = setTimeout(async () => {
      try {
        const validation = validateEditorGraph(mode, canvasStateRef.current.nodes, canvasStateRef.current.edges);
        if (guidedMode && !validation.valid) {
          return;
        }
        await syncProjectState();
      } catch {
        // Best-effort auto-save.
      }
    }, 30_000);
  }, [guidedMode, mode, syncProjectState]);

  const handleNodeSelect = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleNodeDataChange = useCallback((nodeId: string, patch: Partial<NodeData>) => {
    canvasRef.current?.updateNodeData(nodeId, patch);
  }, []);

  const pollUntilDone = useCallback(async (pollFn: () => Promise<JobPollResponse>, label: string) => {
    const interval = 2000;
    const maxPolls = 150;

    for (let index = 0; index < maxPolls; index += 1) {
      if (abortRef.current) {
        throw new Error("중단");
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
      const result = await pollFn();
      if (result.job.status === "done") {
        return result;
      }
      if (result.job.status === "failed") {
        throw new Error(result.job.error ?? `${label} 실패`);
      }
    }

    throw new Error(`${label} 시간 초과`);
  }, []);

  const ensureRunnableGraph = useCallback(() => {
    const validation = validateEditorGraph(mode, canvasStateRef.current.nodes, canvasStateRef.current.edges);
    if (guidedMode && !validation.valid) {
      toast.error("저장된 구조에 문제가 있어 먼저 복구가 필요합니다.");
      return false;
    }
    return true;
  }, [guidedMode, mode]);

  const handleRunAll = useCallback(async () => {
    if (pipelineStep === "running") {
      return;
    }
    if (!ensureRunnableGraph()) {
      return;
    }

    abortRef.current = false;
    setPipelineStep("running");
    canvasRef.current?.resetEdgeGlow();

    try {
      await syncProjectState();

      const { nodes, edges } = canvasStateRef.current;
      const uploadNode = nodes.find((node) => (node.data as NodeData).nodeType === "upload-image");
      const uploadedAssetId = (uploadNode?.data as NodeData | undefined)?.uploadedAssetId as string | undefined;
      const promptNode = nodes.find((node) => (node.data as NodeData).nodeType === "prompt");
      const category = (promptNode?.data as NodeData | undefined)?.category as string | undefined;

      await executePipeline(
        projectId,
        nodes,
        edges,
        {
          onStepStart: (nodeId) => {
            canvasRef.current?.updateNodeData(nodeId, { status: "generating" });
          },
          onStepDone: (nodeId, result) => {
            const node = nodes.find((candidate) => candidate.id === nodeId);
            const nodeType = (node?.data as NodeData | undefined)?.nodeType;
            const patch: Partial<NodeData> = { status: "generated" };

            if (nodeType === "prompt") {
              patch.previewText = briefTextRef.current.trim().slice(0, 90);
            }

            if (nodeType === "generate-images" || nodeType === "remove-bg" || nodeType === "model-compose") {
              const assets = (result as Record<string, unknown>).assets as { filePath?: string }[] | undefined;
              if (assets?.length) {
                patch.previewImages = assets
                  .map((asset) => asset.filePath)
                  .filter((path): path is string => Boolean(path));
              }
            }

            if (nodeType === "export") {
              patch.status = "exported";
            }

            canvasRef.current?.updateNodeData(nodeId, patch);
          },
          onStepError: (nodeId) => {
            canvasRef.current?.updateNodeData(nodeId, { status: "failed" });
          },
          onSkip: () => {},
          onEdgeActivate: (edgeId) => canvasRef.current?.setEdgeGlow(edgeId, "active"),
          onEdgeDone: (edgeId) => canvasRef.current?.setEdgeGlow(edgeId, "done"),
          shouldAbort: () => abortRef.current,
          addLog: () => {},
        },
        { ratio: globalRatio, uploadedAssetId, category },
      );

      if (!abortRef.current) {
        await syncProjectState();
        setPipelineStep("done");
        toast.success("작업이 완료되었습니다. 미리보기 또는 내보내기를 진행하세요.");
      }
    } catch (error) {
      if (!abortRef.current) {
        const message = error instanceof Error ? error.message : "알 수 없는 오류";
        setPipelineStep("error");
        toast.error(`실행 실패: ${message}`);
      }
    }
  }, [ensureRunnableGraph, globalRatio, pipelineStep, projectId, syncProjectState]);

  const handleStop = useCallback(() => {
    abortRef.current = true;
    setPipelineStep("idle");
    canvasRef.current?.resetEdgeGlow();
    toast("현재 작업을 중단했습니다.");
  }, []);

  const handleSave = useCallback(async () => {
    if (saving) {
      return;
    }
    if (!ensureRunnableGraph()) {
      return;
    }

    setSaving(true);
    try {
      await syncProjectState();
      toast.success("저장되었습니다.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "저장 실패";
      toast.error(`저장 실패: ${message}`);
    } finally {
      setSaving(false);
    }
  }, [ensureRunnableGraph, saving, syncProjectState]);

  const handlePreview = useCallback(() => {
    if (!ensureRunnableGraph()) {
      return;
    }

    try {
      window.open(`/projects/${projectId}/preview?templateKey=${encodeURIComponent(globalRatio)}`, "_blank");
    } catch (error) {
      const message = error instanceof Error ? error.message : "미리보기 준비 실패";
      toast.error(`미리보기 실패: ${message}`);
    }
  }, [ensureRunnableGraph, globalRatio, projectId]);

  const handleExport = useCallback(async () => {
    if (exporting) {
      return;
    }
    if (!ensureRunnableGraph()) {
      return;
    }

    setExporting(true);
    try {
      await syncProjectState();
      canvasRef.current?.updateNodesByType("export", { status: "generating" });
      const job = await startExport(projectId);
      await pollUntilDone(() => pollExport(projectId, job.jobId), "내보내기");
      canvasRef.current?.updateNodesByType("export", { status: "exported" });
      await syncProjectState();
      toast.success("내보내기가 완료되었습니다.");
    } catch (error) {
      canvasRef.current?.updateNodesByType("export", { status: "failed" });
      const message = error instanceof Error ? error.message : "내보내기 실패";
      toast.error(`내보내기 실패: ${message}`);
    } finally {
      setExporting(false);
    }
  }, [ensureRunnableGraph, exporting, pollUntilDone, projectId, syncProjectState]);

  const handleNameBlur = useCallback(async () => {
    setEditingName(false);
    const trimmed = name.trim();
    if (!trimmed || trimmed === projectName) {
      setName(projectName);
      return;
    }

    try {
      await syncProjectState({ name: trimmed });
      toast.success("프로젝트 이름이 변경되었습니다.");
    } catch {
      setName(projectName);
      toast.error("이름 변경에 실패했습니다.");
    }
  }, [name, projectName, syncProjectState]);

  const handleRecoverGraph = useCallback(async () => {
    const repairedSnapshot = repairEditorGraph(mode, canvasStateRef.current.nodes, canvasStateRef.current.edges);
    canvasStateRef.current = repairedSnapshot;
    setCanvasSnapshot(repairedSnapshot);
    canvasRef.current?.replaceGraph(repairedSnapshot);
    setSelectedNodeId(repairedSnapshot.nodes[0]?.id ?? null);

    try {
      await syncProjectState();
      toast.success("가이드형 기본 구조로 복구했습니다.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "복구 저장 실패";
      toast.error(`복구 저장 실패: ${message}`);
    }
  }, [mode, syncProjectState]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!allowSimpleMode) {
      setViewMode("expert");
      return;
    }

    const savedViewMode = window.localStorage.getItem(getViewModeStorageKey(mode));
    if (savedViewMode === "simple" || savedViewMode === "expert") {
      setViewMode(savedViewMode);
      return;
    }

    setViewMode(surfaceConfig.defaultViewMode);
  }, [allowSimpleMode, mode, surfaceConfig.defaultViewMode]);

  useEffect(() => {
    if (!allowSimpleMode || effectiveViewMode !== "simple" || invalidGuidedGraph) {
      return;
    }

    const stepTypes = getSimpleModeSteps(mode).map((step) => step.nodeType);
    const currentNodeExists = selectedNodeId
      ? canvasSnapshot.nodes.some((node) => node.id === selectedNodeId)
      : false;
    if (currentNodeExists) {
      return;
    }

    const firstStepNode = canvasSnapshot.nodes.find((node) =>
      stepTypes.includes((node.data as NodeData).nodeType as (typeof stepTypes)[number]),
    );
    if (firstStepNode) {
      setSelectedNodeId(firstStepNode.id);
    }
  }, [allowSimpleMode, canvasSnapshot.nodes, effectiveViewMode, invalidGuidedGraph, mode, selectedNodeId]);

  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable) {
        return;
      }

      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        handleSave();
      } else if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();
        handleRunAll();
      } else if (event.key === "Escape" && pipelineStep === "running") {
        event.preventDefault();
        handleStop();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleRunAll, handleSave, handleStop, pipelineStep]);

  const handleViewModeChange = useCallback((nextMode: EditorViewMode) => {
    if (!allowSimpleMode) {
      return;
    }
    setViewMode(nextMode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(getViewModeStorageKey(mode), nextMode);
    }
  }, [allowSimpleMode, mode]);

  const handleRestrictionViolation = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const isRunning = pipelineStep === "running" || pipelineStep === "generating" || pipelineStep === "imaging";
  const hiddenCanvasClassName = effectiveViewMode === "simple"
    ? "pointer-events-none absolute inset-0 opacity-0"
    : "h-full w-full";
  const issueMessages = graphValidation.issues.map((issue) => issue.message);

  return (
    <div className="flex h-screen bg-gray-50">
      {effectiveViewMode === "expert" ? <NodePalette mode={mode} disabled={guidedReadOnlyStructure} /> : null}

      <div className="relative flex-1">
        <div className="absolute left-4 top-6 z-20">
          {editingName ? (
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.currentTarget.blur();
                }
                if (event.key === "Escape") {
                  setName(projectName);
                  setEditingName(false);
                }
              }}
              autoFocus
              className="w-[min(320px,40vw)] rounded-xl border border-indigo-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditingName(true)}
              className="max-w-[min(320px,40vw)] truncate rounded-xl bg-white/90 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-white"
              title="프로젝트 이름 변경"
            >
              {name}
            </button>
          )}
        </div>

        {allowSimpleMode ? (
          <div className="absolute right-4 top-6 z-20">
            <div className="flex items-center rounded-full border border-gray-200 bg-white/95 p-1 shadow-sm backdrop-blur">
              <button
                type="button"
                onClick={() => handleViewModeChange("simple")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  effectiveViewMode === "simple"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                간단 모드
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange("expert")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  effectiveViewMode === "expert"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                전문가 모드
              </button>
            </div>
          </div>
        ) : null}

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
          actionsDisabled={invalidGuidedGraph}
        />

        {guidedReadOnlyStructure && !invalidGuidedGraph ? (
          <div className="absolute left-1/2 top-24 z-10 -translate-x-1/2 rounded-full bg-gray-900 px-4 py-2 text-xs font-medium text-white shadow-md">
            내부 구조 보기 모드입니다. 이 모드는 단계당 1개만 사용됩니다.
          </div>
        ) : null}

        <NodeCanvas
          ref={canvasRef}
          mode={mode}
          initialSnapshot={initialGraph ?? undefined}
          className={hiddenCanvasClassName}
          readOnlyStructure={guidedReadOnlyStructure || invalidGuidedGraph}
          canInsertNodes={!guidedReadOnlyStructure && !guidedMode}
          canDuplicateNodes={!guidedReadOnlyStructure && !guidedMode}
          canEditEdges={!guidedReadOnlyStructure && !guidedMode}
          onRestrictionViolation={handleRestrictionViolation}
          onStateChange={handleStateChange}
          onNodeSelect={(nodeId) => handleNodeSelect(nodeId)}
        />

        {invalidGuidedGraph ? (
          <GuidedGraphRecoveryPanel
            mode={mode}
            issueMessages={issueMessages}
            repairStepLabels={repairStepLabels}
            onRepair={handleRecoverGraph}
          />
        ) : effectiveViewMode === "simple" ? (
          <div className="h-full px-6 pb-6 pt-28">
            {canvasSnapshot.nodes.length > 0 ? (
              <StepEditorWorkspace
                mode={mode}
                nodes={canvasSnapshot.nodes}
                selectedNodeId={selectedNodeId}
                onSelectStep={handleNodeSelect}
              />
            ) : (
              <div className="flex h-full items-center justify-center rounded-[32px] border border-gray-200 bg-white shadow-[0_16px_60px_rgba(15,23,42,0.08)]">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  작업 단계를 불러오는 중입니다.
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <PropertiesPanel
        mode={mode}
        viewMode={effectiveViewMode}
        selectedNodeId={invalidGuidedGraph ? null : selectedNodeId}
        selectedNodeData={invalidGuidedGraph ? null : selectedNodeData}
        onNodeDataChange={handleNodeDataChange}
        projectId={projectId}
        projectName={name}
        nodeCount={canvasSnapshot.nodes.length}
        projectBriefText={projectBriefText}
        onProjectBriefTextChange={setProjectBriefTextWithRef}
        allowBgm={(MODE_NODE_CONFIG[mode] ?? MODE_NODE_CONFIG.freeform).allowedNodes.includes("bgm")}
      />
    </div>
  );
}
