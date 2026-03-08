/** Editor top floating action toolbar for run/save/preview/export controls. */
"use client";

import { Play, Square, Save, Eye, Download, Loader2, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WORKSPACE_CONTROL, WORKSPACE_SURFACE, WORKSPACE_TEXT } from "@/lib/workspace-surface";

interface RunningState {
  isRunning?: boolean;
  isSaving?: boolean;
  isExporting?: boolean;
}

type PipelineStep = "idle" | "running" | "generating" | "imaging" | "done" | "error";

const IMAGE_ONLY_MODES = new Set(["brand-image", "cutout", "model-shot"]);
const RATIO_OPTIONS = ["9:16", "1:1", "16:9"];

interface FloatingToolbarProps {
  mode?: string;
  ratio?: string;
  helperText?: string | null;
  onRatioChange?: (ratio: string) => void;
  onRunAll?: () => void;
  onStop?: () => void;
  onSave?: () => void;
  onPreview?: () => void;
  onExport?: () => void;
  runningState?: RunningState;
  pipelineStep?: PipelineStep;
  lastSaved?: string | null;
  actionsDisabled?: boolean;
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
  running: "bg-[#F8E7E2] text-[#D97C67]",
  generating: "bg-[#F7EFE5] text-[#B8794E]",
  imaging: "bg-[#EEF3ED] text-[#627B69]",
  done: "bg-[#EEF3ED] text-[#627B69]",
  error: "bg-[#F8E3E0] text-[#B45A52]",
};

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div className="group relative">
      {children}
      <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-[#2A2522] px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {text}
        <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#2A2522]" />
      </div>
    </div>
  );
}

export function FloatingToolbar({
  mode,
  ratio,
  helperText,
  onRatioChange,
  onRunAll,
  onStop,
  onSave,
  onPreview,
  onExport,
  runningState,
  pipelineStep = "idle",
  lastSaved,
  actionsDisabled = false,
}: FloatingToolbarProps) {
  const { isRunning, isSaving, isExporting } = runningState ?? {};
  const stepLabel = STEP_LABELS[pipelineStep];
  const isImageOnly = IMAGE_ONLY_MODES.has(mode ?? "");

  return (
    <div className="absolute left-1/2 top-6 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
      {stepLabel ? (
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${STEP_COLORS[pipelineStep]}`}>
          {pipelineStep === "done" ? <CircleCheck className="h-3.5 w-3.5" /> : null}
          {pipelineStep === "running" || pipelineStep === "generating" || pipelineStep === "imaging" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : null}
          {stepLabel}
        </div>
      ) : null}

      <div className={`flex items-center gap-1 rounded-full px-4 py-2 ${WORKSPACE_SURFACE.floating}`}>
        <Tooltip text="텍스트와 이미지를 자동 생성합니다 (Ctrl+Enter)">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1.5 rounded-full px-3 text-xs ${WORKSPACE_CONTROL.ghostButton}`}
            onClick={onRunAll}
            disabled={isRunning || actionsDisabled}
          >
            {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            전체 실행
          </Button>
        </Tooltip>

        <Tooltip text="진행 중인 생성 작업을 중단합니다 (Esc)">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1.5 rounded-full px-3 text-xs ${WORKSPACE_CONTROL.ghostButton}`}
            onClick={onStop}
            disabled={!isRunning}
          >
            <Square className="h-4 w-4" />
            중지
          </Button>
        </Tooltip>

        <div className="mx-1 h-4 w-px bg-[#E5DDD3]" />

        <Tooltip text="현재 작업 상태를 저장합니다 (Ctrl+S)">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1.5 rounded-full px-3 text-xs ${WORKSPACE_CONTROL.ghostButton}`}
            onClick={onSave}
            disabled={isSaving || actionsDisabled}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            저장
          </Button>
        </Tooltip>

        {!isImageOnly ? (
          <Tooltip text="생성된 영상을 미리 확인합니다 (2단계)">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1.5 rounded-full px-3 text-xs ${WORKSPACE_CONTROL.ghostButton}`}
              onClick={onPreview}
              disabled={actionsDisabled}
            >
              <Eye className="h-4 w-4" />
              미리보기
            </Button>
          </Tooltip>
        ) : null}

        <Tooltip text="최종 파일을 내보냅니다">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1.5 rounded-full px-3 text-xs ${WORKSPACE_CONTROL.ghostButton}`}
            onClick={onExport}
            disabled={isExporting || actionsDisabled}
          >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            내보내기
          </Button>
        </Tooltip>
      </div>

      <div className="flex items-center gap-3">
        {helperText ? (
          <p className={`max-w-[240px] whitespace-pre-line text-right text-[11px] leading-4 ${WORKSPACE_TEXT.muted}`}>
            {helperText}
          </p>
        ) : null}

        <div className={`flex items-center gap-1 rounded-full px-3 py-1.5 ${WORKSPACE_SURFACE.floating}`}>
          {RATIO_OPTIONS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onRatioChange?.(value)}
              disabled={actionsDisabled}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                ratio === value
                  ? WORKSPACE_CONTROL.accentButton
                  : "bg-white text-[#6F655D] hover:bg-[#F8F4EF]"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {lastSaved ? (
        <span className={`text-[10px] ${WORKSPACE_TEXT.muted}`}>마지막 저장: {lastSaved}</span>
      ) : null}
    </div>
  );
}
