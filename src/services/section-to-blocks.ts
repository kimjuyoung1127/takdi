/** GenerationResult.sections → Block[] 변환기 (9단 매핑) */
import type { GenerationResultSection } from "@/types";
import type { Block } from "@/types/blocks";

const SECTION_MAP: Record<string, Block["type"]> = {
  hero: "hero",
  brand: "image-text",
  "selling-point": "selling-point",
  detail: "image-full",
  usage: "image-text",
  spec: "spec-table",
  comparison: "comparison",
  review: "review",
  cta: "cta",
};

let blockIdCounter = 0;
function nextId() {
  return `blk-${Date.now()}-${++blockIdCounter}`;
}

export function sectionsToBlocks(sections: GenerationResultSection[]): Block[] {
  blockIdCounter = 0;

  return sections.map((section, idx) => {
    const blockType = SECTION_MAP[section.styleKey] ?? inferType(idx, sections.length);

    switch (blockType) {
      case "hero":
        return {
          id: nextId(),
          type: "hero",
          visible: true,
          imageUrl: "",
          overlays: [
            {
              id: `ovl-${Date.now()}-${idx}`,
              text: section.headline,
              x: 50,
              y: 50,
              fontSize: 32,
              color: "#ffffff",
              fontWeight: "bold" as const,
              textAlign: "center" as const,
            },
          ],
        };

      case "selling-point":
        return {
          id: nextId(),
          type: "selling-point",
          visible: true,
          items: [
            { icon: "star", title: section.headline, description: section.body },
          ],
        };

      case "image-full":
        return {
          id: nextId(),
          type: "image-full",
          visible: true,
          imageUrl: "",
          overlays: [],
        };

      case "image-text":
        return {
          id: nextId(),
          type: "image-text",
          visible: true,
          imageUrl: "",
          imagePosition: idx % 2 === 0 ? "left" as const : "right" as const,
          heading: section.headline,
          body: section.body,
        };

      case "spec-table":
        return {
          id: nextId(),
          type: "spec-table",
          visible: true,
          title: section.headline,
          rows: section.body.split("\n").filter(Boolean).map((line) => {
            const [label, ...rest] = line.split(":");
            return { label: label.trim(), value: rest.join(":").trim() || line };
          }),
        };

      case "comparison":
        return {
          id: nextId(),
          type: "comparison",
          visible: true,
          title: section.headline,
          before: { label: "Before", imageUrl: "" },
          after: { label: "After", imageUrl: "" },
        };

      case "review":
        return {
          id: nextId(),
          type: "review",
          visible: true,
          title: section.headline,
          reviews: [{ author: "고객", rating: 5, text: section.body }],
        };

      case "cta":
        return {
          id: nextId(),
          type: "cta",
          visible: true,
          text: section.headline,
          subtext: section.body,
          buttonLabel: "지금 구매하기",
          buttonUrl: "#",
        };

      default:
        return {
          id: nextId(),
          type: "text-block",
          visible: true,
          heading: section.headline,
          body: section.body,
          align: "left" as const,
        };
    }
  });
}

/** styleKey가 없을 때 위치 기반 추론 */
function inferType(index: number, total: number): Block["type"] {
  if (index === 0) return "hero";
  if (index === total - 1) return "cta";
  if (index === 1) return "selling-point";
  return "text-block";
}
