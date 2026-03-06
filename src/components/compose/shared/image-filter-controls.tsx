/** ImageFilterControls - 밝기/대비/채도 슬라이더 (속성 패널용) */
"use client";

import type { ImageFilters } from "@/types/blocks";
import { RotateCcw } from "lucide-react";

const DEFAULT_FILTERS: ImageFilters = { brightness: 100, contrast: 100, saturate: 100 };

const FILTER_DEFS = [
  { key: "brightness" as const, label: "밝기", min: 0, max: 200 },
  { key: "contrast" as const, label: "대비", min: 0, max: 200 },
  { key: "saturate" as const, label: "채도", min: 0, max: 200 },
];

interface Props {
  filters: ImageFilters | undefined;
  onChange: (filters: ImageFilters) => void;
}

export function ImageFilterControls({ filters, onChange }: Props) {
  const current = filters ?? DEFAULT_FILTERS;
  const isDefault = !filters || (current.brightness === 100 && current.contrast === 100 && current.saturate === 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">이미지 보정</span>
        {!isDefault && (
          <button
            onClick={() => onChange({ ...DEFAULT_FILTERS })}
            className="flex items-center gap-0.5 text-[10px] text-gray-400 hover:text-gray-600"
          >
            <RotateCcw className="h-3 w-3" />
            초기화
          </button>
        )}
      </div>
      {FILTER_DEFS.map(({ key, label, min, max }) => (
        <div key={key} className="flex items-center gap-2">
          <span className="w-8 text-[11px] text-gray-400">{label}</span>
          <input
            type="range"
            min={min}
            max={max}
            value={current[key]}
            onChange={(e) => onChange({ ...current, [key]: Number(e.target.value) })}
            className="h-1 flex-1 cursor-pointer accent-indigo-500"
          />
          <span className="w-8 text-right text-[11px] text-gray-400">{current[key]}</span>
        </div>
      ))}
    </div>
  );
}

export function buildFilterStyle(filters?: ImageFilters): string | undefined {
  if (!filters) return undefined;
  const { brightness, contrast, saturate } = filters;
  if (brightness === 100 && contrast === 100 && saturate === 100) return undefined;
  return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
}
