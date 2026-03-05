/** React Flow 기반 노드 에디터 캔버스 */
"use client";

import { useCallback, useRef } from "react";
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
import { TakdiNode } from "./takdi-node";

const nodeTypes = { takdi: TakdiNode };

const INITIAL_NODES: Node[] = [
  {
    id: "1",
    type: "takdi",
    position: { x: 100, y: 100 },
    data: { label: "Text Generate", nodeType: "generate", status: "draft" },
  },
  {
    id: "2",
    type: "takdi",
    position: { x: 400, y: 80 },
    data: {
      label: "Image Generate",
      nodeType: "generate-images",
      status: "draft",
    },
  },
  {
    id: "3",
    type: "takdi",
    position: { x: 700, y: 100 },
    data: { label: "Render", nodeType: "render", status: "draft" },
  },
];

const INITIAL_EDGES: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
];

export function NodeCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);

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

  return (
    <div ref={reactFlowWrapper} className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Background gap={20} size={1} color="#e5e7eb" />
        <Controls className="rounded-xl bg-white shadow-sm" />
      </ReactFlow>
    </div>
  );
}
