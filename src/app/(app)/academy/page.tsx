"use client";

import { motion } from "framer-motion";
import { curriculumTracks } from "@/config/curriculum";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { LessonCard } from "@/components/ui/lesson-card";
import { XPBar } from "@/components/ui/xp-bar";

export default function AcademyPage() {
  const totalLessons = curriculumTracks.reduce((sum, t) => sum + t.lessons.length, 0);
  const doneLessons = curriculumTracks.reduce((sum, t) => sum + t.lessons.filter((l) => l.done).length, 0);

  return (
    <div className="container-page py-10 lg:py-14">
      <SectionHeader
        eyebrow="Somora Academy"
        title="The AI curriculum"
        description="Structured learning tracks that wrap every concept in story, animation, interaction, play, and creative challenges."
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
        {curriculumTracks.map((track, ti) => (
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
                  <p className="font-display text-2xl font-bold text-cloud">{track.progress}%</p>
                  <p className="text-xs text-cloud-dim">{track.lessons.filter((l) => l.done).length}/{track.lessons.length} done</p>
                </div>
              </div>

              <div className="mt-4">
                <XPBar value={track.progress} max={100} showLabel={false} />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {track.lessons.map((lesson, li) => (
                  <LessonCard key={lesson.id} lesson={lesson} index={li} />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
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
      </div>
    </div>
  );
}
