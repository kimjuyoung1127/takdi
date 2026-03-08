/** Workspace home with mode shortcuts, recent projects, and saved templates. */
import Link from "next/link";
import { Upload } from "lucide-react";
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
      label: messages.common.mode.compose,
      description: messages.home.modeDescriptions.compose,
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
      <section>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">{messages.home.title}</h1>
        <p className="mb-6 text-sm text-gray-400">{messages.home.description}</p>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {modes.map((mode) => (
            <ModeCard key={mode.mode} {...mode} />
          ))}

          <Link
            href="/?action=byoi"
            className="flex min-w-45 flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-gray-200 bg-white/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
              <Upload className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600">{messages.home.directUploadTitle}</p>
              <p className="mt-1 text-xs text-gray-400">{messages.home.directUploadDescription}</p>
            </div>
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{messages.home.recentProjectsTitle}</h2>
          <p className="mt-1 text-sm text-gray-400">{messages.home.recentProjectsDescription}</p>
        </div>
        <RecentProjects projects={projects} />
      </section>

      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{messages.home.savedTemplatesTitle}</h2>
          <p className="mt-1 text-sm text-gray-400">{messages.home.savedTemplatesDescription}</p>
        </div>
        <SavedTemplates templates={templates} />
      </section>
    </AppLayout>
  );
}
