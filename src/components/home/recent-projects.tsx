/** Home 화면의 최근 프로젝트 목록 컴포넌트 */
import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

interface ProjectItem {
  id: string;
  name: string;
  status: string;
  mode: string | null;
  updatedAt: string | Date;
}

interface RecentProjectsProps {
  projects: ProjectItem[];
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <FolderOpen className="mb-3 h-10 w-10 text-gray-300" />
        <p className="text-sm text-gray-400">아직 프로젝트가 없습니다</p>
        <p className="mt-1 text-xs text-gray-300">
          위에서 모드를 선택해 시작하세요
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="divide-y divide-gray-50">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50/50"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                <FolderOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {project.name}
                </p>
                <p className="text-xs text-gray-400">
                  {project.mode ?? "freeform"} &middot;{" "}
                  {new Date(project.updatedAt).toLocaleDateString("ko-KR")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={project.status} />
              <Link href={`/projects/${project.id}/editor`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-xs text-gray-500 hover:text-gray-900"
                >
                  이어서 작업
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
