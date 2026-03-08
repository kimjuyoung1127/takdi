"use client";

import { useState } from "react";
import { ArrowUpRight, Upload } from "lucide-react";
import { ModeCard } from "@/components/home/mode-card";
import { DirectUploadLauncher } from "@/components/layout/direct-upload-launcher";
import { START_MODE_DEFINITIONS } from "@/features/workspace-hub/start-modes";
import { useT } from "@/i18n/use-t";

export function HomeStartGrid() {
  const { messages } = useT();
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
        {START_MODE_DEFINITIONS.map((mode) => (
          <ModeCard
            key={mode.mode}
            mode={mode.mode}
            label={mode.label}
            description={mode.description}
            editorMode={mode.editorMode}
          />
        ))}

        <button
          type="button"
          onClick={() => setUploadOpen(true)}
          className="group flex min-h-[118px] min-w-40 flex-col rounded-[22px] border border-dashed border-[#D9CDC0] bg-[#F8F5F0] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#D97C67] hover:bg-white"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#E6D8CB] bg-white text-[#8D7D70] transition group-hover:border-[#F1C5BA] group-hover:bg-[#F9E7E2] group-hover:text-[#D97C67]">
              <Upload className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-[15px] font-semibold tracking-[-0.02em] text-[#201A17]">
                  {messages.home.directUploadTitle}
                </p>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[#9F8F81] transition group-hover:text-[#D97C67]" />
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#6F655D]">
                {messages.home.directUploadDescription}
              </p>
            </div>
          </div>
        </button>
      </div>

      <DirectUploadLauncher open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </>
  );
}
