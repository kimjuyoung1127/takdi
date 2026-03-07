/** 블록 팔레트 — 13종 블록 카드, 클릭으로 캔버스에 추가 */
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
  ListOrdered,
} from "lucide-react";
import type { Block, BlockType } from "@/types/blocks";

interface BlockPaletteProps {
  onAddBlock: (block: Block) => void;
}

interface BlockTemplate {
  type: BlockType;
  label: string;
  desc: string;
  icon: React.ElementType;
  create: () => Block;
}

let paletteIdCounter = 0;
function nextId() {
  return `blk-${Date.now()}-${++paletteIdCounter}`;
}

export const BLOCK_TEMPLATES: BlockTemplate[] = [
  {
    type: "hero",
    label: "메인 배너",
    desc: "상단 메인 이미지 영역",
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
    label: "핵심 장점",
    desc: "제품의 핵심 장점을 카드로 보여줍니다",
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
    desc: "화면 가득 이미지 한 장",
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
    label: "이미지 모음",
    desc: "여러 이미지를 격자로 배치",
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
    desc: "제목과 본문 텍스트",
    icon: Type,
    create: () => ({
      id: nextId(),
      type: "text-block",
      visible: true,
      heading: "제목",
      body: "본문 내용을 입력하세요.",
      align: "left",
      fontSize: "base",
    }),
  },
  {
    type: "image-text",
    label: "이미지+텍스트",
    desc: "이미지와 설명을 나란히 배치",
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
    label: "제품 사양표",
    desc: "제품 사양을 표로 정리",
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
    desc: "Before & After 비교",
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
    desc: "고객 후기를 보여줍니다",
    icon: MessageSquare,
    create: () => ({
      id: nextId(),
      type: "review",
      visible: true,
      title: "고객 리뷰",
      reviews: [{ author: "고객", rating: 5, text: "만족합니다!" }],
      displayStyle: "card",
    }),
  },
  {
    type: "divider",
    label: "구분선",
    desc: "블록 사이 구분선/여백",
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
    desc: "영상 또는 GIF 삽입",
    icon: Video,
    create: () => ({
      id: nextId(),
      type: "video",
      visible: true,
      videoUrl: "",
      posterUrl: "",
      mediaType: "mp4",
    }),
  },
  {
    type: "cta",
    label: "구매 유도",
    desc: "구매 버튼 + 안내 문구",
    icon: MousePointerClick,
    create: () => ({
      id: nextId(),
      type: "cta",
      visible: true,
      text: "지금 구매하세요",
      subtext: "한정 특가 진행 중",
      buttonLabel: "구매하기",
      buttonUrl: "#",
      ctaStyle: "default",
    }),
  },
  {
    type: "usage-steps",
    label: "사용 방법",
    desc: "번호 순서로 사용 방법 안내",
    icon: ListOrdered,
    create: () => ({
      id: nextId(),
      type: "usage-steps",
      visible: true,
      title: "사용 방법",
      steps: [
        { imageUrl: "", label: "STEP 1", description: "설명을 입력하세요" },
        { imageUrl: "", label: "STEP 2", description: "설명을 입력하세요" },
        { imageUrl: "", label: "STEP 3", description: "설명을 입력하세요" },
      ],
    }),
  },
];

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  return (
    <div className="flex w-56 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">콘텐츠 블록</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-1.5">
          {BLOCK_TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            return (
              <button
                key={tmpl.type}
                onClick={() => onAddBlock(tmpl.create())}
                className="flex flex-col items-center gap-1 rounded-lg p-2.5 text-gray-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                title={tmpl.desc}
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
