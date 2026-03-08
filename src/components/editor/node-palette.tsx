"use client";

import {
  Download,
  Eraser,
  Film,
  ImageIcon,
  Music,
  Scissors,
  Sparkles,
  Upload,
  UserRound,
} from "lucide-react";
import {
  DEFAULT_MODE_CONFIG,
  MODE_NODE_CONFIG,
  NODE_TYPE_DESCS,
  NODE_TYPE_LABELS,
  type FlowNodeType,
} from "@/lib/constants";
import { WORKSPACE_CONTROL, WORKSPACE_SURFACE, WORKSPACE_TEXT } from "@/lib/workspace-surface";

const NODE_ICONS: Record<FlowNodeType, React.ElementType> = {
  prompt: Sparkles,
  "generate-images": ImageIcon,
  bgm: Music,
  cuts: Scissors,
  render: Film,
  export: Download,
  "upload-image": Upload,
  "remove-bg": Eraser,
  "model-compose": UserRound,
};

const ALL_NODE_TYPES: FlowNodeType[] = [
  "upload-image",
  "prompt",
  "generate-images",
  "remove-bg",
  "model-compose",
  "bgm",
  "cuts",
  "render",
  "export",
];

interface NodePaletteProps {
  mode: string;
  disabled?: boolean;
}

export function NodePalette({ mode, disabled = false }: NodePaletteProps) {
  const config = MODE_NODE_CONFIG[mode] ?? DEFAULT_MODE_CONFIG;
  const allowed = new Set(config.allowedNodes);
  const visibleNodes = ALL_NODE_TYPES.filter((type) => allowed.has(type));

  function onDragStart(event: React.DragEvent, nodeType: string, label: string) {
    event.dataTransfer.setData("application/reactflow-type", nodeType);
    event.dataTransfer.setData("application/reactflow-label", label);
    event.dataTransfer.effectAllowed = "move";
  }

  return (
    <aside className={`flex w-64 flex-col border-r border-[#E5DDD3] bg-[#EFE9E1]`}>
      <div className="border-b border-[#E5DDD3] px-5 py-4">
        <h2 className={`text-sm font-semibold ${WORKSPACE_TEXT.title}`}>작업 단계</h2>
        <p className={`text-xs ${WORKSPACE_TEXT.muted}`}>
          {disabled ? "가이드형 모드에서는 내부 구조만 확인할 수 있습니다." : "필요한 단계를 캔버스로 추가하세요."}
        </p>
      </div>

      <div className="flex flex-col gap-1 p-3">
        {visibleNodes.map((type) => {
          const label = NODE_TYPE_LABELS[type];
          const desc = NODE_TYPE_DESCS[type];
          const Icon = NODE_ICONS[type];

          return (
            <div
              key={type}
              draggable={!disabled}
              onDragStart={(event) => {
                if (disabled) {
                  event.preventDefault();
                  return;
                }
                onDragStart(event, type, label);
              }}
              className={`group flex items-center gap-3 rounded-2xl p-3 transition-colors ${
                disabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-grab hover:bg-[#F8F4EF] active:cursor-grabbing"
              }`}
              title={desc}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-2xl ${WORKSPACE_CONTROL.accentTint}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className={`text-sm ${WORKSPACE_TEXT.body}`}>{label}</span>
                <span className={`text-[10px] ${WORKSPACE_TEXT.muted} opacity-0 transition-opacity group-hover:opacity-100`}>
                  {desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
