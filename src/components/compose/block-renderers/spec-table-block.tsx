/** 스펙 테이블 블록 — 행별 label/value 인라인 편집 + 행 추가/삭제 */
"use client";

import type { SpecTableBlock } from "@/types/blocks";
import { X, Plus } from "lucide-react";
import { EditableText } from "../shared";

interface Props {
  block: SpecTableBlock;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<SpecTableBlock>) => void;
  readOnly?: boolean;
}

export function SpecTableBlockRenderer({ block, selected, onSelect, onUpdate, readOnly }: Props) {
  const updateRow = (index: number, patch: Partial<{ label: string; value: string }>) => {
    const rows = block.rows.map((row, i) => (i === index ? { ...row, ...patch } : row));
    onUpdate({ rows });
  };

  const deleteRow = (index: number) => {
    if (block.rows.length <= 1) return;
    onUpdate({ rows: block.rows.filter((_, i) => i !== index) });
  };

  const addRow = () => {
    onUpdate({ rows: [...block.rows, { label: "항목", value: "값" }] });
  };

  return (
    <div
      className={`w-full rounded-lg border-2 bg-white p-6 transition-colors ${selected ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`}
      onClick={onSelect}
    >
      <EditableText
        value={block.title}
        placeholder="테이블 제목"
        onChange={(v) => onUpdate({ title: v })}
        className="mb-3 text-base font-bold text-gray-900"
        tag="h3"
        readOnly={readOnly}
      />
      <table className="w-full text-sm">
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i} className={`group/row ${i % 2 === 0 ? "bg-gray-50" : ""}`}>
              <td className="px-3 py-2 font-medium text-gray-700">
                <EditableText
                  value={row.label}
                  placeholder="항목명"
                  onChange={(v) => updateRow(i, { label: v })}
                  className="font-medium text-gray-700"
                  tag="span"
                  readOnly={readOnly}
                />
              </td>
              <td className="px-3 py-2 text-gray-500">
                <EditableText
                  value={row.value}
                  placeholder="값"
                  onChange={(v) => updateRow(i, { value: v })}
                  className="text-gray-500"
                  tag="span"
                  readOnly={readOnly}
                />
              </td>
              {!readOnly && (
                <td className="w-8 px-1 py-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteRow(i); }}
                    className="flex h-5 w-5 items-center justify-center rounded text-gray-300 opacity-0 transition-opacity hover:text-red-500 group-hover/row:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {!readOnly && (
        <button
          onClick={(e) => { e.stopPropagation(); addRow(); }}
          className="mx-auto mt-3 flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-indigo-300 hover:text-indigo-500"
        >
          <Plus className="h-3 w-3" /> 행 추가
        </button>
      )}
    </div>
  );
}
