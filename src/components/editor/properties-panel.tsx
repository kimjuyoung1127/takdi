"use client";

import { useCallback, useState } from "react";
import { ImageIcon, LayoutGrid, Music, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppImage } from "@/components/ui/app-image";
import { StatusBadge } from "@/components/ui/status-badge";
import { AssetUpload } from "./asset-upload";
import type { EditorViewMode } from "@/lib/editor-surface";
import { getStepPresentation, getUserFacingNodeStatus } from "@/lib/editor-surface";
import { PRODUCT_CATEGORIES, NODE_TYPE_LABELS } from "@/lib/constants";
import { WORKSPACE_CONTROL, WORKSPACE_SURFACE, WORKSPACE_TEXT } from "@/lib/workspace-surface";
import type { NodeData } from "./node-canvas";

interface UploadedAsset {
  id: string;
  filePath: string;
  type: "image" | "bgm";
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
}

function FilePreview({
  label,
  filePath,
}: {
  label: string;
  filePath: string;
}) {
  const fileName = filePath.split("/").pop() ?? filePath.split("\\").pop() ?? filePath;

  return (
    <div className={`rounded-2xl p-3 ${WORKSPACE_SURFACE.softInset}`}>
      <p className={`text-xs font-medium ${WORKSPACE_TEXT.body}`}>{label}</p>
      <div className="mt-3 flex items-center gap-3">
        <AppImage
          src={filePath}
          alt={fileName}
          width={72}
          height={72}
          className="h-20 w-20 rounded-2xl border border-white object-cover shadow-[0_10px_24px_rgba(55,40,30,0.08)]"
        />
        <div className="min-w-0">
          <p className={`truncate text-sm font-medium ${WORKSPACE_TEXT.title}`}>{fileName}</p>
          <p className={`mt-1 truncate text-xs ${WORKSPACE_TEXT.muted}`}>{filePath}</p>
        </div>
      </div>
    </div>
  );
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
}: PropertiesPanelProps) {
  const [assets, setAssets] = useState<UploadedAsset[]>([]);

  const handleUploadComplete = useCallback((asset: UploadedAsset) => {
    setAssets((prev) => [asset, ...prev]);

    if (asset.type === "image" && selectedNodeId && selectedNodeData?.nodeType === "upload-image") {
      onNodeDataChange?.(selectedNodeId, {
        uploadedAssetId: asset.id,
        uploadedFilePath: asset.filePath,
        status: "generated",
        previewImages: [asset.filePath],
      });
    }
  }, [onNodeDataChange, selectedNodeData?.nodeType, selectedNodeId]);

  if (!selectedNodeId || !selectedNodeData) {
    return <EmptyPanel projectName={projectName} nodeCount={nodeCount} />;
  }

  const stepPresentation = getStepPresentation(mode, selectedNodeData.nodeType);
  const statusInfo = getUserFacingNodeStatus(selectedNodeData);
  const title = stepPresentation?.title ?? selectedNodeData.label ?? NODE_TYPE_LABELS[selectedNodeData.nodeType as keyof typeof NODE_TYPE_LABELS] ?? "작업 단계";
  const description = stepPresentation?.description ?? "현재 단계에 필요한 정보를 확인합니다.";
  const previewImages = Array.isArray(selectedNodeData.previewImages)
    ? selectedNodeData.previewImages.filter((value): value is string => typeof value === "string")
    : [];
  const uploadedFilePath = typeof selectedNodeData.uploadedFilePath === "string" ? selectedNodeData.uploadedFilePath : null;

  const settingsBody = (
    <div className="space-y-5">
        <div className={`rounded-3xl p-4 ${WORKSPACE_SURFACE.softInset}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={`text-sm font-semibold ${WORKSPACE_TEXT.title}`}>{title}</p>
            <p className={`mt-2 text-sm leading-6 ${WORKSPACE_TEXT.body}`}>{description}</p>
          </div>
          <StatusBadge
            status={selectedNodeData.status ?? "draft"}
            label={statusInfo.label}
            tone={statusInfo.tone}
          />
        </div>
      </div>

      {selectedNodeData.nodeType === "prompt" ? (
        <div className="space-y-4">
          <div>
            <label className={`mb-2 block text-xs font-semibold uppercase tracking-[0.18em] ${WORKSPACE_TEXT.muted}`}>
              촬영 지시
            </label>
            <textarea
              value={projectBriefText}
              onChange={(event) => {
                const nextValue = event.target.value;
                onProjectBriefTextChange(nextValue);
                onNodeDataChange?.(selectedNodeId, { briefText: nextValue });
              }}
              rows={8}
              className={`w-full rounded-2xl px-4 py-3 text-sm leading-6 ${WORKSPACE_CONTROL.input}`}
              placeholder="예: 밝은 스튜디오 조명, 20대 여성 모델, 미니멀 배경, 제품이 잘 보이도록 상반신 중심 구도"
            />
          </div>

          <div>
            <label className={`mb-2 block text-xs font-semibold uppercase tracking-[0.18em] ${WORKSPACE_TEXT.muted}`}>
              카테고리
            </label>
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
            <p className={`mt-2 text-xs leading-5 ${WORKSPACE_TEXT.muted}`}>
              제품 카테고리를 지정하면 문안과 이미지 방향이 조금 더 안정적으로 맞춰집니다.
            </p>
          </div>
        </div>
      ) : null}

      {selectedNodeData.nodeType === "upload-image" && projectId ? (
        <div className="space-y-4">
          <AssetUpload
            projectId={projectId}
            allowBgm={false}
            onUploadComplete={handleUploadComplete}
          />

          {uploadedFilePath ? <FilePreview label="현재 업로드" filePath={uploadedFilePath} /> : null}

          <div className="rounded-2xl border border-dashed border-[#D5CCC3] p-4">
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${WORKSPACE_TEXT.muted}`}>업로드 가이드</p>
            <ul className={`mt-3 space-y-2 text-sm leading-6 ${WORKSPACE_TEXT.body}`}>
              {(stepPresentation?.helpItems ?? []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {previewImages.length > 0 ? (
        <div className="space-y-3">
          <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${WORKSPACE_TEXT.muted}`}>관련 파일</p>
          <div className="grid grid-cols-2 gap-3">
            {previewImages.map((imagePath) => (
              <AppImage
                key={imagePath}
                src={imagePath}
                alt={title}
                width={140}
                height={140}
                    className="h-32 w-full rounded-2xl border border-[#E5DDD3] object-cover"
              />
            ))}
          </div>
        </div>
      ) : null}

      {viewMode === "expert" ? (
        <details className={`rounded-2xl px-4 py-3 ${WORKSPACE_SURFACE.softInset}`}>
          <summary className={`cursor-pointer text-sm font-medium ${WORKSPACE_TEXT.body}`}>고급 정보</summary>
          <div className="mt-4 space-y-3 text-sm">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${WORKSPACE_TEXT.muted}`}>단계 이름</p>
              <input
                value={selectedNodeData.label ?? ""}
                onChange={(event) => onNodeDataChange?.(selectedNodeId, { label: event.target.value })}
                className={`mt-2 h-10 w-full rounded-2xl px-3 text-sm ${WORKSPACE_CONTROL.input}`}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${WORKSPACE_TEXT.muted}`}>표시 유형</p>
                <p className={`mt-2 text-sm ${WORKSPACE_TEXT.body}`}>{title}</p>
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${WORKSPACE_TEXT.muted}`}>내부 타입</p>
                <p className={`mt-2 font-mono text-sm ${WORKSPACE_TEXT.body}`}>{selectedNodeData.nodeType}</p>
              </div>
            </div>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${WORKSPACE_TEXT.muted}`}>Node ID</p>
              <p className={`mt-2 font-mono text-sm ${WORKSPACE_TEXT.body}`}>{selectedNodeId}</p>
            </div>
          </div>
        </details>
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
        {viewMode === "simple" ? (
          settingsBody
        ) : (
          <Tabs defaultValue="settings" className="flex-1">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl border border-[#E5DDD3] bg-[#F8F4EF] p-1">
              <TabsTrigger value="settings" className="gap-2 rounded-2xl text-xs data-[state=active]:border-[#F1C8BE] data-[state=active]:bg-[#F8E7E2] data-[state=active]:text-[#D97C67]">
                <LayoutGrid className="h-3.5 w-3.5" />
                작업 내용
              </TabsTrigger>
              <TabsTrigger value="assets" className="gap-2 rounded-2xl text-xs data-[state=active]:border-[#F1C8BE] data-[state=active]:bg-[#F8E7E2] data-[state=active]:text-[#D97C67]">
                <ImageIcon className="h-3.5 w-3.5" />
                파일
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="mt-5">
              {settingsBody}
            </TabsContent>

            <TabsContent value="assets" className="mt-5 space-y-4">
              {projectId ? (
                <>
                  <AssetUpload
                    projectId={projectId}
                    allowBgm={allowBgm}
                    onUploadComplete={handleUploadComplete}
                  />

                  {assets.length > 0 ? (
                    <div className="space-y-2">
                      <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${WORKSPACE_TEXT.muted}`}>최근 업로드</p>
                      {assets.map((asset) => (
                        <div
                          key={asset.id}
                          className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm ${WORKSPACE_SURFACE.inset} ${WORKSPACE_TEXT.body}`}
                        >
                          {asset.type === "image" ? (
                            <ImageIcon className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Music className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="truncate">{asset.filePath.split("/").pop() ?? asset.filePath}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-sm leading-6 ${WORKSPACE_TEXT.muted}`}>
                      업로드한 파일이 있으면 이곳에서 바로 확인할 수 있습니다.
                    </p>
                  )}
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
