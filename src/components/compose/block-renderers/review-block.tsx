/** 리뷰 블록 — 3가지 displayStyle + 별점 클릭 + 리뷰 추가/삭제 + 인라인 편집 */
"use client";

import type { ReviewBlock } from "@/types/blocks";
import { X, Plus } from "lucide-react";
import { EditableText } from "../shared";

interface Props {
  block: ReviewBlock;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<ReviewBlock>) => void;
  readOnly?: boolean;
}

function StarRating({ rating, onChange, readOnly }: { rating: number; onChange: (r: number) => void; readOnly?: boolean }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={(e) => { e.stopPropagation(); if (!readOnly) onChange(n); }}
          className={`text-sm ${readOnly ? "cursor-default" : "cursor-pointer"} ${n <= rating ? "text-amber-500" : "text-gray-300"}`}
          disabled={readOnly}
        >
          ★
        </button>
      ))}
    </span>
  );
}

export function ReviewBlockRenderer({ block, selected, onSelect, onUpdate, readOnly }: Props) {
  const style = block.displayStyle ?? "card";

  const updateReview = (index: number, patch: Partial<ReviewBlock["reviews"][0]>) => {
    const reviews = block.reviews.map((r, i) => (i === index ? { ...r, ...patch } : r));
    onUpdate({ reviews });
  };

  const deleteReview = (index: number) => {
    if (block.reviews.length <= 1) return;
    onUpdate({ reviews: block.reviews.filter((_, i) => i !== index) });
  };

  const addReview = () => {
    onUpdate({
      reviews: [...block.reviews, { author: "고객", rating: 5, text: "리뷰를 입력하세요" }],
    });
  };

  return (
    <div
      className={`w-full rounded-lg border-2 bg-white p-6 transition-colors ${selected ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`}
      onClick={onSelect}
    >
      <EditableText
        value={block.title}
        placeholder="리뷰 제목"
        onChange={(v) => onUpdate({ title: v })}
        className="mb-3 text-base font-bold text-gray-900"
        tag="h3"
        readOnly={readOnly}
      />
      <div className="space-y-3">
        {block.reviews.map((review, i) => (
          <div
            key={i}
            className={`group/review relative ${
              style === "card" ? "rounded-lg bg-gray-50 p-3" :
              style === "quote" ? "border-l-4 border-indigo-300 pl-4 py-2" :
              "py-2"
            }`}
          >
            {!readOnly && block.reviews.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); deleteReview(i); }}
                className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500 opacity-0 transition-opacity group-hover/review:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            <div className="mb-1 flex items-center gap-2">
              <EditableText
                value={review.author}
                placeholder="작성자"
                onChange={(v) => updateReview(i, { author: v })}
                className="text-sm font-medium text-gray-700"
                tag="span"
                readOnly={readOnly}
              />
              <StarRating
                rating={review.rating}
                onChange={(r) => updateReview(i, { rating: r })}
                readOnly={readOnly}
              />
            </div>
            {style === "quote" ? (
              <EditableText
                value={review.text}
                placeholder="리뷰 내용"
                onChange={(v) => updateReview(i, { text: v })}
                className="text-sm italic text-gray-600"
                tag="p"
                readOnly={readOnly}
              />
            ) : (
              <EditableText
                value={review.text}
                placeholder="리뷰 내용"
                onChange={(v) => updateReview(i, { text: v })}
                className="text-sm text-gray-600"
                tag="p"
                readOnly={readOnly}
              />
            )}
          </div>
        ))}
      </div>

      {!readOnly && (
        <button
          onClick={(e) => { e.stopPropagation(); addReview(); }}
          className="mx-auto mt-3 flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-indigo-300 hover:text-indigo-500"
        >
          <Plus className="h-3 w-3" /> 리뷰 추가
        </button>
      )}
    </div>
  );
}
