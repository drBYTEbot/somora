"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { curriculumTracks } from "@/config/curriculum";
import type { Lesson, CurriculumTrack } from "@/config/curriculum";
import { cn } from "@/lib/utils";
import { useStore, levelFromXP } from "@/lib/store";
import { XPBar } from "@/components/ui/xp-bar";
import { Icon } from "@/components/icons/icon";
import { LessonPlayer } from "@/components/lessons/lesson-player";
import { StatCard } from "@/components/ui/stat-card";
import { arcadeGames } from "@/config/arcade";

const classmates = [
  { name: "Dev", xp: 1920, streak: 5, progress: 44, status: "on-track", lastActive: "today" },
  { name: "Aria", xp: 3210, streak: 18, progress: 72, status: "ahead", lastActive: "today" },
  { name: "Leo", xp: 890, streak: 0, progress: 20, status: "behind", lastActive: "2 days ago" },
  { name: "Priya", xp: 2400, streak: 8, progress: 55, status: "on-track", lastActive: "today" },
  { name: "Sam", xp: 1560, streak: 3, progress: 35, status: "on-track", lastActive: "yesterday" },
];

const statusMeta = {
  ahead: { label: "Ahead", color: "text-aurora-teal", bg: "bg-aurora-teal/15" },
  "on-track": { label: "On track", color: "text-aurora-sky", bg: "bg-aurora-sky/15" },
  behind: { label: "Needs support", color: "text-aurora-rose", bg: "bg-aurora-rose/15" },
};

const totalLessons = curriculumTracks.reduce((s, t) => s + t.lessons.length, 0);

type Tab = "lessons" | "class";

