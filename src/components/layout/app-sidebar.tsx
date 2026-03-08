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
    <aside className="flex w-20 flex-col items-center justify-between border-r border-gray-100 bg-white py-6">
      <div className="flex flex-col items-center gap-2">
        <Link
          href="/"
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white"
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
                "flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200",
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-600",
              )}
              title={item.label}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          );
        })}
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <User className="h-4 w-4" />
      </div>
    </aside>
  );
}
