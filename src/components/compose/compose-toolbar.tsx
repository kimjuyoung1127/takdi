"use client";

import Link from "next/link";
import {
  Bookmark,
  Download,
  ExternalLink,
  Eye,
  LayoutTemplate,
  Loader2,
  Monitor,
  Save,
  ShieldCheck,
  Smartphone,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatSavedAt } from "@/i18n/format";
import { useT } from "@/i18n/use-t";
import { PLATFORM_PRESETS } from "@/lib/constants";
import type { ThemePalette } from "@/types/blocks";
import { ThemePicker } from "./theme-picker";

interface ComposeToolbarProps {
  projectId: string;
  projectName: string;
  platformName: string;
  onPlatformChange: (platform: string) => void;
  onGoHome: () => void;
  onSave: () => void;
  onPreview: () => void;
  onExport: () => void;
  onSaveTemplate: () => void;
  onAiGenerate?: () => void;
  onDesignCheck?: () => void;
  onAutoFixAll?: () => void;
  mobilePreview?: boolean;
  onMobilePreviewToggle?: () => void;
  isSaving: boolean;
  isDirty: boolean;
  isTemplateSaving?: boolean;
  lastSaved: string | null;
  theme?: ThemePalette;
  onThemeChange: (theme: ThemePalette | undefined) => void;
}

export function ComposeToolbar({
  projectId,
  projectName,
  platformName,
  onPlatformChange,
  onGoHome,
  onSave,
  onPreview,
  onExport,
  onSaveTemplate,
  onAiGenerate,
  onDesignCheck,
  onAutoFixAll,
  mobilePreview,
  onMobilePreviewToggle,
  isSaving,
  isDirty,
  isTemplateSaving,
  lastSaved,
  theme,
  onThemeChange,
}: ComposeToolbarProps) {
  const { messages } = useT();

  return (
    <div className="flex h-12 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onGoHome}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white transition hover:bg-gray-800"
          title={isDirty ? messages.composeShared.backHomeWithUnsaved : messages.composeShared.backHome}
        >
          T
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-gray-900">{projectName}</h1>
          <p className="text-[10px] text-gray-400">{isDirty ? messages.composeShared.unsavedChanges : messages.composeShared.allChangesSaved}</p>
        </div>
        <Link
          href={`/projects/${projectId}/editor`}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-500"
        >
          <ExternalLink className="h-3 w-3" />
          {messages.composeShared.editor}
        </Link>
      </div>

      <div className="relative flex items-center gap-3">
        <ThemePicker currentTheme={theme} onThemeChange={onThemeChange} />
        <label className="text-xs text-gray-500">{messages.composeShared.platform}</label>
        <select
          value={platformName}
          onChange={(event) => onPlatformChange(event.target.value)}
          className="rounded border border-gray-200 px-2 py-1 text-xs"
        >
          {PLATFORM_PRESETS.map((preset) => (
            <option key={preset.value} value={preset.value}>
              {preset.label} ({preset.width}px)
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        {onAiGenerate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAiGenerate}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
          >
            <LayoutTemplate className="h-3.5 w-3.5" />
            {messages.common.actions.templates}
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
            {messages.common.actions.check}
          </Button>
        )}
        {onAutoFixAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAutoFixAll}
            className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700"
          >
            <Wrench className="h-3.5 w-3.5" />
            {messages.common.actions.autoFix}
          </Button>
        )}
        {onMobilePreviewToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobilePreviewToggle}
            className={`flex items-center gap-1 text-xs ${mobilePreview ? "bg-indigo-50 text-indigo-600" : ""}`}
          >
            {mobilePreview ? (
              <>
                <Monitor className="h-3.5 w-3.5" />
                {messages.common.actions.desktop}
              </>
            ) : (
              <>
                <Smartphone className="h-3.5 w-3.5" />
                {messages.common.actions.mobile}
              </>
            )}
          </Button>
        )}
        {lastSaved && <span className="mr-2 text-[10px] text-gray-400">{formatSavedAt(messages, lastSaved)}</span>}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSaveTemplate}
          disabled={Boolean(isTemplateSaving)}
          className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800"
        >
          {isTemplateSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bookmark className="h-3.5 w-3.5" />}
          {messages.composeShared.favorite}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1 text-xs"
        >
          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {messages.common.actions.save}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreview}
          className="flex items-center gap-1 text-xs"
        >
          <Eye className="h-3.5 w-3.5" />
          {messages.common.actions.preview}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          className="flex items-center gap-1 text-xs"
        >
          <Download className="h-3.5 w-3.5" />
          {messages.common.actions.export}
        </Button>
      </div>
    </div>
  );
}
