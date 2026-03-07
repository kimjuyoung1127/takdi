/** 에디터 캔버스 상단 플로팅 액션 툴바 — 단계별 가이드 + 툴팁 */
"use client";

import { Play, Square, Save, Eye, Download, Loader2, CircleCheck, LayoutPanelTop } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RunningState {
  isRunning?: boolean;
  isSaving?: boolean;
  isExporting?: boolean;
}

type PipelineStep = "idle" | "running" | "generating" | "imaging" | "done" | "error";

/** 영상/GIF 파이프라인이 없는 이미지 전용 모드 */
const IMAGE_ONLY_MODES = new Set(["brand-image", "cutout", "model-shot"]);

const RATIO_OPTIONS = ["9:16", "1:1", "16:9"];

interface FloatingToolbarProps {
  projectId?: string;
  mode?: string;
  ratio?: string;
  onRatioChange?: (ratio: string) => void;
  onRunAll?: () => void;
  onStop?: () => void;
  onSave?: () => void;
  onPreview?: () => void;
  onExport?: () => void;
  runningState?: RunningState;
  pipelineStep?: PipelineStep;
  lastSaved?: string | null;
}

const STEP_LABELS: Record<PipelineStep, string> = {
  idle: "",
  running: "파이프라인 실행 중...",
  generating: "1/2 프롬프트 처리 중...",
  imaging: "2/2 이미지 생성 중...",
  done: "생성 완료!",
  error: "오류 발생",
};

const STEP_COLORS: Record<PipelineStep, string> = {
  idle: "",
  running: "text-indigo-600 bg-indigo-50",
  generating: "text-amber-600 bg-amber-50",
  imaging: "text-blue-600 bg-blue-50",
  done: "text-emerald-600 bg-emerald-50",
  error: "text-rose-600 bg-rose-50",
};

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div className="group relative">
      {children}
      <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {text}
        <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900" />
      </div>
    </div>
  );
}

export function FloatingToolbar({ projectId, mode, ratio, onRatioChange, onRunAll, onStop, onSave, onPreview, onExport, runningState, pipelineStep = "idle", lastSaved }: FloatingToolbarProps) {
  const { isRunning, isSaving, isExporting } = runningState ?? {};
  const stepLabel = STEP_LABELS[pipelineStep];
  const isImageOnly = IMAGE_ONLY_MODES.has(mode ?? "");

  return (
    <div className="absolute left-1/2 top-6 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
      {/* Pipeline status indicator */}
      {stepLabel && (
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${STEP_COLORS[pipelineStep]}`}>
          {pipelineStep === "done" && <CircleCheck className="h-3.5 w-3.5" />}
          {(pipelineStep === "running" || pipelineStep === "generating" || pipelineStep === "imaging") && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {stepLabel}
        </div>
      )}

      {/* Toolbar buttons */}
      <div className="flex items-center gap-1 rounded-full bg-white px-4 py-2 shadow-md">
        <Tooltip text="텍스트와 이미지를 자동 생성합니다 (Ctrl+Enter)">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 rounded-full px-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            onClick={onRunAll}
            disabled={isRunning}
          >
            {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            전체 실행
          </Button>
        </Tooltip>

        <Tooltip text="진행 중인 생성 작업을 중단합니다 (Esc)">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 rounded-full px-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            onClick={onStop}
            disabled={!isRunning}
          >
            <Square className="h-4 w-4" />
            중지
          </Button>
        </Tooltip>

        <div className="mx-1 h-4 w-px bg-gray-200" />

        <Tooltip text="현재 작업 상태를 저장합니다 (Ctrl+S)">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 rounded-full px-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            저장
          </Button>
        </Tooltip>

        {!isImageOnly && (
          <Tooltip text="생성된 영상을 미리 확인합니다 (2단계)">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 rounded-full px-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              onClick={onPreview}
            >
              <Eye className="h-4 w-4" />
              미리보기
            </Button>
          </Tooltip>
        )}

        <Tooltip text="최종 파일을 내보냅니다 (3단계)">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 rounded-full px-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            onClick={onExport}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            내보내기
          </Button>
        </Tooltip>

        {projectId && (
          <>
            <div className="mx-1 h-4 w-px bg-gray-200" />
            <Tooltip text="상세페이지 편집기로 이동">
              <Link
                href={`/projects/${projectId}/compose`}
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <LayoutPanelTop className="h-4 w-4" />
                상세페이지
              </Link>
            </Tooltip>
          </>
        )}
      </div>

      {/* Ratio toggle */}
      <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-md">
        {RATIO_OPTIONS.map((r) => (
          <button
            key={r}
            onClick={() => onRatioChange?.(r)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              ratio === r
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Last saved indicator */}
      {lastSaved && (
        <span className="text-[10px] text-gray-400">
          마지막 저장: {lastSaved}
        </span>
      )}
    </div>
  );
}
