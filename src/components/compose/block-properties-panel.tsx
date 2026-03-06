/** 블록 속성 패널 — 선택된 블록의 타입별 동적 편집 필드 (ImagePicker + 블록별 컨트롤) */
"use client";

import type { Block } from "@/types/blocks";
import { BLOCK_TYPE_LABELS } from "@/lib/constants";
import { useCompose } from "./compose-context";
import { ImagePicker } from "./image-picker";
import { ColorStylePicker } from "./shared";

interface BlockPropertiesPanelProps {
  block: Block | null;
  onUpdate: (id: string, patch: Partial<Block>) => void;
}

const CTA_STYLE_PRESETS = [
  { value: "default", label: "기본", color: "#ffffff" },
  { value: "gradient", label: "그라디언트", color: "#6366f1" },
  { value: "dark", label: "다크", color: "#111827" },
  { value: "minimal", label: "미니멀", color: "#f9fafb" },
];

const REVIEW_STYLE_PRESETS = [
  { value: "card", label: "카드", color: "#f3f4f6" },
  { value: "quote", label: "인용", color: "#a5b4fc" },
  { value: "minimal", label: "미니멀", color: "#ffffff" },
];

export function BlockPropertiesPanel({ block, onUpdate }: BlockPropertiesPanelProps) {
  const { projectId } = useCompose();

  if (!block) {
    return (
      <div className="flex w-72 flex-col border-l border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">설정</h2>
        </div>
        <div className="flex flex-1 items-center justify-center p-4 text-center text-sm text-gray-400">
          <div>
            <p className="mb-2">블록을 선택하면</p>
            <p>설정을 변경할 수 있습니다</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-72 flex-col border-l border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {BLOCK_TYPE_LABELS[block.type]} 설정
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

        {/* hero */}
        {block.type === "hero" && (
          <div className="space-y-3">
            <Field label="이미지">
              <ImagePicker
                projectId={projectId}
                currentUrl={block.imageUrl}
                onImageChange={(url) => onUpdate(block.id, { imageUrl: url })}
              />
            </Field>
          </div>
        )}

        {/* text-block */}
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
            <Field label="글꼴 크기">
              <select
                value={block.fontSize ?? "base"}
                onChange={(e) => onUpdate(block.id, { fontSize: e.target.value as "sm" | "base" | "lg" | "xl" })}
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
              >
                <option value="sm">작게 (14px)</option>
                <option value="base">보통 (16px)</option>
                <option value="lg">크게 (18px)</option>
                <option value="xl">매우 크게 (20px)</option>
              </select>
            </Field>
          </div>
        )}

        {/* image-text */}
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
            <Field label="이미지">
              <ImagePicker
                projectId={projectId}
                currentUrl={block.imageUrl}
                onImageChange={(url) => onUpdate(block.id, { imageUrl: url })}
              />
            </Field>
          </div>
        )}

        {/* image-full */}
        {block.type === "image-full" && (
          <Field label="이미지">
            <ImagePicker
              projectId={projectId}
              currentUrl={block.imageUrl}
              onImageChange={(url) => onUpdate(block.id, { imageUrl: url })}
            />
          </Field>
        )}

        {/* image-grid */}
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

        {/* divider */}
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

        {/* selling-point */}
        {block.type === "selling-point" && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">
              핵심 장점 {block.items.length}개 (최대 4개) — 아래 블록에서 직접 수정
            </p>
          </div>
        )}

        {/* spec-table */}
        {block.type === "spec-table" && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">행 {block.rows.length}개 — 아래 블록에서 직접 수정</p>
          </div>
        )}

        {/* comparison */}
        {block.type === "comparison" && (
          <div className="space-y-3">
            <Field label="Before 이미지">
              <ImagePicker
                projectId={projectId}
                currentUrl={block.before.imageUrl}
                onImageChange={(url) => onUpdate(block.id, { before: { ...block.before, imageUrl: url } })}
              />
            </Field>
            <Field label="After 이미지">
              <ImagePicker
                projectId={projectId}
                currentUrl={block.after.imageUrl}
                onImageChange={(url) => onUpdate(block.id, { after: { ...block.after, imageUrl: url } })}
              />
            </Field>
          </div>
        )}

        {/* review */}
        {block.type === "review" && (
          <div className="space-y-3">
            <ColorStylePicker
              label="표시 스타일"
              value={block.displayStyle ?? "card"}
              presets={REVIEW_STYLE_PRESETS}
              onChange={(v) => onUpdate(block.id, { displayStyle: v as "card" | "quote" | "minimal" })}
            />
            <p className="text-xs text-gray-400">
              리뷰 {block.reviews.length}개 — 아래 블록에서 직접 수정
            </p>
          </div>
        )}

        {/* cta */}
        {block.type === "cta" && (
          <div className="space-y-3">
            <ColorStylePicker
              label="스타일 프리셋"
              value={block.ctaStyle ?? "default"}
              presets={CTA_STYLE_PRESETS}
              onChange={(v) => onUpdate(block.id, { ctaStyle: v as "default" | "gradient" | "dark" | "minimal" })}
            />
            <Field label="버튼 URL">
              <input
                type="text"
                value={block.buttonUrl}
                onChange={(e) => onUpdate(block.id, { buttonUrl: e.target.value })}
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
              />
            </Field>
            <Field label="배경색 직접 설정">
              <input
                type="color"
                value={block.bgColor || "#ffffff"}
                onChange={(e) => onUpdate(block.id, { bgColor: e.target.value })}
                className="h-8 w-full cursor-pointer rounded border border-gray-200"
              />
            </Field>
            <Field label="버튼색 직접 설정">
              <input
                type="color"
                value={block.buttonColor || "#4f46e5"}
                onChange={(e) => onUpdate(block.id, { buttonColor: e.target.value })}
                className="h-8 w-full cursor-pointer rounded border border-gray-200"
              />
            </Field>
          </div>
        )}

        {/* video */}
        {block.type === "video" && (
          <div className="space-y-3">
            <Field label="파일 형식">
              <select
                value={block.mediaType ?? "mp4"}
                onChange={(e) => onUpdate(block.id, { mediaType: e.target.value as "mp4" | "gif" })}
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm"
              >
                <option value="mp4">영상 (MP4)</option>
                <option value="gif">GIF</option>
              </select>
            </Field>
            <Field label="포스터 이미지">
              <ImagePicker
                projectId={projectId}
                currentUrl={block.posterUrl}
                onImageChange={(url) => onUpdate(block.id, { posterUrl: url })}
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
