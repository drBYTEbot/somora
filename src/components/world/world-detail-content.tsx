"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons/icon";
import { useStore } from "@/lib/store";
import type { SomoraWorld } from "@/config/worlds";

interface WorldLesson {
  title: string;
  type: string;
  duration: string;
}

export function WorldDetailContent({
  world,
  story,
  lessons,
  activity,
}: {
  world: SomoraWorld;
  story: string;
  lessons: WorldLesson[];
  activity: string;
}) {
  const { isLessonComplete, completeLesson, isWorldUnlocked } = useStore();
  const locked = !isWorldUnlocked(world.id);

  if (locked) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-lg rounded-5xl glass-strong p-10 text-center">
          <div className={cn("mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br text-4xl opacity-50 grayscale shadow-glow-lg", world.gradient, world.glow)}>
            <span aria-hidden="true">{world.emoji}</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-cloud">{world.name}</h1>
          <p className="mt-2 text-cloud-muted">{world.blurb}</p>
          <div className="mx-auto my-6 flex max-w-xs items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm text-cloud-dim">
            <Icon name="lock" className="h-4 w-4 shrink-0" />
            Complete the previous worlds to unlock this one.
          </div>
          <Button href="/universe" variant="outline">Back to the map</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 lg:py-14">
      <Link href="/universe" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-cloud-dim transition-colors hover:text-cloud">
        <span aria-hidden="true">&larr;</span> Back to Universe
      </Link>

      <div className="relative overflow-hidden rounded-5xl glass-strong p-8 lg:p-12">
        <div className={cn("absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br opacity-25 blur-3xl", world.gradient)} />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className={cn("flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br text-5xl shadow-glow-lg", world.gradient, world.glow)}>
            <span aria-hidden="true">{world.emoji}</span>
          </div>
          <div>
            <p className={cn("text-sm font-semibold uppercase tracking-wider", world.text)}>{world.topic}</p>
            <h1 className="font-display text-4xl font-bold text-cloud sm:text-5xl">{world.name}</h1>
            <p className="mt-2 text-cloud-muted">{world.blurb}</p>
          </div>
        </div>
        <div className="relative mt-8 rounded-3xl bg-night-950/40 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-cloud-dim">Your story so far</p>
          <p className="mt-2 leading-relaxed text-cloud">{story}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-display text-2xl font-bold text-cloud">Lessons in this world</h2>
          <div className="space-y-3">
            {lessons.map((lesson, i) => {
              const lessonId = `${world.id}-lesson-${i}`;
              const done = isLessonComplete(lessonId);
              return (
                <div key={lesson.title} className="group flex items-center gap-4 rounded-2xl glass p-4 transition-all duration-200 hover:bg-white/[0.06]">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold", done ? "bg-aurora-teal/20 text-aurora-teal ring-1 ring-aurora-teal/30" : "bg-white/5 text-cloud-dim ring-1 ring-white/10")}>
                    {done ? <Icon name="star" className="h-4 w-4" /> : i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-cloud">{lesson.title}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-cloud-dim">
                      <span>{lesson.type}</span>
                      <span>{"\u00B7"}</span>
                      <span>{lesson.duration}</span>
                    </div>
                  </div>
                  {done ? (
                    <span className="shrink-0 text-xs font-semibold text-aurora-teal">Done</span>
                  ) : (
                    <button
                      onClick={() => completeLesson(lessonId, 80)}
                      className="shrink-0 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet px-3 py-1.5 text-xs font-semibold text-night-950 transition-all hover:shadow-glow hover:shadow-aurora-violet/40 active:scale-95"
                    >
                      Complete
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl glass p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-cloud-dim">Today&apos;s activity</p>
            <p className="mt-2 leading-relaxed text-cloud">{activity}</p>
            <Button href="/academy" className="mt-4 w-full">Start lesson</Button>
          </div>
          <div className="rounded-3xl glass p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-cloud-dim">Rewards</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-aurora-amber/15 px-3 py-1 text-xs font-semibold text-aurora-amber">+120 XP</span>
              <span className="rounded-full bg-aurora-violet/15 px-3 py-1 text-xs font-semibold text-aurora-violet">+50 Coins</span>
              <span className="rounded-full bg-aurora-teal/15 px-3 py-1 text-xs font-semibold text-aurora-teal">1 Gem</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
