"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { worlds } from "@/config/worlds";
import { getModule } from "@/config/modules";
import { WorldMap } from "@/components/world/world-map";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons/icon";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

const mod = getModule("universe");

export default function UniversePage() {
  const { isWorldUnlocked } = useStore();
  return (
    <div className="container-page py-10 lg:py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <div className="mb-5 flex items-center justify-center gap-4">
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br text-4xl shadow-glow-lg",
              mod.gradient,
              mod.glow,
            )}
          >
            <span aria-hidden="true">{mod.emoji}</span>
          </div>
          <StatusBadge status={mod.status} />
        </div>
        <h1 className="font-display text-4xl font-bold text-cloud sm:text-6xl">
          Somora Universe
        </h1>
        <p className={cn("mt-2 text-lg font-medium", mod.text)}>
          {mod.tagline}
        </p>
        <p className="mt-4 leading-relaxed text-cloud-muted">
          {mod.description}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button href="/academy" className="px-5 py-2.5">
            Start learning
          </Button>
          <Button href="/hub" variant="outline" className="px-5 py-2.5">
            Your progress
          </Button>
        </div>
      </motion.div>

      <div className="mt-12">
        <WorldMap />
      </div>

      <div className="mt-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-cloud">
            The worlds
          </h2>
          <p className="text-sm text-cloud-dim">
            {worlds.filter((w) => isWorldUnlocked(w.id)).length} of {worlds.length}{" "}
            unlocked
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {worlds.map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
            >
              {isWorldUnlocked(w.id) ? (
                <Link
                  href={`/universe/${w.id}`}
                  className={cn(
                    "group relative block overflow-hidden rounded-4xl glass p-6 transition-all duration-300 hover:-translate-y-1",
                  )}
                >
                  <div className={cn("absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-opacity group-hover:opacity-40", w.gradient)} />
                  <div className="relative mb-4 flex items-center gap-3">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-glow", w.gradient, w.glow)}>
                      <span aria-hidden="true">{w.emoji}</span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-cloud-dim">World {w.order}</p>
                      <p className="font-display text-lg font-semibold text-cloud">{w.name}</p>
                    </div>
                  </div>
                  <p className="relative text-sm leading-relaxed text-cloud-muted">{w.blurb}</p>
                  <div className="relative mt-4 flex items-center justify-between">
                    <span className={cn("text-xs font-semibold", w.text)}>{w.topic}</span>
                    <span className="flex items-center gap-1 text-xs font-medium text-aurora-teal">
                      Explore
                      <Icon name="arrow-right" className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ) : (
                <div className={cn("group relative block overflow-hidden rounded-4xl glass p-6 opacity-70")}>
                  <div className={cn("absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br opacity-10 blur-2xl", w.gradient)} />
                  <div className="relative mb-4 flex items-center gap-3">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-glow grayscale opacity-70", w.gradient, w.glow)}>
                      <span aria-hidden="true">{w.emoji}</span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-cloud-dim">World {w.order}</p>
                      <p className="font-display text-lg font-semibold text-cloud">{w.name}</p>
                    </div>
                  </div>
                  <p className="relative text-sm leading-relaxed text-cloud-muted">{w.blurb}</p>
                  <div className="relative mt-4 flex items-center justify-between">
                    <span className={cn("text-xs font-semibold", w.text)}>{w.topic}</span>
                    <span className="flex items-center gap-1 text-xs font-medium text-cloud-dim">
                      <Icon name="lock" className="h-3.5 w-3.5" />
                      Locked
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
