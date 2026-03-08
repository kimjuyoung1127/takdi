"use client";

import { useState } from "react";
import { PREVIEW_TEMPLATE_OPTIONS } from "@/components/preview/remotion-preview-config";
import type { ExportArtifactRecord } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CompositionId, RemotionInputProps } from "@/types";
import { PreviewPlayerLoader } from "./preview-player-loader";
import { COMPOSITION_TO_TEMPLATE } from "./remotion-preview-config";
import { ShortformArtifactPanel } from "./shortform-artifact-panel";

export interface PreviewShellProps {
  projectId: string;
  initialCompositionId: CompositionId;
  inputProps: RemotionInputProps;
  projectName: string;
  projectMode: string | null;
  projectStatus: string;
  sectionCount: number;
  imageCount: number;
  posterSrc?: string;
  initialThumbnail: ExportArtifactRecord | null;
  initialMarketingScript: ExportArtifactRecord | null;
}

export function PreviewShell({
  projectId,
  initialCompositionId,
  inputProps,
  projectName,
  projectMode,
  projectStatus,
  sectionCount,
  imageCount,
  posterSrc,
  initialThumbnail,
  initialMarketingScript,
}: PreviewShellProps) {
  const [compositionId, setCompositionId] = useState<CompositionId>(initialCompositionId);
  const currentTemplateKey = COMPOSITION_TO_TEMPLATE[compositionId];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Preview runtime</p>
          <p className="text-sm text-slate-500">
            Status {projectStatus} · Sections {sectionCount} · Images {imageCount}
          </p>
        </div>
        <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          {PREVIEW_TEMPLATE_OPTIONS.map((option) => (
            <Button
              key={option.compositionId}
              type="button"
              size="sm"
              variant={compositionId === option.compositionId ? "default" : "ghost"}
              className={cn(
                "rounded-full px-4",
                compositionId === option.compositionId
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "text-slate-600",
              )}
              onClick={() => setCompositionId(option.compositionId)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <PreviewPlayerLoader
        compositionId={compositionId}
        inputProps={inputProps}
        projectName={projectName}
        sectionCount={sectionCount}
        imageCount={imageCount}
        posterSrc={posterSrc}
      />

      {projectMode === "shortform-video" ? (
        <ShortformArtifactPanel
          projectId={projectId}
          templateKey={currentTemplateKey}
          initialThumbnail={initialThumbnail}
          initialMarketingScript={initialMarketingScript}
        />
      ) : null}
    </div>
  );
}
