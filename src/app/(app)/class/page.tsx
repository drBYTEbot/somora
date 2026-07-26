"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { useStore, levelFromXP } from "@/lib/store";
import { curriculumTracks } from "@/config/curriculum";
import { arcadeGames } from "@/config/arcade";

const classmates = [
  { name: "Dev", emoji: "\u{1F468}\u{1F3FE}", xp: 1920, streak: 5, progress: 44, status: "on-track", lastActive: "today" },
  { name: "Aria", emoji: "\u{1F471}\u{1F3FB}\u200D\u2640", xp: 3210, streak: 18, progress: 72, status: "ahead", lastActive: "today" },
  { name: "Leo", emoji: "\u{1F466}\u{1F3FD}", xp: 890, streak: 0, progress: 20, status: "behind", lastActive: "2 days ago" },
  { name: "Priya", emoji: "\u{1F469}\u{1F3FF}", xp: 2400, streak: 8, progress: 55, status: "on-track", lastActive: "today" },
  { name: "Sam", emoji: "\u{1F466}\u{1F3FB}", xp: 1560, streak: 3, progress: 35, status: "on-track", lastActive: "yesterday" },
];

const statusMeta = {
  ahead: { label: "Ahead", color: "text-aurora-teal", bg: "bg-aurora-teal/15" },
  "on-track": { label: "On track", color: "text-aurora-sky", bg: "bg-aurora-sky/15" },
  behind: { label: "Needs support", color: "text-aurora-rose", bg: "bg-aurora-rose/15" },
};

const totalLessons = curriculumTracks.reduce((s, t) => s + t.lessons.length, 0);

export default function ClassPage() {
  const { state } = useStore();
  const level = levelFromXP(state.xp);
  const lessonsDone = state.completedLessons.length;
  const lessonPct = Math.round((lessonsDone / totalLessons) * 100);
  const gamesPlayed = Object.keys(state.games).length;
  const allStudents = [
    { name: state.user.name, emoji: state.user.avatar, xp: state.xp, streak: state.streak, progress: lessonPct, status: lessonPct > 60 ? "ahead" : lessonPct > 30 ? "on-track" : "behind", lastActive: "now", isYou: true },
    ...classmates,
  ];

  return (
    <div className="container-page py-10 lg:py-14">
      <SectionHeader
        eyebrow="Somora Class"
        title="Teacher dashboard"
        description="Track your classroom. The first student (you) shows real progress from this device. Multi-student tracking requires Supabase setup."
      />

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard index={0} icon={<span aria-hidden="true">{"\u{1F465}"}</span>} label="Students" value={allStudents.length} gradient="from-aurora-sky/20 to-aurora-teal/10" />
        <StatCard index={1} icon={<span aria-hidden="true">{"\u{1F4DD}"}</span>} label="Your lessons" value={`${lessonsDone}/${totalLessons}`} gradient="from-aurora-violet/20 to-aurora-bloom/10" />
        <StatCard index={2} icon={<span aria-hidden="true">{"\u2705"}</span>} label="Your completion" value={`${lessonPct}%`} gradient="from-aurora-teal/20 to-aurora-leaf/10" />
        <StatCard index={3} icon={<span aria-hidden="true">{"\u{1F4C8}"}</span>} label="Your level" value={level} gradient="from-aurora-amber/20 to-aurora-rose/10" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-display text-xl font-bold text-cloud">Students</h2>
          <div className="space-y-3">
            {allStudents.map((s, i) => {
              const meta = statusMeta[s.status as keyof typeof statusMeta];
              return (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={cn("flex items-center gap-4 rounded-2xl glass p-4", (s as any).isYou && "ring-1 ring-aurora-teal/30")}
                >
                  <div className="text-2xl">{s.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-cloud">
                        {s.name}
                        {(s as any).isYou && <span className="ml-2 text-[10px] font-semibold text-aurora-teal">(you)</span>}
                      </p>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold", meta.bg, meta.color)}>{meta.label}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-cloud-dim">
                      <span>{s.xp.toLocaleString()} XP</span>
                      <span>{"\u00B7"}</span>
                      <span>{s.streak > 0 ? `${s.streak} day streak` : "No streak"}</span>
                      <span>{"\u00B7"}</span>
                      <span>Active {s.lastActive}</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet" style={{ width: `${s.progress}%` }} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-4xl glass p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-cloud">Class summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-cloud-muted">Total XP earned</span><span className="font-semibold text-cloud">{state.xp.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-cloud-muted">Lessons completed</span><span className="font-semibold text-cloud">{lessonsDone}</span></div>
              <div className="flex justify-between"><span className="text-cloud-muted">Games played</span><span className="font-semibold text-cloud">{gamesPlayed}</span></div>
              <div className="flex justify-between"><span className="text-cloud-muted">Projects built</span><span className="font-semibold text-cloud">{state.projects.length}</span></div>
              <div className="flex justify-between"><span className="text-cloud-muted">Achievements</span><span className="font-semibold text-cloud">{state.unlockedAchievements.length}</span></div>
            </div>
          </div>

          <div className="rounded-4xl glass p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-cloud">Skill mastery</h2>
            <div className="space-y-2">
              {curriculumTracks.slice(0, 5).map((track) => {
                const done = track.lessons.filter((l) => state.completedLessons.includes(l.id)).length;
                const pct = Math.round((done / track.lessons.length) * 100);
                return (
                  <div key={track.id}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-cloud-muted">{track.title}</span>
                      <span className="text-cloud-dim">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
