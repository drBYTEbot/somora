"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { modules } from "@/config/modules";
import { site } from "@/config/site";
import { Starfield } from "@/components/visual/starfield";
import { WorldMap } from "@/components/world/world-map";
import { ModuleCard } from "@/components/ui/module-card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

const creatorLoop = ["See", "Play", "Build", "Train", "Deploy", "Share"];
const gameplayLoop = [
  "Explore",
  "Learn",
  "Play",
  "Experiment",
  "Build",
  "Create",
  "Share",
  "Unlock",
];

export default function LandingPage() {
  return (
    <div className="relative">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-night-950/70 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="font-display text-xl font-bold text-cloud">
              {site.name}
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {modules.slice(0, 4).map((m) => (
              <Link
                key={m.id}
                href={m.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-cloud-muted transition-colors hover:bg-white/5 hover:text-cloud"
              >
                {m.short}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button href="/hub" variant="ghost" className="hidden px-4 py-2 text-sm sm:inline-flex">
              Sign in
            </Button>
            <Button href="/universe" className="px-4 py-2 text-sm">
              Enter Universe
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <Starfield />
        <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-aurora-violet/20 blur-3xl animate-aurora" />
        <div className="pointer-events-none absolute right-0 top-40 h-96 w-96 rounded-full bg-aurora-teal/15 blur-3xl animate-aurora" style={{ animationDelay: "4s" }} />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-aurora-amber/10 blur-3xl animate-aurora" style={{ animationDelay: "8s" }} />

        <div className="container-page relative py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cloud-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-aurora-teal animate-pulse" />
              An animated AI education universe
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] sm:text-7xl">
              <span className="text-gradient">Where Curiosity</span>
              <br />
              <span className="text-cloud">Creates Intelligence.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cloud-muted">
              Somora is a living digital universe where children learn Artificial
              Intelligence by exploring worlds, playing games, running
              experiments, and building real AI projects. Not another class &mdash;
              an adventure.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/universe" className="px-6 py-3 text-base">
                Start the journey
              </Button>
              <Button href="/studio" variant="outline" className="px-6 py-3 text-base">
                Try Somora Studio
              </Button>
            </div>
            <p className="mt-4 text-xs text-cloud-dim">
              Free to explore &middot; Built for ages 8&ndash;16 &middot; Designed
              for every background
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16"
          >
            <WorldMap />
          </motion.div>
        </div>
      </section>

      <section className="container-page py-20 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-aurora-teal">
            The ecosystem
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold text-cloud sm:text-5xl">
            Twelve worlds. One mission.
          </h2>
          <p className="mt-4 text-cloud-muted">
            Interconnected modules that turn AI literacy into an adventure &mdash;
            from the world map to the studio where kids build their first AI.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => (
            <ModuleCard key={m.id} module={m} index={i} />
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <div className="relative overflow-hidden rounded-5xl glass-strong p-8 lg:p-14">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-aurora-violet/20 blur-3xl" />
          <div className="relative">
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-aurora-violet">
              The creator philosophy
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold text-cloud sm:text-4xl">
              Somora doesn&apos;t teach what AI is. It empowers kids to build it.
            </h2>
            <p className="mt-3 max-w-2xl text-cloud-muted">
              The signature progression &mdash; from visual blocks to real Python,
              models, and deployed apps. Learning by building, every step of the
              way.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              {creatorLoop.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-full bg-white/5 px-4 py-2 font-display text-sm font-semibold text-cloud ring-1 ring-white/10"
                  >
                    {step}
                  </motion.span>
                  {i < creatorLoop.length - 1 && (
                    <span className="text-cloud-dim">&rarr;</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-aurora-amber">
            The gameplay loop
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-cloud sm:text-4xl">
            Curiosity that compounds
          </h2>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {gameplayLoop.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex h-12 items-center rounded-2xl bg-gradient-to-br from-white/5 to-white/0 px-4 font-display text-sm font-semibold text-cloud ring-1 ring-white/10"
              >
                {step}
              </motion.span>
              {i < gameplayLoop.length - 1 && (
                <span className="text-cloud-dim">&darr;</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <div className="relative overflow-hidden rounded-5xl bg-gradient-to-br from-aurora-teal/20 via-aurora-violet/15 to-aurora-amber/10 p-10 text-center lg:p-16">
          <div className="pointer-events-none absolute inset-0 glass" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold text-cloud sm:text-4xl">
              &ldquo;I don&apos;t just use AI. I understand it, build it, and
              create with it.&rdquo;
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cloud-muted">
              That&apos;s what every learner leaves Somora believing. The mission:
              close the AI literacy gap for every child, everywhere.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/universe" className="px-6 py-3 text-base">
                Enter Somora
              </Button>
              <Button href="/academy" variant="outline" className="px-6 py-3 text-base">
                Browse the curriculum
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="container-page flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <Logo className="h-6 w-6" />
            <span className="font-display font-bold text-cloud">{site.name}</span>
            <span className="text-sm text-cloud-dim">&middot; {site.tagline}</span>
          </div>
          <p className="text-xs text-cloud-dim">
            &copy; {new Date().getFullYear()} Somora. Built with curiosity.
          </p>
        </div>
      </footer>
    </div>
  );
}
