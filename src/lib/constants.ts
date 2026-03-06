/** 앱 전역 공유 상수 — 라벨 맵, 설정값 등 */

import type { BlockType } from "@/types/blocks";

/** 플로우 에디터 노드 타입 */
export type FlowNodeType = "prompt" | "generate-images" | "bgm" | "cuts" | "render" | "export" | "upload-image" | "remove-bg" | "model-compose";

/** 모드별 허용 노드 + 초기 파이프라인 설정 */
export interface ModeNodeConfig {
  allowedNodes: FlowNodeType[];
  initialPipeline: FlowNodeType[];
}

/** 모드→노드 매핑 */
export const MODE_NODE_CONFIG: Record<string, ModeNodeConfig> = {
  "brand-image": {
    allowedNodes: ["prompt", "generate-images", "export"],
    initialPipeline: ["prompt", "generate-images", "export"],
  },
  cutout: {
    allowedNodes: ["upload-image", "remove-bg", "export"],
    initialPipeline: ["upload-image", "remove-bg", "export"],
  },
  "model-shot": {
    allowedNodes: ["upload-image", "prompt", "model-compose", "export"],
    initialPipeline: ["upload-image", "prompt", "model-compose", "export"],
  },
  "gif-source": {
    allowedNodes: ["prompt", "generate-images", "render", "export"],
    initialPipeline: ["prompt", "generate-images", "render", "export"],
  },
  freeform: {
    allowedNodes: ["prompt", "generate-images", "bgm", "cuts", "render", "export"],
    initialPipeline: ["prompt", "generate-images", "render", "export"],
  },
};

export const DEFAULT_MODE_CONFIG: ModeNodeConfig = MODE_NODE_CONFIG["freeform"];

/** 노드 타입 → 한글 라벨 */
export const NODE_TYPE_LABELS: Record<FlowNodeType, string> = {
  prompt: "프롬프트 입력",
  "generate-images": "이미지 생성",
  bgm: "배경음악",
  cuts: "장면 편집",
  render: "영상/GIF 만들기",
  export: "내보내기",
  "upload-image": "이미지 업로드",
  "remove-bg": "배경 제거",
  "model-compose": "모델 합성",
};

/** 노드 타입 → 설명 */
export const NODE_TYPE_DESCS: Record<FlowNodeType, string> = {
  prompt: "원하는 내용을 직접 입력하세요",
  "generate-images": "장면별 이미지를 생성합니다",
  bgm: "배경음악을 설정합니다",
  cuts: "장면 순서와 전환을 편집합니다",
  render: "영상/GIF를 합성합니다",
  export: "최종 파일을 출력합니다",
  "upload-image": "상품 이미지를 업로드합니다",
  "remove-bg": "배경을 자동으로 제거합니다",
  "model-compose": "AI 모델 착용 이미지를 합성합니다",
};

/** 프로젝트 모드 → 한글 라벨 */
export const MODE_LABELS: Record<string, string> = {
  compose: "상세페이지",
  "model-shot": "모델 촬영",
  cutout: "누끼",
  "brand-image": "브랜드 이미지",
  "gif-source": "GIF",
  freeform: "자유 형식",
};

/** 상품 카테고리 → 라벨 (F1: 카테고리별 프롬프트) */
export const PRODUCT_CATEGORIES: Array<{ value: string; label: string }> = [
  { value: "fashion", label: "패션/의류" },
  { value: "beauty", label: "뷰티/스킨케어" },
  { value: "food", label: "식품/음료" },
  { value: "baby", label: "유아/아동" },
  { value: "electronics", label: "전자/가전" },
  { value: "home", label: "홈/리빙" },
];

/** 플랫폼 프리셋 (E1: 추가 플랫폼) */
export const PLATFORM_PRESETS: Array<{ value: string; label: string; width: number }> = [
  { value: "coupang", label: "쿠팡", width: 780 },
  { value: "naver", label: "네이버", width: 860 },
  { value: "11st", label: "11번가", width: 800 },
  { value: "gmarket", label: "G마켓", width: 860 },
  { value: "ssg", label: "SSG", width: 750 },
  { value: "own", label: "자사몰 (커스텀)", width: 900 },
];

/** 플랫폼 이름 → 너비 매핑 */
export const PLATFORM_WIDTHS: Record<string, number> = Object.fromEntries(
  PLATFORM_PRESETS.map((p) => [p.value, p.width]),
);

/** 테마 프리셋 (A1: 글로벌 컬러 팔레트) */
export const THEME_PRESETS: Array<{ name: string; label: string; palette: import("@/types/blocks").ThemePalette }> = [
  { name: "default", label: "기본", palette: { primary: "#4f46e5", secondary: "#6366f1", background: "#ffffff", text: "#111827", accent: "#f59e0b" } },
  { name: "warm", label: "따뜻한", palette: { primary: "#dc2626", secondary: "#f97316", background: "#fffbeb", text: "#1c1917", accent: "#eab308" } },
  { name: "cool", label: "시원한", palette: { primary: "#0284c7", secondary: "#06b6d4", background: "#f0f9ff", text: "#0c4a6e", accent: "#8b5cf6" } },
  { name: "nature", label: "자연", palette: { primary: "#16a34a", secondary: "#65a30d", background: "#f7fee7", text: "#14532d", accent: "#ca8a04" } },
  { name: "luxury", label: "럭셔리", palette: { primary: "#1f2937", secondary: "#6b7280", background: "#fafafa", text: "#111827", accent: "#d97706" } },
  { name: "pastel", label: "파스텔", palette: { primary: "#ec4899", secondary: "#a78bfa", background: "#fdf2f8", text: "#4a044e", accent: "#60a5fa" } },
  { name: "mono", label: "모노톤", palette: { primary: "#374151", secondary: "#6b7280", background: "#ffffff", text: "#111827", accent: "#374151" } },
];

/** 블록 타입 → 한글 라벨 */
export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  hero: "메인 배너",
  "selling-point": "핵심 장점",
  "image-full": "전체 이미지",
  "image-grid": "이미지 모음",
  "text-block": "텍스트",
  "image-text": "이미지+텍스트",
  "spec-table": "제품 사양표",
  comparison: "비교",
  review: "리뷰",
  divider: "구분선",
  video: "영상",
  cta: "구매 유도",
  "usage-steps": "사용 방법",
};
