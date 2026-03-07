/** 무드보드 선택 — 카테고리별 스타일 참조 타일 */
"use client";

import { getMoodboardsByCategory, type MoodboardPreset } from "@/lib/moodboard-presets";

interface MoodboardPickerProps {
  category: string;
  selected: string | null;
  onSelect: (preset: MoodboardPreset) => void;
}

export function MoodboardPicker({ category, selected, onSelect }: MoodboardPickerProps) {
  const presets = getMoodboardsByCategory(category);

  if (presets.length === 0) return null;

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700">스타일 무드보드</label>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className={`group relative overflow-hidden rounded-lg border-2 p-3 text-left transition ${
              selected === preset.id
                ? "border-indigo-500 ring-2 ring-indigo-200"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${preset.gradient} opacity-20 transition group-hover:opacity-30`}
            />
            <div className="relative">
              <div className="mb-1.5 flex gap-1">
                {[preset.theme.primary, preset.theme.secondary, preset.theme.accent].map((c, i) => (
                  <div
                    key={i}
                    className="h-3 w-3 rounded-full border border-white/50"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <p className="text-xs font-semibold text-gray-800">{preset.label}</p>
              <p className="mt-0.5 text-[10px] leading-tight text-gray-500 line-clamp-2">
                {preset.promptHint}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
