/** Saved template list with optional search and instant compose instantiation. */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Bookmark, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatBlocksCount, formatShowingTemplates, formatTemplateStartFailed } from "@/i18n/format";
import { useT } from "@/i18n/use-t";
import { instantiateComposeTemplate } from "@/lib/api-client";
import { filterTemplates, type SavedTemplateListItem } from "@/features/workspace-hub/project-filters";

interface SavedTemplatesProps {
  templates: SavedTemplateListItem[];
  searchable?: boolean;
}

export function SavedTemplates({ templates, searchable = false }: SavedTemplatesProps) {
  const router = useRouter();
  const { messages } = useT();
  const [query, setQuery] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const visibleTemplates = useMemo(
    () => (searchable ? filterTemplates(templates, query) : templates),
    [query, searchable, templates],
  );

  async function handleUseTemplate(templateId: string) {
    if (loadingId) {
      return;
    }

    setLoadingId(templateId);
    try {
      const response = await instantiateComposeTemplate(templateId);
      toast.success(messages.composeShared.templateStartedFromSaved);
      router.push(`/projects/${response.project.id}/compose`);
    } catch (error) {
      toast.error(formatTemplateStartFailed(
        messages,
        error instanceof Error ? error.message : "알 수 없는 오류",
      ));
    } finally {
      setLoadingId(null);
    }
  }

  if (templates.length === 0) {
    return (
      <div className="rounded-[30px] border border-[#E5DDD3] bg-white/92 p-10 text-center shadow-[0_18px_45px_rgba(55,40,30,0.05)]">
        <Bookmark className="mx-auto mb-3 h-8 w-8 text-[#C2B8AE]" />
        <p className="text-sm font-medium text-[#4D433D]">{messages.home.emptyTemplatesTitle}</p>
        <p className="mt-1 text-xs text-[#8D7D70]">{messages.home.emptyTemplatesDescription}</p>
      </div>
    );
  }

  return (
    <div className="rounded-[30px] border border-[#E5DDD3] bg-white/92 shadow-[0_18px_45px_rgba(55,40,30,0.05)]">
      {searchable ? (
        <div className="border-b border-[#EEE5DC] px-6 py-5">
          <label className="flex w-full items-center gap-2 rounded-2xl border border-[#E3D9CE] bg-[#F7F3EE] px-3 py-2.5 text-sm text-[#8D7D70] lg:max-w-xs">
            <Search className="h-4 w-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={messages.common.filters.searchSavedTemplates}
              className="w-full bg-transparent text-sm text-[#4D433D] outline-none placeholder:text-[#A08E7E]"
            />
          </label>
          <p className="mt-3 text-xs text-[#95867A]">
            {formatShowingTemplates(messages, visibleTemplates.length, templates.length)}
          </p>
        </div>
      ) : null}

      {visibleTemplates.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-medium text-[#4D433D]">{messages.home.noTemplatesMatchTitle}</p>
          <p className="mt-1 text-xs text-[#8D7D70]">{messages.home.noTemplatesMatchDescription}</p>
        </div>
      ) : (
        <div className="space-y-3 p-4">
          {visibleTemplates.map((template) => {
            const isLoading = loadingId === template.id;
            return (
              <div
                key={template.id}
                className="flex flex-col gap-4 rounded-[24px] border border-[#EEE5DC] bg-[#FCFAF7] px-5 py-4 transition-colors hover:bg-white"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#EDD8D0] bg-[#FAECE7] text-[#D97C67]">
                    <Bookmark className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08E7E]">
                      Saved template
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#201A17]">{template.name}</p>
                    <p className="mt-2 text-xs leading-5 text-[#8D7D70]">
                      {template.previewTitle ?? messages.home.templatePreviewFallback}
                    </p>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-[#A08E7E]">
                      {formatBlocksCount(messages, template.blockCount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-[#F0E7DE] pt-4">
                  <span className="text-xs text-[#8D7D70]">
                    {new Date(template.updatedAt).toLocaleDateString("ko-KR")}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void handleUseTemplate(template.id)}
                    disabled={isLoading}
                    className="rounded-2xl border-[#E6D7CA] bg-white text-xs font-medium text-[#4D433D] shadow-none hover:bg-[#F8F2EC]"
                  >
                    {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    {!isLoading ? <ArrowUpRight className="h-3.5 w-3.5" /> : null}
                    {messages.common.actions.useTemplate}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
