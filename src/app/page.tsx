/** Home 화면 — 모드 선택 카드 + BYOI CTA + 최근 프로젝트 목록 */
import { prisma } from "@/lib/prisma";
import { AppLayout } from "@/components/layout/app-layout";
import { ModeCard } from "@/components/home/mode-card";
import { RecentProjects } from "@/components/home/recent-projects";
import { Upload } from "lucide-react";
import Link from "next/link";

const MODES = [
  { mode: "model-shot", label: "Model Shot", description: "AI 모델 촬영" },
  { mode: "cutout", label: "Cutout", description: "배경 제거 컷아웃" },
  { mode: "brand-image", label: "Brand Image", description: "브랜드 이미지 생성" },
  { mode: "gif-source", label: "GIF Source", description: "움직이는 GIF" },
  { mode: "freeform", label: "Freeform", description: "자유 형식 생성" },
];

export default async function HomePage() {
  const projects = await prisma.project.findMany({
    where: { workspaceId: "default-workspace" },
    orderBy: { updatedAt: "desc" },
    take: 10,
    select: {
      id: true,
      name: true,
      status: true,
      mode: true,
      updatedAt: true,
    },
  });

  return (
    <AppLayout>
      {/* Hero: Mode Selection */}
      <section>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Start a New Project
        </h1>
        <p className="mb-6 text-sm text-gray-400">
          모드를 선택하여 상세페이지를 생성하세요
        </p>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {MODES.map((m) => (
            <ModeCard key={m.mode} {...m} />
          ))}

          {/* BYOI CTA */}
          <Link
            href="/?action=byoi"
            className="flex min-w-45 flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-gray-200 bg-white/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
              <Upload className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600">BYOI</p>
              <p className="mt-1 text-xs text-gray-400">내 이미지 사용</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Recent Projects
        </h2>
        <RecentProjects projects={projects} />
      </section>
    </AppLayout>
  );
}
