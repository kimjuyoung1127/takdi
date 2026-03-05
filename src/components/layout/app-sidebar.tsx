/** 앱 좌측 아이콘 기반 미니멀 사이드바 */
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, FolderOpen, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/projects", icon: FolderOpen, label: "Projects" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-20 flex-col items-center justify-between border-r border-gray-100 bg-white py-6">
      <div className="flex flex-col items-center gap-2">
        {/* Logo */}
        <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white">
          T
        </div>

        {/* Nav */}
        {NAV_ITEMS.map((item) => {
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
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              )}
              title={item.label}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          );
        })}
      </div>

      {/* User avatar */}
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <User className="h-4 w-4" />
      </div>
    </aside>
  );
}
