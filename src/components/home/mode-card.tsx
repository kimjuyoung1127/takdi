/** Home 화면의 모드 선택 카드 컴포넌트 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      const project = await createProject({ name: `${label} 프로젝트`, mode, briefText: "" });
      const target = editorMode === "compose"
        ? `/projects/${project.id}/compose`
        : `/projects/${project.id}/editor`;
      router.prefetch(target);
      router.push(target);
    } catch {
      toast.error("프로젝트 생성에 실패했습니다");
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
