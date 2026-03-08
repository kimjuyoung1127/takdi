"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RecentProjectListItem, SavedTemplateListItem } from "@/features/workspace-hub/project-filters";
import type { WorkspaceActivityItem } from "@/features/workspace-hub/home-feed";
import { DirectUploadLauncher } from "./direct-upload-launcher";
import { GlobalStartLauncher } from "./global-start-launcher";
import { GlobalSearchOverlay } from "./global-search-overlay";
import { NotificationPanel } from "./notification-panel";

interface AppHeaderProps {
  workspaceName: string;
  projects: RecentProjectListItem[];
  templates: SavedTemplateListItem[];
  recentActivity: WorkspaceActivityItem[];
}

export function AppHeader({
  workspaceName,
  projects,
  templates,
  recentActivity,
}: AppHeaderProps) {
  const pathname = usePathname();
  const [startOpen, setStartOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    setStartOpen(false);
    setUploadOpen(false);
    setSearchOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header className="flex h-20 shrink-0 items-center justify-between border-b border-[#E5DDD3] bg-[#F4F1EC]/95 px-6 backdrop-blur lg:px-8">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex min-w-0 items-center gap-2 rounded-2xl border border-[#E4D9CD] bg-[#FBF8F4] px-4 py-3 text-sm text-[#9A8B7E] shadow-[0_8px_24px_rgba(55,40,30,0.04)] transition hover:border-[#D8C9BB] hover:bg-white"
        >
          <Search className="h-4 w-4" />
          <span className="truncate">프로젝트, 템플릿, 작업 찾기</span>
          <span className="ml-3 rounded-full border border-[#E5DDD3] bg-white px-2 py-1 text-[11px] text-[#8E8176]">
            Ctrl K
          </span>
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setNotificationsOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E5DDD3] bg-[#FBF8F4] text-[#8E8176] transition-colors hover:bg-white hover:text-[#4D433D]"
            title="알림"
          >
            <Bell className="h-5 w-5" />
          </button>

          <Link
            href="/workspace"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5DDD3] bg-white/80 text-[#8E8176] transition-colors hover:bg-white hover:text-[#4D433D]"
            title={`${workspaceName} 워크스페이스`}
          >
            <User className="h-4 w-4" />
          </Link>

          <Button
            type="button"
            onClick={() => setStartOpen(true)}
            className="h-10 rounded-2xl bg-[#D97C67] px-5 text-white shadow-[0_14px_30px_rgba(217,124,103,0.22)] hover:bg-[#CF705A]"
          >
            작업 시작
          </Button>
        </div>
      </header>

      <GlobalStartLauncher
        open={startOpen}
        onClose={() => setStartOpen(false)}
        onDirectUpload={() => {
          setStartOpen(false);
          setUploadOpen(true);
        }}
      />
      <DirectUploadLauncher open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <GlobalSearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        workspaceName={workspaceName}
        projects={projects}
        templates={templates}
      />
      <NotificationPanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        activity={recentActivity}
      />
    </>
  );
}
