/** 템플릿 빌더 — 카테고리 선택 → 프레임워크/훅 → 설득 구조 빈 블록 즉시 배치 */
"use client";

import { useState, useCallback } from "react";
import { X, LayoutTemplate as LayoutTemplateIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES, PERSUASION_FRAMEWORKS, HOOK_LIBRARY, HOOK_STYLES, type PersuasionFramework, type HookStyle } from "@/lib/constants";
import { getTemplatesByCategory, getTemplateByFramework, getBestTemplate, type LayoutTemplate } from "@/lib/layout-templates";
import { BLOCK_TEMPLATES } from "./block-palette";
import { MoodboardPicker } from "./moodboard-picker";
import type { MoodboardPreset } from "@/lib/moodboard-presets";
import type { Block, BlockType } from "@/types/blocks";

interface BriefBuilderProps {
  open: boolean;
  onClose: () => void;
  onApplyTemplate: (blocks: Block[], theme?: import("@/types/blocks").ThemePalette) => void;
}

/** BlockType → 빈 블록 생성 (block-palette의 BLOCK_TEMPLATES 재활용) */
function createEmptyBlock(type: BlockType): Block | null {
  const tmpl = BLOCK_TEMPLATES.find((t) => t.type === type);
  return tmpl ? tmpl.create() : null;
}

/** 레이아웃 템플릿 시퀀스 → 빈 블록 배열 */
function templateToBlocks(template: LayoutTemplate): Block[] {
  return template.sequence
    .map((type) => createEmptyBlock(type))
    .filter((b): b is Block => b !== null);
}

export function BriefBuilder({ open, onClose, onApplyTemplate }: BriefBuilderProps) {
  const [category, setCategory] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedMoodboard, setSelectedMoodboard] = useState<string | null>(null);
  const [framework, setFramework] = useState<PersuasionFramework>("aida");
  const [hookStyle, setHookStyle] = useState<HookStyle | null>(null);

  const [selectedMoodboardPreset, setSelectedMoodboardPreset] = useState<MoodboardPreset | null>(null);

  const handleMoodboardSelect = useCallback((preset: MoodboardPreset) => {
    setSelectedMoodboard(preset.id);
    setSelectedMoodboardPreset(preset);
  }, []);

  const handleApply = useCallback(() => {
    // Priority: explicit template > framework template > category best match
    const explicitTemplate = selectedTemplate
      ? getTemplatesByCategory(category).find((t) => t.id === selectedTemplate)
      : null;
    const template = explicitTemplate
      ?? getTemplateByFramework(framework)
      ?? getBestTemplate(category);
    const blocks = templateToBlocks(template);

    // Apply hook text to hero block heading
    if (hookStyle && category && HOOK_LIBRARY[category]) {
      const hookText = HOOK_LIBRARY[category][hookStyle];
      if (hookText) {
        const heroIdx = blocks.findIndex((b) => b.type === "hero");
        if (heroIdx >= 0) {
          const hero = blocks[heroIdx];
          if (hero.type === "hero" && hero.overlays.length > 0) {
            blocks[heroIdx] = {
              ...hero,
              overlays: hero.overlays.map((o, i) =>
                i === 0 ? { ...o, text: hookText } : o,
              ),
            };
          }
        }
      }
    }

    onApplyTemplate(blocks, selectedMoodboardPreset?.theme);
    onClose();
  }, [category, selectedTemplate, framework, hookStyle, selectedMoodboardPreset, onApplyTemplate, onClose]);

  if (!open) return null;

  const templates = category ? getTemplatesByCategory(category) : [];
  const hookOptions = category && HOOK_LIBRARY[category] ? HOOK_LIBRARY[category] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-[520px] max-h-[85vh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutTemplateIcon className="h-5 w-5 text-indigo-500" />
            <h2 className="text-base font-semibold text-gray-900">상세페이지 구성</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 카테고리 */}
        <div className="mb-5">
          <label className="mb-1.5 block text-xs font-medium text-gray-700">카테고리 *</label>
          <div className="flex flex-wrap gap-2">
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => { setCategory(cat.value); setSelectedTemplate(null); setHookStyle(null); }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  category === cat.value
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 설득 프레임워크 선택 */}
        {category && (
          <div className="mb-5">
            <label className="mb-1.5 block text-xs font-medium text-gray-700">설득 프레임워크</label>
            <div className="space-y-1.5">
              {PERSUASION_FRAMEWORKS.map((fw) => (
                <button
                  key={fw.value}
                  onClick={() => { setFramework(fw.value); setSelectedTemplate(null); }}
                  className={`w-full rounded-lg border-2 px-3 py-2 text-left transition ${
                    framework === fw.value
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-800">{fw.label}</span>
                    <span className="text-[10px] text-gray-400">{fw.sequence.length}개 블록</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-gray-500">{fw.desc}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {fw.sequence.map((type, i) => (
                      <span key={i} className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] text-gray-500">
                        {type}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 훅 스타일 선택 */}
        {hookOptions && (
          <div className="mb-5">
            <label className="mb-1.5 block text-xs font-medium text-gray-700">첫 문장 스타일</label>
            <div className="grid grid-cols-2 gap-2">
              {HOOK_STYLES.map((hs) => {
                const text = hookOptions[hs.value];
                return (
                  <button
                    key={hs.value}
                    onClick={() => setHookStyle(hs.value)}
                    className={`rounded-lg border-2 px-3 py-2 text-left transition ${
                      hookStyle === hs.value
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xs font-semibold text-gray-800">{hs.label}</span>
                    <p className="mt-0.5 text-[10px] text-gray-500 line-clamp-2">&ldquo;{text}&rdquo;</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 레이아웃 템플릿 선택 (카테고리별) */}
        {category && templates.length > 0 && (
          <div className="mb-5">
            <label className="mb-1.5 block text-xs font-medium text-gray-700">레이아웃 구조 (선택)</label>
            <div className="space-y-1.5">
              {templates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`w-full rounded-lg border-2 px-3 py-2.5 text-left transition ${
                    selectedTemplate === tmpl.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-800">{tmpl.label}</span>
                    <span className="text-[10px] text-gray-400">{tmpl.sequence.length}개 블록</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-gray-500">{tmpl.description}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {tmpl.sequence.map((type, i) => (
                      <span key={i} className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] text-gray-500">
                        {type}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 무드보드 */}
        {category && (
          <div className="mb-5">
            <MoodboardPicker
              category={category}
              selected={selectedMoodboard}
              onSelect={handleMoodboardSelect}
            />
          </div>
        )}

        {/* 배치 버튼 */}
        <Button
          onClick={handleApply}
          disabled={!category}
          className="flex w-full items-center justify-center gap-2"
        >
          <LayoutTemplateIcon className="h-4 w-4" />
          템플릿 배치
        </Button>
      </div>
    </div>
  );
}
