"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Icon, type IconName } from "@/components/icons/icon";
import { academyCourses, type AcademyVideo } from "@/config/curriculum";

export default function AcademyPage() {
  const { state, completeLesson, isLessonComplete } = useStore();
  const [activeVideo, setActiveVideo] = useState<AcademyVideo | null>(null);

  const totalVideos = academyCourses.reduce((s, c) => s + c.videos.length, 0);
  const watchedVideos = academyCourses.reduce(
    (s, c) => s + c.videos.filter((v) => isLessonComplete(v.id)).length,
    0,
  );

  if (activeVideo) {
    const course = academyCourses.find((c) => c.id === activeVideo.trackId);
    const allVideos = course?.videos ?? [];
    const currentIdx = allVideos.findIndex((v) => v.id === activeVideo.id);
    const nextVideo = currentIdx >= 0 && currentIdx < allVideos.length - 1 ? allVideos[currentIdx + 1] : null;
    const isWatched = isLessonComplete(activeVideo.id);

    return (
      <div className="container-page py-8 lg:py-12">
        <button
          onClick={() => setActiveVideo(null)}
          className="mb-4 flex items-center gap-2 text-sm font-semibold text-cloud-muted transition-colors hover:text-cloud"
        >
          <Icon name="arrow-right" className="h-4 w-4 rotate-180" />
          Back to courses
        </button>

        <div className="overflow-hidden rounded-4xl glass-strong">
          {/* Video player */}
          <div className="aspect-video w-full bg-black">
            <iframe
              src={activeVideo.videoUrl}
              title={activeVideo.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Video info */}
          <div className="p-6">
            <h2 className="font-display text-xl font-bold text-cloud">{activeVideo.title}</h2>
            <p className="mt-1 text-sm text-cloud-muted">{activeVideo.description}</p>
            <div className="mt-2 flex items-center gap-3 text-xs text-cloud-dim">
              <span>{activeVideo.duration}</span>
              <span>-</span>
              <span>{course?.title}</span>
            </div>

            <div className="mt-4 flex gap-3">
              {!isWatched ? (
                <button
                  onClick={() => {
                    completeLesson(activeVideo.id, 50);
                  }}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet px-5 py-2.5 text-sm font-bold text-night-950 transition-all hover:shadow-glow active:scale-95"
                >
                  <Icon name="star" className="h-4 w-4" />
                  Mark as watched (+50 XP)
                </button>
              ) : (
                <span className="flex items-center gap-2 rounded-full bg-aurora-teal/15 px-4 py-2 text-sm font-bold text-aurora-teal">
                  <Icon name="star" className="h-4 w-4" />
                  Watched!
                </span>
              )}
              {nextVideo && (
                <button
                  onClick={() => setActiveVideo(nextVideo)}
                  className="flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 text-sm font-bold text-cloud-muted ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-cloud"
                >
                  Next video
                  <Icon name="arrow-right" className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8 lg:py-12">
      <h1 className="font-display text-2xl font-bold text-cloud sm:text-3xl">Academy</h1>
      <p className="mt-1 text-sm text-cloud-dim">Watch videos and learn AI step by step!</p>

      {/* Progress bar */}
      <div className="mt-6 max-w-md rounded-2xl glass p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-cloud-muted">Your progress</span>
          <span className="font-semibold text-cloud">{watchedVideos}/{totalVideos} videos</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet transition-all duration-500"
            style={{ width: `${totalVideos > 0 ? (watchedVideos / totalVideos) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Course list */}
      <div className="mt-8 space-y-6">
        {academyCourses.map((course, ci) => {
          const watched = course.videos.filter((v) => isLessonComplete(v.id)).length;
          const pct = Math.round((watched / course.videos.length) * 100);

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.05 }}
              className="overflow-hidden rounded-4xl glass-strong"
            >
              {/* Course header */}
              <div className="relative p-5">
                <div className={cn("absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-15 blur-3xl", course.gradient)} />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br", course.gradient)}>
                      <Icon name={course.icon as IconName} className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-bold text-cloud">{course.title}</h2>
                      <p className="text-xs text-cloud-dim">{course.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-bold text-cloud">{pct}%</p>
                    <p className="text-[10px] text-cloud-dim">{watched}/{course.videos.length}</p>
                  </div>
                </div>
                <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", course.gradient)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Video list */}
              <div className="divide-y divide-white/5">
                {course.videos.map((video, vi) => {
                  const watched = isLessonComplete(video.id);
                  return (
                    <button
                      key={video.id}
                      onClick={() => setActiveVideo(video)}
                      className="group flex w-full items-center gap-4 p-4 text-left transition-all hover:bg-white/[0.03]"
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                          watched ? "bg-aurora-teal/20 text-aurora-teal" : "bg-white/5 text-cloud-dim",
                        )}
                      >
                        {watched ? <Icon name="star" className="h-4 w-4" /> : vi + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn("truncate text-sm font-semibold", watched ? "text-cloud" : "text-cloud-muted")}>
                          {video.title}
                        </p>
                        <p className="truncate text-xs text-cloud-dim">{video.description}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-xs text-cloud-dim">{video.duration}</span>
                        <Icon name="play" className="h-4 w-4 text-cloud-dim transition-colors group-hover:text-cloud" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
