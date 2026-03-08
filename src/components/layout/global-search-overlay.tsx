"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Bookmark, Loader2, Search, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatTemplateStartFailed } from "@/i18n/format";
import { useT } from "@/i18n/use-t";
import {
  filterProjects,
  filterTemplates,
  getProjectDestination,
  type RecentProjectListItem,
  type SavedTemplateListItem,
} from "@/features/workspace-hub/project-filters";
import { startComposeTemplate } from "@/features/workspace-hub/start-compose-template";

interface GlobalSearchOverlayProps {
  open: boolean;
  onClose: () => void;
  workspaceName: string;
  projects: RecentProjectListItem[];
  templates: SavedTemplateListItem[];
}

export function GlobalSearchOverlay({
  open,
  onClose,
  workspaceName,
  projects,
  templates,
}: GlobalSearchOverlayProps) {
  const router = useRouter();
  const { messages } = useT();
  const [query, setQuery] = useState("");
  const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  const visibleProjects = useMemo(
    () => filterProjects(projects, { tab: "all", query, status: "all", dateRange: "any" }).slice(0, 6),
    [projects, query],
  );

  const visibleTemplates = useMemo(
    () => filterTemplates(templates, query).slice(0, 6),
    [query, templates],
  );

  if (!open) {
    return null;
  }

  async function handleTemplateStart(templateId: string) {
    if (loadingTemplateId) {
      return;
    }

    setLoadingTemplateId(templateId);
    try {
      const started = await startComposeTemplate(templateId);
      onClose();
      router.push(started.destination);
    } catch (error) {
      toast.error(formatTemplateStartFailed(
        messages,
        error instanceof Error ? error.message : "알 수 없는 오류",
      ));
    } finally {
      setLoadingTemplateId(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[72] flex items-start justify-center bg-[#201A17]/28 px-6 pt-20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-[32px] border border-[#E5DDD3] bg-[#FBF8F4] p-5 shadow-[0_24px_60px_rgba(55,40,30,0.14)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 rounded-[24px] border border-[#E4D9CD] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(55,40,30,0.05)]">
          <Search className="h-4 w-4 text-[#9A8B7E]" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="프로젝트, 템플릿, 워크스페이스를 찾으세요"
            className="w-full bg-transparent text-sm text-[#201A17] outline-none placeholder:text-[#9A8B7E]"
          />
          <span className="rounded-full border border-[#E5DDD3] bg-[#F8F4EF] px-2 py-1 text-[11px] text-[#8E8176]">
            ESC
          </span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_1fr_0.85fr]">
          <section className="rounded-[26px] border border-[#E5DDD3] bg-white p-4 shadow-[0_12px_30px_rgba(55,40,30,0.05)]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#201A17]">프로젝트</h3>
              <span className="text-[11px] text-[#95867A]">{visibleProjects.length}개</span>
            </div>

            <div className="space-y-2">
              {visibleProjects.length > 0 ? visibleProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push(getProjectDestination(project));
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-[20px] border border-[#EEE5DC] bg-[#FCFAF7] px-3 py-3 text-left transition hover:bg-white"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#201A17]">{project.name}</p>
                    <p className="mt-1 truncate text-xs text-[#8D7D70]">
                      {project.mode === "compose" ? "상세페이지" : "에디터"} · {new Date(project.updatedAt).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#9F8F81]" />
                </button>
              )) : (
                <p className="py-10 text-center text-sm text-[#8D7D70]">일치하는 프로젝트가 없습니다.</p>
              )}
            </div>
          </section>

          <section className="rounded-[26px] border border-[#E5DDD3] bg-white p-4 shadow-[0_12px_30px_rgba(55,40,30,0.05)]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#201A17]">저장된 템플릿</h3>
              <span className="text-[11px] text-[#95867A]">{visibleTemplates.length}개</span>
            </div>

            <div className="space-y-2">
              {visibleTemplates.length > 0 ? visibleTemplates.map((template) => {
                const isLoading = loadingTemplateId === template.id;
                return (
                  <div key={template.id} className="rounded-[20px] border border-[#EEE5DC] bg-[#FCFAF7] px-3 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[#EDD8D0] bg-[#FAECE7] text-[#D97C67]">
                        <Bookmark className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#201A17]">{template.name}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#8D7D70]">
                          {template.previewTitle ?? messages.home.templatePreviewFallback}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void handleTemplateStart(template.id)}
                          disabled={isLoading}
                          className="mt-3 rounded-2xl border-[#E2D7CB] bg-white text-xs font-medium text-[#4D433D] shadow-none hover:bg-[#F8F2EC]"
                        >
                          {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                          {isLoading ? "열어가는 중" : messages.common.actions.useTemplate}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <p className="py-10 text-center text-sm text-[#8D7D70]">일치하는 템플릿이 없습니다.</p>
              )}
            </div>
          </section>

          <section className="rounded-[26px] border border-[#E5DDD3] bg-white p-4 shadow-[0_12px_30px_rgba(55,40,30,0.05)]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#201A17]">사람 · 워크스페이스</h3>
              <span className="text-[11px] text-[#95867A]">1개</span>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                router.push("/workspace");
              }}
              className="flex w-full items-center gap-3 rounded-[20px] border border-[#EEE5DC] bg-[#FCFAF7] px-3 py-3 text-left transition hover:bg-white"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[#E5DDD3] bg-[#F8F4EF] text-[#8E8176]">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#201A17]">{workspaceName}</p>
                <p className="mt-1 text-xs text-[#8D7D70]">워크스페이스 허브와 운영 상태를 확인합니다.</p>
              </div>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
