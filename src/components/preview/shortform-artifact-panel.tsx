/** Shortform preview artifact actions for thumbnail and marketing script generation. */
"use client";

import { useMemo, useState } from "react";
import { Copy, Download, ImageIcon, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  type JobPollResponse,
  parseArtifactMetadata,
  pollGenerateMarketingScript,
  pollGenerateThumbnail,
  startGenerateMarketingScript,
  startGenerateThumbnail,
  type ExportArtifactRecord,
  type MarketingScriptArtifactPayload,
} from "@/lib/api-client";

interface ShortformArtifactPanelProps {
  projectId: string;
  templateKey: string;
  initialThumbnail: ExportArtifactRecord | null;
  initialMarketingScript: ExportArtifactRecord | null;
}

export function ShortformArtifactPanel({
  projectId,
  templateKey,
  initialThumbnail,
  initialMarketingScript,
}: ShortformArtifactPanelProps) {
  const [thumbnailArtifact, setThumbnailArtifact] = useState(initialThumbnail);
  const [marketingScriptArtifact, setMarketingScriptArtifact] = useState(initialMarketingScript);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);

  const scriptMetadata = useMemo(
    () => (marketingScriptArtifact ? parseArtifactMetadata<MarketingScriptArtifactPayload>(marketingScriptArtifact) : null),
    [marketingScriptArtifact],
  );

  async function pollJob(
    poll: () => Promise<JobPollResponse & { artifact?: ExportArtifactRecord }>,
  ) {
    for (let index = 0; index < 150; index += 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const result = await poll();
      if (result.job.status === "done") {
        return result.artifact ?? null;
      }
      if (result.job.status === "failed") {
        throw new Error(result.job.error ?? "아티팩트 생성에 실패했습니다.");
      }
    }

    throw new Error("아티팩트 생성 시간이 초과되었습니다.");
  }

  async function handleGenerateThumbnail() {
    setThumbnailLoading(true);
    try {
      const job = await startGenerateThumbnail(projectId, { templateKey });
      const artifact = await pollJob(() => pollGenerateThumbnail(projectId, job.jobId));
      setThumbnailArtifact(artifact);
      toast.success("썸네일을 생성했습니다.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "썸네일 생성 실패");
    } finally {
      setThumbnailLoading(false);
    }
  }

  async function handleGenerateScript() {
    setScriptLoading(true);
    try {
      const job = await startGenerateMarketingScript(projectId, { templateKey });
      const artifact = await pollJob(() => pollGenerateMarketingScript(projectId, job.jobId));
      setMarketingScriptArtifact(artifact);
      toast.success("마케팅 스크립트를 생성했습니다.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "마케팅 스크립트 생성 실패");
    } finally {
      setScriptLoading(false);
    }
  }

  const hashtags = scriptMetadata?.script.hashtags ?? [];

  return (
    <section className="rounded-[28px] border border-[#E5DDD3] bg-white p-5 shadow-[0_12px_30px_rgba(55,40,30,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#201A17]">숏폼 산출물</p>
          <p className="mt-1 text-xs leading-5 text-[#8D7D70]">
            현재 미리보기 비율을 기준으로 썸네일과 업로드용 스크립트를 생성합니다.
          </p>
        </div>
        <span className="rounded-full border border-[#E5DDD3] bg-[#F8F4EF] px-3 py-1 text-[11px] text-[#8E8176]">
          {templateKey}
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[24px] border border-[#EEE5DC] bg-[#FCFAF7] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#EDD8D0] bg-[#FAECE7] text-[#D97C67]">
                <ImageIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#201A17]">썸네일 생성</p>
                <p className="text-xs text-[#8D7D70]">1:1 대표 이미지 1장을 만듭니다.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleGenerateThumbnail()}
              disabled={thumbnailLoading}
              className="rounded-full bg-[#D97C67] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#CF705A] disabled:opacity-60"
            >
              {thumbnailLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : thumbnailArtifact ? "다시 생성" : "생성"}
            </button>
          </div>

          {thumbnailArtifact ? (
            <div className="mt-4 space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailArtifact.filePath}
                alt="생성된 썸네일"
                className="aspect-square w-full rounded-[18px] border border-[#E5DDD3] object-cover"
              />
              <a
                href={thumbnailArtifact.filePath}
                download
                className="inline-flex items-center gap-2 rounded-full border border-[#E2D7CB] bg-white px-3 py-2 text-xs font-medium text-[#4D433D] transition hover:bg-[#F8F2EC]"
              >
                <Download className="h-3.5 w-3.5" />
                썸네일 다운로드
              </a>
            </div>
          ) : (
            <p className="mt-4 text-xs leading-5 text-[#8D7D70]">
              아직 생성된 썸네일이 없습니다.
            </p>
          )}
        </div>

        <div className="rounded-[24px] border border-[#EEE5DC] bg-[#FCFAF7] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#EDD8D0] bg-[#FAECE7] text-[#D97C67]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#201A17]">마케팅 스크립트 생성</p>
                <p className="text-xs text-[#8D7D70]">후킹 문구와 본문, 해시태그를 만듭니다.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleGenerateScript()}
              disabled={scriptLoading}
              className="rounded-full bg-[#D97C67] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#CF705A] disabled:opacity-60"
            >
              {scriptLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : marketingScriptArtifact ? "다시 생성" : "생성"}
            </button>
          </div>

          {scriptMetadata ? (
            <div className="mt-4 space-y-3">
              <div className="rounded-[18px] border border-[#E5DDD3] bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A08E7E]">Hook</p>
                <p className="mt-2 text-sm font-medium text-[#201A17]">{scriptMetadata.script.hook}</p>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A08E7E]">Body</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#4D433D]">{scriptMetadata.script.body}</p>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A08E7E]">Hashtags</p>
                <p className="mt-2 flex flex-wrap gap-2 text-xs text-[#6F655D]">
                  {hashtags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#F8F4EF] px-2.5 py-1">
                      {tag}
                    </span>
                  ))}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      [scriptMetadata.script.hook, "", scriptMetadata.script.body, "", hashtags.join(" ")].join("\n"),
                    );
                    toast.success("스크립트를 클립보드에 복사했습니다.");
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#E2D7CB] bg-white px-3 py-2 text-xs font-medium text-[#4D433D] transition hover:bg-[#F8F2EC]"
                >
                  <Copy className="h-3.5 w-3.5" />
                  스크립트 복사
                </button>
                <a
                  href={marketingScriptArtifact?.filePath ?? "#"}
                  download
                  className="inline-flex items-center gap-2 rounded-full border border-[#E2D7CB] bg-white px-3 py-2 text-xs font-medium text-[#4D433D] transition hover:bg-[#F8F2EC]"
                >
                  <Download className="h-3.5 w-3.5" />
                  TXT 다운로드
                </a>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-xs leading-5 text-[#8D7D70]">
              아직 생성된 마케팅 스크립트가 없습니다.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
