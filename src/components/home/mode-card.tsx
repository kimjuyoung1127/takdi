/** Home mode selection card component. */
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Clapperboard,
  UserRound,
  Scissors,
  ImageIcon,
  Film,
  Sparkles,
  LayoutPanelTop,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { formatCreateProjectName } from "@/i18n/format";
import { useT } from "@/i18n/use-t";
import { cn } from "@/lib/utils";
import { createProject } from "@/lib/api-client";
import type { ProjectMode } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = {
  compose: LayoutPanelTop,
  "model-shot": UserRound,
  cutout: Scissors,
  "brand-image": ImageIcon,
  "gif-source": Film,
  freeform: Sparkles,
};

export function getModeIcon(mode: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    ...ICON_MAP,
    "shortform-video": Clapperboard,
  };
  return iconMap[mode] ?? Sparkles;
}

const NAVIGATION_FALLBACK_MS = 4000;

const CARD_STYLES: Record<string, { iconWrap: string; icon: string; surface: string }> = {
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

interface ModeCardProps {
  mode: ProjectMode;
  label: string;
  description: string;
  editorMode?: "flow" | "compose";
  className?: string;
}

export function ModeCard({
  mode,
  label,
  description,
  editorMode,
  className,
}: ModeCardProps) {
  const Icon = getModeIcon(mode);
  const style = CARD_STYLES[mode] ?? CARD_STYLES.default;
  const router = useRouter();
  const pathname = usePathname();
  const { messages } = useT();
  const [loading, setLoading] = useState(false);
  const pendingTargetRef = useRef<string | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const pendingTarget = pendingTargetRef.current;
    if (!pendingTarget) {
      return;
    }

    if (pathname === pendingTarget) {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }

      pendingTargetRef.current = null;
      setLoading(false);
      console.timeEnd(`[ModeCard] navigation:${mode}`);
    }
  }, [mode, pathname]);

  useEffect(() => {
    return () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
    };
  }, []);

  async function handleClick() {
    if (loading) return;

    const createProjectLabel = `[ModeCard] createProject:${mode}`;
    const navigationLabel = `[ModeCard] navigation:${mode}`;

    setLoading(true);
    console.time(createProjectLabel);

    try {
      const project = await createProject({
        name: formatCreateProjectName(messages, label),
        mode,
        briefText: "",
      });
      console.timeEnd(createProjectLabel);

      const target = editorMode === "compose"
        ? `/projects/${project.id}/compose`
        : `/projects/${project.id}/editor`;

      pendingTargetRef.current = target;
      console.time(navigationLabel);

      if (process.env.NODE_ENV === "production") {
        console.info(`[ModeCard] prefetch:${mode}`, target);
        router.prefetch(target);
      } else {
        console.info(`[ModeCard] skip prefetch in dev:${mode}`, target);
      }

      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
      fallbackTimerRef.current = setTimeout(() => {
        if (pendingTargetRef.current === target && window.location.pathname !== target) {
          console.warn(`[ModeCard] navigation fallback:${mode}`, target);
          window.location.assign(target);
        }
      }, NAVIGATION_FALLBACK_MS);

      console.info(`[ModeCard] push:${mode}`, target);
      router.push(target);
    } catch {
      console.timeEnd(createProjectLabel);
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      pendingTargetRef.current = null;
      toast.error(messages.modeCard.createProjectFailed);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "group flex min-h-[118px] min-w-40 flex-col rounded-[22px] border border-[#E3D9CE] p-4",
        "shadow-[0_12px_30px_rgba(55,40,30,0.045)]",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D7C9BC] hover:shadow-[0_16px_36px_rgba(55,40,30,0.06)]",
        style.surface,
        "text-left",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-colors",
            style.iconWrap,
          )}
        >
          {loading ? (
            <Loader2 className={cn("h-4 w-4 animate-spin", style.icon)} />
          ) : (
            <Icon className={cn("h-4 w-4", style.icon)} />
          )}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-[15px] font-semibold tracking-[-0.02em] text-[#201A17]">{label}</p>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-[#9F8F81] transition group-hover:text-[#D97C67]" />
          </div>
          <p className="mt-1 line-clamp-1 text-xs leading-5 text-[#6F655D]">{description}</p>
        </div>
      </div>
    </button>
  );
}
