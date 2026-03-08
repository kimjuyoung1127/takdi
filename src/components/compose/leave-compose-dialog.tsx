"use client";

import { Home, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/use-t";

interface LeaveComposeDialogProps {
  open: boolean;
  saving: boolean;
  onClose: () => void;
  onDiscard: () => void;
  onSaveAndLeave: () => void;
}

export function LeaveComposeDialog({
  open,
  saving,
  onClose,
  onDiscard,
  onSaveAndLeave,
}: LeaveComposeDialogProps) {
  const { messages } = useT();
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
            <div className="rounded-full bg-slate-100 p-2 text-slate-700">
              <Home className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{messages.composeShared.leaveComposeTitle}</h2>
              <p className="text-xs text-gray-500">{messages.composeShared.leaveComposeDescription}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">{messages.composeShared.leaveComposeBody}</div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>{messages.common.actions.cancel}</Button>
          <Button type="button" variant="outline" onClick={onDiscard} disabled={saving}>
            {messages.common.actions.leaveWithoutSaving}
          </Button>
          <Button type="button" onClick={onSaveAndLeave} disabled={saving}>
            {saving ? messages.composeShared.saving : messages.common.actions.saveAndLeave}
          </Button>
        </div>
      </div>
    </div>
  );
}
