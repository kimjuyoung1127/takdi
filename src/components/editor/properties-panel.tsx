/** 에디터 우측 속성 패널 — 선택된 노드의 설정/에셋/히스토리/비용 탭 */
"use client";

import { useState, useCallback } from "react";
import { Settings, ImageIcon, Clock, DollarSign, Music, LayoutGrid } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AppImage } from "@/components/ui/app-image";
import { AssetUpload } from "./asset-upload";
import { STATUS_LABELS } from "@/components/ui/status-badge";
import { fetchUsage, type UsageSummary } from "@/lib/api-client";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import type { LogEntry } from "@/hooks/use-logger";
import type { NodeData } from "./node-canvas";

interface UploadedAsset {
  id: string;
  filePath: string;
  type: "image" | "bgm";
}

interface PropertiesPanelProps {
  selectedNodeId?: string | null;
  selectedNodeData?: NodeData | null;
  onNodeDataChange?: (nodeId: string, patch: Partial<NodeData>) => void;
  projectId?: string;
  projectName?: string;
  nodeCount?: number;
  logs?: LogEntry[];
}

export function PropertiesPanel({ selectedNodeId, selectedNodeData, onNodeDataChange, projectId, projectName, nodeCount, logs = [] }: PropertiesPanelProps) {
  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [usageLoading, setUsageLoading] = useState(false);

  const handleUploadComplete = useCallback((asset: UploadedAsset) => {
    setAssets((prev) => [...prev, asset]);
  }, []);

  // Load usage when cost tab is likely viewed
  const loadUsage = useCallback(async () => {
    if (usageLoading) return;
    setUsageLoading(true);
    try {
      const data = await fetchUsage();
      setUsage(data);
    } catch {
      // silently fail — usage is non-critical
    } finally {
      setUsageLoading(false);
    }
  }, [usageLoading]);

  if (!selectedNodeId) {
    return (
      <aside className="flex w-80 flex-col border-l border-gray-100 bg-white">
        <div className="flex flex-col items-center justify-center gap-4 px-5 py-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-400">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">{projectName ?? "프로젝트"}</p>
            <p className="mt-1 text-xs text-gray-400">
              작업 단계 {nodeCount ?? 0}개
            </p>
          </div>
        </div>

        <div className="mx-5 border-t border-gray-100 pt-4">
          <p className="mb-3 text-xs font-medium text-gray-500">단축키</p>
          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>전체 실행</span>
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">Ctrl+Enter</kbd>
            </div>
            <div className="flex justify-between">
              <span>저장</span>
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">Ctrl+S</kbd>
            </div>
            <div className="flex justify-between">
              <span>중지</span>
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">Esc</kbd>
            </div>
            <div className="flex justify-between">
              <span>단계 삭제</span>
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">Delete</kbd>
            </div>
            <div className="flex justify-between">
              <span>실행 취소</span>
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">Ctrl+Z</kbd>
            </div>
            <div className="flex justify-between">
              <span>다시 실행</span>
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">Ctrl+Shift+Z</kbd>
            </div>
          </div>
        </div>

        <div className="mx-5 mt-4 border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-300">
            작업 단계를 클릭하면 설정을 변경할 수 있습니다
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex w-80 flex-col border-l border-gray-100 bg-white">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-gray-900">설정</h2>
        <p className="text-xs text-gray-400">{selectedNodeData?.label ?? selectedNodeId}</p>
      </div>

      <Tabs defaultValue="settings" className="flex-1">
        <TabsList className="mx-4 mt-3">
          <TabsTrigger value="settings" className="gap-1 text-xs">
            <Settings className="h-3.5 w-3.5" />
            설정
          </TabsTrigger>
          <TabsTrigger value="assets" className="gap-1 text-xs">
            <ImageIcon className="h-3.5 w-3.5" />
            파일
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1 text-xs">
            <Clock className="h-3.5 w-3.5" />
            기록
          </TabsTrigger>
          <TabsTrigger
            value="cost"
            className="gap-1 text-xs"
            onClick={loadUsage}
          >
            <DollarSign className="h-3.5 w-3.5" />
            비용
          </TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings" className="p-4">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500">노드 ID</label>
              <p className="mt-0.5 text-xs text-gray-300">{selectedNodeId}</p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">유형</label>
              <p className="mt-0.5 text-sm text-gray-900">{selectedNodeData?.nodeType ?? "-"}</p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">이름</label>
              <input
                value={selectedNodeData?.label ?? ""}
                onChange={(e) =>
                  selectedNodeId && onNodeDataChange?.(selectedNodeId, { label: e.target.value })
                }
                className="h-8 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-900 focus:border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-300"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">간단 설명</label>
              <textarea
                value={(selectedNodeData?.briefText as string) ?? ""}
                onChange={(e) =>
                  selectedNodeId && onNodeDataChange?.(selectedNodeId, { briefText: e.target.value })
                }
                rows={3}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                placeholder="이 단계에서 할 작업을 간단히 설명하세요"
              />
            </div>

            {selectedNodeData?.nodeType === "prompt" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">상품 카테고리</label>
                <select
                  value={(selectedNodeData?.category as string) ?? ""}
                  onChange={(e) =>
                    selectedNodeId && onNodeDataChange?.(selectedNodeId, { category: e.target.value || undefined })
                  }
                  className="h-8 w-full rounded-md border border-gray-200 px-2 text-sm text-gray-900 focus:border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                >
                  <option value="">자동 (카테고리 미지정)</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-gray-400">카테고리에 맞는 전문 카피가 생성됩니다</p>
              </div>
            )}

            {selectedNodeData?.nodeType === "upload-image" && projectId && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">상품 이미지</label>
                {selectedNodeData?.uploadedAssetId ? (
                  <div className="space-y-2">
                    {typeof selectedNodeData?.uploadedFilePath === "string" && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <AppImage
                        src={selectedNodeData.uploadedFilePath}
                        alt="업로드된 이미지"
                        width={96}
                        height={96}
                        className="h-24 w-24 rounded-lg border border-gray-200 object-cover"
                      />
                    )}
                    <p className="text-[10px] text-gray-400">에셋 ID: {String(selectedNodeData.uploadedAssetId).slice(0, 8)}...</p>
                  </div>
                ) : (
                  <AssetUpload
                    projectId={projectId}
                    onUploadComplete={(asset) => {
                      if (selectedNodeId) {
                        onNodeDataChange?.(selectedNodeId, {
                          uploadedAssetId: asset.id,
                          uploadedFilePath: asset.filePath,
                          status: "generated",
                          previewImages: [asset.filePath],
                        });
                      }
                    }}
                  />
                )}
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-gray-500">상태</label>
              <p className="mt-0.5 text-sm text-gray-900">
                {STATUS_LABELS[selectedNodeData?.status ?? "draft"] ?? selectedNodeData?.status ?? "초안"}
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="p-4">
          {projectId ? (
            <div className="space-y-4">
              <AssetUpload
                projectId={projectId}
                onUploadComplete={handleUploadComplete}
              />

              {assets.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500">
                    업로드됨 ({assets.length})
                  </p>
                  {assets.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600"
                    >
                      {a.type === "image" ? (
                        <ImageIcon className="h-3.5 w-3.5 text-gray-400" />
                      ) : (
                        <Music className="h-3.5 w-3.5 text-gray-400" />
                      )}
                      <span className="truncate">{a.filePath.split("/").pop()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400">프로젝트를 먼저 로드해 주세요</p>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="p-4">
          {logs.length === 0 ? (
            <p className="text-xs text-gray-400">아직 실행 기록이 없습니다</p>
          ) : (
            <div className="max-h-96 space-y-1 overflow-y-auto font-mono text-xs">
              {logs.map((entry) => (
                <div key={entry.id} className="flex gap-2">
                  <span className="shrink-0 text-gray-300">{entry.timestamp}</span>
                  <span
                    className={
                      entry.level === "error"
                        ? "text-rose-500"
                        : entry.level === "warn"
                          ? "text-amber-500"
                          : "text-gray-500"
                    }
                  >
                    {entry.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Cost Tab */}
        <TabsContent value="cost" className="p-4">
          {usageLoading ? (
            <p className="text-xs text-gray-400">불러오는 중...</p>
          ) : usage ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-[10px] font-medium text-gray-400">총 작업 수</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {usage.summary.totalEvents}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-[10px] font-medium text-gray-400">생성 횟수</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {usage.summary.generationCount}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-[10px] font-medium text-gray-400">내보내기 횟수</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {usage.summary.exportCount}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-[10px] font-medium text-gray-400">예상 비용</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${usage.summary.totalEstimatedCost.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400">
              비용 탭을 클릭하면 사용량을 확인할 수 있습니다
            </p>
          )}
        </TabsContent>
      </Tabs>
    </aside>
  );
}
