"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStore, levelFromXP, xpInLevel } from "@/lib/store";
import { achievements, skillTree } from "@/config/progress";
import { worlds } from "@/config/worlds";
import { curriculumTracks } from "@/config/curriculum";
import { arcadeGames } from "@/config/arcade";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { XPBar } from "@/components/ui/xp-bar";
import { SkillTree } from "@/components/ui/skill-tree";
import { Button } from "@/components/ui/button";

const XP_PER_LEVEL = 500;
const TOTAL_LESSONS = curriculumTracks.reduce((s, t) => s + t.lessons.length, 0);

export default function HubPage() {
  const { state, level, xpInCurrentLevel } = useStore();
  const xpPct = Math.round((xpInCurrentLevel / XP_PER_LEVEL) * 100);
  const xpToNext = XP_PER_LEVEL - xpInCurrentLevel;
  const unlockedAch = state.unlockedAchievements.length;
  const lessonsDone = state.completedLessons.length;
  const gamesPlayed = Object.keys(state.games).length;
  const projectsBuilt = state.projects.length;
  const worldsUnlocked = state.unlockedWorlds.length;

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="relative overflow-hidden rounded-5xl glass-strong p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-aurora-violet/20 blur-3xl" />
        <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center">
          <ProgressRing value={xpPct} size={140} strokeWidth={10}>
            <span className="font-display text-3xl font-bold text-cloud">{level}</span>
            <span className="text-[10px] uppercase tracking-wider text-cloud-dim">Level</span>
          </ProgressRing>
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-wider text-aurora-teal">
              {state.xp < 1000 ? "AI Explorer" : state.xp < 3000 ? "AI Creator" : "AI Engineer"}
            </p>
            <h1 className="font-display text-3xl font-bold text-cloud sm:text-4xl">
              Welcome back, {state.user.name}!
            </h1>
            <p className="mt-1 text-cloud-muted">
              {state.streak > 0
                ? `${state.streak}-day streak! Keep it going!`
                : "Start learning to build a streak!"}
            </p>
            <div className="mt-4 max-w-md">
              <XPBar value={xpInCurrentLevel} max={XP_PER_LEVEL} />
              <p className="mt-1.5 text-xs text-cloud-dim">
                {xpToNext} XP to level {level + 1}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard index={0} icon={<span aria-hidden="true">{"\u{1F525}"}</span>} label="Streak" value={`${state.streak} days`} sub={state.streak > 0 ? "Keep it up!" : "Start today"} gradient="from-aurora-amber/20 to-aurora-rose/10" />
        <StatCard index={1} icon={<span aria-hidden="true">{"\u{1FA99}"}</span>} label="Coins" value={state.coins.toLocaleString()} gradient="from-aurora-amber/20 to-aurora-sun/10" />
        <StatCard index={2} icon={<span aria-hidden="true">{"\u{1F48E}"}</span>} label="Gems" value={state.gems} gradient="from-aurora-violet/20 to-aurora-bloom/10" />
        <StatCard index={3} icon={<span aria-hidden="true">{"\u{1F393}"}</span>} label="Lessons" value={`${lessonsDone}/${TOTAL_LESSONS}`} gradient="from-aurora-sky/20 to-aurora-teal/10" />
        <StatCard index={4} icon={<span aria-hidden="true">{"\u{1F6E0}\u{FE0F}"}</span>} label="Projects" value={projectsBuilt} gradient="from-aurora-bloom/20 to-aurora-violet/10" />
        <StatCard index={5} icon={<span aria-hidden="true">{"\u{1F3AE}"}</span>} label="Games" value={`${gamesPlayed}/${arcadeGames.length}`} gradient="from-aurora-rose/20 to-aurora-amber/10" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {projectsBuilt > 0 && (
            <div className="rounded-4xl glass p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-cloud">Your projects</h2>
                <Button href="/forge" variant="ghost" className="px-3 py-1.5 text-xs">View all</Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {state.projects.slice(0, 4).map((p) => (
                  <div key={p.id} className="rounded-2xl bg-white/[0.03] p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{p.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-cloud">{p.title}</p>
                        <p className="truncate text-xs text-cloud-dim">{p.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-4xl glass p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-cloud">Game high scores</h2>
              {gamesPlayed === 0 && <span className="text-xs text-cloud-dim">Play your first game!</span>}
            </div>
            {gamesPlayed > 0 ? (
              <div className="space-y-3">
                {Object.entries(state.games).map(([id, rec]) => {
                  const game = arcadeGames.find((g) => g.id === id);
                  if (!game) return null;
                  return (
                    <div key={id} className="flex items-center gap-3 rounded-2xl bg-white/[0.03] p-3">
                      <span className="text-xl">{game.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-cloud">{game.name}</p>
                        <p className="text-xs text-cloud-dim">{rec.plays} {rec.plays === 1 ? "play" : "plays"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-bold text-aurora-teal">{rec.highScore}</p>
                        <p className="text-[10px] text-cloud-dim">high score</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-sm text-cloud-dim">No games played yet.</p>
                <Button href="/arcade" className="mt-3">Play a game</Button>
              </div>
            )}
          </div>

          <div className="rounded-4xl glass p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-cloud">Skill tree</h2>
              <span className="text-xs text-cloud-dim">{state.unlockedSkills.length}/{skillTree.length} unlocked</span>
            </div>
            <SkillTree />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-4xl glass p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-cloud">Achievements</h2>
            <p className="mb-4 text-xs text-cloud-dim">{unlockedAch} of {achievements.length} unlocked</p>
            <div className="grid grid-cols-2 gap-3">
              {achievements.slice(0, 8).map((a, i) => {
                const unlocked = state.unlockedAchievements.includes(a.id);
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className={cn("rounded-2xl p-3 text-center", unlocked ? "bg-white/[0.04] ring-1 ring-white/10" : "bg-white/[0.01] opacity-40")}
                  >
                    <div className="text-2xl">{a.emoji}</div>
                    <p className="mt-1 text-[10px] font-semibold text-cloud">{a.name}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="rounded-4xl glass p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-cloud">Worlds</h2>
            <div className="mb-3">
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-cloud-dim">{worldsUnlocked} of {worlds.length} unlocked</span>
                <span className="text-cloud-muted">{Math.round((worldsUnlocked / worlds.length) * 100)}%</span>
              </div>
              <XPBar value={worldsUnlocked} max={worlds.length} showLabel={false} />
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-cloud-muted">Level</span><span className="font-semibold text-cloud">{level} {"\u00B7"} {state.xp < 1000 ? "Explorer" : "Creator"}</span></div>
              <div className="flex justify-between"><span className="text-cloud-muted">Total XP</span><span className="font-semibold text-cloud">{state.xp.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-cloud-muted">Lessons done</span><span className="font-semibold text-cloud">{lessonsDone}</span></div>
            </div>
          </div>
        </div>
      </div>

      {state.xp === 0 && state.completedLessons.length === 0 && (
        <div className="mt-8 rounded-4xl bg-gradient-to-br from-aurora-teal/15 via-aurora-violet/10 to-aurora-amber/10 p-8 text-center">
          <h2 className="font-display text-xl font-bold text-cloud">Ready to begin?</h2>
          <p className="mt-2 text-sm text-cloud-muted">Start your AI learning journey. Every action earns XP and unlocks new worlds.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button href="/academy" className="px-5 py-2.5">Start a lesson</Button>
            <Button href="/arcade" variant="outline" className="px-5 py-2.5">Play a game</Button>
            <Button href="/ai" variant="outline" className="px-5 py-2.5">Ask the AI</Button>
          </div>
        </div>
      )}
    </div>
  );
}
