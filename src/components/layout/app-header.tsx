/** Shared header shell for layout pages with lightweight status controls. */
import Link from "next/link";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/i18n/get-messages";

export function AppHeader() {
  const messages = getMessages();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-8">
      <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm text-gray-400">
        <Search className="h-4 w-4" />
        <span>{messages.layout.searchWorkspace}</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600">
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <User className="h-4 w-4" />
        </div>

        <Link href="/">
          <Button className="rounded-xl bg-orange-500 px-5 text-white hover:bg-orange-600">
            {messages.layout.startProject}
          </Button>
        </Link>
      </div>
    </header>
  );
}
