/** Workspace home with mode shortcuts, recent projects, and saved templates. */
import Link from "next/link";
import { ArrowRight, Upload } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { ModeCard } from "@/components/home/mode-card";
import { RecentProjects } from "@/components/home/recent-projects";
import { SavedTemplates } from "@/components/home/saved-templates";
import { getHomeFeed } from "@/features/workspace-hub/home-feed";
import { getMessages } from "@/i18n/get-messages";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { projects, templates } = await getHomeFeed();
  const messages = getMessages();
  const modes = [
    {
      mode: "compose",
      label: "상세페이지 제작",
      description: "상품 소개와 판매 구조를 정리하는 상세페이지 작업",
      editorMode: "compose" as const,
    },
    { mode: "model-shot", label: messages.common.mode.modelShot, description: messages.home.modeDescriptions.modelShot },
    { mode: "cutout", label: messages.common.mode.cutout, description: messages.home.modeDescriptions.cutout },
    { mode: "brand-image", label: messages.common.mode.brandImage, description: messages.home.modeDescriptions.brandImage },
    { mode: "gif-source", label: messages.common.mode.gifSource, description: messages.home.modeDescriptions.gifSource },
    { mode: "freeform", label: messages.common.mode.freeform, description: messages.home.modeDescriptions.freeform },
  ];

  return (
    <AppLayout>
      <div className="space-y-10">
        <section id="start-new-work">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A08E7E]">Start new work</p>
              <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-[#201A17]">
                새 작업 시작
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full px-1 text-sm font-medium text-[#5E544E] transition hover:text-[#201A17]"
            >
              전체 프로젝트 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {modes.map((mode) => (
              <ModeCard key={mode.mode} {...mode} />
            ))}

            <Link
              href="/?action=byoi"
              className="group flex min-h-[188px] flex-col justify-between rounded-[28px] border border-dashed border-[#D9CDC0] bg-[#F8F5F0] p-6 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[#D97C67] hover:bg-white"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E6D8CB] bg-white text-[#8D7D70] transition group-hover:border-[#F1C5BA] group-hover:bg-[#F9E7E2] group-hover:text-[#D97C67]">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A08E7E]">Bring your own</p>
                <p className="mt-3 text-xl font-semibold tracking-[-0.02em] text-[#201A17]">
                  {messages.home.directUploadTitle}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6F655D]">{messages.home.directUploadDescription}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#5E544E] transition group-hover:text-[#201A17]">
                  바로 업로드
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div>
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A08E7E]">Recent queue</p>
              <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-[#201A17]">
                {messages.home.recentProjectsTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#6F655D]">{messages.home.recentProjectsDescription}</p>
            </div>
            <RecentProjects projects={projects} />
          </div>

          <div>
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A08E7E]">Saved references</p>
              <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-[#201A17]">
                {messages.home.savedTemplatesTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#6F655D]">{messages.home.savedTemplatesDescription}</p>
            </div>
            <SavedTemplates templates={templates} />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
