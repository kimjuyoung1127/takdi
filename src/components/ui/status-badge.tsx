/** 프로젝트 상태를 시각적으로 표시하는 배지 컴포넌트 */
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  generating: "bg-amber-50 text-amber-500 animate-pulse",
  generated: "bg-emerald-50 text-emerald-500",
  exported: "bg-indigo-50 text-indigo-600",
  failed: "bg-rose-50 text-rose-500",
};

export const STATUS_LABELS: Record<string, string> = {
  draft: "초안",
  generating: "생성 중...",
  generated: "생성 완료",
  exported: "내보내기 완료",
  failed: "실패",
  running: "진행 중",
  done: "완료",
  error: "오류",
};

interface StatusBadgeProps {
  status: string;
  label?: string;
  tone?: "idle" | "working" | "done" | "error";
  className?: string;
}

const TONE_STYLES: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  idle: "bg-gray-100 text-gray-600",
  working: "bg-amber-50 text-amber-500",
  done: "bg-emerald-50 text-emerald-500",
  error: "bg-rose-50 text-rose-500",
};

export function StatusBadge({ status, label, tone, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone ? TONE_STYLES[tone] : STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600",
        className
      )}
    >
      {label ?? STATUS_LABELS[status] ?? "알 수 없음"}
    </span>
  );
}
