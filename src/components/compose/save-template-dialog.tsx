"use client";

import { useEffect, useState } from "react";
import { Bookmark, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/use-t";

interface SaveTemplateDialogProps {
  open: boolean;
  defaultName: string;
  saving: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export function SaveTemplateDialog({
  open,
  defaultName,
  saving,
  onClose,
  onSubmit,
}: SaveTemplateDialogProps) {
  const { messages } = useT();
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    if (open) {
      setName(defaultName);
    }
  }, [defaultName, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-amber-50 p-2 text-amber-600">
              <Bookmark className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{messages.composeShared.saveFavoriteTemplateTitle}</h2>
              <p className="text-xs text-gray-500">{messages.composeShared.saveFavoriteTemplateDescription}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="mb-2 block text-xs font-medium text-gray-700" htmlFor="template-name">
          {messages.composeShared.templateName}
        </label>
        <input
          id="template-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          placeholder={messages.composeShared.templateNamePlaceholder}
        />

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>{messages.common.actions.cancel}</Button>
          <Button
            type="button"
            onClick={() => onSubmit(name.trim())}
            disabled={saving || name.trim().length === 0}
            className="rounded-full"
          >
            {saving ? messages.composeShared.saving : messages.composeShared.saveTemplateButton}
          </Button>
        </div>
      </div>
    </div>
  );
}
