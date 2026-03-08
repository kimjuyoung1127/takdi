/** Saved template list with drawer, single-item menu actions, and optional bulk deletion. */
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUpRight, Bookmark, Loader2, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/home/delete-confirm-dialog";
import { ItemActionsMenu } from "@/components/home/item-actions-menu";
import { formatBlocksCount, formatShowingTemplates, formatTemplateStartFailed } from "@/i18n/format";
import { useT } from "@/i18n/use-t";
import { filterTemplates, type SavedTemplateListItem } from "@/features/workspace-hub/project-filters";
import { startComposeTemplate } from "@/features/workspace-hub/start-compose-template";
import { deleteComposeTemplate } from "@/lib/api-client";

type ManagementMode = "single" | "bulk";

interface SavedTemplatesProps {
  templates: SavedTemplateListItem[];
  searchable?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  managementMode?: ManagementMode;
}

interface DeleteState {
  ids: string[];
  title: string;
  description: string;
  details: string[];
}

export function SavedTemplates({
  templates,
  searchable = false,
  collapsible = false,
  defaultCollapsed = false,
  managementMode = "single",
}: SavedTemplatesProps) {
  const router = useRouter();
  const { messages } = useT();
  const [items, setItems] = useState(templates);
  const [query, setQuery] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(collapsible ? defaultCollapsed : false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteState, setDeleteState] = useState<DeleteState | null>(null);
  const [deleteProgress, setDeleteProgress] = useState<{ current: number; total: number } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setItems(templates);
  }, [templates]);

  const visibleTemplates = useMemo(
    () => (searchable ? filterTemplates(items, query) : items),
    [items, query, searchable],
  );
  const latestNames = items.slice(0, 3).map((template) => template.name).join(" · ");
  const selectedTemplates = useMemo(
    () => items.filter((template) => selectedIds.includes(template.id)),
    [items, selectedIds],
  );

  function toggleSelection(templateId: string) {
    setSelectedIds((current) =>
      current.includes(templateId)
        ? current.filter((id) => id !== templateId)
        : [...current, templateId],
    );
  }

  function resetSelection() {
    setSelectionMode(false);
    setSelectedIds([]);
  }

  function buildSingleDeleteState(template: SavedTemplateListItem): DeleteState {
    return {
      ids: [template.id],
      title: "템플릿을 삭제할까요?",
      description: "삭제 후에는 저장된 템플릿 목록에서 복구할 수 없습니다.",
      details: [
        `이름: ${template.name}`,
        `미리보기: ${template.previewTitle ?? messages.home.templatePreviewFallback}`,
      ],
    };
  }

  function buildBulkDeleteState(targets: SavedTemplateListItem[]): DeleteState {
    const first = targets[0];
    return {
      ids: targets.map((template) => template.id),
      title: `${targets.length}개의 템플릿을 삭제할까요?`,
      description: `${first?.name ?? "선택한 템플릿"}${targets.length > 1 ? ` 외 ${targets.length - 1}개` : ""}를 영구 삭제합니다.`,
      details: [
        `선택 항목: ${targets.length}개`,
        "삭제된 템플릿은 새 상세페이지 시작점에서 더 이상 사용할 수 없습니다.",
      ],
    };
  }

  async function handleUseTemplate(templateId: string) {
    if (loadingId) {
      return;
    }

    setLoadingId(templateId);
    try {
      const started = await startComposeTemplate(templateId);
      router.push(started.destination);
    } catch (error) {
      toast.error(
        formatTemplateStartFailed(
          messages,
          error instanceof Error ? error.message : "알 수 없는 오류",
        ),
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDeleteConfirmed() {
    if (!deleteState) {
      return;
    }

    const ids = deleteState.ids;

    startTransition(async () => {
      try {
        for (const [index, id] of ids.entries()) {
          setDeleteProgress({ current: index + 1, total: ids.length });
          await deleteComposeTemplate(id);
        }

        setItems((current) => current.filter((template) => !ids.includes(template.id)));
        setSelectedIds((current) => current.filter((id) => !ids.includes(id)));
        setDeleteState(null);
        setDeleteProgress(null);

        if (selectionMode && ids.length > 1) {
          resetSelection();
        }

        toast.success(ids.length === 1 ? "템플릿을 삭제했습니다." : `${ids.length}개의 템플릿을 삭제했습니다.`);
        router.refresh();
      } catch (error) {
        setDeleteProgress(null);
        toast.error(error instanceof Error ? error.message : "템플릿 삭제에 실패했습니다.");
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[24px] border border-[#E5DDD3] bg-white/92 p-8 text-center shadow-[0_14px_36px_rgba(55,40,30,0.05)]">
        <Bookmark className="mx-auto mb-3 h-7 w-7 text-[#C2B8AE]" />
        <p className="text-sm font-medium text-[#4D433D]">{messages.home.emptyTemplatesTitle}</p>
        <p className="mt-1 text-xs text-[#8D7D70]">{messages.home.emptyTemplatesDescription}</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-[24px] border border-[#E5DDD3] bg-white/92 shadow-[0_14px_36px_rgba(55,40,30,0.05)]">
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <button
            type="button"
            onClick={() => collapsible && setCollapsed((value) => !value)}
            className={`min-w-0 text-left ${collapsible ? "flex-1" : ""}`}
          >
            <div className="flex items-center gap-3">
              {collapsible ? (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5DDD3] bg-[#F8F4EF] text-[#7A6F67]">
                  <ArrowDown className={`h-4 w-4 transition-transform ${collapsed ? "" : "rotate-180"}`} />
                </span>
              ) : null}
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#201A17]">저장된 템플릿 {items.length}개</p>
                <p className="mt-1 truncate text-xs text-[#8D7D70]">
                  {collapsed
                    ? latestNames || messages.home.templatePreviewFallback
                    : "자주 쓰는 상세페이지 구성을 보관하고 바로 새 프로젝트로 시작합니다."}
                </p>
              </div>
            </div>
          </button>

          {managementMode === "bulk" ? (
            <Button
              type="button"
              variant={selectionMode ? "secondary" : "outline"}
              size="sm"
              onClick={() => {
                if (selectionMode) {
                  resetSelection();
                  return;
                }
                setSelectionMode(true);
              }}
              className="rounded-2xl border-[#E2D7CB] bg-white text-xs font-medium text-[#4D433D] shadow-none hover:bg-[#F8F2EC]"
            >
              {selectionMode ? "선택 취소" : "선택"}
            </Button>
          ) : null}
        </div>

        {!collapsed ? (
          <>
            {searchable ? (
              <div className="border-t border-[#EEE5DC] px-5 py-4">
                <label className="flex w-full items-center gap-2 rounded-2xl border border-[#E3D9CE] bg-[#F7F3EE] px-3 py-2 text-sm text-[#8D7D70] lg:max-w-xs">
                  <Search className="h-4 w-4" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={messages.common.filters.searchSavedTemplates}
                    className="w-full bg-transparent text-sm text-[#4D433D] outline-none placeholder:text-[#A08E7E]"
                  />
                </label>
                <p className="mt-3 text-xs text-[#95867A]">
                  {formatShowingTemplates(messages, visibleTemplates.length, items.length)}
                </p>
              </div>
            ) : (
              <div className="border-t border-[#EEE5DC] px-5 py-3">
                <p className="text-xs text-[#95867A]">{formatShowingTemplates(messages, visibleTemplates.length, items.length)}</p>
              </div>
            )}

            {selectionMode && selectedIds.length > 0 ? (
              <div className="sticky top-0 z-10 border-y border-[#F0E5DA] bg-[#FFF7F1] px-5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[#7B4A41]">{selectedIds.length}개 선택됨</p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteState(buildBulkDeleteState(selectedTemplates))}
                      className="rounded-2xl border-[#E8C1B9] bg-white text-xs font-medium text-[#B45A52] shadow-none hover:bg-[#FBEAEA]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      삭제
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={resetSelection}
                      className="rounded-2xl text-xs text-[#6E5E55] hover:bg-[#F8F2EC]"
                    >
                      취소
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}

            {visibleTemplates.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm font-medium text-[#4D433D]">{messages.home.noTemplatesMatchTitle}</p>
                <p className="mt-1 text-xs text-[#8D7D70]">{messages.home.noTemplatesMatchDescription}</p>
              </div>
            ) : (
              <div className="space-y-2 p-3">
                {visibleTemplates.map((template) => {
                  const isLoading = loadingId === template.id;
                  const isSelected = selectedIds.includes(template.id);
                  const inBulkMode = managementMode === "bulk";

                  return (
                    <div
                      key={template.id}
                      className={`group rounded-[20px] border border-[#EEE5DC] bg-[#FCFAF7] px-4 py-3 transition-colors hover:bg-white ${
                        selectionMode && inBulkMode ? "cursor-pointer" : ""
                      } ${isSelected ? "border-[#D97C67] bg-[#FFF7F1]" : ""}`}
                      onClick={() => {
                        if (selectionMode && inBulkMode) {
                          toggleSelection(template.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {selectionMode && inBulkMode ? (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelection(template.id)}
                            onClick={(event) => event.stopPropagation()}
                            className="mt-2 h-4 w-4 rounded border-[#D4C7B8] text-[#D97C67] focus:ring-[#D97C67]"
                            aria-label={`${template.name} 선택`}
                          />
                        ) : null}

                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[#EDD8D0] bg-[#FAECE7] text-[#D97C67]">
                          <Bookmark className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-[#201A17]">{template.name}</p>
                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#8D7D70]">
                                {template.previewTitle ?? messages.home.templatePreviewFallback}
                              </p>
                            </div>

                            {!selectionMode ? (
                              <div className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                                <ItemActionsMenu
                                  label={`${template.name} 메뉴`}
                                  actions={[
                                    {
                                      key: "use",
                                      label: messages.common.actions.useTemplate,
                                      disabled: isLoading,
                                      onSelect: () => void handleUseTemplate(template.id),
                                    },
                                    {
                                      key: "delete",
                                      label: "삭제",
                                      destructive: true,
                                      disabled: isLoading,
                                      onSelect: () => setDeleteState(buildSingleDeleteState(template)),
                                    },
                                  ]}
                                />
                              </div>
                            ) : null}
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <span className="text-[11px] uppercase tracking-[0.16em] text-[#A08E7E]">
                              {formatBlocksCount(messages, template.blockCount)}
                            </span>

                            {!selectionMode ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => void handleUseTemplate(template.id)}
                                disabled={isLoading}
                                className="rounded-2xl border-[#E6D7CA] bg-white text-xs font-medium text-[#4D433D] shadow-none hover:bg-[#F8F2EC]"
                              >
                                {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                                {isLoading ? "열어가는 중" : messages.common.actions.useTemplate}
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : null}
      </div>

      <DeleteConfirmDialog
        open={deleteState !== null}
        title={deleteState?.title ?? ""}
        description={deleteState?.description ?? ""}
        details={deleteState?.details ?? []}
        pending={isPending}
        busyLabel={
          deleteProgress
            ? `${deleteProgress.current}/${deleteProgress.total} 삭제 중...`
            : "삭제 중..."
        }
        onClose={() => {
          if (!isPending) {
            setDeleteState(null);
            setDeleteProgress(null);
          }
        }}
        onConfirm={() => void handleDeleteConfirmed()}
      />
    </>
  );
}
