"use client";

import { useState } from "react";
import { PREVIEW_TEMPLATE_OPTIONS } from "@/components/preview/remotion-preview-config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CompositionId, RemotionInputProps } from "@/types";
import { PreviewPlayerLoader } from "./preview-player-loader";

export interface PreviewShellProps {
  initialCompositionId: CompositionId;
  inputProps: RemotionInputProps;
  projectName: string;
  projectStatus: string;
  sectionCount: number;
  imageCount: number;
  posterSrc?: string;
}

export function PreviewShell({
  initialCompositionId,
  inputProps,
  projectName,
  projectStatus,
  sectionCount,
  imageCount,
  posterSrc,
}: PreviewShellProps) {
  const [compositionId, setCompositionId] = useState<CompositionId>(initialCompositionId);

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
    </div>
  );
}
