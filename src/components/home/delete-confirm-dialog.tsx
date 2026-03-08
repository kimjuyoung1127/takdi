"use client";

import { useEffect } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WORKSPACE_CONTROL, WORKSPACE_SURFACE, WORKSPACE_TEXT } from "@/lib/workspace-surface";

interface DeleteConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  details?: string[];
  confirmLabel?: string;
  busyLabel?: string;
  pending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  open,
  title,
  description,
  details = [],
  confirmLabel = "삭제",
  busyLabel = "삭제 중...",
  pending = false,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, open, pending]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#201A17]/35 px-4 backdrop-blur-sm" onClick={() => !pending && onClose()}>
      <div
        className={`w-full max-w-md rounded-[28px] p-6 ${WORKSPACE_SURFACE.panelStrong}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-[#FBEAEA] p-2 text-[#B45A52]">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h2 className={`text-base font-semibold ${WORKSPACE_TEXT.title}`}>{title}</h2>
              <p className={`mt-1 text-sm leading-6 ${WORKSPACE_TEXT.body}`}>{description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className={`${WORKSPACE_TEXT.muted} hover:text-[#4D433D] disabled:opacity-40`}
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {details.length > 0 ? (
          <div className="rounded-2xl border border-[#E7DDD2] bg-[#FBF8F4] px-4 py-3">
            {details.map((detail) => (
              <p key={detail} className="text-sm leading-6 text-[#5E544E]">
                {detail}
              </p>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={pending}
            className={`rounded-2xl ${WORKSPACE_CONTROL.ghostButton}`}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={pending}
            className="rounded-2xl"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {pending ? busyLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
