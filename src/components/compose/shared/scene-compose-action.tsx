/** SceneComposeAction - AI 배경 합성 액션 (속성 패널용) */
"use client";

import { useState, useCallback, useRef } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { startSceneCompose, pollSceneCompose } from "@/lib/api-client";

interface Props {
  projectId: string;
  imageUrl: string;
  onImageChange: (url: string) => void;
}

const POLL_INTERVAL = 2000;

export function SceneComposeAction({ projectId, imageUrl, onImageChange }: Props) {
  const [prompt, setPrompt] = useState("");
  const [running, setRunning] = useState(false);
  const [open, setOpen] = useState(false);
  const abortRef = useRef(false);

  const handleCompose = useCallback(async () => {
    if (!prompt.trim() || !imageUrl) return;

    setRunning(true);
    abortRef.current = false;

    try {
      const { jobId } = await startSceneCompose(projectId, {
        imageUrl,
        scenePrompt: prompt.trim(),
      });

      // Poll for result
      while (!abortRef.current) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL));
        const result = await pollSceneCompose(projectId, jobId);

        if (result.job.status === "done") {
          const assets = (result as { assets?: Array<{ filePath: string }> }).assets;
          if (assets?.[0]?.filePath) {
            onImageChange(assets[0].filePath);
            toast.success("배경 합성이 완료되었습니다");
            setOpen(false);
            setPrompt("");
          }
          break;
        }

        if (result.job.status === "failed") {
          throw new Error(result.job.error || "합성 실패");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "배경 합성에 실패했습니다");
    } finally {
      setRunning(false);
    }
  }, [projectId, imageUrl, prompt, onImageChange]);

  if (!imageUrl) return null;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-1.5 rounded border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-100"
      >
        <Wand2 className="h-3.5 w-3.5" />
        AI 배경 합성
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded border border-purple-200 bg-purple-50/50 p-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-purple-600">AI 배경 합성</span>
        {!running && (
          <button onClick={() => setOpen(false)} className="text-[10px] text-gray-400 hover:text-gray-600">
            닫기
          </button>
        )}
      </div>
      <input
        type="text"
        placeholder="장면 설명 (예: 깔끔한 흰색 스튜디오)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && !running) handleCompose(); }}
        disabled={running}
        className="w-full rounded border border-purple-200 bg-white px-2 py-1.5 text-xs placeholder:text-gray-400"
      />
      <button
        onClick={handleCompose}
        disabled={running || !prompt.trim()}
        className="flex w-full items-center justify-center gap-1.5 rounded bg-purple-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-600 disabled:opacity-50"
      >
        {running ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            합성 중...
          </>
        ) : (
          <>
            <Wand2 className="h-3.5 w-3.5" />
            합성 시작
          </>
        )}
      </button>
    </div>
  );
}
