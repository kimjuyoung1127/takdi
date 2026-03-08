/** Filterable recent projects list with home-friendly tabs, search, and presets. */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, FolderOpen, Search } from "lucide-react";
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
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  const { messages } = useT();
  const [tab, setTab] = useState<ProjectKindTab>("all");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatusFilter>("all");
  const [dateRange, setDateRange] = useState<ProjectDateFilter>("any");

  const statusOptions = useMemo(() => getAvailableProjectStatuses(projects), [projects]);
  const filteredProjects = useMemo(
    () => filterProjects(projects, { tab, query, status, dateRange }),
    [dateRange, projects, query, status, tab],
  );
  const statusLabels: Record<ProjectStatusFilter, string> = {
    all: messages.common.status.all,
    draft: messages.common.status.draft,
    generating: messages.common.status.generating,
    generated: messages.common.status.generated,
    exported: messages.common.status.exported,
    failed: messages.common.status.failed,
  };
  const modeLabels: Record<string, string> = {
    compose: messages.common.mode.compose,
    "model-shot": messages.common.mode.modelShot,
    cutout: messages.common.mode.cutout,
    "brand-image": messages.common.mode.brandImage,
    "gif-source": messages.common.mode.gifSource,
    freeform: messages.common.mode.freeform,
  };

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[28px] border border-[#E5DDD3] bg-white/90 p-12 shadow-[0_18px_45px_rgba(55,40,30,0.05)]">
        <FolderOpen className="mb-3 h-10 w-10 text-[#C2B8AE]" />
        <p className="text-sm font-medium text-[#4D433D]">{messages.home.emptyProjectsTitle}</p>
        <p className="mt-1 text-xs text-[#8D7D70]">{messages.home.emptyProjectsDescription}</p>
      </div>
    );
  }

  return (
    <div className="rounded-[30px] border border-[#E5DDD3] bg-white/92 shadow-[0_18px_45px_rgba(55,40,30,0.05)]">
      <div className="border-b border-[#EEE5DC] px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
                    ? messages.common.filters.compose
                    : messages.common.filters.editor}
              </button>
            ))}
          </div>

          <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:justify-end">
            <label className="flex w-full items-center gap-2 rounded-2xl border border-[#E3D9CE] bg-[#F7F3EE] px-3 py-2.5 text-sm text-[#8D7D70] lg:max-w-xs">
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
              className="rounded-2xl border border-[#E3D9CE] bg-white px-3 py-2.5 text-sm text-[#5E544E]"
            >
              {statusOptions.map((value) => (
                <option key={value} value={value}>
                  {statusLabels[value]}
                </option>
              ))}
            </select>

            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value as ProjectDateFilter)}
              className="rounded-2xl border border-[#E3D9CE] bg-white px-3 py-2.5 text-sm text-[#5E544E]"
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
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-medium text-[#4D433D]">{messages.home.noProjectsMatchTitle}</p>
          <p className="mt-1 text-xs text-[#8D7D70]">{messages.home.noProjectsMatchDescription}</p>
        </div>
      ) : (
        <div className="space-y-3 p-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col gap-4 rounded-[24px] border border-[#EEE5DC] bg-[#FCFAF7] px-5 py-4 transition-colors hover:bg-white md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ECE3D9] bg-white text-[#9D8E81]">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#201A17]">{project.name}</p>
                  <p className="mt-1 text-xs text-[#8D7D70]">
                    {modeLabels[project.mode ?? "freeform"] ?? project.mode ?? messages.common.mode.editorFallback} &middot;{" "}
                    {new Date(project.updatedAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <StatusBadge status={project.status} className="rounded-full" />
                <Link href={getProjectDestination(project)}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-2xl border-[#E2D7CB] bg-white text-xs font-medium text-[#4D433D] shadow-none hover:bg-[#F8F2EC]"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {project.mode === "compose"
                      ? `${messages.common.mode.compose} 열기`
                      : messages.common.actions.openEditor}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
