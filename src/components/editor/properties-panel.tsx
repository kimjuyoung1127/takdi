/** 에디터 우측 속성 패널 — 선택된 노드의 설정/에셋/히스토리/비용 탭 */
"use client";

import { Settings, ImageIcon, Clock, DollarSign } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface PropertiesPanelProps {
  selectedNodeId?: string | null;
}

export function PropertiesPanel({ selectedNodeId }: PropertiesPanelProps) {
  if (!selectedNodeId) {
    return (
      <aside className="flex w-80 flex-col items-center justify-center border-l border-gray-100 bg-white">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-300">
            <Settings className="h-6 w-6" />
          </div>
          <p className="text-sm text-gray-400">노드를 선택하세요</p>
          <p className="mt-1 text-xs text-gray-300">
            캔버스에서 노드를 클릭하면 속성을 편집할 수 있습니다
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex w-80 flex-col border-l border-gray-100 bg-white">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-gray-900">Properties</h2>
        <p className="text-xs text-gray-400">Node: {selectedNodeId}</p>
      </div>

      <Tabs defaultValue="settings" className="flex-1">
        <TabsList className="mx-4 mt-3">
          <TabsTrigger value="settings" className="gap-1 text-xs">
            <Settings className="h-3.5 w-3.5" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="assets" className="gap-1 text-xs">
            <ImageIcon className="h-3.5 w-3.5" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1 text-xs">
            <Clock className="h-3.5 w-3.5" />
            History
          </TabsTrigger>
          <TabsTrigger value="cost" className="gap-1 text-xs">
            <DollarSign className="h-3.5 w-3.5" />
            Cost
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="p-4">
          <p className="text-xs text-gray-400">
            노드 설정이 여기에 표시됩니다
          </p>
        </TabsContent>

        <TabsContent value="assets" className="p-4">
          <p className="text-xs text-gray-400">
            생성된 에셋이 여기에 표시됩니다
          </p>
        </TabsContent>

        <TabsContent value="history" className="p-4">
          <p className="text-xs text-gray-400">
            실행 히스토리가 여기에 표시됩니다
          </p>
        </TabsContent>

        <TabsContent value="cost" className="p-4">
          <p className="text-xs text-gray-400">
            비용 정보가 여기에 표시됩니다
          </p>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
