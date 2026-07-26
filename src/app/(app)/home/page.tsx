"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useStore, levelFromXP } from "@/lib/store";
import { curriculumTracks } from "@/config/curriculum";
import { achievements } from "@/config/progress";

const TOTAL_LESSONS = curriculumTracks.reduce((s, t) => s + t.lessons.length, 0);

export default function HomePage() {
  const { state, level } = useStore();
  const lessonsDone = state.completedLessons.length;
  const lessonPct = Math.round((lessonsDone / TOTAL_LESSONS) * 100);
  const unlockedAch = state.unlockedAchievements.length;
  const gamesPlayed = Object.keys(state.games).length;

  return (
    <div className="container-page py-10 lg:py-14">
      <SectionHeader
        eyebrow="Somora Home"
        title={`${state.user.name}'s learning journey`}
        description="A real-time view of progress, achievements, and activity. Data updates live as your child explores Somora."
      />

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard index={0} icon={<span aria-hidden="true">{"\u{1F525}"}</span>} label="Streak" value={`${state.streak} days`} gradient="from-aurora-amber/20 to-aurora-rose/10" />
        <StatCard index={1} icon={<span aria-hidden="true">{"\u2B50"}</span>} label="Level" value={level} gradient="from-aurora-violet/20 to-aurora-bloom/10" />
        <StatCard index={2} icon={<span aria-hidden="true">{"\u{1F3AE}"}</span>} label="Games played" value={gamesPlayed} gradient="from-aurora-sky/20 to-aurora-teal/10" />
        <StatCard index={3} icon={<span aria-hidden="true">{"\u{1F6E0}\u{FE0F}"}</span>} label="Projects" value={state.projects.length} gradient="from-aurora-bloom/20 to-aurora-violet/10" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {state.projects.length > 0 && (
            <div className="rounded-4xl glass p-6">
              <h2 className="mb-4 font-display text-xl font-bold text-cloud">Recent projects</h2>
              <div className="space-y-3">
                {state.projects.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-start gap-4 rounded-2xl bg-white/[0.03] p-4">
                    <div className="text-2xl">{p.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-cloud">{p.title}</p>
                        <span className="text-xs text-cloud-dim">{new Date(p.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-cloud-muted">{p.description}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {p.tags.map((tag) => <span key={tag} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-cloud-dim">{tag}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-4xl glass p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-cloud">Curriculum progress</h2>
            <div className="space-y-4">
              {curriculumTracks.slice(0, 5).map((track) => {
                const done = track.lessons.filter((l) => state.completedLessons.includes(l.id)).length;
                const pct = Math.round((done / track.lessons.length) * 100);
                return (
                  <div key={track.id}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-cloud-muted">
                        <span>{track.emoji}</span>
                        {track.title}
                      </span>
                      <span className="font-semibold text-cloud">{done}/{track.lessons.length}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        className="h-full rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {state.unlockedAchievements.length > 0 && (
            <div className="rounded-4xl glass p-6">
              <h2 className="mb-4 font-display text-xl font-bold text-cloud">Recent achievements</h2>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {achievements.filter((a) => state.unlockedAchievements.includes(a.id)).slice(0, 8).map((a) => (
                  <div key={a.id} className="rounded-2xl bg-white/[0.04] p-3 text-center ring-1 ring-white/10">
                    <div className="text-2xl">{a.emoji}</div>
                    <p className="mt-1 text-[10px] font-semibold text-cloud">{a.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center rounded-4xl glass-strong p-6">
            <ProgressRing value={lessonPct} size={130} strokeWidth={9}>
              <span className="font-display text-3xl font-bold text-cloud">{lessonPct}%</span>
              <span className="text-[10px] uppercase tracking-wider text-cloud-dim">Curriculum</span>
            </ProgressRing>
            <p className="mt-4 text-center text-sm text-cloud-muted">
              {lessonsDone} of {TOTAL_LESSONS} lessons completed
            </p>
          </div>

          <div className="rounded-4xl glass p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-cloud">Stats</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-cloud-muted">Total XP</span><span className="font-semibold text-cloud">{state.xp.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-cloud-muted">Level</span><span className="font-semibold text-cloud">{level}</span></div>
              <div className="flex justify-between"><span className="text-cloud-muted">Coins</span><span className="font-semibold text-cloud">{state.coins}</span></div>
              <div className="flex justify-between"><span className="text-cloud-muted">Gems</span><span className="font-semibold text-cloud">{state.gems}</span></div>
              <div className="flex justify-between"><span className="text-cloud-muted">Streak</span><span className="font-semibold text-cloud">{state.streak} days</span></div>
              <div className="flex justify-between"><span className="text-cloud-muted">Achievements</span><span className="font-semibold text-cloud">{unlockedAch}</span></div>
              <div className="flex justify-between"><span className="text-cloud-muted">Worlds unlocked</span><span className="font-semibold text-cloud">{state.unlockedWorlds.length}</span></div>
            </div>
          </div>

          {lessonsDone === 0 && (
            <div className="rounded-4xl bg-gradient-to-br from-aurora-teal/15 via-aurora-violet/10 to-aurora-amber/10 p-6 text-center">
              <h2 className="font-display text-lg font-bold text-cloud">Get started!</h2>
              <p className="mt-2 text-sm text-cloud-muted">
                No lessons completed yet. Encourage your child to explore the Academy and play games.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
