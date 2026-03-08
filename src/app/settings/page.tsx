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

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
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

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">운영 현황</h2>
            <p className="mt-2 text-sm text-gray-400">편집 화면에서 숨긴 비용과 실행 이력을 이곳에서 확인합니다.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <SummaryCard
            title="월간 작업량"
            value={String(summary.monthlyEventCount)}
            description="이번 달 누적된 실행 이벤트 수입니다."
          />
          <SummaryCard
            title="내보내기 수"
            value={String(summary.exportCount)}
            description="완료된 결과 저장 건수를 기준으로 집계합니다."
          />
          <SummaryCard
            title="추정 비용"
            value={`$${summary.totalEstimatedCost.toFixed(2)}`}
            description="내부 운영 참고용 누적 비용 추정치입니다."
          />
        </div>
      </section>

      <section className="mt-10 rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">최근 실행 이력</h2>
            <p className="mt-2 text-sm text-gray-400">가장 최근 작업 흐름만 빠르게 확인할 수 있도록 최근 8건을 표시합니다.</p>
          </div>
        </div>

        {summary.recentActivity.length > 0 ? (
          <div className="mt-6 space-y-3">
            {summary.recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-2xl border border-gray-100 px-4 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="mt-1 text-sm text-gray-500">{item.detail}</p>
                </div>
                <div className="text-sm text-gray-400 md:text-right">
                  <p>{formatDateTime(item.createdAt)}</p>
                  <p className="mt-1">{item.costEstimate != null ? `$${item.costEstimate.toFixed(2)}` : "비용 기록 없음"}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-gray-400">아직 기록된 실행 이력이 없습니다.</p>
        )}
      </section>
    </AppLayout>
  );
}
