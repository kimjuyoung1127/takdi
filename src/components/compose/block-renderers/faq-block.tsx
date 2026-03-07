/** FAQ 블록 — 질문+답변 아코디언 (추가/삭제) */
"use client";

import { useState } from "react";
import type { FaqBlock } from "@/types/blocks";
import { ChevronDown, Plus, X } from "lucide-react";
import { EditableText } from "../shared";

interface Props {
  block: FaqBlock;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<FaqBlock>) => void;
  readOnly?: boolean;
}

export function FaqBlockRenderer({ block, selected, onSelect, onUpdate, readOnly }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const updateItem = (index: number, patch: Partial<FaqBlock["items"][0]>) => {
    const items = block.items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onUpdate({ items });
  };

  const deleteItem = (index: number) => {
    if (block.items.length <= 1) return;
    onUpdate({ items: block.items.filter((_, i) => i !== index) });
  };

  const addItem = () => {
    if (block.items.length >= 10) return;
    onUpdate({
      items: [...block.items, { question: "질문을 입력하세요", answer: "답변을 입력하세요" }],
    });
  };

  return (
    <div
      className={`w-full rounded-lg border-2 bg-white p-6 transition-colors ${selected ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`}
      onClick={onSelect}
    >
      <EditableText
        value={block.title}
        placeholder="자주 묻는 질문"
        onChange={(v) => onUpdate({ title: v })}
        className="mb-4 text-center text-lg font-bold text-gray-900"
        tag="h3"
        readOnly={readOnly}
      />

      <div className="space-y-2">
        {block.items.map((item, idx) => (
          <div key={idx} className="group/faq relative rounded-lg border border-gray-100">
            {/* Question */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex(openIndex === idx ? null : idx);
              }}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <EditableText
                value={item.question}
                placeholder="질문을 입력하세요"
                onChange={(v) => updateItem(idx, { question: v })}
                className="flex-1 text-sm font-medium text-gray-900"
                tag="span"
                readOnly={readOnly}
              />
              <ChevronDown
                className={`ml-2 h-4 w-4 shrink-0 text-gray-400 transition-transform ${openIndex === idx ? "rotate-180" : ""}`}
              />
            </button>

            {/* Answer */}
            {openIndex === idx && (
              <div className="border-t border-gray-100 px-4 py-3">
                <EditableText
                  value={item.answer}
                  placeholder="답변을 입력하세요"
                  onChange={(v) => updateItem(idx, { answer: v })}
                  className="text-sm text-gray-600"
                  tag="p"
                  readOnly={readOnly}
                />
              </div>
            )}

            {/* Delete */}
            {!readOnly && block.items.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); deleteItem(idx); }}
                className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500 opacity-0 transition-opacity group-hover/faq:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {!readOnly && block.items.length < 10 && (
        <button
          onClick={(e) => { e.stopPropagation(); addItem(); }}
          className="mx-auto mt-4 flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-indigo-300 hover:text-indigo-500"
        >
          <Plus className="h-3 w-3" /> 질문 추가
        </button>
      )}
    </div>
  );
}
