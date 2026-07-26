"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { curriculumTracks } from "@/config/curriculum";
import type { Lesson, CurriculumTrack } from "@/config/curriculum";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { SectionHeader } from "@/components/ui/section-header";
import { XPBar } from "@/components/ui/xp-bar";
import { Icon } from "@/components/icons/icon";
import { LessonPlayer } from "@/components/lessons/lesson-player";

export default function AcademyPage() {
  const { isLessonComplete } = useStore();
  const [activeLesson, setActiveLesson] = useState<{ lesson: Lesson; track: CurriculumTrack } | null>(null);

  const totalLessons = curriculumTracks.reduce((sum, t) => sum + t.lessons.length, 0);
  const doneLessons = curriculumTracks.reduce(
    (sum, t) => sum + t.lessons.filter((l) => isLessonComplete(l.id)).length,
    0,
  );

  return (
    <div className="container-page py-10 lg:py-14">
      <SectionHeader
        eyebrow="Somora Academy"
        title="The AI curriculum"
        description="Complete lessons to earn XP. Every lesson has real content — stories, quizzes, interactives, and challenges."
        center
      />

      <div className="mx-auto mt-6 max-w-md rounded-3xl glass p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-cloud-muted">Overall progress</span>
          <span className="font-semibold text-cloud">{doneLessons}/{totalLessons} lessons</span>
        </div>
        <XPBar value={doneLessons} max={totalLessons} showLabel={false} />
      </div>

      <div className="mt-10 space-y-6">
        {curriculumTracks.map((track, ti) => {
          const trackDone = track.lessons.filter((l) => isLessonComplete(l.id)).length;
          const trackPct = Math.round((trackDone / track.lessons.length) * 100);

          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-4xl glass p-6 lg:p-8"
            >
              <div className={cn("absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-15 blur-3xl", track.gradient)} />
              <div className="relative">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl shadow-glow", track.gradient)}>
                      <span aria-hidden="true">{track.emoji}</span>
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold text-cloud">{track.title}</h2>
                      <p className="text-sm text-cloud-muted">{track.description}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-display text-2xl font-bold text-cloud">{trackPct}%</p>
                    <p className="text-xs text-cloud-dim">{trackDone}/{track.lessons.length} done</p>
                  </div>
                </div>

                <div className="mt-4">
                  <XPBar value={trackPct} max={100} showLabel={false} />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {track.lessons.map((lesson, li) => {
                    const done = isLessonComplete(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        className={cn(
                          "group flex items-center gap-4 rounded-2xl glass p-4 transition-all duration-200",
                          done && "ring-1 ring-aurora-teal/20",
                        )}
                      >
                        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold", done ? "bg-aurora-teal/20 text-aurora-teal ring-1 ring-aurora-teal/30" : "bg-white/5 text-cloud-dim ring-1 ring-white/10")}>
                          {done ? <Icon name="star" className="h-4 w-4" /> : li + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-cloud">{lesson.title}</p>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-cloud-dim">
                            <span className="capitalize">{lesson.type}</span>
                            <span>{"\u00B7"}</span>
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                        {done ? (
                          <span className="shrink-0 text-xs font-semibold text-aurora-teal">Done</span>
                        ) : (
                          <button
                            onClick={() => setActiveLesson({ lesson, track })}
                            className="shrink-0 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet px-3 py-1.5 text-xs font-semibold text-night-950 transition-all hover:shadow-glow hover:shadow-aurora-violet/40 active:scale-95"
                          >
                            Start
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 rounded-4xl glass-strong p-6 text-center">
        <p className="font-display text-lg font-semibold text-cloud">Every lesson follows the same rhythm</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {["Story", "Animation", "Interactive", "Mini-game", "Quiz", "Challenge", "Reflection", "Reward"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-cloud ring-1 ring-white/10">{step}</span>
              {i < 7 && <span className="text-cloud-dim">{"\u2192"}</span>}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-cloud-dim">Completing a lesson awards 80 XP and 20 coins</p>
      </div>

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
