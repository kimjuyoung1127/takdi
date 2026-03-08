/** Shared header shell for layout pages with lightweight status controls. */
import Link from "next/link";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/i18n/get-messages";

export function AppHeader() {
  const messages = getMessages();

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-[#E5DDD3] bg-[#F4F1EC]/95 px-6 backdrop-blur lg:px-8">
      <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-[#E4D9CD] bg-[#FBF8F4] px-4 py-3 text-sm text-[#9A8B7E] shadow-[0_8px_24px_rgba(55,40,30,0.04)]">
        <Search className="h-4 w-4" />
        <span className="truncate">{messages.layout.searchWorkspace}</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E5DDD3] bg-[#FBF8F4] text-[#8E8176] transition-colors hover:bg-white hover:text-[#4D433D]">
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5DDD3] bg-white/80 text-[#8E8176]">
          <User className="h-4 w-4" />
        </div>

        <Link href="/">
          <Button className="h-10 rounded-2xl bg-[#D97C67] px-5 text-white shadow-[0_14px_30px_rgba(217,124,103,0.22)] hover:bg-[#CF705A]">
            {messages.layout.startProject}
          </Button>
        </Link>
      </div>
    </header>
  );
}
