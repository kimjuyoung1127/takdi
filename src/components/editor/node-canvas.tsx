/** React Flow 기반 노드 에디터 캔버스 */
"use client";

import { useCallback, useRef, useEffect, useImperativeHandle, forwardRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { MousePointerClick, Copy, Trash2, RotateCcw } from "lucide-react";
import { TakdiNode } from "./takdi-node";

interface ContextMenuState {
  nodeId: string;
  x: number;
  y: number;
}

const nodeTypes = { takdi: TakdiNode };
const MAX_HISTORY = 50;

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
  isRunning?: boolean;
}

export const NodeCanvas = forwardRef<NodeCanvasHandle, NodeCanvasProps>(
  function NodeCanvas({ onStateChange, onNodeSelect, isRunning }, ref) {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
    const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

    // --- Undo/Redo history ---
    const historyRef = useRef<{ nodes: Node[]; edges: Edge[] }[]>([
      { nodes: INITIAL_NODES, edges: INITIAL_EDGES },
    ]);
    const historyIndexRef = useRef(0);
    const isUndoRedoRef = useRef(0);

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

    // Toggle edge animation when pipeline is running
    useEffect(() => {
      setEdges((eds) => eds.map((e) => ({ ...e, animated: !!isRunning })));
    }, [isRunning, setEdges]);

    // Record history snapshots (skip if caused by undo/redo)
    useEffect(() => {
      if (isUndoRedoRef.current > 0) {
        isUndoRedoRef.current -= 1;
        return;
      }
      const snapshot = { nodes: nodes.map((n) => ({ ...n })), edges: edges.map((e) => ({ ...e })) };
      const history = historyRef.current;
      const idx = historyIndexRef.current;
      // Trim future history
      historyRef.current = history.slice(0, idx + 1);
      historyRef.current.push(snapshot);
      if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift();
      historyIndexRef.current = historyRef.current.length - 1;
    }, [nodes, edges]);

    // Undo/Redo keyboard handler
    useEffect(() => {
      function onKeyDown(e: KeyboardEvent) {
        const el = e.target as HTMLElement;
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable) return;

        if (e.ctrlKey && e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          const idx = historyIndexRef.current;
          if (idx > 0) {
            historyIndexRef.current = idx - 1;
            isUndoRedoRef.current = 2;
            const snap = historyRef.current[idx - 1];
            setNodes(snap.nodes);
            setEdges(snap.edges);
          }
        } else if (e.ctrlKey && e.shiftKey && e.key === "Z") {
          e.preventDefault();
          const idx = historyIndexRef.current;
          if (idx < historyRef.current.length - 1) {
            historyIndexRef.current = idx + 1;
            isUndoRedoRef.current = 2;
            const snap = historyRef.current[idx + 1];
            setNodes(snap.nodes);
            setEdges(snap.edges);
          }
        }
      }
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }, [setNodes, setEdges]);

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
      setContextMenu(null);
    }, [onNodeSelect]);

    const onNodeContextMenu = useCallback(
      (event: React.MouseEvent, node: Node) => {
        event.preventDefault();
        const bounds = reactFlowWrapper.current?.getBoundingClientRect();
        setContextMenu({
          nodeId: node.id,
          x: event.clientX - (bounds?.left ?? 0),
          y: event.clientY - (bounds?.top ?? 0),
        });
      },
      [],
    );

    const handleDuplicate = useCallback(() => {
      if (!contextMenu) return;
      const source = nodes.find((n) => n.id === contextMenu.nodeId);
      if (!source) return;
      const newNode: Node = {
        id: `${Date.now()}`,
        type: "takdi",
        position: { x: source.position.x + 50, y: source.position.y + 50 },
        data: { ...source.data, status: "draft" },
      };
      setNodes((nds) => [...nds, newNode]);
      setContextMenu(null);
    }, [contextMenu, nodes, setNodes]);

    const handleDeleteNode = useCallback(() => {
      if (!contextMenu) return;
      const id = contextMenu.nodeId;
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      onNodeSelect?.(null);
      setContextMenu(null);
    }, [contextMenu, setNodes, setEdges, onNodeSelect]);

    const handleResetStatus = useCallback(() => {
      if (!contextMenu) return;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === contextMenu.nodeId ? { ...n, data: { ...n.data, status: "draft" } } : n,
        ),
      );
      setContextMenu(null);
    }, [contextMenu, setNodes]);

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
          onNodeContextMenu={onNodeContextMenu}
          nodeTypes={nodeTypes}
          deleteKeyCode={["Delete", "Backspace"]}
          fitView
          className="bg-gray-50"
        >
          <Background gap={20} size={1} color="#e5e7eb" />
          <Controls className="rounded-xl bg-white shadow-sm" />
          <MiniMap
            nodeStrokeWidth={3}
            nodeColor="#6366f1"
            maskColor="rgba(0,0,0,0.08)"
            className="rounded-xl border border-gray-100 bg-white/80 shadow-sm"
          />
        </ReactFlow>

        {/* Context menu */}
        {contextMenu && (
          <div
            className="absolute z-50 min-w-[140px] rounded-xl bg-white py-1 shadow-lg ring-1 ring-gray-200"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              onClick={handleDuplicate}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
            >
              <Copy className="h-3.5 w-3.5" />
              복제
            </button>
            <button
              onClick={handleResetStatus}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              상태 초기화
            </button>
            <div className="my-1 h-px bg-gray-100" />
            <button
              onClick={handleDeleteNode}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              삭제
            </button>
          </div>
        )}

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
