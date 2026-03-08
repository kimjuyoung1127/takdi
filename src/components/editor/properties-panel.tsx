"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ImageIcon, LayoutGrid, Music, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppImage } from "@/components/ui/app-image";
import { StatusBadge } from "@/components/ui/status-badge";
import { AssetUpload } from "./asset-upload";
import type { EditorViewMode } from "@/lib/editor-surface";
import { getStepPresentation, getUserFacingNodeStatus } from "@/lib/editor-surface";
import { NODE_TYPE_LABELS, PRODUCT_CATEGORIES } from "@/lib/constants";
import { getProjectAssets, type AssetRecord } from "@/lib/api-client";
import { WORKSPACE_CONTROL, WORKSPACE_SURFACE, WORKSPACE_TEXT } from "@/lib/workspace-surface";
import type { NodeData } from "./node-canvas";
import type { ShortformProjectState } from "@/types";

interface UploadedAsset {
  id: string;
  filePath: string;
  type: "image" | "bgm";
  durationMs?: number | null;
  bpm?: number | null;
}

interface PropertiesPanelProps {
  mode: string;
  viewMode: EditorViewMode;
  selectedNodeId?: string | null;
  selectedNodeData?: NodeData | null;
  onNodeDataChange?: (nodeId: string, patch: Partial<NodeData>) => void;
  projectId?: string;
  projectName?: string;
  nodeCount?: number;
  projectBriefText: string;
  onProjectBriefTextChange: (value: string) => void;
  allowBgm?: boolean;
  shortformState?: ShortformProjectState | null;
  onShortformStateChange?: (
    updater: ShortformProjectState | null | ((prev: ShortformProjectState | null) => ShortformProjectState | null),
  ) => void;
}

function EmptyPanel({ projectName, nodeCount }: { projectName?: string; nodeCount?: number }) {
  return (
    <aside className="flex w-96 flex-col border-l border-[#E5DDD3] bg-[#FBF8F4]">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#F8E7E2] text-[#D97C67]">
          <LayoutGrid className="h-7 w-7" />
        </div>
        <div className="text-center">
          <p className={`text-base font-semibold ${WORKSPACE_TEXT.title}`}>{projectName ?? "프로젝트"}</p>
          <p className={`mt-2 text-sm ${WORKSPACE_TEXT.body}`}>작업 단계 {nodeCount ?? 0}개</p>
          <p className={`mt-4 text-sm leading-6 ${WORKSPACE_TEXT.muted}`}>
            단계 카드를 선택하면 필요한 입력과 현재 상태를 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </aside>
  );
}

function sortCuts(state: ShortformProjectState) {
  return [...state.cuts].sort((left, right) => left.order - right.order);
}

