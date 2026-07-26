"use client";

import { motion } from "framer-motion";
import { learnerProgress, achievements, weeklyXP, skillTree } from "@/config/progress";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { XPBar } from "@/components/ui/xp-bar";
import { SkillTree } from "@/components/ui/skill-tree";

export default function HubPage() {
  const xpPct = Math.round((learnerProgress.xp / learnerProgress.xpToNext) * 100);
  const maxXP = Math.max(...weeklyXP.map((d) => d.xp));
  const unlockedAch = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="relative overflow-hidden rounded-5xl glass-strong p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-aurora-violet/20 blur-3xl" />
        <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center">
          <ProgressRing value={xpPct} size={140} strokeWidth={10}>
            <span className="font-display text-3xl font-bold text-cloud">{learnerProgress.level}</span>
            <span className="text-[10px] uppercase tracking-wider text-cloud-dim">Level</span>
          </ProgressRing>
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-wider text-aurora-teal">{learnerProgress.levelTitle}</p>
            <h1 className="font-display text-3xl font-bold text-cloud sm:text-4xl">Your progress</h1>
            <p className="mt-1 text-cloud-muted">Keep going to become an {learnerProgress.nextTitle}!</p>
            <div className="mt-4 max-w-md">
              <XPBar value={learnerProgress.xp} max={learnerProgress.xpToNext} />
              <p className="mt-1.5 text-xs text-cloud-dim">{learnerProgress.xpToNext - learnerProgress.xp} XP to level {learnerProgress.level + 1}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard index={0} icon={<span aria-hidden="true">{learnerProgress.streak >= 1 ? "\u{1F525}" : "\u{1F4C5}"}</span>} label="Streak" value={`${learnerProgress.streak} days`} sub={`Best: ${learnerProgress.streakBest}`} gradient="from-aurora-amber/20 to-aurora-rose/10" />
        <StatCard index={1} icon={<span aria-hidden="true">{"\u{1FA99}"}</span>} label="Coins" value={learnerProgress.coins.toLocaleString()} gradient="from-aurora-amber/20 to-aurora-sun/10" />
        <StatCard index={2} icon={<span aria-hidden="true">{"\u{1F48E}"}</span>} label="Gems" value={learnerProgress.gems} gradient="from-aurora-violet/20 to-aurora-bloom/10" />
        <StatCard index={3} icon={<span aria-hidden="true">{"\u{1F393}"}</span>} label="Lessons" value={`${learnerProgress.lessonsCompleted}/${learnerProgress.lessonsTotal}`} gradient="from-aurora-sky/20 to-aurora-teal/10" />
        <StatCard index={4} icon={<span aria-hidden="true">{"\u{1F6E0}\u{FE0F}"}</span>} label="Projects" value={learnerProgress.projectsBuilt} gradient="from-aurora-bloom/20 to-aurora-violet/10" />
        <StatCard index={5} icon={<span aria-hidden="true">{"\u{1F3AE}"}</span>} label="Games" value={`${learnerProgress.gamesPlayed}/${learnerProgress.gamesTotal}`} gradient="from-aurora-rose/20 to-aurora-amber/10" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-4xl glass p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-cloud">Weekly XP</h2>
              <span className="text-xs text-cloud-dim">{learnerProgress.timeThisWeek} this week</span>
            </div>
            <div className="flex items-end justify-between gap-2 sm:gap-4" style={{ height: 200 }}>
              {weeklyXP.map((d, i) => (
                <div key={d.day} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(d.xp / maxXP) * 160}px` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className="w-full rounded-t-xl bg-gradient-to-t from-aurora-teal/40 via-aurora-violet/60 to-aurora-amber/80"
                  />
                  <span className="text-xs font-medium text-cloud-dim">{d.day}</span>
                  <span className="text-[10px] text-cloud-dim">{d.xp}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-4xl glass p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-cloud">Skill tree</h2>
              <span className="text-xs text-cloud-dim">{skillTree.filter((s) => s.unlocked).length}/{skillTree.length} unlocked</span>
            </div>
            <SkillTree />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-4xl glass p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-cloud">Achievements</h2>
            <p className="mb-4 text-xs text-cloud-dim">{unlockedAch} of {achievements.length} unlocked</p>
            <div className="grid grid-cols-2 gap-3">
              {achievements.slice(0, 8).map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className={cn("rounded-2xl p-3 text-center", a.unlocked ? "bg-white/[0.04] ring-1 ring-white/10" : "bg-white/[0.01] opacity-40")}
                >
                  <div className="text-2xl">{a.emoji}</div>
                  <p className="mt-1 text-[10px] font-semibold text-cloud">{a.name}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl glass p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-cloud">Worlds</h2>
            <div className="mb-3">
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-cloud-dim">{learnerProgress.worldsUnlocked} of {learnerProgress.worldsTotal} unlocked</span>
                <span className="text-cloud-muted">{Math.round((learnerProgress.worldsUnlocked / learnerProgress.worldsTotal) * 100)}%</span>
              </div>
              <XPBar value={learnerProgress.worldsUnlocked} max={learnerProgress.worldsTotal} showLabel={false} />
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-cloud-muted">Global rank</span><span className="font-semibold text-cloud">{learnerProgress.rank}</span></div>
              <div className="flex justify-between"><span className="text-cloud-muted">Level</span><span className="font-semibold text-cloud">{learnerProgress.level} {"\u00B7"} {learnerProgress.levelTitle}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
