/** React Flow 기반 노드 에디터 캔버스 */
"use client";

import { useCallback, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { MousePointerClick } from "lucide-react";
import { TakdiNode } from "./takdi-node";

const nodeTypes = { takdi: TakdiNode };

export interface NodeData {
  label: string;
  nodeType: string;
  status?: string;
  briefText?: string;
  ratio?: string;
  [key: string]: unknown;
}

export interface NodeCanvasHandle {
  updateNodeData: (nodeId: string, patch: Partial<NodeData>) => void;
  updateNodesByType: (nodeType: string, patch: Partial<NodeData>) => void;
  deleteSelectedNodes: () => void;
  getNodeCount: () => number;
}

const INITIAL_NODES: Node[] = [
  {
    id: "1",
    type: "takdi",
    position: { x: 100, y: 100 },
    data: { label: "텍스트 생성", nodeType: "generate", status: "draft" },
  },
  {
    id: "2",
    type: "takdi",
    position: { x: 400, y: 80 },
    data: {
      label: "이미지 생성",
      nodeType: "generate-images",
      status: "draft",
    },
  },
  {
    id: "3",
    type: "takdi",
    position: { x: 700, y: 100 },
    data: { label: "렌더링", nodeType: "render", status: "draft" },
  },
];

const INITIAL_EDGES: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
];

interface NodeCanvasProps {
  onStateChange?: (nodes: Node[], edges: Edge[]) => void;
  onNodeSelect?: (nodeId: string | null, nodeData?: NodeData) => void;
}

export const NodeCanvas = forwardRef<NodeCanvasHandle, NodeCanvasProps>(
  function NodeCanvas({ onStateChange, onNodeSelect }, ref) {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
    const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);

    useImperativeHandle(ref, () => ({
      updateNodeData(nodeId: string, patch: Partial<NodeData>) {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n,
          ),
        );
      },
      updateNodesByType(nodeType: string, patch: Partial<NodeData>) {
        setNodes((nds) =>
          nds.map((n) =>
            (n.data as NodeData).nodeType === nodeType
              ? { ...n, data: { ...n.data, ...patch } }
              : n,
          ),
        );
      },
      deleteSelectedNodes() {
        setNodes((nds) => {
          const selectedIds = new Set(nds.filter((n) => n.selected).map((n) => n.id));
          if (selectedIds.size === 0) return nds;
          setEdges((eds) => eds.filter((e) => !selectedIds.has(e.source) && !selectedIds.has(e.target)));
          return nds.filter((n) => !n.selected);
        });
        onNodeSelect?.(null);
      },
      getNodeCount() {
        return nodes.length;
      },
    }), [setNodes, setEdges, onNodeSelect, nodes.length]);

    // Notify parent of state changes
    useEffect(() => {
      onStateChange?.(nodes, edges);
    }, [nodes, edges, onStateChange]);

    const onConnect = useCallback(
      (params: Connection) => setEdges((eds) => addEdge(params, eds)),
      [setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
      (event: React.DragEvent) => {
        event.preventDefault();
        const type = event.dataTransfer.getData("application/reactflow-type");
        const label = event.dataTransfer.getData("application/reactflow-label");
        if (!type) return;

        const bounds = reactFlowWrapper.current?.getBoundingClientRect();
        const position = {
          x: event.clientX - (bounds?.left ?? 0),
          y: event.clientY - (bounds?.top ?? 0),
        };

        const newNode: Node = {
          id: `${Date.now()}`,
          type: "takdi",
          position,
          data: { label, nodeType: type, status: "draft" },
        };

        setNodes((nds) => [...nds, newNode]);
      },
      [setNodes]
    );

    const onNodeClick = useCallback(
      (_: React.MouseEvent, node: Node) => {
        onNodeSelect?.(node.id, node.data as NodeData);
      },
      [onNodeSelect]
    );

    const onPaneClick = useCallback(() => {
      onNodeSelect?.(null);
    }, [onNodeSelect]);

    return (
      <div ref={reactFlowWrapper} className="relative h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          deleteKeyCode={["Delete", "Backspace"]}
          fitView
          className="bg-gray-50"
        >
          <Background gap={20} size={1} color="#e5e7eb" />
          <Controls className="rounded-xl bg-white shadow-sm" />
        </ReactFlow>

        {/* Empty canvas onboarding overlay */}
        {nodes.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/80 px-8 py-6 shadow-sm backdrop-blur">
              <MousePointerClick className="h-8 w-8 text-indigo-400" />
              <p className="text-sm font-medium text-gray-600">캔버스가 비어있습니다</p>
              <p className="text-xs text-gray-400">좌측 패널에서 노드를 드래그하여 추가하세요</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);
