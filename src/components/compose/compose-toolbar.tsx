/** Compose 에디터 상단 도구바 — 저장, 미리보기, 내보내기, 플랫폼 선택 */
"use client";

import { Save, Eye, Download, Loader2, ExternalLink, LayoutTemplate, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLATFORM_PRESETS } from "@/lib/constants";
import type { ThemePalette } from "@/types/blocks";
import { ThemePicker } from "./theme-picker";
import Link from "next/link";

interface ComposeToolbarProps {
  projectId: string;
  projectName: string;
  platformName: string;
  onPlatformChange: (platform: string) => void;
  onSave: () => void;
  onPreview: () => void;
  onExport: () => void;
  onAiGenerate?: () => void;
  onDesignCheck?: () => void;
  isSaving: boolean;
  lastSaved: string | null;
  theme?: ThemePalette;
  onThemeChange: (theme: ThemePalette | undefined) => void;
}

export function ComposeToolbar({
  projectId,
  projectName,
  platformName,
  onPlatformChange,
  onSave,
  onPreview,
  onExport,
  onAiGenerate,
  onDesignCheck,
  isSaving,
  lastSaved,
  theme,
  onThemeChange,
}: ComposeToolbarProps) {
  return (
    <div className="flex h-12 items-center justify-between border-b border-gray-200 bg-white px-4">
      {/* Left: project name + editor link */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-gray-900 truncate max-w-48">{projectName}</h1>
        <Link
          href={`/projects/${projectId}/editor`}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-500"
        >
          <ExternalLink className="h-3 w-3" />
          영상 편집기
        </Link>
      </div>

      {/* Center: platform + theme */}
      <div className="relative flex items-center gap-3">
        <ThemePicker currentTheme={theme} onThemeChange={onThemeChange} />
        <label className="text-xs text-gray-500">플랫폼:</label>
        <select
          value={platformName}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="rounded border border-gray-200 px-2 py-1 text-xs"
        >
          {PLATFORM_PRESETS.map((p) => (
            <option key={p.value} value={p.value}>{p.label} ({p.width}px)</option>
          ))}
        </select>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        {onAiGenerate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAiGenerate}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
          >
            <LayoutTemplate className="h-3.5 w-3.5" />
            템플릿
          </Button>
        )}
        {onDesignCheck && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDesignCheck}
            className="flex items-center gap-1 text-xs"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            디자인 점검
          </Button>
        )}
        {lastSaved && (
          <span className="mr-2 text-[10px] text-gray-400">저장: {lastSaved}</span>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1 text-xs"
        >
          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          저장
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreview}
          className="flex items-center gap-1 text-xs"
        >
          <Eye className="h-3.5 w-3.5" />
          미리보기
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          className="flex items-center gap-1 text-xs"
        >
          <Download className="h-3.5 w-3.5" />
          내보내기
        </Button>
      </div>
    </div>
  );
}
