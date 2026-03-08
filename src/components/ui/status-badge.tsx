/** 프로젝트 상태를 시각적으로 표시하는 배지 컴포넌트 */
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-[#EEE7DE] text-[#7D7168]",
  generating: "bg-[#FAE5DE] text-[#C76F58]",
  generated: "bg-[#E6F0E8] text-[#5D7D66]",
  exported: "bg-[#E8ECEF] text-[#55646F]",
  failed: "bg-[#F7E2E2] text-[#AD5C5C]",
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
  idle: "bg-[#EEE7DE] text-[#7D7168]",
  working: "bg-[#FAE5DE] text-[#C76F58]",
  done: "bg-[#E6F0E8] text-[#5D7D66]",
  error: "bg-[#F7E2E2] text-[#AD5C5C]",
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
