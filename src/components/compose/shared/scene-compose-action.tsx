"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { pollSceneCompose, startSceneCompose } from "@/lib/api-client";
import { SCENE_CATEGORIES, SCENE_TEMPLATES, type SceneTemplate } from "@/lib/scene-templates";

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
  const [selectedCategory, setSelectedCategory] = useState("studio");
  const abortRef = useRef(false);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categoryTemplates = useMemo(
    () => SCENE_TEMPLATES.filter((template) => template.category === selectedCategory),
    [selectedCategory],
  );

  const stopPolling = useCallback(() => {
    abortRef.current = true;
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  const waitForNextPoll = useCallback(() => {
    return new Promise<void>((resolve) => {
      pollTimerRef.current = setTimeout(() => {
        pollTimerRef.current = null;
        resolve();
      }, POLL_INTERVAL);
    });
  }, []);

  const handleSelectTemplate = useCallback((template: SceneTemplate) => {
    setPrompt(template.prompt);
  }, []);

  const handleCompose = useCallback(async () => {
    if (!prompt.trim() || !imageUrl || running) {
      return;
    }

    setRunning(true);
    abortRef.current = false;

    try {
      const { jobId } = await startSceneCompose(projectId, {
        imageUrl,
        scenePrompt: prompt.trim(),
      });

      while (!abortRef.current) {
        await waitForNextPoll();
        if (abortRef.current) {
          break;
        }

        const result = await pollSceneCompose(projectId, jobId);

        if (result.job.status === "done") {
          const assets = (result as { assets?: Array<{ filePath: string }> }).assets;
          if (assets?.[0]?.filePath) {
            onImageChange(assets[0].filePath);
            toast.success("Scene compose complete.");
            setOpen(false);
            setPrompt("");
          }
          break;
        }

        if (result.job.status === "failed") {
          throw new Error(result.job.error || "Scene compose failed");
        }
      }
    } catch (error) {
      if (!abortRef.current) {
        toast.error(error instanceof Error ? error.message : "Scene compose failed");
      }
    } finally {
      if (!abortRef.current) {
        setRunning(false);
      } else {
        setRunning(false);
      }
    }
  }, [imageUrl, onImageChange, projectId, prompt, running, waitForNextPoll]);

  if (!imageUrl) {
    return null;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-1.5 rounded border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-100"
      >
        <Wand2 className="h-3.5 w-3.5" />
        AI scene compose
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded border border-purple-200 bg-purple-50/50 p-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-purple-600">AI scene compose</span>
        {!running ? (
          <button type="button" onClick={() => setOpen(false)} className="text-[10px] text-gray-400 hover:text-gray-600">
            Close
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-1">
        {SCENE_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategory(category.id)}
            className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-purple-500 text-white"
                : "bg-white text-gray-500 hover:text-purple-600"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-1">
        {categoryTemplates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => handleSelectTemplate(template)}
            disabled={running}
            className={`rounded border px-2 py-1 text-left text-[11px] transition-colors ${
              prompt === template.prompt
                ? "border-purple-400 bg-purple-100 text-purple-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-purple-300"
            }`}
          >
            {template.label}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Describe the target background"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !running) {
            handleCompose();
          }
        }}
        disabled={running}
        className="w-full rounded border border-purple-200 bg-white px-2 py-1.5 text-xs placeholder:text-gray-400"
      />

      <button
        type="button"
        onClick={handleCompose}
        disabled={running || !prompt.trim()}
        className="flex w-full items-center justify-center gap-1.5 rounded bg-purple-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-600 disabled:opacity-50"
      >
        {running ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Running...
          </>
        ) : (
          <>
            <Wand2 className="h-3.5 w-3.5" />
            Start compose
          </>
        )}
      </button>
    </div>
  );
}
