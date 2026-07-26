"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Starfield } from "@/components/visual/starfield";
import { Logo } from "@/components/brand/logo";
import { Icon, type IconName } from "@/components/icons/icon";

const FLOATING_ICONS: IconName[] = ["universe", "arcade", "labs", "studio", "creator", "academy"];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Starfield />
      <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-aurora-violet/20 blur-3xl animate-aurora" />
      <div className="pointer-events-none absolute right-0 top-40 h-96 w-96 rounded-full bg-aurora-teal/15 blur-3xl animate-aurora" style={{ animationDelay: "4s" }} />

      <header className="relative z-10">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="font-display text-xl font-bold text-cloud">Somora</span>
          </Link>
          <Link
            href="/universe"
            className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-cloud-muted ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-cloud"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center px-6 pb-20 pt-12 text-center sm:pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-aurora-teal to-aurora-violet shadow-glow"
        >
          <Icon name="sparkles" className="h-8 w-8 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 font-display text-5xl font-bold leading-tight sm:text-7xl"
        >
          <span className="text-gradient">Let&apos;s learn AI!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 text-lg text-cloud-muted sm:text-xl"
        >
          Play games, build apps, and teach computers to think.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10"
        >
          <Link
            href="/universe"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-aurora-teal via-aurora-violet to-aurora-violet px-8 py-4 font-display text-lg font-bold text-night-950 transition-all hover:shadow-glow hover:shadow-aurora-violet/40 active:scale-95"
          >
            Let&apos;s go! {"\u2192"}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-cloud-dim"
        >
          {FLOATING_ICONS.map((iconName, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            >
              <Icon name={iconName} className="h-7 w-7" />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
