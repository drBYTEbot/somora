"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Icon, type IconName } from "@/components/icons/icon";
import { Logo } from "@/components/brand/logo";
import { FloatingChat } from "@/components/ui/floating-chat";
import { cn } from "@/lib/utils";

const QUICK_LINKS: { href: string; icon: IconName; label: string }[] = [
  { href: "/studio", icon: "studio", label: "Studio" },
  { href: "/labs", icon: "labs", label: "Labs" },
  { href: "/arcade", icon: "arcade", label: "Arcade" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-night-950/70 backdrop-blur-xl lg:block">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-night-950/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-night-900 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
            >
              <div className="flex items-center justify-between px-3 pt-3">
                <div className="flex items-center gap-2">
                  <Logo className="h-6 w-6" />
                  <span className="font-display font-bold text-cloud">
                    Somora
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-cloud-muted hover:bg-white/5"
                  aria-label="Close menu"
                >
                  <Icon name="close" />
                </button>
              </div>
              <Sidebar onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/10 bg-night-950/70 px-4 py-3 backdrop-blur-xl lg:px-8">
          <button
            className="rounded-full p-2 text-cloud-muted hover:bg-white/5 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Icon name="menu" />
          </button>

          {/* Quick links */}
          <div className="flex items-center gap-1">
            {QUICK_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition-all",
                    active
                      ? "bg-white/10 text-cloud ring-1 ring-white/10"
                      : "text-cloud-muted hover:bg-white/5 hover:text-cloud",
                  )}
                >
                  <Icon name={link.icon} className="h-4 w-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>

          <Link
            href="/profile"
            className="flex items-center justify-center p-2 text-cloud-muted transition-all hover:text-cloud active:scale-95"
            aria-label="Profile"
          >
            <Icon name="profile" className="h-5 w-5" />
          </Link>
        </header>
        <main>{children}</main>
      </div>

      <FloatingChat />
    </div>
  );
}
