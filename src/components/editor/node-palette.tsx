/** 에디터 좌측 노드 팔레트 — 모드별 필터링 + 드래그 가능한 노드 타입 리스트 */
"use client";

import {
  Sparkles,
  ImageIcon,
  Music,
  Scissors,
  Film,
  Download,
} from "lucide-react";
import {
  MODE_NODE_CONFIG,
  DEFAULT_MODE_CONFIG,
  NODE_TYPE_LABELS,
  NODE_TYPE_DESCS,
  type FlowNodeType,
} from "@/lib/constants";

const NODE_ICONS: Record<FlowNodeType, React.ElementType> = {
  prompt: Sparkles,
  "generate-images": ImageIcon,
  bgm: Music,
  cuts: Scissors,
  render: Film,
  export: Download,
};

const ALL_NODE_TYPES: FlowNodeType[] = ["prompt", "generate-images", "bgm", "cuts", "render", "export"];

interface NodePaletteProps {
  mode: string;
}

export function NodePalette({ mode }: NodePaletteProps) {
  const config = MODE_NODE_CONFIG[mode] ?? DEFAULT_MODE_CONFIG;
  const allowed = new Set(config.allowedNodes);
  const visibleNodes = ALL_NODE_TYPES.filter((t) => allowed.has(t));

  function onDragStart(
    event: React.DragEvent,
    nodeType: string,
    label: string
  ) {
    event.dataTransfer.setData("application/reactflow-type", nodeType);
    event.dataTransfer.setData("application/reactflow-label", label);
    event.dataTransfer.effectAllowed = "move";
  }

  return (
    <aside className="flex w-64 flex-col border-r border-gray-100 bg-white/80 backdrop-blur">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-gray-900">작업 단계</h2>
        <p className="text-xs text-gray-400">끌어서 작업 영역에 추가</p>
      </div>

      <div className="flex flex-col gap-1 p-3">
        {visibleNodes.map((type) => {
          const label = NODE_TYPE_LABELS[type];
          const desc = NODE_TYPE_DESCS[type];
          const Icon = NODE_ICONS[type];
          return (
            <div
              key={type}
              draggable
              onDragStart={(e) => onDragStart(e, type, label)}
              className="group flex cursor-grab items-center gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50 active:cursor-grabbing"
              title={desc}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-700">{label}</span>
                <span className="text-[10px] text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">{desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
