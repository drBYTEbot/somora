"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { arcadeGames } from "@/config/arcade";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataDetective } from "@/components/arcade/data-detective";
import { TrainRobot } from "@/components/arcade/train-robot";
import { PromptWizard } from "@/components/arcade/prompt-wizard";
import { useStore } from "@/lib/store";

const playableComponents: Record<string, React.ComponentType> = {
  "data-detective": DataDetective,
  "train-robot": TrainRobot,
  "prompt-wizard": PromptWizard,
};

export default function ArcadePage() {
  const [active, setActive] = useState<string>("data-detective");
  const { getGameRecord } = useStore();
  const ActiveGame = playableComponents[active];

  return (
    <div className="container-page py-10 lg:py-14">
      <SectionHeader
        eyebrow="Somora Arcade"
        title="Learn AI by playing"
        description="Every mini-game teaches one core AI concept. Play, experiment, and level up. Your scores are saved automatically."
        center
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {ActiveGame && <ActiveGame />}
        </div>

        <div className="space-y-3">
          <p className="px-1 text-xs font-semibold uppercase tracking-wider text-cloud-dim">Pick a game</p>
          {arcadeGames.map((g) => {
            const isActive = active === g.id;
            const record = getGameRecord(g.id);
            return (
              <button
                key={g.id}
                onClick={() => g.playable && setActive(g.id)}
                disabled={!g.playable}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all duration-200",
                  isActive ? "glass ring-1 ring-white/15" : "hover:bg-white/5",
                  !g.playable && "opacity-50",
                )}
              >
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-lg shadow-glow", g.gradient, g.glow)}>
                  <span aria-hidden="true">{g.emoji}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-semibold text-cloud">{g.name}</p>
                  <p className="truncate text-xs text-cloud-dim">{g.concept}</p>
                </div>
                {record ? (
                  <div className="text-right">
                    <p className="font-display text-sm font-bold text-aurora-teal">{record.highScore}</p>
                    <p className="text-[9px] text-cloud-dim">best</p>
                  </div>
                ) : g.playable ? (
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", isActive ? "bg-aurora-teal/20 text-aurora-teal" : "bg-white/5 text-cloud-dim")}>
                    {isActive ? "PLAYING" : "PLAY"}
                  </span>
                ) : (
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold text-cloud-dim">SOON</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-14">
        <SectionHeader eyebrow="The full library" title="All mini-games" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {arcadeGames.map((g, i) => {
            const record = getGameRecord(g.id);
            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
                className="group relative overflow-hidden rounded-4xl glass p-6"
              >
                <div className={cn("absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl group-hover:opacity-40", g.gradient)} />
                <div className="relative mb-4 flex items-center justify-between">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-glow", g.gradient, g.glow)}>
                    <span aria-hidden="true">{g.emoji}</span>
                  </div>
                  <StatusBadge status={g.playable ? "live" : "soon"} />
                </div>
                <h3 className="font-display text-lg font-semibold text-cloud">{g.name}</h3>
                <p className={cn("mt-0.5 text-xs font-medium", g.text)}>{g.concept}</p>
                <p className="mt-2 text-sm leading-relaxed text-cloud-muted">{g.description}</p>
                <div className="relative mt-4 flex flex-wrap gap-1.5">
                  {g.conceptTags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-cloud-dim">{tag}</span>
                  ))}
                </div>
                <div className="relative mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] text-cloud-dim">
                    <span>{g.difficulty}</span>
                    <span>{"\u00B7"}</span>
                    <span>{g.duration}</span>
                  </div>
                  {record && (
                    <span className="text-[10px] font-semibold text-aurora-teal">
                      Best: {record.highScore} {"\u00B7"} {record.plays}{"x"}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
