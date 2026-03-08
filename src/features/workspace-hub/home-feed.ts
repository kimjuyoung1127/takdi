/** Server-side workspace hub queries for home and projects screens. */
import packageJson from "../../../package.json";
import { prisma } from "@/lib/prisma";
import { getWorkspaceId } from "@/lib/workspace-guard";
import type { RecentProjectListItem, SavedTemplateListItem } from "./project-filters";

export interface HomeFeedData {
  projects: RecentProjectListItem[];
  templates: SavedTemplateListItem[];
}

export interface SettingsSummaryData {
  workspaceId: string;
  workspaceName: string;
  projectCount: number;
  templateCount: number;
  assetCount: number;
  uploadsPath: string;
  databaseUrl: string;
  nextVersion: string;
  prismaVersion: string;
  remotionPreviewEnabled: boolean;
}

export async function getHomeFeed(limit = 24): Promise<HomeFeedData> {
  const workspaceId = getWorkspaceId();

  const [projects, templates] = await Promise.all([
    prisma.project.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        status: true,
        mode: true,
        updatedAt: true,
      },
    }),
    prisma.composeTemplate.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        previewTitle: true,
        blockCount: true,
        sourceProjectId: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return { projects, templates };
}

export async function getProjectsPageData(): Promise<HomeFeedData> {
  const workspaceId = getWorkspaceId();

  const [projects, templates] = await Promise.all([
    prisma.project.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        status: true,
        mode: true,
        updatedAt: true,
      },
    }),
    prisma.composeTemplate.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        previewTitle: true,
        blockCount: true,
        sourceProjectId: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return { projects, templates };
}

export async function getSettingsSummary(): Promise<SettingsSummaryData> {
  const workspaceId = getWorkspaceId();
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { id: true, name: true },
  });

  const [projectCount, templateCount, assetCount] = await Promise.all([
    prisma.project.count({ where: { workspaceId } }),
    prisma.composeTemplate.count({ where: { workspaceId } }),
    prisma.asset.count({ where: { project: { workspaceId } } }),
  ]);

  return {
    workspaceId,
    workspaceName: workspace?.name ?? "Default workspace",
    projectCount,
    templateCount,
    assetCount,
    uploadsPath: `${process.cwd()}\\uploads`,
    databaseUrl: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
    nextVersion: packageJson.dependencies.next,
    prismaVersion: packageJson.dependencies["@prisma/client"],
    remotionPreviewEnabled: true,
  };
}
