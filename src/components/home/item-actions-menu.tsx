"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ItemAction {
  key: string;
  label: string;
  destructive?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

interface ItemActionsMenuProps {
  label: string;
  actions: ItemAction[];
}

export function ItemActionsMenu({ label, actions }: ItemActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
        className="rounded-full border border-[#E7DDD2] bg-white text-[#7A6F67] shadow-none hover:bg-[#F8F2EC]"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {open ? (
        <div className="absolute right-0 top-full z-20 mt-2 min-w-36 rounded-2xl border border-[#E6DCD1] bg-white p-1.5 shadow-[0_18px_40px_rgba(55,40,30,0.12)]">
          {actions.map((action) => (
            <button
              key={action.key}
              type="button"
              disabled={action.disabled}
              onClick={() => {
                setOpen(false);
                action.onSelect();
              }}
              className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${
                action.destructive
                  ? "text-[#B45A52] hover:bg-[#FBEAEA]"
                  : "text-[#4D433D] hover:bg-[#F8F2EC]"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
