"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";

const weeklyActivity = [
  { day: "Mon", minutes: 35 },
  { day: "Tue", minutes: 52 },
  { day: "Wed", minutes: 22 },
  { day: "Thu", minutes: 48 },
  { day: "Fri", minutes: 33 },
  { day: "Sat", minutes: 60 },
  { day: "Sun", minutes: 25 },
];

const milestones = [
  { emoji: "\u{1F9E0}", title: "Completed AI Foundations", date: "2 days ago", desc: "Maya finished the first curriculum track." },
  { emoji: "\u{1F4CA}", title: "Trained first classifier", date: "3 days ago", desc: "Built a cat vs dog classifier in the Arcade." },
  { emoji: "\u{1F6E0}\u{FE0F}", title: "Published first project", date: "5 days ago", desc: "Dino Tutor Bot is now in the Forge gallery." },
  { emoji: "\u{1F525}", title: "7-day learning streak", date: "Today", desc: "Maya has learned something every day for 12 days!" },
];

const strengths = [
  { name: "Curiosity", level: 92 },
  { name: "Problem solving", level: 78 },
  { name: "Creativity", level: 85 },
  { name: "Persistence", level: 70 },
];

const suggested = [
  { emoji: "\u{1F30D}", title: "Explore a new world", desc: "Neural Peaks is ready to unlock" },
  { emoji: "\u{1F3AE}", title: "Try a new mini-game", desc: "Bias Detective teaches fairness" },
  { emoji: "\u{1F916}", title: "Ask Somora AI a question", desc: "Great for curious minds" },
];

export default function HomePage() {
  const totalMin = weeklyActivity.reduce((s, d) => s + d.minutes, 0);
  const maxMin = Math.max(...weeklyActivity.map((d) => d.minutes));

  return (
    <div className="container-page py-10 lg:py-14">
      <SectionHeader
        eyebrow="Somora Home"
        title="Maya's learning journey"
        description="A window into your child's curiosity. See what they've learned, what they've built, and what to explore next."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-4xl glass-strong p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-cloud">This week</h2>
              <span className="text-sm text-cloud-dim">{Math.floor(totalMin / 60)}h {totalMin % 60}m total</span>
            </div>
            <div className="mt-6 flex items-end justify-between gap-3" style={{ height: 160 }}>
              {weeklyActivity.map((d, i) => (
                <div key={d.day} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(d.minutes / maxMin) * 120}px` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-aurora-sky/40 via-aurora-violet/60 to-aurora-bloom/80"
                  />
                  <span className="text-xs text-cloud-dim">{d.day}</span>
                  <span className="text-[10px] text-cloud-dim">{d.minutes}m</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-4xl glass p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-cloud">Recent milestones</h2>
            <div className="space-y-3">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-4 rounded-2xl bg-white/[0.03] p-4"
                >
                  <div className="text-2xl">{m.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-cloud">{m.title}</p>
                      <span className="text-xs text-cloud-dim">{m.date}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-cloud-muted">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center rounded-4xl glass-strong p-6">
            <ProgressRing value={65} size={130} strokeWidth={9}>
              <span className="font-display text-3xl font-bold text-cloud">65%</span>
              <span className="text-[10px] uppercase tracking-wider text-cloud-dim">Curriculum</span>
            </ProgressRing>
            <p className="mt-4 text-center text-sm text-cloud-muted">Maya is on track for her age group and progressing steadily.</p>
          </div>

          <div className="rounded-4xl glass p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-cloud">Strengths</h2>
            <div className="space-y-3">
              {strengths.map((s) => (
                <div key={s.name}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-cloud-muted">{s.name}</span>
                    <span className="font-semibold text-cloud">{s.level}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet" style={{ width: `${s.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl glass p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-cloud">Suggested activities</h2>
            <div className="space-y-3">
              {suggested.map((s) => (
                <div key={s.title} className="flex items-start gap-3 rounded-2xl bg-white/[0.03] p-3">
                  <div className="text-xl">{s.emoji}</div>
                  <div>
                    <p className="text-sm font-semibold text-cloud">{s.title}</p>
                    <p className="text-xs text-cloud-dim">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-4xl bg-gradient-to-br from-aurora-teal/15 via-aurora-violet/10 to-aurora-amber/10 p-6">
        <div className="pointer-events-none absolute inset-0 glass rounded-4xl" />
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-lg font-bold text-cloud">Weekly summary report</h2>
            <p className="mt-1 text-sm text-cloud-muted">Get a detailed PDF report of Maya&apos;s progress, strengths, and suggested next steps.</p>
          </div>
          <button className="rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet px-5 py-2.5 font-display font-semibold text-night-950 transition-all hover:shadow-glow hover:shadow-aurora-violet/40 active:scale-95">
            Send report
          </button>
        </div>
      </div>
    </div>
  );
}
