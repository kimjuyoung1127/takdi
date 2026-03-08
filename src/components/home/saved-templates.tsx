/** Saved template list with optional search and instant compose instantiation. */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Loader2, Search } from "lucide-react";
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
      <div className="rounded-3xl bg-white p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <Bookmark className="mx-auto mb-3 h-8 w-8 text-gray-300" />
        <p className="text-sm font-medium text-gray-700">{messages.home.emptyTemplatesTitle}</p>
        <p className="mt-1 text-xs text-gray-400">{messages.home.emptyTemplatesDescription}</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {searchable ? (
        <div className="border-b border-gray-100 px-6 py-5">
          <label className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 lg:max-w-xs">
            <Search className="h-4 w-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={messages.common.filters.searchSavedTemplates}
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </label>
          <p className="mt-3 text-xs text-gray-400">
            {formatShowingTemplates(messages, visibleTemplates.length, templates.length)}
          </p>
        </div>
      ) : null}

      {visibleTemplates.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-medium text-gray-700">{messages.home.noTemplatesMatchTitle}</p>
          <p className="mt-1 text-xs text-gray-400">{messages.home.noTemplatesMatchDescription}</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {visibleTemplates.map((template) => {
            const isLoading = loadingId === template.id;
            return (
              <div
                key={template.id}
                className="flex flex-col gap-4 px-6 py-4 transition-colors hover:bg-gray-50/50 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Bookmark className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{template.name}</p>
                    <p className="text-xs text-gray-400">
                      {template.previewTitle ?? messages.home.templatePreviewFallback} &middot; {formatBlocksCount(messages, template.blockCount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {new Date(template.updatedAt).toLocaleDateString("ko-KR")}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void handleUseTemplate(template.id)}
                    disabled={isLoading}
                    className="rounded-xl text-xs text-amber-700 hover:text-amber-800"
                  >
                    {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
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
