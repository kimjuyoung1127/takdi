/** 에디터 하단 로그 패널 — 비동기 작업 상태 표시 (접힘/펼침) */
"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  level: "info" | "warn" | "error";
}

interface BottomLoggerProps {
  logs?: LogEntry[];
}

const LEVEL_COLORS: Record<string, string> = {
  info: "text-gray-500",
  warn: "text-amber-500",
  error: "text-rose-500",
};

export function BottomLogger({ logs = [] }: BottomLoggerProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-10 border-t border-gray-100 bg-white transition-all ${
        expanded ? "h-48" : "h-10"
      }`}
    >
      {/* Toggle bar */}
      <div className="flex h-10 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-xs font-medium text-gray-500">작업 기록</span>
          {logs.length > 0 && (
            <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
              {logs.length}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      {/* Log content */}
      {expanded && (
        <div className="h-[calc(100%-2.5rem)] overflow-y-auto px-4 pb-2 font-mono text-xs">
          {logs.length === 0 ? (
            <p className="py-4 text-center text-gray-300">
              아직 작업 기록이 없습니다. 생성을 실행하면 기록이 표시됩니다.
            </p>
          ) : (
            logs.map((entry) => (
              <div key={entry.id} className="flex gap-3 py-0.5">
                <span className="shrink-0 text-gray-300">
                  {entry.timestamp}
                </span>
                <span className={LEVEL_COLORS[entry.level] ?? "text-gray-500"}>
                  {entry.message}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
