/** 에디터 캔버스 상단 플로팅 액션 툴바 */
"use client";

import { Play, Square, Save, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingToolbarProps {
  onRunAll?: () => void;
  onStop?: () => void;
  onSave?: () => void;
  onPreview?: () => void;
  onExport?: () => void;
}

const ACTIONS = [
  { key: "run", icon: Play, label: "Run All", prop: "onRunAll" },
  { key: "stop", icon: Square, label: "Stop", prop: "onStop" },
  { key: "save", icon: Save, label: "Save", prop: "onSave" },
  { key: "preview", icon: Eye, label: "Preview", prop: "onPreview" },
  { key: "export", icon: Download, label: "Export", prop: "onExport" },
] as const;

export function FloatingToolbar(props: FloatingToolbarProps) {
  return (
    <div className="absolute left-1/2 top-6 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white px-4 py-2 shadow-md">
      {ACTIONS.map(({ key, icon: Icon, label, prop }) => (
        <Button
          key={key}
          variant="ghost"
          size="sm"
          className="flex items-center gap-1.5 rounded-full px-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          onClick={props[prop]}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  );
}
