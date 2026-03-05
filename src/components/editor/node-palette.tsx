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
  { type: "generate", label: "텍스트 생성", desc: "AI가 영상 스크립트를 작성합니다", icon: Sparkles },
  { type: "generate-images", label: "이미지 생성", desc: "장면별 이미지를 생성합니다", icon: ImageIcon },
  { type: "bgm", label: "BGM", desc: "배경음악을 설정합니다", icon: Music },
  { type: "cuts", label: "컷 편집", desc: "장면 순서와 전환을 편집합니다", icon: Scissors },
  { type: "render", label: "렌더링", desc: "영상을 합성합니다", icon: Film },
  { type: "export", label: "내보내기", desc: "최종 파일을 출력합니다", icon: Download },
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
        <h2 className="text-sm font-semibold text-gray-900">노드</h2>
        <p className="text-xs text-gray-400">드래그하여 캔버스에 추가</p>
      </div>

      <div className="flex flex-col gap-1 p-3">
        {NODE_TYPES.map(({ type, label, desc, icon: Icon }) => (
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
        ))}
      </div>
    </aside>
  );
}
