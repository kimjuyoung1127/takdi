/** 가드레일 위반 표시 — 블록 우측 경고 아이콘 */
"use client";

import { AlertTriangle } from "lucide-react";
import type { GuardrailViolation } from "@/lib/design-guardrails";

interface GuardrailIndicatorProps {
  violations: GuardrailViolation[];
}

export function GuardrailIndicator({ violations }: GuardrailIndicatorProps) {
  if (violations.length === 0) return null;

  return (
    <div className="absolute -right-8 top-2 z-10 group/guard">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-sm">
        <AlertTriangle className="h-3.5 w-3.5" />
      </div>
      <div className="absolute right-8 top-0 hidden w-56 rounded-lg bg-white p-2 shadow-lg ring-1 ring-gray-200 group-hover/guard:block">
        {violations.map((v, i) => (
          <div key={i} className="mb-1 last:mb-0">
            <p className="text-xs text-gray-700">{v.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
