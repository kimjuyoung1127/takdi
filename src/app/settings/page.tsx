/** Read-only workspace operations summary for the current local setup. */
import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/app-layout";
import { getSettingsSummary } from "@/features/workspace-hub/home-feed";
import { formatCurrentScope } from "@/i18n/format";
import { getMessages } from "@/i18n/get-messages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "설정 | Takdi Studio",
  description: "워크스페이스, 스토리지, 런타임 정보를 확인합니다.",
};

function SummaryCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      <p className="mt-2 text-sm text-gray-400">{description}</p>
    </div>
  );
}

export default async function SettingsPage() {
  const summary = await getSettingsSummary();
  const messages = getMessages();

  return (
    <AppLayout>
      <section>
        <h1 className="text-2xl font-bold text-gray-900">{messages.settingsPage.title}</h1>
        <p className="mt-2 text-sm text-gray-400">{messages.settingsPage.description}</p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title={messages.settingsPage.workspace}
          value={summary.workspaceName}
          description={formatCurrentScope(messages, summary.workspaceId)}
        />
        <SummaryCard
          title={messages.settingsPage.projects}
          value={String(summary.projectCount)}
          description={messages.settingsPage.projectCountDescription}
        />
        <SummaryCard
          title={messages.settingsPage.savedTemplates}
          value={String(summary.templateCount)}
          description={messages.settingsPage.templateCountDescription}
        />
        <SummaryCard
          title={messages.settingsPage.assets}
          value={String(summary.assetCount)}
          description={messages.settingsPage.assetCountDescription}
        />
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h2 className="text-lg font-semibold text-gray-900">{messages.settingsPage.runtimeSummaryTitle}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-gray-500">{messages.settingsPage.nextJs}</dt>
              <dd className="text-right text-gray-900">{summary.nextVersion}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-gray-500">{messages.settingsPage.prisma}</dt>
              <dd className="text-right text-gray-900">{summary.prismaVersion}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-gray-500">{messages.settingsPage.remotionPreview}</dt>
              <dd className="text-right text-gray-900">
                {summary.remotionPreviewEnabled ? messages.settingsPage.enabled : messages.settingsPage.disabled}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h2 className="text-lg font-semibold text-gray-900">{messages.settingsPage.storageSummaryTitle}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">{messages.settingsPage.database}</dt>
              <dd className="mt-1 break-all text-gray-900">{summary.databaseUrl}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{messages.settingsPage.uploadsPath}</dt>
              <dd className="mt-1 break-all text-gray-900">{summary.uploadsPath}</dd>
            </div>
          </dl>
        </div>
      </section>
    </AppLayout>
  );
}
