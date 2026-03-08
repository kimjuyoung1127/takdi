/** Sidebar + Header + Content 영역을 래핑하는 앱 공통 레이아웃 */
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-[#F4F1EC] text-[#201A17]">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-7">{children}</main>
      </div>
    </div>
  );
}
