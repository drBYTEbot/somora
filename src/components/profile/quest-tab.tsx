"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/icons/icon";
import { dailyQuests, weeklyChallenges, seasonalEvents, bossBattles } from "@/config/quests";

function QuestCard({ quest, isComplete, onComplete, index }: { quest: typeof dailyQuests[0]; isComplete: boolean; onComplete: () => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      className={cn("rounded-3xl glass p-4", isComplete && "ring-1 ring-aurora-teal/30")}
    >
      <div className="flex items-start gap-3">
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", isComplete ? "bg-aurora-teal/20" : "bg-white/5")}>
          <Icon name="star" className={cn("h-5 w-5", isComplete ? "text-aurora-teal" : "text-cloud-dim")} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-cloud">{quest.title}</h3>
            <span className="rounded-full bg-aurora-amber/15 px-2.5 py-0.5 text-xs font-bold text-aurora-amber">+{quest.xp} XP</span>
          </div>
          <p className="mt-0.5 text-xs text-cloud-muted">{quest.description}</p>
          <div className="mt-2">
            {isComplete ? (
              <div className="flex items-center gap-1 text-xs font-semibold text-aurora-teal">
                <Icon name="star" className="h-3 w-3" /> Complete!
              </div>
            ) : (
              <button
                onClick={onComplete}
                className="rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet px-3 py-1 text-xs font-semibold text-night-950 transition-all hover:shadow-glow active:scale-95"
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

export function QuestTab() {
  const { state, completeQuest, isQuestComplete } = useStore();

  return (
    <div className="space-y-6">
      {seasonalEvents.map((event) => {
        const complete = isQuestComplete(event.id);
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-5xl bg-gradient-to-br from-aurora-violet/20 via-aurora-bloom/15 to-aurora-amber/10 p-6"
          >
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-aurora-amber/20">
                  <Icon name="star" className="h-6 w-6 text-aurora-amber" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-aurora-amber">Seasonal Event</p>
                  <h3 className="font-display text-lg font-bold text-cloud">{event.title}</h3>
                  <p className="mt-0.5 max-w-md text-sm text-cloud-muted">{event.description}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-cloud">{complete ? event.total : event.progress}/{event.total}</p>
                <p className="text-xs text-cloud-dim">{complete ? "Completed!" : "to go"}</p>
              </div>
            </div>
          </motion.div>
        );
      })}

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-cloud">Daily quests</h2>
            <span className="text-xs text-cloud-dim">{state.completedQuests.filter((q) => dailyQuests.some((dq) => dq.id === q)).length}/{dailyQuests.length}</span>
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
          <h2 className="mb-3 font-display text-lg font-bold text-cloud">Weekly challenges</h2>
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

          <h2 className="mb-3 mt-6 font-display text-lg font-bold text-cloud">Boss battles</h2>
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
