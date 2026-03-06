/** Placeholder 렌더러 — 8종 블록 (image-full, image-grid, spec-table, comparison, review, divider, video, cta) */
"use client";

import type {
  ImageFullBlock,
  ImageGridBlock,
  SpecTableBlock,
  ComparisonBlock,
  ReviewBlock,
  DividerBlock,
  VideoBlock,
  CtaBlock,
} from "@/types/blocks";
import { ImageIcon, Grid, Table, GitCompare, MessageSquare, Minus, Video, MousePointerClick } from "lucide-react";

interface PlaceholderProps<T> {
  block: T;
  selected: boolean;
  onSelect: () => void;
  readOnly?: boolean;
}

function PlaceholderShell({
  icon: Icon,
  label,
  selected,
  onSelect,
  children,
}: {
  icon: React.ElementType;
  label: string;
  selected: boolean;
  onSelect: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`w-full rounded-lg border-2 bg-white p-6 transition-colors ${selected ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`}
      onClick={onSelect}
    >
      {children ?? (
        <div className="flex items-center gap-3 text-gray-400">
          <Icon className="h-6 w-6" />
          <span className="text-sm">{label}</span>
        </div>
      )}
    </div>
  );
}

export function ImageFullBlockRenderer({ block, selected, onSelect }: PlaceholderProps<ImageFullBlock>) {
  return (
    <PlaceholderShell icon={ImageIcon} label="전체 이미지" selected={selected} onSelect={onSelect}>
      {block.imageUrl ? (
        <img src={block.imageUrl} alt="" className="w-full rounded object-cover" />
      ) : (
        <div className="flex h-48 items-center justify-center bg-gray-50 text-gray-400">
          <div className="text-center">
            <ImageIcon className="mx-auto mb-2 h-10 w-10" />
            <p className="text-sm">전체 이미지</p>
          </div>
        </div>
      )}
    </PlaceholderShell>
  );
}

export function ImageGridBlockRenderer({ block, selected, onSelect }: PlaceholderProps<ImageGridBlock>) {
  return (
    <PlaceholderShell icon={Grid} label="이미지 그리드" selected={selected} onSelect={onSelect}>
      <div className={`grid gap-2 ${block.columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {block.images.length > 0
          ? block.images.map((img, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded bg-gray-100">
                {img.url ? <img src={img.url} alt={img.caption} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-gray-400"><ImageIcon className="h-6 w-6" /></div>}
              </div>
            ))
          : Array.from({ length: block.columns * 2 }).map((_, i) => (
              <div key={i} className="flex aspect-square items-center justify-center rounded bg-gray-50 text-gray-300">
                <ImageIcon className="h-6 w-6" />
              </div>
            ))}
      </div>
    </PlaceholderShell>
  );
}

export function SpecTableBlockRenderer({ block, selected, onSelect }: PlaceholderProps<SpecTableBlock>) {
  return (
    <PlaceholderShell icon={Table} label="스펙 테이블" selected={selected} onSelect={onSelect}>
      <div>
        <h3 className="mb-3 text-base font-bold text-gray-900">{block.title || "제품 사양"}</h3>
        <table className="w-full text-sm">
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="px-3 py-2 font-medium text-gray-700">{row.label}</td>
                <td className="px-3 py-2 text-gray-500">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PlaceholderShell>
  );
}

export function ComparisonBlockRenderer({ block, selected, onSelect }: PlaceholderProps<ComparisonBlock>) {
  return (
    <PlaceholderShell icon={GitCompare} label="비교" selected={selected} onSelect={onSelect}>
      <div>
        <h3 className="mb-3 text-center text-base font-bold text-gray-900">{block.title || "비교"}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="mb-2 flex aspect-square items-center justify-center rounded bg-gray-50">
              {block.before.imageUrl ? <img src={block.before.imageUrl} alt="" className="h-full w-full object-cover rounded" /> : <ImageIcon className="h-8 w-8 text-gray-300" />}
            </div>
            <span className="text-sm font-medium text-gray-600">{block.before.label}</span>
          </div>
          <div className="text-center">
            <div className="mb-2 flex aspect-square items-center justify-center rounded bg-gray-50">
              {block.after.imageUrl ? <img src={block.after.imageUrl} alt="" className="h-full w-full object-cover rounded" /> : <ImageIcon className="h-8 w-8 text-gray-300" />}
            </div>
            <span className="text-sm font-medium text-gray-600">{block.after.label}</span>
          </div>
        </div>
      </div>
    </PlaceholderShell>
  );
}

export function ReviewBlockRenderer({ block, selected, onSelect }: PlaceholderProps<ReviewBlock>) {
  return (
    <PlaceholderShell icon={MessageSquare} label="리뷰" selected={selected} onSelect={onSelect}>
      <div>
        <h3 className="mb-3 text-base font-bold text-gray-900">{block.title || "고객 리뷰"}</h3>
        <div className="space-y-3">
          {block.reviews.map((review, i) => (
            <div key={i} className="rounded-lg bg-gray-50 p-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">{review.author}</span>
                <span className="text-xs text-amber-500">{"★".repeat(review.rating)}</span>
              </div>
              <p className="text-sm text-gray-600">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </PlaceholderShell>
  );
}

export function DividerBlockRenderer({ block, selected, onSelect }: PlaceholderProps<DividerBlock>) {
  return (
    <div
      className={`w-full rounded border-2 transition-colors ${selected ? "border-indigo-500" : "border-transparent hover:border-gray-200"}`}
      onClick={onSelect}
      style={{ height: block.height || 32 }}
    >
      {block.style === "line" && <hr className="mt-4 border-gray-200" />}
      {block.style === "dot" && (
        <div className="flex h-full items-center justify-center gap-2 text-gray-300">
          <span>&#8226;</span><span>&#8226;</span><span>&#8226;</span>
        </div>
      )}
    </div>
  );
}

export function VideoBlockRenderer({ block, selected, onSelect }: PlaceholderProps<VideoBlock>) {
  return (
    <PlaceholderShell icon={Video} label="영상" selected={selected} onSelect={onSelect}>
      {block.videoUrl ? (
        <video src={block.videoUrl} poster={block.posterUrl} controls className="w-full rounded" />
      ) : (
        <div className="flex h-48 items-center justify-center bg-gray-50 text-gray-400">
          <div className="text-center">
            <Video className="mx-auto mb-2 h-10 w-10" />
            <p className="text-sm">영상을 추가하세요</p>
          </div>
        </div>
      )}
    </PlaceholderShell>
  );
}

export function CtaBlockRenderer({ block, selected, onSelect }: PlaceholderProps<CtaBlock>) {
  return (
    <PlaceholderShell icon={MousePointerClick} label="CTA" selected={selected} onSelect={onSelect}>
      <div className="py-4 text-center">
        <h3 className="mb-2 text-xl font-bold text-gray-900">{block.text || "지금 바로 시작하세요"}</h3>
        <p className="mb-4 text-sm text-gray-500">{block.subtext}</p>
        <button className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white">
          {block.buttonLabel || "구매하기"}
        </button>
      </div>
    </PlaceholderShell>
  );
}
