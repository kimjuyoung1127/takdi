/** Filterable recent projects list with optional collapsible drawer for home. */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, FolderOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatShowingProjects } from "@/i18n/format";
import { useT } from "@/i18n/use-t";
import {
  PROJECT_DATE_FILTERS,
  PROJECT_KIND_TABS,
  filterProjects,
  getAvailableProjectStatuses,
  getProjectDestination,
  type ProjectDateFilter,
  type ProjectKindTab,
  type ProjectStatusFilter,
  type RecentProjectListItem,
} from "@/features/workspace-hub/project-filters";

interface RecentProjectsProps {
  projects: RecentProjectListItem[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function RecentProjects({
  projects,
  collapsible = false,
  defaultCollapsed = false,
}: RecentProjectsProps) {
  const { messages } = useT();
  const [tab, setTab] = useState<ProjectKindTab>("all");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatusFilter>("all");
  const [dateRange, setDateRange] = useState<ProjectDateFilter>("any");
  const [collapsed, setCollapsed] = useState(collapsible ? defaultCollapsed : false);

  const statusOptions = useMemo(() => getAvailableProjectStatuses(projects), [projects]);
  const filteredProjects = useMemo(
    () => filterProjects(projects, { tab, query, status, dateRange }),
    [dateRange, projects, query, status, tab],
  );
  const modeLabels: Record<string, string> = {
    compose: "상세페이지",
    "shortform-video": "숏폼 영상",
    "model-shot": messages.common.mode.modelShot,
    cutout: messages.common.mode.cutout,
    "brand-image": messages.common.mode.brandImage,
    "gif-source": messages.common.mode.gifSource,
    freeform: messages.common.mode.freeform,
  };
  const latestNames = projects.slice(0, 3).map((project) => project.name).join(" · ");

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[24px] border border-[#E5DDD3] bg-white/90 p-8 shadow-[0_14px_36px_rgba(55,40,30,0.05)]">
        <FolderOpen className="mb-3 h-8 w-8 text-[#C2B8AE]" />
        <p className="text-sm font-medium text-[#4D433D]">{messages.home.emptyProjectsTitle}</p>
        <p className="mt-1 text-xs text-[#8D7D70]">{messages.home.emptyProjectsDescription}</p>
      </div>
    );
  }

  return (
    <div className="rounded-[26px] border border-[#E5DDD3] bg-white/92 shadow-[0_14px_36px_rgba(55,40,30,0.05)]">
      {collapsible ? (
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        >
          <div>
            <p className="text-sm font-medium text-[#201A17]">최근 프로젝트 {projects.length}개</p>
            <p className="mt-1 text-xs text-[#8D7D70]">
              {collapsed ? latestNames || messages.home.emptyProjectsHint : "필요할 때 펼쳐서 이어서 작업할 수 있습니다."}
            </p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DDD3] bg-[#F8F4EF] text-[#7A6F67]">
            <ArrowDown
              className={`h-4 w-4 transition-transform ${collapsed ? "" : "rotate-180"}`}
            />
          </span>
        </button>
      ) : null}

      {!collapsed ? (
        <>
          <div className={`${collapsible ? "border-t border-[#EEE5DC]" : "border-b border-[#EEE5DC]"} px-5 py-4`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="inline-flex w-fit rounded-full border border-[#E5DDD3] bg-[#F6F1EB] p-1">
                {PROJECT_KIND_TABS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTab(item)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      tab === item
                        ? "bg-white text-[#201A17] shadow-sm"
                        : "text-[#7A6F67] hover:text-[#4D433D]"
                    }`}
                  >
                    {item === "all"
                      ? messages.common.filters.all
                      : item === "compose"
                        ? "상세페이지"
                        : messages.common.filters.editor}
                  </button>
                ))}
              </div>

              <div className="flex flex-1 flex-col gap-2 lg:flex-row lg:justify-end">
                <label className="flex w-full items-center gap-2 rounded-2xl border border-[#E3D9CE] bg-[#F7F3EE] px-3 py-2 text-sm text-[#8D7D70] lg:max-w-xs">
                  <Search className="h-4 w-4" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={messages.common.filters.searchProjectName}
                    className="w-full bg-transparent text-sm text-[#4D433D] outline-none placeholder:text-[#A08E7E]"
                  />
                </label>

                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value as ProjectStatusFilter)}
                  className="rounded-2xl border border-[#E3D9CE] bg-white px-3 py-2 text-sm text-[#5E544E]"
                >
                  {statusOptions.map((value) => (
                    <option key={value} value={value}>
                      {value === "all"
                        ? messages.common.status.all
                        : messages.common.status[value]}
                    </option>
                  ))}
                </select>

                <select
                  value={dateRange}
                  onChange={(event) => setDateRange(event.target.value as ProjectDateFilter)}
                  className="rounded-2xl border border-[#E3D9CE] bg-white px-3 py-2 text-sm text-[#5E544E]"
                >
                  {PROJECT_DATE_FILTERS.map((item) => (
                    <option key={item} value={item}>
                      {item === "any"
                        ? messages.common.filters.anyTime
                        : item === "today"
                          ? messages.common.filters.today
                          : item === "last7"
                            ? messages.common.filters.last7Days
                            : messages.common.filters.last30Days}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="mt-3 text-xs text-[#95867A]">
              {formatShowingProjects(messages, filteredProjects.length, projects.length)}
            </p>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm font-medium text-[#4D433D]">{messages.home.noProjectsMatchTitle}</p>
              <p className="mt-1 text-xs text-[#8D7D70]">{messages.home.noProjectsMatchDescription}</p>
            </div>
          ) : (
            <div className="space-y-2 p-3">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col gap-3 rounded-[20px] border border-[#EEE5DC] bg-[#FCFAF7] px-4 py-3 transition-colors hover:bg-white md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[#ECE3D9] bg-white text-[#9D8E81]">
                      <FolderOpen className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#201A17]">{project.name}</p>
                      <p className="mt-1 truncate text-xs text-[#8D7D70]">
                        {modeLabels[project.mode ?? "freeform"] ?? project.mode ?? messages.common.mode.editorFallback}
                        {" · "}
                        {new Date(project.updatedAt).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <StatusBadge status={project.status} className="rounded-full" />
                    <Link href={getProjectDestination(project)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-2xl border-[#E2D7CB] bg-white text-xs font-medium text-[#4D433D] shadow-none hover:bg-[#F8F2EC]"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        {project.mode === "compose" ? "상세페이지 열기" : messages.common.actions.openEditor}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
