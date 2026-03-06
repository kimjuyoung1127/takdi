/** ColorStylePicker - 프리셋 색상/스타일 선택기 */
"use client";

interface ColorStylePickerProps {
  label: string;
  value: string;
  presets: Array<{ value: string; label: string; color: string }>;
  onChange: (value: string) => void;
}

export function ColorStylePicker({ label, value, presets, onChange }: ColorStylePickerProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-500">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => onChange(preset.value)}
            className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors ${
              value === preset.value
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
            title={preset.label}
          >
            <span
              className="h-3 w-3 rounded-full border border-gray-200"
              style={{ backgroundColor: preset.color }}
            />
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
