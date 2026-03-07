/** 가드레일 위반 표시 — 블록 우측 경고 아이콘 + 자동 수정 버튼 */
"use client";

import { AlertTriangle, Wrench } from "lucide-react";
import type { GuardrailViolation } from "@/lib/design-guardrails";

interface GuardrailIndicatorProps {
  violations: GuardrailViolation[];
  onAutoFix?: (violation: GuardrailViolation) => void;
}

export function GuardrailIndicator({ violations, onAutoFix }: GuardrailIndicatorProps) {
  if (violations.length === 0) return null;

  return (
    <div className="absolute -right-8 top-2 z-10 group/guard">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-sm">
        <AlertTriangle className="h-3.5 w-3.5" />
      </div>
      <div className="absolute right-8 top-0 hidden w-64 rounded-lg bg-white p-2 shadow-lg ring-1 ring-gray-200 group-hover/guard:block">
        {violations.map((v, i) => (
          <div key={i} className="mb-1.5 last:mb-0">
            <p className="text-xs text-gray-700">{v.message}</p>
            {v.autoFixable && onAutoFix && (
              <button
                onClick={(e) => { e.stopPropagation(); onAutoFix(v); }}
                className="mt-0.5 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-indigo-600 hover:bg-indigo-50"
              >
                <Wrench className="h-3 w-3" />
                자동 수정
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
