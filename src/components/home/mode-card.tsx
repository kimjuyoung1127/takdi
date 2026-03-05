/** Home 화면의 모드 선택 카드 컴포넌트 */
"use client";

import { useRouter } from "next/navigation";
import {
  UserRound,
  Scissors,
  ImageIcon,
  Film,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
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
  className?: string;
}

export function ModeCard({
  mode,
  label,
  description,
  className,
}: ModeCardProps) {
  const Icon = ICON_MAP[mode] ?? Sparkles;
  const router = useRouter();

  async function handleClick() {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: `${label} Project`, mode, briefText: "" }),
    });
    if (res.ok) {
      const project = await res.json();
      router.push(`/projects/${project.id}/editor`);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex min-w-45 flex-col items-center gap-3 rounded-3xl bg-white p-6",
        "shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        "text-left",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="mt-1 text-xs text-gray-400">{description}</p>
      </div>
    </button>
  );
}
