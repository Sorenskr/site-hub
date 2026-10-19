import Link from "next/link";
import type { Settings } from "@/lib/types";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ settings }: { settings: Settings }) {
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{
        background: "rgba(var(--bg), 0.65)",
        borderColor: "rgba(var(--line), 0.1)",
      }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="text-lg transition-transform duration-500 group-hover:rotate-12">
            {settings.avatar ?? "🧭"}
          </span>
          <span className="text-sm font-medium tracking-[0.2em] text-ink/90">
            {settings.siteName}
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 text-sm text-sub transition hover:text-ink"
          >
            作品
          </Link>
          <Link
            href="/guestbook"
            className="rounded-full px-3 py-1.5 text-sm text-sub transition hover:text-ink"
          >
            留言
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
