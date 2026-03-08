/** Home mode selection card component. */
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
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

const ICON_MAP: Record<string, LucideIcon> = {
  compose: LayoutPanelTop,
  "model-shot": UserRound,
  cutout: Scissors,
  "brand-image": ImageIcon,
  "gif-source": Film,
  freeform: Sparkles,
};

const NAVIGATION_FALLBACK_MS = 4000;

const CARD_STYLES: Record<string, { iconWrap: string; icon: string; accent: string; surface: string }> = {
  freeform: {
    iconWrap: "border-[#D7D3CE] bg-[#2A2522]",
    icon: "text-white",
    accent: "text-[#2A2522]",
    surface: "bg-[#F5F1EC]",
  },
  default: {
    iconWrap: "border-[#E6D5CF] bg-[#F8E6E1]",
    icon: "text-[#D97C67]",
    accent: "text-[#9E5B4D]",
    surface: "bg-white",
  },
};

interface ModeCardProps {
  mode: string;
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
  const Icon = ICON_MAP[mode] ?? Sparkles;
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
        "group flex min-h-[188px] min-w-45 flex-col justify-between rounded-[28px] border border-[#E3D9CE] p-6",
        "shadow-[0_16px_45px_rgba(55,40,30,0.05)]",
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D7C9BC] hover:shadow-[0_22px_55px_rgba(55,40,30,0.07)]",
        style.surface,
        "text-left",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors",
            style.iconWrap
          )}
        >
          {loading ? (
            <Loader2 className={cn("h-5 w-5 animate-spin", style.icon)} />
          ) : (
            <Icon className={cn("h-5 w-5", style.icon)} />
          )}
        </div>
        <span className="rounded-full border border-[#E8DED4] bg-white/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9F8F81]">
          {mode === "freeform" ? "Experimental" : "Guided"}
        </span>
      </div>

      <div className="mt-7">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A08E7E]">Workflow</p>
        <p className="mt-3 text-xl font-semibold tracking-[-0.02em] text-[#201A17]">{label}</p>
        <p className="mt-2 text-sm leading-6 text-[#6F655D]">{description}</p>
      </div>

      <div className="mt-7 flex items-center justify-between border-t border-[#EFE8DF] pt-4">
        <span className={cn("text-sm font-medium transition-colors group-hover:text-[#201A17]", style.accent)}>
          바로 시작
        </span>
        <span className="rounded-full bg-white/80 p-2 text-[#8D7D70] transition group-hover:bg-[#F8E6E1] group-hover:text-[#D97C67]">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}
