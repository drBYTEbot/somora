"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { SectionHeader } from "@/components/ui/section-header";
import { dailyQuests, weeklyChallenges, seasonalEvents, bossBattles } from "@/config/quests";

function QuestCard({ quest, isComplete, onComplete, index }: { quest: typeof dailyQuests[0]; isComplete: boolean; onComplete: () => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className={cn("rounded-3xl glass p-5", isComplete && "ring-1 ring-aurora-teal/30")}
    >
      <div className="flex items-start gap-4">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl", isComplete ? "bg-aurora-teal/20" : "bg-white/5")}>
          <span aria-hidden="true">{quest.emoji}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-cloud">{quest.title}</h3>
            <span className="rounded-full bg-aurora-amber/15 px-2.5 py-0.5 text-xs font-bold text-aurora-amber">+{quest.xp} XP</span>
          </div>
          <p className="mt-0.5 text-sm text-cloud-muted">{quest.description}</p>
          <div className="mt-3">
            {isComplete ? (
              <div className="flex items-center gap-2 text-sm font-semibold text-aurora-teal">
                <span>{"\u2705"}</span> Complete! +{quest.xp} XP earned
              </div>
            ) : (
              <button
                onClick={onComplete}
                className="rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet px-4 py-1.5 text-xs font-semibold text-night-950 transition-all hover:shadow-glow hover:shadow-aurora-violet/40 active:scale-95"
              >
                Mark complete
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function QuestPage() {
  const { state, completeQuest, isQuestComplete } = useStore();

  return (
    <div className="container-page py-10 lg:py-14">
      <SectionHeader
        eyebrow="Somora Quest"
        title="Your missions"
        description="Complete quests to earn XP and unlock rewards. Daily quests reset every day."
        center
      />

      {seasonalEvents.map((event) => {
        const complete = isQuestComplete(event.id);
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-10 overflow-hidden rounded-5xl bg-gradient-to-br from-aurora-violet/20 via-aurora-bloom/15 to-aurora-amber/10 p-8"
          >
            <div className="pointer-events-none absolute inset-0 glass rounded-5xl" />
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
                <p className="font-display text-3xl font-bold text-cloud">{complete ? event.total : event.progress}/{event.total}</p>
                <p className="text-xs text-cloud-dim">{complete ? "Completed!" : "challenges done"}</p>
              </div>
            </div>
          </motion.div>
        );
      })}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-cloud">Daily quests</h2>
            <span className="text-xs text-cloud-dim">{state.completedQuests.filter((q) => dailyQuests.some((dq) => dq.id === q)).length}/{dailyQuests.length} done</span>
          </div>
          <div className="space-y-3">
            {dailyQuests.map((q, i) => (
              <QuestCard
                key={q.id}
                quest={q}
                index={i}
                isComplete={isQuestComplete(q.id)}
                onComplete={() => completeQuest(q.id, q.xp)}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-display text-xl font-bold text-cloud">Weekly challenges</h2>
          <div className="space-y-3">
            {weeklyChallenges.map((q, i) => (
              <QuestCard
                key={q.id}
                quest={q}
                index={i}
                isComplete={isQuestComplete(q.id)}
                onComplete={() => completeQuest(q.id, q.xp)}
              />
            ))}
          </div>

          <h2 className="mb-4 mt-8 font-display text-xl font-bold text-cloud">Boss battles</h2>
          <div className="space-y-3">
            {bossBattles.map((q, i) => (
              <QuestCard
                key={q.id}
                quest={q}
                index={i}
                isComplete={isQuestComplete(q.id)}
                onComplete={() => completeQuest(q.id, q.xp)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
