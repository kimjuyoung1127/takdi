/** 앱 전역 공유 상수 — 라벨 맵, 설정값 등 */

import type { BlockType } from "@/types/blocks";

/** 플로우 에디터 노드 타입 */
export type FlowNodeType = "prompt" | "generate-images" | "bgm" | "cuts" | "render" | "export";

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
    allowedNodes: ["prompt", "generate-images", "export"],
    initialPipeline: ["prompt", "generate-images", "export"],
  },
  "model-shot": {
    allowedNodes: ["prompt", "generate-images", "export"],
    initialPipeline: ["prompt", "generate-images", "export"],
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
};

/** 노드 타입 → 설명 */
export const NODE_TYPE_DESCS: Record<FlowNodeType, string> = {
  prompt: "원하는 내용을 직접 입력하세요",
  "generate-images": "장면별 이미지를 생성합니다",
  bgm: "배경음악을 설정합니다",
  cuts: "장면 순서와 전환을 편집합니다",
  render: "영상/GIF를 합성합니다",
  export: "최종 파일을 출력합니다",
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
};
