"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { createProject } from "@/lib/api-client";
import { formatCreateProjectName } from "@/i18n/format";
import { useT } from "@/i18n/use-t";
import { cn } from "@/lib/utils";
import { START_MODE_DEFINITIONS } from "@/features/workspace-hub/start-modes";
import { getModeIcon } from "@/components/home/mode-card";

interface GlobalStartLauncherProps {
  open: boolean;
  onClose: () => void;
  onDirectUpload: () => void;
}

const ITEM_STYLES: Record<string, { iconWrap: string; icon: string; surface: string }> = {
  freeform: {
    iconWrap: "border-[#F1C8BE] bg-[#F8E7E2]",
    icon: "text-[#D97C67]",
    surface: "bg-[#F7F1EA]",
  },
  default: {
    iconWrap: "border-[#E6D5CF] bg-[#F8E6E1]",
    icon: "text-[#D97C67]",
    surface: "bg-white",
  },
};

export function GlobalStartLauncher({ open, onClose, onDirectUpload }: GlobalStartLauncherProps) {
  const router = useRouter();
  const { messages } = useT();
  const [loadingMode, setLoadingMode] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  async function handleItemClick(item: (typeof START_MODE_DEFINITIONS)[number]) {
    if (loadingMode) {
      return;
    }

    setLoadingMode(item.mode);
    try {
      const project = await createProject({
        name: formatCreateProjectName(messages, item.label),
        mode: item.mode,
        briefText: "",
      });

      const href = item.editorMode === "compose"
        ? `/projects/${project.id}/compose`
        : `/projects/${project.id}/editor`;

      onClose();
      router.push(href);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : messages.modeCard.createProjectFailed,
      );
    } finally {
      setLoadingMode(null);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-[#201A17]/28 px-6 pt-24 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-5xl rounded-[32px] border border-[#E5DDD3] bg-[#FBF8F4] p-6 shadow-[0_24px_60px_rgba(55,40,30,0.14)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#D97C67]">Workspace launcher</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#201A17]">작업 시작</h2>
            <p className="mt-2 text-sm text-[#6F655D]">
              원하는 작업 유형을 선택하면 바로 다음 화면으로 이동합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#E5DDD3] bg-white px-4 py-2 text-sm font-medium text-[#6F655D] transition hover:bg-[#F8F4EF] hover:text-[#201A17]"
          >
            닫기
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {START_MODE_DEFINITIONS.map((item) => {
            const Icon = getModeIcon(item.mode);
            const key = item.mode;
            const style = ITEM_STYLES[item.mode] ?? ITEM_STYLES.default;
            const loading = loadingMode === item.mode;

            return (
              <button
                key={key}
                type="button"
                onClick={() => void handleItemClick(item)}
                disabled={Boolean(loadingMode)}
                className={cn(
                  "group flex min-h-[120px] flex-col rounded-[24px] border border-[#E3D9CE] p-4 text-left shadow-[0_12px_30px_rgba(55,40,30,0.045)] transition-all duration-200",
                  "hover:-translate-y-0.5 hover:border-[#D7C9BC] hover:shadow-[0_16px_36px_rgba(55,40,30,0.06)]",
                  style.surface,
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border", style.iconWrap)}>
                    {loading ? (
                      <Loader2 className={cn("h-4 w-4 animate-spin", style.icon)} />
                    ) : (
                      <Icon className={cn("h-4 w-4", style.icon)} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-[15px] font-semibold tracking-[-0.02em] text-[#201A17]">{item.label}</p>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-[#9F8F81] transition group-hover:text-[#D97C67]" />
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#6F655D]">{item.description}</p>
                  </div>
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={onDirectUpload}
            disabled={Boolean(loadingMode)}
            className="group flex min-h-[120px] flex-col rounded-[24px] border border-dashed border-[#D9CDC0] bg-[#F8F5F0] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#D97C67] hover:bg-white disabled:opacity-60"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#E6D8CB] bg-white text-[#8D7D70] transition group-hover:border-[#F1C5BA] group-hover:bg-[#F9E7E2] group-hover:text-[#D97C67]">
                <Upload className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-[15px] font-semibold tracking-[-0.02em] text-[#201A17]">직접 업로드</p>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#9F8F81] transition group-hover:text-[#D97C67]" />
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#6F655D]">
                  보유한 에셋을 먼저 올리고 시작합니다
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
