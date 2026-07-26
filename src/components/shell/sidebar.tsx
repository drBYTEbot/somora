"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { modules } from "@/config/modules";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { Icon, type IconName } from "@/components/icons/icon";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col gap-1 overflow-y-auto p-3">
      <Link
        href="/"
        onClick={onNavigate}
        className="mb-4 flex items-center gap-2.5 px-2 py-2"
      >
        <Logo />
        <span className="font-display text-lg font-bold text-cloud">
          {site.name}
        </span>
      </Link>

      {modules.map((m) => {
        const active =
          pathname === m.href || pathname.startsWith(`${m.href}/`);
        return (
          <Link
            key={m.id}
            href={m.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-2xl px-2.5 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-white/10 text-cloud ring-1 ring-white/10"
                : "text-cloud-muted hover:bg-white/5 hover:text-cloud",
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-glow",
                m.gradient,
                m.glow,
                !active && "opacity-80",
              )}
            >
              <Icon name={m.icon as IconName} className="h-4.5 w-4.5 text-white" />
            </span>
            <span className="flex-1 truncate">{m.short}</span>
            {active && (
              <span className="h-1.5 w-1.5 rounded-full bg-aurora-teal" />
            )}
          </Link>
        );
      })}

      <div className="mt-auto px-3 py-4 text-[10px] text-cloud-dim/70">
        v0.1 &middot; Built with curiosity
      </div>
    </nav>
  );
}