export function PropertiesPanel({
  mode,
  viewMode,
  selectedNodeId,
  selectedNodeData,
  onNodeDataChange,
  projectId,
  projectName,
  nodeCount,
  projectBriefText,
  onProjectBriefTextChange,
  allowBgm = true,
  shortformState,
  onShortformStateChange,
}: PropertiesPanelProps) {
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [recentUploads, setRecentUploads] = useState<UploadedAsset[]>([]);

  const refreshAssets = useCallback(async () => {
    if (!projectId) return;
    try {
      const response = await getProjectAssets(projectId);
      setAssets(response.assets);
    } catch {
      // ignore asset refresh failure
    }
  }, [projectId]);

  useEffect(() => {
    void refreshAssets();
  }, [refreshAssets]);

  const handleUploadComplete = useCallback((asset: UploadedAsset) => {
    setRecentUploads((prev) => [asset, ...prev].slice(0, 8));
    void refreshAssets();

    if (asset.type === "image" && selectedNodeId && selectedNodeData?.nodeType === "upload-image") {
      onNodeDataChange?.(selectedNodeId, {
        uploadedAssetId: asset.id,
        uploadedFilePath: asset.filePath,
        status: "generated",
        previewImages: [asset.filePath],
      });
    }

    if (asset.type === "bgm" && mode === "shortform-video") {
      onShortformStateChange?.((current) => {
        if (!current) return current;
        if (selectedNodeId && selectedNodeData?.nodeType === "bgm") {
          onNodeDataChange?.(selectedNodeId, { filePath: asset.filePath, status: "generated" });
        }
        return {
          ...current,
          bgm: {
            assetId: asset.id,
            filePath: asset.filePath,
            durationMs: asset.durationMs ?? null,
            bpm: asset.bpm ?? null,
          },
        };
      });
    }
  }, [mode, onNodeDataChange, onShortformStateChange, refreshAssets, selectedNodeData?.nodeType, selectedNodeId]);

  if (!selectedNodeId || !selectedNodeData) {
    return <EmptyPanel projectName={projectName} nodeCount={nodeCount} />;
  }

  const stepPresentation = getStepPresentation(mode, selectedNodeData.nodeType);
  const statusInfo = getUserFacingNodeStatus(selectedNodeData);
  const title =
    stepPresentation?.title ??
    selectedNodeData.label ??
    NODE_TYPE_LABELS[selectedNodeData.nodeType as keyof typeof NODE_TYPE_LABELS] ??
    "작업 단계";
  const description = stepPresentation?.description ?? "현재 단계의 입력과 상태를 확인합니다.";
  const previewImages = Array.isArray(selectedNodeData.previewImages)
    ? selectedNodeData.previewImages.filter((value): value is string => typeof value === "string")
    : [];
  const imageAssets = assets.filter((asset) => asset.mimeType?.startsWith("image/"));
  const bgmAssets = assets.filter((asset) => asset.mimeType?.startsWith("audio/"));
  const assignedBySlot = useMemo(
    () => new Map(shortformState?.sceneAssignments.map((assignment) => [assignment.imageSlot, assignment]) ?? []),
    [shortformState?.sceneAssignments],
  );
  const orderedCuts = useMemo(
    () => (shortformState ? sortCuts(shortformState) : []),
    [shortformState],
  );

  const updateShortform = useCallback(
    (updater: (current: ShortformProjectState) => ShortformProjectState) => {
      onShortformStateChange?.((current) => {
        if (!current) return current;
        const next = updater(current);
        if (selectedNodeId && selectedNodeData.nodeType === "generate-images") {
          onNodeDataChange?.(selectedNodeId, {
            previewImages: next.sceneAssignments.map((item) => item.filePath),
            status: next.sceneAssignments.length > 0 ? "generated" : "draft",
          });
        }
        if (selectedNodeId && selectedNodeData.nodeType === "cuts") {
          onNodeDataChange?.(selectedNodeId, { status: next.cuts.some((cut) => cut.enabled) ? "generated" : "draft" });
        }
        return next;
      });
    },
    [onNodeDataChange, onShortformStateChange, selectedNodeData.nodeType, selectedNodeId],
  );

  const settingsBody = (
    <div className="space-y-5">
      <div className={`rounded-3xl p-4 ${WORKSPACE_SURFACE.softInset}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={`text-sm font-semibold ${WORKSPACE_TEXT.title}`}>{title}</p>
            <p className={`mt-2 text-sm leading-6 ${WORKSPACE_TEXT.body}`}>{description}</p>
          </div>
          <StatusBadge status={selectedNodeData.status ?? "draft"} label={statusInfo.label} tone={statusInfo.tone} />
        </div>
      </div>

      {selectedNodeData.nodeType === "prompt" ? (
        <div className="space-y-4">
          <textarea
            value={projectBriefText}
            onChange={(event) => {
              const nextValue = event.target.value;
              onProjectBriefTextChange(nextValue);
              onNodeDataChange?.(selectedNodeId, { briefText: nextValue });
            }}
            rows={8}
            className={`w-full rounded-2xl px-4 py-3 text-sm leading-6 ${WORKSPACE_CONTROL.input}`}
            placeholder="제품명, 타깃, USP, CTA를 적으면 shortform 섹션으로 정리합니다."
          />
          <select
            value={(selectedNodeData.category as string) ?? ""}
            onChange={(event) => onNodeDataChange?.(selectedNodeId, { category: event.target.value || undefined })}
            className={`h-11 w-full rounded-2xl px-3 text-sm ${WORKSPACE_CONTROL.input}`}
          >
            <option value="">자동</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {mode === "shortform-video" && shortformState && selectedNodeData.nodeType === "generate-images" ? (
        <div className="space-y-4">
          <AssetUpload projectId={projectId ?? ""} allowImages allowBgm={false} onUploadComplete={handleUploadComplete} />
          <div className={`rounded-2xl p-4 ${WORKSPACE_SURFACE.softInset}`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${WORKSPACE_TEXT.muted}`}>레퍼런스 이미지</p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {imageAssets.map((asset) => {
                const active = shortformState.referenceAssetIds.includes(asset.id);
                return (
                  <button
                    key={`reference-${asset.id}`}
                    type="button"
                    onClick={() =>
                      updateShortform((current) => {
                        const next = new Set(current.referenceAssetIds);
                        if (next.has(asset.id)) next.delete(asset.id);
                        else if (next.size < 3) next.add(asset.id);
                        return { ...current, referenceAssetIds: Array.from(next) };
                      })
                    }
                    className={`overflow-hidden rounded-2xl border ${active ? "border-[#D97C67] ring-2 ring-[#F3D4CB]" : "border-[#E5DDD3]"}`}
                  >
                    <AppImage src={asset.previewPath ?? asset.filePath} alt={asset.filePath} width={96} height={96} className="h-20 w-full object-cover" />
                  </button>
                );
              })}
            </div>
          </div>
          {shortformState.sections.map((section) => (
            <div key={section.imageSlot} className={`rounded-2xl p-4 ${WORKSPACE_SURFACE.softInset}`}>
              <p className={`text-sm font-semibold ${WORKSPACE_TEXT.title}`}>{section.headline}</p>
              <p className={`mt-1 text-xs ${WORKSPACE_TEXT.body}`}>{section.body}</p>
              {assignedBySlot.get(section.imageSlot)?.filePath ? (
                <AppImage
                  src={assignedBySlot.get(section.imageSlot)!.filePath}
                  alt={section.headline}
                  width={240}
                  height={160}
                  className="mt-3 h-28 w-full rounded-2xl object-cover"
                />
              ) : null}
              <div className="mt-3 grid grid-cols-3 gap-3">
                {imageAssets.map((asset) => (
                  <button
                    key={`${section.imageSlot}-${asset.id}`}
                    type="button"
                    onClick={() =>
                      updateShortform((current) => ({
                        ...current,
                        generationMode: "demo",
                        sceneAssignments: [
                          ...current.sceneAssignments.filter((item) => item.imageSlot !== section.imageSlot),
                          {
                            imageSlot: section.imageSlot,
                            assetId: asset.id,
                            filePath: asset.filePath,
                            source: current.referenceAssetIds.includes(asset.id) ? "reference" : "manual",
                          },
                        ],
                      }))
                    }
                    className={`overflow-hidden rounded-2xl border ${
                      assignedBySlot.get(section.imageSlot)?.assetId === asset.id ? "border-[#D97C67] ring-2 ring-[#F3D4CB]" : "border-[#E5DDD3]"
                    }`}
                  >
                    <AppImage src={asset.previewPath ?? asset.filePath} alt={asset.filePath} width={96} height={96} className="h-20 w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {mode === "shortform-video" && shortformState && selectedNodeData.nodeType === "bgm" ? (
        <div className="space-y-4">
          <AssetUpload projectId={projectId ?? ""} allowImages={false} allowBgm onUploadComplete={handleUploadComplete} />
          {shortformState.bgm ? (
            <div className={`rounded-2xl p-4 ${WORKSPACE_SURFACE.softInset}`}>
              <p className={`text-sm font-semibold ${WORKSPACE_TEXT.title}`}>현재 BGM</p>
              <p className={`mt-2 text-sm ${WORKSPACE_TEXT.body}`}>{shortformState.bgm.filePath.split("/").pop()}</p>
            </div>
          ) : null}
          {bgmAssets.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() =>
                updateShortform((current) => ({
                  ...current,
                  bgm: { assetId: asset.id, filePath: asset.filePath, durationMs: current.bgm?.durationMs ?? null, bpm: current.bgm?.bpm ?? null },
                }))
              }
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 ${
                shortformState.bgm?.assetId === asset.id ? "border-[#D97C67] bg-[#F8E7E2]/60" : "border-[#E5DDD3] bg-white"
              }`}
            >
              <span className={`truncate text-sm ${WORKSPACE_TEXT.title}`}>{asset.filePath.split("/").pop()}</span>
              <Music className="h-4 w-4 text-[#8D7D70]" />
            </button>
          ))}
        </div>
      ) : null}

      {mode === "shortform-video" && shortformState && selectedNodeData.nodeType === "cuts" ? (
        <div className="space-y-4">
          {orderedCuts.map((cut, index) => (
            <div key={cut.imageSlot} className={`rounded-2xl p-4 ${WORKSPACE_SURFACE.softInset}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`text-sm font-semibold ${WORKSPACE_TEXT.title}`}>{shortformState.sections.find((item) => item.imageSlot === cut.imageSlot)?.headline ?? cut.imageSlot}</p>
                  <p className={`mt-1 text-xs ${WORKSPACE_TEXT.muted}`}>장면 {index + 1}</p>
                </div>
                <label className="flex items-center gap-2 text-xs text-[#6F655D]">
                  <input
                    type="checkbox"
                    checked={cut.enabled}
                    onChange={(event) =>
                      updateShortform((current) => ({
                        ...current,
                        cuts: sortCuts(current).map((item) => item.imageSlot === cut.imageSlot ? { ...item, enabled: event.target.checked } : item),
                      }))
                    }
                  />
                  사용
                </label>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button type="button" onClick={() => index > 0 && updateShortform((current) => {
                  const items = sortCuts(current);
                  [items[index - 1], items[index]] = [items[index], items[index - 1]];
                  return { ...current, cuts: items.map((item, order) => ({ ...item, order })) };
                })} className="rounded-full border border-[#E5DDD3] bg-white p-2"><ArrowUp className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => index < orderedCuts.length - 1 && updateShortform((current) => {
                  const items = sortCuts(current);
                  [items[index + 1], items[index]] = [items[index], items[index + 1]];
                  return { ...current, cuts: items.map((item, order) => ({ ...item, order })) };
                })} className="rounded-full border border-[#E5DDD3] bg-white p-2"><ArrowDown className="h-3.5 w-3.5" /></button>
                <select
                  value={String(cut.durationMs)}
                  onChange={(event) =>
                    updateShortform((current) => ({
                      ...current,
                      cuts: sortCuts(current).map((item) => item.imageSlot === cut.imageSlot ? { ...item, durationMs: Number(event.target.value) } : item),
                    }))
                  }
                  className={`ml-auto h-10 rounded-2xl px-3 text-sm ${WORKSPACE_CONTROL.input}`}
                >
                  {[2000, 3000, 4000, 5000, 6000].map((duration) => (
                    <option key={duration} value={duration}>{duration / 1000}초</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {previewImages.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {previewImages.map((imagePath) => (
            <AppImage key={imagePath} src={imagePath} alt={title} width={140} height={140} className="h-32 w-full rounded-2xl border border-[#E5DDD3] object-cover" />
          ))}
        </div>
      ) : null}
    </div>
  );

  return (
    <aside className="flex w-96 flex-col border-l border-[#E5DDD3] bg-[#FBF8F4]">
      <div className="border-b border-[#E5DDD3] px-6 py-5">
        <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] ${WORKSPACE_TEXT.muted}`}>
          {viewMode === "simple" ? <Sparkles className="h-3.5 w-3.5" /> : <LayoutGrid className="h-3.5 w-3.5" />}
          {viewMode === "simple" ? "현재 단계" : "단계 설정"}
        </div>
        <h2 className={`mt-3 text-lg font-semibold ${WORKSPACE_TEXT.title}`}>{title}</h2>
        <p className={`mt-1 text-sm ${WORKSPACE_TEXT.body}`}>{projectName ?? "프로젝트"}</p>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {viewMode === "simple" ? settingsBody : (
          <Tabs defaultValue="settings" className="flex-1">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl border border-[#E5DDD3] bg-[#F8F4EF] p-1">
              <TabsTrigger value="settings" className="gap-2 rounded-2xl text-xs data-[state=active]:border-[#F1C8BE] data-[state=active]:bg-[#F8E7E2] data-[state=active]:text-[#D97C67]"><LayoutGrid className="h-3.5 w-3.5" />작업 내용</TabsTrigger>
              <TabsTrigger value="assets" className="gap-2 rounded-2xl text-xs data-[state=active]:border-[#F1C8BE] data-[state=active]:bg-[#F8E7E2] data-[state=active]:text-[#D97C67]"><ImageIcon className="h-3.5 w-3.5" />파일</TabsTrigger>
            </TabsList>
            <TabsContent value="settings" className="mt-5">{settingsBody}</TabsContent>
            <TabsContent value="assets" className="mt-5 space-y-4">
              {projectId ? (
                <>
                  <AssetUpload projectId={projectId} allowImages allowBgm={allowBgm} onUploadComplete={handleUploadComplete} />
                  {(recentUploads.length > 0 ? recentUploads : assets.map((asset) => ({
                    id: asset.id,
                    filePath: asset.filePath,
                    type: asset.mimeType?.startsWith("audio/") ? ("bgm" as const) : ("image" as const),
                  }))).map((asset) => (
                    <div key={asset.id} className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm ${WORKSPACE_SURFACE.inset} ${WORKSPACE_TEXT.body}`}>
                      {asset.type === "image" ? <ImageIcon className="h-4 w-4 text-gray-400" /> : <Music className="h-4 w-4 text-gray-400" />}
                      <span className="truncate">{asset.filePath.split("/").pop() ?? asset.filePath}</span>
                    </div>
                  ))}
                </>
              ) : (
                <p className={`text-sm leading-6 ${WORKSPACE_TEXT.muted}`}>프로젝트를 불러온 뒤 파일을 업로드할 수 있습니다.</p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </aside>
  );
}
