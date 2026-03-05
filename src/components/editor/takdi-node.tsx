/** React Flow 커스텀 노드 — Takdi 파이프라인 노드 */
"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  Sparkles,
  ImageIcon,
  Music,
  Scissors,
  Film,
  Download,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

const ICONS: Record<string, React.ElementType> = {
  generate: Sparkles,
  "generate-images": ImageIcon,
  bgm: Music,
  cuts: Scissors,
  render: Film,
  export: Download,
};

interface TakdiNodeData {
  label: string;
  nodeType: string;
  status?: string;
  [key: string]: unknown;
}

function TakdiNodeComponent({ data, selected }: NodeProps & { data: TakdiNodeData }) {
  const Icon = ICONS[data.nodeType] ?? Sparkles;

  return (
    <div
      className={`min-w-50 rounded-2xl bg-white p-4 shadow-sm transition-shadow ${
        selected ? "ring-2 ring-indigo-300" : ""
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-gray-300" />

      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-sm font-medium text-gray-900">{data.label}</span>
      </div>

      {data.status && (
        <div className="mt-2">
          <StatusBadge status={data.status} />
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-300"
      />
    </div>
  );
}

export const TakdiNode = memo(TakdiNodeComponent);
