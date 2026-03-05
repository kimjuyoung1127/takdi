// Project status lifecycle: draft -> generating -> generated -> exported
// Fail path: draft -> generating -> failed
export type ProjectStatus = "draft" | "generating" | "generated" | "failed" | "exported";

export type PlanTier = "solo_free" | "starter" | "pro" | "agency";

export type AssetSourceType = "uploaded" | "generated" | "byoi_edited";

export type JobStatus = "queued" | "running" | "done" | "failed";

export interface GenerationResultSection {
  headline: string;
  body: string;
  imageSlot: string;
  styleKey: string;
}

export interface GenerationResult {
  sections: GenerationResultSection[];
}

export interface CutHandoffPayload {
  projectId: string;
  selectedImageId: string;
  preserveOriginal: boolean;
}

// Remotion composition IDs — keep stable for automation
export type CompositionId = "TakdiVideo_916" | "TakdiVideo_1x1" | "TakdiVideo_169";

export interface RemotionInputProps {
  title: string;
  sections: GenerationResultSection[];
  selectedImages: string[];
  bgmMetadata: {
    src: string;
    bpm?: number;
    durationMs?: number;
  };
  templateKey: string;
}
