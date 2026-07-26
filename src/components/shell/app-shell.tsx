"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Sidebar } from "./sidebar";
import { Icon } from "@/components/icons/icon";
import { Logo } from "@/components/brand/logo";
import { FloatingChat } from "@/components/ui/floating-chat";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

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
          <div className="flex-1" />
          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-cloud-muted ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-cloud active:scale-95"
            aria-label="Profile"
          >
            <Icon name="profile" className="h-4.5 w-4.5" />
          </Link>
        </header>
        <main>{children}</main>
      </div>

      <FloatingChat />
    </div>
  );
}
