/** Full workspace explorer for projects and saved compose templates. */
import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/app-layout";
import { RecentProjects } from "@/components/home/recent-projects";
import { SavedTemplates } from "@/components/home/saved-templates";
import { getProjectsPageData } from "@/features/workspace-hub/home-feed";
import { getMessages } from "@/i18n/get-messages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "프로젝트 | Takdi Studio",
  description: "워크스페이스의 최근 프로젝트와 저장된 템플릿을 탐색합니다.",
};

export default async function ProjectsPage() {
  const { projects, templates } = await getProjectsPageData();
  const messages = getMessages();

  return (
    <AppLayout>
      <section>
        <h1 className="text-2xl font-bold text-gray-900">{messages.projectsPage.title}</h1>
        <p className="mt-2 text-sm text-gray-400">{messages.projectsPage.description}</p>
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{messages.projectsPage.explorerTitle}</h2>
          <p className="mt-1 text-sm text-gray-400">{messages.projectsPage.explorerDescription}</p>
        </div>
        <RecentProjects projects={projects} collapsible managementMode="bulk" />
      </section>

      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{messages.projectsPage.savedTemplatesTitle}</h2>
          <p className="mt-1 text-sm text-gray-400">{messages.projectsPage.savedTemplatesDescription}</p>
        </div>
        <SavedTemplates templates={templates} searchable collapsible managementMode="bulk" />
      </section>
    </AppLayout>
  );
}
