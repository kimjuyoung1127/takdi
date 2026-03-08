/** Shortform result view for media artifacts and generated upload assets. */
"use client";

import Link from "next/link";
import { ArrowLeft, Copy, Download, ExternalLink, Film, ImageIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { parseArtifactMetadata, type ExportArtifactRecord, type MarketingScriptArtifactPayload } from "@/lib/api-client";

interface ShortformResultViewProps {
  projectId: string;
  projectName: string;
  artifacts: ExportArtifactRecord[];
}

export function ShortformResultView({
  projectId,
  projectName,
  artifacts,
}: ShortformResultViewProps) {
  const videoArtifacts = artifacts.filter((artifact) => artifact.type === "video" || artifact.type === "gif");
  const thumbnailArtifact = artifacts.find((artifact) => artifact.type === "thumbnail") ?? null;
  const marketingScriptArtifact = artifacts.find((artifact) => artifact.type === "marketing-script") ?? null;
  const scriptMetadata = marketingScriptArtifact
    ? parseArtifactMetadata<MarketingScriptArtifactPayload>(marketingScriptArtifact)
    : null;

  return (
    <div className="min-h-screen bg-[#F4F1EC]">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E5DDD3] bg-[#FBF8F4]/95 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link
            href={`/projects/${projectId}/preview`}
            className="inline-flex items-center gap-1 rounded-full border border-[#E5DDD3] bg-white px-3 py-2 text-sm text-[#6F655D] transition hover:bg-[#F8F4EF] hover:text-[#201A17]"
          >
            <ArrowLeft className="h-4 w-4" />
            미리보기로 돌아가기
          </Link>
          <span className="text-sm font-semibold text-[#201A17]">{projectName}</span>
        </div>
      </header>

      <main className="space-y-6 p-6">
        <section className="rounded-[28px] border border-[#E5DDD3] bg-white p-6 shadow-[0_12px_30px_rgba(55,40,30,0.05)]">
          <h2 className="text-lg font-semibold text-[#201A17]">미디어 결과</h2>
          <p className="mt-2 text-sm text-[#6F655D]">렌더 또는 생성이 완료된 산출물만 이 화면에 표시합니다.</p>

          {videoArtifacts.length > 0 ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {videoArtifacts.map((artifact) => (
                <div key={artifact.id} className="rounded-[24px] border border-[#EEE5DC] bg-[#FCFAF7] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#EDD8D0] bg-[#FAECE7] text-[#D97C67]">
                        <Film className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#201A17]">
                          {artifact.type === "gif" ? "GIF 결과" : "영상 결과"}
                        </p>
                        <p className="text-xs text-[#8D7D70]">{new Date(artifact.createdAt).toLocaleString("ko-KR")}</p>
                      </div>
                    </div>
                    <a
                      href={artifact.filePath}
                      className="inline-flex items-center gap-1 rounded-full border border-[#E2D7CB] bg-white px-3 py-1.5 text-xs font-medium text-[#4D433D] transition hover:bg-[#F8F2EC]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      열기
                    </a>
                  </div>
                  <p className="mt-4 break-all text-xs leading-5 text-[#8D7D70]">{artifact.filePath}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-[#8D7D70]">아직 저장된 영상/GIF 결과가 없습니다.</p>
          )}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[28px] border border-[#E5DDD3] bg-white p-6 shadow-[0_12px_30px_rgba(55,40,30,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#EDD8D0] bg-[#FAECE7] text-[#D97C67]">
                <ImageIcon className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#201A17]">썸네일</h2>
                <p className="text-xs text-[#8D7D70]">preview에서 생성한 최신 썸네일</p>
              </div>
            </div>

            {thumbnailArtifact ? (
              <div className="mt-5 space-y-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnailArtifact.filePath}
                  alt="생성된 썸네일"
                  className="aspect-square w-full rounded-[22px] border border-[#E5DDD3] object-cover"
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
              <p className="mt-5 text-sm text-[#8D7D70]">아직 생성된 썸네일이 없습니다.</p>
            )}
          </div>

          <div className="rounded-[28px] border border-[#E5DDD3] bg-white p-6 shadow-[0_12px_30px_rgba(55,40,30,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#EDD8D0] bg-[#FAECE7] text-[#D97C67]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#201A17]">마케팅 스크립트</h2>
                <p className="text-xs text-[#8D7D70]">preview에서 생성한 최신 업로드 문구</p>
              </div>
            </div>

            {scriptMetadata ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-[22px] border border-[#E5DDD3] bg-[#FCFAF7] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A08E7E]">Hook</p>
                  <p className="mt-2 text-sm font-medium text-[#201A17]">{scriptMetadata.script.hook}</p>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A08E7E]">Body</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#4D433D]">{scriptMetadata.script.body}</p>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A08E7E]">Hashtags</p>
                  <p className="mt-2 flex flex-wrap gap-2 text-xs text-[#6F655D]">
                    {scriptMetadata.script.hashtags.map((tag) => (
                      <span key={tag} className="rounded-full bg-white px-2.5 py-1">
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
                        [
                          scriptMetadata.script.hook,
                          "",
                          scriptMetadata.script.body,
                          "",
                          scriptMetadata.script.hashtags.join(" "),
                        ].join("\n"),
                      );
                      toast.success("스크립트를 복사했습니다.");
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-[#E2D7CB] bg-white px-3 py-2 text-xs font-medium text-[#4D433D] transition hover:bg-[#F8F2EC]"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    복사
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
              <p className="mt-5 text-sm text-[#8D7D70]">아직 생성된 마케팅 스크립트가 없습니다.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
