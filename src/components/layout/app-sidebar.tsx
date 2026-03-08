/** Minimal sidebar navigation for home, projects, and settings routes. */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen, Home, Settings, User } from "lucide-react";
import { useT } from "@/i18n/use-t";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  const { messages } = useT();
  const navItems = [
    { href: "/", icon: Home, label: messages.common.actions.home },
    { href: "/projects", icon: FolderOpen, label: messages.common.actions.projects },
    { href: "/settings", icon: Settings, label: messages.common.actions.settings },
  ];

  return (
    <aside className="flex w-24 flex-col items-center justify-between border-r border-[#E5DDD3] bg-[#EFE9E1] py-6">
      <div className="flex flex-col items-center gap-2">
        <Link
          href="/"
          className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#201A17] text-sm font-semibold text-white shadow-[0_16px_30px_rgba(32,26,23,0.18)]"
          title={messages.layout.logoTitle}
        >
          T
        </Link>

        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-200",
                isActive
                  ? "border-[#F1C8BE] bg-[#F8E7E2] text-[#D97C67] shadow-[0_12px_24px_rgba(217,124,103,0.12)]"
                  : "border-transparent text-[#8E8176] hover:border-[#E5DDD3] hover:bg-[#F8F4EF] hover:text-[#4D433D]",
              )}
              title={item.label}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          );
        })}
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5DDD3] bg-white/80 text-[#8E8176]">
        <User className="h-4 w-4" />
      </div>
    </aside>
  );
}
