/** Sidebar + Header + Content 영역을 래핑하는 앱 공통 레이아웃 */
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { getHeaderSurfaceData } from "@/features/workspace-hub/home-feed";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const headerDataPromise = getHeaderSurfaceData();

  return (
    <AppLayoutInner headerDataPromise={headerDataPromise}>{children}</AppLayoutInner>
  );
}

async function AppLayoutInner({
  children,
  headerDataPromise,
}: AppLayoutProps & {
  headerDataPromise: ReturnType<typeof getHeaderSurfaceData>;
}) {
  const headerData = await headerDataPromise;

  return (
    <div className="flex h-screen bg-[#F4F1EC] text-[#201A17]">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader {...headerData} />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-7">{children}</main>
      </div>
    </div>
  );
}
