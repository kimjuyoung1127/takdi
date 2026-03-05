/** 에디터 좌측 노드 팔레트 — 드래그 가능한 노드 타입 리스트 */
"use client";

import {
  Sparkles,
  ImageIcon,
  Music,
  Scissors,
  Film,
  Download,
} from "lucide-react";

const NODE_TYPES = [
  { type: "generate", label: "Text Generate", icon: Sparkles },
  { type: "generate-images", label: "Image Generate", icon: ImageIcon },
  { type: "bgm", label: "BGM", icon: Music },
  { type: "cuts", label: "Cut Edit", icon: Scissors },
  { type: "render", label: "Render", icon: Film },
  { type: "export", label: "Export", icon: Download },
];

export function NodePalette() {
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
        <h2 className="text-sm font-semibold text-gray-900">Nodes</h2>
        <p className="text-xs text-gray-400">드래그하여 캔버스에 추가</p>
      </div>

      <div className="flex flex-col gap-1 p-3">
        {NODE_TYPES.map(({ type, label, icon: Icon }) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => onDragStart(e, type, label)}
            className="flex cursor-grab items-center gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50 active:cursor-grabbing"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-sm text-gray-700">{label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
