"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { WorkspaceActivityItem } from "@/features/workspace-hub/home-feed";
import { getProjectDestination, type RecentProjectListItem } from "@/features/workspace-hub/project-filters";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  activity: WorkspaceActivityItem[];
}

export function NotificationPanel({ open, onClose, activity }: NotificationPanelProps) {
  const router = useRouter();

  const projectMap = useMemo(
    () =>
      new Map(
        activity
          .filter((item): item is WorkspaceActivityItem & { projectId: string; projectMode: string | null } => Boolean(item.projectId))
          .map((item) => [
            item.projectId,
            {
              id: item.projectId,
              name: item.detail.replace(" 프로젝트", ""),
              status: "generated",
              mode: item.projectMode,
              updatedAt: item.createdAt,
            } satisfies RecentProjectListItem,
          ]),
      ),
    [activity],
  );

  if (!open) {
    return null;
  }

  function handleOpenItem(item: WorkspaceActivityItem) {
    if (item.projectId) {
      const project = projectMap.get(item.projectId);
      if (project) {
        onClose();
        router.push(getProjectDestination(project));
        return;
      }
    }

    toast.message("연결된 프로젝트 정보가 없습니다.");
  }

  return (
    <div className="fixed inset-0 z-[71] bg-[#201A17]/20" onClick={onClose}>
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-[#E5DDD3] bg-[#FBF8F4] shadow-[-12px_0_40px_rgba(55,40,30,0.12)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E5DDD3] px-6 py-5">
          <div>
            <p className="text-sm font-medium text-[#D97C67]">Activity feed</p>
            <h2 className="mt-1 text-xl font-semibold text-[#201A17]">알림</h2>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => toast.success("현재 표시된 항목을 확인했습니다.")}
            className="rounded-2xl border-[#E2D7CB] bg-white text-xs font-medium text-[#4D433D] shadow-none hover:bg-[#F8F2EC]"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            모두 확인
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {activity.length > 0 ? (
            <div className="space-y-3">
              {activity.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleOpenItem(item)}
                  className="flex w-full items-start gap-3 rounded-[24px] border border-[#EEE5DC] bg-white px-4 py-4 text-left transition hover:bg-[#FCFAF7]"
                >
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#F1C8BE] bg-[#F8E7E2] text-[#D97C67]">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-[#201A17]">{item.label}</p>
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#9F8F81]" />
                    </div>
                    <p className="mt-1 text-sm leading-6 text-[#6F655D]">{item.detail}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-[#95867A]">
                      <span>{new Date(item.createdAt).toLocaleString("ko-KR")}</span>
                      <span>·</span>
                      <span>{item.costEstimate != null ? `$${item.costEstimate.toFixed(2)}` : "비용 기록 없음"}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center rounded-[28px] border border-dashed border-[#D5CCC3] bg-[#F8F4EF] p-10 text-center">
              <div>
                <p className="text-sm font-medium text-[#4D433D]">새 알림이 없습니다</p>
                <p className="mt-2 text-xs leading-5 text-[#8D7D70]">
                  내보내기 완료, 생성 실패, 최근 작업 상태가 이곳에 표시됩니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
