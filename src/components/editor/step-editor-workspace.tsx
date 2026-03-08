"use client";

import { CheckCircle2, ChevronRight } from "lucide-react";
import type { Node } from "@xyflow/react";
import { AppImage } from "@/components/ui/app-image";
import { StatusBadge } from "@/components/ui/status-badge";
import { getSimpleModeSteps, getUserFacingNodeStatus } from "@/lib/editor-surface";
import type { NodeData } from "./node-canvas";

interface StepEditorWorkspaceProps {
  mode: string;
  nodes: Node[];
  selectedNodeId: string | null;
  onSelectStep: (nodeId: string) => void;
}

export function StepEditorWorkspace({
  mode,
  nodes,
  selectedNodeId,
  onSelectStep,
}: StepEditorWorkspaceProps) {
  const steps = getSimpleModeSteps(mode)
    .map((step) => {
      const node = nodes.find((candidate) => (candidate.data as NodeData).nodeType === step.nodeType);
      if (!node) {
        return null;
      }

      const nodeData = node.data as NodeData;
      return {
        ...step,
        nodeId: node.id,
        nodeData,
        statusInfo: getUserFacingNodeStatus(nodeData),
      };
    })
    .filter((step): step is NonNullable<typeof step> => Boolean(step));

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[32px] border border-gray-200 bg-white/90 p-8 shadow-[0_16px_60px_rgba(15,23,42,0.08)]">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-indigo-600">간단 모드</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-950">순서대로 확인하고 실행하면 됩니다.</h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          내부 노드 구조는 숨기고 작업 순서만 남겼습니다. 필요한 항목을 입력한 뒤 상단의 실행 또는 내보내기 버튼을 사용하세요.
        </p>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-2">
        {steps.map((step, index) => {
          const isSelected = selectedNodeId === step.nodeId;
          const previewImage =
            Array.isArray(step.nodeData.previewImages) && typeof step.nodeData.previewImages[0] === "string"
              ? step.nodeData.previewImages[0]
              : null;

          return (
            <button
              key={step.nodeId}
              type="button"
              onClick={() => onSelectStep(step.nodeId)}
              className={`group flex min-h-44 flex-col rounded-3xl border p-5 text-left transition ${
                isSelected
                  ? "border-indigo-300 bg-indigo-50/60 shadow-[0_10px_30px_rgba(99,102,241,0.12)]"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span>{step.title}</span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-gray-950">{step.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{step.description}</p>
                </div>
                <StatusBadge
                  status={step.nodeData.status ?? "draft"}
                  label={step.statusInfo.label}
                  tone={step.statusInfo.tone}
                />
              </div>

              <div className="mt-5 flex flex-1 items-end justify-between gap-4">
                <div className="space-y-2">
                  {step.helpItems?.slice(0, 2).map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs leading-5 text-gray-500">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {previewImage ? (
                  <AppImage
                    src={previewImage}
                    alt={step.title}
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-2xl border border-white/60 object-cover shadow-sm"
                  />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
