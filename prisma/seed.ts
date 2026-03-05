import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Default plan catalog
  const plan = await prisma.planCatalog.upsert({
    where: { tier: "solo_free" },
    update: {},
    create: {
      tier: "solo_free",
      monthlyLimit: 100,
      features: JSON.stringify(["generate", "export", "preview"]),
    },
  });

  // Default user
  const user = await prisma.user.upsert({
    where: { email: "admin@takdi.local" },
    update: {},
    create: {
      email: "admin@takdi.local",
      name: "Takdi Admin",
    },
  });

  // Default workspace
  const workspace = await prisma.workspace.upsert({
    where: { id: "default-workspace" },
    update: {},
    create: {
      id: "default-workspace",
      name: "Default Workspace",
    },
  });

  // Membership
  await prisma.membership.upsert({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: workspace.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      workspaceId: workspace.id,
      role: "owner",
      plan: plan.tier,
    },
  });

  console.log("Seed complete:", { user: user.email, workspace: workspace.name, plan: plan.tier });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
