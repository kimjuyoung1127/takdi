/** Workspace home with compact mode shortcuts, recent projects, and saved templates. */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { HomeStartGrid } from "@/components/home/home-start-grid";
import { RecentProjects } from "@/components/home/recent-projects";
import { SavedTemplates } from "@/components/home/saved-templates";
import { getHomeFeed } from "@/features/workspace-hub/home-feed";
import { getMessages } from "@/i18n/get-messages";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const messages = getMessages();
  const { projects, templates } = await getHomeFeed();

  return (
    <AppLayout>
      <div className="space-y-8">
        <section id="start-new-work">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-[#201A17]">새 작업 시작</h2>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full px-1 text-sm font-medium text-[#5E544E] transition hover:text-[#201A17]"
            >
              전체 프로젝트 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <HomeStartGrid />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.5fr_0.9fr]">
          <div>
            <div className="mb-3">
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#201A17]">최근 프로젝트</h2>
            </div>
            <RecentProjects projects={projects} collapsible defaultCollapsed />
          </div>

          <div>
            <div className="mb-3">
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#201A17]">
                {messages.home.savedTemplatesTitle}
              </h2>
            </div>
            <SavedTemplates templates={templates} compact />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
