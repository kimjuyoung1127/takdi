/** Home mode selection card component. */
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
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
  const router = useRouter();
  const pathname = usePathname();
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
      const project = await createProject({ name: `${label} project`, mode, briefText: "" });
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
      toast.error("Failed to create project");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "flex min-w-45 flex-col items-center gap-3 rounded-3xl bg-white p-6",
        "shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        "text-left",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Icon className="h-6 w-6" />}
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="mt-1 text-xs text-gray-400">{description}</p>
      </div>
    </button>
  );
}
