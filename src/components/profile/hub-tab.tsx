"use client";

import { cn } from "@/lib/utils";
import { useStore, levelFromXP, xpInLevel } from "@/lib/store";
import { achievements, skillTree } from "@/config/progress";
import { worlds } from "@/config/worlds";
import { curriculumTracks } from "@/config/curriculum";
import { arcadeGames } from "@/config/arcade";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { XPBar } from "@/components/ui/xp-bar";
import { Icon } from "@/components/icons/icon";

const XP_PER_LEVEL = 500;
const TOTAL_LESSONS = curriculumTracks.reduce((s, t) => s + t.lessons.length, 0);

export function HubTab() {
  const { state, level, xpInCurrentLevel } = useStore();
  const xpPct = Math.round((xpInCurrentLevel / XP_PER_LEVEL) * 100);
  const xpToNext = XP_PER_LEVEL - xpInCurrentLevel;
  const lessonsDone = state.completedLessons.length;
  const gamesPlayed = Object.keys(state.games).length;
  const projectsBuilt = state.projects.length;
  const worldsUnlocked = state.unlockedWorlds.length;
  const unlockedAch = state.unlockedAchievements.length;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-5xl glass-strong p-6 lg:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-aurora-violet/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <ProgressRing value={xpPct} size={120} strokeWidth={10}>
            <span className="font-display text-3xl font-bold text-cloud">{level}</span>
            <span className="text-[10px] uppercase tracking-wider text-cloud-dim">Level</span>
          </ProgressRing>
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-wider text-aurora-teal">
              {state.xp < 1000 ? "AI Explorer" : state.xp < 3000 ? "AI Creator" : "AI Engineer"}
            </p>
            <h2 className="font-display text-2xl font-bold text-cloud">
              {state.user.name}
            </h2>
            <p className="mt-1 text-sm text-cloud-muted">
              {state.streak > 0 ? `${state.streak}-day streak!` : "Start learning to build a streak!"}
            </p>
            <div className="mt-3 max-w-md">
              <XPBar value={xpInCurrentLevel} max={XP_PER_LEVEL} />
              <p className="mt-1.5 text-xs text-cloud-dim">{xpToNext} XP to level {level + 1}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard index={0} icon={<Icon name="star" className="h-5 w-5 text-aurora-amber" />} label="Streak" value={`${state.streak}d`} gradient="from-aurora-amber/20 to-aurora-rose/10" />
        <StatCard index={1} icon={<Icon name="star" className="h-5 w-5 text-aurora-sun" />} label="Coins" value={state.coins.toLocaleString()} gradient="from-aurora-amber/20 to-aurora-sun/10" />
        <StatCard index={2} icon={<Icon name="star" className="h-5 w-5 text-aurora-violet" />} label="Gems" value={state.gems} gradient="from-aurora-violet/20 to-aurora-bloom/10" />
        <StatCard index={3} icon={<Icon name="academy" className="h-5 w-5 text-aurora-sky" />} label="Lessons" value={`${lessonsDone}/${TOTAL_LESSONS}`} gradient="from-aurora-sky/20 to-aurora-teal/10" />
        <StatCard index={4} icon={<Icon name="studio" className="h-5 w-5 text-aurora-bloom" />} label="Projects" value={projectsBuilt} gradient="from-aurora-bloom/20 to-aurora-violet/10" />
        <StatCard index={5} icon={<Icon name="arcade" className="h-5 w-5 text-aurora-rose" />} label="Games" value={`${gamesPlayed}/${arcadeGames.length}`} gradient="from-aurora-rose/20 to-aurora-amber/10" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {gamesPlayed > 0 && (
            <div className="rounded-4xl glass p-6">
              <h3 className="mb-4 font-display text-lg font-bold text-cloud">Game high scores</h3>
              <div className="space-y-3">
                {Object.entries(state.games).map(([id, rec]) => {
                  const game = arcadeGames.find((g) => g.id === id);
                  if (!game) return null;
                  return (
                    <div key={id} className="flex items-center gap-3 rounded-2xl bg-white/[0.03] p-3">
                      <div className="min-w-0 flex-1">
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
            </div>
          )}

          <div className="rounded-4xl glass p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-cloud">Skill tree</h3>
              <span className="text-xs text-cloud-dim">{state.unlockedSkills.length}/{skillTree.length} unlocked</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillTree.map((s) => {
                const unlocked = state.unlockedSkills.includes(s.id);
                return (
                  <div
                    key={s.id}
                    className={cn(
                      "flex items-center gap-2 rounded-2xl px-3 py-2",
                      unlocked ? "bg-aurora-teal/10 ring-1 ring-aurora-teal/30" : "bg-white/[0.02] opacity-50",
                    )}
                  >
                    <Icon name="star" className={cn("h-4 w-4", unlocked ? "text-aurora-teal" : "text-cloud-dim")} />
                    <span className="text-xs font-semibold text-cloud">{s.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-4xl glass p-6">
            <h3 className="mb-3 font-display text-lg font-bold text-cloud">Achievements</h3>
            <p className="mb-3 text-xs text-cloud-dim">{unlockedAch} of {achievements.length} unlocked</p>
            <div className="grid grid-cols-2 gap-2">
              {achievements.slice(0, 8).map((a) => {
                const unlocked = state.unlockedAchievements.includes(a.id);
                return (
                  <div
                    key={a.id}
                    className={cn(
                      "rounded-2xl p-3 text-center",
                      unlocked ? "bg-white/[0.04] ring-1 ring-white/10" : "bg-white/[0.01] opacity-40",
                    )}
                  >
                    <Icon name="star" className={cn("mx-auto h-5 w-5", unlocked ? "text-aurora-amber" : "text-cloud-dim")} />
                    <p className="mt-1 text-[10px] font-semibold text-cloud">{a.name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-4xl glass p-6">
            <h3 className="mb-3 font-display text-lg font-bold text-cloud">Worlds</h3>
            <div className="mb-3">
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-cloud-dim">{worldsUnlocked} of {worlds.length} unlocked</span>
                <span className="text-cloud-muted">{Math.round((worldsUnlocked / worlds.length) * 100)}%</span>
              </div>
              <XPBar value={worldsUnlocked} max={worlds.length} showLabel={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
