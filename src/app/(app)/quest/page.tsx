"use client";

import { motion } from "framer-motion";
import { dailyQuests, weeklyChallenges, seasonalEvents, bossBattles } from "@/config/quests";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";

function QuestCard({ quest, index }: { quest: typeof dailyQuests[0]; index: number }) {
  const complete = quest.progress >= quest.total;
  const pct = Math.round((quest.progress / quest.total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className={cn("rounded-3xl glass p-5", complete && "ring-1 ring-aurora-teal/30")}
    >
      <div className="flex items-start gap-4">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl", complete ? "bg-aurora-teal/20" : "bg-white/5")}>
          <span aria-hidden="true">{quest.emoji}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-cloud">{quest.title}</h3>
            <span className="rounded-full bg-aurora-amber/15 px-2.5 py-0.5 text-xs font-bold text-aurora-amber">+{quest.xp} XP</span>
          </div>
          <p className="mt-0.5 text-sm text-cloud-muted">{quest.description}</p>
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-cloud-dim">{quest.progress} / {quest.total}</span>
              <span className={cn("font-semibold", complete ? "text-aurora-teal" : "text-cloud-dim")}>{complete ? "Complete!" : `${pct}%`}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
              <div className={cn("h-full rounded-full transition-all duration-500", complete ? "bg-gradient-to-r from-aurora-teal to-aurora-leaf" : "bg-gradient-to-r from-aurora-violet to-aurora-bloom")} style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function QuestPage() {
  return (
    <div className="container-page py-10 lg:py-14">
      <SectionHeader eyebrow="Somora Quest" title="Your missions" description="Daily quests refresh every day. Weekly challenges push you further. Seasonal events bring the whole universe together." center />

      {seasonalEvents.map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative mt-10 overflow-hidden rounded-5xl bg-gradient-to-br from-aurora-violet/20 via-aurora-bloom/15 to-aurora-amber/10 p-8"
        >
          <div className="pointer-events-none absolute inset-0 glass" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{event.emoji}</div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-aurora-amber">Seasonal Event</p>
                <h2 className="font-display text-2xl font-bold text-cloud">{event.title}</h2>
                <p className="mt-1 max-w-md text-sm text-cloud-muted">{event.description}</p>
              </div>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-cloud">{event.progress}/{event.total}</p>
              <p className="text-xs text-cloud-dim">challenges done</p>
            </div>
          </div>
        </motion.div>
      ))}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-cloud">Daily quests</h2>
            <span className="text-xs text-cloud-dim">Resets in 6h 24m</span>
          </div>
          <div className="space-y-3">
            {dailyQuests.map((q, i) => <QuestCard key={q.id} quest={q} index={i} />)}
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-display text-xl font-bold text-cloud">Weekly challenges</h2>
          <div className="space-y-3">
            {weeklyChallenges.map((q, i) => <QuestCard key={q.id} quest={q} index={i} />)}
          </div>

          <h2 className="mb-4 mt-8 font-display text-xl font-bold text-cloud">Boss battles</h2>
          <div className="space-y-3">
            {bossBattles.map((q, i) => <QuestCard key={q.id} quest={q} index={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
