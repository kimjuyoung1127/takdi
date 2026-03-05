/** Generic polling hook for 202+jobId async API pattern. */
"use client";

import { useState, useRef, useCallback } from "react";
import type { AsyncJobResponse, JobPollResponse } from "@/lib/api-client";

export type AsyncJobStatus = "idle" | "starting" | "polling" | "done" | "error";

interface UseAsyncJobOptions {
  pollIntervalMs?: number;
}

export function useAsyncJob(
  startFn: () => Promise<AsyncJobResponse>,
  pollFn: (jobId: string) => Promise<JobPollResponse>,
  opts?: UseAsyncJobOptions,
) {
  const [status, setStatus] = useState<AsyncJobStatus>("idle");
  const [result, setResult] = useState<JobPollResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortedRef = useRef(false);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    abortedRef.current = true;
    cleanup();
    setStatus("idle");
  }, [cleanup]);

  const run = useCallback(async () => {
    abortedRef.current = false;
    setStatus("starting");
    setResult(null);
    setError(null);

    try {
      const { jobId } = await startFn();
      if (abortedRef.current) return;
      setStatus("polling");

      const interval = opts?.pollIntervalMs ?? 2000;

      return new Promise<JobPollResponse>((resolve, reject) => {
        timerRef.current = setInterval(async () => {
          if (abortedRef.current) {
            cleanup();
            reject(new Error("Aborted"));
            return;
          }
          try {
            const poll = await pollFn(jobId);
            const jobStatus = poll.job.status;

            if (jobStatus === "done") {
              cleanup();
              setResult(poll);
              setStatus("done");
              resolve(poll);
            } else if (jobStatus === "failed") {
              cleanup();
              const msg = poll.job.error ?? "Job failed";
              setError(msg);
              setStatus("error");
              reject(new Error(msg));
            }
            // "queued" | "running" → keep polling
          } catch (err) {
            cleanup();
            const msg = err instanceof Error ? err.message : "Poll failed";
            setError(msg);
            setStatus("error");
            reject(err);
          }
        }, interval);
      });
    } catch (err) {
      if (!abortedRef.current) {
        const msg = err instanceof Error ? err.message : "Start failed";
        setError(msg);
        setStatus("error");
      }
      throw err;
    }
  }, [startFn, pollFn, opts?.pollIntervalMs, cleanup]);

  return { status, result, error, run, stop, cleanup };
}
