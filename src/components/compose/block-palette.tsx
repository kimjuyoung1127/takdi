/** 블록 팔레트 — 12종 블록 카드, 클릭으로 캔버스에 추가 */
"use client";

import {
  ImageIcon,
  Grid,
  Type,
  Columns,
  Table,
  GitCompare,
  MessageSquare,
  Minus,
  Video,
  MousePointerClick,
  Star,
  Crown,
} from "lucide-react";
import type { Block, BlockType } from "@/types/blocks";

interface BlockPaletteProps {
  onAddBlock: (block: Block) => void;
}

interface BlockTemplate {
  type: BlockType;
  label: string;
  icon: React.ElementType;
  create: () => Block;
}

let paletteIdCounter = 0;
function nextId() {
  return `blk-${Date.now()}-${++paletteIdCounter}`;
}

const TEMPLATES: BlockTemplate[] = [
  {
    type: "hero",
    label: "히어로",
    icon: Crown,
    create: () => ({
      id: nextId(),
      type: "hero",
      visible: true,
      imageUrl: "",
      overlays: [{ id: `ovl-${Date.now()}`, text: "메인 타이틀", x: 50, y: 50, fontSize: 32, color: "#ffffff", fontWeight: "bold", textAlign: "center" }],
    }),
  },
  {
    type: "selling-point",
    label: "셀링포인트",
    icon: Star,
    create: () => ({
      id: nextId(),
      type: "selling-point",
      visible: true,
      items: [
        { icon: "star", title: "핵심 포인트", description: "설명을 입력하세요" },
      ],
    }),
  },
  {
    type: "image-full",
    label: "전체 이미지",
    icon: ImageIcon,
    create: () => ({
      id: nextId(),
      type: "image-full",
      visible: true,
      imageUrl: "",
      overlays: [],
    }),
  },
  {
    type: "image-grid",
    label: "이미지 그리드",
    icon: Grid,
    create: () => ({
      id: nextId(),
      type: "image-grid",
      visible: true,
      images: [],
      columns: 2,
    }),
  },
  {
    type: "text-block",
    label: "텍스트",
    icon: Type,
    create: () => ({
      id: nextId(),
      type: "text-block",
      visible: true,
      heading: "제목",
      body: "본문 내용을 입력하세요.",
      align: "left",
    }),
  },
  {
    type: "image-text",
    label: "이미지+텍스트",
    icon: Columns,
    create: () => ({
      id: nextId(),
      type: "image-text",
      visible: true,
      imageUrl: "",
      imagePosition: "left",
      heading: "제목",
      body: "설명을 입력하세요.",
    }),
  },
  {
    type: "spec-table",
    label: "스펙 테이블",
    icon: Table,
    create: () => ({
      id: nextId(),
      type: "spec-table",
      visible: true,
      title: "제품 사양",
      rows: [{ label: "항목", value: "값" }],
    }),
  },
  {
    type: "comparison",
    label: "비교",
    icon: GitCompare,
    create: () => ({
      id: nextId(),
      type: "comparison",
      visible: true,
      title: "Before & After",
      before: { label: "Before", imageUrl: "" },
      after: { label: "After", imageUrl: "" },
    }),
  },
  {
    type: "review",
    label: "리뷰",
    icon: MessageSquare,
    create: () => ({
      id: nextId(),
      type: "review",
      visible: true,
      title: "고객 리뷰",
      reviews: [{ author: "고객", rating: 5, text: "만족합니다!" }],
    }),
  },
  {
    type: "divider",
    label: "구분선",
    icon: Minus,
    create: () => ({
      id: nextId(),
      type: "divider",
      visible: true,
      style: "line",
      height: 32,
    }),
  },
  {
    type: "video",
    label: "영상",
    icon: Video,
    create: () => ({
      id: nextId(),
      type: "video",
      visible: true,
      videoUrl: "",
      posterUrl: "",
    }),
  },
  {
    type: "cta",
    label: "CTA",
    icon: MousePointerClick,
    create: () => ({
      id: nextId(),
      type: "cta",
      visible: true,
      text: "지금 구매하세요",
      subtext: "한정 특가 진행 중",
      buttonLabel: "구매하기",
      buttonUrl: "#",
    }),
  },
];

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  return (
    <div className="flex w-56 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">블록</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-1.5">
          {TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            return (
              <button
                key={tmpl.type}
                onClick={() => onAddBlock(tmpl.create())}
                className="flex flex-col items-center gap-1 rounded-lg p-2.5 text-gray-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
              >
                <Icon className="h-5 w-5" />
                <span className="text-[11px] leading-tight">{tmpl.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
