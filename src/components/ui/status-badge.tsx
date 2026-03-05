/** 프로젝트 상태를 시각적으로 표시하는 배지 컴포넌트 */
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  generating: "bg-amber-50 text-amber-500 animate-pulse",
  generated: "bg-emerald-50 text-emerald-500",
  exported: "bg-indigo-50 text-indigo-600",
  failed: "bg-rose-50 text-rose-500",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "초안",
  generating: "생성 중...",
  generated: "생성 완료",
  exported: "내보내기 완료",
  failed: "실패",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600",
        className
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
