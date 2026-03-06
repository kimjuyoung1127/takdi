/** 블록 속성 패널 — 선택된 블록의 타입별 동적 편집 필드 */
"use client";

import type { Block } from "@/types/blocks";

interface BlockPropertiesPanelProps {
  block: Block | null;
  onUpdate: (id: string, patch: Partial<Block>) => void;
}

const BLOCK_LABELS: Record<Block["type"], string> = {
  hero: "히어로",
  "selling-point": "셀링포인트",
  "image-full": "전체 이미지",
  "image-grid": "이미지 그리드",
  "text-block": "텍스트",
  "image-text": "이미지+텍스트",
  "spec-table": "스펙 테이블",
  comparison: "비교",
  review: "리뷰",
  divider: "구분선",
  video: "영상",
  cta: "CTA",
};

export function BlockPropertiesPanel({ block, onUpdate }: BlockPropertiesPanelProps) {
  if (!block) {
    return (
      <div className="flex w-72 flex-col border-l border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">속성</h2>
        </div>
        <div className="flex flex-1 items-center justify-center p-4 text-center text-sm text-gray-400">
          <div>
            <p className="mb-2">블록을 선택하면</p>
            <p>속성을 편집할 수 있습니다</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-72 flex-col border-l border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {BLOCK_LABELS[block.type]} 속성
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {/* Common: visibility */}
        <label className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={block.visible}
            onChange={(e) => onUpdate(block.id, { visible: e.target.checked })}
            className="rounded border-gray-300"
          />
          표시
        </label>

        {/* Type-specific fields */}
        {block.type === "hero" && (
          <div className="space-y-3">
            <Field label="이미지 URL">
              <input
                type="text"
                value={block.imageUrl}
                onChange={(e) => onUpdate(block.id, { imageUrl: e.target.value })}
                placeholder="이미지 URL 또는 파일 업로드"
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
              />
            </Field>
          </div>
        )}

        {block.type === "text-block" && (
          <div className="space-y-3">
            <Field label="정렬">
              <select
                value={block.align}
                onChange={(e) => onUpdate(block.id, { align: e.target.value as "left" | "center" | "right" })}
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
              >
                <option value="left">왼쪽</option>
                <option value="center">가운데</option>
                <option value="right">오른쪽</option>
              </select>
            </Field>
          </div>
        )}

        {block.type === "image-text" && (
          <div className="space-y-3">
            <Field label="이미지 위치">
              <select
                value={block.imagePosition}
                onChange={(e) => onUpdate(block.id, { imagePosition: e.target.value as "left" | "right" })}
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
              >
                <option value="left">왼쪽</option>
                <option value="right">오른쪽</option>
              </select>
            </Field>
            <Field label="이미지 URL">
              <input
                type="text"
                value={block.imageUrl}
                onChange={(e) => onUpdate(block.id, { imageUrl: e.target.value })}
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
              />
            </Field>
          </div>
        )}

        {block.type === "image-full" && (
          <Field label="이미지 URL">
            <input
              type="text"
              value={block.imageUrl}
              onChange={(e) => onUpdate(block.id, { imageUrl: e.target.value })}
              className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
            />
          </Field>
        )}

        {block.type === "image-grid" && (
          <Field label="열 수">
            <select
              value={block.columns}
              onChange={(e) => onUpdate(block.id, { columns: Number(e.target.value) as 2 | 3 })}
              className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
            >
              <option value={2}>2열</option>
              <option value={3}>3열</option>
            </select>
          </Field>
        )}

        {block.type === "divider" && (
          <div className="space-y-3">
            <Field label="스타일">
              <select
                value={block.style}
                onChange={(e) => onUpdate(block.id, { style: e.target.value as "line" | "space" | "dot" })}
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
              >
                <option value="line">선</option>
                <option value="space">여백</option>
                <option value="dot">점</option>
              </select>
            </Field>
            <Field label="높이 (px)">
              <input
                type="number"
                value={block.height}
                onChange={(e) => onUpdate(block.id, { height: Number(e.target.value) })}
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
                min={8}
                max={200}
              />
            </Field>
          </div>
        )}

        {block.type === "selling-point" && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">
              셀링포인트 {block.items.length}개 — 블록에서 직접 편집하세요
            </p>
            <button
              onClick={() =>
                onUpdate(block.id, {
                  items: [...block.items, { icon: "star", title: "새 포인트", description: "설명" }],
                })
              }
              className="rounded bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100"
            >
              + 포인트 추가
            </button>
          </div>
        )}

        {block.type === "spec-table" && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">행 {block.rows.length}개</p>
            <button
              onClick={() =>
                onUpdate(block.id, {
                  rows: [...block.rows, { label: "항목", value: "값" }],
                })
              }
              className="rounded bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100"
            >
              + 행 추가
            </button>
          </div>
        )}

        {block.type === "cta" && (
          <div className="space-y-3">
            <Field label="버튼 텍스트">
              <input
                type="text"
                value={block.buttonLabel}
                onChange={(e) => onUpdate(block.id, { buttonLabel: e.target.value })}
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
              />
            </Field>
            <Field label="버튼 URL">
              <input
                type="text"
                value={block.buttonUrl}
                onChange={(e) => onUpdate(block.id, { buttonUrl: e.target.value })}
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
              />
            </Field>
          </div>
        )}

        {block.type === "video" && (
          <div className="space-y-3">
            <Field label="영상 URL">
              <input
                type="text"
                value={block.videoUrl}
                onChange={(e) => onUpdate(block.id, { videoUrl: e.target.value })}
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
              />
            </Field>
            <Field label="포스터 이미지 URL">
              <input
                type="text"
                value={block.posterUrl}
                onChange={(e) => onUpdate(block.id, { posterUrl: e.target.value })}
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
              />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500">{label}</label>
      {children}
    </div>
  );
}