export default function AcademyPage() {
  const { state, isLessonComplete } = useStore();
  const [tab, setTab] = useState<Tab>("lessons");
  const [activeLesson, setActiveLesson] = useState<{ lesson: Lesson; track: CurriculumTrack } | null>(null);

  const doneLessons = curriculumTracks.reduce(
    (sum, t) => sum + t.lessons.filter((l) => isLessonComplete(l.id)).length,
    0,
  );

  const level = levelFromXP(state.xp);
  const lessonsDone = state.completedLessons.length;
  const lessonPct = Math.round((lessonsDone / totalLessons) * 100);
  const gamesPlayed = Object.keys(state.games).length;

  const allStudents = [
    { name: state.user.name, xp: state.xp, streak: state.streak, progress: lessonPct, status: lessonPct > 60 ? "ahead" : lessonPct > 30 ? "on-track" : "behind", lastActive: "now", isYou: true },
    ...classmates,
  ];

  return (
    <div className="container-page py-8 lg:py-12">
      <h1 className="font-display text-2xl font-bold text-cloud sm:text-3xl">Academy</h1>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setTab("lessons")}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all",
            tab === "lessons" ? "bg-white/10 text-cloud ring-1 ring-white/10" : "text-cloud-dim hover:bg-white/5 hover:text-cloud-muted",
          )}
        >
          <Icon name="academy" className="h-4 w-4" />
          Lessons
        </button>
        <button
          onClick={() => setTab("class")}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all",
            tab === "class" ? "bg-white/10 text-cloud ring-1 ring-white/10" : "text-cloud-dim hover:bg-white/5 hover:text-cloud-muted",
          )}
        >
          <Icon name="profile" className="h-4 w-4" />
          Class
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-6"
        >
          {tab === "lessons" && (
            <>
              <div className="mx-auto max-w-md rounded-3xl glass p-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-cloud-muted">Overall progress</span>
                  <span className="font-semibold text-cloud">{doneLessons}/{totalLessons} lessons</span>
                </div>
                <XPBar value={doneLessons} max={totalLessons} showLabel={false} />
              </div>

              <div className="mt-6 space-y-6">
                {curriculumTracks.map((track) => {
                  const trackDone = track.lessons.filter((l) => isLessonComplete(l.id)).length;
                  const trackPct = Math.round((trackDone / track.lessons.length) * 100);
                  return (
                    <div
                      key={track.id}
                      className="relative overflow-hidden rounded-4xl glass p-6"
                    >
                      <div className={cn("absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-15 blur-3xl", track.gradient)} />
                      <div className="relative">
                        <div className="flex items-center justify-between">
                          <h2 className="font-display text-lg font-bold text-cloud">{track.title}</h2>
                          <span className="text-xs text-cloud-dim">{trackPct}%</span>
                        </div>
                        <div className="mt-2"><XPBar value={trackPct} max={100} showLabel={false} /></div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {track.lessons.map((lesson, li) => {
                            const done = isLessonComplete(lesson.id);
                            return (
                              <div
                                key={lesson.id}
                                className={cn(
                                  "group flex items-center gap-3 rounded-2xl glass p-3 transition-all",
                                  done && "ring-1 ring-aurora-teal/20",
                                )}
                              >
                                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold", done ? "bg-aurora-teal/20 text-aurora-teal" : "bg-white/5 text-cloud-dim")}>
                                  {done ? <Icon name="star" className="h-3.5 w-3.5" /> : li + 1}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-semibold text-cloud">{lesson.title}</p>
                                  <p className="text-xs text-cloud-dim">{lesson.type} - {lesson.duration}</p>
                                </div>
                                {done ? (
                                  <span className="shrink-0 text-xs font-semibold text-aurora-teal">Done</span>
                                ) : (
                                  <button
                                    onClick={() => setActiveLesson({ lesson, track })}
                                    className="shrink-0 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet px-3 py-1 text-xs font-semibold text-night-950 transition-all hover:shadow-glow active:scale-95"
                                  >
                                    Start
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {tab === "class" && (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard index={0} icon={<Icon name="profile" className="h-5 w-5 text-aurora-sky" />} label="Students" value={allStudents.length} gradient="from-aurora-sky/20 to-aurora-teal/10" />
                <StatCard index={1} icon={<Icon name="academy" className="h-5 w-5 text-aurora-violet" />} label="Your lessons" value={`${lessonsDone}/${totalLessons}`} gradient="from-aurora-violet/20 to-aurora-bloom/10" />
                <StatCard index={2} icon={<Icon name="star" className="h-5 w-5 text-aurora-teal" />} label="Completion" value={`${lessonPct}%`} gradient="from-aurora-teal/20 to-aurora-leaf/10" />
                <StatCard index={3} icon={<Icon name="star" className="h-5 w-5 text-aurora-amber" />} label="Your level" value={level} gradient="from-aurora-amber/20 to-aurora-rose/10" />
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <h2 className="mb-3 font-display text-lg font-bold text-cloud">Students</h2>
                  <div className="space-y-2">
                    {allStudents.map((s, i) => {
                      const meta = statusMeta[s.status as keyof typeof statusMeta];
                      return (
                        <motion.div
                          key={s.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={cn("flex items-center gap-3 rounded-2xl glass p-3", (s as any).isYou && "ring-1 ring-aurora-teal/30")}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5">
                            <Icon name="profile" className="h-4 w-4 text-cloud-dim" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-cloud">
                                {s.name}
                                {(s as any).isYou && <span className="ml-2 text-[10px] text-aurora-teal">(you)</span>}
                              </p>
                              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", meta.bg, meta.color)}>{meta.label}</span>
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-cloud-dim">
                              <span>{s.xp.toLocaleString()} XP</span>
                              <span>-</span>
                              <span>{s.streak > 0 ? `${s.streak}d streak` : "No streak"}</span>
                            </div>
                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                              <div className="h-full rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet" style={{ width: `${s.progress}%` }} />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-4xl glass p-5">
                    <h3 className="mb-3 font-display text-base font-bold text-cloud">Class summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-cloud-muted">Total XP</span><span className="font-semibold text-cloud">{state.xp.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-cloud-muted">Lessons</span><span className="font-semibold text-cloud">{lessonsDone}</span></div>
                      <div className="flex justify-between"><span className="text-cloud-muted">Games</span><span className="font-semibold text-cloud">{gamesPlayed}</span></div>
                      <div className="flex justify-between"><span className="text-cloud-muted">Projects</span><span className="font-semibold text-cloud">{state.projects.length}</span></div>
                    </div>
                  </div>

                  <div className="rounded-4xl glass p-5">
                    <h3 className="mb-3 font-display text-base font-bold text-cloud">Skill mastery</h3>
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
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {activeLesson && (
          <LessonPlayer
            lesson={activeLesson.lesson}
            track={activeLesson.track}
            onClose={() => setActiveLesson(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
